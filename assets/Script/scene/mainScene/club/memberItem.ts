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
import PhotoItem from "../../../commonItem/photoItem"
import { ClubMember } from "./clubMemberData"
import { clubMemAct } from "./clubDefine"
@ccclass
export default class MemberItem extends cc.Component {

    @property(PhotoItem)
    pHeadIcon : PhotoItem = null ;

    @property(cc.Label)
    pName: cc.Label = null;

    @property(cc.Label)
    pUID: cc.Label = null;

    @property(cc.Label)
    pOnlineState: cc.Label = null;

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
        if ( mem.msgBrefData )
        {
            this.pHeadIcon.photoURL = mem.msgBrefData["headIcon"] ;
            this.pName.string = mem.msgBrefData["name"] ;
        }
        else
        {
            this.pName.string = "" ;
        }

        this.pUID.string = mem.uid + "" ;
        this.pOnlineState.string = mem.isOnline ? "在线" : "离线" ;
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
