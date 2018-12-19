// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import * as _ from "lodash"
import Network from "../../../common/Network"
import { eMsgPort,eMsgType } from "../../../common/MessageIdentifer"
import PlayerBrifdata from "../record/playerBrifedata"
import ClientData from "../../../globalModule/ClientData"
import IPannelData from "./IPannelData"
export class RoomDataItem
{
    roomID : number = 0 ;
    vPlayers : Object[] = [] ;
    isOpen : boolean = false ;
    isCircle : boolean = false ; 
    seatCnt : number = 4 ;
    playedRound : number = 0 ;
    totalRound : number = 0 ;

    isRecievedInfo(){ return this.totalRound != 0 ; }
    onRecivedPlayerBrifData( msg : Object ) : boolean 
    {
        let uid = msg["uid"] ;
        let nIdx = _.findIndex(this.vPlayers,( obj : Object )=>{ return uid == obj["uid"] ;} );
        if ( nIdx == -1 )
        {
            return false;
        }

        _.merge(this.vPlayers[nIdx],msg);
        return true ;
    }

    parseFromRoomItemMsg( msgRoomItemInfo : Object, playerDatas : PlayerBrifdata )
    {
        this.isOpen = msgRoomItemInfo["isOpen"] == 1;
        this.isCircle = msgRoomItemInfo["opts"]["circle"] == 1 ;
        this.seatCnt = msgRoomItemInfo["opts"]["seatCnt"] ;
        this.totalRound = this.getTotalRoundOrCircle(this.isCircle,msgRoomItemInfo["opts"]["level"] );
        this.playedRound = this.totalRound - msgRoomItemInfo["leftRound"] ;

        let players : number[] = msgRoomItemInfo["players"] || [] ;
        let self = this ;
        players.forEach( ( playerID : number , idx : number )=>{
            self.vPlayers[idx] = { uid : playerID } ;
            let pdetail = playerDatas.getPlayerDetailByUID(playerID) ;
            if ( pdetail != null )
            {
                _.merge(self.vPlayers[idx],pdetail) ;
            }
        } );
    }

    private getTotalRoundOrCircle( isCircle : boolean , level : number ) : number 
    {
        let createDlgOptIdx = 0 ;
        if ( isCircle == false )
        {
            createDlgOptIdx = level ;
            return createDlgOptIdx == 0 ? 8 : 16 ;
        }
        else
        createDlgOptIdx = level - 2 ;

        let vCircle = [1,2,3,4] ;
        return vCircle[level] ;
    }
}

export default class ClubRoomData extends IPannelData  {
    vRoomDataItems : RoomDataItem[] = [] ;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}

    onRecivedPlayerBrifData( msg : Object ) : boolean
    {
        let updateIdx = -1 ;
        this.vRoomDataItems.every( ( m : RoomDataItem , idx : number )=>{
            if ( m.onRecivedPlayerBrifData(msg) )
            {
                updateIdx = idx ;
                return  false ;
            }
            return true;
        } ) ;

        if ( updateIdx != -1 && this.lpfCallBack )
        {
            this.lpfCallBack(this.vRoomDataItems[updateIdx].roomID); 
        }

        return updateIdx != -1 ;
    }

    featchData()
    {
        let net = Network.getInstance() ;
        let msg = {} ;
        msg["clubID"] = this.clubID;
        net.sendMsg(msg,eMsgType.MSG_CLUB_REQ_ROOMS,eMsgPort.ID_MSG_PORT_CLUB,this.clubID ) ;
    }

    onRecievedRoomData( msg : Object )
    {
        let clubID : number = msg["clubID"] ;
        if ( clubID != this.clubID )
        {
            return  false ;
        }

        let vFullRoom : number[] = msg["fullRooms"] || [];
        let vEmptyRoom : number[] = msg["emptyRooms"] || [];
        let rooms = vFullRoom.concat(vEmptyRoom);
        this.vRoomDataItems.length = 0 ;
        let self = this ;
        rooms.forEach( ( id : number )=>{ 
            let p = new RoomDataItem();
            p.roomID = id ;
            self.vRoomDataItems.push(p);

            // go on req room item info ;
            let msg = {} ;
            msg["roomID"] = id ;
            let port = ClientData.getInstance().getMsgPortByRoomID(id);
            Network.getInstance().sendMsg(msg,eMsgType.MSG_REQ_ROOM_ITEM_INFO,port,id) ;
        } );

        return true ;
    }

    onRecievedRoomItemInfo( msgRoomItemInfo : Object ) : boolean
    {
        let id = msgRoomItemInfo["roomID"] ;
        let pdata = this.getRoomItemByID(id);
        if ( pdata == null )
        {
            return false;
        }

        pdata.parseFromRoomItemMsg(msgRoomItemInfo,this.playerDatas);
        return true ;
    }

    getRoomItemByID( id : number ) : RoomDataItem 
    {
        let data = _.find( this.vRoomDataItems,( p : RoomDataItem )=>{ return p.roomID == id ;} );
        return data ;
    }

    onMsg( msgID : eMsgType , msg : Object ) : boolean
    {
        if ( msgID == eMsgType.MSG_CLUB_REQ_ROOMS )
        {
            this.onRecievedRoomData(msg) ;
            this.onDoRecievdData();
            return true;
        }

        if ( msgID == eMsgType.MSG_REQ_ROOM_ITEM_INFO )
        {
            this.onRecievedRoomItemInfo(msg);
            if ( this.lpfCallBack && this.isAllRoomDataItemRecievedInfo() )
            {
                this.lpfCallBack( -1 );
            }
            return true ;
        }
        return false ;
    }

    isAllRoomDataItemRecievedInfo()
    {
        return _.findIndex( this.vRoomDataItems, ( d : RoomDataItem )=>{ return d.isRecievedInfo() == false;} ) == -1 ;
    }

    start () {

    }

    getDataCnt(): number
    {
        return this.vRoomDataItems.length ;
    }

    deleteRoomID( nRoomID : number )
    {
        _.remove(this.vRoomDataItems,( id : RoomDataItem)=>{ return id.roomID == nRoomID ;} ) ;
        this.lpfCallBack(-1);
    }

    // update (dt) {}
}
