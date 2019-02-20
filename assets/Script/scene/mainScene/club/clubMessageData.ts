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
import { clientEvent } from "../../../common/clientDefine";
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
    nInteralFetachData : number = -1 ;
    notOpenMaxEvnetID : number = 0 ;

    set nClientMaxEventID( id : number ) 
    {
        cc.sys.localStorage.setItem("club_msg_max_eve_id"+this.clubID,id );
    }

    get nClientMaxEventID() : number
    {
        let eventID : string = cc.sys.localStorage.getItem( "club_msg_max_eve_id"+this.clubID );
        if ( eventID )
        {
            return parseInt(eventID);
        }
        return 0 ;
    }

    featchData()
    {
        let msg = {} ;
        msg["clubID"] = this.clubID;
        msg["clientMaxEventID"] = this.vDatas.length > 0 ? Math.max(this.nClientMaxEventID,this.notOpenMaxEvnetID) : 0 ;
        msg["state"] = eEventState.eEventState_WaitProcesse ; 
        this.sendClubMsg(eMsgType.MSG_CLUB_REQ_EVENTS,msg) ;
        console.log( "req client wait process event clubID = " + this.clubID );
    }

    doShowDataToPlayer()
    {
        if ( this.nClientMaxEventID < this.notOpenMaxEvnetID ) // message dlg is not show , and recieved new event , must show red dot 
        {
            this.nClientMaxEventID = this.notOpenMaxEvnetID
        }
    }

    onFocus()
    {
        if ( this.pClubData.isSelfMgr() == false && false == this.pClubData.isSelfOwner() )
        {
            return ;
        }

        if ( this.lpfCallBack == null && this.nClientMaxEventID < this.notOpenMaxEvnetID ) // message dlg is not show , and recieved new event , must show red dot 
        {
           let ev : any = clientEvent.event_recived_new_clubMessage ;
           let pEvent = new cc.Event.EventCustom(ev,true) ;
           cc.systemEvent.dispatchEvent(pEvent);
        }

        if ( this.nInteralFetachData != -1 )
        {
            clearInterval(this.nInteralFetachData) ;
            this.nInteralFetachData = -1 ;
        }

        let self = this ;
        let interval = 30*1000 ;
        if ( CC_DEBUG )
        {
            interval = 10* 1000 ;
        }

        this.nInteralFetachData = setInterval(()=>{ console.log( "inter feat evet msg clubID " + self.clubID ); if ( self.isNeedRefreshData() ){ self.featchData();} },interval);
        if ( !this.isNeedRefreshData() )
        {
            return false ;
        }
        this.featchData();
    }

    onLoseFocus()
    {
        super.onLoseFocus();
        if ( -1 != this.nInteralFetachData )
        {
            clearInterval(this.nInteralFetachData) ;
            this.nInteralFetachData = -1 ;
        }
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

                 if ( eveID > self.notOpenMaxEvnetID )
                 {
                     self.notOpenMaxEvnetID = eveID ;
                 }
                 else
                 {
                     console.warn( "why have same id  or small id ? " + eveID + "self max id = " + self.notOpenMaxEvnetID   );
                     return ;
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
                     if ( this.notOpenMaxEvnetID > this.nClientMaxEventID )
                     {
                        this.nClientMaxEventID = this.notOpenMaxEvnetID ;
                     }
                 }
                 else
                 {
                     if ( this.nClientMaxEventID < this.notOpenMaxEvnetID ) // message dlg is not show , and recieved new event , must show red dot 
                     {
                        let ev : any = clientEvent.event_recived_new_clubMessage ;
                        let pEvent = new cc.Event.EventCustom(ev,true) ;
                        cc.systemEvent.dispatchEvent(pEvent);
                     }
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
