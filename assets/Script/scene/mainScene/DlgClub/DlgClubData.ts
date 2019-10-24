import IDlgClubData from "./IDlgClubData";
import ClubRoomsData from "./pannelRoom/ClubRoomsData";
import ClubMemberData from "./pannelMember/ClubMemberData";
import ClubLogData from "./pannelLog/ClubLogData";
import ClubRecorderData from "./pannelRecorder/ClubRecorderData";
import ClubListData from "./clubList/ClubListData";
import IClubRoomsData from "./pannelRoom/IClubRoomsData";
import IClubMemberData from "./pannelMember/IClubMemberData";
import IClubLogData from "./pannelLog/IClubLogData";
import IClubRecorderData from "./pannelRecorder/IClubRecorderData";
import IClubListData from "./clubList/IClubListData";
import IClubLayerDlgData from "./layerDlg/IClubLayerDlgData";
import ClubLayerDlgData from "./layerDlg/ClubLayerDlgData";

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
export default class DlgClubData implements IDlgClubData {

    getClubRoomData() : IClubRoomsData 
    {
        return new ClubRoomsData();
    }

    getClubMemberData() : IClubMemberData 
    {
        return new ClubMemberData();
    }

    getClubLogData() : IClubLogData 
    {
        return new ClubLogData();
    }

    getClubRecorderData() : IClubRecorderData 
    {
        return new ClubRecorderData();
    }

    getClubListData() : IClubListData 
    {
        return new ClubListData();
    }

    setCurrentClubID( clubID : number ) : void 
    {
        cc.log( "cureent clubid = " + clubID  );
    }

    getClubLayerDlgData() : IClubLayerDlgData
    {
        return new ClubLayerDlgData() ;
    }

    getCurClubNotice() : string
    {
        return "default notice" ;
    }
}
