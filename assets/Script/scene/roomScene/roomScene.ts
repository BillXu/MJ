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
import RoomData from "./roomData"
import RoomInfoLayer from "./roomInfoLayer"
import PlayerInfoLayer from "./playerInfoLayer"
import PlayerCardsLayer from "./playerCardsLayer"
import { eMsgPort , eMsgType } from "../../common/MessageIdentifer"
import Network from "../../common/Network"
import { clientDefine , SceneName } from "../../common/clientDefine"
import ClientData from "../../globalModule/ClientData"
@ccclass
export default class RoomScene extends cc.Component {

    @property(RoomData)
    pRoomData: RoomData = null;

    @property(RoomInfoLayer)
    pLayerRoomInfo : RoomInfoLayer = null ;

    @property(PlayerInfoLayer)
    pLayerPlayerInfo : PlayerInfoLayer = null ;

    @property(PlayerCardsLayer)
    pLayerPlayerCards : PlayerCardsLayer = null ;

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        cc.systemEvent.on(clientDefine.netEventMsg,this.onMsg,this) ;
        cc.systemEvent.on(clientDefine.netEventRecievedBaseData,this.doRequestRoomInfoToRefreshRoom,this) ;
    }

    start () {
        this.doRequestRoomInfoToRefreshRoom();
    }

    onMsg( event : cc.Event.EventCustom )
    {
        let nMsgID : eMsgType = event.detail[clientDefine.msgKey] ;
        let msg : Object = event.detail[clientDefine.msg] ;
        switch ( nMsgID )
        {
            case eMsgType.MSG_ROOM_INFO:
            {

            }
            break ;
            case eMsgType.MSG_ROOM_PLAYER_INFO:
            {

            }
            break ;
        } 
    }

    doRequestRoomInfoToRefreshRoom()
    {
        // request room info ;
        let nRoomID = ClientData.getInstance().stayInRoomID ;
        if ( nRoomID == -1 || 0 == nRoomID )
        {
            cc.director.loadScene(SceneName.Scene_Main);
            return ;
        }

        let msgReqRoomInfo = { } ;
        let port = ClientData.getInstance().getMsgPortByRoomID(nRoomID);
        Network.getInstance().sendMsg(msgReqRoomInfo,eMsgType.MSG_REQUEST_ROOM_INFO,port,nRoomID) ;
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }
    // update (dt) {}
}
