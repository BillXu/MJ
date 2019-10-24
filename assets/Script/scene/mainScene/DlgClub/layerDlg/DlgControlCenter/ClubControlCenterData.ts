import IClubControlCenterData from "./IClubControlCenterData";
import OptsSuZhou from "../../../../../opts/OptsSuZhou";
import IOpts from "../../../../../opts/IOpts";

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

@ccclass
export default class ClubControlCenterData implements  IClubControlCenterData {

    isSelfClubOwner() : boolean 
    {
        return true ;
    }

    getClubName() : string 
    {
        return " this is a name " ;
    }

    isClubPaused() : boolean 
    {
        return false ;
    }

    getClubOpts() : IOpts 
    {
        return new OptsSuZhou();
    }

    reqUpdateClubOpts( optsJs : Object ) : boolean 
    {
        return true ;
    }

    reqChangeClubName( newName : string ) : boolean 
    {
        return true ;
    }

    reqSwitchClubState( isPause : boolean ) : boolean 
    {
        return true ;
    }

    reqDismissClub() : boolean 
    {
        return true ;
    }
}
