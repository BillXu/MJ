import { eMsgType, eMsgPort } from "./MessageIdentifer";
import { IOneMsgCallback } from "./NetworkInterface";
import Network from "./Network";

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
export default class IModule extends cc.Component {

    onLoad()
    {
        this.init();
    }

    onDestroy()
    {
        this.unregisterEventListener();
    }

    protected init()
    {
        this.registerEventListener();
    }

    protected registerEventListener()
    {
        this.unregisterEventListener();
        
        cc.systemEvent.on(Network.EVENT_MSG,this.onEvent,this);
        cc.systemEvent.on(Network.EVENT_RECONNECT,this.onEvent,this);
        cc.systemEvent.on(Network.EVENT_OPEN,this.onEvent,this);
        cc.systemEvent.on(Network.EVENT_RECONNECTED_FAILED,this.onEvent,this);
        cc.systemEvent.on(Network.EVENT_CLOSED,this.onEvent,this);
        cc.systemEvent.on(Network.EVENT_FAILED,this.onEvent,this);

        cc.game.on(cc.game.EVENT_SHOW,this.onAppShow,this) ;
        cc.game.on(cc.game.EVENT_HIDE,this.onAppHide,this) ;
    }

    protected unregisterEventListener()
    {
        cc.game.targetOff(this);
        cc.systemEvent.targetOff(this);
    }

    private onEvent( event : cc.Event )
    {
        let type = event.getType();
        switch ( type )
        {
            // case cc.game.EVENT_SHOW:
            // {
            //     this.onAppShow();
            // }
            // break;
            // case cc.game.EVENT_HIDE:
            // {
            //     this.onAppHide();
            // }
            // break;
            case Network.EVENT_RECONNECT:
            {
                this.onReconectedResult(true);
            }
            break;
            case Network.EVENT_RECONNECTED_FAILED:
            {
                this.onReconectedResult(false);
            }
            break;
            case Network.EVENT_OPEN:
            {
                this.onConnectOpen();
            }
            break;
            case Network.EVENT_CLOSED:
            case Network.EVENT_FAILED:
            {
                this.onDisconnected();
            }
            break;
            case Network.EVENT_MSG:
            {
                let cevent = <cc.Event.EventCustom>(event);
                let nMsgID : number = cevent.detail[Network.MSG_ID] ;
                let msg : Object = cevent.detail[Network.MSG_DATA] ;
                if ( this.onMsg(nMsgID,msg) )
                {
                    event.stopPropagation();
                }
            }
            break;
            default:
            console.error( "unknown event type " + type + " we do not process" );
            break ;
        }
    }

    protected onAppShow()
    {
        console.log( "onAppShow" );
    }

    protected onAppHide()
    {
        console.log( "onAppHide" );
    }

    protected onMsg( msgID : eMsgType, msg : Object ) : boolean 
    {
        return false ;
    }

    protected onDisconnected()
    {

    }

    protected onConnectOpen()
    {

    }

    protected onReconectedResult( isSuccess : boolean )
    {

    }

    sendMsg( jsMsg : Object , msgID : eMsgType, targetPort : eMsgPort , targetID : number , callBack? : IOneMsgCallback ):boolean
    {
        return Network.getInstance().sendMsg(jsMsg,msgID,targetPort,targetID,callBack) ;
    }

    // update (dt) {}
}
