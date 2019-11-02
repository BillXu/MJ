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
export default class LabelTimer extends cc.Component {

     
    @property
    mLimit : number = 0 ;

    @property
    mIsIncrease : boolean = true ;

    @property([cc.Component.EventHandler])
    mOnReachLimit : cc.Component.EventHandler[] = [] ;

    protected mLabel : cc.Label = null ;
    protected mCurTime : number = 0 ;
    
    setTime( n : number )
    {
        this.mCurTime = n ;
        this.unscheduleAllCallbacks();
        if ( this.mCurTime == this.mLimit )
        {
            this.mLabel.string = "" + this.mCurTime;
        }
        this.schedule(this.refreshTime,1,cc.macro.REPEAT_FOREVER,0 ) ; 
    }

    protected refreshTime()
    {
        if ( this.mCurTime == this.mLimit )
        {
            cc.Component.EventHandler.emitEvents(this.mOnReachLimit);
            this.unscheduleAllCallbacks();
            return ;
        }
 
        this.mCurTime = this.mCurTime + ( this.mIsIncrease ? 1 : -1 ) ;
        if ( ( this.mIsIncrease && this.mCurTime >= this.mLimit ) || ( this.mIsIncrease == false && this.mCurTime <= this.mLimit ) )
        {
            this.mCurTime == this.mLimit
        }

        if ( this.mLabel == null )
        {
            cc.error( "why label is null ?" );
            return ;
        }
        this.mLabel.string = "" + this.mCurTime;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        this.mLabel = this.node.getComponent(cc.Label);
        if ( this.mLabel == null )
        {
            cc.error( "script must add to label node " );
            return ;
        }
    }

 
    // update (dt) {}
}
