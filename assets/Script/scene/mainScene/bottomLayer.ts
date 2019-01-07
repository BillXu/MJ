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
import dlgRecord from "./record/dlgRecord";
import Bacground from "./background"
import DlgBase from "../../common/DlgBase";
import DlgShop from "./shop/dlgShop";
import ClientData from "../../globalModule/ClientData";
import DlgShare from "./dlgShare";
import Utility from "../../globalModule/Utility";
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

    @property(DlgShare)
    pDlgShare : DlgShare = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onBtnSetting()
    {
        this.pDlgSetting.showDlg();
        Utility.audioBtnClick();
    }

    onBtnShop()
    {
        //utility.showTip("zhege shi yige weniz发掘的发生的噶") 
        this.pDlgShop.showDlg( ( shopItemID : number )=>{
            console.log( "send msg to buy shopitemID " + shopItemID );
        } ,ClientData.getInstance().jsSelfBaseDataMsg["diamond"] ) ;
        Utility.audioBtnClick();
    }

    onBtnShowRecord()
    {
        this.pBackground.hide();
        let self = this ;
        this.pDlgRecord.showDlg( null ,null,(dlg : DlgBase)=>{ self.pBackground.show();});
        Utility.audioBtnClick();
    }

    onBtnHelp()
    {
        this.pDlgHelp.showDlg();
        Utility.audioBtnClick();
    }

    onBtnShare()
    {
         this.pDlgShare.showDlg();
         Utility.audioBtnClick();
    }

    onBtnActivty()
    {
        Utility.audioBtnClick();
    }
    // update (dt) {}
}
