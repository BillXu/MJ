import IClubDataComponent from "./IClubDataComponent";
import { eMsgPort, eMsgType } from "../../common/MessageIdentifer";
import Utility from "../../globalModule/Utility";
import ClientApp from "../../globalModule/ClientApp";
import { eClubPrivilige } from "./ClubDefine"

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export class ClubMember
{
    uid : number = 0 ;
    privliage : number = 0 ;
    private _members : ClubDataMembers = null ;
    get isCanDownPrivlige() : boolean
    {
        let selfUID = ClientApp.getInstance().getClientPlayerData().getSelfUID();
        if ( this.uid == selfUID )
        {
            return false ;
        }

        let mem = this._members.getClubMember(selfUID);
        if ( mem == null )
        {
            return false ;
        }

        return mem.privliage > this.privliage && mem.privliage > eClubPrivilige.eClubPrivilige_Normal;
    }

    get isCanUpPrivilige() : boolean
    {
        return this.isCanDownPrivlige ;
    }

    get isCanKickOut() : boolean
    {
        let selfUID = ClientApp.getInstance().getClientPlayerData().getSelfUID();
        if ( this.uid == selfUID )
        {
            return false ;
        }

        let mem = this._members.getClubMember(selfUID);
        if ( mem == null )
        {
            return false ;
        }

        return mem.privliage == eClubPrivilige.eClubPrivilige_Creator ;
    }

    set dataMembers( d : ClubDataMembers )
    {
        this._members = d ;
    }
}

export default class ClubDataMembers extends IClubDataComponent {

    vMembers : ClubMember[] = [] ;
    fetchData( isforce : boolean ) : void
    {
        if ( false == isforce && false == this.isDataOutOfDate() )
        {
            this.doInformDataRefreshed(false);
            return ;
        } 

        let msg = {} ;
        msg["clubID"] = this.clubID ;
        this.getClub().sendMsg(msg,eMsgType.MSG_CLUB_REQ_PLAYERS,eMsgPort.ID_MSG_PORT_CLUB,this.clubID) ;
        console.log( "featch data clubid = " + this.clubID );
    }

    onMsg( msgID : number , msgData : Object ) : boolean
    {
        if ( eMsgType.MSG_CLUB_REQ_PLAYERS == msgID )
        {
            let clubID = msgData["clubID"] ;
            if ( clubID == null )
            {
                Utility.showTip("MSG_CLUB_REQ_PLAYERS msg must have clubID key , inform server add it") ;
                return true;
            }

            if ( this.clubID != clubID )
            {
                return false ;
            }

            let vM : Object[] = msgData["players"] ;
            let pageIdx = msgData["pageIdx"] ;
            if ( 0 == pageIdx )
            {
                this.vMembers.length = 0 ;
            }

            let self = this ;
            vM.forEach( ( p : Object )=>{
                let mem = new ClubMember();
                mem.uid = p["uid"] ;
                mem.privliage = p["privilige"] ;
                self.vMembers.push(mem);
                mem.dataMembers = self ;
            } );

            if ( vM.length < 10 )
            {
                this.doInformDataRefreshed(true);
            }
            return true ;
        }
        return false ;
    }

    getClubMember( uid : number ) : ClubMember
    {
        for ( let v of this.vMembers )
        {
            if ( v.uid == uid )
            {
                return v ;
            }
        }
        return null ;
    }
}
