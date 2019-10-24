import IClubDataComponent from "./IClubDataComponent";
import { eMsgType, eMsgPort } from "../../common/MessageIdentifer";
import * as _ from "lodash"
import Utility from "../../globalModule/Utility";
import IClubRoomsData, { IClubRoomsDataItem, ClubRoomItemPlayer } from "../../scene/mainScene/DlgClub/pannelRoom/IClubRoomsData";
import IOpts from "../../opts/IOpts";
import OptsSuZhou from "../../opts/OptsSuZhou";
import ClientApp from "../../globalModule/ClientApp";
import Network from "../../common/Network";
import { SceneName } from "../../common/clientDefine";
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export class RoomPeer extends ClubRoomItemPlayer
{
 
}

export class ClubRoomItem implements IClubRoomsDataItem
{
    nRoomID : number = 0 ;
    vRoomPeers : RoomPeer[] = [] ;
    isOpen : boolean = false ;
    playedRound : number = 0 ;
    totalRound : number = 0 ;
    isCircle : boolean = false ;
    get seatCnt() : number
    {
        return this.jsmsgBrife["opts"]["seatCnt"];
    }

    get opts() : IOpts
    {
        let opts = new OptsSuZhou();
        opts.parseOpts( this.jsmsgBrife["opts"] );
        return opts ;
    }
    
    jsmsgBrife : Object = null ;
}
 
export default class ClubDataRooms extends IClubDataComponent implements IClubRoomsData {

    vRooms : ClubRoomItem[] = [] ;

    fetchData( isforce : boolean ) : void
    {
        if ( false == isforce && this.isDataOutOfDate() == false )
        {
            this.doInformDataRefreshed(false) ;
            return ;
        }

        console.log( "req clubl rooms clubID = " + this.clubID );
        let js = {} ;
        js["clubID"] = this.clubID ;
        this.getClub().sendMsg(js,eMsgType.MSG_CLUB_REQ_ROOMS,eMsgPort.ID_MSG_PORT_CLUB,this.clubID ) ;
    }

    onMsg( msgID : number , msgData : Object ) : boolean 
    {
        if ( eMsgType.MSG_CLUB_REQ_ROOMS == msgID )
        {
            // svr : { clubID : 234, name : 23, fullRooms : [ 23,23,4 ], emptyRooms :  [  23,2, .... ]  }
            if ( msgData["clubID"] != this.clubID )
            {
                return false ;
            }

            this.vRooms.length = 0 ;
            let vRooms : number[] = msgData["fullRooms"] || [];
            vRooms = vRooms.concat( msgData["emptyRooms"]  || [] );
            if ( vRooms.length == 0 )
            {
                this.doInformDataRefreshed(true);
                return true ;
            }

            for ( let v of vRooms )
            {
                if ( v == null )
                {
                    cc.error( "why have null elements" );
                    continue ;
                }
                let p = new ClubRoomItem();
                p.nRoomID = v ;
                this.vRooms.push(p);
            }
            this.requestRoomsDetail();
            return true ;
        }

        if ( eMsgType.MSG_REQ_ROOM_ITEM_INFO == msgID )
        {
            let roomID : number = msgData["roomID"] ;
            let p = this.getRoomByRoomID(roomID);
            if ( p == null )
            {
                return false ;
            }
            
            p.jsmsgBrife = msgData ;
            let vPlayers : number[] = msgData["players"] || [];
            for ( let v of vPlayers )
            {
                let pi = new RoomPeer();
                pi.isOnline = true ;
                pi.nUID = v ;
                p.vRoomPeers.push(pi);
            }

            let isAllRoomRecievedInfo = _.findIndex( this.vRooms, ( d : ClubRoomItem )=>{ return d.jsmsgBrife == null;} ) == -1 ;
            if ( isAllRoomRecievedInfo )
            {
                this.doInformDataRefreshed(true);
            }
            return true ;
        }
        return false ;
    }

    protected requestRoomsDetail()
    {
        for ( let v of this.vRooms )
        {
            if ( v.jsmsgBrife )
            {
                console.error( "why have not null data member ?" );
                continue ;
            }

            console.log( "req club room detial id = " + v.nRoomID );
            let js = {} ;
            js["roomID"] = v.nRoomID ;
            this.getClub().sendMsg(js,eMsgType.MSG_REQ_ROOM_ITEM_INFO,Utility.getMsgPortByRoomID(v.nRoomID),v.nRoomID ) ;
        }
    }

    getRoomByRoomID( roomID : number ) : ClubRoomItem
    {
        for ( let v of this.vRooms )
        {
            if ( v.nRoomID == roomID )
            {
                return v ;
            }
        }
        return null ;
    }

    // interface IClubRoomsData
    getRoomItems() : IClubRoomsDataItem[] 
    {
        return this.vRooms ;
    }

    canDimissRoom() : boolean 
    {
       return this.getClub().isSelfPlayerMgr() && this.vRooms.length > 0 ;
    }

    reqDissmissRoom( roomID : number ) : void 
    {
        let self = this ;
        let msg = {} ;
        let port = Utility.getMsgPortByRoomID(roomID);
        Network.getInstance().sendMsg(msg,eMsgType.MSG_APPLY_DISMISS_VIP_ROOM,port,roomID,( js : Object )=>{
            let ret = js["ret"] ;
            if ( ret == 0 )
            {
                self.fetchData(true) ;
            }
            else
            {
                Utility.showPromptText("error code = " + ret ) ;
            }
            return true ;
        });
    }

    reqEnterRoom( roomID : number ) : void 
    {
        let msg = { } ;
        msg["roomID"] = roomID;
        msg["uid"] = ClientApp.getInstance().getClientPlayerData().getSelfUID();//ClientData.getInstance().selfUID;
        let port = Utility.getMsgPortByRoomID( roomID );
        if ( eMsgPort.ID_MSG_PORT_ALL_SERVER <= port || port < eMsgPort.ID_MSG_PORT_LUOMJ  )
        {
            Utility.showTip( "房间不存在或已经解散 code" + 0 );
            return ;
        }

        Network.getInstance().sendMsg(msg,eMsgType.MSG_ENTER_ROOM,port,roomID,( msg : Object)=>
        {
            let ret = msg["ret"] ;
            if ( ret )
            {
                if ( 8 == ret )
                {
                    Utility.showTip( "您的钻石不足，无法进入房间" + ret );
                    return true;
                }
                Utility.showTip( "房间不存在或已经解散 code" + ret );
                return true;
            }
            console.log( "set join room id = " + roomID );
            ClientApp.getInstance().getClientPlayerData().getBaseData().stayInRoomID = roomID ;
            cc.director.loadScene(SceneName.Scene_Room ) ;
            return true ;
        } );
    }
}
