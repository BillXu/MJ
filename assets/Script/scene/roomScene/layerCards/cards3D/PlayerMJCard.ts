import MJFactory from "./MJFactory";
import IPlayerMJCard, { MJPlayerCardHoldDelegate } from "../IPlayerMJCard";
import MJCardHold3D from "./MJCardHold3D";
import MJCardChu3D from "./MJCardChu3D";
import MJCardMing3D from "./MJCardMing3D";
import { IPlayerCardData } from "../ILayerCardsData";
import { PlayerActedCard } from "../../roomData/MJPlayerCardData";
import { eMJActType } from "../../roomDefine";
import IChuCardArrow from "../IChuCardArrow";

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
export default class PlayerMJCard extends cc.Component implements IPlayerMJCard {

    @property(MJFactory)
    mFacotry : MJFactory = null ;

    @property
    mMingHoldMargin : number = 20 ;

    @property(MJCardHold3D)
    mHold : MJCardHold3D = null ;

    @property(MJCardChu3D)
    mChu : MJCardChu3D = null ;

    @property( MJCardMing3D )
    mMing : MJCardMing3D = null ;

    mDelegate : MJPlayerCardHoldDelegate = null ; 
    mChuArrow : IChuCardArrow = null ;

    mData : IPlayerCardData = null ;
    mIsReply : boolean = false ;
    mIsSelf : boolean = false ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    
    }

    // setHoldCardDelegate( del : MJPlayerCardHoldDelegate )
    // {
    //     this.mDelegate = del ;
    // }

    // showHoldAfterHu( card : number[] , huCard : number ) : void
    // {
    //     for ( const iterator of this.mHoldCards )
    //     {
    //         this.mFacotry.recycleMJ(iterator);
    //     }
    //     this.mHoldCards.length = 0 ;
    //     let r = this.mIsReplayState;
    //     this.mIsReplayState = true ;
    //     this.onDistribute(card) ;
    //     if ( card.length % 3 == 2 && huCard != 0 ) // really hu 
    //     {
    //         this.removeHold(huCard) ;
    //         this.relayoutHoldCards();
    //         this.onMo(huCard,null) ;
    //     }
    //     this.mIsReplayState = r ;
    // }

    // onEat( withA : number , withB : number , target : number,dir : eArrowDirect ) : void 
    // {
    //     this.removeHold(withA);
    //     this.removeHold(withB);

    //     let m = new MingCardGroup();
    //     m.actType = eMJActType.eMJAct_Chi ;
    //     m.dir = eArrowDirect.eDirect_Opposite ;
    //     m.cards.push( this.mFacotry.getMJ( withA, MJCardState.FACE_UP,this.mHoldMingNode ) );
    //     m.cards.push( this.mFacotry.getMJ( withB, MJCardState.FACE_UP,this.mHoldMingNode ) );
    //     m.cards.push( this.mFacotry.getMJ( target, MJCardState.FACE_UP,this.mHoldMingNode ) );
    //     this.mMingCards.push(m);

    //     this.relayoutHoldCards();
    // }

    // onPeng( num : number , dir : eArrowDirect ) : void 
    // {
    //     this.removeHold(num,2);

    //     let m = new MingCardGroup();
    //     m.actType = eMJActType.eMJAct_Peng ;
    //     m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
    //     m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
    //     m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
    //     m.dir = dir ;
    //     this.mMingCards.push(m);

    //     this.relayoutHoldCards();
    // }

    // onMingGang( num : number , dir : eArrowDirect, newCard : number, cardWallPos : cc.Vec3 ) : void 
    // {
    //     this.removeHold(num,3);

    //     let m = new MingCardGroup();
    //     m.actType = eMJActType.eMJAct_MingGang ;
    //     m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
    //     m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
    //     m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
    //     m.gangUpCards = this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) ;
    //     m.dir = dir ;
    //     this.mMingCards.push(m);

    //     this.relayoutHoldCards();
    //     this.onMo(newCard,cardWallPos);
    // }

    // onAnGang( num : number , newCard : number, cardWallPos : cc.Vec3 ) : void 
    // {
    //     this.removeHold(num,4);

    //     let m = new MingCardGroup();
    //     m.actType = eMJActType.eMJAct_AnGang ;
    //     m.dir = eArrowDirect.eDirect_Opposite ;
    //     m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
    //     m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
    //     m.cards.push( this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) );
    //     m.gangUpCards = this.mFacotry.getMJ( num, MJCardState.FACE_COVER,this.mHoldMingNode ) ;
    //     this.mMingCards.push(m);

    //     this.relayoutHoldCards();
    //     this.onMo(newCard,cardWallPos);
    // }

    // onBuHua( num : number , newCard : number, cardWallPos : cc.Vec3 ) : void 
    // {

    // }

    // onBuGang( num : number , newCard : number, cardWallPos : cc.Vec3 ) : void
    // {
    //     for ( let v of this.mMingCards )
    //     {
    //         if ( v.actType != eMJActType.eMJAct_Peng )
    //         {
    //             continue ;
    //         }

    //         if ( v.cards[0].cardNum != num )
    //         {
    //             continue ;
    //         }

    //         v.gangUpCards = this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.mHoldMingNode ) ;
    //         let vpos = v.cards[1].node.position ;
    //         vpos.y += v.gangUpCards.world_y_Size ;
    //         v.gangUpCards.node.position = vpos ;
    //         v.actType = eMJActType.eMJAct_BuGang;
    //         break ;
    //     }

    //     this.removeHold(num);
    //     this.relayoutHoldCards();
    //     this.onMo(newCard,cardWallPos);
    // }

    // onHu( num : number , isZiMo : boolean ) : void
    // {
    //     if ( isZiMo )
    //     {
    //         let v = this.mHoldCards[this.mHoldCards.length -1 ];
    //         if ( v.cardNum == num )
    //         {
    //             v.curState = MJCardState.FACE_UP ;
    //             let p = v.node.position ;
    //             p.y = v.world_y_Size * 0.5;
    //             v.node.position = p ;
    //         }
    //         else
    //         {
    //             let last = this.mHoldCards.pop();
    //             v = this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) ;
    //             let p = last.node.position ;
    //             p.y = v.world_y_Size * 0.5;
    //             v.node.position = p ;
    //             this.mHoldCards.push(v);
    //         }
    //     }
    //     else
    //     {
    //         let last = this.mHoldCards[this.mHoldCards.length -1 ];
    //         let v = this.mFacotry.getMJ( num, MJCardState.FACE_UP,this.node ) ;
    //         let p = last.node.position ;
    //         p.y = v.world_y_Size * 0.5;
    //         p.x += v.world_x_Size * 1.5 ;
    //         v.node.position = p ;
    //         this.mHoldCards.push(v);
    //     }
    // }

    // onChu( chuCard : number ) : cc.Vec2 | cc.Vec3 
    // {
    //     let pos = this.removeHold(chuCard);
    //     let chuMJ = this.mFacotry.getMJ(chuCard,MJCardState.FACE_UP,this.node ) ;
    //     chuMJ.node.position = pos ;
    //     let chuPos = this.getChuCardPos( this.mChuCards.length );
    //     cc.tween(chuMJ.node)
    //     .to( 0.15, { position: chuPos } )
    //     .start() ;
    //     this.mChuCards.push(chuMJ);
    //     this.relayoutHoldCards();
    //     return this.node.convertToWorldSpaceAR(chuPos) ;
    // }

    // onSelfChu( chuCard : number , ptWorldPost : cc.Vec2 | cc.Vec3 ) :  cc.Vec2 | cc.Vec3  
    // {
    //     let chuMJ = this.mFacotry.getMJ(chuCard,MJCardState.FACE_UP,this.node ) ;
    //     chuMJ.node.position = this.node.convertToNodeSpaceAR(ptWorldPost) ;
    //     let chuPos = this.getChuCardPos( this.mChuCards.length );
    //     cc.tween(chuMJ.node)
    //     .to( 0.15, { position: chuPos } )
    //     .start() ;
    //     this.mChuCards.push(chuMJ);
    //     this.relayoutHoldCards();
    //     return this.node.convertToWorldSpaceAR(chuPos) ;
    // }

    // update (dt) {}
    // interface iplayerMJcard 
    setHoldCardDelegate( del : MJPlayerCardHoldDelegate )
    {
        this.mDelegate = del ;
    }

    setChuArrow( del : IChuCardArrow )
    {
        this.mChuArrow = del ;
    }

    onRefresh( cardData : IPlayerCardData, isReplay : boolean , isSelf : boolean ) : void 
    {
        this.mIsReply = isReplay ;
        this.mIsSelf = isSelf ;
        this.mData = cardData ;
        this.mChu.mFacotry = this.mFacotry ;
        this.mHold.mFacotry = this.mFacotry ;
        this.mMing.mFacotry = this.mFacotry ;
        this.mMing.refresh( cardData.getMings() ,isSelf ) ;
        this.mChu.refresh( cardData.getChus() );
        this.mHold.refresh( cardData.getHolds(),isReplay,isSelf );
        if ( isSelf && isReplay == false )
        {
            this.mHold.mChuPaiCallBack = this.selfRequestChu.bind(this);
        }
        this.layoutHoldAndMing();
    }

    protected selfRequestChu( number : number , ptWorldPos : cc.Vec3 ) : boolean 
    {
        if ( this.mData.reqChu(number) == false )
        {
            return false ;
        }

        let p = this.mChu.addChuCard(number,ptWorldPos ) ;
        this.mChuArrow.moveArrowToWorldPos(p);
        return true ;
    }

    clear() : void 
    {
        this.mChu.clear();
        this.mHold.clear();
        this.mMing.clear();
    }

    showHoldAfterHu() : void 
    {
        this.mHold.refresh(this.mData.getHolds(),true,false) ;
    }

    onChuCardBePengGangHu( cardNum : number ) : void 
    {
        this.mChu.removeChuCard(cardNum);
    }

    switchCardHighLight( cardNum : number , isEnable : boolean ) : void 
    {

    }
    
    onDistributedCards() : void 
    {
        this.layoutHoldAndMing();
        this.mHold.distribute(this.mData.getHolds(), this.mIsReply , this.mIsSelf ) ;
        let self = this ;
        setTimeout(() => {
            self.layoutHoldAndMing();
        }, 3000);
    }

    onActMo( card : number ) : void
    {
        this.mHold.mo(card,this.mIsReply,this.mIsSelf );
    }

    onActChu( card : number ) : void
    {
        let p = this.mChu.addChuCard(card,this.mHold.removeHold(card,1) ) ;
        this.mChuArrow.moveArrowToWorldPos(p);
    }

    onActed( actedData : PlayerActedCard ) 
    {
        switch ( actedData.eAct )
        {
            case eMJActType.eMJAct_Chi:
            {
                for ( let v of actedData.vAddtionCards )
                {
                    if ( v != actedData.nTargetCard )
                    {
                        this.mHold.removeHold( v ) ;
                    }
                }
            }
            break ;
            case eMJActType.eMJAct_Peng:
            {
                this.mHold.removeHold( actedData.nTargetCard , 2 )
            }
            break;
            case eMJActType.eMJAct_MingGang:
            {
                this.mHold.removeHold( actedData.nTargetCard , 3 ) ;
                this.mHold.mo(actedData.vAddtionCards[0],this.mIsReply,this.mIsSelf);
            }
            break;
            case eMJActType.eMJAct_AnGang:
            {
                this.mHold.removeHold( actedData.nTargetCard , 4 ) ;
                this.mHold.mo(actedData.vAddtionCards[0],this.mIsReply,this.mIsSelf);
            }
            break;
            case eMJActType.eMJAct_BuGang:
            case eMJActType.eMJAct_BuGang_Done:
            {
                this.mHold.removeHold( actedData.nTargetCard )
                this.mMing.onBuGang(actedData.nTargetCard);
                this.mHold.mo(actedData.vAddtionCards[0],this.mIsReply,this.mIsSelf);
                return ; // can not add ming group ;
            }
            break;
            default:
            {
                cc.error( "unknown act type = " + actedData.eAct );
                return ;
            }
            break ;
        }
        this.mMing.addMingGroup(actedData);
        this.layoutHoldAndMing();
    }

    protected layoutHoldAndMing()
    {
        this.mHold.node.position = cc.v3( this.mMing.node.x + this.mMing.getLength() + this.mMingHoldMargin, this.mHold.node.y,this.mHold.node.z );
    }
}
