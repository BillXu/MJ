import DlgBase from "../../../common/DlgBase";
import Prompt from "../../../globalModule/Prompt";

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
export default class DlgChat extends DlgBase {

    mOnDlgResult : ( isEmoji : boolean , content : string )=>void = null ; // ( isEmoji : bool , content : string )

    mLastTime : number = 0 ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    
    onClickSysText( btn : cc.Event.EventTouch )
    {
        let node : cc.Node = btn.getCurrentTarget();
        let str = node.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string;
        
        this.onReuslt(false,str);
        this.closeDlg();
    }

    onClickEmoji( btn : cc.Event.EventTouch )
    {
        let node : cc.Node = btn.getCurrentTarget();
        let str = node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame.name;

        this.onReuslt(true,str);
        this.closeDlg();
    }

    protected onReuslt( isEmoji : boolean , str : string )
    {
        let now = Date.now();
        if ( now - this.mLastTime < 2 )
        {
            Prompt.promptText("请稍作休息，不能发言太频繁！");
            return ;
        }
        this.mLastTime = now ;
        if ( this.mOnDlgResult != null )
        {
            this.mOnDlgResult( isEmoji,str );
        }
        //cc.Component.EventHandler.emitEvents(this.mOnDlgResult,isEmoji,str);
    }
}
