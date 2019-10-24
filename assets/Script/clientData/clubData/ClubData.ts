import IClubDataComponent from "./IClubDataComponent";
import { eMsgType, eMsgPort } from "../../common/MessageIdentifer";
import { eClubDataComponent } from "./ClubDefine";
import ClubDataBase from "./ClubDataBase";
import ClubDataEvent from "./ClubDataEvent";
import ClubDataMembers from "./ClubDataMembers";
import ClubDataRecorder from "./ClubDataRecorders";
import ClubDataRooms from "./ClubDataRooms";
import Network from "../../common/Network";
import ClientPlayerClubs from "../ClientPlayerClubs";
import ClientApp from "../../globalModule/ClientApp";
import { IClubListDataItem } from "../../scene/mainScene/DlgClub/clubList/IClubListData";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export default class ClubData implements IClubListDataItem {
    
    private _ClubID : number = 0 ;
    private _PlayerClubs : ClientPlayerClubs = null ;
    private vClubDataComponents : { [ key : number] : IClubDataComponent } = {} ;

    init( clubID : number, clubs : ClientPlayerClubs )
    {
        this._PlayerClubs = clubs ;
        this._ClubID = clubID ;
        this.vClubDataComponents[eClubDataComponent.eClub_BaseData] = new ClubDataBase();
        this.vClubDataComponents[eClubDataComponent.eClub_Events] = new ClubDataEvent();
        this.vClubDataComponents[eClubDataComponent.eClub_Members] = new ClubDataMembers();
        this.vClubDataComponents[eClubDataComponent.eClub_Recorders] = new ClubDataRecorder();
        this.vClubDataComponents[eClubDataComponent.eClub_Rooms] = new ClubDataRooms();
        for ( let v of Object.keys(this.vClubDataComponents) )
        {
            let type = parseInt(v);
            this.vClubDataComponents[type].init(this,type) ;
        }
        
        this.vClubDataComponents[eClubDataComponent.eClub_BaseData].fetchData(false);
    }

    onDataRefreshed( data : IClubDataComponent )
    {
        this._PlayerClubs.onClubDataRefreshed(this,data);
    }

    fetchData( type : eClubDataComponent , isForce : boolean )
    {
        let p = this.vClubDataComponents[type] ;
        if ( p == null )
        {
            console.error( "fetch data component is null , type = " + type );
            return ;
        }
        p.fetchData( isForce ) ;
    }

    getClubID() : number 
    {
        return this._ClubID ;
    }

    sendMsg( jsMsg : Object , msgID : eMsgType, targetPort : eMsgPort , targetID : number )
    {
        Network.getInstance().sendMsg(jsMsg,msgID,targetPort,targetID) ;
    }

    onMsg( msgID : number , msgData : Object ) : boolean
    {
        for ( let v of Object.keys(this.vClubDataComponents) )
        {
            let type = parseInt(v);
            if ( this.vClubDataComponents[type].onMsg(msgID,msgData) )
            {
                return true ;
            }
        }

        return false ;
    }

    getClubBase() : ClubDataBase
    {
        return <ClubDataBase>this.vClubDataComponents[eClubDataComponent.eClub_BaseData] ;
    }

    getClubEvents() : ClubDataEvent
    {
        return <ClubDataEvent>this.vClubDataComponents[eClubDataComponent.eClub_Events] ;
    }

    getClubMembers() : ClubDataMembers
    {
        return <ClubDataMembers>this.vClubDataComponents[eClubDataComponent.eClub_Members] ;
    }

    getClubRooms() : ClubDataRooms
    {
        return <ClubDataRooms>this.vClubDataComponents[eClubDataComponent.eClub_Rooms] ;
    }

    getClubRecorder() : ClubDataRecorder
    {
        return <ClubDataRecorder>this.vClubDataComponents[eClubDataComponent.eClub_Recorders] ;
    }

    fetchCompData( type : eClubDataComponent , isForce : boolean ) : void
    {
        this.vClubDataComponents[type].fetchData(isForce);
    }

    onDestry()
    {
        for ( let v of Object.keys(this.vClubDataComponents) )
        {
            let type = parseInt(v);
            this.vClubDataComponents[type].onDestroy();
        }
        this.vClubDataComponents = {} ;
    }

    isSelfPlayerMgr()
    {
        let slefID = ClientApp.getInstance().getClientPlayerData().getSelfUID();
        return this.getClubBase().isPlayerMgr(slefID) ;
    }

    // interface IClubListDataItem 
    get clubID() : number
    {
        return this.getClubID();
    }

    get clubName() : string
    {
        return this.getClubBase().name;
    }

    isCurrentSelected : boolean = false ;
}
