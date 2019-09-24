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
import listView from "../../../commonItem/ListView"
import { AbsAdapter } from "../../../commonItem/ListView"
import dlgMessageItem from "./dlgClubMessageItem"
import Network from "../../../common/Network"
import { eMsgPort,eMsgType } from "../../../common/MessageIdentifer"
import Utility from "../../../globalModule/Utility";
import ClubDataEvent, { ClubEvent } from "../../../clientData/clubData/ClubDataEvent";
import ClientApp from "../../../globalModule/ClientApp";
@ccclass
export default class dlgClubMessage extends DlgBase {

    @property(listView)
    pListView: listView = null;

    pAdapter : listAdpter = null ;
    // LIFE-CYCLE CALLBACKS:
    pData : ClubDataEvent = null ;
    // onLoad () {}

 

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose);
        this.pData = jsUserData ;
        if ( this.pAdapter == null )
        {
            this.pAdapter = new listAdpter();
            this.pAdapter.lpfCallBack = this.onClickCell.bind(this);
            this.pListView.setAdapter(this.pAdapter);
        }
        this.pAdapter.setDataSet(this.pData.vEvents) ;
        this.pData.fetchData(false) ;
        this.pListView.notifyUpdate();
    }

    closeDlg()
    {
        super.closeDlg();
    }

    onDataUpdate( idx : number )
    {
        this.pListView.notifyUpdate();
        // if ( idx == -1 )
        // {
        //     this.pListView.notifyUpdate();
        // }
        // else
        // {
        //     this.pListView.notifyUpdate([idx]);
        // }
    }

    onClickCell( eventID : number , isAgree : boolean )
    {
        let msg = {} ;
        msg["eventID"] = eventID;
        msg["detial"] = {} ;
        msg["detial"]["isAgree"] = isAgree ? 1 : 0 ;
        msg["clubID"] = this.pData.clubID ;
        let self = this ;
        let clubID = this.pData.clubID ;
        let selfID = ClientApp.getInstance().getClientPlayerData().getSelfUID();
        Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_PROCESS_EVENT,eMsgPort.ID_MSG_PORT_CLUB,selfID,( msg : Object )=>{
            let ret = msg["ret"] ;
            let error = [ "已经处理","事件不存在","已经被其他管理员处理了","权限不足","你没有登录","参数错误" ];
            if ( ret < error.length )
            {
                Utility.showPromptText(error[ret]) ;
                self.pData.doProcessedEvent(eventID);
            }
            else
            {
                Utility.showTip("error code = " + ret ) ;
            }
            return true ;
        }) ;

        Utility.audioBtnClick();
    }
}

class listAdpter extends AbsAdapter
{
    lpfCallBack : ( eventID : number , isAgree : boolean )=>void = null ;
    updateView( item: cc.Node, posIndex: number )
    {
        let comp = item.getComponent(dlgMessageItem);
        if (comp) {
            let pInfo : ClubEvent = this.getItem(posIndex) ;
            comp.refresh(pInfo) ;
            comp.lpfCallBack = this.lpfCallBack ;
        }
    }
}
