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
import { ClubMessageDataItem } from "./clubMessageData"
import ClubMessageData from "./clubMessageData"
import Network from "../../../common/Network"
import { eMsgPort,eMsgType } from "../../../common/MessageIdentifer"
import Utility from "../../../globalModule/Utility";
import ClientData from "../../../globalModule/ClientData";
@ccclass
export default class dlgClubMessage extends DlgBase {

    @property(listView)
    pListView: listView = null;

    pAdapter : listAdpter = null ;
    // LIFE-CYCLE CALLBACKS:
    pData : ClubMessageData = null ;
    // onLoad () {}

    start () {

    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose);
        let data : ClubMessageData = jsUserData;
        if ( this.pData && this.pData.clubID != data.clubID )
        {
            this.pData.onLoseFocus();
        }
        this.pData = data ;
        this.pData.lpfCallBack = this.onDataUpdate.bind(this);
        if ( this.pAdapter == null )
        {
            this.pAdapter = new listAdpter();
            this.pAdapter.lpfCallBack = this.onClickCell.bind(this);
            this.pListView.setAdapter(this.pAdapter);
        }
        this.pAdapter.setDataSet(data.vDatas) ;
        if ( data.isNeedRefreshData() )
        {
            data.featchData() ;
        }
        else
        {
            this.pListView.notifyUpdate();
        }
        this.pData.doShowDataToPlayer();
    }

    closeDlg()
    {
        super.closeDlg();
        this.pData.lpfCallBack = null ;
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
        let selfID = ClientData.getInstance().selfUID ;
        Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_PROCESS_EVENT,eMsgPort.ID_MSG_PORT_CLUB,selfID,( msg : Object )=>{
            let ret = msg["ret"] ;
            let error = [ "已经处理","事件不存在","已经被其他管理员处理了","权限不足","你没有登录","参数错误" ];
            if ( ret < error.length )
            {
                Utility.showPromptText(error[ret]) ;
                self.pData.onProcessedEventID(eventID);
            }
            else
            {
                Utility.showTip("error code = " + ret ) ;
            }
            return true ;
        }) ;

        Utility.audioBtnClick();
    }

    

    // update (dt) {}
}

class listAdpter extends AbsAdapter
{
    lpfCallBack : ( eventID : number , isAgree : boolean )=>void = null ;
    updateView( item: cc.Node, posIndex: number )
    {
        let comp = item.getComponent(dlgMessageItem);
        if (comp) {
            let pInfo : ClubMessageDataItem = this.getItem(posIndex) ;
            comp.refresh(pInfo) ;
            comp.lpfCallBack = this.lpfCallBack ;
        }
    }
}
