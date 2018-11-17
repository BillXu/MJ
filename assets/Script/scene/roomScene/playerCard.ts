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
import CardFactory from "./cardFactory"
import {eCardSate, eArrowDirect, RoomEvent } from "./roomDefine"
import { IHoldMingPai } from "./roomInterface"
import Card from "./card";
import * as _ from "lodash"
@ccclass
export default class PlayerCard extends cc.Component {

    @property(cc.Vec2)
    ptOutStartPos : cc.Vec2 = cc.v2(0,0);
    @property
    nOutXOffset : number = 0 ;
    @property
    nOutYOffset : number = 0 ;
    @property
    nFirstRowCnt : number = 6;
    @property
    nOtherRowCnt : number = 10;
    @property({tooltip : "相对于第一排，其他排左边超出多少个麻将,决定其他排 水平方向开始位置"})
    nOtherRowLeftExtenCnt : number = 1;

    @property(cc.Vec2)
    ptHoldStartPos : cc.Vec2 = cc.v2(0,0);;
    @property
    nHoldOffset : number = 0 ;

    @property
    nHoldInterOffset : number = 0 ;

    @property(CardFactory)
    pCardFactory : CardFactory = null ;

    @property(cc.Node)
    pRootNode : cc.Node = null ;

    @property
    nPosIdx : number = 0 ;

    @property
    isReplay : boolean = false ;

    //------inter property ;
    private vOutCards : cc.Node[] = [] ;
    private vMingCards : cc.Node[] = [] ;
    private vHoldCards : cc.Node[] = [] ;
    private pFetchedCard : cc.Node = null ;

    isLeft() : boolean { return 3 == this.nPosIdx } 
    isRight() : boolean { return 1 == this.nPosIdx } 
    isUp() : boolean { return 2 == this.nPosIdx ; }
    isSelf() : boolean { return 0 == this.nPosIdx ; }

    // LIFE-CYCLE CALLBACKS:
    onLoad ()
    {
        if ( this.pRootNode == null )
        {
            this.pRootNode = this.node ;
        }
    }

    onRefreshCards( vHoldCards : number[] , holdCnt : number , vMingCards : IHoldMingPai[] , vOutCards : number[] , nFetchedCard: number )
    {
        // recycle all cards ;
        let self = this ;
        this.vOutCards.forEach( ( node : cc.Node )=>{ self.pCardFactory.recycleNode(node);} ) ;
        this.vOutCards.length = 0 ;
        this.vMingCards.forEach( ( node : cc.Node )=>{ self.pCardFactory.recycleNode(node);} ) ;
        this.vMingCards.length = 0 ;
        this.vHoldCards.forEach( ( node : cc.Node )=>{ self.pCardFactory.recycleNode(node);} ) ;
        this.vHoldCards.length = 0 ;
        if ( this.pFetchedCard )
        {
            self.pCardFactory.recycleNode(this.pFetchedCard);
        }

        // create cards ;
        for ( let nIdx = 0 ; nIdx < holdCnt ; ++nIdx )
        {
            let nNum : number = nIdx < vHoldCards.length ? vHoldCards[nIdx] : 0 ;
            let pNode = this.pCardFactory.createCard(nNum,this.nPosIdx,eCardSate.eCard_Hold) ;
            if ( pNode == null )
            {
                cc.error( "create hold card failed num = " + nNum + " client Pos idx = " + this.nPosIdx  );
                continue ;
            }

            this.isRight() ? this.pRootNode.addChild(pNode,-1*nIdx) : this.pRootNode.addChild(pNode) ;
            this.vHoldCards.push(pNode);
        }

        vMingCards = vMingCards || [] ;
        vOutCards = vOutCards || [] ;

        vMingCards.forEach( ( pMingCards : IHoldMingPai )=>{
            let pNode : cc.Node = null ;
            let nDirect : eArrowDirect = 0 ;
            let isEat = pMingCards.mjStateType == eCardSate.eCard_Eat ;
            if ( isEat && ( pMingCards.vEatWithCards == null || pMingCards.vEatWithCards.length != 3 ))
            {
                cc.error( "eat vect is not 3 or vEat is null" );
                return ;
            } 
            pNode = self.pCardFactory.createCard( isEat ? pMingCards.vEatWithCards : pMingCards.nCard,self.nPosIdx,pMingCards.mjStateType,nDirect);
            if ( null == pNode )
            {
                cc.error( "cannot create card node type = " + pMingCards.mjStateType + " card = " + pMingCards.nCard + " posidx = " + self.nPosIdx );
                return ;
            }
            self.pRootNode.addChild(pNode);
            self.vMingCards.push(pNode);
        } ) ;

        vOutCards.forEach( ( nNum : number, nIdx : number )=>{
            let pNode = self.pCardFactory.createCard( nNum,self.nPosIdx,eCardSate.eCard_Out);
            if ( null == pNode )
            {
                cc.error( "cannot create out card  = " + nNum + " posidx = " + self.nPosIdx );
                return ;
            }
            (this.isRight() || this.isUp())  ? this.pRootNode.addChild(pNode,-1*nIdx) : this.pRootNode.addChild(pNode) ;
            self.vOutCards.push(pNode);
        } ) ;

        if ( nFetchedCard != 0 )
        {
            let pNode = self.pCardFactory.createCard( nFetchedCard,self.nPosIdx,eCardSate.eCard_Hold);
            if ( null == pNode )
            {
                cc.error( "cannot create out card  = " + nFetchedCard + " posidx = " + self.nPosIdx );
                return ;
            }
            self.pRootNode.addChild(pNode);
            self.pFetchedCard = pNode ;
        }

        this.doRelayoutAllCards();
    }

    private doRelayoutAllCards()
    {
        let self = this;
        // layout out cards ;
        this.vOutCards.forEach( ( pnode : cc.Node , nidx : number )=>{ pnode.position = self.getOutCardPosByIdx(nidx);} );
        // layout ming cards ;
        this.vMingCards.forEach( ( pnode : cc.Node , nidx : number )=>{ pnode.position = self.getMingCardPosByIdx(nidx);} );
        // layout holdCards ;
        this.relayoutHoldCards();
        // layout fetched cards ;
        if ( this.pFetchedCard )
        {
            this.pFetchedCard.position = this.getFetchedCardPos();
        }
    }

    private getOutCardPosByIdx( nIdx : number ) : cc.Vec2
    {
        let nRowIdx = 0 ;
        let nColIdx = 0 ;
        if ( nIdx < this.nFirstRowCnt )
        {
            nRowIdx = 0 ;
            nColIdx = nIdx ;
        }
        else 
        {
            let nTempIdx = nIdx - this.nFirstRowCnt ; // omit first ,
            nRowIdx = Math.floor( (nTempIdx + this.nOtherRowCnt) / this.nOtherRowCnt ) - 1  ;
            nColIdx =  nTempIdx % this.nOtherRowCnt ;
            nRowIdx += 1 ; // add frist row ;
        }

        if ( this.isLeft() || this.isRight() )
        {
            let vStartPos = cc.v2( this.ptOutStartPos );
            if ( 0 != nRowIdx )
            {
                vStartPos.y += ( this.isLeft() ? 1 : -1  ) * this.nOutYOffset * this.nOtherRowLeftExtenCnt ;
            }

            vStartPos.x += ( this.isLeft() ? -1 : 1  ) * nRowIdx * this.nOutXOffset ;
            vStartPos.y += ( this.isLeft() ? -1 : 1  ) * nColIdx * this.nOutYOffset ;
            return vStartPos ; 
        }
        else
        {
            let vStartPos = cc.v2( this.ptOutStartPos );
            if ( 0 != nRowIdx )
            {
                vStartPos.x += ( this.isSelf() ? -1 : 1  ) * this.nOutXOffset * this.nOtherRowLeftExtenCnt ;
            }

            vStartPos.x += ( this.isSelf() ? 1 : -1  ) * nColIdx  * this.nOutXOffset ;
            vStartPos.y += ( this.isSelf() ? -1 : 1  ) * nRowIdx * this.nOutYOffset ;
            return vStartPos ; 
        }
    }

    private getMingCardPosByIdx( nIdx : number ) : cc.Vec2
    {
        if ( 0 == nIdx )
        {
            let pBox = this.vMingCards[nIdx].getBoundingBox();
            let preV = cc.v2(this.ptHoldStartPos);
            if ( this.isLeft() )
            {
                preV.y -= pBox.height * 0.5 ;
            }
            else if ( this.isRight() )
            {
                preV.y += pBox.height * 0.5 ;
            }
            else if ( this.isUp() )
            {
                preV.x -= pBox.width * 0.5;
            }
            else
            {
                preV.x -= pBox.width * 0.5 ;
            }
            return preV ;
        }

        let pPreBox = this.vMingCards[nIdx-1].getBoundingBox();
        let preV = cc.v2(this.vMingCards[nIdx-1].position);
        if ( this.isLeft() )
        {
            preV.y -= ( pPreBox.height + this.nHoldOffset );
        } 
        else if ( this.isRight() )
        {
            preV.y += ( pPreBox.height + this.nHoldOffset );
        }
        else if ( this.isSelf() )
        {
            preV.x += ( pPreBox.width + this.nHoldOffset );
        }
        else
        {
            preV.x -= ( pPreBox.width + this.nHoldOffset );
        }
        return preV;
    }

    private getHoldCardPosByIdx( nIdx : number ) : cc.Vec2
    {
        let preV : cc.Vec2 = null;
        if ( 0 == nIdx )
        {
            if ( this.vMingCards.length > 0 )
            { 
                let pPreBox = this.vMingCards[this.vMingCards.length - 1].getBoundingBox();
                let pBox = this.vHoldCards[nIdx].getBoundingBox();
                preV = cc.v2(this.vMingCards[this.vMingCards.length - 1].position);
                if ( this.isLeft() )
                {
                    preV.y -= ( pPreBox.height * 0.5 + pBox.height * 0.5 + this.nHoldOffset );
                } 
                else if ( this.isRight() )
                {
                    preV.y += ( pPreBox.height * 0.5 + pBox.height * 0.5 + this.nHoldOffset );
                }
                else if ( this.isSelf() )
                {
                    preV.x += ( pPreBox.width * 0.5 + pBox.width * 0.5 + this.nHoldOffset );
                }
                else
                {
                    preV.x -= ( pPreBox.width * 0.5 + pBox.width * 0.5 + this.nHoldOffset );
                }
                return preV;
            }
            else
            {
                let pBox = this.vHoldCards[nIdx].getBoundingBox();
                let preV = cc.v2(this.ptHoldStartPos);
                if ( this.isLeft() )
                {
                    preV.y -= pBox.height * 0.5 ;
                }
                else if ( this.isRight() )
                {
                    preV.y += pBox.height * 0.5 ;
                }
                else if ( this.isUp() )
                {
                    preV.x -= pBox.width * 0.5 ;
                }
                else
                {
                    preV.x += pBox.width * 0.5 ;
                }
                return preV;
            }
        }

        // idx != 0  ;
        preV = cc.v2(this.vHoldCards[nIdx - 1].position);
        if ( this.isLeft() )
        {
            preV.y -= this.nHoldInterOffset;
        } 
        else if ( this.isRight() )
        {
            preV.y += this.nHoldInterOffset;
        }
        else if ( this.isSelf() )
        {
            preV.x += this.nHoldInterOffset;
        }
        else
        {
            preV.x -= this.nHoldInterOffset;
        }
        return preV;
    }

    private getFetchedCardPos() : cc.Vec2
    {
        let pPreBox = this.vHoldCards[this.vHoldCards.length-1].getBoundingBox();
        let preV = cc.v2(this.vHoldCards[this.vHoldCards.length - 1].position);
        if ( this.isLeft() )
        {
            preV.y -= ( this.nHoldOffset + pPreBox.height );
        } 
        else if ( this.isRight() )
        {
            preV.y += ( this.nHoldOffset + pPreBox.height );
        }
        else if ( this.isSelf() )
        {
            preV.x += ( this.nHoldOffset + pPreBox.width );
        }
        else
        {
            preV.x -= ( this.nHoldOffset + pPreBox.width );
        }
        return preV;
    }

    private relayoutHoldCards()
    {
        if ( this.isSelf() || this.isReplay )
        {
            this.vHoldCards.sort( ( a : cc.Node , b : cc.Node )=>{
                let cardA : Card = a.getComponent(Card);
                let cardB : Card = b.getComponent(Card);
                return cardA.cardNumber - cardB.cardNumber ;
            } ) ;
        }

        let self = this ;
        this.vHoldCards.forEach( ( pnode : cc.Node , nidx : number )=>{ pnode.position = self.getHoldCardPosByIdx(nidx); } );
    }

    start () {

        let cardWan = Card.makeCardNum(1,1);
        let cardTong = Card.makeCardNum(2,1);
        let cardTiao = Card.makeCardNum(3,1);
        let cardTFeng = Card.makeCardNum(4,1);

        let vHold : number[] = [ cardWan + 1 , cardWan + 2,cardWan + 3 ,cardTiao , cardTiao + 1 , cardTiao + 3 , cardTFeng + 1 ,cardTFeng ] ;
        vHold.push(cardTong + 7);
        vHold.push(cardTong + 2 );
        vHold.push(cardTong + 5 );
    
        let vMIng : IHoldMingPai[]= [ 
            { "mjStateType" : eCardSate.eCard_Peng ,"nCard" : cardWan,"nInvokerClientIdx" : 2}
            //,{ "mjStateType" : eCardSate.eCard_MingGang ,"nCard" : cardTiao,"nInvokerClientIdx" : 2}
            //,{ "mjStateType" : eCardSate.eCard_AnGang ,"nCard" : cardTFeng,"nInvokerClientIdx" : 2}
            //,{ "mjStateType" : eCardSate.eCard_Eat ,"nCard" : cardTFeng, "vEatWithCards" : [cardTong , cardTong + 1 , cardTong + 2] ,"nInvokerClientIdx" : 2}
        ] ;
        let vOut : number[] = [ cardWan + 1 , cardWan + 2,cardWan + 3 ,cardTiao , cardTiao + 1 , cardTiao + 3, cardTiao + 4 ] ;
        vOut = vOut.concat(vHold);
        vOut = vOut.concat(vHold);
        vHold.length = 0 ;
        vHold.push(cardTFeng);

        this.onRefreshCards(vHold,10,vMIng,vOut,0) ;
    }

    // update (dt) {}
}
