import MJCard, { MJCardState } from "./MJCard";
import MJFactory from "./MJFactory";

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
export default class MJCardHold3D extends cc.Component {

    @property
    mXAnHoldMargin : number = 0 ;
    @property
    mNewMoMargin : number = 10 ;

    @property(cc.Node)
    mHoldPosNode : cc.Node = null ; 

    protected mHoldCards : MJCard[] = [] ;
    mFacotry : MJFactory = null ;
    

    protected mSelfCamera : cc.Camera = null ;
    protected mClickDownCard : MJCard = null ;
    protected mCurSelectHoldMJ : MJCard = null ;

    mChuPaiCallBack : ( number : number , ptWorldPos : cc.Vec3 )=>boolean = null ;
    isRealCards : boolean = false ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    clear()
    {
        for ( const iterator of this.mHoldCards )
        {
            this.mFacotry.recycleMJ(iterator);
        }
        this.mHoldCards.length = 0 ;
    }

    refresh( cards : number[], isReply : boolean , isSelf : boolean  )
    {
        this.clear();
        this.isRealCards = isReply || isSelf ;
        for (const iterator of cards ) 
        {
            let mj = this.mFacotry.getMJ(iterator, isReply ? MJCardState.FACE_UP : MJCardState.FACE_USER,this.node ) ;
            if ( mj == null )
            {
                cc.error( "get mj failed = " + iterator );
                continue ;
            }

            mj.isSelf = isSelf ;
            this.mHoldCards.push(mj);
        }

        if ( this.mHoldCards.length == 0 )
        {
            return ;
        }
        this.layoutHolds();
        if ( this.mHoldCards.length % 3 == 2 )
        {
            let p = this.mHoldCards[this.mHoldCards.length-1].node ;
            p.position = cc.v3(p.x + this.mNewMoMargin , p.y, p.z );
        }

        this.setupToucheEvents( isSelf && false == isReply );
    }

    removeHold( cardNum: number , cnt : number = 1 ) : cc.Vec3 
    {
        while ( cnt > 0 )
        {
            let findIdx = -1 ;
            if ( this.isRealCards == false )
            {
                findIdx = 0 ;
            }
            else
            {
                this.mHoldCards.every( ( v : MJCard, idx : number )=>{
                    if ( v.cardNum == cardNum )
                    {
                        findIdx = idx ;
                        return false ;
                    }
                    return true ;
                } ) ;
            }

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
                this.layoutHolds();
                return removeCard.node.position as cc.Vec3;
            }
        }

        this.layoutHolds();
        return cc.Vec3.ZERO ;
    }

    mo( card : number , isReply : boolean , isSelf : boolean )
    {
        this.layoutHolds();
        let mj = this.mFacotry.getMJ(card, isReply ? MJCardState.FACE_UP : MJCardState.FACE_USER,this.node ) ;
        if ( mj == null )
        {
            cc.error( "get mj failed = " + card );
            return ;
        }

        mj.isSelf = isSelf ;
        this.mHoldCards.push(mj);
        let p = this.mHoldCards[this.mHoldCards.length -2 ].node ;
        mj.node.position = cc.v3(p.x + this.mNewMoMargin + mj.world_x_Size , p.y,p.z );
    }

    distribute( cards : number[], isReply : boolean , isSelf : boolean )
    {
        this.isRealCards = isReply || isSelf ;
        let idx = 0 ;
        let y = this.mHoldPosNode.position.y ;
        let z = (this.mHoldPosNode.position as cc.Vec3 ).z ;
        while ( idx < cards.length )
        {
            let c = cards[idx++] ;
            let self = this ;
            setTimeout(() => {
                let mj = self.mFacotry.getMJ(c, isReply ? MJCardState.FACE_UP : MJCardState.FACE_USER,self.node ) ;
                if ( mj == null )
                {
                    cc.error( "distribute get mj failed = " + c );
                    return ;
                }
    
                mj.isSelf = isSelf ;
                self.mHoldCards.push(mj);
                let x = mj.world_x_Size * 0.5 + ( self.mHoldCards.length -1 ) * ( mj.world_x_Size + self.mXAnHoldMargin ) + mj.world_x_Size ;
                mj.node.position = cc.v3( x , y,z);
            }, 1000 * 0.1 * idx );
        }

        let self = this ;
        setTimeout(() => {
            self.layoutHolds();
            if ( self.mHoldCards.length % 3 == 2 )
            {
                let p = this.mHoldCards[self.mHoldCards.length-1].node ;
                p.position = cc.v3(p.x + self.mNewMoMargin , p.y, p.z );
            }
        }, 1000 * 0.1 * ( idx + 5) );

        this.setupToucheEvents( isSelf && false == isReply );
    }
    
    protected setupToucheEvents( isEnable : boolean )
    {
        let canvas = cc.find('Canvas');
        canvas.targetOff(this);
        if ( isEnable )
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

    // self player card module 
    protected onTouchStart( event : cc.Event.EventTouch )
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

    protected onTouchMove( event : cc.Event.EventTouch )
    {

    }

    protected onTouchEnd( event : cc.Event.EventTouch )
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
            //cc.Component.EventHandler.emitEvents(this.mHandleChuPai,this.mCurSelectHoldMJ );
            if ( this.mChuPaiCallBack != null && this.mChuPaiCallBack( this.mCurSelectHoldMJ.cardNum, this.mCurSelectHoldMJ.node.convertToWorldSpaceAR( new cc.Vec3(0,0,0)) ) )
            {
                let ridx = this.mHoldCards.lastIndexOf(this.mCurSelectHoldMJ) ;
                if ( ridx == -1 )
                {
                    cc.error( "why card r idx is null ?" );
                }
                else
                {
                    this.mHoldCards.splice( ridx,1 );
                }
                this.mFacotry.recycleMJ(this.mCurSelectHoldMJ) ;
                this.mCurSelectHoldMJ = null ;
                this.layoutHolds();
            }
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

    protected layoutHolds()
    {
        let startX = 0 ;
        if ( this.isRealCards )
        {
            this.mHoldCards.sort( ( a : MJCard , b : MJCard )=>{ return a.cardNum - b.cardNum ; } ) ;
        }
        
        startX += this.mHoldCards[0].world_x_Size * 0.5 ;
        let y = this.mHoldPosNode.position.y ;
        let z = (this.mHoldPosNode.position as cc.Vec3 ).z ;
        for ( const hmj of this.mHoldCards )
        {
             hmj.node.position = new cc.Vec3( startX, y, z );
             startX += ( this.mXAnHoldMargin + hmj.world_x_Size );
             //cc.log( "hold pos = " + hmj.node.position );
        }
    }
    // update (dt) {}
}
