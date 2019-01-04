import { SDK_DEF } from "./SDK_DEF";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GPSManager{

    static s_Mgr : GPSManager = null ;
    static EVENT_GPS_RESULT : string = "EVENT_GPS_RESULT" ; // { code : 2 , longitude : 23 , latitude : 2 , address : "" }
    
    static SDK_GPS_REQUEST_GPSINFO : string = "SDK_GPS_REQUEST_GPSINFO" ; // { isNeedAddress : 1 } 
    static SDK_GPS_CACULATE_DISTANCE : string = "SDK_GPS_CACULATE_DISTANCE" ; // { A_longitude : 23, A_latitude : 23 ,B_longitude : 23, B_latitude : 23 }
    // longitude = J (jing du )
    static getInstance() : GPSManager
    {
        if ( GPSManager.s_Mgr == null )
        {
            GPSManager.s_Mgr = new GPSManager();
        }
        return GPSManager.s_Mgr ;
    }
 
    requestGPS( isNeedAddress : boolean = false )
    {
        let jsArg = { } ;
        jsArg["isNeedAddress"] = isNeedAddress ? 1 : 0 ;
        return sendRequestToPlatform(GPSManager.SDK_GPS_REQUEST_GPSINFO,jsArg) ;
    }

    caculateDistance( A_longitude : number  , A_latitude : number ,B_longitude : number, B_latitude : number ) : number
    {
        let jsArg = { A_longitude : A_longitude , A_latitude : A_latitude , B_longitude : B_longitude , B_latitude : B_latitude} ;
        return sendRequestToPlatform(GPSManager.SDK_GPS_CACULATE_DISTANCE,jsArg) ;
    }
}
