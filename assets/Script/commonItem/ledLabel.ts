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
export default class LedLabel extends cc.Component {

    @property(cc.Label)
    pContent: cc.Label = null;

    @property(cc.Node)
    pMaskBg: cc.Node = null;

    @property()
    nMoveSpeed : number = 60 ;

    @property
    fDelay : number = 0.5 ;

    private strContent : string = "" ;
    // LIFE-CYCLE CALLBACKS:

    set string( std : string)
    {
        this.strContent = std ;
        //this.pContent.node.setContentSize(cc.size(1,this.pMaskBg.getContentSize().height));
        this.pContent.string = this.strContent ;
        this.pContent.node.stopAllActions();
        this.pContent.node.x = this.pMaskBg.getContentSize().width * 0.5;
        if ( null == std || std == "")
        {
            cc.log( "led content set null" );
            return ;
        }

        // must delay 1 frame , otherwise , Label getSize() is old , not update ;
        // is a fuck skill ;
        let self = this ;
        setTimeout(() => {
            self.prepareMoveAction();
        }, 1);
    }

    onLoad () 
    {
        if ( this.nMoveSpeed == 0 )
        {
            this.nMoveSpeed = 10 ;
        }
    }

    start () {
        //this.string = "断舍离哥哥真是一个好人啊。。太好了，好好好。。。。adlfjahgadfosfg";
    }

    private prepareMoveAction()
    {
        this.pContent.node.stopAllActions();
        // start animation ;
        let nTargetX = -1 * this.pContent.node.getContentSize().width - this.pMaskBg.getContentSize().width * 0.5 ;
        let moveTime : number = ( this.pContent.node.getContentSize().width + this.pMaskBg.getContentSize().width ) / this.nMoveSpeed ;
        let moveTo = cc.moveTo( moveTime,cc.v2(nTargetX,this.pContent.node.y )) ; 
        let delay = cc.delayTime( this.fDelay ) ;
        let self = this;
        let reset = cc.callFunc(()=>{ self.pContent.node.x = self.pMaskBg.getContentSize().width * 0.5 ; });
        let seq = cc.sequence(moveTo,delay,reset);
        let repeat = cc.repeatForever(seq) ;
        this.pContent.node.runAction(repeat);
    }

    // update (dt) {}
}
