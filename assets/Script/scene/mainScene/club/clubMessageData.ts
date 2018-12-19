// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

 import IPannelData from "./IPannelData"
 import { eMsgPort,eMsgType } from "../../../common/MessageIdentifer"
 import { eClubEvent,eEventState } from "./clubDefine"
 import * as _ from "lodash"
 export class ClubMessageDataItem
 {
    eventID : number = 0 ;
    uid : number = 0 ;
    name : string = "" ;
    eventType : eClubEvent = eClubEvent.eClubEvent_Max ;
    time : number = 0 ;
    jsDetail : Object = null ;
 }

export default class ClubMessageData extends IPannelData {
    vDatas : ClubMessageDataItem[] = [] ;
    nClientMaxEventID : number = 0 ;
    featchData()
    {
        if ( !this.isNeedRefreshData() )
        {
            return false ;
        }
        let msg = {} ;
        msg["clubID"] = this.clubID;
        msg["clientMaxEventID"] = 0 ;
        msg["state"] = eEventState.eEventState_WaitProcesse ; 
        this.sendClubMsg(eMsgType.MSG_CLUB_REQ_EVENTS,msg) ;
        this.vDatas.length = 0 ;
        console.log( "req client wait process event clubID = " + this.clubID );
    }

    getDataCnt(): number
    {
        return this.vDatas.length ;
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

             let vEvents : Object[] = msg["vEvents"] || [];
             let self = this ;
             vEvents.forEach( ( eve : Object )=>{
                 let eveID : number = eve["eventID"] ;
                 let type : eClubEvent = eve["type"] ;
                 let state : eEventState = eve["state"] ;
                 if ( state != eEventState.eEventState_WaitProcesse )
                 {
                     return ;
                 }

                 if ( eveID > this.nClientMaxEventID )
                 {
                     this.nClientMaxEventID = eveID ;
                 }

                 let p = new ClubMessageDataItem();
                 p.eventType = type ;
                 p.time = eve["time"] ;
                 p.jsDetail = eve["detail"] ;
                 p.eventID = eveID ;
                 self.vDatas.push(p);
                 switch ( type )
                 {
                     case eClubEvent.eClubEvent_ApplyJoin:
                     {
                        let uid : number = p.jsDetail["uid"] ;
                        p.uid = uid ;
                        let playedata = self.getPlayerBrifData(uid);
                        if ( playedata )
                        {
                            p.name = playedata["name"] ;
                        }
                     }
                     default:
                     return ;
                 }
             } );

             this.onDoRecievdData();
             if ( vEvents.length < 10 && vEvents.length > 0 )
             {
                 if ( this.lpfCallBack )
                 {
                     this.lpfCallBack(-1);
                 }
             }
        }
        return false ;
    }

    onRecivedPlayerBrifData( msg : Object ) : boolean 
    {
        let uid : number = msg["uid"] ;
        let self = this ;
        this.vDatas.every( ( p : ClubMessageDataItem , idx : number )=>{
            if ( uid == p.uid )
            {
                p.name = msg["name"] ;
                if ( self.lpfCallBack )
                {
                    self.lpfCallBack(idx) ;
                }
                return false ;
            }
            return true ;
        } );
        return false ;
    }

    onProcessedEventID( eventID : number )
    {
        _.remove(this.vDatas,( d : ClubMessageDataItem )=>{ return eventID == d.eventID ;} ) ;
        if ( this.lpfCallBack )
        {
            this.lpfCallBack(-1);
        }
    }
}
