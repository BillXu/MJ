import PlayerInfoData from "./playerInfoData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClientPlayerBaseData extends PlayerInfoData {

    get diamond() : number 
    {
        return this.playerBrifeDataMsg["diamond"] ;
    }

    set diamond( num : number )
    {
        this.playerBrifeDataMsg["diamond"] = num ;
    }

    get stayInRoomID() : number
    {
        if ( this.playerBrifeDataMsg["stayRoomID"] == null )
        {
            return 0 ;
        }
        return this.playerBrifeDataMsg["stayRoomID"] ;
    }

    set stayInRoomID( id : number )
    {
        this.playerBrifeDataMsg["stayRoomID"] = id ;
    }

    get coin()
    {
        return this.playerBrifeDataMsg["coin"] ;
    }

    set coin( n : number )
    {
        this.playerBrifeDataMsg["coin"] = n ;
    }

    get GPSAddress() : string
    {
        return this.playerBrifeDataMsg["c_address"] ;
    }

    set GPSAddress( s : string )
    {
        this.playerBrifeDataMsg["c_address"] = s ;
    }

    set GPS_J( j : number ) 
    {
        this.playerBrifeDataMsg["J"] = j ;
    }

    set GPS_W( j : number ) 
    {
        this.playerBrifeDataMsg["W"] = j ;
    }

    public getJoinedClubsID() : number[]
    {
        if ( this.playerBrifeDataMsg["clubs"] == null )
        {
            this.playerBrifeDataMsg["clubs"] = [] ;
        }
        return this.playerBrifeDataMsg["clubs"] ;
    }

    haveGPSInfo() : boolean
    {
        return this.GPS_J > 10 && this.GPS_W > 0 ;
    }
}
