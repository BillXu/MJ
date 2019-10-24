import IClubRoomsData from "./pannelRoom/IClubRoomsData";
import IClubMemberData from "./pannelMember/IClubMemberData";
import IClubLogData from "./pannelLog/IClubLogData";
import IClubRecorderData from "./pannelRecorder/IClubRecorderData";
import IClubListData from "./clubList/IClubListData";
import IClubLayerDlgData from "./layerDlg/IClubLayerDlgData";
import { eClubDataComponent } from "../../../clientData/clubData/ClubDefine";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

 export default interface IDlgClubData {

    getClubRoomData() : IClubRoomsData ;
    getClubMemberData() : IClubMemberData ;
    getClubLogData() : IClubLogData ;
    getClubRecorderData() : IClubRecorderData ;
    getClubListData() : IClubListData ;
    setCurrentClubID( clubID : number ) : void ;
    getClubLayerDlgData() : IClubLayerDlgData ; 
    getCurClubNotice() : string ;
    fetchData( type : eClubDataComponent , isForce : boolean ) : void ;
}
