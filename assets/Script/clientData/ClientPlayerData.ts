import { eMsgType, eMsgPort } from "../common/MessageIdentifer";
import Network from "../common/Network";
import ClientPlayerBaseData from "./ClientPlayerBaseData";
import ClientPlayerClubs from "./ClientPlayerClubs";
import RecorderData from "./RecorderData";

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
export default class ClientPlayerData {

    static EVENT_RECIEVED_BASE_DATA : string = "recieved_player_baseData" ;
    static EVENT_REFRESH_MONEY : string = "refresh_money" ;

    private _baseData : ClientPlayerBaseData = null ;
    private _Clubs : ClientPlayerClubs = null ;
    private _Recorders : RecorderData = null ;
 
    init()
    {
        cc.systemEvent.on(Network.EVENT_MSG,( event : cc.Event.EventCustom )=>{
            let nMsgID : number = event.detail[Network.MSG_ID] ;
            let msg : Object = event.detail[Network.MSG_DATA] ;
            this.onMsg(nMsgID,msg);
        }) ;
    }

    onMsg( msgID : eMsgType , msg : Object )
    {
        switch ( msgID )
        {
            case eMsgType.MSG_PLAYER_BASE_DATA:
            {
                if ( this._baseData == null )
                {
                    this._baseData = new ClientPlayerBaseData();
                }
                this._baseData.initByMsg(msg);

                if ( this._Clubs == null )
                {
                    this._Clubs = new ClientPlayerClubs();
                    this._Clubs.init(this) ;
                }
                
                if ( this._Recorders == null )
                {
                    this._Recorders = new RecorderData();
                    this._Recorders.init(this.getSelfUID(),false) ;
                }
                
                // dispatch event ;
                let pEvent = new cc.Event.EventCustom(ClientPlayerData.EVENT_RECIEVED_BASE_DATA,true) ;
                pEvent.detail = this._baseData ;
                cc.systemEvent.dispatchEvent(pEvent);
            }
            break ;
            case eMsgType.MSG_PLAYER_REFRESH_MONEY:
            {
                this._baseData.coin = msg["coin"] ;
                this._baseData.diamond = msg["diamond"] ;
    
                let pEvent = new cc.Event.EventCustom(ClientPlayerData.EVENT_REFRESH_MONEY,true) ;
                pEvent.detail = this._baseData ;
                cc.systemEvent.dispatchEvent(pEvent);
            }
            break;
            default:
            {
                if ( this._Clubs && this._Clubs.onMsg(msgID,msg) )
                {
                    return true ;
                }
            }
            return ;
        }
    }

    getBaseData() : ClientPlayerBaseData
    {
        return this._baseData ;
    }

    getClubs() : ClientPlayerClubs
    {
        return this._Clubs ;
    }

    getRecorder() : RecorderData
    {
        return this._Recorders ;
    }

    getSelfUID() : number
    {
        return this.getBaseData().uid ;
    }

    onPlayerClearLogout()
    {
        console.error("clear cacher data");
        // destroy component data 
        this._Clubs.onDestry() ;
        this._Clubs = null ;

        this._baseData = null ;
    }

    sendMsg( jsMsg : Object , msgID : eMsgType, targetPort : eMsgPort , targetID : number )
    {
        Network.getInstance().sendMsg(jsMsg,msgID,targetPort,targetID) ;
    }
}