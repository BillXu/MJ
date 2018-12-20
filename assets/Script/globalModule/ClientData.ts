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
import {clientDefine,eGameType,eMusicType,eDeskBg,eMJBg, clientEvent, eMailType} from "../common/clientDefine"
import { eMsgType, eMsgPort } from "../common/MessageIdentifer"
import Network from "../common/Network"
import * as _ from "lodash"
import Utility from "./Utility";
@ccclass
export default class ClientData  
{
 
    private _version : string = "1.0.0" ;
    private  static s_Data : ClientData = null ;
    private strCurAccount : string = "";
    private strCurPassword : string = "";
    private nSelfUID : number = 0 ;
    public jsSelfBaseDataMsg : Object = {} ;
    public stayInRoomType : eGameType = 0 ;
    
    private _effectVolume : number = 0.5 ;
    private _musicVolume : number = 0.5 ;
    private _musicTypeIdx : eMusicType = 0 ;
    private _deskBgIdx : eDeskBg = 0 ;
    private _mjBgIdx : eMJBg = 0 ;

    get stayInRoomID () : number
    {
        if ( this.jsSelfBaseDataMsg["stayRoomID"] == null )
        {
            return 0 ;
        }
        
        return this.jsSelfBaseDataMsg["stayRoomID"];
    }

    set stayInRoomID( id : number )
    {
        this.jsSelfBaseDataMsg["stayRoomID"] = id ;
    }

    set effectVolume( v : number )
    {
        this._effectVolume = v ;
        cc.sys.localStorage.setItem( "_effectVolume", this._effectVolume );
    }

    get effectVolume()
    {
        return this._effectVolume ;
    }

    set musicVolume( v : number )
    {
        this._musicVolume = v ;
        cc.sys.localStorage.setItem( "_musicVolume", this._musicVolume );
    }

    get musicVolume()
    {
        return this._musicVolume ;
    }

    set musicTypeIdx( v : number )
    {
        this._musicTypeIdx = v ;
        cc.sys.localStorage.setItem( "_musicTypeIdx", v );
    }

    get musicTypeIdx()
    {
        return this._musicTypeIdx ;
    }

    set deskBgIdx( v : number )
    {
        this._deskBgIdx = v ;
        cc.sys.localStorage.setItem( "_deskBgIdx", v );
    }

    get deskBgIdx()
    {
         return this._deskBgIdx ;
    }

    set mjBgIdx( v : number )
    {
        this._mjBgIdx = v ;
        cc.sys.localStorage.setItem( "_mjBgIdx", v );
    }

    get mjBgIdx()
    {
         return this._mjBgIdx ;
    }

    set version( strVersion )
    {
        this._version = strVersion ;
    }

    get version()
    {
        return this._version ;
    }

    get selfUID() : number 
    {
        return this.nSelfUID ;
    }

    set selfUID( uid : number )
    {
        this.nSelfUID = uid ;
        cc.sys.localStorage.setItem("uid",uid);
    }

    get curAccount() : string
    {
        return this.strCurAccount ;
    }
    
    set curAccount( strAcc : string )
    {
        this.strCurAccount = strAcc ;
        cc.sys.localStorage.setItem("acc",strAcc);
    }

    get curPwd() : string
    {
        return this.strCurPassword ;
    }
    
    set curPwd( strPwd : string )
    {
        this.strCurPassword = strPwd ;
        cc.sys.localStorage.setItem("pwd",strPwd);
    }

    public static getInstance() : ClientData
    {
        if ( null == this.s_Data )
        {
            this.s_Data = new ClientData();
        }
        return this.s_Data ;
    }

    public getJoinedClubsID() : number[]
    {
        if ( this.jsSelfBaseDataMsg["clubs"] == null )
        {
            this.jsSelfBaseDataMsg["clubs"] = [] ;
        }
        return this.jsSelfBaseDataMsg["clubs"] ;
    }

    public onJoinedNewClubID( clubID : number )
    {
        let vClubs = this.getJoinedClubsID();
        let idx = _.findIndex(vClubs,( id : number )=>{ return id == clubID ;}) ;
        if ( idx != -1 )
        {
            console.warn( "already add clubid , do not add twice id = " + clubID );
            return ;
        }

        if ( this.jsSelfBaseDataMsg["clubs"] == null )
        {
            this.jsSelfBaseDataMsg["clubs"] = [] ;
        }
        this.jsSelfBaseDataMsg["clubs"].push(clubID);
    }

    public onDoLevedClub( clubID : number )
    {
         let vClubs : number[] = this.jsSelfBaseDataMsg["clubs"] || [] ;
         for ( let idx in vClubs )
         {
             if ( vClubs[idx] == clubID )
             {
                 vClubs.splice(parseInt(idx),1);
                 return
             }
         }
         console.error( "client data do not have club id = " + clubID );
    }

    public init()
    {
        let acc : string = cc.sys.localStorage.getItem("acc");
        if ( acc && acc.length > 1 )
        {
            this.strCurAccount = acc ;
        }
        let pwd : string = cc.sys.localStorage.getItem("pwd");
        if ( pwd && pwd.length > 1 )
        {
            this.strCurPassword = pwd ;
        }

        let strUID = cc.sys.localStorage.getItem("uid") ;
        let nSelfUID : number = 0;
        if ( strUID != null )
        {
            nSelfUID = parseInt(strUID);
        }

        cc.systemEvent.on(clientDefine.netEventMsg,this.onMsg,this);

        // load settings
        this._deskBgIdx = parseInt(cc.sys.localStorage.getItem("_deskBgIdx"));
        if ( null == this._deskBgIdx )
        {
            this._deskBgIdx = 0 ;
        }

        this._effectVolume = parseFloat(cc.sys.localStorage.getItem("_effectVolume"));
        if ( this._effectVolume == null )
        {
            this._effectVolume = 0.5 ;
        }
        this._mjBgIdx = parseInt(cc.sys.localStorage.getItem("_mjBgIdx"));
        if ( null == this._mjBgIdx )
        {
            this._mjBgIdx = 0 ;
        }
        this._musicTypeIdx = parseInt(cc.sys.localStorage.getItem("_musicTypeIdx"));
        if ( null == this._musicTypeIdx )
        {
            this._musicTypeIdx = 0 ;
        }
        this._musicVolume = parseFloat(cc.sys.localStorage.getItem("_musicVolume"));
        if ( null == this._musicVolume )
        {
            this._musicVolume = 0.5 ;
        }
    }

    public onMsg( event : cc.Event.EventCustom )
    {
        let nMsgID : number = event.detail[clientDefine.msgKey] ;
        let msg : Object = event.detail[clientDefine.msg] ;
        if ( nMsgID == eMsgType.MSG_PLAYER_BASE_DATA )
        {
            let uid : number = msg["uid"] ;
            if ( uid != this.selfUID )
            {
                this.selfUID = uid ;
            }
            
            this.jsSelfBaseDataMsg = _.merge(this.jsSelfBaseDataMsg,msg);
            // we need dispatch reconnected ok event ; because , this msg may invoke by relogin  when reconected failed , in clientNetwork module 
            let ev : any = clientDefine.netEventRecievedBaseData ;
            let pEvent = new cc.Event.EventCustom(ev,true) ;
            pEvent.detail = Network.getInstance().getSessionID();
            cc.systemEvent.dispatchEvent(pEvent);
            return ;
        }

        if ( eMsgType.MSG_PLAYER_REFRESH_MONEY == nMsgID )
        {
            this.jsSelfBaseDataMsg["coin"] = msg["coin"] ;
            this.jsSelfBaseDataMsg["diamond"] = msg["diamond"] ;

            let ev : any = clientEvent.event_update_money ;
            let pEvent = new cc.Event.EventCustom(ev,true) ;
            pEvent.detail = msg;
            cc.systemEvent.dispatchEvent(pEvent);
            return ;
        }

        if ( eMsgType.MSG_NEW_MAIL == nMsgID )
        {
            let mailType : eMailType = msg["type"] ;
            let deail : Object = msg["detail"] ;
            switch ( mailType )
            {
                case eMailType.eMail_ResponeClubApplyJoin:
                {
                    let clubID : number = deail["clubID"] ;
                    let isAgree = deail["nIsAgree"] == 1 ;
                    if ( isAgree )
                    {
                        this.onJoinedNewClubID(clubID);
                    }
                    
                    let str = "俱乐部：" + deail["clubName"] + " 的管理员" + (isAgree ? "同意了" : "拒绝了" )+ "您的加入申请。";
                    Utility.showPromptText(str);

                    let ev : any = clientEvent.event_joined_club ;
                    let pEvent = new cc.Event.EventCustom(ev,true) ;
                    pEvent.detail = clubID;
                    cc.systemEvent.dispatchEvent(pEvent);
                }
                break;
                case eMailType.eMail_ClubBeKick:
                {
                    let clubID : number = deail["clubID"] ;
                    this.onDoLevedClub(clubID);
                    let str = "您被俱乐部：" + deail["clubName"] + " 的管理员请出了俱乐部";
                    Utility.showPromptText(str);

                    let ev : any = clientEvent.event_leave_club ;
                    let pEvent = new cc.Event.EventCustom(ev,true) ;
                    pEvent.detail = clubID;
                    cc.systemEvent.dispatchEvent(pEvent);
                }
                break;
                case eMailType.eMail_ClubDismiss:
                {
                    let clubID : number = deail["clubID"] ;
                    this.onDoLevedClub(clubID);
                    let str = "您所在的俱乐部：" + deail["clubName"] + " 已经解散了。";
                    Utility.showPromptText(str);
                    
                    let ev : any = clientEvent.event_leave_club ;
                    let pEvent = new cc.Event.EventCustom(ev,true) ;
                    pEvent.detail = clubID;
                    cc.systemEvent.dispatchEvent(pEvent);
                }
                break;
            }
            return ;
        }
    }

    public clearWhenLogout()
    {
        this.selfUID = 0 ;
        this.curAccount = "";
        this.curPwd = "" ;
        this.jsSelfBaseDataMsg = {} ;
        cc.sys.localStorage.clear();
    }
    
    getMsgPortByGameType( game : eGameType ) : eMsgPort
    {
        switch( game )
        {
            case eGameType.eGame_CFMJ:
            {
                return eMsgPort.ID_MSG_PORT_CFMJ;
            }
            break;
            case eGameType.eGame_NCMJ:
            {
                return eMsgPort.ID_MSG_PORT_NCMJ;
            }
            break ;
            case eGameType.eGame_AHMJ:
            {
                return eMsgPort.ID_MSG_PORT_AHMJ;
            }
            break ;
        }
        return undefined ;
    }

   getMsgPortByRoomID( nRoomID : number ) {
        // begin(2) , portTypeCrypt (2),commonNum(2)
        let nComNum = nRoomID % 100;
        let portTypeCrypt = (Math.floor(nRoomID / 100)) % 100;
        if (nComNum >= 50) {
            portTypeCrypt = portTypeCrypt + 100 - nComNum;
        } else {
            portTypeCrypt = portTypeCrypt + 100 + nComNum;
        }
        return (portTypeCrypt %= 100);
    }
}
