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
import {clientDefine,SceneName, eGameType, eMailType} from "../common/clientDefine"
import { eMsgPort, eMsgType } from "../common/MessageIdentifer"
import Utilty from "./Utility"
import IModule from "../common/IModule";
import ConfigManager from "../config/ConfigManager";
import ClientPlayerData from "../clientData/ClientPlayerData";
import GPSManager from "../sdk/GPSManager";
import Utility from "./Utility";
import LayerNetstate from "./LayerNetstate";
@ccclass
export default class ClientApp extends IModule {

    @property(LayerNetstate)
    pLayerNetState : LayerNetstate = null ;

    private _configMgr : ConfigManager = null ;
    private _clientPlayerData : ClientPlayerData = null ;
    private static s_instance : ClientApp = null ;

    // LIFE-CYCLE CALLBACKS; 
    static getInstance() : ClientApp { return ClientApp.s_instance ;}
    onLoad () 
    {
        if ( null == ClientApp.s_instance )
        {
            ClientApp.s_instance = this ;
        }
        
        this.init();
    }

    start () {
        // connect to svr 
        Network.getInstance().connect(this.getConfigMgr().getServerIPStrategyConfig().getSvrIP(1)) ;
        this.pLayerNetState.onStartConnect();
    }

    init()
    {
        super.init();
        cc.systemEvent.on(ClientPlayerData.EVENT_RECIEVED_BASE_DATA,this.onRegisteredEvent,this) ;
        cc.systemEvent.on(GPSManager.EVENT_GPS_RESULT,this.onRegisteredEvent,this) ;
        if ( null == this._configMgr )
        {
            this._configMgr = new ConfigManager();
        }
        this._configMgr.init();

        if ( null == this._clientPlayerData )
        {
            this._clientPlayerData = new ClientPlayerData();
        }
        this._clientPlayerData.init();
    }

    getConfigMgr() : ConfigManager
    {
        return this._configMgr ;
    }

    getClientPlayerData() : ClientPlayerData
    {
        return this._clientPlayerData ;
    }

    onRegisteredEvent( event : cc.Event )
    {
        let type = event.getType();
        switch ( type )
        {
            case ClientPlayerData.EVENT_RECIEVED_BASE_DATA:
            {
                GPSManager.getInstance().requestGPS(true) ;
            }
            break;
            case GPSManager.EVENT_GPS_RESULT:
            {
                this.onGPSResult(<cc.Event.EventCustom>event);
            }
            break;
            default:
            {
                console.error( "not process event " + type );
            }
            return ;
        }
    }

    protected onGPSResult( event : cc.Event.EventCustom )
    {
        let jsDetail = event.detail;
        let code : number = jsDetail["code"] ;
        if ( code != 0 )
        {
            console.error( "read gps failed" );
            Utility.showPromptText("获取地理位置失败，请前往系统【设置】打开位置权限");
        }
        else
        {
            //this._lastRefreshGPS = Date.now();
            this.getClientPlayerData().getBaseData().GPSAddress = jsDetail["address"];
            console.log( "my address : " + jsDetail["address"] );
        }

        let msg = {} ;
        msg["J"] = code != 0 ? 0 : jsDetail["longitude"] ;
        msg["W"] = code != 0 ? 0 : jsDetail["latitude"] ;
        this.getClientPlayerData().getBaseData().GPS_J = msg["J"] ;
        this.getClientPlayerData().getBaseData().GPS_W = msg["W"] ;
        Network.getInstance().sendMsg(msg,eMsgType.MSG_PLAYER_UPDATE_GPS,eMsgPort.ID_MSG_PORT_DATA,this.getClientPlayerData().getBaseData().uid) ;
    }

    onAppShow()
    {
        super.onAppShow();
    }

    onAppHide()
    {
        super.onAppHide();
        this.getConfigMgr().onAppHide();
    }

    onMsg( msgID : eMsgType, msg : Object ) : boolean
    {
        switch ( msgID )
        {
            case eMsgType.MSG_NEW_MAIL:
            {
                let mailType : eMailType = msg["type"] ;
                let deail : Object = msg["detail"] ;
                this.onMailEvent(mailType,deail);
            }
            break;
            default:
            return super.onMsg(msgID,msg);
        }
    }

    onDisconnected()
    {
        super.onDisconnected();
        this.getConfigMgr().getServerIPStrategyConfig().onConnectResult(false) ;
        Network.getInstance().tryNewDstIP(this.getConfigMgr().getServerIPStrategyConfig().getSvrIP(1));
        this.pLayerNetState.onTryReconnect();
    }

    onConnectOpen()
    {
        super.onConnectOpen();
        this.getConfigMgr().getServerIPStrategyConfig().onConnectResult(true) ;
        this.pLayerNetState.onConnected();
    }

    onReconectedResult( sucess : boolean )
    {
        super.onReconectedResult(sucess);
        if ( false == sucess )
        {
            this.tryAutoLogin();
        }
    }

    onPlayerClearLogout()
    {
        this.getConfigMgr().onClearLogout();
        this.getClientPlayerData().onPlayerClearLogout();
    }

    onMailEvent( mailType : eMailType , deail : Object )
    {
        switch ( mailType )
        {
            case eMailType.eMail_ResponeClubApplyJoin:
            {
                let clubID : number = deail["clubID"] ;
                let isAgree = deail["nIsAgree"] == 1 ;
                if ( isAgree )
                {
                    //this.onJoinedNewClubID(clubID);
                }
                
                let str = "俱乐部：" + deail["clubName"] + " 的管理员" + (isAgree ? "同意了" : "拒绝了" )+ "您的加入申请。";
                Utility.showPromptText(str);

                if ( isAgree )
                {
                    // let ev : any = clientEvent.event_joined_club ;
                    // let pEvent = new cc.Event.EventCustom(ev,true) ;
                    // pEvent.detail = clubID;
                    // cc.systemEvent.dispatchEvent(pEvent);
                    this.getClientPlayerData().getClubs().addClub(clubID);
                }
            }
            break;
            case eMailType.eMail_ClubBeKick:
            {
                 let clubID : number = deail["clubID"] ;
                // this.onDoLevedClub(clubID);
                let str = "您被俱乐部：" + deail["clubName"] + " 的管理员请出了俱乐部";
                Utility.showPromptText(str);

                // let ev : any = clientEvent.event_leave_club ;
                // let pEvent = new cc.Event.EventCustom(ev,true) ;
                // pEvent.detail = clubID;
                // cc.systemEvent.dispatchEvent(pEvent);
                this.getClientPlayerData().getClubs().deleteClub(clubID);
            }
            break;
            case eMailType.eMail_ClubDismiss:
            {
                let clubID : number = deail["clubID"] ;
                // this.onDoLevedClub(clubID);
                let str = "您所在的俱乐部：" + deail["clubName"] + " 已经解散了。";
                Utility.showPromptText(str);
                
                // let ev : any = clientEvent.event_leave_club ;
                // let pEvent = new cc.Event.EventCustom(ev,true) ;
                // pEvent.detail = clubID;
                // cc.systemEvent.dispatchEvent(pEvent);
                this.getClientPlayerData().getClubs().deleteClub(clubID);
            }
            break;
        }
    }

    private tryAutoLogin()
    {
        let clientConfig = this.getConfigMgr().getClientConfig();
        if ( clientConfig.isHaveValidAccount() == false )
        {
            return ;
        }

        let msgLogin = {};
        msgLogin["cAccount"] = clientConfig.validAccount ;
        msgLogin["cPassword"] = clientConfig.validPassword ;
        let self = this ;
        Network.getInstance().sendMsg(msgLogin,eMsgType.MSG_PLAYER_LOGIN,eMsgPort.ID_MSG_PORT_GATE,1,
            ( jsmg : Object )=>{
                let ret : number = jsmg["ret"] ;
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
    // update (dt) {}
}
