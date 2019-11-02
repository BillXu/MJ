import { IPlayerCards, PlayerActedCard } from "../../roomData/MJPlayerCardData";
import { eArrowDirect, eMJActType } from "../../roomDefine";
import IPlayerMJCard, { MJPlayerCardHoldDelegate } from "../IPlayerMJCard";
import MJCardChu2D from "./MJCardChu2D";
import MJCardMing2D from "./MJCardMing2D";
import MJPlayerCardHold from "./MJPlayerCardHold";
import { IPlayerCardData } from "../ILayerCardsData";

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
export default class MJPlayerCard2D extends cc.Component implements IPlayerMJCard {

    @property
    posIdx : number = 0 ;

    @property(MJCardChu2D)
    chuCards : MJCardChu2D = null ;

    @property(MJCardMing2D)
    mingCards : MJCardMing2D = null ;

    @property(MJPlayerCardHold)
    holdCards : MJPlayerCardHold = null ;

    @property
    mMingHoldMargin : number = 16 ;

    isReplay : boolean = false ;

    mData : IPlayerCardData = null ;

    onLoad ()
    {
        this.chuCards.posIdx = this.posIdx ;
        this.mingCards.posIdx = this.posIdx ;
        this.holdCards.posIdx = this.posIdx ;
    }

    setHoldCardDelegate( delegate : MJPlayerCardHoldDelegate )
    {
        if ( this.posIdx == 0 && this.isReplay == false )
        {
            this.holdCards.mDelegate = delegate ;
        } 
        else
        {
            cc.error( "not replay , not pos = 0 why set delegate pos = " + this.posIdx );
        }
    }

    onRefresh( cardData : IPlayerCardData ,isReplay : boolean , isSelf : boolean ) : void 
    {
        this.mData = cardData ;
        this.isReplay = isReplay ;
        this.holdCards.isReplay = this.isReplay ;
        this.chuCards.refresh(cardData.getChus());
        this.mingCards.refresh( cardData.getMings() );
        this.holdCards.refresh( cardData.getHolds() ) ;
        if ( isSelf && isReplay == false )
        {
            this.holdCards.mReqChuCallBack = this.onSelfChu.bind(this);
        }
        this.layoutMingAndHold();
    }

    clear() : void
    {
        this.chuCards.clear();
        this.mingCards.clear();
        this.holdCards.clear();
    }

    showHoldAfterHu() : void 
    {
        let isreplay = this.isReplay ;
        this.holdCards.isReplay = true ;
        this.holdCards.refresh( this.mData.getHolds() ) ;
        this.holdCards.isReplay = isreplay ;
    }

    onChuCardBePengGangHu( cardNum : number ) : void 
    {
        this.chuCards.removeLastCard( cardNum );
    }

    switchCardHighLight( cardNum : number , isEnable : boolean )
    {
        this.mingCards.switchCardHighLight( cardNum,isEnable );
        this.chuCards.switchCardHighLight( cardNum, isEnable );
    }

    onDistributedCards() : void 
    {
        this.holdCards.onDistributeCard( this.mData.getHolds() );
        this.layoutMingAndHold();
    }

    onActMo( newCard : number ) : void 
    {
        this.holdCards.onMo(newCard);
    }

    onActChu( chuCard : number ) : void 
    {
        let p = this.holdCards.removeCard(chuCard);
        this.chuCards.addCard(chuCard,p ) ;
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
                        this.holdCards.removeCard( actedData.nTargetCard )
                    }
                }
                this.mingCards.addMingCards(actedData.vAddtionCards,eMJActType.eMJAct_Chi,actedData.eDir);
                this.layoutMingAndHold();
            }
            break ;
            case eMJActType.eMJAct_Peng:
            {
                this.onPeng( actedData.nTargetCard,actedData.eDir );
            }
            break;
            case eMJActType.eMJAct_MingGang:
            {
                this.onMingGang( actedData.nTargetCard, actedData.eDir, actedData.vAddtionCards[0] ) ;
            }
            break;
            case eMJActType.eMJAct_AnGang:
            {
                this.onAnGang( actedData.nTargetCard, actedData.vAddtionCards[0] );
            }
            break;
            case eMJActType.eMJAct_BuGang:
            case eMJActType.eMJAct_BuGang_Done:
            {
                this.onBuGang(actedData.nTargetCard,actedData.vAddtionCards[0] ) ;
            }
            break;
            case eMJActType.eMJAct_Hu:
            {
                this.onHu(actedData.nTargetCard, false )  ;
            }
            break ;
            default:
            {
                cc.error( "unknown act type = " + actedData.eAct );
                return ;
            }
            break ;
        }
    }

    protected onPeng( num : number , dir : eArrowDirect ) : void 
    {
        this.holdCards.removeCard( num,2 );
        this.mingCards.addMingCards([num,num,num],eMJActType.eMJAct_Peng,dir);
        this.layoutMingAndHold();
    }

    protected onMingGang( num : number , dir : eArrowDirect, newCard : number ) : void 
    {
        this.holdCards.removeCard( num,3 );
        this.mingCards.addMingCards([num,num,num],eMJActType.eMJAct_MingGang,dir);
        this.holdCards.onMo(newCard);
        this.layoutMingAndHold();
    }

    protected onAnGang( num : number , newCard : number) : void 
    {
        this.holdCards.removeCard( num,4 );
        this.mingCards.addMingCards([num,num,num],eMJActType.eMJAct_MingGang,null );
        this.holdCards.onMo(newCard);
        this.layoutMingAndHold();
    }

    protected onBuHua( num : number , newCard : number ) : void
    {
        this.holdCards.removeCard( num);
        this.holdCards.onMo(newCard);
        this.layoutMingAndHold();
    }

    protected onBuGang( num : number , newCard : number ) : void 
    {
        this.holdCards.removeCard( num,1 );
        this.mingCards.onBuGang(num) ;
        this.holdCards.onMo(newCard);
    }

    protected onHu( num : number , isZiMo : boolean ) : void 
    {
        this.holdCards.onHu( num, isZiMo ) ;
    }

    onSelfChu( chuCard : number , ptWorldPost : cc.Vec2 ) : boolean
    {
        if ( this.mData.reqChu(chuCard) == false )
        {
            return false ;
        }
        this.chuCards.addCard(chuCard,ptWorldPost ) ;
        return true ;
    }

    protected layoutMingAndHold()
    {
        let isPlus = this.posIdx < 2 ;
        let isX = this.posIdx % 2 == 0 ;
        let pos = this.mingCards.getContentlength() * ( isX ? this.mingCards.node.scaleX : this.mingCards.node.scaleY ) + this.holdCards.getLength()  * ( isX ? this.mingCards.node.scaleX : this.mingCards.node.scaleY ) + this.mMingHoldMargin ;
        pos *= 0.5 ;
        pos *= ( isPlus ? -1 : 1) ;
        let mingPos = this.mingCards.node.position;
        let holdPos = this.holdCards.node.position;
        this.mingCards.node.position = cc.v2( isX ? pos : mingPos.x ,  isX ? mingPos.y : pos );
        if ( this.mingCards.getContentlength() != 0 )
        {
            pos += ( this.mingCards.getContentlength() * ( isX ? this.mingCards.node.scaleX : this.mingCards.node.scaleY ) + this.mMingHoldMargin ) * ( isPlus ? 1 : -1);
        }

        this.holdCards.node.position = cc.v2( isX ? pos  : holdPos.x ,  isX ? holdPos.y : pos );
    }

    // LIFE-CYCLE CALLBACKS:
    start () {
        let self = this ;
        setTimeout(() => {
            self.layoutMingAndHold();
        }, 500);
    }

    // update (dt) {}
}
