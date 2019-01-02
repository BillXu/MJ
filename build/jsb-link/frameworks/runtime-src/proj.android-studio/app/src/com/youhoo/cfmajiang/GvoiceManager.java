package com.youhoo.cfmajiang;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import com.tencent.gcloud.voice.GCloudVoiceEngine;
import com.tencent.gcloud.voice.GCloudVoiceErrno;
import com.tencent.gcloud.voice.IGCloudVoiceNotify;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Timer;
import java.util.TimerTask;

import static android.content.ContentValues.TAG;

/**
 * Created by Lilac on 2018/8/28
 *
 * @company tencent
 * @email lilacouyang@tencent.com
 * <p>
 * GCloudVoice 管理类，建议将 GCloudVoice 的初始化工作和回调实现交由一个全局管理类统一管理
 * <p>
 * GCloudVoice SDK 的说明请参考线上文档：
 * For 非腾讯员工：http://gcloud.qq.com/document/5923b83582fb561c1b3024b5
 * For 腾讯员工：http://gcloud.oa.com/document/cate/5742665c23634838086c8106
 * <p>
 * GCloudVoice SDK 官方网站：
 * For 非腾讯员工：http://gcloud.qq.com/product/6
 * For 腾讯员工：http://gcloud.oa.com/product/6
 */

public class GvoiceManager implements IGCloudVoiceNotify {

    private static GCloudVoiceEngine mVoiceEngine = null;
    private boolean bEngineInit = false;     // 是否已经初始化
    private volatile static GvoiceManager gvoiceManager = null;
    private String mRecordingPath;
    private boolean isAppliedKey = false;
    private  Timer timer = null;

    /**
     * GCloudVoice 初始化时需要使用到的参数
     */
    private Context mContext;
    private Cocos2dxActivity mActivity;

    private GvoiceManager() {
        bEngineInit = false;
    }

    // 单例
    public static GvoiceManager getInstance() {
        if (gvoiceManager == null) {
            synchronized (GvoiceManager.class) {
                if (gvoiceManager == null) {
                    gvoiceManager = new GvoiceManager();
                }
            }
        }
        return gvoiceManager;
    }

    /**
     * <p>
     * 注意！使用引擎前必须先按如下步骤完成引擎的初始化工作
     *
     * @param activity
     * @return 0:初始化成功  负值：当前application定义的错误 正值：GCloudVoiceErrno 错误码
     */
    public int bindActivity(Cocos2dxActivity activity) {
        int ret = 0;
        String logStr;
        if (activity == null) {
            logStr = "Activity 不能为空!";
            System.out.println(logStr);
            return -1;
        }
        mActivity = activity;
        mContext = activity.getApplicationContext();
        System.loadLibrary("GCloudVoice");
        return ret;
    }

    public GCloudVoiceEngine getVoiceEngine() {
        return mVoiceEngine;
    }

    public boolean isEngineInit() {
        return bEngineInit;
    }


    // js interface
    public int initWithPlayer( String appID , String appKey, String playerTag )
    {
        int ret = 0;
        String logStr;
        if (!bEngineInit) {
            /**
             * Step1:获取 GCloudVoice 引擎实例
             */
            mVoiceEngine = GCloudVoiceEngine.getInstance();
            if (mVoiceEngine == null) {
                logStr = "GCloudVoiceEngine 获取失败";
                Log.d("a",logStr);
                ret = GCloudVoiceErrno.GCLOUD_VOICE_ENGINE_ERR;
                return ret;
            } else {
                logStr = "GCloudVoiceEngine 获取成功" ;
                Log.d("a",logStr);
            }

            /**
             * Step2:添加上下文信息
             */
            mVoiceEngine.init(mContext, mActivity);

            /**
             * Step3:设置基本业务信息
             */
            ret = mVoiceEngine.SetAppInfo(appID, appKey, playerTag );
            if (ret != 0) {
                logStr = "SetAppInfo 遇到错误，Error code: " + ret;
                Log.d("a",logStr);
                return ret;
            } else {
                logStr = "SetAppInfo 成功";
                Log.d("a",logStr);
            }

            /**
             * Step4:初始化引擎
             */
            ret = mVoiceEngine.Init();
            if (ret != 0) {
                logStr = "GCloudVoiceEngine 初始化遇到错误，Error code: " + ret;
                Log.d("a",logStr);
                return ret;
            } else {
                logStr = "GCloudVoiceEngine 初始化成功";
                Log.d("a",logStr);
            }

            ret = mVoiceEngine.SetMode(GCloudVoiceEngine.Mode.Messages);
            if (ret == GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
                logStr = "GVoice已成功设置为离线消息模式!";
                Log.d("a",logStr);
            } else {
                logStr = "设置GVoice为离线消息模式遇到错误!\n Error code: " + ret;
                Log.d("a",logStr);
                return ret;
            }
            mVoiceEngine.SetNotify(this);
            mVoiceEngine.ApplyMessageKey(10000);
            TimerTask pollTask = new TimerTask() {

                @Override
                public void run() {
                    mVoiceEngine.Poll();
                }
            };

            timer = new Timer();
            timer.schedule(pollTask, 500, 100);
            bEngineInit = true;
        }
        return ret;
    }

    public static int JSinitWithPlayer( String appID , String appKey, String playerTag )
    {
        System.out.println("System JSinitWithPlayer");
        Log.d("23","JSinitWithPlayer log") ;
       return GvoiceManager.getInstance().initWithPlayer(appID,appKey,playerTag) ;
    }

    public int startRecord( String strFileName )
    {
        int ret = mVoiceEngine.StartRecording(strFileName);
        if (ret == GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
            System.out.println("录音开始...");
            mRecordingPath = strFileName ;
        } else {
            System.out.println("未能成功开始录音 \tError code: " + ret);
        }
        return ret ;
    }

    public static int JSstartRecord( String strFileName )
    {
        return GvoiceManager.getInstance().startRecord(strFileName) ;
    }

    public int stopRecord( boolean isUpload , int msUploadTimeout )
    {
        int ret = mVoiceEngine.StopRecording();
        if (ret == GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
            Log.d("a","录音停止");
        } else {
            System.out.println("未能成功停止录音 \tError code: " + ret);
            return  ret ;
        }

        if ( isUpload == false )
        {
            Log.d("a","js tell not upload file");
            return  0 ;
        }

        ret = mVoiceEngine.UploadRecordedFile(mRecordingPath, msUploadTimeout);
        if (ret == GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
            Log.d("a","正在上传录音文件，上传结果通过回调方法OnUploadFile通知");
        } else {
            Log.d("a","录音文件未能成功上传 \tError code: " + ret);
        }
        return ret ;
    }
    public static int JSstopRecord( boolean isUpload , int msUploadTimeout )
    {
        return GvoiceManager.getInstance().stopRecord(isUpload,msUploadTimeout) ;
    }

    public int downLoadFile( String strFileName, String path , int msTimeout )
    {
        String msgStr = "" ;
        if (strFileName == null || strFileName.length() == 0) {
            msgStr = "FileID 为空，请先设置FileID，或先通过\"录音功能页面\"录制一段音频";
            System.out.println(msgStr);
        } else {
            int ret = mVoiceEngine.DownloadRecordedFile(strFileName, path + strFileName, msTimeout);
            if (ret == GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
                msgStr = "正在下载录音文件...";
            } else {
                msgStr = "下载录音文件遇到错误 \tError code: " + ret + "paht : " + path + "   file = " + strFileName;
            }
            Log.d(TAG, msgStr);
            return  ret;
        }
        return  0;
    }

    public static  int JSdownLoadFile( String strFileName, String path , int msTimeout )
    {
        return GvoiceManager.getInstance().downLoadFile(strFileName,path,msTimeout) ;
    }
    public int playFile( String pathFile )
    {
        int ret = mVoiceEngine.PlayRecordedFile(pathFile);
        if (ret == GCloudVoiceErrno.GCLOUD_VOICE_SUCC) {
            Log.d(TAG, "开始播放录音文件...: ");
        } else {
            System.out.println("播放录音文件遇到错误 \tError code: " + ret);
        }
        return ret ;
    }

    public static  int JSplayFile( String pathFile )
    {
        return GvoiceManager.getInstance().playFile(pathFile) ;
    }

//    public static  void JSupdate()
//    {
//        if ( GvoiceManager.getInstance().isEngineInit() )
//        {
//            GvoiceManager.getInstance().getVoiceEngine().Poll();
//        }
//    }
    // ontify interface
    /**
     * 上传语音文件后的结果通过该函数进行回调
     *
     * @param completeCode:参见IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     * @param filePath:上传的文件路径
     * @param fileID:文件的ID   注意！该 ID 是音频文件的唯一标识符，下载音频文件时需要提供该标识符
     */
    @Override
    public void OnUploadFile(int completeCode, String filePath, String fileID) {
        String msg;
        if (completeCode == GCloudVoiceCompleteCode.GV_ON_UPLOAD_RECORD_DONE) {
            msg = "UploadFile 成功\t" +
                    "File path: " + filePath + "\t" +
                    "File ID: " + fileID + "\t";
        } else {
            msg = "UploadFile 遇到错误\t" +
                    "Code: " + completeCode + "\t" +
                    "File path: " + filePath + "\t" +
                    "File ID: " + fileID + "\t";
        }
        Log.d("OnUploadFile", msg);

        JSONObject jsObj = new JSONObject();
        try {
            jsObj.put("code",completeCode);
            jsObj.put("fileName",fileID);
            jsObj.put("isOk",completeCode == GCloudVoiceCompleteCode.GV_ON_UPLOAD_RECORD_DONE );
        }
        catch ( JSONException je )
        {
            System.out.println( "json exception = " + je.getMessage() );
        }
        sendJsEvent("VOICE_EVENT_UPLOAED",jsObj );
    }

    /**
     * 下载语音文件后的结果通过该函数进行回调
     *
     * @param completeCode:参见IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     * @param filePath:上传的文件路径
     * @param fileID:需要下载的文件的ID，该ID在OnUploadFile回调中提供
     */
    @Override
    public void OnDownloadFile(int completeCode, String filePath, String fileID) {
        String msg;
        if (completeCode == GCloudVoiceCompleteCode.GV_ON_DOWNLOAD_RECORD_DONE) {
            msg = "DownloadFile 成功\t" +
                    "File path: " + filePath + "\t" +
                    "File ID: " + fileID + "\t";


        } else {
            msg = "DownloadFile 失败\t" +
                    "Code: " + completeCode + "\t" +
                    "File path: " + filePath + "\t" +
                    "File ID: " + fileID + "\t";
        }
        Log.d( "OnDownloadFile", msg);
        JSONObject jsObj = new JSONObject();
        try {
            jsObj.put("code",completeCode);
            jsObj.put("fileName",fileID) ;
        }
        catch ( JSONException je )
        {
            System.out.println( "json exception = " + je.getMessage() );
        }
        sendJsEvent("VOICE_EVENT_DOWNLOADED",jsObj );
        Log.d(TAG, "OnDownloadFile: 只是为了停止录音的log");
        stopRecord(false,3000) ; // just test
    }

    /**
     * 如果用户没有暂停播放，而语音文件已经播放完了，通过该回调函数进行通知
     *
     * @param completeCode:参见  IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     * @param filePath:播放的文件路径
     */
    @Override
    public void OnPlayRecordedFile(int completeCode, String filePath) {
        String msg = "OnPlayRecordedFile: \t" +
                "Code: " + completeCode + "\t" +
                "File path: " + filePath + "\t";
        Log.d(TAG, "OnPlayRecordedFile: " + msg );
        if (completeCode == GCloudVoiceCompleteCode.GV_ON_PLAYFILE_DONE) {

        }

        JSONObject jsObj = new JSONObject();
        try {
            jsObj.put("code",completeCode);
            jsObj.put("fileName",filePath) ;
        }
        catch ( JSONException je )
        {
            System.out.println( "json exception = " + je.getMessage() );
        }
        sendJsEvent("VOICE_EVENT_PLAY_FINISH",jsObj );
    }

    /**
     * 请求语音消息许可的时候会回调
     *
     * @param completeCode:参见 IGCloudVoiceNotify.GCloudVoiceCompleteCode 定义
     */
    @Override
    public void OnApplyMessageKey(int completeCode) {
        String msg;
        if (completeCode == GCloudVoiceCompleteCode.GV_ON_MESSAGE_KEY_APPLIED_SUCC) {
            isAppliedKey = true ;
            msg = "OnApplyMessageKey 成功";
        } else {
            msg = "OnApplyMessageKey 遇到错误\t"
                    + "Code: " + completeCode + "\t";
        }
        Log.d("OnApplyMessageKey", msg);
        JSONObject jsObj = new JSONObject();
        try {
            jsObj.put("code",completeCode);
        }
        catch ( JSONException je )
        {
            System.out.println( "json exception = " + je.getMessage() );
        }
        sendJsEvent("VOICE_EVENT_APPLY_KEY", jsObj );

    }

//    private void sendJsEvent( final String eventID , final String strDetail )
//    {
//        mActivity.runOnGLThread(new Runnable() {
//            @Override
//            public void run() {
//                String js = "sdkSendEvent(\" " + eventID + "\"," + strDetail + ");" ;
//                //String js = "sdkSendEvent(" + eventID + "," + strDetail + ");" ;
//                Log.d("sendJsEvent", js);
//                Cocos2dxJavascriptJavaBridge.evalString( js ) ;
//            }
//        });
//    }

    private void sendJsEvent( final String eventID , JSONObject jsDetail )
    {
        final String strDetail = jsDetail.toString();
        mActivity.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                String js = "sdkSendEvent(\"" + eventID + "\"," + strDetail + ");" ;
                //String js = "sdkSendEvent(" + eventID + "," + strDetail + ");" ;
                Log.d("sendJsEvent", js);
                Cocos2dxJavascriptJavaBridge.evalString( js ) ;
            }
        });
    }
    // not used callback
    @Override
    public void OnJoinRoom(int var1, String var2, int var3){}

    @Override
    public void OnStatusUpdate(int var1, String var2, int var3){}

    @Override
    public void OnQuitRoom(int var1, String var2){}
    @Override
    public void OnMemberVoice(int[] var1, int var2){}
    @Override
    public void OnMemberVoice(String var1, int var2, int var3){}
    @Override
    public void OnSpeechToText(int var1, String var2, String var3){}
    @Override
    public void OnRecording(char[] var1, int var2){}
    @Override
    public void OnStreamSpeechToText(int var1, int var2, String var3, String var4){}
    @Override
    public void OnRoleChanged(int var1, String var2, int var3, int var4){}
    @Override
    public void OnEvent(int var1, String var2){}
}
