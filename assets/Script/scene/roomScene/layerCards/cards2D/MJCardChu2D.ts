import MJCardFactory2D from "./MJCardFactory2D";
import MJCard2D from "./MJCard2D";
import { eCardSate } from "../../roomDefine";

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
export default class MJCardChu2D extends cc.Component {

    @property
    rowMargin : number = 0 ;

    @property
    colMargin : number = 0 ;

    posIdx : number = 0 ;

    @property(MJCardFactory2D)
    mFactroy : MJCardFactory2D = null ;

    refresh( vCards : number[] )
    {
        this.clear();
        for ( let c of vCards )
        {
            let card = this.mFactroy.getCard(c,this.posIdx,eCardSate.eCard_Out );
            this.node.addChild(card.node);
            if ( this.posIdx == 1 || 2 == this.posIdx )
            {
                card.node.zIndex = this.node.childrenCount * -1  ;
            }
            card.node.position = this.getLastChuCardPos();
        }
    }

    clear()
    {
        while ( this.node.childrenCount > 0 )
        {
            let card = this.node.children[0].getComponent( MJCard2D );
            if ( card == null )
            {
                cc.error( "why chu node do not have mjcard2d component" );
                continue ;
            }

            this.mFactroy.recycleCard(card);
        }
    }

    addCard( cardNum : number, ptWorldPos : cc.Vec2  ) : cc.Vec2
    {
        let card = this.mFactroy.getCard( cardNum ,this.posIdx,eCardSate.eCard_Out );
        this.node.addChild(card.node);
        if ( this.posIdx == 1 || 2 == this.posIdx  )
        {
            card.node.zIndex = this.node.childrenCount * -1  ;
        }
        card.node.position = this.getLastChuCardPos();
        return card.node.parent.convertToWorldSpaceAR( card.node.position );
    }

    removeLastCard( cardNum : number ) : boolean
    {
        if ( this.node.childrenCount <= 0 )
        {
            cc.warn( "child node is null " );
            return false ;
        }

        let card = this.node.children[0].getComponent(MJCard2D);
        if ( card != null && card.mCardNum == cardNum )
        {
            this.mFactroy.recycleCard(card);
            return true ;
        }

        return false ;
    }

    switchCardHighLight( cardNum : number , isEnable : boolean )
    {
        this.node.children.forEach( ( c : cc.Node )=>{ let card = c.getComponent(MJCard2D); if ( card && card.mCardNum == cardNum ){ card.switchHighLight(isEnable) ;}  } ) ;
    }

    protected getLastChuCardPos() : cc.Vec2
    {
        let COL_CNT = 6 ;
        let cnt = this.node.childrenCount;
        let rowIdx = Math.floor( ( cnt + COL_CNT -1 ) / COL_CNT ) - 1  ; 
        let colIdx = ( cnt -1 ) % COL_CNT ; 

        let size = this.node.children[0].getContentSize();
        switch ( this.posIdx )
        {
            case 0 :
            return cc.v2( colIdx * ( size.width + this.colMargin ) ,-1 * rowIdx * ( size.height + this.rowMargin ) );
            case 1 :
            return cc.v2( rowIdx * ( size.height + this.rowMargin ),colIdx * ( size.width + this.colMargin ) );
            case 2 :
            return cc.v2( -colIdx * ( size.width + this.colMargin ) ,rowIdx * ( size.height + this.rowMargin ) );
            case 3 :
            return cc.v2( -rowIdx * ( size.height + this.rowMargin ),-colIdx * ( size.width + this.colMargin ) );
        }
        cc.error( "unknown pos idx = " + this.posIdx );
        return cc.Vec2.ZERO ;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //this.test();
    }

    // update (dt) {}
    test()
    {
        let self = this ;
        self.refresh( [25,25,25,24,24,24,24,24,24 ] ) ;
        cc.systemEvent.on( "click2", ()=>{ 
            self.addCard( 24 , null );
        } )

        cc.systemEvent.on( "click", ()=>{ 
            self.clear();
        } )

        cc.systemEvent.on( "click3", ()=>{ 
            self.refresh( [25,25,25,24,24,24,24,24,24 ] ) ;
        } )
    }
}
