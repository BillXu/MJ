import PlayerInfoData from "./playerInfoData";
import Network from "../common/Network";
import { eMsgType, eMsgPort } from "../common/MessageIdentifer";

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
export default class PlayerInfoDataCacher {
 
    static EVENT_RECIEVED_PLAYER_INFO_DATA : string = "RECEIVED_player_info_data" ;

    protected vPlayerInfos:{[key:number] : PlayerInfoData} = {};
    protected vRequestingUIDs : {[key:number] : number} = {} ;
    protected nRetryInveralTimer : number = -1 ;

    private static s_instance : PlayerInfoDataCacher = null ;
    static getInstance() : PlayerInfoDataCacher
    {
        if ( PlayerInfoDataCacher.s_instance == null )
        {
            PlayerInfoDataCacher.s_instance = new PlayerInfoDataCacher();
            PlayerInfoDataCacher.s_instance.init();
        }
        return PlayerInfoDataCacher.s_instance ;
    }

    private init()
    {
        let self = this ;
        cc.game.on(cc.game.EVENT_HIDE,()=>{ self.vPlayerInfos = {} ;}) ; // when hide app, we clean the cacher ;
    }

    getPlayerInfoByID( uid : number, isForceReq : boolean = false ) : PlayerInfoData
    {
        if ( this.vPlayerInfos[uid] == null || isForceReq )
        {
            if ( this.vRequestingUIDs[uid] )
            {
                console.error( "already requesting palyer info data uid = " + uid );
                return null ;
            }

            this.vRequestingUIDs[uid] = Date.now();
            this.retryRequesting();

            let js = {} ;
            js["nReqID"] = uid ;
            js["isDetail"] = 1 ;
            let self = this ;
            Network.getInstance().sendMsg(js,eMsgType.MSG_REQUEST_PLAYER_DATA,eMsgPort.ID_MSG_PORT_DATA,uid,( jsmsg : Object )=>{
                let readUID = jsmsg["uid"] ;
                if ( readUID == null )
                {
                    console.error( "req player data info error uid = " + uid );
                    return ;
                }

                if ( self.vPlayerInfos[readUID] == null )
                {
                    self.vPlayerInfos[readUID] = new PlayerInfoData();
                }
                self.vPlayerInfos[readUID].initByMsg(jsmsg) ;

                let event = new cc.Event.EventCustom(PlayerInfoDataCacher.EVENT_RECIEVED_PLAYER_INFO_DATA,true) ;
                event.detail = self.vPlayerInfos[readUID] ;
                cc.systemEvent.dispatchEvent(event);

                if ( self.vRequestingUIDs[uid] == null )
                {
                    console.error( "request player info data , but do not put it in requesting UID = " + readUID );
                    return false ;
                }
                delete this.vRequestingUIDs[uid];
                if ( Object.keys(this.vRequestingUIDs).length == 0 )
                {
                    clearInterval(self.nRetryInveralTimer);
                    self.nRetryInveralTimer = -1 ;
                    console.log( "clear retry player info data invertal" );
                }
                return false ;
            } ) ;
        }

        if ( this.vPlayerInfos[uid] )
        {
            return this.vPlayerInfos[uid] ;
        }
        return null ;
    }

    protected retryRequesting()
    {
        if ( -1 != this.nRetryInveralTimer )
        {
            return ;
        }

        console.log( "start play data info retry " );

        let self = this ;
        this.nRetryInveralTimer = setInterval( ()=>{
            let vKey = Object.keys(self.vRequestingUIDs);
            let nNow = Date.now();
            for ( let v of vKey )
            {
                if ( nNow - self.vRequestingUIDs[v] > 3*1000 )
                {
                    delete self.vRequestingUIDs[v] ;
                    console.log( "retry requesting player info data uid = " + v );
                    self.getPlayerInfoByID(parseInt(v));
                }
            }
        },1000*2);
    }
}
