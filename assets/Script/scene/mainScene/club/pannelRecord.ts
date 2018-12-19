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
import ClubData from "./clubData" ;
import ClubPannel from "./clubPannel" ;
import RecordView from "../record/recordView";
import RecordData from "../record/recordData" ;
import { RecordItem } from "../record/recordData" ;
import DlgSingleRoomRecord from "../record/dlgSingleRoomRecorder";
@ccclass
export default class PannelRecord extends ClubPannel {

    @property(RecordView)
    pRecordView: RecordView = null;

    @property(cc.Node)
    pEmptyBg : cc.Node = null ;

    @property(DlgSingleRoomRecord)
    pDlgSingleRoomRecord : DlgSingleRoomRecord = null ;

    pRecordData : RecordData = null ;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    show( data : ClubData )
    {
        super.show(data);
        if ( null == data )
        {
            this.pRecordView.setRecorderData([],false);
            return ;
        }
        this.pRecordData = data.pRecordData ;
        this.pRecordData.isClub = true ;
        this.pRecordData.currentID = data.clubID;
        this.pEmptyBg.active = this.pRecordData.isDataEmpty() ;
        if ( this.pRecordData.isDataEmpty() == false )
        {
            this.pRecordView.setRecorderData(this.pRecordData.vRecorder,false ) ;
        }

        if ( this.pRecordData.isMustFeatchData() )
        {
            this.pRecordData.fetchData();
        }
        
        let p = new cc.Component.EventHandler();
        p.handler = "onRecorderDataCallBack" ;
        p.target = this.node ;
        p.component = "pannelRecord";
        this.pRecordData.vlpfCallBack.length = 0 ;
        this.pRecordData.vlpfCallBack.push(p);

        let pClick = new cc.Component.EventHandler();
        pClick.handler = "onClickLookDetail" ;
        pClick.target = this.node ;
        pClick.component = "pannelRecord" ;
        this.pRecordView.vlpClickCell.length = 0 ;
        this.pRecordView.vlpClickCell.push(pClick);
    }

    onRecorderDataCallBack( vRecord : RecordItem[], isDetal : boolean )
    {
        if ( isDetal == false )
        {
            this.pRecordView.setRecorderData(vRecord,false) ;
            this.pEmptyBg.active = false ;
        }
        else
        {
            this.doShowSingleRoomDetail(vRecord) ;
        }
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
        this.pDlgSingleRoomRecord.showDlg(null,record) ;
    }

    start () {
    }

    // update (dt) {}
}
