import IClubDataComponent from "./IClubDataComponent";
import { eMsgType, eMsgPort } from "../../common/MessageIdentifer";
import IClubControlCenterData from "../../scene/mainScene/DlgClub/layerDlg/DlgControlCenter/IClubControlCenterData";
import ClientApp from "../../globalModule/ClientApp";
import IOpts from "../../opts/IOpts";
import OptsSuZhou from "../../opts/OptsSuZhou";
import Utility from "../../globalModule/Utility";
import OptsFactory from "../../opts/OptsFactory";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

 
export default class ClubDataBase extends IClubDataComponent implements IClubControlCenterData {

    _dataJs : Object = null ;
    _Opts : IOpts = null ;

    fetchData( isForce : boolean )
    {
        if ( isForce == false && this.isDataOutOfDate() == false )
        {
            this.getClub().onDataRefreshed(this) ;
            return ;
        }

        let js = { } ;
        js["clubID"] = this.getClub().getClubID();
        this.sendClubMsg( eMsgType.MSG_CLUB_REQ_INFO,js ) ;
    }

    onMsg( msgID : number , msgData : Object ) : boolean
    {
        switch ( msgID )
        {
            case eMsgType.MSG_CLUB_REQ_INFO:
            {
                let clubID = msgData["clubID"] ;
                if ( clubID != this.clubID )
                {
                    return false ;
                }
    
                this._dataJs = msgData;
                this.doInformDataRefreshed(true);
                return true ;
            }
            break ;
            case eMsgType.MSG_CLUB_SET_ROOM_OPTS:
            {
                let ret : number = msgData["ret"] ;
                let vError = [ "玩法更改成功" , "权限不足","code 2"," code 3","无效玩家对象"] ;
                if ( ret < vError.length )
                {
                    Utility.showPromptText(vError[ret]) ;
                    if ( 0 == ret )
                    {
                        this.doInformDataRefreshed(true);
                    }
                }
                else
                {
                    Utility.showTip("unknown error code = " + ret ) ;
                    this.fetchData(true);
                }
            }
            break ;
            case eMsgType.MSG_CLUB_UPDATE_NAME:
            {
                let ret : number = msgData["ret"] ;
                let vError = [ "改名字成功" , "权限不足","新名字与旧名字一样了","名字已经被其他俱乐部使用了","无效玩家对象"] ;
                if ( ret < vError.length )
                {
                    Utility.showPromptText(vError[ret]) ;
                    if ( 0 == ret )
                    {
                        this.doInformDataRefreshed(true);
                    }
                }
                else
                {
                    Utility.showTip("unknown error code = " + ret ) ;
                    this.fetchData(true);
                }
                return true ;
            }
            break;
            case eMsgType.MSG_CLUB_SET_STATE:
            {
                let ret : number = msgData["ret"] ;
                let vError = [ "操作成功" , "权限不足"] ;
                if ( ret < vError.length )
                {
                    Utility.showPromptText(vError[ret]) ;
                    if ( 0 == ret )
                    {
                        this.doInformDataRefreshed(true);
                    }
                }
                else
                {
                    Utility.showTip("unknown error code = " + ret ) ;
                    this.fetchData(true);
                }
            }
            break ;
            default:
            return false ;
        }
 
        return true ;
    }

    // svr : {  inviteCnt : 23 ,  mgrs : [23,23,52], state : 0, curCnt : 23, capacity : 23 , maxEventID : 23 ,opts : {} }
    set clubOpts( js : Object )
    {
        this._dataJs["opts"] = js ;
    }

    get clubOpts() : Object
    {
        return this._dataJs["opts"] ;
    }

    get notice() : string
    {
        return this._dataJs["notice"] ;
    }

    set notice( js : string )
    {
        this._dataJs["notice"] = js ;
        this.doInformDataRefreshed(true) ;
    }

    get name() : string
    {
        return this._dataJs["name"] ;
    }

    set name( str : string )
    {
        this._dataJs["name"] = str ;
        this.doInformDataRefreshed(true) ;
    }

    get creatorUID() : number
    {
        return this._dataJs["creator"] ;
    }

    set creatorUID( id : number )
    {
        this._dataJs["creator"] = id ;
    } 

    get diamond() : number
    {
        return this._dataJs["diamond"] ;
    }

    get state() : number
    {
        return this._dataJs["state"] ;
    }

    get isStoped() : boolean
    {
        return this.state == 1 ;
    }

    set isStoped( isStop : boolean )
    {
        this._dataJs["state"] = isStop ? 1 : 0 ;
    }

    get capacity() : number
    {
        return this._dataJs["capacity"] ;
    }

    get curMemberCnt() : number
    {
        return this._dataJs["curCnt"] ;
    }

    get maxEventID () : number
    {
        return this._dataJs["maxEventID"] ;
    }

    isPlayerMgr( uid : number ) : boolean
    {
        let vMgr : number[] = this._dataJs["mgrs"] || [];
        for ( let v of vMgr )
        {
            if ( v == uid )
            {
                return true ;
            }
        }

        return uid == this.creatorUID;
    }

    // IClubControlCenterData
    isSelfClubOwner() : boolean 
    {
        return this.creatorUID == ClientApp.getInstance().getClientPlayerData().getSelfUID();
    }

    getClubName() : string 
    {
        return this.name ;
    }

    isClubPaused() : boolean 
    {
        return this.isStoped;
    }

    getClubOpts() : IOpts 
    {
        if ( this._Opts == null )
        {
            this._Opts = OptsFactory.createOpts(this.clubOpts) ;
        }
        else
        {
            this._Opts.parseOpts(this.clubOpts);
        }
        return this._Opts;
    }

    reqUpdateClubOpts( optsJs : Object ) : boolean 
    {
        let msg = {} ;
        msg["clubID"] = this.clubID ;
        msg["opts"] = optsJs ;
        this.sendClubMsg(eMsgType.MSG_CLUB_SET_ROOM_OPTS,msg) ;
        this.clubOpts = optsJs ;
        return true ;
    }

    reqChangeClubName( newName : string ) : boolean 
    {
        let clubID = this.clubID;
        let msg = {} ;
        msg["clubID"] = clubID ;
        msg["name"] = newName ;
        this.sendClubMsg(eMsgType.MSG_CLUB_UPDATE_NAME,msg);
        this.name = newName ;
        return true ;
    }

    reqSwitchClubState( isPause : boolean ) : boolean 
    {
        let msg = {} ;
        msg["clubID"] = this.clubID;
        msg["isPause"] = isPause ? 1 : 0 ;
        this.sendClubMsg(eMsgType.MSG_CLUB_SET_STATE,msg);
        this.isStoped = isPause ;
        return true ;
    }

    reqDismissClub() : boolean 
    {
        let msg = {} ;
        msg["clubID"] = this.clubID ;
        this.sendClubMsg(eMsgType.MSG_CLUB_DISMISS_CLUB,msg ) ;
        return true ;
    }
}
