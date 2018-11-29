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
import DlgBase from "../../common/DlgBase"
@ccclass
export default class DlgDuiPu extends DlgBase {

    @property(cc.Node)
    pSelOpt: cc.Node = null;

    @property(cc.Node)
    pSelScore : cc.Node = null ;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        this.pSelOpt.active = true ;
        this.pSelScore.active = false ;
        super.showDlg(pfResult,jsUserData,pfOnClose) ;
    }

    onClickDuiPu()
    {
        this.pSelOpt.active = false ;
        this.pSelScore.active = true ;
    }

    onClickPass()
    {
        this.closeDlg();
    }

    onClickScore( event : cc.Event.EventTouch, score : string )
    {
        if ( this.pFuncResult )
        {
            let s = parseInt(score);
            this.pFuncResult(s) ;
        }
        this.closeDlg();
    }
    // update (dt) {}
}
