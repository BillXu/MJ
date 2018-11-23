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
import { eClientRoomState } from "./roomDefine";
import { playerBaseData } from "./roomInterface";
@ccclass
export default class PlayerCardsLayer extends roomSceneLayerBase {

    @property(PlayerCard)
    vPlayerCards : PlayerCard[] = [] ;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.clearAllCards();
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
            pcards.onRefreshCards(cardsData.vHoldCard,cardsData.nHoldCardCnt,cardsData.vMingCards,cardsData.vChuCards,cardsData.nNewFeatchedCard) ;
        } ); 
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
    }

    onPlayerMo( playerClientIdx : number , newCard : number )
    {
        this.vPlayerCards[playerClientIdx].onMo(newCard);
    }

    onPlayerChu( playerClientIdx : number , chuCard : number )
    {
        this.vPlayerCards[playerClientIdx].onChu(chuCard) ;
    }

    onPlayerEat( playerClientIdx : number , targetCard : number , withA : number , withB : number , invokerClientIdx : number )
    {
        this.vPlayerCards[playerClientIdx].onEat(targetCard,withA,withB) ;
        this.vPlayerCards[invokerClientIdx].onCardBeEatGangPeng(targetCard) ;
    }

    onPlayerPeng( playerClientIdx : number , targetCard : number , invokerClientIdx : number )
    {
        this.vPlayerCards[playerClientIdx].onPeng(targetCard,invokerClientIdx) ;
        this.vPlayerCards[invokerClientIdx].onCardBeEatGangPeng(targetCard) ;
    }

    onPlayerMingGang( playerClientIdx : number , targetCard : number , invokerClientIdx : number , newCard : number )
    {
        this.vPlayerCards[playerClientIdx].onZhiMingGang(targetCard,invokerClientIdx,newCard) ;
        this.vPlayerCards[invokerClientIdx].onCardBeEatGangPeng(targetCard) ;
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
        this.vPlayerCards.forEach( ( v : PlayerCard )=>{ v.onRefreshCards(null,0,null,null,0) ;} ) ; 
    }
}
