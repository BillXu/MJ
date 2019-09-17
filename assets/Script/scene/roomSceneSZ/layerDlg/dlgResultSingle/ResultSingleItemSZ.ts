import PlayerInfoItem from "../../../../commonItem/PlayerInfoItem";
import MJPlayerCardHold from "../../../roomScene/layerCards/cards2D/MJPlayerCardHold";
import MJCardMing2D from "../../../roomScene/layerCards/cards2D/MJCardMing2D";
import { IPlayerCards, PlayerActedCard } from "../../../roomScene/roomData/MJPlayerCardData";
import { IResultSingleItemData } from "./IResultSingleItemData";
import { eMJActType } from "../../../roomScene/roomDefine";

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
export default class ResultSingleItemSZ extends cc.Component {

    @property(PlayerInfoItem)
    mPlayerInfo: PlayerInfoItem = null;

    @property(cc.Node)
    mIconOwner : cc.Node = null ;

    @property(cc.Node)
    mIconZiMo : cc.Node = null ;

    @property(cc.Node)
    mIconFangPao : cc.Node = null ;
    
    @property(cc.Node)
    mIconHu : cc.Node = null ;

    @property(cc.Node)
    mSelfBg : cc.Node = null ;

    @property(cc.Label)
    mHuDetail : cc.Label = null ;

    @property(cc.Label)
    mOffset : cc.Label = null ;
    // LIFE-CYCLE CALLBACKS:

    @property(MJPlayerCardHold)
    mCardHold : MJPlayerCardHold = null ;

    @property(MJCardMing2D)
    mCardMing : MJCardMing2D = null ;
    onLoad ()
    {
        this.mCardHold.posIdx = 0 ;
        this.mCardHold.isReplay = true ;
        this.mCardMing.posIdx = 0 ;
    }

    start () {
        // let self = this ;
        // setTimeout(() => {
        //     self.test(); 
        // }, 2000);
    }

    protected set offset( offset : number )
    {
        this.mOffset.string = ( offset > 0 ? "+" : "" ) + offset;
        this.mOffset.node.color = cc.Color.WHITE.fromHEX( offset >= 0 ? "#FFD15900" : "#FF127EC9" );
    }

    protected setCardInfo( cardsInfo : IPlayerCards )
    {
        this.mCardHold.refresh(cardsInfo.vHoldCard) ;
        this.mCardMing.refresh(cardsInfo.vMingCards) ;
        this.mCardHold.node.position = cc.v2(this.mCardMing.getContentlength() + 20,0);
    }

    refreshItem( data : IResultSingleItemData )
    {
        this.mPlayerInfo.refreshInfo(data.getUID()) ;
        this.mIconOwner.active = data.isRoomOwner();
        this.mIconHu.active = data.isHu();
        this.mIconFangPao.active = data.isDianPao();
        this.mIconZiMo.active = data.isZiMo();
        this.offset = data.getOffset();
        this.setCardInfo( data.getPlayerCard() );
        this.mHuDetail.node.active = data.isHu();
        if ( data.isHu() )
        {
            this.mHuDetail.string = data.getHuDetail();
        }
        this.mSelfBg.active = data.isSelf() ;
    }

    test()
    {
        //this.mHuDetail.node.active = false ;
        this.mCardHold.refresh( [19,19,19,19,19]) ;
        let p = new PlayerActedCard();
        p.eAct = eMJActType.eMJAct_AnGang ;
        p.nTargetCard = 20 ;
        this.mCardMing.refresh([ p,p ,p ]) ;
        this.mCardHold.node.position = cc.v2(this.mCardMing.getContentlength() + 12,0);
    }
    // update (dt) {}
}
