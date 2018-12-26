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
import PhotoItem from "../../commonItem/photoItem"
import ClientData from "../../globalModule/ClientData"
import { clientDefine } from "../../common/clientDefine"
import { eMsgType } from "../../common/MessageIdentifer"
import GPSManager from "../../sdk/GPSManager";
@ccclass
export default class SelfInfoLayer extends cc.Component {

    @property(cc.Label)
    pLabelName: cc.Label = null;

    @property(cc.Label)
    pLabelUID: cc.Label = null;

    @property(cc.Label)
    pLabelDiamond: cc.Label = null;

    @property(cc.Label)
    pLabelCoin : cc.Label = null ;

    @property(cc.Label)
    pLabelTicket : cc.Label = null ;

    @property(PhotoItem)
    pPhoto : PhotoItem  = undefined;


    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        cc.systemEvent.on(clientDefine.netEventRecievedBaseData,this.onUpdateClientData,this) ;
        cc.systemEvent.on(clientDefine.netEventMsg,this.onMsg,this);
        cc.systemEvent.on(clientDefine.netEventReconnectd,this.doRefreshGPS,this);
    }

    doRefreshGPS()
    {
        // in main scene , when we reconected we must refresh gps ;
        if ( ClientData.getInstance().isNeedRefreshGPS )
        {
            GPSManager.getInstance().requestGPS(true) ;
        }
    }

    private onUpdateClientData()
    {
        let baseDataMsg : Object = ClientData.getInstance().jsSelfBaseDataMsg ;
        this.pLabelUID.string = baseDataMsg["uid"] || "0";
        this.pLabelName.string = baseDataMsg["name"] || "0"  ;
        this.pLabelDiamond.string = baseDataMsg["diamond"] || "0" ;
        this.pLabelCoin.string = baseDataMsg["coin"] || "0" ;
        this.pLabelTicket.string = "null";//baseDataMsg[""] ;
        this.pPhoto.photoURL = baseDataMsg["headIcon"] || "0";

        this.doRefreshGPS();
    }

    private onMsg( event : cc.Event.EventCustom )
    {
        let nMsgID : number = event.detail[clientDefine.msgKey] ;
        let msg : Object = event.detail[clientDefine.msg] ;

        if ( eMsgType.MSG_PLAYER_REFRESH_MONEY == nMsgID )
        {
            this.pLabelCoin.string = msg["coin"] ;
            this.pLabelDiamond.string = msg["diamond"] ;
            return ;
        }
    }

    start () {
        this.onUpdateClientData();
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }
    // update (dt) {}
}
