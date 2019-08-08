import DlgBase from "../../../common/DlgBase";

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
export default class DlgShowMore extends DlgBase {

    static BTN_LEAVE : string = "BTN_LEAVE" ;
    static BTN_DISMISS : string = "BTN_DISMISS" ;
    static BTN_SETTING : string = "BTN_SETTING" ;

    @property([cc.Component.EventHandler])
    mOnDlgResult : cc.Component.EventHandler[] = [] ;  // ( btnType : string )

    protected onClickButton( ent : cc.Event.EventTouch , strBtnType : string )
    {
        cc.Component.EventHandler.emitEvents( this.mOnDlgResult,strBtnType );
        this.closeDlg();
    }
}
