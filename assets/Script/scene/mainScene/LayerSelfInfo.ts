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
import PlayerInfoItem from "../../commonItem/PlayerInfoItem";
import ClientPlayerData from "../../clientData/ClientPlayerData";
import ClientPlayerBaseData from "../../clientData/ClientPlayerBaseData";
import ClientApp from "../../globalModule/ClientApp";
import PlayerInfoData from "../../clientData/playerInfoData";
@ccclass
export default class LayerSelfInfo extends cc.Component {

    @property(PlayerInfoItem)
    pSelfInfoItme : PlayerInfoItem = null ;

    @property(cc.Label)
    pLabelDiamond: cc.Label = null;

    @property(cc.Label)
    pLabelCoin : cc.Label = null ;


    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        cc.systemEvent.on(ClientPlayerData.EVENT_REFRESH_MONEY,this.onUpdateMoney,this) ;
    }

    start () {
         let p : ClientPlayerBaseData = ClientApp.getInstance().getClientPlayerData().getBaseData();
         this.pLabelDiamond.string = p.diamond + "" ;
         this.pLabelCoin.string = p.coin + "" ;
         this.pSelfInfoItme.doRefresh(<PlayerInfoData>p) ;
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    private onUpdateMoney( event : cc.Event.EventCustom )
    {
        let p : ClientPlayerBaseData = event.detail ;
        this.pLabelDiamond.string = p.diamond + "" ;
        this.pLabelCoin.string = p.coin + "" ;
    }
    // update (dt) {}
}
