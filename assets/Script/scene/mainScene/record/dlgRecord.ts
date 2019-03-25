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
import DlgBase from "../../../common/DlgBase"
import RecordView from "./recordView"
import DlgSingleRoomRecord from "./dlgSingleRoomRecorder";
import Utility from "../../../globalModule/Utility";
import RecorderData, { IRecorderEntry, RecorderRoomEntry } from "../../../clientData/RecorderData";
@ccclass
export default class dlgRecord extends DlgBase {

    @property(RecordView)
    pRecorderView: RecordView = null;

    @property(cc.Node)
    pEmptyBg : cc.Node = null ;

    @property(DlgSingleRoomRecord)
    pDlgSingleRoomRecord : DlgSingleRoomRecord = null ;
 
    pRecordData : RecorderData = null ;

    // update (dt) {}
    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose);
        this.pRecordData = <RecorderData>(jsUserData);
        this.pEmptyBg.active = this.pRecordData.vRecorder.length <= 0 ; ;
        this.pRecorderView.setRecorderData(this.pRecordData.vRecorder,false) ;
        let self = this ;
        this.pRecordData.fetchData( ( data : RecorderData )=>{ self.onRecorderDataCallBack(data.vRecorder,false); } );
    }

    onRecorderDataCallBack( vRecord : IRecorderEntry[], isDetal : boolean )
    {
        if ( isDetal == false )
        {
            this.pRecorderView.setRecorderData(vRecord,false) ;
            this.pEmptyBg.active = false ;
        }
        else
        {
            this.doShowSingleRoomDetail(vRecord) ;
        }
    }

    onClickLookOtherReplay()
    {
        // show enter replay id dlg ;
        Utility.audioBtnClick();
    }

    onClickLookDetail( record : IRecorderEntry )
    {
        Utility.audioBtnClick();
        let self = this ;
        (<RecorderRoomEntry>record).fetchSingleRoundRecorders( ( data : RecorderRoomEntry )=>{ self.onRecorderDataCallBack(data.vSingleRoundRecorders,true) ;} ) ;
    }

    private doShowSingleRoomDetail( record : IRecorderEntry[] )
    {
        let self = this ;
        this.pDlgSingleRoomRecord.showDlg(null,record,( dlg : DlgBase )=>{
            self.pRootNode.active = true ;
        }) ;
        this.pRootNode.active = false ;
    }
}
