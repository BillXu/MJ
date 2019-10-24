import ClubData from "./ClubData";
import { eMsgPort } from "../../common/MessageIdentifer";
import ClientApp from "../../globalModule/ClientApp";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default abstract class IClubDataComponent  {
    private nLastFetchDataTime : number = 0 ;
    private _ClubData : ClubData = null ;
    private _type : number = 0 ;

    getClub() : ClubData { return this._ClubData ;}

    init( clubData : ClubData, type : number )
    {
        this._ClubData = clubData ;
        this.nLastFetchDataTime = 0 ;
        this._type = type ;
    }

    getType() : number
    {
        return this._type;
    }

    get clubID() : number
    {
        return this.getClub().getClubID();
    }

    abstract fetchData( isforce : boolean ) : void ;
    
    doInformDataRefreshed( isResetInterval : boolean )
    {
        this.getClub().onDataRefreshed(this);

        if ( isResetInterval )
        {
            this.nLastFetchDataTime = Date.now();
        }
    }

    isDataOutOfDate() : boolean  // by seconds 
    {
        return (Date.now() - this.nLastFetchDataTime ) > 1000 * 15 ; // 15 seconds , refresh rate
    }

    onMsg( msgID : number , msgData : Object ) : boolean 
    {
        return false ;
    }

    sendClubMsg( msgID : number , msgData : Object )
    {
        this._ClubData.sendMsg(msgData,msgID,eMsgPort.ID_MSG_PORT_CLUB,ClientApp.getInstance().getClientPlayerData().getSelfUID()) ;
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }
}
