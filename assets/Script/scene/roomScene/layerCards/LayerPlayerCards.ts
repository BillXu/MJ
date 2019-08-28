import MJRoomData from "../roomData/MJRoomData";
import MJPlayerData from "../roomData/MJPlayerData";
import { IPlayerCards } from "../roomData/MJPlayerCardData";
import MJCard from "./cards3D/MJCard";
import { eMJActType } from "../roomDefine";
import EffectLayer from "./effectLayer";
import IPlayerMJCard, { MJPlayerCardHoldDelegate } from "./IPlayerMJCard";
import IIndicator from "./IIndicator";

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
export default class LayerPlayerCards extends cc.Component implements MJPlayerCardHoldDelegate {

    @property(IIndicator)
    mIndicator : IIndicator = null ;

    @property(cc.Node)
    mLastChuArrowNode : cc.Node = null ;

    @property([IPlayerMJCard])
    mPlayerCards : IPlayerMJCard[] = [] ; // clientIdx ; 

    @property(EffectLayer)
    mEffectLayer : EffectLayer = null ;

    mBottomSvrIdx : number = 0 ;  // clientIdx pos 0 , corrspone svr idx ; 
    // LIFE-CYCLE CALLBACKS:
    mRoomData : MJRoomData = null ;
    mHuCard : number = 0 ;
    mIsReplay : boolean = false ;
    
    DEFAULT_ACT_TIME : number = 30 ;
    onLoad () 
    {

    }

    start () {
        let self = this ;
        this.mPlayerCards.forEach( (a,) => { a.setIsReplay(self.mIsReplay ) ; } );
        if ( this.mIsReplay == false )
        {
            this.mPlayerCards[0].setHoldCardDelegate( this );
        }
    }

    setBottomSvrIdx( svrIdx : number )
    {
        this.mBottomSvrIdx = svrIdx ;
        this.mIndicator.setBottomSvrIdx(svrIdx) ;
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

    refresh( data : MJRoomData ) : void 
    {
        this.mRoomData = data ;
        let selfIdx = data.getSelfIdx();
        this.setBottomSvrIdx( selfIdx == -1 ? 0 : selfIdx );
        this.mIndicator.setCurActIdx( data.mBaseData.isInGamingState() ? data.mBaseData.curActSvrIdx : -1,this.DEFAULT_ACT_TIME ) ;
        this.hideArrow();

        let self = this;
        data.mPlayers.forEach( ( player : MJPlayerData )=>{ 
            if ( player == null || player.isEmpty() )
            {
                return ;
            }
            let p = self.getPlayerCardBySvrIdx( player.mPlayerBaseData.svrIdx ) ;
            p.onRefresh( player.mPlayerCard );
        } ) ;
        this.mHuCard = 0 ;
    }

    onGameStart() : void
    {
        this.mPlayerCards.forEach( a => a.clear() ) ;
        this.mIndicator.setCurActIdx(this.mRoomData.mBaseData.bankerIdx,this.DEFAULT_ACT_TIME) ;
        this.hideArrow();
        this.mHuCard = 0 ;
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
        this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
    }

    onPlayerActChu( idx : number , card : number ) : void 
    {
        if ( idx == this.mRoomData.getSelfIdx() )
        {
            return ;
        }
        
        let p = this.getPlayerCardBySvrIdx(idx).onChu(card) ;
        this.moveArrowToWorldPos(p) ;
    }

    onPlayerActChi( idx : number , card : number , withA : number , withB : number, invokeIdx : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onEat(withA,withB,card,IPlayerCards.getDirection(idx,invokeIdx)) ;
        this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
        this.playActEffect( idx, eMJActType.eMJAct_Chi );
        this.getPlayerCardBySvrIdx(invokeIdx).onChuCardBePengGangHu(card);
        this.hideArrow();
    }

    onPlayerActPeng( idx : number , card : number, invokeIdx : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onPeng(card,IPlayerCards.getDirection(idx,invokeIdx) ) ;
        this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
        this.playActEffect( idx, eMJActType.eMJAct_Peng );

        this.getPlayerCardBySvrIdx(invokeIdx).onChuCardBePengGangHu(card);
        this.hideArrow();
    }

    onPlayerActMingGang( idx : number , card : number, invokeIdx : number, newCard : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onMingGang(card,IPlayerCards.getDirection(idx,invokeIdx),newCard,null ) ;
        this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
        this.playActEffect( idx, eMJActType.eMJAct_MingGang );

        this.getPlayerCardBySvrIdx(invokeIdx).onChuCardBePengGangHu(card);
        this.hideArrow();
    }

    onPlayerActAnGang( idx : number , card : number , NewCard : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onAnGang(card,NewCard,null) ;
        this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
        this.playActEffect( idx, eMJActType.eMJAct_AnGang );
    }

    onPlayerActBuGang( idx : number , card : number , NewCard : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onBuGang(card,NewCard,null) ;
        this.mIndicator.setCurActIdx(idx,this.DEFAULT_ACT_TIME);
        this.playActEffect( idx, eMJActType.eMJAct_BuGang );
    }

    onPlayerActHu( idx : number, card : number , invokeIdx : number ) : void 
    {
        this.getPlayerCardBySvrIdx(idx).onHu(card,idx == invokeIdx ) ;
        this.playActEffect( idx, eMJActType.eMJAct_Hu );

        if ( this.mHuCard == 0 )
        {
            this.getPlayerCardBySvrIdx(invokeIdx).onChuCardBePengGangHu(card);
            this.hideArrow();
        }
        this.mHuCard = card ;
    }

    showHoldCardAfterGameEnd()
    {
        let self = this;
        this.mRoomData.mPlayers.forEach( ( player : MJPlayerData )=>{ 
            if ( player == null || player.isEmpty() )
            {
                return ;
            }
            let p = self.getPlayerCardBySvrIdx( player.mPlayerBaseData.svrIdx ) ;
            p.showHoldAfterHu( player.mPlayerCard.vHoldCard,this.mHuCard );
        } ) ;
    }

    onMJActError() : void
    {
        this.mPlayerCards[0].onRefresh( this.mRoomData.mPlayers[this.mRoomData.getSelfIdx()].mPlayerCard ) ;
    }

    protected moveArrowToWorldPos( ptWorldPos : cc.Vec3|cc.Vec2 )
    {
        
        this.mLastChuArrowNode.active = true ;

        if ( ptWorldPos instanceof cc.Vec3 )
        {
            let posLocal = new cc.Vec3();
            this.node._invTransformPoint(posLocal,ptWorldPos );
    
            this.mLastChuArrowNode.position = posLocal;
        }
        else
        {
            ptWorldPos = this.mLastChuArrowNode.parent.convertToNodeSpaceAR(ptWorldPos);
            this.mLastChuArrowNode.position = ptWorldPos ;
        }
        //this.mLastChuArrowNode.getWorldPosition 
        console.log( "moveArrowToWorldPos " + ptWorldPos  );
    }

    protected hideArrow()
    {
        this.mLastChuArrowNode.active = false ;
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

    onSelfRequestChuCard( cardNum : number , ptCardWorldPos : cc.Vec2 ) : boolean 
    {
        if ( this.mRoomData.mBaseData.curActSvrIdx != this.mRoomData.getSelfIdx() )
        {
            return false;
        }

        this.mRoomData.doChosedAct( eMJActType.eMJAct_Chu, cardNum ) ;
        return true ;
    }
    // update (dt) {}
}
