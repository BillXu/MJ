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
import dlgMessageItem from "./dlgClubMessageItem"
import IClubMessageData, { IClubMessageDataItem } from "./IClubMessageData";
import ListView, { AbsAdapter } from "../../../../../commonItem/ListView";
import DlgBase from "../../../../../common/DlgBase";
import Utility from "../../../../../globalModule/Utility";
@ccclass
export default class dlgClubMessage extends DlgBase {

    @property(ListView)
    pListView: ListView = null;

    pAdapter : listAdpter = null ;
    // LIFE-CYCLE CALLBACKS:
    pData : IClubMessageData = null ;
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
        this.pAdapter.setDataSet(this.pData.getMessageItems()) ;
        this.pListView.notifyUpdate();
    }

    closeDlg()
    {
        super.closeDlg();
    }

    onClickCell( eventID : number , isAgree : boolean )
    {
        this.pData.reqProcessMessage( eventID , isAgree ) ;
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
            let pInfo : IClubMessageDataItem = this.getItem(posIndex) ;
            comp.refresh(pInfo) ;
            comp.lpfCallBack = this.lpfCallBack ;
        }
    }
}
