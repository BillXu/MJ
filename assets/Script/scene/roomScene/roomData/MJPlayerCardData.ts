import { eMJActType, eArrowDirect, eEatType, eMJCardType } from "../roomDefine";
import * as _ from "lodash"
import MJCard from "../layerCards/cards3D/MJCard";
//import MJCard from "../layerCards3D/cards/MJCard";
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

export class PlayerActedCard
{
    eAct : eMJActType ;
    nTargetCard : number = 0 ;
    nInvokerIdx : number = -1;
    eDir : eArrowDirect = eArrowDirect.eDirect_Opposite;
    vAddtionCards? : number[] ; // when eat , must contain 3 cards ;  when gang , only one card 
}

export class IPlayerCards
{
    vHoldCard : number[] = [];
    //nHoldCardCnt : number = 0 ; 
    
    vMingCards : PlayerActedCard[] = [];
    vChuCards : number[] = [];
    vBuedHua : number[] = [] ;

    nHuCard : number = 0 ;
    nPlayerIdx = -1 ;


    isSelf(){ return this.vHoldCard.length > 0 ;}
    parseFromMsg( info : Object , playerIdx : number )
    {
        this.nPlayerIdx = playerIdx ;
        let holdCnt = 0 ;
        if ( info["holdCnt"] != null )
        {
            holdCnt = info["holdCnt"] ;
        }

        if ( info["holdCards"] != null )
        {
            this.vHoldCard = this.vHoldCard.concat(info["holdCards"]);
            if ( this.vHoldCard.length > 0 )
            {
                holdCnt = this.vHoldCard.length ;
            }
        }

        if ( holdCnt != this.vHoldCard.length )
        {
            while ( holdCnt-- )
            {
                this.vHoldCard.push( MJCard.makeCardNum(eMJCardType.eCT_Tong,1)) ;
            }
        }

        if ( info["chued"] != null )
        {
            this.vChuCards = this.vChuCards.concat(info["chued"]);
        }
        
        if ( info["ming"] != null )
        {
            let vMing : Object[] = info["ming"] ;
            let self = this ;
            vMing.forEach( ( ming : Object )=>{
                if ( ming["act"] == eMJActType.eMJAct_BuHua )
                {
                    self.vBuedHua.push(ming["card"][0]);
                    return ;
                }
                
                let clientMing = new PlayerActedCard();
                clientMing.nInvokerIdx = ming["invokerIdx"] ;
                clientMing.nTargetCard = ming["card"][0] ;
                clientMing.eAct = ming["act"] ;
                if ( eMJActType.eMJAct_Chi == clientMing.eAct )
                {
                    let tmp : number[] = [] ;
                    tmp = tmp.concat(ming["card"]);
                    clientMing.vAddtionCards = tmp;
                    tmp.sort( (a : number, b : number )=>{ return a - b ;} ) ;
                }
                clientMing.eDir = IPlayerCards.getDirection(playerIdx,clientMing.nInvokerIdx);
                self.vMingCards.push(clientMing);
            } );
        }
    }

    static getDirection( idx : number, invokerIdx : number ) : eArrowDirect 
    {
        if ( idx ==  ( invokerIdx + 1 ) % 4 )
        {
            return eArrowDirect.eDirect_Left ;
        }

        if ( idx ==  ( invokerIdx + 2 ) % 4 )
        {
            return eArrowDirect.eDirect_Opposite ;
        }
        return eArrowDirect.eDirect_Righ ;
    }

    clear()
    {
        this.vHoldCard.length = 0 ;
        //this.nHoldCardCnt = 0 ;
        this.vMingCards.length = 0 ;
        this.vChuCards.length = 0 ;
        this.vBuedHua.length = 0 ;
        this.nHuCard = 0 ;
       // console.log( "clear cards " );
    }

    onMo( nNewCard : number )
    {
        if ( !this.isSelf() )
        {
            nNewCard = this.vHoldCard.push( MJCard.makeCardNum(eMJCardType.eCT_Tong,1)) ;
        }

        this.vHoldCard.push(nNewCard);
    }

    onChu( nChu : number )
    {
        this.removeHold(nChu) ;
        this.vChuCards.push(nChu);
    }

    onEat( targetCard : number , withA : number , withB : number , invokerIdx : number  ) : PlayerActedCard
    {
        let ret = this.removeHold(withA) && this.removeHold(withB); 
        if ( !ret )
        {
            cc.error( "eat card remove error + " + withA + " b " + withB );
            return ;
        }

        let pMing = new PlayerActedCard() ;
        pMing.eAct = eMJActType.eMJAct_Chi ;
        pMing.nTargetCard = targetCard ;
        pMing.nInvokerIdx = invokerIdx ;
        pMing.vAddtionCards = [ targetCard,withA,withB ] ;
        pMing.vAddtionCards.sort( ( a : number , b : number )=>{ return a - b ;} ) ;
        pMing.eDir = IPlayerCards.getDirection( this.nPlayerIdx,invokerIdx );
        this.vMingCards.push(pMing);
        return pMing ;
    }

    isHaveCard( card : number )
    {
        let v = _.findIndex(this.vHoldCard,( c : number )=>{ return card == c ;} ) ;
        return -1 != v ;
    }

    removeHold( card : number , cnt? : number ) : boolean 
    {
        if ( cnt == null || undefined == cnt )
        {
            cnt = 1 ;
        }

        while ( cnt-- > 0 )
        {
            if ( this.isSelf() == false )
            {
                this.vHoldCard.pop();
                continue ;
            }

            let v = _.findIndex(this.vHoldCard,( c : number )=>{ return card == c ;} ) ;
            if ( -1 == v )
            {
                cc.error( "do not have card = " + card + "cnt " + cnt );
                return false;
            }
            this.vHoldCard.splice(v,1) ;
        }

        return true ;
    }

    onPeng( targetCard : number, invokerIdx : number ) : PlayerActedCard
    {
        this.removeHold(targetCard,2) ;

        let pMing = new PlayerActedCard() ; ;
        pMing.eAct = eMJActType.eMJAct_Peng ;
        pMing.nTargetCard = targetCard ;
        pMing.nInvokerIdx = invokerIdx ;
        pMing.eDir = IPlayerCards.getDirection( this.nPlayerIdx,invokerIdx );
        this.vMingCards.push(pMing);
        return pMing ;
    }

    onMingGang( targetCard : number , newCard : number, invokerIdx : number ) : PlayerActedCard
    {
        this.removeHold(targetCard,3) ;

        let pMing = new PlayerActedCard() ; ;
        pMing.eAct = eMJActType.eMJAct_MingGang ;
        pMing.nTargetCard = targetCard ;
        pMing.nInvokerIdx = invokerIdx ;
        pMing.vAddtionCards = [newCard] ;
        pMing.eDir = IPlayerCards.getDirection( this.nPlayerIdx,invokerIdx );
        this.vMingCards.push(pMing);

        this.onMo(newCard);
        return pMing ;
    }

    onBuGang( targetCard : number , newCard : number ) : PlayerActedCard 
    {
        this.removeHold(targetCard) ;

        let p : PlayerActedCard = null ;
        this.vMingCards.forEach( ( card : PlayerActedCard)=>{
            if ( card.nTargetCard == targetCard && card.eAct == eMJActType.eMJAct_Peng )
            {
                card.eAct = eMJActType.eMJAct_BuGang_Done ;
                card.vAddtionCards = [newCard] ;
                p = card ;
            }
        }) ;

        this.onMo(newCard);
        return p ;
    }

    onAnGang( targetCard : number , newCard : number ) : PlayerActedCard
    {
        this.removeHold(targetCard,4) ;

        let pMing = new PlayerActedCard() ; ;
        pMing.eAct = eMJActType.eMJAct_AnGang ;
        pMing.nTargetCard = targetCard ;
        pMing.vAddtionCards = [ newCard ] ;
        this.vMingCards.push(pMing);

        this.onMo(newCard);
        return pMing ;
    }

    onBuHua( huaCard : number , newCard : number ) : PlayerActedCard 
    {
        this.vBuedHua.push(huaCard);
        this.removeHold(huaCard) ;
        this.onMo(newCard);

        let pMing = new PlayerActedCard() ; ;
        pMing.eAct = eMJActType.eMJAct_BuHua ;
        pMing.nTargetCard = huaCard ;
        pMing.vAddtionCards = [ newCard ] ;
        return pMing ;
    }

    getMingCardInvokerIdx( card : number ) : number 
    {
        let p = _.find( this.vMingCards,( p : PlayerActedCard )=>{ return p.nTargetCard == card ;} ) ;
        if ( p == null || undefined == p )
        {
            cc.error( "you dont have ming card = " + card );
            return -1 ;
        }
        return p.nInvokerIdx ;
    }

    removeChu( targetCard : number )
    {
        let idx = _.findLastIndex(this.vChuCards,( card : number )=>{ return card == targetCard ; } );
        if ( idx == -1 )
        {
            cc.error( "you don't chu cards = " + targetCard + " how can be peng or gang ?" );
            return ;
        }
        this.vChuCards.splice(idx,1) ;
    }

    onHu( card : number )
    {
        this.nHuCard = card ;
    }

    isCardBePenged( card : number ) : boolean 
    {
        for (const iterator of  this.vMingCards ) {
            if ( iterator.nTargetCard == card && iterator.eAct == eMJActType.eMJAct_Peng )
            {
                return true ;
            }
        }

        return false ;
    }

    getEatOpts( vOutEatOpts : eEatType[], nTargetCard : number ) : void
    {
        let value = MJCard.parseCardValue(nTargetCard);

        if ( value > 2 && this.isHaveCard( nTargetCard - 1) && this.isHaveCard( nTargetCard - 2 ) )
        {
            vOutEatOpts.push(eEatType.eEat_Righ);
        }

        if ( value > 1 && this.isHaveCard( nTargetCard - 1 ) && this.isHaveCard( nTargetCard + 1 ) )
        {
            vOutEatOpts.push(eEatType.eEat_Middle);
        }

        if ( value < 8 && this.isHaveCard( nTargetCard + 1 ) && this.isHaveCard( nTargetCard + 2 ) )
        {
            vOutEatOpts.push(eEatType.eEat_Left);
        }
    }

    getGangOpts( vGangOpts : number[] )
    {
        // check bu gang ;
        for ( const item of this.vMingCards )
        {
            if ( item.eAct != eMJActType.eMJAct_Peng )
            {
                continue ;
            }    

            if ( this.isHaveCard( item.nTargetCard ) )
            {
                vGangOpts.push(item.nTargetCard);
            }
        }

        // chcck An gang;
        this.vHoldCard.sort();
        for ( let i = 0; (i + 3) < this.vHoldCard.length; )
        {
            if ( this.vHoldCard[i] == this.vHoldCard[ i + 3] )
            {
                vGangOpts.push(this.vHoldCard[i]);
                i += 4 ;
                continue ;
            }
            ++i ;
        }
    }

    onRecivedHoldCard(cards : number[] , cnt : number )
    {
        if ( cards != null )
        {
            this.vHoldCard.length = 0 ;
            this.vHoldCard = this.vHoldCard.concat(cards);
        }

        console.log( " hold card cnt = " + this.vHoldCard.length + " cnt = " + cnt )
        if ( this.vHoldCard.length != cnt )
        {
            while ( cnt-- )
            {
                this.vHoldCard.push( MJCard.makeCardNum(eMJCardType.eCT_Tong,2) ) ;
            }
        }
        //this.nHoldCardCnt = cnt ;
    }


}
