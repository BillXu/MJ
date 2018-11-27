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
import { IHoldMingPai,IPlayerCards,playerBaseData } from "./roomInterface"
import { eClientRoomState } from "./roomDefine"
import { eRoomState,eGameType } from "../../common/clientDefine"
import { eMsgPort , eMsgType } from "../../common/MessageIdentifer"
import Network from "../../common/Network"
import * as _ from "lodash"
import ClientData from "../../globalModule/ClientData";
@ccclass
export default class RoomData extends cc.Component {

    jsRoomInfoMsg : Object = {} ;
    vPlayers : playerBaseData[] = [] ;
     
    //lastChuCard : number = 0 ;
    _lastChuPlayerClientIdx : number = -1 ;

    getMaxTableSeat() : number
    {
        return 4 ;
    }

    get rule() : string
    {
        return "this is option rule" ;
    }

    get gameType() : eGameType
    {
        return this.jsRoomInfoMsg["opts"]["gameType"] ;
    }

    get lastChuClientIdx() : number 
    {
        if ( this._lastChuPlayerClientIdx == -1 )
        {
            return this.bankerIdx ;
        }
        return this._lastChuPlayerClientIdx ;
    }

    set lastChuClientIdx ( clientIdx : number )
    {
        this._lastChuPlayerClientIdx = clientIdx;
    }

    get curActClientIdx() : number 
    {
        return this.svrIdxToClientIdx(this.jsRoomInfoMsg["curActIdex"] ) ;
    }

    set curActSvrIdx( idx : number )
    {
        this.jsRoomInfoMsg["curActIdex"] = idx ;
    }
    
    getPrivousPlayerIdx( nCurIdx : number ) : number 
    {
        let preIdx = nCurIdx - 1 ;
        if ( this.seatCnt == 2 )
        {
            preIdx = nCurIdx - 2 ;
        }

        return ( preIdx + this.getMaxTableSeat() ) % this.getMaxTableSeat();
    }

    getNextPlayerIdx( nCurIdx : number ) : number
    {
        let preIdx = nCurIdx + 1 ;
        if ( this.seatCnt == 2 )
        {
            preIdx = nCurIdx + 2 ;
        }

        return preIdx % this.getMaxTableSeat();
    }

    get seatCnt() : number 
    {
         return this.jsRoomInfoMsg["opts"]["seatCnt"] ;
    }

    get isRoomOpened() : boolean
    {
        return this.jsRoomInfoMsg["isOpen"] ;
    }

    set isRoomOpened( isOpen : boolean ) 
    {
        this.jsRoomInfoMsg["isOpen"] = isOpen ;
    }

    get isCircleType() : boolean
    {
        return this.jsRoomInfoMsg["opts"]["opts"]["circle"] == 1;
    }

    get totalCircleOrRoundCnt() : number
    {
        let level : number = this.jsRoomInfoMsg["opts"]["level"] ;
        let createDlgOptIdx = 0 ;
        if ( this.isCircleType == false )
        {
            createDlgOptIdx = level ;
            return createDlgOptIdx == 0 ? 8 : 16 ;
        }
        else
        createDlgOptIdx = level - 2 ;

        let vCircle = [1,2,3,4] ;
        return vCircle[level] ;
    }

    get playedCircle() : number
    {
        return this.totalCircleCnt - this.jsRoomInfoMsg["leftCircle"] ;
    }

    get letfMJCnt() : number
    {
        return this.jsRoomInfoMsg["leftCards"] ;
    }

    set leftMJCnt( cnt : number )
    {
        this.jsRoomInfoMsg["leftCards"] = cnt;
    }

    get nRoomState() : eClientRoomState
    {
        return this.jsRoomInfoMsg["state"] == eRoomState.eRoomSate_WaitReady ? eClientRoomState.State_WaitReady : eClientRoomState.State_StartGame ; 
    }

    get totalCircleCnt() : number
    {
        return 0 ;
    }
    
    get roomID() : number 
    {
        return this.jsRoomInfoMsg["roomID"] ;
    }

    get bankerIdx() : number
    {
        return this.jsRoomInfoMsg["bankIdx"] ;
    }

    set bankerIdx( idx : number )
    {
        this.jsRoomInfoMsg["bankIdx"] = idx ;
    } 

    isAllPlayerInfoRecieved() : boolean 
    {
        return _.findIndex( this.vPlayers,( p : playerBaseData )=>{ return p.isReceivedDetail() == false ;}) == -1;
    }

    onLoad () 
    {

    }

    onMsg( nMsgID : eMsgType , msg : Object )
    {
        switch ( nMsgID )
        {
            case eMsgType.MSG_ROOM_INFO:
            {
                _.merge(this.jsRoomInfoMsg,msg) ;
                this.vPlayers.length = 0 ;
            }
            break ;
            case eMsgType.MSG_ROOM_PLAYER_INFO:
            {
                let vMsgPlayers : Object[] = msg["players"] ;
                let self = this ;
                vMsgPlayers.forEach( ( p : Object )=>{
                    let pD = new playerBaseData();
                    pD.parseFromMsg(p);
                    self.vPlayers[pD.svrIdx] = pD;

                    let reqDetail = {} ;
                    reqDetail["nReqID"] = pD.uid;
                    reqDetail["isDetail"] = 1 ;
                    Network.getInstance().sendMsg(reqDetail,eMsgType.MSG_REQUEST_PLAYER_DATA,eMsgPort.ID_MSG_PORT_DATA,pD.uid) ;
                } );

                // update client idx 
                this.vPlayers.forEach( ( p: playerBaseData)=>{
                    p.clientIdx = self.svrIdxToClientIdx(p.svrIdx);
                    p.cards.vMingCards.forEach( ( pM : IHoldMingPai )=>{
                        pM.nInvokerClientIdx = self.svrIdxToClientIdx(pM.nInvokerSvrIdx );
                    } );
                } );
            }
            break ;
            case eMsgType.MSG_REQUEST_PLAYER_DATA:
            {
                let uid = msg["uid"] ;
                let pPlayer = this.getPlayerDataByUID(uid);
                pPlayer.parseDetailFromMsg(msg);
            }
            break ;
            case eMsgType.MSG_ROOM_SIT_DOWN:
            {
                let pD = new playerBaseData();
                pD.parseFromMsg(msg);
                if ( this.vPlayers[pD.svrIdx] != null )
                {
                    cc.error( "pos already have player idx = " + pD.svrIdx + " uid = " + this.vPlayers[pD.svrIdx].uid );
                }

                this.vPlayers[pD.svrIdx] = pD ;
                pD.clientIdx = this.svrIdxToClientIdx(pD.svrIdx);

                let reqDetail = {} ;
                reqDetail["nReqID"] = pD.uid;
                reqDetail["isDetail"] = 1 ;
                Network.getInstance().sendMsg(reqDetail,eMsgType.MSG_REQUEST_PLAYER_DATA,eMsgPort.ID_MSG_PORT_DATA,pD.uid) ;
            }
            break ;
            case eMsgType.MSG_ROOM_STAND_UP:
            {
                let idx = msg["idx"] ;
                let uid = msg["uid"] ;
                if ( this.vPlayers[idx] == null || this.vPlayers[idx].uid != uid )
                {
                    cc.error( "idx and uid not match idx = " + idx + " uid = " + uid );
                    return ;
                }
                this.vPlayers[idx] = null ;
            }
            break ;
            case eMsgType.MSG_ROOM_PLAYER_READY:
            {
                let idx = msg["idx"] ;
                if ( null == this.vPlayers[idx] )
                {
                    cc.error( "idx player is null , how to set ready " + idx );
                    return ;
                } 
                this.vPlayers[idx].isReady = true ;
            }
            break ;
            case eMsgType.MSG_ROOM_DO_OPEN:
            {
                this.isRoomOpened = true ;
            }
            break ;
        } 
    }

    svrIdxToClientIdx( svrIdx : number ) : number
    {
        let self = this.getPlayerDataByUID(ClientData.getInstance().selfUID);
        if ( self == null )
        {
            cc.warn( "why self don't sitdown ? uid = " + ClientData.getInstance().selfUID );
            return svrIdx ;
        }

        if ( this.seatCnt == 2 )
        {
            if ( self.svrIdx == svrIdx )
            {
                return 0 ;
            }
            return 2 ;
        }

        console.log( "self idx = " + self.svrIdx + " svridx = " + svrIdx );
        let offset = svrIdx - self.svrIdx ;
        let seat = this.getMaxTableSeat();
        return ( offset + seat ) % seat ;
    }

    clientIdxToSvrIdx( cliendIdx : number ) : number
    {
        let self = this.getPlayerDataByUID(ClientData.getInstance().selfUID);
        if ( self == null )
        {
            cc.warn( "why self don't sitdown ? uid = " + ClientData.getInstance().selfUID );
            return cliendIdx ;
        }

        if ( this.seatCnt == 2 )
        {
            if ( 0 == cliendIdx )
            {
                return self.svrIdx ;
            }

            return 1 ;
        }

        return ( self.svrIdx + cliendIdx ) % this.getMaxTableSeat() ;
    }

    getPlayerDataByUID( uid : number ) : playerBaseData
    {
        let p = _.find( this.vPlayers,( p : playerBaseData )=>{ if (!p)return false ; return p.uid == uid ;} ) ;
        return p ;
    } 

    getPlayerDataByClientIdx( clientIdx : number ) : playerBaseData
    {
        for ( let idx = 0 ; idx < this.vPlayers.length ; ++idx )
        {
            if ( this.vPlayers[idx].clientIdx == clientIdx )
            {
                return this.vPlayers[idx] ;
            }
        }     
        return null ;
    }

    getPlayerDataBySvrIdx( svrIdx : number ): playerBaseData
    {
        return this.vPlayers[svrIdx] ;
    }

    isSelfRoomOwner() : boolean
    {
        return false ;
    }

    get roomOwnerUID() : number
    {
        return 0 ;
    }

    enterWaitReadyState()
    {
        this.jsRoomInfoMsg["state"] = eRoomState.eRoomSate_WaitReady ;
        this.vPlayers.forEach( ( p : playerBaseData )=>{ p.onGameWillStart();} );
    }

    enterGameState()
    {
        this.jsRoomInfoMsg["state"] = eRoomState.eRoomState_StartGame ; 
    }

    enterGameOverState()
    {
        //this.nRoomState = eClientRoomState.State_GameOver ;
        this.jsRoomInfoMsg["state"] = eRoomState.eRoomState_GameEnd ;
    }

    start () {

    }

    // update (dt) {}
}
