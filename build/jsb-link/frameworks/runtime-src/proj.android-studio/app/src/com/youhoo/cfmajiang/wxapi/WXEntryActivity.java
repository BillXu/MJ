package com.youhoo.cfmajiang.wxapi;

import android.app.Activity;
import android.content.Intent;

import android.os.Bundle;
import android.util.Log;

import com.cocos.analytics.CAAgent;
import com.youhoo.cfmajiang.GPSManager;
import com.youhoo.cfmajiang.GvoiceManager;
import com.youhoo.cfmajiang.WechatManager;


import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.json.JSONException;
import org.json.JSONObject;

import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;

import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;

import static android.content.ContentValues.TAG;


public class WXEntryActivity extends Cocos2dxActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW

        org.cocos2dx.javascript.SDKWrapper.getInstance().init(this);
        CAAgent.enableDebug(false);
        GvoiceManager.getInstance().bindActivity(this);
        GPSManager.getInstance().bindActivity(this) ;
        WechatManager.getInstance().bindActivity(this) ;
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Log.d("ceshi 一些", "onNewIntent: 这里获得intent");
        WechatManager.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        org.cocos2dx.javascript.SDKWrapper.getInstance().onDestroy();
        if (CAAgent.isInited())
            CAAgent.onDestroy();
    }

    @Override
    protected void onPause() {
        super.onPause();
        org.cocos2dx.javascript.SDKWrapper.getInstance().onPause();
        if (CAAgent.isInited())
            CAAgent.onPause(this);
        if ( GvoiceManager.getInstance().isEngineInit() )
        {
            GvoiceManager.getInstance().getVoiceEngine().Pause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        //SDKWrapper.getInstance().onResume();
        if (CAAgent.isInited())
            CAAgent.onResume(this);
        if ( GvoiceManager.getInstance().isEngineInit() )
        {
            GvoiceManager.getInstance().getVoiceEngine().Resume();
        }
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        org.cocos2dx.javascript.SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView);

        return glSurfaceView;
    }
//    // call back
//    public void onReq(BaseReq var1)
//    {
//        Log.d("b", "onNewIntent: onReq 响应");
//    }
//
//    public void onResp(BaseResp var1)
//    {
//        Log.d("a", "onNewIntent: onResp 响应");
//        SendAuth.Resp resp = (SendAuth.Resp)var1 ;
//        JSONObject jsObj = new JSONObject();
//        try {
//            jsObj.put("errorCode",resp.errCode );
//            if ( 0 == resp.errCode )
//            {
//                Log.d("onResp", "onResp: 获取授权码成功 = " + resp.code);
//                jsObj.put("code",resp.code ) ;
//            }
//            else
//            {
//                Log.e("onResp", "onResp: 获取授权码失败：" + resp.errStr + "errorcode = " + resp.errCode );
//            }
//        }
//        catch ( JSONException je )
//        {
//            System.out.println( "json exception = " + je.getMessage() );
//        }
//        WechatManager.getInstance().sendJsEvent("EVENT_WECHAT_CODE", jsObj );
//    }
}
