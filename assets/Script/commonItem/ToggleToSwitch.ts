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
export default class ToggleToSwitch extends cc.Component {

    protected mToggle : cc.Toggle = null ;
    protected mBackground : cc.Node = null ;
    onLoad()
    {
        this.mToggle = this.node.getComponent(cc.Toggle);
        this.mBackground = this.node.getChildByName("Background");
        if ( this.mToggle == null || null == this.mBackground )
        {
            cc.error( "当前脚本只能挂接在 toggle组件上，background 名字不能改" );
            return ;
        }

        if ( null == this.mToggle.checkEvents )
        {
            this.mToggle.checkEvents = [] ;
        } 

        let p = new cc.Component.EventHandler() ;
        p.component = "ToggleToSwitch";
        p.handler = "onToggleEvent" ;
        p.target = this.node ;
        this.mToggle.checkEvents.push(p);
        this.onToggleEvent();
    }

    start () {

    }

    protected onToggleEvent()
    {
        this.mBackground.active = this.mToggle.isChecked == false ;
    }

    // update (dt) {}
}
