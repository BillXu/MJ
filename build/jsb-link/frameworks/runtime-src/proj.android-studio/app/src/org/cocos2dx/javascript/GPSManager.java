package org.cocos2dx.javascript;

import android.content.Context;
import android.util.Log;

import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.amap.api.location.CoordinateConverter;
import com.amap.api.location.DPoint;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

import static android.content.ContentValues.TAG;

/**
 * Created by billcomputer on 2018/12/26.
 */

public class GPSManager implements AMapLocationListener {
    private volatile static GPSManager gpsManager = null;
    private Context mContext;
    private AppActivity mActivity;
    public AMapLocationClientOption mLocationOption = null;
    public AMapLocationClient mLocationClient = null;
    public CoordinateConverter mDistanceCaculater = null ;
    public   boolean isRequestingGPS = false ;


    public static GPSManager getInstance() {
        if (gpsManager == null) {
            synchronized (GPSManager.class) {
                if (gpsManager == null) {
                    gpsManager = new GPSManager();
                }
            }
        }
        return gpsManager;
    }

    public int bindActivity(AppActivity activity) {
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

    // js interface
    void requestGPS( boolean isNeedAddress )
    {
        if ( isRequestingGPS )
        {
            Log.e(TAG, "requestGPS: already requesting GPS, try later");
            return;
        }

        if ( null == mLocationClient )
        {
            mLocationClient = new AMapLocationClient(mContext);
            mLocationClient.setLocationListener(this);
            mLocationOption = new AMapLocationClientOption();
            mLocationOption.setLocationPurpose(AMapLocationClientOption.AMapLocationPurpose.SignIn);
            mLocationClient.setLocationOption(mLocationOption);
        }
        mLocationOption.setNeedAddress(isNeedAddress);
        mLocationOption.setLocationCacheEnable(false);
        mLocationClient.stopLocation();
        mLocationClient.startLocation();
        isRequestingGPS = true ;
    }

    static  void JSrequstGPS( boolean isNeedAddress )
    {
         GPSManager.getInstance().requestGPS(isNeedAddress);
    }

    float caculateDistance( double A_longitude , double A_latitude ,double B_longitude , double B_latitude )
    {
        if ( null == mDistanceCaculater )
        {
            mDistanceCaculater  = new CoordinateConverter(mContext);
        }

        DPoint A = new DPoint();
        A.setLatitude(A_latitude);
        A.setLongitude(A_longitude);

        DPoint B = new DPoint();
        B.setLatitude(B_latitude);
        B.setLongitude(B_longitude);
        return mDistanceCaculater.calculateLineDistance(A,B) ;
    }

    static float JScaculateDistance( float A_longitude , float A_latitude ,float B_longitude , float B_latitude )
    {
        return GPSManager.getInstance().caculateDistance(A_longitude,A_latitude,B_longitude,B_latitude) ;
    }
    // call back ;
    public void onLocationChanged(AMapLocation amapLocation )
    {
        isRequestingGPS = false ;
        if ( null == amapLocation )
        {
            Log.e("AmapError", "onLocationChanged: arg is null" );
            return;
        }

        if (amapLocation.getErrorCode() != 0 )
        {
            //定位失败时，可通过ErrCode（错误码）信息来确定失败的原因，errInfo是错误信息，详见错误码表。
            Log.e("AmapError","location Error, ErrCode:"
                    + amapLocation.getErrorCode() + ", errInfo:"
                    + amapLocation.getErrorInfo()) ;
        }

        JSONObject jsObj = new JSONObject();
        try {
            jsObj.put("code",amapLocation.getErrorCode() );
            if ( 0 == amapLocation.getErrorCode() )
            {
                jsObj.put("longitude",amapLocation.getLongitude() ) ;
                jsObj.put("latitude",amapLocation.getLatitude() ) ;
                jsObj.put("address",amapLocation.getAddress()) ;
            }
        }
        catch ( JSONException je )
        {
            System.out.println( "json exception = " + je.getMessage() );
        }
        sendJsEvent("EVENT_GPS_RESULT", jsObj );

        mLocationClient.stopLocation();
    }
}
