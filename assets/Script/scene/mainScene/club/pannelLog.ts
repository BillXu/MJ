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
import listView from "../../../commonItem/ListView"
import { AbsAdapter } from "../../../commonItem/ListView"
import LogItem from "./logItem";
import ClubDataEvent, { ClubEvent } from "../../../clientData/clubData/ClubDataEvent";
import IClubDataComponent from "../../../clientData/clubData/IClubDataComponent";
@ccclass
export default class PannelLog extends ClubPannel {

    @property(listView)
    pLogList: listView = null;

    pAdapter : listLogViewAdpter = null ;

    pData : ClubDataEvent = null ;
    // LIFE-CYCLE CALLBACKS:
    start () {
    }

    show()
    {
        super.show();

        if ( null == this.pAdapter )
        {
            this.pAdapter = new listLogViewAdpter();
            this.pLogList.setAdapter(this.pAdapter);
        }

        this.pAdapter.setDataSet([]);
        this.pLogList.notifyUpdate();
        return ;
    }

    refresh( data : IClubDataComponent )
    {
        this.pData = <ClubDataEvent>data ;
        this.pAdapter.setDataSet(this.pData.vEventLog) ;
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
            let pInfo : ClubEvent = this.getItem(posIndex) ;
            comp.refresh(pInfo) ;
        }
    }
}
