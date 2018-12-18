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
import DlgBase from "../../../common/DlgBase"
import ClubData from "./clubData";
export enum eClubSettingBtn
{
    Btn_ControlCenter ,
    Btn_ClubMessage,
    Btn_Notice,
    Btn_Leave,
    Btn_Max,
};

@ccclass
export default class DlgClubSetting extends DlgBase {

    @property(cc.Node)
    pContronlCenter : cc.Node = null ;

    @property(cc.Node)
    pClubMessage : cc.Node = null ;

    @property(cc.Node)
    pNotice : cc.Node = null ;

    @property(cc.Node)
    pLeaveClub : cc.Node = null ;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose);
        let pdata : ClubData = jsUserData ;
        this.pClubMessage.active = pdata.isSelfMgr() || pdata.isSelfOwner();
        this.pNotice.active = this.pClubMessage.active ;
        this.pLeaveClub.active = !pdata.isSelfOwner();
    }

    onClickBtnControlCenter()
    {
        if ( this.pFuncResult )
        {
            this.pFuncResult(eClubSettingBtn.Btn_ControlCenter);
        }
        this.closeDlg();
    }

    onClickClubMessage()
    {
        if ( this.pFuncResult )
        {
            this.pFuncResult(eClubSettingBtn.Btn_ClubMessage);
        }
        this.closeDlg();
    }

    onClickNotice()
    {
        if ( this.pFuncResult )
        {
            this.pFuncResult(eClubSettingBtn.Btn_Notice);
        }
        this.closeDlg();
    }

    onClickLeaveClub()
    {
        if ( this.pFuncResult )
        {
            this.pFuncResult(eClubSettingBtn.Btn_Leave);
        }
        this.closeDlg();
    }

    // update (dt) {}
}
