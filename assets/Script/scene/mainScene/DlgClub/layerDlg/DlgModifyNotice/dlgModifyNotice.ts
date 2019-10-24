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

import DlgBase from "../../../../../common/DlgBase";
import Utility from "../../../../../globalModule/Utility";
@ccclass
export default class DlgModifyNotice extends DlgBase {

    @property(cc.Label)
    pName: cc.Label = null;

    @property(cc.EditBox)
    pInputContent: cc.EditBox = null;

    @property(cc.Node)
    pBtnEnterModifyMode : cc.Node = null ;

    @property(cc.Node)
    pBtnDoModify : cc.Node = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose);
        this.pName.string = jsUserData["name"] ;
        this.pInputContent.placeholder = jsUserData["notice"] ;
        this.pInputContent.string = jsUserData["notice"] ;
        this.pBtnDoModify.active = false ;
        this.pBtnEnterModifyMode.active = !this.pBtnDoModify.active ;
    }

    onModifyNotice()
    {
        this.pInputContent.setFocus();
        this.pBtnDoModify.active = true ;
        this.pBtnEnterModifyMode.active = !this.pBtnDoModify.active ;
        Utility.audioBtnClick();
    }

    onStartInput()
    {
        this.pBtnDoModify.active = true ;
        this.pBtnEnterModifyMode.active = !this.pBtnDoModify.active ;
    }

    onDoModifyNotice()
    {
        if ( this.pInputContent.string.length < 1 )
        {
            Utility.showPromptText( "公告内容不能为空" );
            return ;
        }

        if ( this.pInputContent.string == this.pInputContent.placeholder )
        {
            Utility.showPromptText( "公告内容无变化" );
            return ;
        }

        if ( this.pFuncResult )
        {
            this.pFuncResult(this.pInputContent.string) ;
        }

        this.pBtnDoModify.active = false ;
        this.pBtnEnterModifyMode.active = !this.pBtnDoModify.active ;
        Utility.audioBtnClick();
    }

    // update (dt) {}
}
