// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import { eCardSate } from "./roomDefine"
export interface IHoldMingPai
{
    mjStateType : eCardSate ;
    nCard : number ;
    nInvokerClientIdx : number ;
    vEatWithCards? : number[] ; // must contain 3 cards ;
}

export interface IPlayerCards
{
    vHoldCard : number[] ;
    nHoldCardCnt : number ; 
    
    vMingCards : IHoldMingPai[] ;
    vChuCards : number[] ;
}

export interface playerBaseData
{
    uid : number ;
    svrIdx : number ;
    clientIdx : number ;
    headIconUrl : string ;
    name : string ;
    chip : number ;
    isOnline : boolean ; 
    cards : IPlayerCards ;
    isReady : boolean ;
}