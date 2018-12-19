// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import PlayerBrifdata from "../record/playerBrifedata"
import { Define } from "./clubDefine"
import { eMsgPort,eMsgType } from "../../../common/MessageIdentifer"
import Network from "../../../common/Network"
import ClubData from "./clubData";
import ClientData from "../../../globalModule/ClientData";
export default abstract class IPannelData
{
    private nLastRecivedDataTime : number = 0 ;
    lpfCallBack : ( nRoomID : number )=>void = null ;  // -1 means all ;
    protected playerDatas : PlayerBrifdata = null ;
    protected pClubData : ClubData = null ;

    get nClubID() : number
    {
        return this.pClubData.clubID ;
    }

    init( clubData : ClubData , playersData : PlayerBrifdata )
    {
        this.pClubData = clubData ;
        this.playerDatas = playersData ;
    }

    get clubID() : number 
    {
        return this.nClubID ;
    }

    protected getRefreshTimeElaps()
    {
        return Define.TIME_ROOM_DATA_REFRESH ;
    }

    isNeedRefreshData()
    {
        let escape = Date.now() ; 
        if ( escape - this.nLastRecivedDataTime < this.getRefreshTimeElaps() && this.getDataCnt() > 0 )
        {
            cc.log( "too few wait refresh data" );
            return false;
        }

        if ( CC_DEBUG )
        {
            if ( 0 == this.nLastRecivedDataTime )
            {
                cc.warn( "after recievd data , do not forget invoke onDoRecievdData()" );
            }
        }
        return true ;
    }

    onDoRecievdData()
    {
        this.nLastRecivedDataTime = Date.now();
    }

    onLoseFocus()
    {
        this.lpfCallBack = null ;
    }

    abstract getDataCnt(): number  ;

    abstract featchData() : void ;

    abstract onMsg( msgID : eMsgType , msg : Object ) : boolean ;

    protected getPlayerBrifData( uid : number ) : Object
    {
        return this.playerDatas.getPlayerDetailByUID(uid);
    }

    protected onRecivedPlayerBrifData( msg : Object ) : boolean 
    {
        return false ;
    }

    protected sendClubMsg( msgID : eMsgType , msg : Object )
    {
        let selfID = ClientData.getInstance().selfUID;
        Network.getInstance().sendMsg(msg,msgID,eMsgPort.ID_MSG_PORT_CLUB,selfID) ;
    }

}
