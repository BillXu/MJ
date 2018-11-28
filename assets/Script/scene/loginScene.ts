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
import { eMsgPort,eMsgType } from "../common/MessageIdentifer"
import clientData from "../globalModule/ClientData"
import Network from "../common/Network"
import Utilty from "../globalModule/Utility"
@ccclass
export default class LoginScene extends cc.Component {

    @property(cc.Node)
    pTipMask : cc.Node = null ;

    // LIFE-CYCLE CALLBACKS:

    strAccount : string = ""
    strPassword : string = "" ;
    strWechatName : string = "";
    strWechatHeadUrl : string = "" ;
    nWechatSex : number = 1 ;
    

    onLoad () {
        cc.systemEvent.on(clientDefine.netEventRecievedBaseData,this.onRecievedBaseData,this);
        cc.systemEvent.on(clientDefine.netEventOpen,this.onConnectedToSvr,this);
        cc.systemEvent.on(clientDefine.netEventReconnectd,this.onConnectedToSvr,this);
        this.pTipMask.active = false ;
    }

    start () {
        if ( CC_DEBUG )
        {
            cc.log( "debug , not auto login" );
            return ;
        }
        if ( clientData.getInstance().curAccount.length > 1 && clientData.getInstance().curPwd.length > 1 )
        {
            this.strAccount = clientData.getInstance().curAccount ;
            this.strPassword = clientData.getInstance().curPwd ;
            this.doLogin();
        }
    }

    onClickWechatLogin()
    {
        // lanch wechat
    }

    // clientData will recieved base data , and invoke loading scene ;
    onRecievedBaseData()
    {
        let msgupdateinfo = {} ;
        msgupdateinfo["name"] = this.strWechatName ;
        msgupdateinfo["headIcon"] = this.strWechatHeadUrl;
        msgupdateinfo["sex"] = this.nWechatSex;
        clientData.getInstance().jsSelfBaseDataMsg["name"] = this.strWechatName ;
        clientData.getInstance().jsSelfBaseDataMsg["headIcon"] = this.strWechatHeadUrl ;
        clientData.getInstance().jsSelfBaseDataMsg["sex"] = this.nWechatSex ;
        Network.getInstance().sendMsg(msgupdateinfo,eMsgType.MSG_PLAYER_UPDATE_INFO,eMsgPort.ID_MSG_PORT_DATA,clientData.getInstance().selfUID);
        if ( clientData.getInstance().stayInRoomID && clientData.getInstance().stayInRoomID > 0 )
        {
            cc.director.loadScene(SceneName.Scene_Room) ;
        }
        else
        {
            cc.director.loadScene(SceneName.Scene_Main) ;
        }
        
    }

    onConnectedToSvr()
    {
        console.log("login scene recived connected to svr event");
        if ( this.strAccount != "" && "" != this.strPassword )
        {
            this.doLogin();
        }
    }

    doLogin()
    {
        if ( this.strAccount == "" || "" == this.strPassword )
        {
            Utilty.showTip("account is null") ;
            return ;
        }

        let msgLogin = {};
        msgLogin["cAccount"] = this.strAccount ;
        msgLogin["cPassword"] = this.strPassword ;
        let self = this ;
        Network.getInstance().sendMsg(msgLogin,eMsgType.MSG_PLAYER_LOGIN,eMsgPort.ID_MSG_PORT_GATE,1,
            ( jsmg : Object )=>{
                let ret : number = jsmg["nRet"] ;
                self.pTipMask.active = ret == 0 ;
                if ( ret == 0 )  // clientData will recieved base data , and invoke loading scene ;
                {
                    // save a valid account , most used when developing state ;
                    clientData.getInstance().curAccount = this.strAccount;
                    clientData.getInstance().curPwd = this.strPassword ;
                    console.log("login scene login ok");
                    return true ;
                } 
                self.doRegister();
                return true ;
            });
        this.pTipMask.active = true ;
    }

    doRegister()
    {
        let msgReg = {}; // cName
        msgReg["cAccount"] = this.strAccount ;
        msgReg["cPassword"] = this.strPassword ;
        msgReg["cRegisterType"] = this.strWechatName.length > 0 ;
        msgReg["nChannel"] = 0 ;
        let self = this ;
        Network.getInstance().sendMsg(msgReg,eMsgType.MSG_PLAYER_REGISTER,eMsgPort.ID_MSG_PORT_GATE,1,
            ( jsmg : Object )=>{
                let ret : number = jsmg["nRet"] ;
                if ( ret != 0 )  // clientData will recieved base data , and invoke loading scene ;
                {
                    Utilty.showTip("注册账号失败");
                    self.pTipMask.active = false ;
                    return true;
                } 
                // register ok , then save account info to local ;
                this.strAccount = jsmg["cAccount"] ;
                this.strPassword = jsmg["cPassword"] ;
                clientData.getInstance().curAccount = this.strAccount;
                clientData.getInstance().curPwd = this.strPassword ;

                console.log("login scene register ok : " + this.strAccount );
                self.doLogin();
                return true ;
            });
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    onClickVisitorBtn( event : cc.Event.EventTouch, customEventData : string )
    {
        let nIdx : number = parseInt(customEventData) ;
        let vAcc : string[] = [ "new1","new2","new3","new4"] ;
        let vName : string[] =  [ "new1","new2","new3","new4"] ;
        let vHeadIcon : string[] = [ "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL2VH53lyG0F6mKtichN8XU0iacH4T9laIrRicYlMicILK9h78kChjsosmgibD0xD8Q8Toy1wv01JT3MaQ/132"
                                    ,"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLMAlomibJicN6EfMlerKd5EBn9H6okbqprTp4FZE95yib4QVQ1w3dlqoiahbGmDCe6AspjI7gIxBlmlg/132"
                                ,"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKOlSlTvqKlqvwzLTdl0kXbF4FwDmxkTkQguvqfia5PNMEs0qPnMg0HTMa96GdmZ2wRUNOUdOoJEicw/132"
                            ,"http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83erP6lwtTwOXhKkdeib79icib573XbBJRibISc8CPNibAaEISWkyI3WVGKJASKML9zgb9rYibuicdicTepHStA/132"] ;
        if ( nIdx >= vAcc.length )
        {
            console.log( "invalid visitor idx = " + nIdx );
            nIdx = 0 ;
        }

        this.strWechatName = vName[nIdx] ;
        this.strAccount = vAcc[nIdx] ;
        this.strWechatHeadUrl = vHeadIcon[nIdx] ;
        this.strPassword = "v1";
        console.log( "visitor " + nIdx + " click login" );
        this.doLogin();
    }
}
