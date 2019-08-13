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

 
export default interface ILayerPlayerCard extends ILayer {

    onDistributedCards() : void ;
    onPlayerActMo( idx : number , card : number ) : void ;
    onPlayerActChu( idx : number , card : number ) : void ;
    onPlayerActChi( idx : number , card : number , withA : number , withB : number, invokeIdx : number ) : void ;
    onPlayerActPeng( idx : number , card : number, invokeIdx : number ) : void ;
    onPlayerActMingGang( idx : number , card : number, invokeIdx : number, newCard : number ) : void ;
    onPlayerActAnGang( idx : number , card : number , NewCard : number ) : void ;
    onPlayerActBuGang( idx : number , card : number , NewCard : number ) : void ;
    onPlayerActHu( idx : number, card : number , invokeIdx : number ) : void ;
    onMJActError() : void;
}
