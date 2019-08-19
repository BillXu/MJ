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
import ProgressSlider from "../../commonItem/progressSlider"
import DlgBase from "../../common/DlgBase"
//import ClientData from "../../globalModule/ClientData"
import Network from "../../common/Network"
import { eMsgPort, eMsgType } from "../../common/MessageIdentifer"
import Utility from "../../globalModule/Utility"
import {clientDefine,SceneName,clientEvent,eMusicType,eDeskBg,eMJBg} from "../../common/clientDefine"
import ClientApp from "../../globalModule/ClientApp";
@ccclass
export default class DlgSetting extends DlgBase {
    @property
    isInMainScene : boolean = false ;

    @property(cc.Node)
    pBtnLogout : cc.Node = null ;

    @property(cc.Node)
    pBtnApplyDismiss : cc.Node = null ;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Label)
    pLabelVersion: cc.Label = null;

    @property(ProgressSlider)
    pEffectVoluem : ProgressSlider = null ;

    @property(ProgressSlider)
    pMusicVolume : ProgressSlider = null ;

    @property([cc.Toggle])
    vMusicType : cc.Toggle[] = [] ;

    @property([cc.Toggle])
    vDeskBg : cc.Toggle[] = [] ;

    @property( [cc.Toggle] )
    vMJBg : cc.Toggle[] = [] ;
    

    onLoad ()
    {
        super.onLoad();
        this.pBtnApplyDismiss.active = !this.isInMainScene ;
        this.pBtnLogout.active = this.isInMainScene ;
        this.pLabelVersion.string = ClientApp.getInstance().getConfigMgr().getClientConfig().VERSION;
    }

    start () {
        this.refreshSetingDisplay();
    }

    onClickLogout()
    {
        let msg = {} ;
        let self = this ;
        // Network.getInstance().sendMsg(msg,eMsgType.MSG_PLAYER_LOGOUT,eMsgPort.ID_MSG_PORT_DATA,ClientData.getInstance().selfUID,
        // ( jmsg : Object )=>{ 
        //     let ret : number = jmsg["ret"] ;
        //     if ( 0 == ret )
        //     {
        //         ClientData.getInstance().clearWhenLogout();
        //         cc.director.loadScene(SceneName.Scene_login) ;
        //         self.closeDlg();
        //     }
        //     else
        //     {
        //         Utility.showTip("logout error code " + ret ) ;
        //     }
        //     return true ;
        // }) ;

        let uid = ClientApp.getInstance().getClientPlayerData().getSelfUID();
        Network.getInstance().sendMsg(msg,eMsgType.MSG_PLAYER_LOGOUT,eMsgPort.ID_MSG_PORT_DATA, uid );
        ClientApp.getInstance().onPlayerClearLogout();
        self.closeDlg();
        cc.director.loadScene(SceneName.Scene_login) ;
        Utility.audioBtnClick();
    }

    onClickApplyDismiss()
    {
        Utility.audioBtnClick();
    }

    onAudioEffectSlider( pSlider : ProgressSlider )
    {
        ClientApp.getInstance().getConfigMgr().getSettingConfig().effectVolume = pSlider.progress;
        cc.audioEngine.setEffectsVolume(pSlider.progress);
    }

    onMusicSlider( pSlider : ProgressSlider )
    {
        ClientApp.getInstance().getConfigMgr().getSettingConfig().musicVolume = pSlider.progress;
        cc.audioEngine.setMusicVolume(pSlider.progress) ;
    }

    onToggleMusicType( toggle : cc.Toggle, selIdx : string )
    {
        let type : eMusicType = parseInt(selIdx) ;
        ClientApp.getInstance().getConfigMgr().getSettingConfig().musicTypeIdx = type;
        Utility.bgMusic(type) ;
        /// dispatch event ;
        let pEvent = new cc.Event.EventCustom(clientEvent.setting_upate_Music,true) ;
        pEvent.detail = type ;
        cc.systemEvent.dispatchEvent(pEvent);
        Utility.audioBtnClick();
    }

    onToggleBackgroundType( toggle : cc.Toggle, selIdx : string )
    {
        let type : eDeskBg = parseInt(selIdx) ;
        ClientApp.getInstance().getConfigMgr().getSettingConfig().deskBgIdx = type;
        /// dispatch event ;
        let pEvent = new cc.Event.EventCustom(clientEvent.setting_update_deskBg,true) ;
        pEvent.detail = type ;
        cc.systemEvent.dispatchEvent(pEvent);
        Utility.audioBtnClick();
    }

    onToggleMJType( toggle : cc.Toggle, selIdx : string )
    {
        let type : eMJBg = parseInt(selIdx);
        ClientApp.getInstance().getConfigMgr().getSettingConfig().mjBgIdx = type;

        /// dispatch event ;
        let pEvent = new cc.Event.EventCustom(clientEvent.setting_update_mjBg,true) ;
        pEvent.detail = type ;
        cc.systemEvent.dispatchEvent(pEvent);
        Utility.audioBtnClick();
    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose) ;
        this.refreshSetingDisplay();
    }

    protected refreshSetingDisplay()
    {
        let setting = ClientApp.getInstance().getConfigMgr().getSettingConfig();
        this.pEffectVoluem.progress = setting.effectVolume;
        this.pMusicVolume.progress = setting.musicVolume ;
        this.updateToggleGroupCheck(this.vMusicType,setting.musicTypeIdx );
        this.updateToggleGroupCheck(this.vDeskBg,setting.deskBgIdx );
        this.updateToggleGroupCheck(this.vMJBg, setting.mjBgIdx );
    }

    protected updateToggleGroupCheck( v : cc.Toggle[] , idx : number )
    {
        if ( v.length <= idx )
        {
            cc.error( "invalid check idx " + idx );
            return ;
        }
        v.forEach( ( toggle : cc.Toggle,index : number )=>{ toggle.isChecked = idx == index ;} );
    }
    // update (dt) {}
}
