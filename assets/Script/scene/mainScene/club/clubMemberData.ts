// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import IPannelData from "./IPannelData"
import { eMsgPort,eMsgType } from "../../../common/MessageIdentifer"
import ClientData from "../../../globalModule/ClientData";
import { eClubPrivilige } from "./clubDefine";
export class  ClubMember
{
    uid : number = 0 ;
    msgBrefData : Object = null ;
    privliage : number = 0 ;
    isOnline : boolean = false ;
    isCanDownPrivlige : boolean = false ;
    isCanUpPrivilige : boolean = false ;
    isCanKickOut : boolean = false ;
}

export default class ClubMemberData extends IPannelData {

    vMembers : ClubMember[] = [] ;

    onRecivedPlayerBrifData( msg : Object )
    {
        let uid = msg["uid"] ;
        let updateIdx = -1 ;
        this.vMembers.every( ( m : ClubMember , idx : number )=>{
            if ( m.uid == uid )
            {
                updateIdx = idx ;
                m.msgBrefData = msg ;
                m.isOnline = m.msgBrefData["isOnline"] == 1 ;
                return false ;
            }
            return true ;
        } ) ;

        if ( updateIdx != -1 && this.lpfCallBack )
        {
            this.lpfCallBack(updateIdx); 
        }

        return false ;
    }

    featchData()
    {
        let msg = {} ;
        msg["clubID"] = this.clubID ;
        this.sendClubMsg(eMsgType.MSG_CLUB_REQ_PLAYERS,msg) ;
        console.log( "featch data clubid = " + this.clubID );
    }

    onMsg( msgID : eMsgType , msg : Object ) : boolean
    {
        if ( eMsgType.MSG_CLUB_REQ_PLAYERS == msgID )
        {
            let vM : Object[] = msg["players"] ;
            let pageIdx = msg["pageIdx"] ;
            if ( 0 == pageIdx )
            {
                this.vMembers.length = 0 ;
            }

            let selfUID = ClientData.getInstance().selfUID;
            let self = this ;
            vM.forEach( ( p : Object )=>{
                let mem = new ClubMember();
                mem.uid = p["uid"] ;
                mem.privliage = p["privilige"] ;
                mem.msgBrefData = self.getPlayerBrifData(mem.uid);
                let isSelf = mem.uid == selfUID;
                mem.isCanDownPrivlige = isSelf == false && self.pClubData.isSelfOwner() && mem.privliage >= eClubPrivilige.eClubPrivilige_Manager;
                mem.isCanUpPrivilige = isSelf == false && self.pClubData.isSelfOwner() && mem.privliage < eClubPrivilige.eClubPrivilige_Manager ;
                mem.isCanKickOut = isSelf == false && (self.pClubData.isSelfMgr() || self.pClubData.isSelfOwner()) ;
                self.vMembers.push(mem);
                mem.isOnline = false ;
                if ( mem.msgBrefData != null )
                {
                    mem.isOnline = mem.msgBrefData["isOnline"] == 1 ;
                }
            } );

            if ( vM.length < 10 )
            {
                this.onDoRecievdData();
                if ( this.lpfCallBack )
                {
                    this.lpfCallBack(-1);
                }
            }
        }
        return false ;
    }

    getDataCnt(): number 
    {
        return this.vMembers.length ;
    }
    // update (dt) {}
}
