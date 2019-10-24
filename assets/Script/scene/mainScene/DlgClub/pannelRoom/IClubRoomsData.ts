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

export class ClubRoomItemPlayer
{
    nUID : number = 0 ;
    isOnline : boolean = false ;
}

export interface IClubRoomsDataItem
{
    nRoomID : number ;
    vRoomPeers : ClubRoomItemPlayer[];
    isOpen : boolean ;
    playedRound : number;
    totalRound : number;
    isCircle : boolean;
    seatCnt : number ;
    opts : IOpts ;
}

export default interface IClubRoomsData {
    getRoomItems() : IClubRoomsDataItem[] ;
    canDimissRoom() : boolean ;
    reqDissmissRoom( roomID : number ) : void ; 
    reqEnterRoom( roomID : number ) : void ;
}
