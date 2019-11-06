import {  PlayerActedCard } from "../roomData/MJPlayerCardData";
import { eMJActType } from "../roomDefine";
import EffectLayer from "./effectLayer";
import IPlayerMJCard, { MJPlayerCardHoldDelegate } from "./IPlayerMJCard";
import IIndicator from "./IIndicator";
import MJCardFactory2D from "./cards2D/MJCardFactory2D";
import ILayerCards from "../ILayerCards";
import ILayerCardsData, { IPlayerCardData } from "./ILayerCardsData";
import IRoomSceneData from "../IRoomSceneData";
import PlayerMJCard from "./cards3D/PlayerMJCard";
import MJPlayerCard2D from "./cards2D/MJPlayerCard2D";
import LayerCardsData from "./LayerCardsData";
import MJFactory from "./cards3D/MJFactory";
import IChuCardArrow from "../IChuCardArrow";

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
export default class LayerPlayerCards extends cc.Component implements ILayerCards,MJPlayerCardHoldDelegate,IChuCardArrow {

    @property(IIndicator)
    mIndicator : IIndicator = null ;

    @property(cc.Node)
    mLastChuArrowNode : cc.Node = null ;

    @property([cc.Node])
    mPlayerCardNodes : cc.Node[] = [] ;
    mPlayerCards : IPlayerMJCard[] = [] ; // clientIdx ; 

    @property(EffectLayer)
    mEffectLayer : EffectLayer = null ;

    mBottomSvrIdx : number = 0 ;  // clientIdx pos 0 , corrspone svr idx ; 
    // LIFE-CYCLE CALLBACKS:
    mData : ILayerCardsData = null ;
    mHuCard : number = 0 ;
    
    DEFAULT_ACT_TIME : number = 30 ;
    isLoadedMJRes : boolean = false ;
    onLoad () 
    {
        cc.systemEvent.on( MJCardFactory2D.EVENT_FINISH_REFRESH_MJ,this.onRefreshMJ,this );
        cc.systemEvent.on( MJFactory.EVENT_FINISH_LOAD_CARD,this.onRefreshMJ,this );
        this.setCardType(true);
        console.log( "layer card on load" );
    }

    onDestroy()
    {
        cc.systemEvent.targetOff( this );
    }

    start () {
        // this.mData = new LayerCardsData(); // just for test ;
        // if ( this.isLoadedMJRes )
        // {
        //    this.localRefresh( this.mData );
        // }
    }

    protected setCardType( is3D : boolean )
    {
        for ( let idx = 0 ; idx < this.mPlayerCardNodes.length ; ++idx )
        {
            this.mPlayerCards[idx] = this.mPlayerCardNodes[idx].getComponent( is3D ? "PlayerMJCard" : "MJPlayerCard2D" );
            this.mPlayerCards[idx].setChuArrow(this);
        }
    }

    protected onRefreshMJ()
    {
        cc.log( "refresh mj " );
        this.isLoadedMJRes = true ;
        if ( this.mData != null )
        {
            this.localRefresh( this.mData );
        }
    }

    protected getPlayerCardBySvrIdx( svrIdx : number ) : IPlayerMJCard 
    {
        let nClientIdx = ( ( svrIdx - this.mBottomSvrIdx ) + this.mPlayerCards.length ) % this.mPlayerCards.length ;
        return this.mPlayerCards[nClientIdx] ;
    }

    protected playActEffect( svrIdx : number , act : eMJActType )
    {
        let nClientIdx = ( ( svrIdx - this.mBottomSvrIdx ) + this.mPlayerCards.length ) % this.mPlayerCards.length ;
        this.mEffectLayer.playPlayerEffect( nClientIdx,act );
    }

    // onPlayerActChi( idx : number , card : number , withA : number , withB : number, invokeIdx : number ) : void 
    // {
    //     this.getPlayerCardBySvrIdx(idx).onEat(withA,withB,card,IPlayerCards.getDirection(idx,invokeIdx)) ;
    //     this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
    //     this.playActEffect( idx, eMJActType.eMJAct_Chi );
    //     this.getPlayerCardBySvrIdx(invokeIdx).onChuCardBePengGangHu(card);
    //     this.hideArrow();
    // }

    // onPlayerActPeng( idx : number , card : number, invokeIdx : number ) : void 
    // {
    //     this.getPlayerCardBySvrIdx(idx).onPeng(card,IPlayerCards.getDirection(idx,invokeIdx) ) ;
    //     this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
    //     this.playActEffect( idx, eMJActType.eMJAct_Peng );

    //     this.getPlayerCardBySvrIdx(invokeIdx).onChuCardBePengGangHu(card);
    //     this.hideArrow();
    // }

    // onPlayerActMingGang( idx : number , card : number, invokeIdx : number, newCard : number ) : void 
    // {
    //     this.getPlayerCardBySvrIdx(idx).onMingGang(card,IPlayerCards.getDirection(idx,invokeIdx),newCard,null ) ;
    //     this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
    //     this.playActEffect( idx, eMJActType.eMJAct_MingGang );

    //     this.getPlayerCardBySvrIdx(invokeIdx).onChuCardBePengGangHu(card);
    //     this.hideArrow();
    // }

    // onPlayerActAnGang( idx : number , card : number , NewCard : number ) : void 
    // {
    //     this.getPlayerCardBySvrIdx(idx).onAnGang(card,NewCard,null) ;
    //     this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
    //     this.playActEffect( idx, eMJActType.eMJAct_AnGang );
    // }

    // onPlayerActBuHua( idx : number , huaCard : number , NewCard : number ) : void
    // {
    //     this.getPlayerCardBySvrIdx(idx).onBuHua(huaCard,NewCard,null) ;
    //     //this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
    //     this.playActEffect( idx, eMJActType.eMJAct_BuHua );
    // }

    // onPlayerActBuGang( idx : number , card : number , NewCard : number ) : void 
    // {
    //     this.getPlayerCardBySvrIdx(idx).onBuGang(card,NewCard,null) ;
    //     this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
    //     this.playActEffect( idx, eMJActType.eMJAct_BuGang );
    // }

    // onPlayerActHu( idx : number, card : number , invokeIdx : number ) : void 
    // {
    //     this.getPlayerCardBySvrIdx(idx).onHu(card,idx == invokeIdx ) ;
    //     this.playActEffect( idx, eMJActType.eMJAct_Hu );

    //     if ( this.mHuCard == 0 )
    //     {
    //         this.getPlayerCardBySvrIdx(invokeIdx).onChuCardBePengGangHu(card);
    //         this.hideArrow();
    //     }
    //     this.mHuCard = card ;
    // }

    // interface IChuCardArrow
    moveArrowToWorldPos( ptWorldPos : cc.Vec3|cc.Vec2 )
    {
        this.mLastChuArrowNode.active = true ;
        ptWorldPos = this.mLastChuArrowNode.parent.convertToNodeSpaceAR(<cc.Vec2>ptWorldPos);
        this.mLastChuArrowNode.position = ptWorldPos ;
        //this.mLastChuArrowNode.getWorldPosition 
        console.log( "moveArrowToWorldPos " + ptWorldPos  );
    }

    protected hideArrow()
    {
        this.mLastChuArrowNode.active = false ;
    }

    protected localRefresh( data : ILayerCardsData )
    {
        let selfIdx = data.getSelfIdx();
        this.setBottomSvrIdx( selfIdx == -1 ? 0 : selfIdx );
        this.mIndicator.setCurActIdx( data.getCurActIdx(),this.DEFAULT_ACT_TIME ) ;
        this.hideArrow();

        let vPlayerCards = data.getPlayerCardItems();
        let self = this;
        vPlayerCards.forEach( ( player : IPlayerCardData, nSvrIdx : number )=>{ 
            if ( player == null )
            {
                return ;
            }
            let p = self.getPlayerCardBySvrIdx( nSvrIdx ) ;
            if ( null == p )
            {
                cc.error( "why this idx player card is null ? = " + nSvrIdx );
                return ;
            }

            p.onRefresh( player,self.mData.isReplay(), nSvrIdx == selfIdx );
        } ) ;
        this.mHuCard = 0 ;
    }

    // interface iLayercards 
    refresh( data : IRoomSceneData ) : void 
    {
        cc.log( "refresh mj real" );
        this.mData = data.getLayerCardsData() ;
        //if ( this.isLoadedMJRes )
        {
            this.localRefresh( this.mData );
        }
    }

    onGameStart() : void
    {
        this.mPlayerCards.forEach( a => a.clear() ) ;
        this.mIndicator.setCurActIdx( this.mData.getBankerIdx(),this.DEFAULT_ACT_TIME) ;
        this.hideArrow();
        this.mHuCard = 0 ;
    }

    onGameEnd()
    {
        this.mPlayerCards.forEach( ( v: IPlayerMJCard )=>v.showHoldAfterHu() );
    }

    onDistributedCards() : void 
    {
        this.mPlayerCards.forEach( ( v: IPlayerMJCard )=>v.onDistributedCards() );
        this.mIndicator.setCurActIdx(this.mData.getBankerIdx(),this.DEFAULT_ACT_TIME);
    }

    onPlayerActMo( idx : number , card : number ) : void
    {
        this.getPlayerCardBySvrIdx(idx).onActMo(card) ;
        this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
    }

    onPlayerActChu( idx : number , card : number ) : void
    {
        if ( idx == this.mData.getSelfIdx() )
        {
            return ;
        }
        
        this.getPlayerCardBySvrIdx(idx).onActChu(card) ;
        //this.moveArrowToWorldPos(p) ;
    }

    onPlayerActed( idx : number , actedData : PlayerActedCard ) 
    {
        this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
        this.playActEffect( idx, actedData.eAct );

        switch ( actedData.eAct )
        {
            case eMJActType.eMJAct_Peng:
            case eMJActType.eMJAct_Chi:
            case eMJActType.eMJAct_MingGang:
            {
                this.getPlayerCardBySvrIdx(actedData.nInvokerIdx).onChuCardBePengGangHu( actedData.nTargetCard );
                this.hideArrow();
            }
            break ;
            case eMJActType.eMJAct_Hu:
            {
                if ( this.mHuCard == 0 && actedData.nInvokerIdx != idx )
                {
                    this.getPlayerCardBySvrIdx(actedData.nInvokerIdx).onChuCardBePengGangHu( actedData.nTargetCard );
                    this.hideArrow();
                }
                this.mHuCard = actedData.nTargetCard ;
            }
        }

        this.getPlayerCardBySvrIdx(idx).onActed( actedData );
    }

    onMJActError() : void 
    {
        let vholdCards = this.mData.getPlayerCardItems();
        this.mPlayerCards[0].onRefresh( vholdCards[this.mBottomSvrIdx],this.mData.isReplay(),true ) ;
    }

    setBottomSvrIdx( svrIdx : number )
    {
        this.mBottomSvrIdx = svrIdx ;
        this.mIndicator.setBottomSvrIdx(svrIdx) ;
    }

    // hold delegate ;
    onHoldCardSelected( cardNum : number ) : void 
    {
        this.mPlayerCards.forEach( (a,) => { a.switchCardHighLight(cardNum,true) ; } );
    }

    onHoldCardReleaseSelect( cardNum : number ) : void 
    {
        this.mPlayerCards.forEach( (a,) => { a.switchCardHighLight(cardNum,false ) ; } );
    }
    // update (dt) {}
}
