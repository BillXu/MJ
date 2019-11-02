import { PlayerActedCard } from "../roomData/MJPlayerCardData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export interface IPlayerCardData
{
    getHolds() : number[] ;
    getChus() : number[] ;
    getMings() : PlayerActedCard[] ;
    reqChu( card : number ) : boolean ;
}

export default interface ILayerCardsData
{
    getSelfIdx() : number ;
    getCurActIdx() : number ; // -1 means not in game ;
    getBankerIdx() : number ;
    getPlayerCardItems() : IPlayerCardData[] ; // array idx = svridx , null == empty ;
    isReplay() : boolean ;
}
