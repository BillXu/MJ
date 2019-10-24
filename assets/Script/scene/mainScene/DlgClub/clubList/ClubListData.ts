import IClubListData, { IClubListDataItem } from "./IClubListData";

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
class ClubListDataItem implements IClubListDataItem
{
    clubID : number = 0 ;
    clubName : string = "default"; 
    isCurrentSelected : boolean = false ;
}

@ccclass
export default class ClubListData implements IClubListData {

    getClubLists() : IClubListDataItem[] 
    {
        let cnt = 10 ;
        let v : IClubListDataItem[] = [] ;
        while ( cnt -- )
        {
            let p = new ClubListDataItem() ;
            p.clubID = cnt ;
            v.push( p );
        }
        return v ;
    }
}
