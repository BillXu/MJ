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
export default class LabelForToggle extends cc.Component {

    mToggle : cc.Toggle = null ;

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        this.mToggle = this.node.parent.getComponent(cc.Toggle);
        if ( this.mToggle == null )
        {
            cc.error( "this script must bind to toggle child label" );
            return ;
        }

        let toggleContainer = this.mToggle.node.parent.getComponent(cc.ToggleContainer);
        let checkEvents : cc.Component.EventHandler[] = null ;
        if ( toggleContainer != null )
        {
            if ( toggleContainer.checkEvents == null )
            {
                toggleContainer.checkEvents = [] ;
            }
            checkEvents = toggleContainer.checkEvents ;
        }
        else
        {
            if ( this.mToggle.checkEvents == null )
            {
                this.mToggle.checkEvents = [] ;
            }
            checkEvents = this.mToggle.checkEvents ;
        }
        // add check ent 
        let handle = new cc.Component.EventHandler();
        handle.target = this.node ;
        handle.component = "LabelForToggle" ;
        handle.handler = "onCheckEvent" ;
        checkEvents.push(handle);
    
        let button = this.node.getComponent( cc.Button );
        if ( button == null )
        {
            button = this.node.addComponent(cc.Button);
        }
        //button.target = this.node ;
        if ( button.clickEvents == null )
        {
            button.clickEvents = [] ;
        }

        handle = new cc.Component.EventHandler();
        handle.target = this.node ;
        handle.component = "LabelForToggle" ;
        handle.handler = "onClickText" ;
        button.clickEvents.push(handle);
    }

    start () {
        this.onCheckEvent();
    }

    onClickText( d : any )
    {
        let isBoreCheck = this.mToggle.isChecked ;
        this.mToggle.node.emit("click") ;
        if ( isBoreCheck )
        {
            this.onCheckEvent();
        }
    }

    onCheckEvent()
    {
        //cc.log( "switch togle = " + this.mToggle.isChecked );
        this.node.color = cc.Color.WHITE.fromHEX( this.mToggle.isChecked ? "#ac1400" : "#8f5721" );
    }

    // update (dt) {}
}
