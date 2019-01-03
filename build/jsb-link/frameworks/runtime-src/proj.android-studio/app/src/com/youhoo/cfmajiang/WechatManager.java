package com.youhoo.cfmajiang;

import android.content.Context;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXTextObject;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.youhoo.cfmajiang.wxapi.WXEntryActivity;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import static android.content.ContentValues.TAG;

public class WechatManager implements IWXAPIEventHandler {

    private volatile static WechatManager wchatMgr = null;
    private Context mContext;
    private Cocos2dxActivity mActivity;

    private IWXAPI mApi = null ;
    private  String mAppID = "" ;

    public static WechatManager getInstance() {
        if (wchatMgr == null) {
            synchronized (GPSManager.class) {
                if (wchatMgr == null) {
                    wchatMgr = new WechatManager();
                }
            }
        }
        return wchatMgr;
    }

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
        return ret;
    }

    public void sendJsEvent( final String eventID , JSONObject jsDetail )
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

    // js interface
    void init( String appID )
    {
        if ( mApi != null )
        {
            Log.e("WXEntryActivity", "init: already register wx api" );
            return;
        }
        mAppID = appID ;
        mApi = WXAPIFactory.createWXAPI(mContext, appID, true);
        mApi.registerApp(appID);

    }

    static  void JSinit( String appID )
    {
        WechatManager.getInstance().init(appID);
    }

    void reqAuthor()
    {
        // send oauth request
        final SendAuth.Req req = new SendAuth.Req();
        req.openId = mAppID;
        req.scope = "snsapi_userinfo";
        req.state = "wechat_mj";
        mApi.sendReq(req);
    }

    public IWXAPI getAPI()
    {
        return mApi;
    }


    static void JSreqAuthor()
    {
        WechatManager.getInstance().reqAuthor();
    }

    public void onNewIntent(Intent intent)
    {
        if ( intent == null )
        {
            Log.d(TAG, "onNewIntent: 参数为空");
            return;
        }
        
        if ( mApi == null )
        {
            Log.d(TAG, "onNewIntent: api 对象为空");
            return;
        }
        mApi.handleIntent(intent,this);
    }

    public boolean shareLinkToWeChat(String link, String title, String desc, int type,String actTag )
    {
        WXWebpageObject webpage = new WXWebpageObject();
        webpage.webpageUrl = link;
        WXMediaMessage msg = new WXMediaMessage(webpage);
        msg.title = title;
        msg.description = desc;
        //图片<32k
        InputStream stream = mActivity.getResources().openRawResource(R.mipmap.ic_launcher);
        Bitmap bitmap = BitmapFactory.decodeStream(stream);
        msg.thumbData = bmpToByteArray(bitmap, true);
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = actTag;
        req.message = msg;
        if (type == 1)
        {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }else
        {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        }
        return mApi.sendReq(req);
    }

    static  boolean JSshareLinkToWechat( String link, int type, String title, String desc,String actTag )
    {
        return WechatManager.getInstance().shareLinkToWeChat(link,title,desc,type,actTag) ;
    }
    //type:1 好友 2 朋友圈
    public boolean shareTextToWeChat( String content_txt, int type, String title,String actTag )
    {

        WXTextObject textObj = new WXTextObject();
        textObj.text = content_txt;

        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = textObj;
        msg.description = content_txt;
        msg.title = title;

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = actTag;
        req.message = msg;
        if (type == 1)
        {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }else
        {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        }

        return mApi.sendReq(req);
    }

    static  boolean JSshareTextToWechat( String content_txt, int type, String title ,String actTag )
    {
        return  WechatManager.getInstance().shareTextToWeChat(content_txt,type,title,actTag) ;
    }
    //type:1 好友 2 朋友圈
    public boolean shareImageToWeChat(String pathFile, int type,String actTag )
    {
        String full_img_path = pathFile;
        WXImageObject imageObject = new WXImageObject();

        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        Bitmap tmp = BitmapFactory.decodeFile(full_img_path);
        Bitmap thBitmap = Bitmap.createScaledBitmap(tmp, 768, 432, true);
        imageObject.imageData = bmpToByteArray(thBitmap, true);
        WXMediaMessage msg = new WXMediaMessage(imageObject);
        // 缩略图 < 32k 不然拉取不了微信客户端
        Bitmap mini_bmp = Bitmap.createScaledBitmap(tmp, 160, 90, true);
        msg.thumbData = bitmap2BytesMini(mini_bmp, 30);
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = actTag;
        req.message = msg;
        if (type == 1)
        {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }else
        {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        }
        return mApi.sendReq(req);
    }

    static  boolean JSshareImageToWeChat( String pathFile, int type,String actTag )
    {
        return WechatManager.getInstance().shareImageToWeChat(pathFile,type,actTag) ;
    }

    public byte[] bmpToByteArray(final Bitmap bmp, final boolean needRecycle) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.PNG, 100, output);
        if (needRecycle) {
            bmp.recycle();
        }

        byte[] result = output.toByteArray();
        try {
            output.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    public byte[] bitmap2BytesMini(Bitmap bitmap, int maxkb) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, output);
        int options = 100;
        while (output.toByteArray().length > maxkb&& options != 10) {
            output.reset();
            bitmap.compress(Bitmap.CompressFormat.JPEG, options, output);
            options -= 10;
        }
        bitmap.recycle();
        return output.toByteArray();
    }

    // call back
    public void onReq(BaseReq var1)
    {
        Log.d("b", "onReq: onReq 响应");
    }

    public void onResp(BaseResp var1)
    {
        Log.d("a", "onNewIntent: onResp 响应 type = " + var1.getType());
        int type = var1.getType();
        switch(type) {
            case ConstantsAPI.COMMAND_SENDAUTH:     //授权返回
                onAuthCallback((SendAuth.Resp)var1);
                break;
            case ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX:        //分享返回
                onShareCallback((SendMessageToWX.Resp)var1);
                break;
            default:
                Log.d("onResp", "onResp: unknown type : " + var1.getType());
        }
    }

    protected  void onAuthCallback( SendAuth.Resp resp )
    {
        JSONObject jsObj = new JSONObject();
        try {
            jsObj.put("errorCode",resp.errCode );
            if ( 0 == resp.errCode )
            {
                Log.d("onResp", "onResp: 获取授权码成功 = " + resp.code);
                jsObj.put("code",resp.code ) ;
            }
            else
            {
                Log.e("onResp", "onResp: 获取授权码失败：" + resp.errStr + "errorcode = " + resp.errCode );
            }
        }
        catch ( JSONException je )
        {
            System.out.println( "json exception = " + je.getMessage() );
        }

        this.sendJsEvent("EVENT_WECHAT_CODE", jsObj );
    }

    protected  void onShareCallback( SendMessageToWX.Resp resp )
    {
        Log.d("onResp", "onResp: transaction : " + resp.transaction + " error code = " + resp.errCode + " error str = " + resp.errStr  );
        JSONObject jsObj = new JSONObject();
        try {
            jsObj.put("errorCode",resp.errCode );
            jsObj.put( "isOk",BaseResp.ErrCode.ERR_OK == resp.errCode ? 1 : 0 );
            jsObj.put( "actionTag",resp.transaction ) ;
        }
        catch ( JSONException je )
        {
            System.out.println( "json exception = " + je.getMessage() );
        }
        this.sendJsEvent("EVENT_WECHAT_SHARE_RESULT", jsObj );
    }
}
