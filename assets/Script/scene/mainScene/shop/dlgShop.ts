import DlgBase from "../../../common/DlgBase";
import { clientEvent } from "../../../common/clientDefine";
import Utility from "../../../globalModule/Utility";

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

@ccclass
export default class DlgShop extends DlgBase {

    @property(cc.Label)
    pCurDiamond: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    start () {

    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose); 
        this.pCurDiamond.string = jsUserData.toString();

        cc.systemEvent.on(clientEvent.event_update_money, this.onUpdateMoney,this );
    }

    onUpdateMoney( evetn : cc.Event.EventCustom )
    {
        let deatil = evetn.detail ;
        this.pCurDiamond.string = deatil["diamond"].toString();
    }

    onClickItem( event : cc.Event.EventTouch, shopItemID : string )
    {
        let nShopItemID : number = parseInt(shopItemID);
        if ( this.pFuncResult )
        {
            this.pFuncResult(nShopItemID);
        }
        Utility.audioBtnClick();
    }

    // update (dt) {}
}
