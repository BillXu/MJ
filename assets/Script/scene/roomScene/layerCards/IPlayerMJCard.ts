import { IPlayerCards } from "../roomData/MJPlayerCardData";
import { eArrowDirect } from "../roomDefine";

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
export interface MJPlayerCardHoldDelegate 
{
    onHoldCardSelected( cardNum : number ) : void ;
    onHoldCardReleaseSelect( cardNum : number ) : void ;
    onSelfRequestChuCard( cardNum : number , ptCardWorldPos : cc.Vec2 ) : boolean ;
}

@ccclass
export default abstract class IPlayerMJCard extends cc.Component {

    abstract setIsReplay( isReplay : boolean ) : void ;
    abstract setHoldCardDelegate( del : MJPlayerCardHoldDelegate );
    abstract onRefresh( cardData : IPlayerCards ) : void ;
    abstract clear() : void ;
    abstract showHoldAfterHu( card : number[] , huCard : number ) : void ;
    abstract onEat( withA : number , withB : number , target : number,dir : eArrowDirect ) : void ;
    abstract onPeng( num : number , dir : eArrowDirect ) : void ;
    abstract onMingGang( num : number , dir : eArrowDirect, newCard : number, cardWallPos : cc.Vec3 ) : void ;
    abstract onAnGang( num : number , newCard : number, cardWallPos : cc.Vec3 ) : void ;
    abstract onBuGang( num : number , newCard : number, cardWallPos : cc.Vec3 ) : void ;
    abstract onHu( num : number , isZiMo : boolean ) : void ;
    abstract onMo( newCard : number , cardWallPos : cc.Vec3 ) : void ;
    abstract onDistribute( newCards : number[] ) : void ;
    abstract onChu( chuCard : number ) : cc.Vec2 | cc.Vec3 ;
    abstract onSelfChu( chuCard : number , ptWorldPost : cc.Vec2 | cc.Vec3 ) :  cc.Vec2 | cc.Vec3  ;
    abstract onChuCardBePengGangHu( cardNum : number ) : void ;
    abstract switchCardHighLight( cardNum : number , isEnable : boolean ) : void ;
}
