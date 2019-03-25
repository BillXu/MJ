import ClubData from "./clubData/ClubData";
import IClientPlayerDataComponent from "./IClientPlayerDataComponent";
import ClientPlayerData from "./ClientPlayerData";
import { eMsgType } from "../common/MessageIdentifer";
import IClubDataComponent from "./clubData/IClubDataComponent";

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

export default class ClientPlayerClubs implements IClientPlayerDataComponent {

    vClubs : ClubData[] = [] ;
    pDelegate : PlayerClubsDelegate = null ;

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
        for ( let v of this.vClubs )
        {
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
}
