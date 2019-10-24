import { eClubPrivilige } from "../../../../clientData/clubData/ClubDefine";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export interface IClubMemberDataItem
{
    uid : number ;
    privliage : eClubPrivilige ;
    canBeKick : boolean ;
    canUpgrade : boolean ;
    canDowngrade : boolean ;
    isOnline : boolean ;
}

export default interface IClubMemberData {
    getMembers() : IClubMemberDataItem[] ;
    reqKickMember( uid : number ) : void ;
    reqSetMemberPriviliage( uid : number , privliage : eClubPrivilige ) : void ;
    // update (dt) {}
}
