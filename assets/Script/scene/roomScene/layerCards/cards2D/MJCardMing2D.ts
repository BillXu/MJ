import MJCardFactory2D from "./MJCardFactory2D";
import MJCard2D from "./MJCard2D";
import { eMJActType, eArrowDirect, eCardSate } from "../../roomDefine";
import { PlayerActedCard } from "../../roomData/MJPlayerCardData";

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

class MingCardGroup2D 
{
    cards : MJCard2D[] = [] ;
    gangUpCards : MJCard2D = null ;
    actType : eMJActType = 0 ;
    dir : eArrowDirect = 0 ;
    dirNode : cc.Node = null ;
} ;

@ccclass
export default class MJCardMing2D extends cc.Component {

    @property
    margin : number = 0 ;

    @property(cc.Vec2)
    gangCardMargin : cc.Vec2 = cc.v2(0,20);

    @property(cc.Vec2)
    arrowMargin : cc.Vec2 = cc.v2();

    @property
    groupMargin : number = 16 ;

    posIdx : number = 0 ;

    @property(MJCardFactory2D)
    mFactroy : MJCardFactory2D = null ;

    @property(cc.SpriteFrame)
    mArrowSpriteFrame : cc.SpriteFrame = null ;

    curMaxPos : number = 0 ;

    vMingCards : MingCardGroup2D[] = [] ;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //this.test();
    }

    refresh( cardDataMing : PlayerActedCard[] )
    {
        this.clear();
        let self = this ;
        cardDataMing.forEach( v=>{
            if ( v.eAct == eMJActType.eMJAct_Chi )
            {
                self.addMingCards( v.vEatWithCards,v.eAct,v.eDir) ;
            }
            else
            {
                self.addMingCards( [v.nTargetCard,v.nTargetCard,v.nTargetCard],v.eAct,v.eDir ) ;
            }
        }) ;
    }

    clear()
    {
        for ( let m of this.vMingCards )
        {
            this.mFactroy.recycleCard(m.cards[0]);
            this.mFactroy.recycleCard(m.cards[1]);
            this.mFactroy.recycleCard(m.cards[2]);

            if ( m.gangUpCards != null )
            {
                this.mFactroy.recycleCard( m.gangUpCards );
            }

            if ( m.dirNode != null )
            {
                m.dirNode.removeFromParent();
            }
        }
        this.vMingCards.length = 0 ;
        this.curMaxPos = 0 ;
    }

    getContentlength() : number 
    {
        if ( this.node.childrenCount <= 0 )
        {
            return 0 ;
        }

        if ( 0 == this.posIdx || 2 == this.posIdx )
        {
            return Math.abs( this.curMaxPos ) + this.node.children[0].getContentSize().width * 0.5 ;
        }

        return Math.abs( this.curMaxPos ) ;
    }

    onBuGang( card : number )
    {
        for ( let c of this.vMingCards )
        {
            if ( c.actType != eMJActType.eMJAct_Peng )
            {
                continue ;
            }

            if ( c.cards[0].mCardNum != card )
            {
                continue ;
            }

            let cardN = this.mFactroy.getCard(card,this.posIdx,eCardSate.eCard_Out );
            this.node.addChild(cardN.node);
            c.gangUpCards = cardN ;
            c.gangUpCards.node.position = c.cards[1].node.position.add( this.gangCardMargin ) ;
            c.actType = eMJActType.eMJAct_BuGang;
            c.dirNode.position = this.arrowMargin.add( c.gangUpCards.node.position ) ;
            c.dirNode.zIndex = 1;
            return ;
        }
        cc.error( "not peng , how to bu gang ? card = " + card );
    }

    addMingCards( v3Cards : number[] , actType : eMJActType, dir : eArrowDirect )
    {
        let p = new MingCardGroup2D();
        p.actType = actType;
        let cnt = v3Cards.length ;
        while ( cnt-- )
        {
            let card = this.mFactroy.getCard( v3Cards[cnt],this.posIdx,eCardSate.eCard_Out );
            this.node.addChild(card.node);
            if ( this.posIdx == 1 )
            {
                card.node.zIndex = cnt - 2  ;
            }
            p.cards.push(card);
        }

        if ( actType == eMJActType.eMJAct_AnGang || actType == eMJActType.eMJAct_BuGang || actType == eMJActType.eMJAct_BuGang_Done || actType == eMJActType.eMJAct_MingGang )
        {
            let card = this.mFactroy.getCard(v3Cards[0],this.posIdx, actType == eMJActType.eMJAct_AnGang ? eCardSate.eCard_Back : eCardSate.eCard_Out );
            this.node.addChild(card.node);
            p.gangUpCards = card ;
            
            if ( actType == eMJActType.eMJAct_AnGang )
            {
                card.node.scaleX = p.cards[0].node.getContentSize().width / card.node.getContentSize().width ; 
                card.node.scaleY = p.cards[0].node.getContentSize().height / card.node.getContentSize().height ; 
            }
        }

        if ( dir != null && this.mArrowSpriteFrame != null )
        {
            p.dir = dir ;
            p.dirNode = new cc.Node();
            p.dirNode.addComponent(cc.Sprite).spriteFrame = this.mArrowSpriteFrame ;
            this.node.addChild( p.dirNode );    
        }

        this.vMingCards.push(p);
        this.layoutThisMingCardGroup(p) ;
    }

    switchCardHighLight( cardNum : number , isEnable : boolean )
    {
        for ( let cg of this.vMingCards )
        {
            cg.cards.forEach( v => { if ( v.mCardNum == cardNum ){ v.switchHighLight( isEnable); } } )
        }
    }

    protected layoutThisMingCardGroup( cards : MingCardGroup2D )
    {
        let self = this ;
        if ( this.vMingCards.length != 1 )
        {
            self.curMaxPos += this.groupMargin * ( ( this.posIdx == 2 || 3 == this.posIdx ) ? -1 : 1 ) ;
        }

        switch ( this.posIdx )
        {
            case 0 :
            {
                let length = cards.cards[0].node.getContentSize().width ; 
                cards.cards.forEach( ( v : MJCard2D, idx : number )=>{
                    v.node.position = cc.v2( self.curMaxPos + length * 0.5, 0 ) ;
                    self.curMaxPos += ( length + ( idx != 2 ? this.margin : 0 ) );
                } ) ;
    
                if ( cards.dirNode != null )
                {
                    let vPos = [ 0 , 180, -90 ] ;
                    cards.dirNode.angle = vPos[cards.dir] ;
                }                
            }
            break ;
            case 1 :
            {
                let length = cards.cards[0].node.getContentSize().height ; 
                cards.cards.forEach( ( v : MJCard2D, idx : number )=>{
                    v.node.position = cc.v2( 0, self.curMaxPos + length * 0.5 ) ;
                    self.curMaxPos += ( length + ( idx != 2 ? this.margin : 0 ) );
                } ) ;
    
                if ( cards.dirNode != null )
                {
                    let vPos = [ 90 , -90, 0 ] ;
                    cards.dirNode.angle = vPos[cards.dir] ;
                }   
            }
            break ;
            case 2 :
            {
                let length = cards.cards[0].node.getContentSize().width ; 
                cards.cards.forEach( ( v : MJCard2D, idx : number )=>{
                    v.node.position = cc.v2( self.curMaxPos - length * 0.5, 0 ) ;
                    self.curMaxPos -= ( length + ( idx != 2 ? this.margin : 0 ) );
                } ) ;
    
                if ( cards.dirNode != null )
                {
                    let vPos = [ 180 , 0, 90 ] ;
                    cards.dirNode.angle = vPos[cards.dir] ;
                } 
            }
            break ;
            case 3 :
            {
                let length = cards.cards[0].node.getContentSize().height ; 
                cards.cards.forEach( ( v : MJCard2D, idx : number )=>{
                    v.node.position = cc.v2( 0, self.curMaxPos - length * 0.5 ) ;
                    self.curMaxPos -= ( length + ( idx != 2 ? this.margin : 0 ) );
                } ) ;
    
                if ( cards.dirNode != null )
                {
                    let vPos = [ -90 , 90, 180 ] ;
                    cards.dirNode.angle = vPos[cards.dir] ;
                } 
            }
            break ;
            default:
            cc.error( "unknown pos index = " + this.posIdx );
            return ;
        }

        if ( cards.gangUpCards != null )
        {
            cards.gangUpCards.node.position = cards.cards[1].node.position.add( this.gangCardMargin ) ;
        }

        if ( cards.dirNode != null )
        {
            cards.dirNode.position = this.arrowMargin.add( cards.gangUpCards != null ? cards.gangUpCards.node.position : cards.cards[1].node.position ) ;
        }
    }

    // update (dt) {}
    test()
    {
        let self = this ; 
        self.addMingCards([24,24,24],eMJActType.eMJAct_Peng,eArrowDirect.eDirect_Left) ;
        self.addMingCards([24,24,24],eMJActType.eMJAct_AnGang,eArrowDirect.eDirect_Righ) ; 
        self.addMingCards([24,24,24],eMJActType.eMJAct_BuGang,eArrowDirect.eDirect_Opposite) ;

        cc.systemEvent.on( "click2", ()=>{ 
            self.addMingCards([24,24,24],eMJActType.eMJAct_MingGang,eArrowDirect.eDirect_Opposite) ;   
        } )
        
        cc.systemEvent.on( "click", ()=>{ 
            self.addMingCards([24,24,24],eMJActType.eMJAct_Peng,eArrowDirect.eDirect_Left) ;   
        } )

        cc.systemEvent.on( "click3", ()=>{ 
            self.addMingCards([24,24,24],eMJActType.eMJAct_AnGang,eArrowDirect.eDirect_Righ) ;   
        } )

        cc.systemEvent.on( "click4", ()=>{ 
            self.onBuGang(24);  
        } )
    }
}
