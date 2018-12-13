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
import RecordData from "./recordData"
import { RecordItem } from "./recordData"
import { clientEvent } from "../../../common/clientDefine"
import DlgSingleRoomRecord from "./dlgSingleRoomRecorder";
@ccclass
export default class dlgRecord extends DlgBase {

    @property(RecordView)
    pRecorderView: RecordView = null;

    @property(cc.Node)
    pEmptyBg : cc.Node = null ;

    @property(DlgSingleRoomRecord)
    pDlgSingleRoomRecord : DlgSingleRoomRecord = null ;
 
    @property(RecordData)
    pRecordData : RecordData = null ;
    // LIFE-CYCLE CALLBACKS:
    onLoad()
    {
        super.onLoad();
        cc.systemEvent.on(clientEvent.event_recieved_brifData,this.onRecievedBrifdata,this);
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    start () {

    }

    onRecievedBrifdata( event : cc.Event.EventCustom )
    {
        this.pRecordData.onRecievedBrifData(event.detail) ;

        let uid = event.detail["uid"] ;
        let name = event.detail["name"] ;
        this.pRecorderView.onRecivedName(uid,name) ;
    }

    // update (dt) {}
    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose);
        this.pEmptyBg.active = this.pRecordData.isDataEmpty() ;
        // do request data ;
        this.pRecordData.fetchData() ;
    }

    onRecorderDataCallBack( vRecord : RecordItem[], isDetal : boolean )
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
    }

    onClickLookDetail( record : RecordItem )
    {
        if ( record.vSingleDetail.length == 0 )
        {
            // go to featch from net ;
            this.pRecordData.fetchRecordDetail(record.sieralNum) ;
            return ;
        }

        // already have data , do show direct ;
        this.doShowSingleRoomDetail(record.vSingleDetail);
    }

    private doShowSingleRoomDetail( record : RecordItem[] )
    {
        let self = this ;
        this.pDlgSingleRoomRecord.showDlg(null,record,( dlg : DlgBase )=>{
            self.pRootNode.active = true ;
        }) ;
        this.pRootNode.active = false ;
    }
}