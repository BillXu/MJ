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
import { clientEvent } from "../../../common/clientDefine"
import Utility from "../../../globalModule/Utility";
import { IRecorderEntry, RecorderSinglRoundEntry } from "../../../clientData/RecorderData";
@ccclass
export default class DlgSingleRoomRecord extends DlgBase {

    @property(cc.Label)
    pRule: cc.Label = null;

    @property(RecordView)
    pRecorderView : RecordView = null ;

    // LIFE-CYCLE CALLBACKS:
    onLoad()
    {
        super.onLoad();
    }
    
    start () {

    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose);
        let vRecorderData : IRecorderEntry[] = jsUserData ;
        let firstRecorder : RecorderSinglRoundEntry = <RecorderSinglRoundEntry>vRecorderData[0] ;
        //this.pRule.string = firstRecorder.rule ; 
        this.pRecorderView.setRecorderData(vRecorderData,true) ;
    }

    onClickReplay( record : RecorderSinglRoundEntry  )
    {
        console.warn( "jump to replay scene replay id = " + record.replayID );
        Utility.audioBtnClick();
    }

    // update (dt) {}
}

