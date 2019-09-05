import DlgBase from "../../common/DlgBase";
import ClientApp from "../../globalModule/ClientApp";
import { clientEvent } from "../../common/clientDefine";
import Utility from "../../globalModule/Utility";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class DlgSettingSZ extends DlgBase {

    @property(cc.Toggle)
    mMusic : cc.Toggle = null ;

    @property(cc.Toggle)
    mAudioEffect : cc.Toggle = null ;

    @property(cc.Toggle)
    mCommonSpeach : cc.Toggle = null ;

    @property(cc.Toggle)
    mLocalSpeach : cc.Toggle = null ;

    @property( [cc.Toggle] )
    mCardTypes : cc.Toggle[] = [] ;

    @property( [cc.Toggle] )
    mDesk : cc.Toggle[] = [] ;

    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose );
        let setting = ClientApp.getInstance().getConfigMgr().getSettingConfig();
        this.mMusic.isChecked = setting.musicVolume > 0 ;
        this.mAudioEffect.isChecked = setting.effectVolume > 0 ;
        
        this.mCardTypes.forEach( ( v : cc.Toggle, idx : number )=>{ v.isChecked = setting.mjBgIdx == idx; } ) ;
        this.mDesk.forEach( ( v : cc.Toggle, idx : number )=>{ v.isChecked = setting.deskBgIdx == idx ;} );
        this.mCommonSpeach.isChecked = setting.isLocalSpeach == false ;
        this.mLocalSpeach.isChecked = setting.isLocalSpeach;
    }

    onToggleMusic( t : cc.Toggle )
    {
        ClientApp.getInstance().getConfigMgr().getSettingConfig().musicVolume = t.isChecked ? 1 : 0 ;
    }

    onToggleAudioEffect( t : cc.Toggle )
    {
        ClientApp.getInstance().getConfigMgr().getSettingConfig().effectVolume = t.isChecked ? 1 : 0 ;
    }

    onToggleSpeach( t : cc.Toggle )
    {
        ClientApp.getInstance().getConfigMgr().getSettingConfig().isLocalSpeach = this.mLocalSpeach.isChecked ;
    }

    onToggleMJColor( t : cc.Toggle )
    {
        this.mCardTypes.forEach( ( v : cc.Toggle, idx : number )=>{  
            if ( v.isChecked ) 
            {
                ClientApp.getInstance().getConfigMgr().getSettingConfig().mjBgIdx = idx;
                /// dispatch event ;
                let pEvent = new cc.Event.EventCustom(clientEvent.setting_update_deskBg,true) ;
                pEvent.detail = idx ;
                cc.systemEvent.dispatchEvent(pEvent);
                Utility.audioBtnClick();
            }
        } ) ;
    }

    onToggleDeskColor( t : cc.Toggle )
    {
        this.mDesk.forEach( ( v : cc.Toggle, idx : number )=>{  
            if ( v.isChecked ) 
            {
                ClientApp.getInstance().getConfigMgr().getSettingConfig().deskBgIdx = idx;
                /// dispatch event ;
                let pEvent = new cc.Event.EventCustom(clientEvent.setting_update_mjBg,true) ;
                pEvent.detail = idx ;
                cc.systemEvent.dispatchEvent(pEvent);
                Utility.audioBtnClick();
            }
        } ) ;
    }
    // update (dt) {}
}
