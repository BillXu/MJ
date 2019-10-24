import IClubDataComponent from "./IClubDataComponent";
import { eMsgPort, eMsgType } from "../../common/MessageIdentifer";
import Utility from "../../globalModule/Utility";
import ClientApp from "../../globalModule/ClientApp";
import { eClubPrivilige } from "./ClubDefine"
import IClubMemberData, { IClubMemberDataItem } from "../../scene/mainScene/DlgClub/pannelMember/IClubMemberData";
import * as _ from "lodash" 

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export class ClubMember implements IClubMemberDataItem
{
    uid : number = 0 ;
    privliage : number = 0 ;
    private _members : ClubDataMembers = null ;
    get canDowngrade() : boolean
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

    get canUpgrade() : boolean
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

        return mem.privliage > this.privliage && mem.privliage <= eClubPrivilige.eClubPrivilige_Normal;
    }

    get canBeKick() : boolean
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

    isOnline : boolean = true ;
}

export default class ClubDataMembers extends IClubDataComponent implements IClubMemberData {

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
                //return true;
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

        if ( eMsgType.MSG_CLUB_KICK_PLAYER == msgID )
        {
            let ret = msgData["ret"] ;
            let verror = ["操作成功","该玩家不是俱乐部会员","权限不足","","错误玩家对象"] ;
            if ( ret < verror.length )
            {
                Utility.showPromptText(verror[ret]);
            }
            else
            {
                Utility.showPromptText( "error code " + ret );
            }
            this.fetchData( 0 != ret ) ;
            return true ;
        }

        if ( eMsgType.MSG_CLUB_UPDATE_PRIVILIGE == msgID )
        {
            let ret = msgData["ret"] ;
            let verror = ["操作成功","权限不足","管理员数量超过限制","该玩家不是俱乐部会员","错误玩家对象","权限相同"] ;
            if ( ret < verror.length )
            {
                Utility.showPromptText(verror[ret]);
            }
            else
            {
                Utility.showPromptText( "error code " + ret );
            }
            this.fetchData( 0 != ret ) ;
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

    // interface IClubMemberData
    getMembers() : IClubMemberDataItem[] 
    {
        return this.vMembers ;
    }

    reqKickMember( uid : number ) : void 
    {
        let msg = {} ;
        msg["clubID"] = this.clubID;
        msg["kickUID"] = uid ;
        this.sendClubMsg( eMsgType.MSG_CLUB_KICK_PLAYER , msg ) ;
        _.remove(this.vMembers,( a :ClubMember )=>{ return a.uid == uid ;}) ;
        return ;
    }

    reqSetMemberPriviliage( uid : number , privliage : eClubPrivilige ) : void 
    {
        let p = this.getClubMember( uid ) ;
        if ( p == null )
        {
            Utility.showPromptText( "player is not in club" );
            return ;
        }
        p.privliage = privliage ;

        let msg = {} ;
        msg["clubID"] = this.clubID;
        msg["playerUID"] = uid ;
        msg["privilige"] = privliage ;
        this.sendClubMsg( eMsgType.MSG_CLUB_UPDATE_PRIVILIGE , msg ) ;
    }
}
