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
import { ClubMember } from "../../../clientData/clubData/ClubDataMembers";
import { clubMemAct } from "../../../clientData/clubData/ClubDefine";
import PlayerInfoItem from "../../../commonItem/PlayerInfoItem";
@ccclass
export default class MemberItem extends cc.Component {

    @property(PlayerInfoItem)
    pHeadIcon : PlayerInfoItem = null ;

    @property(cc.Label)
    pPriviliage: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    pUpgadePriviliage : cc.Node = null ;

    @property(cc.Node)
    pDownPriviliage : cc.Node = null ;

    @property(cc.Node)
    pKickOut : cc.Node = null ;

    pData : ClubMember = null ;
    
    lpfCallBack : ( mem : ClubMember, opt : clubMemAct  )=>void = null ; 
    // onLoad () {}
    start () {

    }

    refresh( mem : ClubMember )
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
        this.pUpgadePriviliage.active = mem.isCanUpPrivilige ;
        this.pDownPriviliage.active = mem.isCanDownPrivlige ;
        this.pKickOut.active = mem.isCanKickOut ;
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
