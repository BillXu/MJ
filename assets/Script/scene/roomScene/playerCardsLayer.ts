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
import roomSceneLayerBase from "./roomSceneLayerBase"
import { eMsgType } from "../../common/MessageIdentifer"
import PlayerCard from "./playerCard"
import { eClientRoomState, eMJActType } from "./roomDefine";
import { playerBaseData } from "./roomInterface";
import { eRoomState } from "../../common/clientDefine"
@ccclass
export default class PlayerCardsLayer extends roomSceneLayerBase {

    @property(PlayerCard)
    vPlayerCards : PlayerCard[] = [] ;

    @property(cc.Animation)
    pArrowTargetChuCard : cc.Animation = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.clearAllCards();
        let self = this ;
        let pchuFunc = ( chuCardNode : cc.Node )=>{
            self.pArrowTargetChuCard.node.active = true ;
            let pos = chuCardNode.convertToWorldSpaceAR(cc.Vec2.ZERO) ;
            pos = self.pArrowTargetChuCard.node.getParent().convertToNodeSpaceAR(pos) ;
            self.pArrowTargetChuCard.node.position = cc.v2(pos.x,pos.y + chuCardNode.getBoundingBox().height * 0.45) ; ;
            self.pArrowTargetChuCard.play();
        };
        this.vPlayerCards.forEach( ( pc : PlayerCard)=>{ pc.pfunChuAniFinishCallBack = pchuFunc ; pc.pPlayerCardsLayer = self ;} );   
    }

    refresh( pdata : RoomData )
    {
        this.clearAllCards();
        if ( pdata.nRoomState != eClientRoomState.State_StartGame )
        {
            return ;
        }

        let vPlayers = pdata.vPlayers ;
        let self = this ;
        vPlayers.forEach( ( p : playerBaseData )=>{
            if ( null == p || p.cards == null )
            {
                return ;
            }

            let pcards = self.vPlayerCards[p.clientIdx] ;
            let cardsData = p.cards ;
            pcards.onRefreshCards(p.isMale(),cardsData.vHoldCard,cardsData.nHoldCardCnt,cardsData.vMingCards,cardsData.vChuCards,cardsData.nNewFeatchedCard) ;
        } ); 

        if (  pdata.jsRoomInfoMsg["state"] != eRoomState.eRoomState_AskForHuAndPeng )
        {
            this.vPlayerCards[pdata.curActClientIdx].onWaitChu();

            let lastChuNode = this.vPlayerCards[pdata.lastChuClientIdx].getLastChuCardNode();
            if ( lastChuNode )
            {
                this.pArrowTargetChuCard.node.active = true ;
                let pos = lastChuNode.convertToWorldSpaceAR(cc.Vec2.ZERO) ;
                pos = this.pArrowTargetChuCard.node.getParent().convertToNodeSpaceAR(pos) ;
                this.pArrowTargetChuCard.node.position = cc.v2(pos.x,pos.y + lastChuNode.getBoundingBox().height * 0.45) ;
                this.pArrowTargetChuCard.play();
            }
        }
    }

    refreshPlayerSex( nClientIdx : number , isMale : boolean )
    {
        this.vPlayerCards[nClientIdx].isMale = isMale ;
    }

    //----state-----
    enterWaitReadyState( pdata : RoomData )
    {
        this.clearAllCards();
    }

    enterGameState( pdata : RoomData )
    {

    }
    
    onDistributedCards( pdata : RoomData )
    {
        let vPlayers = pdata.vPlayers ;
        let self = this ;
        vPlayers.forEach( ( p : playerBaseData )=>{
            if ( null == p || p.cards == null )
            {
                return ;
            }

            let pcards = self.vPlayerCards[p.clientIdx] ;
            let cardsData = p.cards ;
            pcards.onDistributeCards(cardsData.vHoldCard,cardsData.nHoldCardCnt,cardsData.nNewFeatchedCard) ;
        } ); 
        this.vPlayerCards[pdata.curActClientIdx].onWaitChu();
    }

    onPlayerMo( playerClientIdx : number , newCard : number )
    {
        this.vPlayerCards[playerClientIdx].onMo(newCard);
    }

    onPlayerChu( playerClientIdx : number , chuCard : number )
    {
        this.vPlayerCards[playerClientIdx].onChu(chuCard) ;
    }

    onPlayerChuFailed( playerClientIdx : number , chuCard : number )
    {
        this.vPlayerCards[playerClientIdx].onChuPaiFailed(chuCard) ;
        this.pArrowTargetChuCard.node.active = false ;
    }

    onPlayerEat( playerClientIdx : number , targetCard : number , withA : number , withB : number , invokerClientIdx : number )
    {
        this.vPlayerCards[playerClientIdx].onEat(targetCard,withA,withB) ;
        this.vPlayerCards[invokerClientIdx].onCardBeEatGangPeng(targetCard) ;
        this.hideArrowTargetChuCardAni();
    }

    onPlayerPeng( playerClientIdx : number , targetCard : number , invokerClientIdx : number )
    {
        this.vPlayerCards[playerClientIdx].onPeng(targetCard,invokerClientIdx) ;
        this.vPlayerCards[invokerClientIdx].onCardBeEatGangPeng(targetCard) ;
        this.hideArrowTargetChuCardAni();
    }

    onPlayerMingGang( playerClientIdx : number , targetCard : number , invokerClientIdx : number , newCard : number )
    {
        this.vPlayerCards[playerClientIdx].onZhiMingGang(targetCard,invokerClientIdx,newCard) ;
        this.vPlayerCards[invokerClientIdx].onCardBeEatGangPeng(targetCard) ;
        this.hideArrowTargetChuCardAni();
    }

    onPlayerBuGang( playerClientIdx : number , targetCard : number , invokerClientIdx : number , newCard : number )
    {
        this.vPlayerCards[playerClientIdx].onBuMingGang(targetCard,invokerClientIdx,newCard) ;
    }

    onPlayerAnGang( playerClientIdx : number , targetCard : number , newCard : number )
    {
        this.vPlayerCards[playerClientIdx].onAngGang(targetCard,newCard) ;
    }

    onPlayerHu( playerClientIdx : number , targetCard : number )
    {
        this.vPlayerCards[playerClientIdx].onHu(targetCard) ;
    }

    clearAllCards()
    {
        this.vPlayerCards.forEach( ( v : PlayerCard )=>{ v.onRefreshCards(v.isMale,null,0,null,null,0) ;} ) ; 
        this.hideArrowTargetChuCardAni();
    }

    hideArrowTargetChuCardAni()
    {
        this.pArrowTargetChuCard.node.active = false ;
        this.pArrowTargetChuCard.stop();
    }

    onSelfUserChu( cardNum : number )
    {
        let msg = {} ;
        msg["card"] = cardNum ;
        msg["actType"] = eMJActType.eMJAct_Chu ;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
    }

    highLightChuCard( cardNum : number )
    {
        this.vPlayerCards.forEach( ( cards : PlayerCard )=>{ cards.highLightChuCard(cardNum);} ) ;
    }

}
