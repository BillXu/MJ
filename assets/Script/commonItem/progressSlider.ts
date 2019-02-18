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

@ccclass
export default class ProgressSlider extends cc.Component {

    @property(cc.ProgressBar)
    pProgess: cc.ProgressBar = null;

    @property(cc.Slider)
    pSlider: cc.Slider = null;
    // LIFE-CYCLE CALLBACKS:

    @property
    btnStep : number = 0.2;

    @property([cc.Component.EventHandler])
    slideEvents: cc.Component.EventHandler[] = [];	

    get progress()
    {
        return this.pSlider.progress ;
    }

    set progress( progess : number )
    {
        this.pSlider.progress = progess ;
        this.pProgess.progress = progess ;
    }

    onLoad () 
    {
        this.pProgess.totalLength = this.pProgess.node.getContentSize().width ;
        this.pProgess.progress = this.pSlider.progress ;
    }

    start () {
        
    }

    onSlider( slider : cc.Slider )
    {
        this.pProgess.progress = slider.progress ;
        cc.Component.EventHandler.emitEvents(this.slideEvents,this);
    }

    onClickLeftBtn()
    {
        let nP = this.progress ;
        nP -= this.btnStep ;
        if ( nP < 0 )
        {
            nP = 0 ;
        }
        this.progress = nP ;
        cc.Component.EventHandler.emitEvents(this.slideEvents,this);
    }

    onClickRightBtn()
    {
        let nP = this.progress ;
        nP += this.btnStep ;
        if ( nP > 1 )
        {
            nP = 1 ;
        }
        this.progress = nP ;
        cc.Component.EventHandler.emitEvents(this.slideEvents,this);
    }
    // update (dt) {}
}
