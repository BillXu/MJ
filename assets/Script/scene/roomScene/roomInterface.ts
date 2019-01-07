// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import { eCardSate } from "./roomDefine"
import { eRoomPeerState } from "../../common/clientDefine"
import { eMJActType } from "./roomDefine"
import * as _ from "lodash"
export interface IHoldMingPai
{
    mjStateType : eCardSate ;
    nCard : number ;
    nInvokerClientIdx : number ;  // must refresh when all playerinfo reieved ;
    nInvokerSvrIdx? : number ;
    vEatWithCards? : number[] ; // must contain 3 cards ;
}

export class IPlayerCards
{
    vHoldCard : number[] = [];
    nHoldCardCnt : number = 0 ; 
    
    vMingCards : IHoldMingPai[] = [];
    vChuCards : number[] = [];

    nNewFeatchedCard : number = 0 ;
    nHuCard : number = 0 ;

    isSelf(){ return this.vHoldCard.length > 0 ;}
    parseFromMsg( info : Object )
    {
        if ( info["holdCnt"] != null )
        {
            this.nHoldCardCnt = info["holdCnt"] ;
        }

        if ( info["holdCards"] != null )
        {
            this.vHoldCard = this.vHoldCard.concat(info["holdCards"]);
            if ( this.vHoldCard.length > 0 )
            {
                this.nHoldCardCnt = this.vHoldCard.length ;
            }
        }

        if ( this.nHoldCardCnt % 3 == 2 )
        {
            this.nNewFeatchedCard = this.vHoldCard.length > 0 ? this.vHoldCard.pop() : 1 ;
            --this.nHoldCardCnt ;
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
                let clientMing = { nInvokerClientIdx : undefined , nInvokerSvrIdx : undefined , nCard : 0 , mjStateType : eCardSate.eCard_AnGang,} ;
                clientMing.nInvokerSvrIdx = ming["invokerIdx"] ;
                clientMing.nCard = ming["card"][0] ;
                let act : eMJActType = ming["act"] ;
                if ( eMJActType.eMJAct_AnGang == act )
                {
                    clientMing.mjStateType = eCardSate.eCard_AnGang;
                }
                else if ( eMJActType.eMJAct_BuGang == act || eMJActType.eMJAct_MingGang == act )
                {
                    clientMing.mjStateType = eCardSate.eCard_MingGang;
                }
                else if ( eMJActType.eMJAct_Peng == act )
                {
                    clientMing.mjStateType = eCardSate.eCard_Peng;
                }
                else if ( eMJActType.eMJAct_Chi == act )
                {
                    clientMing.mjStateType = eCardSate.eCard_Eat;
                    let tmp : number[] = [] ;
                    let t = tmp.concat(ming["card"]);
                    clientMing["vEatWithCards"] = t ;
                    t.sort( (a : number, b : number )=>{ return a - b ;} ) ;
                }
                self.vMingCards.push(clientMing);
            } );
        }
    }

    clear()
    {
        this.vHoldCard.length = 0 ;
        this.nHoldCardCnt = 0 ;
        this.vMingCards.length = 0 ;
        this.vChuCards.length = 0 ;
        this.nHuCard = 0 ;
        this.nNewFeatchedCard = 0 ;
    }

    onMo( nNewCard : number )
    {
        if ( !this.isSelf() )
        {
            ++this.nHoldCardCnt ;
            return ;
        }

        if ( this.nNewFeatchedCard )
        {
            this.vHoldCard.push(this.nNewFeatchedCard);
            this.nNewFeatchedCard = 0 ;
        }
        
        this.nNewFeatchedCard = nNewCard ;
    }

    onChu( nChu : number )
    {
        this.removeHold(nChu) ;
        this.vChuCards.push(nChu);
        if ( this.nNewFeatchedCard )
        {
            if ( this.isSelf() )
            {
                this.vHoldCard.push(this.nNewFeatchedCard);
                this.nNewFeatchedCard = 0 ;
            }
            else
            {
                ++this.nHoldCardCnt ;
            }
        }
    }

    onEat( targetCard : number , withA : number , withB : number , invokerClientIdx : number  )
    {
        let ret = this.removeHold(withA) && this.removeHold(withB); 
        if ( !ret )
        {
            cc.error( "eat card remove error + " + withA + " b " + withB );
            return ;
        }

        let pMing = <IHoldMingPai>{} ;
        pMing.mjStateType = eCardSate.eCard_Eat ;
        pMing.nCard = targetCard ;
        pMing.nInvokerClientIdx = invokerClientIdx ;
        pMing.vEatWithCards = [ targetCard,withA,withB ] ;
        pMing.vEatWithCards.sort( ( a : number , b : number )=>{ return a - b ;} ) ;
        this.vMingCards.push(pMing);
    }

    isHaveCard( card : number )
    {
        if ( card == this.nNewFeatchedCard )
        {
            return true ;
        }

        let v = _.findIndex(this.vHoldCard,( c : number )=>{ return card == c ;} ) ;
        return -1 != v ;
    }

    removeHold( card : number , cnt? : number ) : boolean 
    {
        if ( cnt == null || undefined == cnt )
        {
            cnt = 1 ;
        }

        if ( this.vHoldCard.length == 0 ) // other player 
        {
            this.nHoldCardCnt -= cnt ;
            return  true ;
        }

        if ( cnt > 0 )
        {
            if ( card == this.nNewFeatchedCard )
            {
                this.nNewFeatchedCard = 0 ;
                --cnt;
            }

        }

        while ( cnt-- > 0 )
        {
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

    onPeng( targetCard : number, invokerClientIdx : number )
    {
        this.removeHold(targetCard,2) ;

        let pMing = <IHoldMingPai>{} ;
        pMing.mjStateType = eCardSate.eCard_Peng ;
        pMing.nCard = targetCard ;
        pMing.nInvokerClientIdx = invokerClientIdx ;
        this.vMingCards.push(pMing);
    }

    onMingGang( targetCard : number , newCard : number, invokerClientIdx : number )
    {
        this.removeHold(targetCard,3) ;

        let pMing = <IHoldMingPai>{} ;
        pMing.mjStateType = eCardSate.eCard_MingGang ;
        pMing.nCard = targetCard ;
        pMing.nInvokerClientIdx = invokerClientIdx ;
        this.vMingCards.push(pMing);

        this.onMo(newCard);
    }

    onBuGang( targetCard : number , newCard : number )
    {
        this.removeHold(targetCard) ;

        this.vMingCards.forEach( ( card : IHoldMingPai)=>{
            if ( card.nCard == targetCard && card.mjStateType == eCardSate.eCard_Peng )
            {
                card.mjStateType = eCardSate.eCard_MingGang ;
            }
        }) ;

        this.onMo(newCard);
    }

    onAnGang( targetCard : number , newCard : number, invokerClientIdx : number )
    {
        this.removeHold(targetCard,4) ;

        let pMing = <IHoldMingPai>{} ;
        pMing.mjStateType = eCardSate.eCard_AnGang ;
        pMing.nCard = targetCard ;
        pMing.nInvokerClientIdx = invokerClientIdx ;
        this.vMingCards.push(pMing);

        this.onMo(newCard);
    }

    getMingCardInvokerIdx( card : number ) : number 
    {
        let p = _.find( this.vMingCards,( p : IHoldMingPai )=>{ return p.nCard == card ;} ) ;
        if ( p == null || undefined == p )
        {
            cc.error( "you dont have ming card = " + card );
            return -1 ;
        }
        return p.nInvokerClientIdx ;
    }

    onCardBePengOrGanged( targetCard : number )
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
}

export class playerBaseData
{
    uid : number = 0 ;
    svrIdx : number = -1 ;
    clientIdx : number = -1;
    headIconUrl : string = "";
    name : string = "";
    chip : number = 0 ;
    isOnline : boolean = false; 
    cards : IPlayerCards = new IPlayerCards();
    isReady : boolean = false;
    sex : number = 0 ;
    ip : string = "" ;
    J : number = 0 ;
    W : number = 0 ;
    race : number = -1 ;    

    isMale(){ return this.sex == 0 ;}
    parseFromMsg( info : Object )
    {
        this.uid = info["uid"] ;
        this.svrIdx = info["idx"] ;
        this.isOnline = info["isOnline"] ;
        this.isReady = ( info["state"] & eRoomPeerState.eRoomPeer_Ready) == eRoomPeerState.eRoomPeer_Ready; 
        this.chip = info["chips"] ;

        if ( info["holdCnt"] == null && info["holdCards"] == null )
        {
            // no card info ;
            return ;
        }
        this.cards.parseFromMsg(info) ;
    }

    isReceivedDetail() : boolean 
    {
        return this.headIconUrl.length > 0 ;
    }

    parseDetailFromMsg( info : Object )
    {
        this.name = info["name"] ;
        this.headIconUrl = info["headIcon"] ;
        this.sex = info["sex"] ;
        this.ip = info["ip"] ;
        this.J = info["J"] ;
        this.W = info["W"] ;
    }

    onGameWillStart()
    {
        this.cards.clear();
        this.race = -1 ;
        this.isReady = false ;
    }
}