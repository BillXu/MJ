import IClubMessageData from "./DlgMessage/IClubMessageData";
import IClubControlCenterData from "./DlgControlCenter/IClubControlCenterData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export default interface IClubLayerDlgData {
    isHaveNewMessage() : boolean ;
    isCurrentHaveClub() : boolean ;
    isSelfClubMgr() : boolean ;
    isSelfClubOwner() : boolean ;
    getClubName() : string ;
    getClubNotice() : string ;

    getClubMessageData() : IClubMessageData ;
    getClubControlCenterData() : IClubControlCenterData ;

    reqJoinClub( clubID : number ) : boolean ;
    reqCreateClub( msgContent : Object ) : boolean ;
    reqLeaveCurClub() : boolean ;
    reqUpdateNotice( newNotice : string ) : boolean ;
}
