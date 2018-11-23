import { eMsgType } from "../../common/MessageIdentifer"
import RoomScene  from "./roomScene"
import { IOneMsgCallback } from "../../common/NetworkInterface"
import RoomData from "./roomData"
const {ccclass, property} = cc._decorator;
@ccclass
export default abstract class roomSceneLayerBase extends cc.Component 
{
    protected _roomScene : RoomScene = null ;
    get roomScene () : RoomScene
    {
        return this._roomScene ;
    }

    set roomScene( scene : RoomScene )
    {
        this._roomScene = scene ;
    }

    abstract refresh( pData : RoomData );
    onMsgBeforeData( nMsgID : eMsgType , msg : Object ) : boolean { return false ;} ;
    onMsg( nMsgID : eMsgType , msg : Object ) : boolean { return false ;}
    //----state-----
    abstract enterWaitReadyState( pdata : RoomData ) : void ;
    abstract enterGameState( pdata : RoomData ) : void ;
 
    sendRoomMsg( msg : Object , msgID : eMsgType, callBack? : IOneMsgCallback ) : boolean
    {
        return this.roomScene.sendRoomMsg(msg,msgID,callBack);
    }
}