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
import Prompt from "./Prompt"
import DlgBase from "../common/DlgBase"
@ccclass
export default class Utility  {

    public static showTip( strDesc : string, isOneBtn? : boolean, pfResult? : ( jsResult : Object ) => void , pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        let node = cc.find("persisteNode");
        let pompt = node.getComponent(Prompt);
        pompt.showDlg(strDesc,isOneBtn,pfResult,pfOnClose ) ;
    }

    public static showPromptText( strDesc : string , nDisplayTime : number = 3 )
    {
        let node = cc.find("persisteNode");
        let pompt = node.getComponent(Prompt);
        pompt.showPromptText(strDesc,nDisplayTime) ;
    }

    public static doWait()
    {

    }

    public static onWaitArrived()
    {

    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
