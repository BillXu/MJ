import IClubPannelRecorder from "./IClubPannelRecorder";
import IDlgClubData from "../IDlgClubData";
import RecordView from "../../record/recordView";
import DlgSingleRoomRecord from "../../record/dlgSingleRoomRecorder";
import IClubRecorderData from "./IClubRecorderData";
import { IRecorderEntry,IRecorderRoom } from "../../../../clientData/RecorderData";
import Utility from "../../../../globalModule/Utility";
import ClubRecorderData from "./ClubRecorderData";

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
export default class ClubPannelRecorder extends cc.Component implements IClubPannelRecorder {

    @property(RecordView)
    mRecorderView : RecordView = null ;

    @property(DlgSingleRoomRecord)
    mDlgRoomRecorderDetail : DlgSingleRoomRecord = null ;

    @property(cc.Node)
    mEmptyIcon : cc.Node = null ;

    mData : IClubRecorderData = null ;
    mIsDirty : boolean = false ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //this.refresh( new ClubRecorderData() );
    }

    onChangedClub( data : IDlgClubData ) : void 
    {
        this.mData = data == null ? null : data.getClubRecorderData() ;
        this.mIsDirty = true ;
    }

    onShowPannel() : void 
    {
        if ( this.mIsDirty )
        {
            this.mData != null ? this.refresh( this.mData ) : this.clear();
            this.mIsDirty = false ;
        }
    }

    onHidePannel() : void 
    {

    }

    protected refresh( data : IClubRecorderData )
    {
        this.mData = data ;
        this.mRecorderView.node.active = true ;
        let v = data.getRecorderItems();
        this.mEmptyIcon.active = v.length == 0 ;
        this.mRecorderView.setRecorderData(v,false) ;
    }

    onClickLookDetail( record : IRecorderEntry )
    {
        Utility.audioBtnClick(); 
        let vDetail = (<IRecorderRoom>record).vSingleRoundRecorders; //this.mData.getSingleRoomRecorderItems((<IRecorderRoom>record).roomID ) ;
        this.mDlgRoomRecorderDetail.showDlg(null,vDetail ) ;
    }

    protected clear()
    {
        this.mRecorderView.setRecorderData([],false) ;
        this.mData = null ;
        this.mEmptyIcon.active = true ;
    }
}
