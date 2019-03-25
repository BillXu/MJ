import IClubDataComponent from "./IClubDataComponent";
import { eMsgType, eMsgPort } from "../../common/MessageIdentifer";
import * as _ from "lodash"
import Utility from "../../globalModule/Utility";
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export class RoomPeer
{
    nUID : number = 0 ;
    isOnline : boolean = false ;
}

export class ClubRoomItem
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

    get opts() : Object
    {
        return this.jsmsgBrife["opts"] ;
    }
    
    jsmsgBrife : Object = null ;
}
 
export default class ClubDataRooms extends IClubDataComponent {

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
            vRooms = vRooms.concat(msgData["emptyRooms"]) || [];
            if ( vRooms.length == 0 )
            {
                this.doInformDataRefreshed(true);
                return true ;
            }

            for ( let v of vRooms )
            {
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

}
