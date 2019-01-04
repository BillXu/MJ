package SDKHelp;

import android.util.Log;

import com.youhoo.cfmajiang.GPSManager;
import com.youhoo.cfmajiang.GvoiceManager;
import com.youhoo.cfmajiang.WechatManager;
import com.youhoo.cfmajiang.wxapi.WXEntryActivity;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

public class SDKHelp {
    public static  int NOT_PROCESS_CODE = -99999999 ;
    static int onRecievedJsRequest( String SDKRequestID, String jsArg )
    {
        Log.d( "SDKHelp 模块", "onRecievedJsRequest: " + SDKRequestID + " arg : = " + jsArg);
        JSONObject js = null ;
        try {
            js = new JSONObject( jsArg ) ;
        }
        catch ( JSONException je )
        {
            Log.e("SDKHelp", "onRecievedJsRequest: 解析json字符串错误: " + jsArg + " error :" + je.getMessage() );
            return  1 ;
        }

        int ret = GPSManager.getInstance().onRecievedJsRequest(SDKRequestID,js) ;
        if ( ret != NOT_PROCESS_CODE )
        {

            return ret ;
        }
        Log.d( "SDKHelp", "onRecievedJsRequest: GPS 模块没有处理消息");

        ret = GvoiceManager.getInstance().onRecievedJsRequest(SDKRequestID,js) ;
        if ( ret != NOT_PROCESS_CODE )
        {

            return ret ;
        }
        Log.d( "SDKHelp", "onRecievedJsRequest: GvoiceManager 模块没有处理消息");

        ret = WechatManager.getInstance().onRecievedJsRequest(SDKRequestID,js) ;
        if ( ret != NOT_PROCESS_CODE )
        {
            return ret ;
        }
        Log.d( "SDKHelp", "onRecievedJsRequest: WechatManager 模块没有处理消息");
        return  NOT_PROCESS_CODE ;
    }

    public static  void sendJsEvent( final String eventID , JSONObject jsDetail )
    {
        final String strDetail = jsDetail.toString();
        WXEntryActivity.g_AppActivity.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                String js = "sdkSendEvent(\"" + eventID + "\"," + strDetail + ");" ;
                //String js = "sdkSendEvent(" + eventID + "," + strDetail + ");" ;
                Log.d("sendJsEvent", js);
                Cocos2dxJavascriptJavaBridge.evalString( js ) ;
            }
        });
    }
}
