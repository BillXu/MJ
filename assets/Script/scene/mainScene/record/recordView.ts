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
import { RecordItem ,RecorderOffset } from "./recordData"
import recordCell from "./recordCell"
import listView from "../../../commonItem/ListView"
import { AbsAdapter } from "../../../commonItem/ListView"
import * as _ from "lodash"
@ccclass
export default class RecordView extends cc.Component {

    @property(listView)
    pListView: listView = null;
    
    @property([cc.Component.EventHandler])
    vlpClickCell : cc.Component.EventHandler[] = [] ;

    private vRecorder : RecordItem[] = [] ;
    private pListAdpter : listviewAdpter = null ;
    // LIFE-CYCLE CALLBACKS:


    onLoad () 
    {
        this.pListAdpter = new listviewAdpter();
        this.pListAdpter.lpfCellCallBack = this.onClickCell.bind(this);
        this.pListAdpter.setDataSet(this.vRecorder) ;
        this.pListView.setAdapter(this.pListAdpter) ;
    }

    start () {
    
    }

    setRecorderData( vrecorder : RecordItem[], isReplay : boolean = false )
    {
        this.vRecorder = vrecorder;
        this.pListAdpter.setDataSet(this.vRecorder);
        this.pListAdpter.isShowReplayBtn = isReplay ;
        this.pListView.notifyUpdate();
    }

    onRecivedName( uid : number , name : string )
    {
        for ( let i = 0 ; i < this.vRecorder.length ; ++i )
        {
            let vOffset : RecorderOffset[]  = this.vRecorder[i].vOffset ;
            let item = _.find(vOffset,( offset : RecorderOffset )=>{ return uid == offset.uid ;} ) ;
            if ( null == item )
            {
                continue ;
            }

            item.name = name ;
            //this.pListView.notifyUpdate([i]) ;  // cell already register this event ;
            break ;
        }
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
        let comp = item.getComponent(recordCell);
        if (comp) {
            let pRecorder : RecordItem = this.getItem(posIndex) ;
            comp.setOffsetData(pRecorder.vOffset);
            comp.lpClickCallfunc = this.lpfCellCallBack ;
            comp.time = pRecorder.time ;
            comp.roomID = pRecorder.roomID ;
            comp.rule = pRecorder.rule ;
            comp.idx = posIndex ;
            comp.isBtnDetail = !this.isShowReplayBtn ; 
        }
    }
}
