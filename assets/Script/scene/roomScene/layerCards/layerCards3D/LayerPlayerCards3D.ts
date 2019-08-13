import ILayerPlayerCard from "../ILayerPlayerCard";
import MJRoomData from "../../roomData/MJRoomData";
import SeatIndicator from "../SeatIndicator";
import PlayerMJCard from "./cards/PlayerMJCard";
import MJPlayerData from "../../roomData/MJPlayerData";
import { IPlayerCards } from "../../roomData/MJPlayerCardData";
import MJCard from "./cards/MJCard";
import { eMJActType } from "../../roomDefine";

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
export default class LayerPlayerCards3D extends cc.Component implements ILayerPlayerCard {

    @property(SeatIndicator)
    mIndicator : SeatIndicator = null ;

    @property([PlayerMJCard])
    mPlayerCards : PlayerMJCard[] = [] ; // clientIdx ; 

    mBottomSvrIdx : number = 0 ;  // clientIdx pos 0 , corrspone svr idx ; 
    // LIFE-CYCLE CALLBACKS:
    mRoomData : MJRoomData = null ;
    // onLoad () {}

    setBottomSvrIdx( svrIdx : number )
    {
        this.mBottomSvrIdx = svrIdx ;
        this.mIndicator.setSelfIdx(svrIdx) ;
    }

    protected getPlayerCardBySvrIdx( svrIdx : number ) : PlayerMJCard 
    {
        let nClientIdx = ( ( svrIdx - this.mBottomSvrIdx ) + this.mPlayerCards.length ) % this.mPlayerCards.length ;
        return this.mPlayerCards[nClientIdx] ;
    }

    start () {

    }

    refresh( data : MJRoomData ) : void 
    {
        this.mRoomData = data ;
        let selfIdx = data.getSelfIdx();
        this.setBottomSvrIdx( selfIdx == -1 ? 0 : selfIdx );
        this.mIndicator.setCurActIdx(data.mBaseData.curActSvrIdx ) ;

        let self = this;
        data.mPlayers.forEach( ( player : MJPlayerData )=>{ 
            if ( player == null || player.isEmpty() )
            {
                return ;
            }
            let p = self.getPlayerCardBySvrIdx( player.mPlayerBaseData.svrIdx ) ;
            p.onRefresh( player.mPlayerCard );
        } ) ;
    }

    onGameStart() : void
    {
        this.mPlayerCards.forEach( a => a.clear() ) ;
        this.mIndicator.setCurActIdx(this.mRoomData.mBaseData.bankerIdx) ;
    }

    onDistributedCards() : void 
    {
        let self = this;
        this.mRoomData.mPlayers.forEach( ( player : MJPlayerData )=>{ 
            if ( player == null || player.isEmpty() )
            {
                return ;
            }
            let p = self.getPlayerCardBySvrIdx( player.mPlayerBaseData.svrIdx ) ;
            p.onDistribute( player.mPlayerCard.vHoldCard );
        } ) ;
    }

    onPlayerActMo( idx : number , card : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onMo(card,null) ;
    }

    onPlayerActChu( idx : number , card : number ) : void 
    {
        if ( idx == this.mRoomData.getSelfIdx() )
        {
            return ;
        }
        this.getPlayerCardBySvrIdx(idx).onChu(card) ;
    }

    onPlayerActChi( idx : number , card : number , withA : number , withB : number, invokeIdx : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onEat(withA,withB,card) ;
    }

    onPlayerActPeng( idx : number , card : number, invokeIdx : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onPeng(card,IPlayerCards.getDirection(idx,invokeIdx) ) ;
    }

    onPlayerActMingGang( idx : number , card : number, invokeIdx : number, newCard : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onMingGang(card,IPlayerCards.getDirection(idx,invokeIdx),newCard,null ) ;
    }

    onPlayerActAnGang( idx : number , card : number , NewCard : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onAnGang(card,NewCard,null) ;
    }

    onPlayerActBuGang( idx : number , card : number , NewCard : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onBuGang(card,NewCard,null) ;
    }

    onPlayerActHu( idx : number, card : number , invokeIdx : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onHu(card,idx == invokeIdx ) ;
    }

    onMJActError() : void
    {
        this.mPlayerCards[0].onRefresh( this.mRoomData.mPlayers[this.mRoomData.getSelfIdx()].mPlayerCard ) ;
    }

    onSelfChu( card : MJCard )
    {
        if ( this.mRoomData.mBaseData.curActSvrIdx != this.mRoomData.getSelfIdx() )
        {
            return ;
        }

        this.mRoomData.doChosedAct( eMJActType.eMJAct_Chu, card.cardNum ) ;
        this.mPlayerCards[0].onChu( card.cardNum ) ;
    }
    // update (dt) {}
}
