import IRoomLayer from "./ILayer";
import { PlayerActedCard } from "./roomData/MJPlayerCardData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export default interface ILayerCards extends IRoomLayer {

    onDistributedCards() : void ;
    onPlayerActMo( idx : number , card : number ) : void;
    onPlayerActChu( idx : number , card : number ) : void
    onPlayerActed( idx : number , actedData : PlayerActedCard ) ;
    onMJActError() : void ;
    setBottomSvrIdx( nSvrIdx : number );
}
