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
        if ( CC_JSB && cc.sys.ANDROID )
        {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/GPSManager", "JSrequstGPS", "(Z)V",isNeedAddress );
        }
        else
        {
            cc.warn( "other platform not implement requestGPS" );
        }
    }

    caculateDistance( A_longitude : number  , A_latitude : number ,B_longitude : number, B_latitude : number ) : number
    {
        if ( CC_JSB && cc.sys.ANDROID )
        {
            let ret = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/GPSManager", "JScaculateDistance", "(FFFF)F",A_longitude , A_latitude ,B_longitude , B_latitude );
            return Math.floor(ret + 0.5) ;
        }
        else
        {
            cc.warn( "other platform not implement requestGPS" );
        }
        return 1000 ;
    }
}
