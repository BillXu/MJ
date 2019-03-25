import IClubDataComponent from "./IClubDataComponent";
import { eMsgType, eMsgPort } from "../../common/MessageIdentifer";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

 
export default class ClubDataBase extends IClubDataComponent {

    _dataJs : Object = null ;

    fetchData( isForce : boolean )
    {
        if ( isForce == false && this.isDataOutOfDate() == false )
        {
            this.getClub().onDataRefreshed(this) ;
            return ;
        }

        let js = { } ;
        js["clubID"] = this.getClub().getClubID();
        this.getClub().sendMsg(js,eMsgType.MSG_CLUB_REQ_INFO,eMsgPort.ID_MSG_PORT_CLUB,this.clubID);
    }

    onMsg( msgID : number , msgData : Object ) : boolean
    {
        if ( eMsgType.MSG_CLUB_REQ_INFO == msgID )
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
        return false ;
    }

    // svr : {  inviteCnt : 23 ,  mgrs : [23,23,52], state : 0, curCnt : 23, capacity : 23 , maxEventID : 23 ,opts : {} }
    get clubOpts() : Object
    {
        return this._dataJs["opts"] ;
    }

    set clubOpts( js : Object )
    {
        this._dataJs["opts"] = js ;
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
        return false;
    }
}
