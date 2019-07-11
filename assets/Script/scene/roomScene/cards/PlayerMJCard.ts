import MJCard, { MJCardState } from "./MJCard";
import MJFactory from "./MJFactory";
import { eArrowDirect, eMJActType } from "../roomDefine";

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
    protected holdCardPosZ : number = 100 ;
    
    protected mIsReplayState = false ;
    protected _isSelf : boolean = false ;
    set isSelf( self : boolean )
    {

    }

    get isSelf()
    {
        return this._isSelf ;
    }
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

    onRefresh()
    {

    }

    onEat( withA : number , withB : number , target : number )
    {
        this.removeHold(withA);
        this.removeHold(withB);

        let m = new MingCardGroup();
        m.actType = eMJActType.eMJAct_Chi ;
        m.dir = eArrowDirect.eDirect_Opposite ;
        m.cards.push( this.mFacotry.getMJ( withA, MJCardState.FACE_UP,this.node ) );
        m.cards.push( this.mFacotry.getMJ( withB, MJCardState.FACE_UP,this.node ) );
        m.cards.push( this.mFacotry.getMJ( target, MJCardState.FACE_UP,this.node ) );
        this.mMingCards.push(m);

        this.relayoutHoldCards();
    }

    onPeng( num : number , dir : eArrowDirect )
    {
        this.removeHold(num,2);

        let m = new MingCardGroup();
        m.actType = eMJActType.eMJAct_Peng ;
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) );
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) );
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) );
        m.dir = dir ;
        this.mMingCards.push(m);

        this.relayoutHoldCards();
    }

    onMingGang( num : number , dir : eArrowDirect, newCard : number, cardWallPos : cc.Vec3 )
    {
        this.removeHold(num,3);

        let m = new MingCardGroup();
        m.actType = eMJActType.eMJAct_MingGang ;
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) );
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) );
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) );
        m.gangUpCards = this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) ;
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
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) );
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) );
        m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) );
        m.gangUpCards = this.mFacotry.getMJ( num, MJCardState.FACE_COVER,this.node ) ;
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

            v.gangUpCards = this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) ;
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
        
        let pos = this.mHoldCards[this.mHoldCards.length -1 ].node.position;
        pos.x += mj.world_x_Size * 0.5 ;
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

    onChu( chuCard : number )
    {
        let pos = this.removeHold(chuCard);
        let chuMJ = this.mFacotry.getMJ(chuCard,MJCardState.FACE_UP,this.node ) ;
        chuMJ.node.position = pos ;
        cc.tween(chuMJ.node).to( 0.15, { position: this.getChuCardPos( this.mChuCards.length ) } ) ;
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
        let xMargin = 10 ;
        let xAnHoldMargin = 2 ;
        let startX = -0.5 * ( this.mMingCards.length * 3 * ( MJCard.MODEL_X_SIZE + xMargin ) + this.mHoldCards.length * ( this.mHoldCards[0].world_x_Size + xAnHoldMargin ) ); 
     
        // layout ming cards ;
        for ( let ming of this.mMingCards )
        {
            switch ( ming.actType )
            {
                case eMJActType.eMJAct_Chi:
                case eMJActType.eMJAct_Peng:
                {
                    startX = this.layoutPartGroup(startX,ming.cards,ming.dir ) + xMargin ;
                }
                break;
                case eMJActType.eMJAct_AnGang:
                case eMJActType.eMJAct_MingGang:
                case eMJActType.eMJAct_BuGang:
                {
                    startX = this.layoutPartGroup(startX,ming.cards,ming.dir ) + xMargin ;
                    let pos = ming.cards[1].node.position;
                    pos.y += ming.gangUpCards.world_y_Size ;
                    ming.gangUpCards.node.position = pos ;
                }
                break;
            }
        }

        // layout hold cards ;
        this.mHoldCards.sort( ( a : MJCard , b : MJCard )=>{ return a.cardNum - b.cardNum ; } ) ;
        startX += this.mHoldCards[0].world_x_Size * 0.5 ;
        for ( const hmj of this.mHoldCards )
        {
             hmj.node.position = new cc.Vec3( startX,hmj.world_y_Size * 0.5,this.holdCardPosZ );
             startX += ( xAnHoldMargin + hmj.world_x_Size );
        }
    }

    protected layoutPartGroup( x : number , mjCards : MJCard[] , dir : eArrowDirect ) : number 
    {
        if ( mjCards.length != 3 )
        {
            cc.error( "ming group must 3 = " + mjCards[0].cardNum );
            return x ;
        }

        var card = mjCards[0] ;
        if ( dir == eArrowDirect.eDirect_Left )
        {
            let v = card.node.eulerAngles ;
            v.y += 90 ;
            card.node.eulerAngles = v ;

            x += card.world_z_Size * 0.5 ;
            card.node.position = new cc.Vec3(x ,card.world_y_Size * 0.5,this.holdCardPosZ );
            x += card.world_z_Size * 0.5 ;
        }
        else
        {
            x += card.world_x_Size * 0.5 ;
            card.node.position = new cc.Vec3(x,card.world_y_Size * 0.5,this.holdCardPosZ );
            x += card.world_x_Size * 0.5 ;
        }

        // card 2
        card = mjCards[1] ;
        x += card.world_x_Size * 0.5 ;
        card.node.position = new cc.Vec3(x,card.world_y_Size * 0.5,this.holdCardPosZ );
        x += card.world_x_Size * 0.5 ;

        // card 3
        card = mjCards[2] ; 
        if ( dir == eArrowDirect.eDirect_Righ )
        {
            let v = card.node.eulerAngles ;
            v.y -= 90 ;
            card.node.eulerAngles = v ;

            x += card.world_z_Size * 0.5 ;
            card.node.position = new cc.Vec3(x ,card.world_y_Size * 0.5,this.holdCardPosZ );
            x += card.world_z_Size * 0.5 ;
        }
        else
        {
            x += card.world_x_Size * 0.5 ;
            card.node.position = new cc.Vec3(x,card.world_y_Size * 0.5,this.holdCardPosZ );
            x += card.world_x_Size * 0.5 ;
        }
        return x ;
    }

    protected getChuCardPos( idx : number ) : cc.Vec3
    {
        let nCntPerRow = 6 ;
        let startX = -1 * nCntPerRow * 0.5 * MJCard.MODEL_X_SIZE ;
        let startZ = MJCard.MODEL_Z_SIZE ;
        let xMargin = 2;
        let zMargin = 2 ;

        var rowIdx = (idx + nCntPerRow ) / nCntPerRow - 1;
        var colIdx = idx % nCntPerRow ;
        var posTarget = new cc.Vec3( startX + colIdx * ( MJCard.MODEL_X_SIZE + xMargin ), MJCard.MODEL_Y_SIZE * 0.5, startZ + ( MJCard.MODEL_Z_SIZE + zMargin ) * rowIdx ) ;
        return posTarget;
    }
    // update (dt) {}
}
