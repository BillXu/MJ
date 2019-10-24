import PlayerInfoItem from "../../../../commonItem/PlayerInfoItem";
import { IClubMemberDataItem } from "./IClubMemberData";
import { clubMemAct } from "../../../../clientData/clubData/ClubDefine";

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
export default class MemberItem extends cc.Component {

    @property(PlayerInfoItem)
    pHeadIcon : PlayerInfoItem = null ;

    @property(cc.Label)
    pPriviliage: cc.Label = null;

    @property(cc.Label)
    pOnLineState: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    pUpgadePriviliage : cc.Node = null ;

    @property(cc.Node)
    pDownPriviliage : cc.Node = null ;

    @property(cc.Node)
    pKickOut : cc.Node = null ;

    pData : IClubMemberDataItem = null ;
    
    lpfCallBack : ( mem : IClubMemberDataItem, opt : clubMemAct  )=>void = null ; 
    // onLoad () {}
    start () {

    }

    refresh( mem : IClubMemberDataItem )
    {
        this.pData = mem ;
        this.pHeadIcon.refreshInfo(mem.uid) ;

        let vPriv = ["禁止进入","会员","管理员","会长"] ;
        if ( mem.privliage < vPriv.length )
        {
            this.pPriviliage.string = vPriv[mem.privliage] ;
        }
        else
        {
            this.pPriviliage.string = "unknown " + mem.privliage ;
        }
        this.pUpgadePriviliage.active = mem.canUpgrade ;
        this.pDownPriviliage.active = mem.canDowngrade ;
        this.pKickOut.active = mem.canBeKick ;
        this.pOnLineState.string = mem.isOnline ? "在线" : "离线" ;
    }

    onBtnKickOut()
    {
        if ( this.lpfCallBack )
        {
            this.lpfCallBack(this.pData,clubMemAct.eAct_Kick_Out);
        }
    }

    onBtnUpgradePrivigae()
    {
        if ( this.lpfCallBack )
        {
            this.lpfCallBack(this.pData,clubMemAct.eAct_Upgrade_Privilige );
        }
    }

    onBtnDownPrivigae()
    {
        if ( this.lpfCallBack )
        {
            this.lpfCallBack(this.pData,clubMemAct.eAct_Down_Privilige );
        }
    }

    // update (dt) {}
}
