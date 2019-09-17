import { IPlayerCards } from "../../../roomScene/roomData/MJPlayerCardData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export interface IResultSingleItemData
{
    isZiMo() : boolean ;
    isHu() : boolean ;
    isDianPao() : boolean ;
    isRoomOwner() : boolean ;
    isSelf() : boolean ;
    getUID() : number ;
    getOffset() : number ;
    getHuDetail() : string ;
    getPlayerCard() : IPlayerCards ;
} ;
