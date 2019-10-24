import ClubData from "./clubData/ClubData";
import IClientPlayerDataComponent from "./IClientPlayerDataComponent";
import ClientPlayerData from "./ClientPlayerData";
import { eMsgType, eMsgPort } from "../common/MessageIdentifer";
import IClubDataComponent from "./clubData/IClubDataComponent";
import Utility from "../globalModule/Utility";
import IClubLayerDlgData from "../scene/mainScene/DlgClub/layerDlg/IClubLayerDlgData";
import IClubMessageData from "../scene/mainScene/DlgClub/layerDlg/DlgMessage/IClubMessageData";
import IClubControlCenterData from "../scene/mainScene/DlgClub/layerDlg/DlgControlCenter/IClubControlCenterData";
import ClientApp from "../globalModule/ClientApp";
import Network from "../common/Network";
import { IOneMsgCallback } from "../common/NetworkInterface";
import IClubListData, { IClubListDataItem } from "../scene/mainScene/DlgClub/clubList/IClubListData";
import IDlgClubData from "../scene/mainScene/DlgClub/IDlgClubData";
import IClubRoomsData from "../scene/mainScene/DlgClub/pannelRoom/IClubRoomsData";
import IClubMemberData from "../scene/mainScene/DlgClub/pannelMember/IClubMemberData";
import IClubLogData from "../scene/mainScene/DlgClub/pannelLog/IClubLogData";
import IClubRecorderData from "../scene/mainScene/DlgClub/pannelRecorder/IClubRecorderData";
import { eClubDataComponent } from "./clubData/ClubDefine";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export interface PlayerClubsDelegate
{
    onClubDataRefresh( club : ClubData, refreshedCompoent : IClubDataComponent ) : void ;
    onNewClub( club : ClubData ) : void ;
    onLeaveClub( club : ClubData ) : void ;
}

export default class ClientPlayerClubs implements IClientPlayerDataComponent, IClubLayerDlgData,IClubListData , IDlgClubData {

    vClubs : ClubData[] = [] ;
    pDelegate : PlayerClubsDelegate = null ;
    mCurClub : ClubData = null ;
    init( data : ClientPlayerData ) : void
    {
        // construct club datas ;
        let vCIDs = data.getBaseData().getJoinedClubsID();
        for ( let v of vCIDs )
        {
            let pClub = new ClubData() ;
            pClub.init(v,this) ;
            this.vClubs[this.vClubs.length] = pClub ;
        }
    }
 
    setDelegate( pd : PlayerClubsDelegate )
    {
        this.pDelegate = pd ;
    }

    onMsg( msgID : eMsgType , msg : Object ) : boolean
    {
        if ( eMsgType.MSG_CLUB_DISMISS_CLUB == msgID )
        {
            let ret : number = msg["ret"] ;
            let vError = [ "操作成功" , "权限不足"," code 2 ","有房间牌局没结束，无法解散，请稍后再试","无效玩家"] ;
            if ( ret < vError.length )
            {
                Utility.showPromptText(vError[ret]) ;
                if ( 0 == ret )
                {
                    if ( CC_DEBUG )
                    {
                        if ( msg["clubID"] == null )
                        {
                            Utility.showPromptText( "MSG_CLUB_DISMISS_CLUB reply clubID key is null" );
                            return true;
                        }
                    }

                    this.deleteClub( msg["clubID"] ) ;
                }
            }
            else
            {
                Utility.showTip("unknown error code = " + ret ) ;
            }
            return true ;
        }

        if ( this.mCurClub != null && this.mCurClub.onMsg(msgID,msg ) )
        {
            return true;
        }

        for ( let v of this.vClubs )
        {
            if ( this.mCurClub != null && v.getClubID() == this.mCurClub.getClubID() )
            {
                continue ;
            }

            if ( v.onMsg(msgID,msg) )
            {
                return true ;
            }
        }
        return false ;
    }

    onDestry() : void 
    {
        for ( let v of this.vClubs )
        {
            v.onDestry();
        }
        this.vClubs.length = 0 ;
        this.setDelegate(null);
    }

    onClubDataRefreshed( club : ClubData, refreshedCompoent : IClubDataComponent )
    {
        if ( this.pDelegate )
        {
            this.pDelegate.onClubDataRefresh(club,refreshedCompoent);
        }
    }

    getClubByID( clubID : number ) : ClubData
    {
        for ( let v of this.vClubs )
        {
            if ( v.getClubID() == clubID )
            {
                return v ;
            }
        }
        return null ;
    }

    deleteClub( clubID : number )
    {
        for ( let idx = 0 ; idx < this.vClubs.length ; ++idx )
        {
            if ( this.vClubs[idx].getClubID() == clubID )
            {
                if ( this.pDelegate )
                {
                    this.pDelegate.onLeaveClub(this.vClubs[idx]) ;
                }
                this.vClubs[idx].onDestry();
                this.vClubs.splice(idx,1) ;
                return ;
            }
        }

        console.error( "client data do not have clubID = " + clubID );
    }

    addClub( clubID : number )
    {
        let pClub = new ClubData() ;
        pClub.init( clubID, this ) ;
        this.vClubs[this.vClubs.length] = pClub ;
        pClub.getClubBase().fetchData(true);
        if ( this.pDelegate )
        {
            this.pDelegate.onNewClub( pClub ) ;
        }
    }

    // interface IClubLayerDlgData
    isHaveNewMessage() : boolean 
    {
        if ( this.mCurClub == null )
        {
            return false ;
        }

        return this.mCurClub.getClubEvents().vEvents.length > 0 ;
    }

    isCurrentHaveClub() : boolean 
    {
        return this.mCurClub != null ;
    }

    isSelfClubMgr() : boolean 
    {
        return this.isCurrentHaveClub() && this.mCurClub.isSelfPlayerMgr();
    }

    isSelfClubOwner() : boolean 
    {
        return this.isCurrentHaveClub() && this.mCurClub.getClubBase().isSelfClubOwner();
    }

    getClubName() : string 
    {
        if ( this.isCurrentHaveClub() == false )
        {
            return "";
        }
        return this.mCurClub.getClubBase().name;
    }

    getClubNotice() : string 
    {
        if ( this.isCurrentHaveClub() == false )
        {
            return "";
        }
        return this.mCurClub.getClubBase().notice;
    }

    getClubMessageData() : IClubMessageData 
    {
        if ( this.isCurrentHaveClub() == false )
        {
            return null ;
        }
        return this.mCurClub.getClubEvents() ;
    }

    getClubControlCenterData() : IClubControlCenterData 
    {
        if ( this.isCurrentHaveClub() == false )
        {
            return null ;
        }
        return this.mCurClub.getClubBase();
    }
    
    reqJoinClub( clubID : number ) : boolean 
    {
        console.log( "onJoinClubDlgResult " + clubID );
        let msg = { } ;
        msg["clubID"] = clubID;
        this.sendClubMsg(msg,eMsgType.MSG_CLUB_APPLY_JOIN,( msg : Object)=>
        {
            let ret = msg["ret"] ;
            let vError = [ "加入申请已经提交，请耐心等待管理员审批","您已经在该俱乐部里","您已经申请了，请勿重复申请，耐心等待管理员审批","俱乐部成员数量已达上限","玩家对象为空"] ;
            if ( vError.length <= ret )
            {
                Utility.showTip("unknown error code = " + ret ) ;
                return true ;
            }
            Utility.showTip( vError[ret] );
            return true ;
        } );
        return true ;
    }

    reqCreateClub( msgContent : Object ) : boolean 
    {
        let self = this ;
        this.sendClubMsg(msgContent,eMsgType.MSG_CLUB_CREATE_CLUB,( msg : Object )=>{
           let ret : number = msg["ret"] ;
           let vError = ["ok","条件不满足","名字重复"] ;
           if ( ret == 0 )
           {
               self.addClub( msg["clubID"] );
           }
           else
           {
               if ( vError.length > ret )
               {
                   Utility.showTip(vError[ret]);
               }
               else
               {
                   Utility.showTip("error code = " + ret );
               }
           }
           return true ;
        }) ;
        return true ;
    }

    reqLeaveCurClub() : boolean 
    {
        if ( this.mCurClub == null )
        {
            return true;
        }

        let self = this ;
        let msg = {} ;
        msg["clubID"] = this.mCurClub.getClubID();
        this.sendClubMsg(msg,eMsgType.MSG_CLUB_PLAYER_LEAVE,( js : Object )=>{
            let ret = js["ret"] ;
            let vError = [ "成功退出俱乐部","您本来就不在俱乐部里" ,"code 2 "," code 3","无效玩家对象"] ;
            if ( ret < vError.length )
            {
                Utility.showPromptText(vError[ret]);
                if ( 0 == ret )
                {
                    self.deleteClub(self.mCurClub.getClubID());
                }
            }
            else
            {
                Utility.showTip( "unknown error code = " + ret );
            }
            return true ;
        }) ;
        return true ;
    }

    reqUpdateNotice( newNotice : string ) : boolean 
    {
        if ( this.mCurClub == null )
        {
            return true;
        }

        let msg = {} ;
        msg["clubID"] = this.mCurClub.getClubID();
        msg["notice"] = newNotice ;
        let self = this ;
        this.sendClubMsg(msg,eMsgType.MSG_CLUB_UPDATE_NOTICE,( js : Object )=>{
            let ret : number = js["ret"] ;
            if ( ret == 0 )
            {
                self.mCurClub.getClubBase().notice = newNotice;
                self.mCurClub.getClubBase().doInformDataRefreshed(false);
            }

            let verror = ["操作成功","权限不足"] ;
            if ( ret < verror.length )
            {
                Utility.showPromptText(verror[ret]);
            }
            else
            {
                Utility.showPromptText( "error code = " + ret );
            }
            return true ;
        } );
        return true ;
    }

    // interface IClubListData
    getClubLists() : IClubListDataItem[]
    {
        return this.vClubs;
    }

    // interface IDlgClubData
    getClubRoomData() : IClubRoomsData
    {
        if ( this.isCurrentHaveClub() )
        {
            return this.mCurClub.getClubRooms();
        }
        return null ;
    }

    getClubMemberData() : IClubMemberData
    {
        if ( this.isCurrentHaveClub() )
        {
            return this.mCurClub.getClubMembers();
        }
        return null ;
    }

    getClubLogData() : IClubLogData 
    {
        if ( this.isCurrentHaveClub() )
        {
            return this.mCurClub.getClubEvents();
        }
        return null ;
    }

    getClubRecorderData() : IClubRecorderData 
    {
        if ( this.isCurrentHaveClub() )
        {
            return this.mCurClub.getClubRecorder();
        }
        return null ;
    }

    getClubListData() : IClubListData 
    {
        return this ;
    }

    setCurrentClubID( clubID : number ) : void 
    {
        for ( let v of this.vClubs )
        {
            if ( v.getClubID() == clubID )
            {
                this.mCurClub = v ;
                 return ;
            }
        }

        cc.error( "do not have this clubid " + clubID );
        Utility.showPromptText( "invalid clubid = " + clubID );
    }

    getClubLayerDlgData() : IClubLayerDlgData 
    {
        if ( this.isCurrentHaveClub() )
        {
            return this;
        }
        return null ;
    }

    getCurClubNotice() : string 
    {
        if ( this.isCurrentHaveClub() )
        {
            return this.mCurClub.getClubBase().notice ;
        }
        return "" ;
    }

    fetchData( type : eClubDataComponent , isForce : boolean ) : void
    {
        if ( this.mCurClub == null )
        {
            return  ;
        }

        this.mCurClub.fetchCompData(type,isForce ) ;
    }

    protected sendClubMsg( jsMsg : any , msgID : number, callBack? : IOneMsgCallback ) : boolean
    {
        let selfUID = ClientApp.getInstance().getClientPlayerData().getSelfUID() ;
        return Network.getInstance().sendMsg( jsMsg, msgID, eMsgPort.ID_MSG_PORT_CLUB, selfUID ,callBack) ;
    }
}
