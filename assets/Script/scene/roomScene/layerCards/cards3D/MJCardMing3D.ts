import MJCard, { MJCardState } from "./MJCard";
import { eMJActType, eArrowDirect } from "../../roomDefine";
import MJFactory from "./MJFactory";
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

class MingCardGroup 
{
    cards : MJCard[] = [] ;
    gangUpCards : MJCard = null ;
    actType : eMJActType = 0 ;
    dir : eArrowDirect = 0 ;
    
} ;

@ccclass
export default class MJCardMing3D extends cc.Component {

    protected mMingCards : MingCardGroup[] = [] ;
    mFacotry : MJFactory = null ;
    isSelf : boolean = false ;

    @property
    mHoldMingMargin : number = 20 ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    clear()
    {
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
    }

    refresh( actedCards : PlayerActedCard[] , isself : boolean )
    {
        this.clear();
        this.isSelf = isself ;
        for ( let v of actedCards )
        {
            this.addMingGroup(v);
        }
    }

    addMingGroup( actedCards : PlayerActedCard )
    {
        let m = new MingCardGroup();
        m.actType = actedCards.eAct;
        m.dir = actedCards.eDir ;
        switch ( m.actType )
        {
            case eMJActType.eMJAct_Chi:
            {
                m.cards.push( this.mFacotry.getMJ( actedCards.vAddtionCards[0], MJCardState.FACE_UP,this.node ) );
                m.cards.push( this.mFacotry.getMJ( actedCards.vAddtionCards[1], MJCardState.FACE_UP,this.node ) );
                m.cards.push( this.mFacotry.getMJ( actedCards.vAddtionCards[2], MJCardState.FACE_UP,this.node ) );
            }
            break;
            case eMJActType.eMJAct_BuGang:
            case eMJActType.eMJAct_AnGang:
            case eMJActType.eMJAct_MingGang:
            case eMJActType.eMJAct_BuGang_Done:
            case eMJActType.eMJAct_Peng:
            {
                m.cards.push( this.mFacotry.getMJ( actedCards.nTargetCard, MJCardState.FACE_UP,this.node ) );
                m.cards.push( this.mFacotry.getMJ( actedCards.nTargetCard, MJCardState.FACE_UP,this.node ) );
                m.cards.push( this.mFacotry.getMJ( actedCards.nTargetCard, MJCardState.FACE_UP,this.node ) );
                if ( eMJActType.eMJAct_Peng != m.actType )
                {
                    m.gangUpCards = this.mFacotry.getMJ( actedCards.nTargetCard, m.actType == eMJActType.eMJAct_AnGang ? MJCardState.FACE_COVER : MJCardState.FACE_UP,this.node ) ;
                }
            }
            break ;
            default:
            cc.error( "unknown act type = " + m.actType );
            return ;
        }
        this.mMingCards.push(m);
        this.layoutMing();
    }

    onBuGang( nCard : number )
    {
        for ( let v of this.mMingCards )
        {
            if ( v.actType != eMJActType.eMJAct_Peng )
            {
                continue ;
            }

            if ( v.cards[0].cardNum != nCard )
            {
                continue ;
            }

            v.gangUpCards = this.mFacotry.getMJ( nCard, MJCardState.FACE_UP,this.node ) ;
            let vpos = v.cards[1].node.position ;
            vpos.y += v.gangUpCards.world_y_Size ;
            v.gangUpCards.node.position = vpos ;
            v.actType = eMJActType.eMJAct_BuGang;
            break ;
        }
    }

    getLength() : number 
    {
        if ( this.mMingCards.length == 0 )
        {
            return 0 ;
        }
        return this.mMingCards[this.mMingCards.length-1].cards[2].node.x + this.mMingCards[this.mMingCards.length-1].cards[2].world_x_Size * 0.5 ;
    }

    protected layoutMing()
    {
        let xMargin = this.mHoldMingMargin ;
        this.node.eulerAngles = new cc.Vec3( this.isSelf ? 30 : 0 ,0,0);
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
                    ming.gangUpCards.isSelf = this.isSelf ;
                }
                break;
            }
        }
    }

    protected layoutPartGroup( x : number , mjCards : MJCard[] , dir : eArrowDirect ) : number 
    {
        if ( mjCards.length != 3 )
        {
            cc.error( "ming group must 3 = " + mjCards[0].cardNum );
            return x ;
        }

        let self = this ;
        mjCards.forEach( (mj : MJCard )=>{ mj.isSelf = self.isSelf ; } )

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
    // update (dt) {}
}
