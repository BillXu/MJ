import PlayerInfoItem from "../../../../commonItem/PlayerInfoItem";
import { ResultTotalDataItem } from "../../roomData/ResultTotalData";
import { ITotalResultDlgDataItem } from "../ILayerDlgData";

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
export default class DlgResultTotalItem extends cc.Component {

    @property(PlayerInfoItem)
    mPlayerInfo : PlayerInfoItem = null ;

    @property(cc.Node)
    mSelfBg : cc.Node = null ;

    @property(cc.Label)
    huPaiCnt: cc.Label = null;

    @property(cc.Label)
    gangPaiCnt: cc.Label = null;

    @property(cc.Label)
    dianPaoCnt: cc.Label = null;

    @property(cc.Label)
    singleMostCnt: cc.Label = null;

    @property(cc.Label)
    offsetWin: cc.Label = null;

    @property(cc.Label)
    offsetLose: cc.Label = null;

    @property(cc.Node)
    pBigWinIcon : cc.Node = null ;

    @property(cc.Node)
    dismissIcon : cc.Node = null ;

    @property(cc.Node)
    pOwnerIcon : cc.Node = null ;

    @property(cc.Node)
    pTuHaoIcon : cc.Node = null ;

    @property(cc.Label)
    pWaitTime : cc.Label = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    setDataItem( dataTI : ITotalResultDlgDataItem )
    {
        let data = dataTI as ResultTotalDataItem ;
        this.mPlayerInfo.refreshInfo(data.uid);
        this.huPaiCnt.string = data.huCnt + "" ;
        this.gangPaiCnt.string = data.gangCnt + "" ;
        this.dianPaoCnt.string = data.dianPaoCnt + "" ;
        this.singleMostCnt.string = data.SingleBestWin + "" ;
        this.offsetLose.node.active = false ;
        this.offsetWin.node.active = false ;
        let poffset = data.final < 0 ? this.offsetLose : this.offsetWin ;
        poffset.node.active = true ;
        poffset.string = data.final + "" ;

        this.pWaitTime.string = "等待操作时间：" + Math.floor(data.waitTime) + "分钟" ;
    }

    refreshIcons( isDissmiss : boolean , isOwner : boolean , isBigWin : boolean , isTuHao : boolean , isSelf : boolean )
    {
        this.dismissIcon.active = isDissmiss ;
        this.pOwnerIcon.active = isOwner ;
        this.pBigWinIcon.active = isBigWin ;
        this.pTuHaoIcon.active = isTuHao ;
        this.mSelfBg.active = isSelf ;
    }

    // update (dt) {}
}
