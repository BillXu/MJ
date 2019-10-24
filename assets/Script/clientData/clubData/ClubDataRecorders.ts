import IClubDataComponent from "./IClubDataComponent";
import RecorderData, { IRecorderRoom } from "../RecorderData";
import IClubRecorderData from "../../scene/mainScene/DlgClub/pannelRecorder/IClubRecorderData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

 
export default class ClubDataRecorder extends IClubDataComponent implements IClubRecorderData {

    vRecorder : RecorderData = null ;

    fetchData( isforce : boolean ) : void
    {
        if ( isforce == false && false == this.isDataOutOfDate() )
        {
            this.doInformDataRefreshed(false);
            return ;
        }
        
        if ( this.vRecorder == null )
        {
            this.vRecorder = new RecorderData() ;
            this.vRecorder.init(this.clubID,true) ;
        }
        let self = this ;
        this.vRecorder.fetchData( ( data : RecorderData )=>{ self.doInformDataRefreshed(true) ;} );
    } 

    // interface IClubRecorderData
    getRecorderItems() : IRecorderRoom[] 
    {
        return this.vRecorder.vRecorder ; 
    }
}
