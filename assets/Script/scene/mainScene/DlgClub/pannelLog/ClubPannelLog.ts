import IClubPannelLog from "./IClubPannelLog";
import IDlgClubData from "../IDlgClubData";
import ListView, { AbsAdapter } from "../../../../commonItem/ListView";
import LogItem from "./logItem";
import IClubLogData, { IClubLogDataItem } from "./IClubLogData";
import ClubLogData from "./ClubLogData";

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
export default class ClubPannelLog extends cc.Component implements IClubPannelLog {

    @property(ListView)
    mList : ListView = null ;

    mListAdapter : listLogViewAdpter = null ;

    mIsDirty : boolean = true ;
    mData : IClubLogData = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //this.refresh( new ClubLogData() );
    }

    onChangedClub( data : IDlgClubData ) : void 
    {
        this.mIsDirty = true ;
        this.mData = data == null ? null : data.getClubLogData();
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

    protected refresh( data : IClubLogData )
    {
        if ( this.mListAdapter == null )
        {
            this.mListAdapter = new listLogViewAdpter();
            this.mList.setAdapter(this.mListAdapter);
        }
        this.mListAdapter.setDataSet( data.getLogItems() );
        this.mList.notifyUpdate();
    }

    protected clear()
    {
        if ( this.mListAdapter == null )
        {
            return ;
        }

        this.mListAdapter.setDataSet([]);
        this.mList.notifyUpdate();
    }

    // update (dt) {}
}

class listLogViewAdpter extends AbsAdapter
{
    updateView( item: cc.Node, posIndex: number )
    {
        let comp = item.getComponent(LogItem);
        if (comp) {
            let pInfo : IClubLogDataItem = this.getItem(posIndex) ;
            comp.refresh(pInfo) ;
        }
    }
}
