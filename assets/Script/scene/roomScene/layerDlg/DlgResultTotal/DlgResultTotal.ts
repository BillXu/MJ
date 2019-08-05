import DlgResultTotalItem from "./DlgResultTotalItem";
import DlgBase from "../../../../common/DlgBase";
import ResultTotalData from "../../roomData/ResultTotalData";
import MJRoomData from "../../roomData/MJRoomData";
import * as _ from "lodash"
import WechatManager, { eWechatShareDestType } from "../../../../sdk/WechatManager";
import { SceneName } from "../../../../common/clientDefine";

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
export default class DlgResultTotal extends DlgBase {

    @property(cc.Label)
    mRoomID: cc.Label = null;

    @property(cc.Label)
    mDateTime: cc.Label = null;

    @property(cc.Label)
    mRule: cc.Label = null;
    
    @property( [DlgResultTotalItem])
    mItems : DlgResultTotalItem[] = [] ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    refreshDlg( data : MJRoomData , result : ResultTotalData )
    {
        this.mRoomID.string = "房间号：" + data.mBaseData.roomID ;
        this.mDateTime.string = (new Date()).toLocaleString("zh-CN") ;
        this.mRule.string = data.mOpts.ruleDesc ;

        this.mItems.forEach( ( item : DlgResultTotalItem )=>{ item.node.active = false ;} ) ;
        for ( let idx = 0  ; idx < result.mResults.length ; ++idx )
        {
            let p =  this.mItems[idx];
            let pd = result.mResults[idx] ;
            p.node.active = true ;
            p.setDataItem( pd ) ;
            p.refreshIcons( result.mApplyDismissID == pd.uid,pd.uid == data.mBaseData.ownerID, _.find(result.mBigWinerUID,( n : number )=>{ return pd.uid == n ;}) != null , _.find(result.mTuHaoID,( n : number )=>{ return pd.uid == n ;} ) != null ) ;
        }
    }

    onClickShare()
    {
        WechatManager.getInstance().shareImageWechat(this.pBgImgArea,eWechatShareDestType.eDest_Firend);
    }

    onClickToMain()
    {
        cc.director.loadScene(SceneName.Scene_Main) ;
    }
}
