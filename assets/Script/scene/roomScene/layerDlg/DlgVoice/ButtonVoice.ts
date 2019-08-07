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
export default class ButtonVoice extends cc.Component {

    static BV_EVENT_DOWN : string = "button_down" ;
    static BV_EVENT_RELEASE : string = "button_up" ;
    static BV_EVENT_PRE_CANNCEL : string = "pre_cancel";
    static BV_EVENT_CANNCEL : string = "BV_EVENT_CANNCEL" ;  // mean canncel ;

    @property([cc.Component.EventHandler])
    mCallBack : cc.Component.EventHandler[] = [] ; // ( bvEvent : string ) 

    mDownPos : number =  0  ;
    // LIFE-CYCLE CALLBACKS:
    onLoad () 
    {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this) ;
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCanncel,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
    }

    start () {

    }

    protected onTouchStart( touchEvent : cc.Event.EventTouch )
    {
        cc.Component.EventHandler.emitEvents( this.mCallBack,ButtonVoice.BV_EVENT_DOWN );
        this.mDownPos = touchEvent.getLocationY();
        cc.log( "do voice down " );
    }

    protected onTouchMove( touchEvent : cc.Event.EventTouch )
    {
        let ptPos = touchEvent.getLocationY();
        if ( ptPos - this.mDownPos > 6 )
        {
            cc.Component.EventHandler.emitEvents( this.mCallBack,ButtonVoice.BV_EVENT_PRE_CANNCEL );
            cc.log( "do voice pre canncel " );
        }
    }

    protected onTouchEnd( touchEvent : cc.Event.EventTouch )
    {
        let ptPos = touchEvent.getLocationY();
        if ( ptPos - this.mDownPos > 6 )
        {
            cc.Component.EventHandler.emitEvents( this.mCallBack,ButtonVoice.BV_EVENT_CANNCEL );
            cc.log( "do voice canncel " );
            return ;
        }

        cc.Component.EventHandler.emitEvents( this.mCallBack,ButtonVoice.BV_EVENT_RELEASE );
        cc.log( "do voice finish " );

    }

    protected onTouchCanncel()
    {
        cc.Component.EventHandler.emitEvents( this.mCallBack,ButtonVoice.BV_EVENT_CANNCEL );

        cc.log( "do voice onTouchCanncel finish " );
    }
    // update (dt) {}
}
