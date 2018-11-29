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
import DlgBase from "../common/DlgBase"
@ccclass
export default class PromptDlg extends DlgBase {

    @property(cc.Label)
    pLabel: cc.Label = null;

    @property(cc.Node)
    pBtnCanncel : cc.Node = null ;
    @property(cc.Node)
    pBtnOk : cc.Node = null ;
    @property(cc.Node)
    pBtnMiddleOk : cc.Node = null ;
    
    isOneBtn : boolean = true ;

    start () {

    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        if ( jsUserData == null )
        {
            console.error( "prompt dlg userdata can not be null" );
            return ;
        }

        this.pBtnCanncel.active = !this.isOneBtn ;
        this.pBtnOk.active = !this.isOneBtn ;
        this.pBtnMiddleOk.active = this.isOneBtn ;

        this.pLabel.string = jsUserData["text"] ;
        super.showDlg(pfResult,jsUserData,pfOnClose) ;
    }

    onClickOk()
    {
        if ( this.pFuncResult )
        {
            this.pFuncResult(this);
            this.pOnCloseCallBack = null ; // do not invoker close ;invoker already known dlg closed ; 
        }
        this.closeDlg();
    }

    onClickCanncel()
    {
        this.closeDlg();
    }

    // update (dt) {}
}
