import MJCard, { MJCardState } from "./MJCard";
import MJFactory from "./MJFactory";
import { eArrowDirect, eMJActType } from "../../../roomDefine";
import { IPlayerCards } from "../../../roomData/MJPlayerCardData";
import LayerPlayerCards3D from "../LayerPlayerCards3D";

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

class MingCardGroup 
{
    cards : MJCard[] = [] ;
    gangUpCards : MJCard = null ;
    actType : eMJActType = 0 ;
    dir : eArrowDirect = 0 ;
} ;

@ccclass
export default class PlayerMJCard extends cc.Component {

    @property(MJFactory)
    mFacotry : MJFactory = null ;

    protected mChuCards : MJCard[] = [] ;
    protected mHoldCards : MJCard[] = [] ;
    protected mMingCards : MingCardGroup[] = [] ;

    protected mCurSelectHoldMJ : MJCard = null ;

    @property
    mHoldMingMargin : number = 20 ;

    @property(cc.Node)
    mHoldAnNode : cc.Node = null ;

    mLayerCards : LayerPlayerCards3D = null ;

    get holdCardPosZ() : number
    {
        return this.mHoldAnNode.z ;
    }

    get holdCardPosY() : number
    {
        return this.mHoldAnNode.y ;
    }

    @property(cc.Node)
    mHoldMingNode : cc.Node = null ;

    @property(cc.Node)
    mChuNodeStart : cc.Node = null

    get chuCardStartX() : number 
    {
        return this.mChuNodeStart.x ;
    }

    get chuCardStartZ() : number
    {
        return this.mChuNodeStart.z ;
    }

    @property([cc.Component.EventHandler])
    mHandleChuPai : cc.Component.EventHandler[] = [] ; // ( chuCard : MJCard )
    
    protected mIsReplayState = false ;
    protected _isSelf : boolean = false ;
    set isSelf( self : boolean )
    {
        this._isSelf = self ;
        var canvas = cc.find('Canvas');
        if ( self )
        {
            canvas.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            canvas.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
        else
        {
            canvas.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            canvas.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
            canvas.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        }
    }

    get isSelf()
    {
        return this._isSelf ;
    }
    protected mSelfCamera : cc.Camera = null ;
    protected mClickDownCard : MJCard = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    clear()
    {
        for ( const iterator of this.mChuCards )
        {
            this.mFacotry.recycleMJ(iterator);
        }
        this.mChuCards.length = 0 ;

        for ( const iterator of this.mHoldCards )
        {
            this.mFacotry.recycleMJ(iterator);
        }
        this.mHoldCards.length = 0 ;

        for ( const iterator of this.mMingCards )
        {
            let self = this ;
            iterator.cards.forEach( ( v : MJCard )=>{ self.mFacotry.recycleMJ(v) ;} ) ;
            if ( iterator.gangUpCards != null )
            {
                self.mFacotry.recycleMJ( iterator.gangUpCards );
            }
        }

        this.mMingCards.length = 0 ;
        this.mCurSelectHoldMJ = null ;
    }

    onRefresh( cardData : IPlayerCards )
    {

    }

    onEat( withA : number , withB : number , target : number )
    {
        this.removeHold(withA);
        this.removeHold(withB);

        let m = new MingCardGroup();
        m.actType = eMJActType.eMJAct_Chi ;
        m.dir = eArrowDirect.eDirect_Opposite ;
        m.cards.push( this.mFacotry.getMJ( withA, MJCardState.FACE_UP,this.mHoldMingNode ) );
        m.cards.push( this.mFacotry.getMJ( withB, MJCardState.FACE_UP,this.mHoldMingNode ) );
        m.cards.push( this.mFacotry.getMJ( target, MJCardState.FACE_UP,this.mHoldMingNode ) );
        this.mMingCards.push(m);

        this.relayoutHoldCards();
    }

    onPeng( num : number , dir : eArrowDirect )
    {
        this.removeHold(num,2);

        let m = new MingCardGroup();
        m.actType = eMJActType.eMJAct_Peng ;
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
        m.dir = dir ;
        this.mMingCards.push(m);

        this.relayoutHoldCards();
    }

    onMingGang( num : number , dir : eArrowDirect, newCard : number, cardWallPos : cc.Vec3 )
    {
        this.removeHold(num,3);

        let m = new MingCardGroup();
        m.actType = eMJActType.eMJAct_MingGang ;
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
        m.gangUpCards = this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) ;
        m.dir = dir ;
        this.mMingCards.push(m);

        this.relayoutHoldCards();
        this.onMo(newCard,cardWallPos);
    }

    onAnGang( num : number , newCard : number, cardWallPos : cc.Vec3 )
    {
        this.removeHold(num,4);

        let m = new MingCardGroup();
        m.actType = eMJActType.eMJAct_AnGang ;
        m.dir = eArrowDirect.eDirect_Opposite ;
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
        m.gangUpCards = this.mFacotry.getMJ( num, MJCardState.FACE_COVER,this.mHoldMingNode ) ;
        this.mMingCards.push(m);

        this.relayoutHoldCards();
        this.onMo(newCard,cardWallPos);
    }

    onBuGang( num : number , newCard : number, cardWallPos : cc.Vec3 )
    {
        for ( let v of this.mMingCards )
        {
            if ( v.actType != eMJActType.eMJAct_Peng )
            {
                continue ;
            }

            if ( v.cards[0].cardNum != num )
            {
                continue ;
            }

            v.gangUpCards = this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) ;
            let vpos = v.cards[1].node.position ;
            vpos.y += v.gangUpCards.world_y_Size ;
            v.gangUpCards.node.position = vpos ;
            v.actType = eMJActType.eMJAct_BuGang;
            break ;
        }

        this.removeHold(num);
        this.onMo(newCard,cardWallPos);
    }

    onHu( num : number , isZiMo : boolean )
    {
        if ( isZiMo )
        {
            let v = this.mHoldCards[this.mHoldCards.length -1 ];
            if ( v.cardNum == num )
            {
                v.curState = MJCardState.FACE_UP ;
                let p = v.node.position ;
                p.y = v.world_y_Size * 0.5;
                v.node.position = p ;
            }
            else
            {
                let last = this.mHoldCards.pop();
                v = this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) ;
                let p = last.node.position ;
                p.y = v.world_y_Size * 0.5;
                v.node.position = p ;
                this.mHoldCards.push(v);
            }
        }
        else
        {
            let last = this.mHoldCards[this.mHoldCards.length -1 ];
            let v = this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) ;
            let p = last.node.position ;
            p.y = v.world_y_Size * 0.5;
            p.x += v.world_x_Size * 1.5 ;
            v.node.position = p ;
            this.mHoldCards.push(v);
        }
    }

    onMo( newCard : number , cardWallPos : cc.Vec3 )
    {
        let mj = this.mFacotry.getMJ(newCard, this.mIsReplayState ? MJCardState.FACE_UP : MJCardState.FACE_USER,this.node ) ;
        mj.isSelf = this.isSelf ;
        this.mHoldCards.push(mj);

        let pos = this.mHoldCards[this.mHoldCards.length -2 ].node.position;
        pos.x += mj.world_x_Size * 1.5 ;
        if ( null == cardWallPos )
        {
            mj.node.position = pos ;
            return ;
        }

        // a move animation to hold ;
        let posLocal = new cc.Vec3();
        this.node._invTransformPoint(posLocal,cardWallPos );
        mj.node.position = posLocal ;
        cc.tween(mj.node).to( 0.15, { position: pos} ) ;
    }

    onDistribute( newCards : number[] )
    {
        for (const iterator of newCards ) 
        {
            let mj = this.mFacotry.getMJ(iterator, this.mIsReplayState ? MJCardState.FACE_UP : MJCardState.FACE_USER,this.node ) ;
            if ( mj == null )
            {
                cc.error( "get mj failed = " + iterator );
                continue ;
            }

            mj.isSelf = this.isSelf ;
            this.mHoldCards.push(mj);
        }

        if ( this.mHoldCards.length == 0 )
        {
            return ;
        }
        this.relayoutHoldCards();
    }

    onChu( chuCard : number )
    {
        let pos = this.removeHold(chuCard);
        let chuMJ = this.mFacotry.getMJ(chuCard,MJCardState.FACE_UP,this.node ) ;
        chuMJ.node.position = pos ;
        let self = this ;
        cc.tween(chuMJ.node)
        .to( 0.15, { position: this.getChuCardPos( this.mChuCards.length ) } )
        .call( ()=>{
            let wp = new cc.Vec3();
            wp = chuMJ.node.getWorldPosition(wp);
            self.mLayerCards.moveArrowToWorldPos( wp ) ;
         } )
        .start() ;
        this.mChuCards.push(chuMJ);
        this.relayoutHoldCards();
    }

    onChuCardBePengGangHu( cardNum : number )
    {
        let p = this.mChuCards.pop();
        if ( cardNum != p.cardNum )
        {
            cc.warn( "onChuCardBePengGangHu card = is not the same v = " + cardNum + " t = " + p.cardNum );
        }
        this.mFacotry.recycleMJ(p);
        this.mLayerCards.hideArrow();
    }

    protected removeHold( cardNum : number , cnt : number = 1 ) : cc.Vec3 
    {
        if ( this.mCurSelectHoldMJ != null && cardNum == this.mCurSelectHoldMJ.cardNum )
        {
            let pos = this.mCurSelectHoldMJ.node.position ;
            let selIdx = this.mHoldCards.indexOf(this.mCurSelectHoldMJ) ;
            if ( selIdx == -1 )
            {
                cc.error( "in hold card num can not find cardnum = " + cardNum );
                return cc.Vec3.ZERO ;
            }

            this.mHoldCards.splice(selIdx,1);
            this.mFacotry.recycleMJ( this.mCurSelectHoldMJ );
            --cnt ;
            this.mCurSelectHoldMJ = null ;
            if ( cnt <= 0 )
            {
                return pos ;
            }
        }

        if ( this.isSelf || this.mIsReplayState  )
        {
            while ( cnt > 0 )
            {
                let findIdx = -1 ;
                this.mHoldCards.every( ( v : MJCard, idx : number )=>{
                    if ( v.cardNum == cardNum )
                    {
                        findIdx = idx ;
                        return false ;
                    }
                    return true ;
                } ) ;

                if ( -1 == findIdx )
                {
                    cc.error( "can not find card to remove error = " + cardNum );
                    return cc.Vec3.ZERO ;
                }
                
                let removeCard = this.mHoldCards[findIdx] ;
                this.mHoldCards.splice(findIdx,1);
                this.mFacotry.recycleMJ(removeCard);
                --cnt ;
                if ( 0 == cnt )
                {
                    return removeCard.node.position ;
                }
            }
            return cc.Vec3.ZERO ;
        }
        else
        {
            while ( cnt > 0 && this.mHoldCards.length > 0 )
            {
                var removeCard = this.mHoldCards.pop();
                this.mFacotry.recycleMJ(removeCard);
                --cnt ;
                if ( 0 == cnt )
                {
                    return removeCard.node.position ;
                }
            }
        }

        return cc.Vec3.ZERO ;
    }

    protected relayoutHoldCards()
    {
        let xMargin = this.mHoldMingMargin ;
        let xAnHoldMargin = 0 ;
        let startX = -0.5 * ( this.mMingCards.length * 3 * ( MJCard.MODEL_X_SIZE + xMargin ) + this.mHoldCards.length * ( this.mHoldCards[0].world_x_Size + xAnHoldMargin ) ); 
        this.mHoldMingNode.x = startX ;
        if ( this.isSelf )
        {
            this.mHoldMingNode.eulerAngles = new cc.Vec3(30,0,0);
        }
        // layout ming cards ;
        let startMing = 0 ;
        for ( let ming of this.mMingCards )
        {
            switch ( ming.actType )
            {
                case eMJActType.eMJAct_Chi:
                case eMJActType.eMJAct_Peng:
                {
                    startMing = this.layoutPartGroup(startMing,ming.cards,ming.dir ) + xMargin ;
                }
                break;
                case eMJActType.eMJAct_AnGang:
                case eMJActType.eMJAct_MingGang:
                case eMJActType.eMJAct_BuGang:
                {
                    startMing = this.layoutPartGroup(startMing,ming.cards,ming.dir ) + xMargin ;
                    let pos = ming.cards[1].node.position;
                    pos.y += ming.gangUpCards.world_y_Size;
                    ming.gangUpCards.node.position = pos ;
                    if ( this.isSelf )
                    {
                        ming.gangUpCards.isSelf = true ;
                        //ming.gangUpCards.node.eulerAngles = new cc.Vec3(-30,180,0);
                    }
                }
                break;
            }
        }

        // layout hold cards ;
        startX += startMing ; //this.mMingCards.length * 3 * ( MJCard.MODEL_X_SIZE + xMargin ) ;
        this.mHoldCards.sort( ( a : MJCard , b : MJCard )=>{ return a.cardNum - b.cardNum ; } ) ;
        startX += this.mHoldCards[0].world_x_Size * 0.5 ;
        for ( const hmj of this.mHoldCards )
        {
             hmj.node.position = new cc.Vec3( startX, this.holdCardPosY,this.holdCardPosZ );
             startX += ( xAnHoldMargin + hmj.world_x_Size );
             cc.log( "hold pos = " + hmj.node.position );
        }
    }

    protected layoutPartGroup( x : number , mjCards : MJCard[] , dir : eArrowDirect ) : number 
    {
        if ( mjCards.length != 3 )
        {
            cc.error( "ming group must 3 = " + mjCards[0].cardNum );
            return x ;
        }

        if ( this.isSelf )
        {
            mjCards.forEach( (mj : MJCard )=>{ mj.isSelf = true ; } )
        }

        var card = mjCards[0] ;
        if ( dir == eArrowDirect.eDirect_Left )
        {
            card.node.eulerAngles =  new cc.Vec3(0,270,0 ); ;

            x += card.world_z_Size * 0.5 ;
            card.node.position = new cc.Vec3(x ,0,0 );
            x += card.world_z_Size * 0.5 ;
        }
        else
        {
            x += card.world_x_Size * 0.5 ;
            card.node.position = new cc.Vec3(x,0,0 );
            x += card.world_x_Size * 0.5 ;
        }

        // card 2
        card = mjCards[1] ;
        x += card.world_x_Size * 0.5 ;
        card.node.position = new cc.Vec3(x,0,0 );
        x += card.world_x_Size * 0.5 ;

        // card 3
        card = mjCards[2] ; 
        if ( dir == eArrowDirect.eDirect_Righ )
        {
            card.node.eulerAngles =  new cc.Vec3(0,90,0 ); 

            x += card.world_z_Size * 0.5 ;
            card.node.position = new cc.Vec3(x,0,0 );
            x += card.world_z_Size * 0.5 ;
        }
        else
        {
            x += card.world_x_Size * 0.5 ;
            card.node.position = new cc.Vec3(x,0,0 );
            x += card.world_x_Size * 0.5 ;
        }
        return x ;
    }

    protected getChuCardPos( idx : number ) : cc.Vec3
    {
        let nCntPerRow = 6 ;
        let xMargin = 1;
        let zMargin = 2 ;

        let startX = this.chuCardStartX ;//-1 * nCntPerRow * 0.5 * ( MJCard.MODEL_X_SIZE + xMargin ) + 0.5 * MJCard.MODEL_X_SIZE ;
        let startZ = this.chuCardStartZ ;


        var rowIdx = (idx + nCntPerRow ) / nCntPerRow -1;
        rowIdx = Math.floor(rowIdx);
        var colIdx = Math.floor( idx % nCntPerRow ) ;
        var posTarget = new cc.Vec3( startX + colIdx * ( MJCard.MODEL_X_SIZE + xMargin ), MJCard.MODEL_Y_SIZE * 0.5, startZ + ( MJCard.MODEL_Z_SIZE + zMargin ) * rowIdx ) ;
        cc.log( "chu target card = " + posTarget );
        return posTarget;
    }

    // self player card module 
    onTouchStart( event : cc.Event.EventTouch )
    {
        if ( event.touch.getLocation().y > 120 )
        {
            this.mClickDownCard = null ;
            return ;
        }

        cc.log( "onTouchStart of touch pos : " + event.touch.getLocation() );
        this.mClickDownCard = this.rayCastCard( event.touch.getLocation() );
        if ( this.mClickDownCard == null )
        {
            return ;
        }
    }

    onTouchMove( event : cc.Event.EventTouch )
    {

    }

    onTouchEnd( event : cc.Event.EventTouch )
    {
        if ( this.mClickDownCard == null )
        {
            cc.log( "no click card" );
            return ;
        }

        let pc = this.rayCastCard( event.touch.getLocation() );
        if ( pc != this.mClickDownCard )
        {
            cc.log( "not the same card , so skip it" );
            return ;
        }

        if ( null != this.mCurSelectHoldMJ && this.mCurSelectHoldMJ != this.mClickDownCard )
        {
            let pos = this.mCurSelectHoldMJ.node.position ;
            pos.y = 0 ;
            this.mCurSelectHoldMJ.node.position = pos ;
        }

        let isInvokeChuCallBack = this.mCurSelectHoldMJ == this.mClickDownCard;

        this.mCurSelectHoldMJ = this.mClickDownCard ;
        this.mClickDownCard = null ;
        let pos = this.mCurSelectHoldMJ.node.position ;
        pos.y = this.mCurSelectHoldMJ.world_y_Size * 0.2;
        this.mCurSelectHoldMJ.node.position = pos ;

        if ( isInvokeChuCallBack ) // double clicked ;
        {
            this.mClickDownCard = null ;
            cc.Component.EventHandler.emitEvents(this.mHandleChuPai,this.mCurSelectHoldMJ );
            return ;
        }
    }

    protected rayCastCard( pos : cc.Vec2 ) : MJCard
    {
        if ( this.mSelfCamera == null )
        {
            this.mSelfCamera = cc.find("3D/opeateCamer/SelfCamera").getComponent(cc.Camera);
        }

        let ray = this.mSelfCamera.getRay(pos) ;
        let results = cc.geomUtils.intersect.raycast(this.node, ray);
        	
        if ( results.length > 0 ) 
        {
            // results[0].node.opacity = 100;
 
            return results[0].node.getComponent(MJCard);
            //let distance = results[0].distance;
            
            // let d = cc.vmath.vec3.normalize(cc.v3(), ray.d);
            // let p = cc.vmath.vec3.scaleAndAdd(cc.v3(), ray.o, d, distance);
            // this.mesh.position = p;
        }
        return null ;
    }
    // update (dt) {}
}
