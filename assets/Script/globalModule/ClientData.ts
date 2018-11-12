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
import {clientDefine,SceneName} from "../common/clientDefine"
import { eMsgType } from "../common/MessageIdentifer"
import Network from "../common/Network"
import * as _ from "lodash"
@ccclass
export default class ClientData  
{
 
    private  static s_Data : ClientData = null ;
    private strCurAccount : string = "";
    private strCurPassword : string = "";
    private nSelfUID : number = 0 ;
    public jsSelfBaseDataMsg : Object = {} ;

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
            return ;
        }
    }
    
}
