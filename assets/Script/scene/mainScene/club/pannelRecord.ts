// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import ClubPannel from "./clubPannel" ;
import RecordView from "../record/recordView";
import DlgSingleRoomRecord from "../record/dlgSingleRoomRecorder";
import ClubDataRecorder from "../../../clientData/clubData/ClubDataRecorders";
import IClubDataComponent from "../../../clientData/clubData/IClubDataComponent";
import { IRecorderEntry, RecorderRoomEntry } from "../../../clientData/RecorderData";
@ccclass
export default class PannelRecord extends ClubPannel {

    @property(RecordView)
    pRecordView: RecordView = null;

    @property(cc.Node)
    pEmptyBg : cc.Node = null ;

    @property(DlgSingleRoomRecord)
    pDlgSingleRoomRecord : DlgSingleRoomRecord = null ;

    pRecordData : ClubDataRecorder = null ;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        let pClick = new cc.Component.EventHandler();
        pClick.handler = "onClickLookDetail" ;
        pClick.target = this.node ;
        pClick.component = "pannelRecord" ;
        this.pRecordView.vlpClickCell.length = 0 ;
        this.pRecordView.vlpClickCell.push(pClick);
    }

    show()
    {
        super.show();
        this.pEmptyBg.active = true ;
        this.pRecordView.setRecorderData([],false);
        return ;
    }

    refresh( data : IClubDataComponent )
    {
        this.pRecordData = <ClubDataRecorder>data ;
        this.pRecordView.setRecorderData(this.pRecordData.vRecorder.vRecorder,false ) ;
    }

    onClickLookDetail( record : IRecorderEntry )
    {
        let self = this ;
        (<RecorderRoomEntry>record).fetchSingleRoundRecorders( ( data : RecorderRoomEntry )=>{ self.doShowSingleRoomDetail(data.vSingleRoundRecorders) ;} ) ;
    }

    private doShowSingleRoomDetail( record : IRecorderEntry[] )
    {
        this.pDlgSingleRoomRecord.showDlg(null,record) ;
    }

    start () {
    }

    // update (dt) {}
}
