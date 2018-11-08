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
import Network from "../common/Network"
import ClientData from "./ClientData"
import {clientDefine,SceneName} from "../common/clientDefine"
import { eMsgPort, eMsgType } from "../common/MessageIdentifer"
import Utilty from "./Utility"
@ccclass
export default class ClientNetwork extends cc.Component {

    @property(cc.Label)
    pTip: cc.Label = null;

    @property(cc.Node)
    pRootNode : cc.Node = null ;

    vDefaultIP : string[] = ["192.168.1.56"];

    @property
    strDefaultPort : string = "40012" ;
    // LIFE-CYCLE CALLBACKS; 
    onLoad () 
    {
        ClientData.getInstance().init();
        Network.getInstance().connect(this.getDstIP());
        this.setTipDesc("正在连接服务器........");

        cc.systemEvent.on(clientDefine.netEventFialed,this.onConnectFailed,this) ;
        cc.systemEvent.on(clientDefine.netEventClose,this.onConnectFailed,this) ;
        cc.systemEvent.on( clientDefine.netEventReconnectdFailed,this.onReconnectFailed,this);
        cc.systemEvent.on(clientDefine.netEventOpen,this.onConnectSuccess,this) ;
        cc.systemEvent.on(clientDefine.netEventReconnectd,this.onReconnectedSuccess,this) ;
    }

    // maybe need change ip ;
    onConnectFailed()
    {
        cc.log( "connect failed , will we change ip ?" );
        this.setTipDesc("正在连接服务器........");
    }

    // need to login again, need not change scene
    onReconnectFailed()
    {
        let clientData : ClientData = ClientData.getInstance();
        if ( clientData.curAccount == null || null == clientData.curPwd || clientData.curAccount.length < 1 )
        {
            this.setTipDesc("");
            if ( cc.director.getScene().name != SceneName.Scene_login )
            {
                cc.director.loadScene(SceneName.Scene_login);
            }
            return ;
        }
 
        this.setTipDesc("正在重新登录....");
        let msgLogin = {};
        msgLogin["cAccount"] = clientData.curAccount ;
        msgLogin["cPassword"] = clientData.curPwd ;
        let self = this ;
        Network.getInstance().sendMsg(msgLogin,eMsgType.MSG_PLAYER_LOGIN,eMsgPort.ID_MSG_PORT_GATE,1,
            ( jsmg : Object )=>{
                let ret : number = jsmg["ret"] ;
                self.setTipDesc("");
                if ( ret == 0 )
                {
                    return true ;
                } 
                let vStrTip : string[] = ["0error","1error","2error","3error"] ;
                let stip = "unknown";
                if ( ret < vStrTip.length )
                {
                    stip = vStrTip[ret] ;
                }
                Utilty.showTip(stip);

                // scene to login scene 
                if ( cc.director.getScene().name != SceneName.Scene_login)
                {
                    cc.director.loadScene(SceneName.Scene_login);
                }
                return true ;
            });
    }

    // reconnect success , do nothing here , just hide self ;
    onReconnectedSuccess()
    {
        this.setTipDesc("");
    }

    // show login scene and hide self ;
    onConnectSuccess()
    {
        this.setTipDesc("");
    }

    start () {

    }

    protected setTipDesc( strTip : string )
    {
        this.pTip.string = strTip ;
        this.pRootNode.active = strTip != "" ;
    }

    protected getDstIP() : string
    {
        let strDst : string = "ws://" + this.vDefaultIP[0] + ":" + this.strDefaultPort ;
        return strDst ;
    }
    // update (dt) {}
}
