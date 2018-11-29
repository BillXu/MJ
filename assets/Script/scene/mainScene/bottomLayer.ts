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
import DlgSetting from "./dlgSetting"
import utility from "../../globalModule/Utility"
@ccclass
export default class BottomLayer extends cc.Component {

    @property(DlgSetting)
    pDlgSetting: DlgSetting = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onBtnSetting()
    {
        this.pDlgSetting.showDlg();
    }

    onBtnShop()
    {
        //utility.showTip("zhege shi yige weniz发掘的发生的噶") ;
        utility.showPromptText( "zhege shi yige weniz发掘的发生的噶" );
        setTimeout(() => {
            utility.showPromptText( "zhege shi yige weniz发掘的发生的噶" );
        }, 4000);

        setTimeout(() => {
            utility.showPromptText( "zhege shi yige weniz发掘的发生的噶" );
        }, 6000);

        setTimeout(() => {
            utility.showPromptText( "zhege shi yige weniz发掘的发生的噶" );
        }, 8000);
    }
    // update (dt) {}
}
