import IClubRoomsData, { IClubRoomsDataItem, ClubRoomItemPlayer } from "./IClubRoomsData";
import IOpts from "../../../../opts/IOpts";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

class item implements IClubRoomsDataItem
{
    nRoomID : number = 201699;
    vRoomPeers : ClubRoomItemPlayer[] = [];
    isOpen : boolean = true;
    playedRound : number = 2;
    totalRound : number = 8 ;
    isCircle : boolean = false ;
    seatCnt : number = 4;
    opts : IOpts = null;
}

@ccclass
export default class ClubRoomsData implements IClubRoomsData {

    getRoomItems() : IClubRoomsDataItem[] 
    {
        let v : IClubRoomsDataItem[] = [] ;
        let cnt = 6 ;
        while ( cnt-- )
        {
            let p = new item() ;
            p.nRoomID += cnt ;
            v.push( p );
        }
        return v ;
    }

    canDimissRoom() : boolean 
    {
        return true ;
    }

    reqDissmissRoom( roomID : number ) : void 
    {
        cc.log( "req dismiss room = " + roomID );
        return ;
    }

    reqEnterRoom( roomID : number ) : void 
    {
        cc.log( "req enter room id = " + roomID );
    }
}
