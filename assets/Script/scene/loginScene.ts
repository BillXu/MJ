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
import Network from "../common/Network"
import Utilty from "../globalModule/Utility"
import WechatManager from "../sdk/WechatManager";
import Utility from "../globalModule/Utility";
import IModule from "../common/IModule";
import ClientPlayerData from "../clientData/ClientPlayerData";
import ClientApp from "../globalModule/ClientApp";
@ccclass
export default class LoginScene extends IModule {

    @property(cc.Node)
    pTipMask : cc.Node = null ;

    // LIFE-CYCLE CALLBACKS:

    strAccount : string = ""
    strPassword : string = "" ;
    strWechatName : string = "";
    strWechatHeadUrl : string = "" ;
    nWechatSex : number = 1 ;
    isNeedUpdatePlayerInfo : boolean = false ;
    

    onLoad () {
        cc.systemEvent.on(ClientPlayerData.EVENT_RECIEVED_BASE_DATA,this.onRecievedBaseData,this);
        cc.systemEvent.on(WechatManager.EVENT_RECIEVED_WECHAT_INFO,this.onRecivedWechatInfo , this);
        this.pTipMask.active = false ;
    }

    start () {
        if ( CC_DEBUG )
        {
            cc.log( "debug , not auto login" );
            return ;
        }

        let client = ClientApp.getInstance().getConfigMgr().getClientConfig();
        if ( client.isHaveValidAccount() )
        {
            this.strAccount = client.validAccount ;
            this.strPassword = client.validPassword ;
            this.isNeedUpdatePlayerInfo = false ;
            console.log( "auto login with stored account" );
            this.doLogin();
        }
    }

    onClickWechatLogin()
    {
        // lanch wechat
        WechatManager.getInstance().reqAuthor();
    }

    onRecivedWechatInfo( event : cc.Event.EventCustom )
    {
        let detail = event.detail ;
        let isOk = detail["isOk"] == 1 ;
        if ( isOk == false )
        {
            Utility.showPromptText( "获取微信授权失败" );
            return ;
        }

        this.isNeedUpdatePlayerInfo = true ;
        this.strAccount = detail["unionid"] ;
        this.strPassword = "mjdsl" ;
        this.strWechatName = detail["nickname"] ;
        this.strWechatHeadUrl = detail["headimgurl"] ; ;
        this.nWechatSex = detail["sex"] ; 
        console.log( "recieved wechat info , try just login " );
        this.doLogin();
    }

    // clientData will recieved base data , and invoke loading scene ;
    onRecievedBaseData()
    {
        let baseData = ClientApp.getInstance().getClientPlayerData().getBaseData();
        if ( this.isNeedUpdatePlayerInfo )  // if click wechat login , we need update payer display info , name , head icon 
        {
            let msgupdateinfo = {} ;
            msgupdateinfo["name"] = this.strWechatName ;
            msgupdateinfo["headIcon"] = this.strWechatHeadUrl;
            msgupdateinfo["sex"] = this.nWechatSex;
            baseData.name = this.strWechatName ;
            baseData.headUrl = this.strWechatHeadUrl ;
            baseData.gender = this.nWechatSex ;
            Network.getInstance().sendMsg(msgupdateinfo,eMsgType.MSG_PLAYER_UPDATE_INFO,eMsgPort.ID_MSG_PORT_DATA,baseData.uid);
        }
        
        if ( baseData.stayInRoomID && baseData.stayInRoomID > 0 )
        {
            cc.director.loadScene(SceneName.Scene_Room) ; 
        }
        else
        {
            cc.director.loadScene(SceneName.Scene_Main) ;
        }
    }

    onReconectedResult( isOk : boolean ) // not mater if we reconnect sucess  , we just login ;
    {
        super.onConnectOpen();
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
                //self.pTipMask.active = ret == 0 ;
                if ( ret == 0 )  // clientData will recieved base data , and invoke loading scene ;
                {
                    // save a valid account , most used when developing state ;
                    ClientApp.getInstance().getConfigMgr().getClientConfig().storeValidAccound(self.strAccount,self.strPassword);
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
        msgReg["cRegisterType"] = this.strWechatName.length > 0  ;
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
                console.log("login scene register ok : " + self.strAccount );
                self.doLogin();
                return true ;
            });
    }

    onClickVisitorBtn( event : cc.Event.EventTouch, customEventData : string )
    {
        let nIdx : number = parseInt(customEventData) ;
        // if ( CC_JSB && 3 == nIdx )
        // {
        //     console.log( "click visitor 4 , we regard it as wechat login" );
        //     this.onClickWechatLogin();
        //     return ;    
        // }

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
        this.isNeedUpdatePlayerInfo = true ;
        console.log( "visitor " + nIdx + " click login" );
        this.doLogin();

        let v = this.pTipMask.position ;
    }
}
