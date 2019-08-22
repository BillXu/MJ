import ILayer from "../ILayer";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

 
export default abstract class  ILayerPlayerCard extends ILayer {

    abstract setBottomSvrIdx( svrIdx : number ) : void ;
    abstract onDistributedCards() : void ;
    abstract onPlayerActMo( idx : number , card : number ) : void ;
    abstract onPlayerActChu( idx : number , card : number ) : void ;
    abstract onPlayerActChi( idx : number , card : number , withA : number , withB : number, invokeIdx : number ) : void ;
    abstract onPlayerActPeng( idx : number , card : number, invokeIdx : number ) : void ;
    abstract onPlayerActMingGang( idx : number , card : number, invokeIdx : number, newCard : number ) : void ;
    abstract onPlayerActAnGang( idx : number , card : number , NewCard : number ) : void ;
    abstract onPlayerActBuGang( idx : number , card : number , NewCard : number ) : void ;
    abstract onPlayerActHu( idx : number, card : number , invokeIdx : number ) : void ;
    abstract onMJActError() : void;
    abstract showHoldCardAfterGameEnd() : void ;
}
