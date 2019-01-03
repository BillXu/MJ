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
import DlgSetting from "./dlgSetting"
import utility from "../../globalModule/Utility"
import dlgRecord from "./record/dlgRecord";
import Bacground from "./background"
import DlgBase from "../../common/DlgBase";
import DlgShop from "./shop/dlgShop";
import ClientData from "../../globalModule/ClientData";
import WechatManager, { eWechatShareDestType } from "../../sdk/WechatManager";
import { eChatMsgType } from "../roomScene/roomDefine";
@ccclass
export default class BottomLayer extends cc.Component {

    @property(Bacground)
    pBackground : Bacground = null ;

    @property(DlgSetting)
    pDlgSetting: DlgSetting = null;

    @property(dlgRecord)
    pDlgRecord : dlgRecord = null ;

    @property(DlgBase)
    pDlgHelp : DlgBase = null ;

    @property(DlgShop)
    pDlgShop : DlgShop = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onBtnSetting()
    {
        this.pDlgSetting.showDlg();
    }

    onBtnShop()
    {
        //utility.showTip("zhege shi yige weniz发掘的发生的噶") 
        this.pDlgShop.showDlg( ( shopItemID : number )=>{
            console.log( "send msg to buy shopitemID " + shopItemID );
        } ,ClientData.getInstance().jsSelfBaseDataMsg["diamond"] ) ;
    }

    onBtnShowRecord()
    {
        this.pBackground.hide();
        let self = this ;
        this.pDlgRecord.showDlg( null ,null,(dlg : DlgBase)=>{ self.pBackground.show();});
    }

    onBtnHelp()
    {
        this.pDlgHelp.showDlg();
    }

    onBtnShare()
    {
        WechatManager.getInstance().shareTextWechat("test check",eWechatShareDestType.eDest_Firend,"title") ;
    }

    onBtnActivty()
    {

    }
    // update (dt) {}
}
