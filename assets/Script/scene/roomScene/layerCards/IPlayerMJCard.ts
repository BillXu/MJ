import { PlayerActedCard } from "../roomData/MJPlayerCardData";
import { IPlayerCardData } from "./ILayerCardsData";
import IChuCardArrow from "./IChuCardArrow";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export interface MJPlayerCardHoldDelegate 
{
    onHoldCardSelected( cardNum : number ) : void ;
    onHoldCardReleaseSelect( cardNum : number ) : void ;
}

export default interface IPlayerMJCard {
    setHoldCardDelegate( del : MJPlayerCardHoldDelegate );
    setChuArrow( del : IChuCardArrow );
    onRefresh( cardData : IPlayerCardData ,isReplay : boolean , isSelf : boolean ) : void ;
    clear() : void ;
    showHoldAfterHu() : void ;
    onChuCardBePengGangHu( cardNum : number ) : void ;
    switchCardHighLight( cardNum : number , isEnable : boolean ) : void ;

    onDistributedCards() : void ;
    onActMo( card : number ) : void;
    onActChu( card : number ) : void
    onActed( actedData : PlayerActedCard ) ;
}
