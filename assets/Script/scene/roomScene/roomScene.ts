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
import RoomData from "./roomData"
import RoomInfoLayer from "./roomInfoLayer"
import PlayerInfoLayer from "./playerInfoLayer"
import PlayerCardsLayer from "./playerCardsLayer"
import { eMsgPort , eMsgType } from "../../common/MessageIdentifer"
import Network from "../../common/Network"
import { clientDefine , SceneName } from "../../common/clientDefine"
import ClientData from "../../globalModule/ClientData"
import { IOneMsgCallback } from "../../common/NetworkInterface"
import { eMJActType,eEatType } from "./roomDefine";
import DlgActList from "./dlgActList"
import dlgActOptsCards from "./dlgActOptsCards"
import { IPlayerCards, playerBaseData } from "./roomInterface";
@ccclass
export default class RoomScene extends cc.Component {

    @property(RoomData)
    pRoomData: RoomData = null;

    @property(RoomInfoLayer)
    pLayerRoomInfo : RoomInfoLayer = null ;

    @property(PlayerInfoLayer)
    pLayerPlayerInfo : PlayerInfoLayer = null ;

    @property(PlayerCardsLayer)
    pLayerPlayerCards : PlayerCardsLayer = null ;

    @property(DlgActList)
    pdlgAct : DlgActList = null ;

    @property(dlgActOptsCards)
    pdlgActOptsCards : dlgActOptsCards = null ;
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        cc.systemEvent.on(clientDefine.netEventMsg,this.onMsg,this) ;
        cc.systemEvent.on(clientDefine.netEventRecievedBaseData,this.doRequestRoomInfoToRefreshRoom,this) ;
    }

    start () {
        this.pLayerPlayerCards.roomScene = this ;
        this.pLayerPlayerInfo.roomScene = this ;
        this.pLayerRoomInfo.roomScene = this ;
        this.doRequestRoomInfoToRefreshRoom();
    }

    onMsg( event : cc.Event.EventCustom )
    {
        let nMsgID : eMsgType = event.detail[clientDefine.msgKey] ;
        let msg : Object = event.detail[clientDefine.msg] ;
        this.pRoomData.onMsg(nMsgID,msg);
        switch ( nMsgID )
        {
            case eMsgType.MSG_ROOM_INFO:
            {
    
            }
            break ;
            case eMsgType.MSG_ROOM_PLAYER_INFO:
            {
                this.pLayerRoomInfo.refresh(this.pRoomData);
                this.pLayerPlayerInfo.refresh(this.pRoomData);
                this.pLayerPlayerCards.refresh(this.pRoomData);
            }
            break ;
            case eMsgType.MSG_REQUEST_PLAYER_DATA:
            {
                let uid = msg["uid"] ;
                let p = this.pRoomData.getPlayerDataByUID(uid);
                this.pLayerPlayerInfo.onRefreshPlayerDetail(p);
            }
            break ;
            case eMsgType.MSG_ROOM_SIT_DOWN:
            {
                let uid = msg["uid"] ;
                let p = this.pRoomData.getPlayerDataByUID(uid);
                this.pLayerPlayerInfo.onPlayerJoin(p);
            }
            break;
            case eMsgType.MSG_ROOM_STAND_UP:
            {
                let idx = msg["idx"] ;
                this.pLayerPlayerInfo.onPlayerLeave(this.pRoomData.svrIdxToClientIdx(idx));
            }
            break ;
            case eMsgType.MSG_ROOM_PLAYER_READY:
            {
                let idx = msg["idx"] ;
                this.pLayerPlayerInfo.onPlayerReady(this.pRoomData.svrIdxToClientIdx(idx));
            }
            break ;
            case eMsgType.MSG_ROOM_ACT:
            {
                // svr : { idx : 0 , actType : 234, card : 23, gangCard : 12, eatWith : [22,33], huType : 23, fanShu : 23  }
                let svrIdx = msg["idx"] ;
                let actType : eMJActType = msg["actType"];
                let targetCard : number = msg["card"] ;
                let playerCardData = this.pRoomData.vPlayers[svrIdx].cards ;
                let clientIdx = this.pRoomData.svrIdxToClientIdx(svrIdx);
                let invokerClientIdx = this.pRoomData.lastChuClientIdx ;
                switch ( actType )
                {
                    case eMJActType.eMJAct_Mo:
                    {
                        this.pRoomData.curActSvrIdx = svrIdx ;
                        this.pLayerRoomInfo.doIndicatorToPlayer(clientIdx) ;
                        playerCardData.onMo(targetCard);
                        this.pLayerPlayerCards.onPlayerMo(clientIdx,targetCard) ;
                    }
                    break ;
                    case eMJActType.eMJAct_Chu:
                    {
                        this.pRoomData.lastChuClientIdx = clientIdx ;
                        this.pRoomData.lastChuCard = targetCard ;
                        playerCardData.onChu(targetCard) ;
                        if ( 0 != clientIdx )
                        {
                            this.pLayerPlayerCards.onPlayerChu(clientIdx,targetCard) ;
                        }
                    }
                    break ;
                    case eMJActType.eMJAct_Chi:
                    {
                        this.pLayerRoomInfo.doIndicatorToPlayer(clientIdx) ;
                        this.pRoomData.curActSvrIdx = svrIdx ;
                        playerCardData.onEat(targetCard,msg["eatWith"][0],msg["eatWith"][1],invokerClientIdx);
                        this.pLayerPlayerCards.onPlayerEat(clientIdx,targetCard,msg["eatWith"][0],msg["eatWith"][1],invokerClientIdx) ;

                        this.pRoomData.vPlayers[this.pRoomData.clientIdxToSvrIdx(invokerClientIdx)].cards.onCardBePengOrGanged(targetCard);
                    }
                    break ;
                    case eMJActType.eMJAct_Peng:
                    {
                        this.pLayerRoomInfo.doIndicatorToPlayer(clientIdx) ;
                        this.pRoomData.curActSvrIdx = svrIdx ;
                        playerCardData.onPeng(targetCard,invokerClientIdx);
                        this.pRoomData.vPlayers[this.pRoomData.clientIdxToSvrIdx(invokerClientIdx)].cards.onCardBePengOrGanged(targetCard);
                        this.pLayerPlayerCards.onPlayerPeng(clientIdx,targetCard,invokerClientIdx) ;
                    }
                    break ;
                    case eMJActType.eMJAct_AnGang:
                    {
                        this.pRoomData.curActSvrIdx = svrIdx ;
                        playerCardData.onAnGang(targetCard,msg["gangCard"],clientIdx ) ;
                        this.pLayerPlayerCards.onPlayerAnGang(clientIdx,targetCard,msg["gangCard"]) ;
                    }
                    break;
                    case eMJActType.eMJAct_BuGang:
                    {
                        this.pRoomData.curActSvrIdx = svrIdx ;
                        playerCardData.onBuGang(targetCard,msg["gangCard"]) ;
                        this.pLayerPlayerCards.onPlayerBuGang(clientIdx,targetCard,playerCardData.getMingCardInvokerIdx(targetCard),msg["gangCard"]) ;
                    }
                    break;
                    case eMJActType.eMJAct_MingGang:
                    {
                        this.pLayerRoomInfo.doIndicatorToPlayer(clientIdx) ;
                        this.pRoomData.curActSvrIdx = svrIdx ;
                        playerCardData.onMingGang(targetCard,msg["gangCard"],invokerClientIdx) ;
                        this.pRoomData.vPlayers[this.pRoomData.clientIdxToSvrIdx(invokerClientIdx)].cards.onCardBePengOrGanged(targetCard);
                        this.pLayerPlayerCards.onPlayerMingGang(clientIdx,targetCard,invokerClientIdx,msg["gangCard"]) ;
                    }
                    break;
                    case eMJActType.eMJAct_Hu:
                    {
                        playerCardData.onHu(targetCard);
                        this.pLayerPlayerCards.onPlayerHu( clientIdx,targetCard);
                    }
                    break ;
                    default:
                    cc.error( "unknown act type = " + actType );
                    break ;
                }
            } 
            break ;
            case eMsgType.MSG_PLAYER_WAIT_ACT_ABOUT_OTHER_CARD:
            {
                this.pdlgAct.showDlg(msg["acts"],msg["cardNum"]) ;
            }
            break;
            case eMsgType.MSG_PLAYER_WAIT_ACT_AFTER_RECEIVED_CARD:
            {
                let vActList : eMJActType[] = [] ;
                let vAct : Object[] = msg["acts"] ;
                let vCanGang : number[] = [] ;
                vAct.forEach( ( act : Object)=>{
                    let actT : eMJActType = act["act"] ; 
                    vActList.push(actT);
                    if ( actT == eMJActType.eMJAct_BuGang || actT == eMJActType.eMJAct_AnGang || actT == eMJActType.eMJAct_BuGang_Declare )
                    {
                        vCanGang.push(act["cardNum"] );
                    }
                } );
                this.pdlgAct.showDlg(msg["acts"],-1,vCanGang) ;
            }
            break ;
            case eMsgType.MSG_ROOM_MQMJ_GAME_START:
            {
                let vRace : Object[] = msg["races"] ;
                if ( vRace != null )
                {
                    let self = this ;
                    vRace.forEach( ( o : Object)=>{
                        let idx : number = o["idx"] ;
                        self.pRoomData.vPlayers[idx].race = o[" race"] ;
                    } );
                }

                this.pRoomData.bankerIdx = msg["bankerIdx"] ;
                let selfUID = ClientData.getInstance().selfUID ;
                this.pRoomData.vPlayers.forEach( (p : playerBaseData)=>{
                    if ( p.uid == selfUID )
                    {
                        p.cards.vHoldCard = p.cards.vHoldCard.concat(msg["cards"]) ;
                    }
                    else
                    {
                        p.cards.nHoldCardCnt = p.svrIdx == msg["bankerIdx"] ? 13 : 12 ;
                    }
                } ) ;
 
                this.pRoomData.curActSvrIdx = this.pRoomData.bankerIdx ;
                this.pLayerRoomInfo.doIndicatorToPlayer(this.pRoomData.svrIdxToClientIdx(this.pRoomData.bankerIdx)) ;
                this.enterGameState();
            }
            break ;
        } 
    }

    onActDlgResult( pdlgAct : DlgActList, mjAct : eMJActType )
    {
        if ( pdlgAct.isSelfRecievedCardAct() )
        {
            if ( eMJActType.eMJAct_Hu == mjAct )
            {
                let playerCard : IPlayerCards = this.pRoomData.vPlayers[this.pRoomData.clientIdxToSvrIdx(0)].cards ;
                let msg = {} ;
                msg["actType"] = mjAct ;
                msg["card"] = playerCard.nNewFeatchedCard ;
                this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
                return ;
            }

            // other situeation must gang ;
            let playerCard : IPlayerCards = this.pRoomData.vPlayers[this.pRoomData.clientIdxToSvrIdx(0)].cards ;
            let vCanGangCards = pdlgAct.vCanGangCards;
            if ( vCanGangCards.length <= 1 )
            {
                let card : number = vCanGangCards[0] ;
                let msg = {} ;
                msg["actType"] = playerCard.getMingCardInvokerIdx(card) == -1 ? eMJActType.eMJAct_AnGang : eMJActType.eMJAct_BuGang  ;
                msg["card"] = pdlgAct.taregetCard ;
                this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
                return ;
            }
            this.pdlgActOptsCards.showDlgOptsForGang(vCanGangCards) ;
            return ;
        }
        else
        {
            if ( eMJActType.eMJAct_Chi != mjAct )
            {
                let msg = {} ;
                msg["actType"] = mjAct ;
                msg["card"] = pdlgAct.taregetCard ;
                this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
                return ;
            }

            // eat situaion , we should check if have more opts ;
            let vEatType : Object[] = [] ; // [ { type : left , eatWith : [] } ]
            let card : number = pdlgAct.taregetCard ;
            let playerCard : IPlayerCards = this.pRoomData.vPlayers[this.pRoomData.clientIdxToSvrIdx(0)].cards ;
            if ( playerCard.isHaveCard( card + 1 ) && playerCard.isHaveCard(card + 2 ) )
            {
                let obj = {} ;
                obj["type"] = eEatType.eEat_Left;
                obj["eatWith"] = [card + 1 , card + 2 ] ;
                vEatType.push(obj);
            }

            if ( playerCard.isHaveCard( card - 1 ) && playerCard.isHaveCard(card + 1 ) )
            {
                let obj = {} ;
                obj["type"] = eEatType.eEat_Middle;
                obj["eatWith"] = [card - 1 , card + 1 ] ;
                vEatType.push(obj);
            }

            if ( playerCard.isHaveCard( card - 1 ) && playerCard.isHaveCard(card - 2 ) )
            {
                let obj = {} ;
                obj["type"] = eEatType.eEat_Righ;
                obj["eatWith"] = [card - 1 , card - 2 ] ;
                vEatType.push(obj);
            }

            if ( vEatType.length == 1 )
            {
                let msg = {} ;
                msg["actType"] = mjAct ;
                msg["card"] = pdlgAct.taregetCard ;
                msg["eatWith"] = vEatType[0]["eatWith"] ;
                this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
                return ;
            }
            // need show opts ;
            let vEatOpts : eEatType[] = [] ;
            vEatType.forEach( ( o : Object)=>{ vEatOpts.push( o["type"] );} );
            this.pdlgActOptsCards.showDlgOptsForEat(card,vEatOpts) ;
        }

    }

    onActDlgOptsResult(  dlgOpts : dlgActOptsCards ,nselIdx : number )
    {
        if ( dlgOpts.isEatState == false ) // gang opts ;
        {
            let playerCard : IPlayerCards = this.pRoomData.vPlayers[this.pRoomData.clientIdxToSvrIdx(0)].cards ;
            let card = dlgOpts.vGangOpts[nselIdx] ;
            let msg = {} ;
            msg["actType"] = playerCard.getMingCardInvokerIdx(card) == -1 ? eMJActType.eMJAct_AnGang : eMJActType.eMJAct_BuGang  ;
            msg["card"] = card ;
            this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
            return ;
        }

        // eat ;
        let eatType : eEatType = dlgOpts.vEatType[nselIdx] ;
        let vEatWith : number[][] = [];
        let eatCard : number = dlgOpts.nEatTargetCard ;
        vEatWith[eEatType.eEat_Left] = [ eatCard + 1 , eatCard + 2 ] ;
        vEatWith[eEatType.eEat_Middle] = [ eatCard - 1 , eatCard + 1 ] ;
        vEatWith[eEatType.eEat_Righ] = [ eatCard - 1 , eatCard - 2 ] ;
        let msg = {} ;
        msg["actType"] = eMJActType.eMJAct_Chi  ;
        msg["card"] = eatCard ;
        msg["eatWith"] = vEatWith[eatType];
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
        return ;
    }

    doRequestRoomInfoToRefreshRoom()
    {
        // request room info ;
        let nRoomID = ClientData.getInstance().stayInRoomID ;
        if ( nRoomID == -1 || 0 == nRoomID )
        {
            cc.director.loadScene(SceneName.Scene_Main);
            return ;
        }

        let msgReqRoomInfo = { } ;
        let port = ClientData.getInstance().getMsgPortByRoomID(nRoomID);
        Network.getInstance().sendMsg(msgReqRoomInfo,eMsgType.MSG_REQUEST_ROOM_INFO,port,nRoomID) ;
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    sendRoomMsg( msg : Object , msgID : eMsgType, callBack? : IOneMsgCallback ) : boolean
    {
        msg["dstRoomID"] = this.pRoomData.roomID ;
        let port = ClientData.getInstance().getMsgPortByGameType( this.pRoomData.gameType ) ;
        return Network.getInstance().sendMsg(msg,msgID,port,this.pRoomData.roomID,callBack) ;
    }

    enterWaitReadyState()
    {
        this.pRoomData.enterWaitReadyState();
        this.pLayerPlayerCards.enterWaitReadyState(this.pRoomData);
        this.pLayerRoomInfo.enterWaitReadyState(this.pRoomData);
        this.pLayerPlayerInfo.enterGameState(this.pRoomData);
    }

    enterGameState()
    {
        this.pRoomData.enterGameOverState();
        this.pLayerPlayerCards.enterGameState(this.pRoomData);
        this.pLayerPlayerInfo.enterGameState(this.pRoomData);
        this.pLayerRoomInfo.enterGameState(this.pRoomData);
    }
    // update (dt) {}
}
