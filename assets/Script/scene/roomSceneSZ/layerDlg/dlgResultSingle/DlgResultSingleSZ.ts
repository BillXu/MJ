import DlgBase from "../../../../common/DlgBase";
import ResultSingleItemSZ from "./ResultSingleItemSZ";
import IResultSingleData  from "./IResultSingleDate";
import { IResultSingleItemData } from "./IResultSingleItemData";
import MJCardFactory2D from "../../../roomScene/layerCards/cards2D/MJCardFactory2D";

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
export default class DlgResultSingleSZ extends DlgBase {

    @property(cc.Label)
    mRuleDetail: cc.Label = null;

    @property(cc.Label)
    mRuleTime: cc.Label = null;

    @property(cc.Node)
    mWinTitle : cc.Node = null ;

    @property(cc.Node)
    mLoseTitle : cc.Node = null ;

    @property(MJCardFactory2D)
    mFactory : MJCardFactory2D = null ;
    
    @property([ResultSingleItemSZ])
    mResultItems : ResultSingleItemSZ[] = [] ;

    @property(cc.Node)
    mBtnGoOn : cc.Node = null ;

    @property(cc.Node)
    mBtnTotalResult : cc.Node = null ;

    @property([cc.Component.EventHandler])
    mOnDlgResult : cc.Component.EventHandler[] = [] ; // ( isAllBtn : bool )
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        super.onLoad();
        for ( let v of this.mResultItems )
        {
            v.mCardHold.mFactory = this.mFactory ;
            v.mCardMing.mFactroy = this.mFactory ;
        }
        this.mBtnTotalResult.active = false ;
    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose); 
        let pd = <IResultSingleData>jsUserData ;
        this.mRuleDetail.string = pd.getRoomRuleDetail();
        this.mRuleTime.string = (new Date()).toLocaleString("zh-CN");
        this.mResultItems.forEach(d=>d.node.active = false ) ;
        this.mWinTitle.active = pd.isShowWinTitle();
        this.mLoseTitle.active = !this.mWinTitle.active ;
        let pitems = pd.getDataItems();
        let self = this ;
        pitems.forEach( ( item : IResultSingleItemData , idx : number )=>{ self.mResultItems[idx].node.active = true; self.mResultItems[idx].refreshItem(item);} ) ;
        this.mBtnGoOn.active = true ;
    }

    showTotalReusltBtn()
    {
        this.mBtnGoOn.active = false ;
        this.mBtnTotalResult.active = true ;
    }

    onBtnShare()
    {
        cc.log( "show share dlg " );
    }

    onBtnGoOn()
    {
        cc.Component.EventHandler.emitEvents(this.mOnDlgResult,false ) ;
        this.closeDlg();
    }

    onBtnTotalResult()
    {
        cc.Component.EventHandler.emitEvents(this.mOnDlgResult,true) ;
        this.closeDlg();
    }

}
