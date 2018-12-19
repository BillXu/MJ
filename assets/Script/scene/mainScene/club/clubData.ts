// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import RecordData from "../record/recordData"
import ClubMemberData from "./clubMemberData"
import ClubRoomData from "./clubRoomData"
import ClubLogData from "./clubLogData"
import { eMsgType, eMsgPort } from "../../../common/MessageIdentifer"
import PlayerBrifdata from "../record/playerBrifedata"
import Network from "../../../common/Network";
import ClubMessageData from "./clubMessageData";
import ClientData from "../../../globalModule/ClientData";
import { eClubPrivilige } from "./clubDefine";
export default class ClubData {
    pRecordData : RecordData = new RecordData();
    pClubMemberData : ClubMemberData = new ClubMemberData();
    pClubRoomData : ClubRoomData = new ClubRoomData();
    pClubLogData : ClubLogData = new ClubLogData();
    pClubMessageData : ClubMessageData = new ClubMessageData();

    clubID : number = 0 ;

    private jsInfo : Object = {} ;

    get notice () : string 
    {
        return this.jsInfo["notice"] ;
    }

    set notice( str : string )
    {
        this.jsInfo["notice"] = str ;
    }

    get name() : string
    {
        return this.jsInfo["name"] ;
    }

    set name( str : string )
    {
        this.jsInfo["name"] = str ;
    }

    get opts() : Object
    {
        return this.jsInfo["opts"] ;
    }
    
    set opts( opt : Object )
    {
        this.jsInfo["opts"] = opt ;
    }

    get isStoped() : boolean
    {
        return this.jsInfo["state"] ;
    }

    set isStoped( isStop : boolean )
    {
        this.jsInfo["state"] = isStop ? 1 : 0 ;
    }

    get diamond() : number
    {
        return this.jsInfo["diamond"] ;
    }

    set diamond( cnt : number )
    {
        this.jsInfo["diamond"] = cnt ;
    }

    init( clubID : number , playersData : PlayerBrifdata )
    {
        this.clubID = clubID ;
        this.pRecordData.pPlayersData = playersData;    
        this.pClubMemberData.init(this,playersData) ;
        this.pClubRoomData.init(this,playersData) ;
        this.pClubLogData.init(this,playersData) ;
        this.pClubMessageData.init(this,playersData);

        this.refreshInfo();
    }

    refreshInfo()
    {
        let msg = {} ;
        msg["clubID"] = this.clubID ;
        Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_REQ_INFO,eMsgPort.ID_MSG_PORT_CLUB,this.clubID ) ;
    }

    onLoseFocus()
    {
        this.pClubMemberData.onLoseFocus();
        this.pClubRoomData.onLoseFocus();
        this.pClubLogData.onLoseFocus();
        this.pClubMessageData.onLoseFocus();
    }

    isRecievdInfo() : boolean 
    {
        return null != this.jsInfo["creator"]; ;
    }

    isSelfOwner() : boolean 
    {
        return  this.jsInfo["creator"] && this.jsInfo["creator"] == ClientData.getInstance().selfUID ;
    }

    getSelfPrivlige() : eClubPrivilige
    {
        if ( this.isSelfOwner() )
        {
            return eClubPrivilige.eClubPrivilige_Creator ;
        }

        if ( this.isSelfMgr() )
        {
            return eClubPrivilige.eClubPrivilige_Manager ;
        }

        return eClubPrivilige.eClubPrivilige_Normal ;
    }

    isSelfMgr() : boolean 
    {
        let mgrUIDs : number[] = this.jsInfo["mgrs"] ;
        if ( mgrUIDs == null )
        {
            return false ;
        }

        let selfUID = ClientData.getInstance().selfUID ;
        for ( let v of mgrUIDs )
        {
            if ( v == selfUID )
            {
                return true ;
            }
        }
        return  false ;
    }

    canSelfDismissClubRoom() : boolean
    {
        return this.isSelfMgr() || this.isSelfOwner() ;
    }

    onRecivedPlayerBrifData( msgPlayerBrifData : Object )
    {
        this.pClubMemberData.onRecivedPlayerBrifData(msgPlayerBrifData);
        this.pClubRoomData.onRecivedPlayerBrifData(msgPlayerBrifData);
        this.pClubLogData.onRecivedPlayerBrifData(msgPlayerBrifData);
        this.pClubMessageData.onRecivedPlayerBrifData(msgPlayerBrifData);
        this.pRecordData.onRecievedBrifData(msgPlayerBrifData) ;
    }

    onMsg( msgID : eMsgType , msg : Object )
    {
        if ( eMsgType.MSG_CLUB_REQ_INFO == msgID )
        {
            let clubID = msg["clubID"] ;
            if ( this.clubID != clubID )
            {
                return ;
            }
            this.jsInfo = msg ;
            return ;
        }
        this.pClubMemberData.onMsg(msgID,msg) ;
        this.pClubRoomData.onMsg(msgID,msg) ;
        this.pClubLogData.onMsg(msgID,msg) ;
        this.pClubMessageData.onMsg(msgID,msg) ;
    }
}
