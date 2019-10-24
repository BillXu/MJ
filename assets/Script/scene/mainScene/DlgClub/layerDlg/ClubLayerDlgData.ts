import IClubLayerDlgData from "./IClubLayerDlgData";
import ClubControlCenterData from "./DlgControlCenter/ClubControlCenterData";
import IClubControlCenterData from "./DlgControlCenter/IClubControlCenterData";
import IClubMessageData from "./DlgMessage/IClubMessageData";
import ClubMessageData from "./DlgMessage/ClubMessageData";

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
export default class ClubLayerDlgData implements IClubLayerDlgData {

    isHaveNewMessage() : boolean 
    {
        return true ;
    }

    isCurrentHaveClub() : boolean 
    {
        return true ;
    }

    isSelfClubMgr() : boolean 
    {
        return true ;
    }

    isSelfClubOwner() : boolean 
    {
        return true ;
    }

    getClubName() : string 
    {
        return "this is a name"
    }
    getClubNotice() : string 
    {
        return "啊大家发挥更大的爱丽丝的客户给---通知公告" ;
    }

    getClubMessageData() : IClubMessageData 
    {
        return new ClubMessageData();
    }

    getClubControlCenterData() : IClubControlCenterData 
    {
        return new ClubControlCenterData();
    }


    reqJoinClub( clubID : number ) : boolean 
    {
        return true ;
    }

    reqCreateClub( msgContent : Object ) : boolean 
    {
        return true ;
    }

    reqLeaveCurClub() : boolean 
    {
        return true ;
    }

    reqUpdateNotice( newNotice : string ) : boolean 
    {
        return true ;
    }
}
