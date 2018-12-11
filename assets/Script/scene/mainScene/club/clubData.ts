// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import RecordData from "../record/recordData"
import ClubMemberData from "./clubMemberData"
import ClubRoomData from "./clubRoomData"
import ClubLogData from "./clubLogData"
export default class ClubData {
    pRecordData : RecordData = new RecordData();
    pClubMemberData : ClubMemberData = new ClubMemberData();
    pClubRoomData : ClubRoomData = new ClubRoomData();
    pClubLogData : ClubLogData = new ClubLogData();

    clubID : number = 0 ;

    init()
    {

    }

    isSelfOwner() : boolean 
    {
        return  true ;
    }

    canSelfDismissClubRoom() : boolean
    {
        return true ;
    }

    parseClubData( msg : Object )
    {

    }

    onRecivedPlayerBrifData( msgPlayerBrifData : Object )
    {
        this.pClubMemberData.onRecivedPlayerBrifData(msgPlayerBrifData);
        this.pClubRoomData.onRecivedPlayerBrifData(msgPlayerBrifData);
    }



}
