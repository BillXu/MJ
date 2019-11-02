// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import * as _ from "lodash"
import MJCard2D from "./MJCard2D";
import MJCardFactory2D from "./MJCardFactory2D";
import { eCardSate } from "../../roomDefine";
import { MJPlayerCardHoldDelegate } from "../IPlayerMJCard";
const {ccclass, property} = cc._decorator;

enum eOptNodeState 
{
    eClick_Sel ,
    eWaitClick_Event,
    eDoubleClick_Sel,
    eDrag_Sel,
} ;


@ccclass
export default class MJPlayerCardHold extends cc.Component {

    posIdx : number = 0 ;

    @property(MJCardFactory2D)
    mFactory : MJCardFactory2D = null ;

    @property
    mMargin : number = 0 ;

    @property
    mNewMoCardMargin : number = 10 ;

    private vHoldCards : cc.Node[] = [] ;
    isReplay : boolean = false ;
    private optNodeProperty : Object = { } ; // { node : cc.Node , state : eOptNodeState , orgPos : cc.Vec2 , waitClickTimer : -1  }
    private pOutstandNode : cc.Node = null ;
    mDelegate : MJPlayerCardHoldDelegate = null ; 
    mReqChuCallBack : ( chuCard : number , ptWorldPost : cc.Vec2 ) => boolean = null ; 
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {

    }

    start () {
        //this.test();
        if ( this.posIdx == 0 && !this.isReplay )
        {
            this.node.targetOff(this);
            this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this) ;
            this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMoved,this) ;
            this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this) ;
            this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this) ;
        }
    }

    refresh( vHoldCards : number[] ) : void
    {
        this.clear();
        vHoldCards.sort();
        let isLastMo = vHoldCards.length % 3 == 2 ;
        for ( let idx = 0 ; idx < vHoldCards.length ; ++idx )
        {
            if ( idx == vHoldCards.length -1 && isLastMo )
            {
                this.onMo( vHoldCards[idx]);
            }
            else
            {
                let card = this.mFactory.getCard( vHoldCards[idx],this.posIdx, this.isReplay ? eCardSate.eCard_Out : eCardSate.eCard_Hold ) ;
                this.vHoldCards.push(card.node );
                this.node.addChild(card.node);
                if ( this.posIdx == 1 )
                {
                    card.node.zIndex = this.node.childrenCount * -1 ;
                }
                this.setCardPos(card.node,idx );
            }
        }
    }

    clear() : void 
    {
        let self = this ;
        _.remove( this.vHoldCards, ( node : cc.Node )=>{
            let card2d = node.getComponent(MJCard2D) ;
            self.mFactory.recycleCard(card2d);
            return true ;
        } );

        this.optNodeProperty = {} ;
        this.pOutstandNode = null ;
    }

    onDistributeCard( vholdCards : number[] )
    {
        this.clear();

        for ( let idx = 0 ; idx < vholdCards.length ; ++idx )
        {
            if ( idx == vholdCards.length -1 && vholdCards.length % 3 == 2 )
            {
                this.onMo(vholdCards[idx]) ;
                this.vHoldCards[this.vHoldCards.length -1 ].active = false ;
                continue ;
            }
            
            let card = this.mFactory.getCard( vholdCards[idx],this.posIdx, this.isReplay ? eCardSate.eCard_Out : eCardSate.eCard_Hold ) ;
            this.node.addChild(card.node);
            if ( this.posIdx == 1 )
            {
                card.node.zIndex = this.node.childrenCount * -1 ;
            }
            this.vHoldCards.push(card.node );
            this.setCardPos( card.node, idx ) ;
            card.node.active = false ;
        }

        let elaps = 0.2 * 1000 ;
        let self = this ;
        for ( let idx = 0 ; idx < vholdCards.length ; )
        {
            let inerIdx = idx ;
            setTimeout(() => {
                let cnt = 4 ;
                while ( inerIdx < vholdCards.length && cnt-- > 0 )
                {
                    self.vHoldCards[inerIdx].active = true ;
                    ++inerIdx ;
                }

            }, elaps * idx / 4  );
            idx += 4 ;
        }
    }

    removeCard( card : number , cnt : number = 1 ) : cc.Vec2 
    {
        let vPos : cc.Vec2 = cc.Vec2.ZERO ;
        let self = this ;
        _.remove( this.vHoldCards, ( node : cc.Node )=>{
            if ( cnt <= 0 )
            {
                return false ;
            }

            let card2d = node.getComponent(MJCard2D) ;
            if ( ( self.posIdx != 0 && self.isReplay == false ) || card2d.mCardNum == card )
            {
                vPos.x = card2d.node.x ;
                vPos.y = card2d.node.y ;
                self.mFactory.recycleCard(card2d);
                --cnt ;
                return true ;
            }

            return false ;
        } );

        console.log( "remove Card cnt = " + this.vHoldCards.length + " pos = " + vPos );
        this.layoutHoldCard();
        vPos = this.node.convertToWorldSpaceAR(vPos) ;
        return vPos ;
    }

    onMo( cardNum : number )
    {
        this.layoutHoldCard();

        let card = this.mFactory.getCard( cardNum,this.posIdx, this.isReplay ? eCardSate.eCard_Out : eCardSate.eCard_Hold ) ;
        this.vHoldCards.push(card.node );
        this.node.addChild(card.node);
        if ( this.posIdx == 1 )
        {
            card.node.zIndex = this.node.childrenCount * -1 ;
        }

        let isPlus = this.posIdx < 2 ;
        let isX = this.posIdx % 2 == 0 ;

        let cardSize = isX ? card.node.getContentSize().width : card.node.getContentSize().height ;
        let pos = ( isPlus ? 1 : -1 ) * ( ( this.vHoldCards.length - 1 ) * ( cardSize + this.mMargin ) + cardSize * 0.5 - this.mMargin + this.mNewMoCardMargin ) ;

        card.node.position = cc.v2( isX ? pos : 0 , isX ? 0 : pos );
    }

    onHu( cardNum : number , isZiMo : boolean )
    {
        if ( isZiMo )
        {
            this.removeCard(cardNum);
        }

        let card = this.mFactory.getCard( cardNum,this.posIdx, eCardSate.eCard_Out ) ;
        this.vHoldCards.push(card.node );
        this.node.addChild(card.node);

        let isPlus = this.posIdx < 2 ;
        let isX = this.posIdx % 2 == 0 ;

        let cardSize = isX ? this.vHoldCards[0].getContentSize().width : this.vHoldCards[0].getContentSize().height ;
        let thisCardSize = isX ? card.node.getContentSize().width : card.node.getContentSize().height ;
        let pos = ( isPlus ? 1 : -1 ) * ( ( this.vHoldCards.length - 1 ) * ( cardSize + this.mMargin ) + thisCardSize * 0.5 - this.mMargin + this.mNewMoCardMargin ) ;

        card.node.position = cc.v2( isX ? pos : 0 , isX ? 0 : pos );        
    }

    getLength() : number
    {
        if ( this.vHoldCards.length == 0 )
        {
            return 0 ;
        }

        let isX = this.posIdx % 2 == 0 ;
        let node = this.vHoldCards[this.vHoldCards.length -1 ] ;
        let size = node.getContentSize();
        //return ( isX ? ( Math.abs(node.x ) + size.width * 0.5 ) : ( Math.abs(node.y) + size.height * 0.5 ) );
        let lenght = ( isX ? (( size.width + this.mMargin ) * this.vHoldCards.length - this.mMargin ) : ( ( size.height + this.mMargin ) * this.vHoldCards.length - this.mMargin ));
        if ( this.vHoldCards.length % 3 == 2 )
        {
            lenght += ( this.mNewMoCardMargin - this.mMargin );
        }
        return lenght ;
    }

    protected setCardPos( cardNode : cc.Node , idx : number )
    {
        let isPlus = this.posIdx < 2 ;
        let isX = this.posIdx % 2 == 0 ;

        let cardSize = isX ? cardNode.getContentSize().width : cardNode.getContentSize().height ;
        let pos = ( isPlus ? 1 : -1 ) * ( idx * ( cardSize + this.mMargin ) + cardSize * 0.5 ) ;

        cardNode.position = cc.v2( isX ? pos : 0 , isX ? 0 : pos );
    }

    protected layoutHoldCard()
    { 
        if ( this.isReplay || this.posIdx == 0 )
        {
            this.vHoldCards.sort( ( a : cc.Node , b : cc.Node )=>{
                return a.getComponent(MJCard2D).mCardNum - b.getComponent(MJCard2D).mCardNum ;
            } ) ;
        }

        let self = this ;
        this.vHoldCards.forEach( ( v : cc.Node , idx : number )=>{
            cc.log( "layout hold pos = " + self.posIdx + " idx = " + idx );
            self.setCardPos(v,idx);
            if ( self.posIdx == 1 )
            {
                v.zIndex = idx * -1 ;
            }
        } );
    }

    protected onTouchStart( touchEvent : cc.Event.EventTouch )
    {
        if ( this.vHoldCards.length == 0 )
        {
            return ;
        }
        console.log( "onTouchStart" );
        let localPos = this.node.convertToNodeSpaceAR(touchEvent.getLocation());
        let node = undefined ;
         

        node = _.find( this.vHoldCards,( node : cc.Node)=>{
            let pBox = node.getBoundingBox();
            return pBox.contains(localPos);
        } ) ;

        if ( node == undefined )
        {
            if ( this.pOutstandNode )
            {
                if ( this.mDelegate )
                {
                    this.mDelegate.onHoldCardReleaseSelect( this.pOutstandNode.getComponent(MJCard2D).mCardNum ) ;
                }

                this.pOutstandNode.position = cc.v2( this.pOutstandNode.position.x, 0 );
                this.pOutstandNode = null ;
            }
            return ;
        }

        let preSelNode = this.optNodeProperty["node"] ;
        if ( preSelNode && preSelNode == node )
        {
            this.optNodeProperty["state"] = eOptNodeState.eDoubleClick_Sel ;
            // canncel click ;
            if ( this.optNodeProperty["waitClickTimer"] != undefined && this.optNodeProperty["waitClickTimer"] != -1 )
            {
                clearTimeout(this.optNodeProperty["waitClickTimer"]);
            }
        }
        else
        {
            this.optNodeProperty["node"] = node ;
            this.optNodeProperty["state"] = eOptNodeState.eClick_Sel ;
            this.optNodeProperty["orgPos"] = node.position ;
            if ( this.optNodeProperty["waitClickTimer"] != undefined && this.optNodeProperty["waitClickTimer"] != -1 )
            {
                clearTimeout(this.optNodeProperty["waitClickTimer"]);
            }
        }
    }

    protected onTouchMoved( touchEvent : cc.Event.EventTouch )
    {
        if ( this.vHoldCards.length == 0 )
        {
            return ;
        }

        let pSelNode : cc.Node = this.optNodeProperty["node"] ;
        if ( pSelNode == null )
        {
            return ;
        }
        
        if ( this.optNodeProperty["state"] == eOptNodeState.eDrag_Sel )
        {
            pSelNode.position = cc.v2(pSelNode.position.x + touchEvent.getDeltaX() , pSelNode.position.y + touchEvent.getDeltaY() );
        }
        else
        {
            if ( this.optNodeProperty["moveOrg"] == null )
            {
                this.optNodeProperty["moveOrg"] = touchEvent.getLocation();
                return ;
            }

            let ptOrigPos : cc.Vec2 = this.optNodeProperty["moveOrg"] ;
            let v = ptOrigPos.sub(touchEvent.getLocation());
            if ( Math.abs(v.x) > 8 || Math.abs(v.y) > 8 )
            {
                // treat it as moveing drag ;
                //pSelNode.position = localPos ;
                this.optNodeProperty["state"] = eOptNodeState.eDrag_Sel ;
                pSelNode.zIndex = 10 ; // darging node should cover others ;
                this.optNodeProperty["moveOrg"] = null ;
                console.log( "as draging state" );

                if ( this.mDelegate )
                {
                    this.mDelegate.onHoldCardSelected( pSelNode.getComponent(MJCard2D).mCardNum ) ;
                }
            }
        }
    }

    protected onTouchEnd( touchEvent : cc.Event.EventTouch )
    {
        if ( this.vHoldCards.length == 0 )
        {
            return ;
        }
        console.log( "onTouchEnd" );
        let state : eOptNodeState = this.optNodeProperty["state"] ;
        if ( state == null )
        {
            //cc.error( "do not have state property " );
            return ;
        }

        if ( eOptNodeState.eClick_Sel == state )
        {
            let self = this ;
            this.optNodeProperty["waitClickTimer"] = setTimeout(() => {
                self.onClickCardNode(this.optNodeProperty["node"] );
                self.optNodeProperty = {} ;
            }, 150);
            return ;
        }
        
        if ( eOptNodeState.eDoubleClick_Sel == state )
        {
            this.onDoubleClickCardNode(this.optNodeProperty["node"]);
            this.optNodeProperty = {} ;
            return ;
        }

        if ( eOptNodeState.eDrag_Sel == state )
        {
            let node : cc.Node = this.optNodeProperty["node"] ;
            node.zIndex = 0 ; // reset draging z order ;
            this.onDragEndCardNode(this.optNodeProperty["node"],this.optNodeProperty["orgPos"]);
            this.optNodeProperty = {} ;
            return ;
        }
        console.error( "unknown state touch end = " + state );
    }

    protected onTouchCancel( touchEvent : cc.Event.EventTouch )
    {
        let state : eOptNodeState = this.optNodeProperty["state"] ;
        if ( state == eOptNodeState.eDrag_Sel )
        {
            let node : cc.Node = this.optNodeProperty["node"] ;
            node.position = this.optNodeProperty["orgPos"] ;
            console.log("touch event cannel");
        }
    }

    protected onClickCardNode( pNode : cc.Node )
    {
        console.log( "click card node" );
        if ( this.mDelegate && this.pOutstandNode )
        {
            this.mDelegate.onHoldCardReleaseSelect( this.pOutstandNode.getComponent(MJCard2D).mCardNum ) ;
        }

        if ( pNode == this.pOutstandNode )
        {
            if ( this.mReqChuCallBack && this.mReqChuCallBack( pNode.getComponent(MJCard2D).mCardNum, pNode.convertToWorldSpaceAR(cc.Vec2.ZERO) ) )
            {
                this.mFactory.recycleCard( pNode.getComponent(MJCard2D) );
                _.remove( this.vHoldCards, (v : cc.Node )=> { return v == pNode } );
                this.layoutHoldCard();
            }
            else
            {
                this.pOutstandNode.position = cc.v2( this.pOutstandNode.position.x,0);
                this.pOutstandNode = null ;
            }
            return ;
        }

        if ( this.pOutstandNode )
        {
            this.pOutstandNode.position = cc.v2( this.pOutstandNode.position.x, 0 );
            this.pOutstandNode = null ;
        }
       
        this.pOutstandNode = pNode ;
        this.pOutstandNode.position = cc.v2( this.pOutstandNode.position.x, 20 );
        if ( this.mDelegate )
        {
            this.mDelegate.onHoldCardSelected( pNode.getComponent(MJCard2D).mCardNum ) ;
        }
    }

    protected onDoubleClickCardNode( pNode : cc.Node )
    {
        console.log( "double click card node" );
        if ( this.mReqChuCallBack && this.mReqChuCallBack( pNode.getComponent(MJCard2D).mCardNum, pNode.convertToWorldSpaceAR(cc.Vec2.ZERO) ) )
        {
            this.mFactory.recycleCard( pNode.getComponent(MJCard2D) );
            _.remove( this.vHoldCards, (v : cc.Node )=> { return v == pNode } );
            this.layoutHoldCard();
        }
    }

    protected onDragEndCardNode( pNode : cc.Node , nodeOrgPos : cc.Vec2 )
    {
        console.log( "drag card node" );
        if ( this.mDelegate )
        {
            this.mDelegate.onHoldCardReleaseSelect( pNode.getComponent(MJCard2D).mCardNum ) ;
        }

        let obx = pNode.getBoundingBox();
        if ( pNode.position.y - nodeOrgPos.y > obx.height )
        {
            if ( this.mReqChuCallBack && this.mReqChuCallBack( pNode.getComponent(MJCard2D).mCardNum, pNode.convertToWorldSpaceAR(cc.Vec2.ZERO) ) )
            {
                this.mFactory.recycleCard( pNode.getComponent(MJCard2D) );
                _.remove( this.vHoldCards, (v : cc.Node )=> { return v == pNode } );
                this.layoutHoldCard();
            }
            else
            {
                pNode.position = nodeOrgPos ;
            }
        }
        else
        {
            pNode.position = nodeOrgPos ;
            return ;
        }
    }

    // update (dt) {}
    test()
    {
        let self = this ;
        self.refresh( [22,20,23,22]);
        
        cc.systemEvent.on( "click", ()=>{ 
             let v : number[] = [] ;
             let cnt = 13 ;
             while ( cnt-- > 0 )
             {
                 v.push(22);
             }

             self.onDistributeCard(v) ;
        } ) ;

        cc.systemEvent.on( "click2", ()=>{ 
            self.removeCard(22,1) ;
       } ) ;

       cc.systemEvent.on( "click3", ()=>{ 
             self.onMo(22);
       } ) ;

       
       cc.systemEvent.on( "click4", ()=>{ 
            self.refresh( [22,20,23,22,22,22,22]);
        } ) ;
    }
}
