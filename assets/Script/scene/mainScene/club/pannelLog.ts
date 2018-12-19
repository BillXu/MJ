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
import listView from "../../../commonItem/ListView"
import { AbsAdapter } from "../../../commonItem/ListView"
import ClubLogData from "./clubLogData"
import { LogDataItem } from "./clubLogData"
import LogItem from "./logItem";
@ccclass
export default class PannelLog extends ClubPannel {

    @property(listView)
    pLogList: listView = null;

    pAdapter : listLogViewAdpter = null ;

    pData : ClubLogData = null ;
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {

    }

    start () {
    }

    show( data : ClubData )
    {
        super.show(data);

        if ( null == this.pAdapter )
        {
            this.pAdapter = new listLogViewAdpter();
            this.pLogList.setAdapter(this.pAdapter);
        }

        if ( this.pData )
        {
            this.pData.onLoseFocus();
        }

        if ( data == null )
        {
            this.pAdapter.setDataSet([]);
            this.pLogList.notifyUpdate();
            return ;
        }
        this.pData = data.pClubLogData ;
        data.pClubLogData.lpfCallBack = this.doRefreshView.bind(this);
        if ( this.pData.isNeedRefreshData() )
        {
            this.pData.featchData();
        }
        this.doRefreshView();
    }

    doRefreshView()
    {
        this.pAdapter.setDataSet(this.pData.vLogs) ;
        this.pLogList.notifyUpdate();
    }

    // update (dt) {}
}

class listLogViewAdpter extends AbsAdapter
{
    updateView( item: cc.Node, posIndex: number )
    {
        let comp = item.getComponent(LogItem);
        if (comp) {
            let pInfo : LogDataItem = this.getItem(posIndex) ;
            comp.refresh(pInfo) ;
        }
    }
}
