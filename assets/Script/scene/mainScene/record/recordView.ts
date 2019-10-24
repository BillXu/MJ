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
import recordCell from "./recordCell"
import listView from "../../../commonItem/ListView"
import { AbsAdapter } from "../../../commonItem/ListView"
import * as _ from "lodash"
import { IRecorderEntry, IRecorderOneRound, IRecorderRoom } from "../../../clientData/RecorderData";
@ccclass
export default class RecordView extends cc.Component {

    @property(listView)
    pListView: listView = null;
    
    @property([cc.Component.EventHandler])
    vlpClickCell : cc.Component.EventHandler[] = [] ;

    
    private vRecorder : IRecorderEntry[] = [] ;
    private pListAdpter : listviewAdpter = null ;
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.pListAdpter = new listviewAdpter();
        this.pListAdpter.lpfCellCallBack = this.onClickCell.bind(this);
        this.pListAdpter.setDataSet(this.vRecorder) ;
        this.pListView.setAdapter(this.pListAdpter) ;
    }


    setRecorderData( vrecorder : IRecorderEntry[], isReplay : boolean = false )
    {
        console.log( "setRecorderData = " + vrecorder.length );
        this.vRecorder = vrecorder;
        this.pListAdpter.setDataSet(this.vRecorder);
        this.pListAdpter.isShowReplayBtn = isReplay ;
        this.pListView.notifyUpdate();
    }

    onClickCell( cel : recordCell )
    {
        cc.Component.EventHandler.emitEvents(this.vlpClickCell,this.vRecorder[cel.idx] );
    }
    // update (dt) {}
}

class listviewAdpter extends AbsAdapter
{
    lpfCellCallBack : ( cel : recordCell )=>void = null ;
    isShowReplayBtn : boolean = false ;

    updateView( item: cc.Node, posIndex: number )
    {
        console.log( "update item pos item = " + posIndex );
        let comp = item.getComponent(recordCell);
        if (comp) {
            let pRecorder : IRecorderEntry = this.getItem(posIndex) ;
            comp.isBtnDetail = !this.isShowReplayBtn ; 
            comp.setOffsetData(pRecorder.vOffsets);
            comp.lpClickCallfunc = this.lpfCellCallBack ;
            comp.time = pRecorder.strTime  ;
            comp.rule = "" ;
            if ( this.isShowReplayBtn ) // single room detail
            {
                comp.roomID = "回放码: " + (<IRecorderOneRound>pRecorder).replayID ;
                comp.rule = "第" + (posIndex + 1 ) + "局" ;
            }
            else
            {
                comp.roomID = "房号: " + (<IRecorderRoom>pRecorder).roomID ;
                comp.rule = (<IRecorderRoom>pRecorder).rule ;
            }
        
            comp.idx = posIndex ;
        }
    }
}
