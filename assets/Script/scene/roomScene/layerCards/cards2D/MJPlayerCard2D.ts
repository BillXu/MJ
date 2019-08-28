import { IPlayerCards } from "../../roomData/MJPlayerCardData";
import { eArrowDirect, eMJActType } from "../../roomDefine";
import IPlayerMJCard, { MJPlayerCardHoldDelegate } from "../IPlayerMJCard";
import MJCardChu2D from "./MJCardChu2D";
import MJCardMing2D from "./MJCardMing2D";
import MJPlayerCardHold from "./MJPlayerCardHold";

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
export default class MJPlayerCard2D extends IPlayerMJCard {

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

    onLoad ()
    {
        this.chuCards.posIdx = this.posIdx ;
        this.mingCards.posIdx = this.posIdx ;
        this.holdCards.posIdx = this.posIdx ;
        this.holdCards.isReplay = this.isReplay ;
    }

    setIsReplay( isReplay : boolean ) : void
    {
        this.isReplay = isReplay ;
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

    onRefresh( cardData : IPlayerCards ) : void 
    {
        this.chuCards.refresh(cardData.vChuCards);
        this.mingCards.refresh( cardData );
        this.holdCards.refresh( cardData.vHoldCard ) ;
        this.layoutMingAndHold();
    }

    clear() : void
    {
        this.chuCards.clear();
        this.mingCards.clear();
        this.holdCards.clear();
    }

    showHoldAfterHu( card : number[] , huCard : number ) : void 
    {

    }

    onEat( withA : number , withB : number , target : number,dir : eArrowDirect ) : void 
    {
        this.holdCards.removeCard(withA);
        this.holdCards.removeCard(withB);
        this.mingCards.addMingCards([withA,target,withB],eMJActType.eMJAct_Chi,dir);
        this.layoutMingAndHold();
    }

    onPeng( num : number , dir : eArrowDirect ) : void 
    {
        this.holdCards.removeCard( num,2 );
        this.mingCards.addMingCards([num,num,num],eMJActType.eMJAct_Peng,dir);
        this.layoutMingAndHold();
    }

    onMingGang( num : number , dir : eArrowDirect, newCard : number, cardWallPos : cc.Vec3 ) : void 
    {
        this.holdCards.removeCard( num,3 );
        this.mingCards.addMingCards([num,num,num],eMJActType.eMJAct_MingGang,dir);
        this.holdCards.onMo(newCard);
        this.layoutMingAndHold();
    }

    onAnGang( num : number , newCard : number, cardWallPos : cc.Vec3 ) : void 
    {
        this.holdCards.removeCard( num,4 );
        this.mingCards.addMingCards([num,num,num],eMJActType.eMJAct_MingGang,null );
        this.holdCards.onMo(newCard);
        this.layoutMingAndHold();
    }

    onBuGang( num : number , newCard : number, cardWallPos : cc.Vec3 ) : void 
    {
        this.holdCards.removeCard( num,1 );
        this.mingCards.onBuGang(num) ;
        this.holdCards.onMo(newCard);
    }

    onHu( num : number , isZiMo : boolean ) : void 
    {
        this.holdCards.onHu( num, isZiMo ) ;
    }

    onMo( newCard : number , cardWallPos : cc.Vec3 ) : void 
    {
        this.holdCards.onMo(newCard);
    }

    onDistribute( newCards : number[] ) : void 
    {
        this.holdCards.onDistributeCard( newCards );
    }

    onChu( chuCard : number ) : cc.Vec2 | cc.Vec3 
    {
        let p = this.holdCards.removeCard(chuCard);
        return this.chuCards.addCard(chuCard,p ) ;
    }

    onSelfChu( chuCard : number , ptWorldPost : cc.Vec2 | cc.Vec3 ) : cc.Vec2 | cc.Vec3 
    {
        return this.chuCards.addCard(chuCard,<cc.Vec2>ptWorldPost ) ;
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
