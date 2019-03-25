import IClubDataComponent from "./IClubDataComponent";
import { eClubEvent, eEventState, eClubPrivilige } from "./ClubDefine";
import { eMsgType, eMsgPort } from "../../common/MessageIdentifer";
import Utility from "../../globalModule/Utility";
import ClubData from "./ClubData"
import PlayerInfoDataCacher from "../PlayerInfoDataCacher";
import PlayerInfoData from "../playerInfoData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export class ClubEvent
{
    eventID : number = 0 ;
    logEventType : eClubEvent = eClubEvent.eClubEvent_Max;
    private _time : number = 0 ;
    jsDetail : Object = null ;
    state : eEventState = eEventState.eEventState_Max ;

    private _eventString : string = "" ;
    get timeStr () : string
    {
        let date = new Date(this._time * 1000 ) ;
        return date.toLocaleString("zh-CN");
    }

    set time( t : number )
    {
        this._time = t ;
    }

    get eventString() : string 
    {
        return this._eventString ;
    }

    constructEventString() : boolean
    {
        let strContent : string = "" ;
        let vUIDs : number[] = [] ;
        switch ( this.logEventType )
        {
            case eClubEvent.eClubEvent_ApplyJoin:
            {
                if ( this.state == eEventState.eEventState_WaitProcesse )
                {
                    strContent = this.placeholdID(this.jsDetail["uid"]) + "( ID:"+ this.jsDetail["uid"] + ")申请加入俱乐部.";
                }
                else
                {
                    strContent = "【<color=#eb6c1f>" + this.placeholdID(this.jsDetail["respUID"]) + ( this.jsDetail["isAgree"] == 1 ? "</color>】同意了【<color=#eb6c1f>" : "</color>】拒绝了【<color=#eb6c1f>" ) + this.placeholdID(this.jsDetail["uid"]) + "</color>】加入俱乐部"; 
                    vUIDs.push(this.jsDetail["respUID"]);
                }
                vUIDs.push(this.jsDetail["uid"]);
            }
            break;
            case eClubEvent.eClubEvent_Kick:
            {
                strContent = "【<color=#eb6c1f>" + this.placeholdID(this.jsDetail["uid"]) + "</color>】被【<color=#eb6c1f>" + this.placeholdID(this.jsDetail["mgrUID"]) + "</color>】请出了俱乐部"; 
                vUIDs.push(this.jsDetail["mgrUID"],this.jsDetail["uid"]);
            }
            break ;
            case eClubEvent.eClubEvent_Leave:
            {
                strContent = "【<color=#eb6c1f>" + this.placeholdID(this.jsDetail["uid"]) + "</color>】离开了俱乐部"; 
                vUIDs.push(this.jsDetail["uid"]);
            }
            break;
            case eClubEvent.eClubEvent_UpdatePrivlige:
            {
                let prori : eClubPrivilige = this.jsDetail["privilige"] ;
                let vstr : string[] = [] ;
                vstr[eClubPrivilige.eClubPrivilige_Creator] = "创建者" ;
                vstr[eClubPrivilige.eClubPrivilige_Forbid] = "禁止入局" ;
                vstr[eClubPrivilige.eClubPrivilige_Manager] = "管理员" ;
                vstr[eClubPrivilige.eClubPrivilige_Normal] = "普通玩家" ;
                if ( vstr.length <= prori )
                {
                    cc.error("invalid privilage club = " + prori );
                    break ;
                }
                strContent = "【<color=#eb6c1f>" + this.placeholdID(this.jsDetail["actUID"]) + "</color>】将玩家【<color=#eb6c1f>" + this.placeholdID(this.jsDetail["uid"]) + "</color>】设置为" + vstr[prori] ; 
                vUIDs.push(this.jsDetail["actUID"],this.jsDetail["uid"]);
            }
            break;
            default:
                cc.error( "unknown log event type = " + this.logEventType + " do not process" );
                strContent = "未知俱乐部事件type="+this.logEventType ;
        }

        if ( this.state == eEventState.eEventState_WaitProcesse ) // not color full 
        {
            this._eventString = strContent ;
        }
        else
        {
            this._eventString = "<color=#835B35>" + strContent + "</c>" ;
        }
        
        // use cacher fill name first 
        let players = PlayerInfoDataCacher.getInstance();
        for ( let v of vUIDs )
        {
            this.onPlayerDataInfo(players.getPlayerInfoByID(v)) ;
        }
        return this.isFinishFillEventString() ;
    }

    private placeholdID( id : number )
    {
        return "_" + id + "_" ;
    }

    isFinishFillEventString()
    {
        let v = /_[1-9][0-9]{1,12}_/gi; 
        return this._eventString.search(v) == -1 ;
    }

    onPlayerDataInfo( data : PlayerInfoData ) : boolean 
    {
        if ( data == null )
        {
            return false;
        }

        let replace = "_"+data.uid+"_" ;
        let old = this._eventString ;
        this._eventString = this._eventString.replace(replace,data.name) ;
        return this._eventString.localeCompare(old) != 0 ;
    }
} ;

export default class ClubDataEvent extends IClubDataComponent {

    private nClientMaxEventID : number = 0 ;
    vEventLog : ClubEvent[] = [] ;
    vEvents : ClubEvent[] = [] ;

    init( clubData : ClubData, type : number )
    {
        super.init(clubData,type);
        cc.systemEvent.on(PlayerInfoDataCacher.EVENT_RECIEVED_PLAYER_INFO_DATA,this.onEvent,this);
    }

    fetchData( isforce : boolean ) : void
    {
        if ( false == isforce && false == this.isDataOutOfDate() )
        {
            this.doInformDataRefreshed( false );
            return ;
        }

        let msg = {} ;
        msg["clubID"] = this.clubID;
        msg["clientMaxEventID"] = this.nClientMaxEventID ;
        msg["state"] = eEventState.eEventState_Processed ; 
        this.getClub().sendMsg(msg,eMsgType.MSG_CLUB_REQ_EVENTS,eMsgPort.ID_MSG_PORT_CLUB,this.clubID ) ;

        msg["clientMaxEventID"] = 0 ;  // do not cache wait process event ;
        msg["state"] = eEventState.eEventState_WaitProcesse ;  // not process event ;
        this.getClub().sendMsg(msg,eMsgType.MSG_CLUB_REQ_EVENTS,eMsgPort.ID_MSG_PORT_CLUB,this.clubID ) ;
    }

    onMsg( msgID : number , msgData : Object ) : boolean
    {
        if ( eMsgType.MSG_CLUB_REQ_EVENTS == msgID )
        {
            let clubID : number = msgData["clubID"] ;
            if ( null == clubID )
            {
                Utility.showTip("eMsgType.MSG_CLUB_REQ_EVENTS lack of clubID key , please add");
                return true ;
            }

            if ( clubID != this.clubID )
            {
                return  false ;
            }

            let ret = msgData["ret"] ;
            if ( ret )
            {
                console.warn( "invalid priviliage req event club id = " + this.clubID );
                this.doInformDataRefreshed(true);
                return true ;
            }

            let vEvents : Object[] = msgData["vEvents"] || [];
            let pageIdx = msgData["pageIdx"] ;
            let self = this ;
             vEvents.forEach( ( eve : Object )=>{
                 let eveID : number = eve["eventID"] ;
                 let type : eClubEvent = eve["type"] ;
                 let state : eEventState = eve["state"] ;
                 if ( eveID > this.nClientMaxEventID && state != eEventState.eEventState_WaitProcesse ) // only processed event , do incremental request 
                 {
                     self.nClientMaxEventID = eveID ;
                 }

                 let p = new ClubEvent();
                 p.logEventType = type ;
                 p.time = eve["time"] ;
                 p.jsDetail = eve["detail"] ;
                 p.eventID = eveID ;
                 p.state = state ;
                 p.constructEventString();
                 if ( state != eEventState.eEventState_WaitProcesse )
                 {
                     self.vEventLog.push(p);
                     return ;
                 }
                 else
                 {
                     if ( 0 == pageIdx ) // we do not cache wait process event ;
                     {
                         self.vEvents.length = 0 ;
                         pageIdx = -1 ; // to invoid next clearing ;
                     }
                     self.vEvents.push(p);
                     return ;
                 }
             } );

             if ( vEvents.length < 10 && vEvents.length > 0 )
             {
                 // check we do not want cache too many logs ;
                 if ( this.vEventLog.length > 50 )
                 {
                    this.vEventLog.splice(0, self.vEventLog.length - 50 ) ;
                 }

                 this.doInformDataRefreshed(true);
             }
             return true ;
        }
        return false ;
    }

    onEvent( event : cc.Event.EventCustom )
    {
        if ( PlayerInfoDataCacher.EVENT_RECIEVED_PLAYER_INFO_DATA == event.getType() )
        {
            let playerData : PlayerInfoData = <PlayerInfoData>(event.detail);
            let vTmp = this.vEventLog.concat(this.vEvents);
            let hasNewFillEvent = false ;
            for ( let v of vTmp )
            {
                if ( v.onPlayerDataInfo(playerData) )
                {
                    hasNewFillEvent = true ;
                }
            }

            if ( hasNewFillEvent )
            {
                this.doInformDataRefreshed(false);
            }
            return ;
        }
    }

    doProcessedEvent( eventID : number )
    {
        
    }
}
