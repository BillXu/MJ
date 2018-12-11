// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import { eClubEvent,eEventState } from "./clubDefine"
import { eMsgType } from "../../../common/MessageIdentifer"
import IPannelData from "./IPannelData"
import * as _ from "lodash"
export class LogDataItem
{
    logEventType : eClubEvent = eClubEvent.eClubEvent_Max;
    time : number = 0 ;
    jsDetail : Object = null ;
    vNeedNameUID : Object[] = [] ;  // [{ uid : 23 , name : "strName" }, .... ]
    isFinishReciveNames()
    {
        let idx = _.findIndex( this.vNeedNameUID,( obj : Object )=>{ return obj["name"] == null ; } );
        return -1 == idx ;
    }

    getNameByID( uid : number ) : string
    {
        let idx = _.findIndex( this.vNeedNameUID,( obj : Object )=>{ return obj["uid"] == uid ; } );
        if ( idx == -1 )
        {
            cc.error( "not finish load name , you should not invoke this func" );
            return null ;
        }
       return this.vNeedNameUID[idx]["name"] ;
    }

    onRecievedPlayerBrifData( msg : Object ) : boolean
    {
        let uid = msg["uid"] ;
        let idx = _.findIndex( this.vNeedNameUID,( obj : Object )=>{ return obj["uid"] == uid ; } );
        if ( idx == -1 )
        {
            return false ;
        }

        this.vNeedNameUID[idx]["name"] = msg["name"] ;
        return true ;
    }
}

export default class ClubLogData extends IPannelData  {

    nClientMaxEventID : number = 0 ;
    vLogs : LogDataItem[] = [] ;

    featchData()
    {
        if ( this.isNeedRefreshData() == false )
        {
            return ;
        }

        let msg = {} ;
        msg["clubID"] = this.clubID;
        msg["clientMaxEventID"] = this.nClientMaxEventID ;
        msg["state"] = eEventState.eEventState_Processed ; 
        this.sendClubMsg(eMsgType.MSG_CLUB_REQ_EVENTS,msg) ;
    }

    getDataCnt() : number
    {
        return this.vLogs.length ;
    }

    onMsg( msgID : eMsgType , msg : Object ) : boolean
    {
        if ( eMsgType.MSG_CLUB_REQ_EVENTS == msgID )
        {
             let ret = msg["ret"] ;
             if ( ret )
             {
                 cc.log( "invalid priviliage" );
                 this.onDoRecievdData();
                 return true ;
             }

             let vEvents : Object[] = msg["vEvents"] ;
             let self = this ;
             vEvents.forEach( ( eve : Object )=>{
                 let eveID : number = eve["eventID"] ;
                 let type : eClubEvent = eve["type"] ;
                 let state : eEventState = eve["state"] ;
                 if ( state != eEventState.eEventState_Processed )
                 {
                     return ;
                 }

                 if ( eveID > this.nClientMaxEventID )
                 {
                     this.nClientMaxEventID = eveID ;
                 }

                 let p = new LogDataItem();
                 p.logEventType = type ;
                 p.time = eve["time"] ;
                 p.jsDetail = eve["detail"] ;
                 self.vLogs.push(p);
                 switch ( type )
                 {
                     case eClubEvent.eClubEvent_ApplyJoin:
                     {
                        self.addUIDToNeedNameVec(p.vNeedNameUID,p.jsDetail["respUID"]);
                     }
                     break;
                     case eClubEvent.eClubEvent_Kick:
                     {
                        self.addUIDToNeedNameVec(p.vNeedNameUID,p.jsDetail["mgrUID"]);
                     }
                     break ;
                     case eClubEvent.eClubEvent_UpdatePrivlige:
                     {
                        self.addUIDToNeedNameVec(p.vNeedNameUID,p.jsDetail["actUID"] );
                     }
                     break;
                     default:
                     cc.error( "unknown log event type = " + type + " do not process" );
                     self.vLogs.pop();
                     return ;
                 }
                 let uid = p.jsDetail["uid"] ;
                 if ( uid == null )
                 {
                    cc.error( "event type = " + type + " do not have uid key" );
                    return ;
                 }
                 self.addUIDToNeedNameVec(p.vNeedNameUID,uid);
             } );

             this.onDoRecievdData();
             if ( vEvents.length < 10 && vEvents.length > 0 )
             {
                 // check we do not want cache too many logs ;
                 if ( self.vLogs.length > 50 )
                 {
                     self.vLogs.splice(0, self.vLogs.length - 50 ) ;
                 }

                 if ( this.lpfCallBack && this.isAllLogNameRecievd() )
                 {
                     this.lpfCallBack(-1);
                 }
             }
        }
        return false ;
    }

    private addUIDToNeedNameVec( vNeedNameIDs : Object[] ,uid : number )
    {
        let jsPlayer = this.getPlayerBrifData(uid) ;
        let pName : string  = null ;
        if ( jsPlayer )
        {
            pName = jsPlayer["name"] ;
        }
        vNeedNameIDs.push( { uid : uid , name : pName} );
    }

    private isAllLogNameRecievd()
    {
        let idx = _.findIndex(this.vLogs,( lg : LogDataItem )=>{ return lg.isFinishReciveNames() == false ; } );
        return -1 == idx ;
    }

    protected onRecivedPlayerBrifData( msg : Object ) : boolean 
    {
         let isInvokded : boolean = false ;
         this.vLogs.forEach( ( log : LogDataItem )=>{ 
             if ( log.onRecievedPlayerBrifData(msg) )
             {
                 isInvokded = true ;
             }
         } );

         if ( isInvokded )
         {
            if ( this.lpfCallBack && this.isAllLogNameRecievd() )
            {
                this.lpfCallBack(-1);
            }
         }

         return false ;
    }
}
