import IClubMemberData, { IClubMemberDataItem } from "./IClubMemberData";
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

const {ccclass, property} = cc._decorator;
class member implements IClubMemberDataItem
{
    uid : number = 0 
    privliage : eClubPrivilige = eClubPrivilige.eClubPrivilige_Normal;
    canBeKick : boolean = false;
    canUpgrade : boolean = true;
    canDowngrade : boolean = false;
    isOnline : boolean = true ;
}

@ccclass
export default class ClubMemberData implements IClubMemberData {

    getMembers() : IClubMemberData[] 
    {
        let v = [] ;
        let cnt = 15 ;
        while ( cnt-- )
        {
            let p = new member();
            v.push( p );
        }
        return v ;
    }

    reqKickMember( uid : number ) : void 
    {

    }

    reqSetMemberPriviliage( uid : number , privliage : eClubPrivilige ) : void 
    {

    }

    // update (dt) {}
}
