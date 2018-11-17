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
import { eMJCardType,eCardSate } from "./roomDefine"
@ccclass
export default class Card extends cc.Component {

    @property(cc.Sprite)
    pDirection : cc.Sprite = null ;

    @property([cc.Sprite])
    vCard: cc.Sprite[] = [];

    @property(cc.Node)
    pMingGangCover : cc.Node = null ;
    @property(cc.Node)
    pAnGangCover : cc.Node = null ;

    _eState : eCardSate = 0 ; // eCardSate ;
    nPosIdx : number = 0 ;  // self = 0 , right = 1 , up = 2 , left = 3 ;
    
    vCardNumber : number[] = [] ;
    private vCardsSpriteName : string[] = [] ;

    pRecyclePool : cc.NodePool = null ;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}

    set eState ( state : eCardSate )
    {
        this._eState = state ;
        if ( this.pMingGangCover )
        {
            this.pMingGangCover.active = state == eCardSate.eCard_MingGang ;
        }
        
        if ( this.pAnGangCover )
        {
            this.pAnGangCover.active = state == eCardSate.eCard_AnGang ;
        }
    }

    get eState()
    {
        return this._eState ;
    }

    private _ID : string = "" ;
    get ID () : string 
    {
        if ( this._ID.length > 1 )
        {
            return this._ID ;
        }

        let spriteName : string = "" ;
        this.vCardsSpriteName.forEach( ( str : string )=>{ spriteName + str ;} ) ;
        let number : string = "" ;
        this.vCardNumber.forEach( (n : number) =>{ number += n.toString();} );
        return spriteName + number ;
    }

    set ID ( cardID : string )
    {
        this._ID = cardID ;
    }

    set anchorX( x : number )
    {
        this.setAnchor(this.node,x,true);
    }

    set anchorY( Y : number )
    {
        this.setAnchor(this.node,Y,false);
    }

    setAnchor( pNode : cc.Node, anchor : number , isX : boolean )
    {
        if ( isX )
        {
            pNode.anchorX = anchor ;
        }
        else
        {
            pNode.anchorY = anchor ;
        }

        if ( pNode.childrenCount == 0 )
        {
            return ;
        }

        for ( let nIdx = 0 ; nIdx < pNode.childrenCount ; ++nIdx )
        {
            this.setAnchor(pNode.children[nIdx],anchor,isX);
        }
    }

    get cardNumber() : number
    {
        return this.vCardNumber[0] ;
    }

    setCard( cardNum : any , cardsAtlas : cc.SpriteAtlas ) 
    {
        if ( this.eState == eCardSate.eCard_Eat )
        {
            this.setEatCards(cardNum,cardsAtlas);
            return ;
        }   

        let num : number = cardNum as number ;
        this.vCardNumber[0] = num ;
        this.vCardsSpriteName[0] = this.getSpriteName(num) ;
        this.refreshCard(cardsAtlas);
    }

    refreshCard( cardsAtlas : cc.SpriteAtlas )
    {
        let self = this ;
        let vSize : cc.Size = cc.size(0,0);
        this.vCard.forEach( ( sp : cc.Sprite, index : number )=>{ 
            
            let strSpriteFrame : string = self.vCardsSpriteName[0] ;
            if ( index < self.vCardsSpriteName.length )
            {
                strSpriteFrame = self.vCardsSpriteName[index] ;
            }

            let cardSprite : cc.SpriteFrame = cardsAtlas.getSpriteFrame(strSpriteFrame);
            if ( cardSprite == null )
            {
                let num = 0 ;
                if ( index < self.vCardNumber.length )
                {
                    num = self.vCardNumber[index] ;
                }
                cc.error( "can not find card string Num = " + num + "strImg = " + strSpriteFrame );
                return ;
            }
            sp.spriteFrame = cardSprite ;
            if ( index < 3 )
            {
                vSize.width += cardSprite.getOriginalSize().width ;
                vSize.height += cardSprite.getOriginalSize().height ;
            }
        } ) ;

        if ( this.vCard.length > 1 )
        {
            this.vCard[0].node.getParent().setContentSize(vSize);
        }
    }

    private setEatCards( vCardNums : number[] , cardsAtlas : cc.SpriteAtlas )
    {
        this.vCardNumber.length = 0 ;
        this.vCardNumber = this.vCardNumber.concat(vCardNums);
        let self = this; 
        this.vCardNumber.forEach( ( n : number , index : number )=>{
            self.vCardsSpriteName[index] = self.getSpriteName(n); 
        } ) ;
        this.refreshCard(cardsAtlas);
    }
    
    private getSpriteName( nCardNumer : number ) : string 
    {
        if ( this.nPosIdx >= 4 )
        {
            cc.error( "invalid pos idx: " + this.nPosIdx );
            return "MyOut_Kong";
        }

        switch( this.eState )
        {
            case eCardSate.eCard_Hold:
            {
                if ( 0 == this.nPosIdx ) // self 
                {
                    return "MyHold"+ this.getCardPartName(nCardNumer);
                }
                else
                {
                    let v :string[] = [ "","righthold","MyUpHold","lefthold"] ;
                    return v[this.nPosIdx] ;
                }
            }
            break ;
            case eCardSate.eCard_Hu:
            case eCardSate.eCard_Out:
            {
                if ( 0 == this.nPosIdx || 2 == this.nPosIdx )
                {
                    return "MyOut" + this.getCardPartName(nCardNumer); 
                }

                if ( 1 == this.nPosIdx )
                {
                    return "rightPeng" + this.getCardPartName(nCardNumer);
                }
                else ( 3 == this.nPosIdx )
                {
                    return "leftPeng" + this.getCardPartName(nCardNumer);
                }
            }
            break;
            case eCardSate.eCard_Peng:
            case eCardSate.eCard_MingGang:
            case eCardSate.eCard_Eat:
            case eCardSate.eCard_AnGang:
            {
                if ( 0 == this.nPosIdx  )
                {
                    return "Myholdpeng" + this.getCardPartName(nCardNumer); 
                }

                if ( 2 == this.nPosIdx )
                {
                    return "MyUpPeng" + this.getCardPartName(nCardNumer); 
                }

                if ( 1 == this.nPosIdx )
                {
                    return "rightPeng" + this.getCardPartName(nCardNumer);
                }
                else ( 3 == this.nPosIdx )
                {
                    return "leftPeng" + this.getCardPartName(nCardNumer);
                }
            }
            break ;
            default:
            cc.error("unknown card state " + this.eState );
            return "MyOut_Kong" ;
        }
    }

    private getCardPartName( nCardNumer : number ) : string 
    {
        let vTypeString : string[] = [ "" ,"W","B","T","F","J","H"] ;
        let numValue : number = Card.parseCardValue(nCardNumer);
        return vTypeString[Card.parseCardType(nCardNumer)] + "" + numValue.toString(); 
    }

    start () {

    }

    static parseCardType( nCardNum : number ) : eMJCardType  
    {
        let nType : number = nCardNum & 0xF0 ;
        nType = nType >> 4 ;
        if ( (nType < eMJCardType.eCT_Max && nType > eMJCardType.eCT_None) == false )
        {
            cc.error("parse card type error , cardnum = " + nCardNum) ;
        }

        return nType ;
    }

    static parseCardValue( nCardNumer : number ) : number
    {
        return  (nCardNumer & 0xF) ;
    }

    static makeCardNum( type : eMJCardType   , val : number ) : number 
    {
        return (type << 4) | val ;
    }
}
