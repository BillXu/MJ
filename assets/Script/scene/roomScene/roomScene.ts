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
import { clientDefine , SceneName, eRoomState } from "../../common/clientDefine"
import ClientData from "../../globalModule/ClientData"
import { IOneMsgCallback } from "../../common/NetworkInterface"
import { eMJActType,eEatType, eClientRoomState } from "./roomDefine";
import DlgActList from "./dlgActList"
import dlgActOptsCards from "./dlgActOptsCards"
import { IPlayerCards, playerBaseData } from "./roomInterface";
import dlgSingleResult from "./dlgSingleResult"
import DlgRoomOverResult from "./dlgRoomOverResult"
import DlgDismiss from "./dlgDismissRoom"
import DlgDuiPu from "./dlgDuiPu"
import Utility from "../../globalModule/Utility";
import DlgBase from "../../common/DlgBase";
import EffectLayer from "./effectLayer"
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

    @property(EffectLayer)
    pLayerEffect : EffectLayer = null ;

    @property(DlgActList)
    pdlgAct : DlgActList = null ;

    @property(dlgActOptsCards)
    pdlgActOptsCards : dlgActOptsCards = null ;

    @property(dlgSingleResult)
    pdlgSingleReuslt : dlgSingleResult = null ;

    @property(DlgRoomOverResult)
    pdlgRoomOver : DlgRoomOverResult = null ;
    // LIFE-CYCLE CALLBACKS:
    @property(DlgDismiss)
    pdlgDismiss : DlgDismiss = null ;

    @property(DlgDuiPu)
    pdlgDuiPu : DlgDuiPu = null ;

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
                if ( eRoomState.eRoomState_AskForHuAndPeng == msg["state"] )
                {
                    this.pRoomData.lastChuClientIdx = this.pRoomData.curActClientIdx;
                }
                else
                {
                    this.pRoomData.lastChuClientIdx = this.pRoomData.getPrivousPlayerIdx(this.pRoomData.curActClientIdx); 
                }

                this.pLayerRoomInfo.refresh(this.pRoomData);
                this.pLayerPlayerInfo.refresh(this.pRoomData);
                this.pLayerPlayerCards.refresh(this.pRoomData);

                let msgReqAct = {} ;
                this.sendRoomMsg(msgReqAct,eMsgType.MSG_REQ_ACT_LIST) ;

                if ( this.pRoomData.jsRoomInfoMsg["isWaitingDismiss"] == 1 )
                {
                    let applydiss = this.pRoomData.jsRoomInfoMsg;
                    let applyUID = applydiss["applyDismissUID"] ;
                    let p = this.pRoomData.getPlayerDataByUID(applyUID);
                    if ( p == null )
                    {
                        cc.error( "apply dissmiss player is null id = " + applyUID );
                        break ;
                    }
                    this.pdlgDismiss.refresh( p.svrIdx,this.pRoomData,applydiss["leftWaitTime"],applydiss["agreeIdxs"]);
                    let self = this ;
                    this.pdlgDismiss.showDlg(( ret : Object )=>{
                        let isAgree = ret["isAgree"] ;
                        let msgback = {} ;
                        msgback["reply"] = isAgree ? 1 : 0 ;
                        self.sendRoomMsg(msgback,eMsgType.MSG_REPLY_DISSMISS_VIP_ROOM_APPLY) ;
                    }) ;

                    this.pRoomData.jsRoomInfoMsg["isWaitingDismiss"] = 0 ;
                }
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
                let data = this.pRoomData.getPlayerDataBySvrIdx(idx);
                if ( data == null )
                {
                    cc.error( "standup player is not in room ? idx = " + idx );
                    break 
                }
                this.pLayerPlayerInfo.onPlayerLeave(data.clientIdx);
            }
            break ;
            case eMsgType.MSG_ROOM_PLAYER_READY:
            {
                let idx = msg["idx"] ;
                this.pLayerPlayerInfo.onPlayerReady(this.pRoomData.svrIdxToClientIdx(idx));
            }
            break ;
            case eMsgType.MSG_PLAYER_ACT:
            {
                let nret = msg["ret"];
                if ( nret )
                {
                    console.error( "act error nret = " + nret );
                }
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
                        this.pRoomData.leftMJCnt -= 1 ;
                        this.pLayerPlayerCards.onPlayerMo(clientIdx,targetCard) ;
                    }
                    break ;
                    case eMJActType.eMJAct_Chu:
                    {
                        this.pRoomData.lastChuClientIdx = clientIdx ;
                        //this.pRoomData.lastChuCard = targetCard ;
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
                        this.pRoomData.leftMJCnt -= 1 ;
                    }
                    break;
                    case eMJActType.eMJAct_BuGang_Done:
                    case eMJActType.eMJAct_BuGang:
                    {
                        this.pRoomData.leftMJCnt -= 1 ;
                        this.pRoomData.curActSvrIdx = svrIdx ;
                        playerCardData.onBuGang(targetCard,msg["gangCard"]) ;
                        this.pLayerPlayerCards.onPlayerBuGang(clientIdx,targetCard,playerCardData.getMingCardInvokerIdx(targetCard),msg["gangCard"]) ;
                    }
                    break;
                    case eMJActType.eMJAct_MingGang:
                    {
                        this.pRoomData.leftMJCnt -= 1 ;
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
                this.pLayerRoomInfo.leftMJCnt = this.pRoomData.leftMJCnt.toString();
                if ( actType != eMJActType.eMJAct_Mo && eMJActType.eMJAct_Chu != actType )
                {
                    this.pLayerEffect.playPlayerEffect(clientIdx,actType) ;
                }
            } 
            break ;
            case eMsgType.MSG_PLAYER_WAIT_ACT_ABOUT_OTHER_CARD:
            {
                console.log( "do pop act dlg" );
                let self = this ;
                setTimeout(() => {
                    console.log( "----do pop act dlg ishow = " + self.pdlgAct.pRootNode.active + " pos " + self.pdlgAct.node.position.toString() );
                    //self.pdlgAct.showDlg(msg["acts"],msg["cardNum"]) ;
                }, 1500);
                this.pdlgAct.showDlg(msg["acts"],msg["cardNum"]) ;
            }
            break;
            case eMsgType.MSG_PLAYER_WAIT_ACT_AFTER_RECEIVED_CARD:
            {
                let vActList : eMJActType[] = [] ;
                let vAct : Object[] = msg["acts"] ;
                if ( vAct.length == 1 && vAct[0]["act"] == eMJActType.eMJAct_Chu )
                {
                    return ;
                }

                let vCanGang : number[] = [] ;
                vAct.forEach( ( act : Object)=>{
                    let actT : eMJActType = act["act"] ; 
                    vActList.push(actT);
                    if ( actT == eMJActType.eMJAct_BuGang || actT == eMJActType.eMJAct_AnGang || actT == eMJActType.eMJAct_BuGang_Declare )
                    {
                        vCanGang.push(act["cardNum"] );
                    }
                } );
                this.pdlgAct.showDlg(vActList,-1,vCanGang) ;
            }
            break ;
            case eMsgType.MSG_ROOM_MQMJ_PLAYER_HU:
            {

            }
            break;
            case eMsgType.MSG_ROOM_CFMJ_GAME_WILL_START:
            {
                this.pRoomData.bankerIdx = msg["bankerIdx"] ;
                this.pRoomData.curActSvrIdx = this.pRoomData.bankerIdx ;
                this.pRoomData.leftCircle = msg["leftCircle"] ;
                this.enterGameState();
            }
            break;
            case eMsgType.MSG_ROOM_MQMJ_GAME_START:
            {
                // let vRace : Object[] = msg["races"] ;
                // if ( vRace != null )
                // {
                //     let self = this ;
                //     vRace.forEach( ( o : Object)=>{
                //         let idx : number = o["idx"] ;
                //         self.pRoomData.vPlayers[idx].race = o[" race"] ;
                //     } );
                // }  
                let selfUID = ClientData.getInstance().selfUID ;
                this.pRoomData.vPlayers.forEach( (p : playerBaseData)=>{
                    if ( p.uid == selfUID )
                    {
                        p.cards.vHoldCard.length = 0 ;
                        p.cards.vHoldCard = p.cards.vHoldCard.concat(msg["cards"]) ;
                        if ( p.cards.vHoldCard.length == 14 )
                        {
                            p.cards.nNewFeatchedCard = p.cards.vHoldCard.pop() ;
                        }
                        p.cards.nHoldCardCnt = p.cards.vHoldCard.length ;

                    }
                    else
                    {
                        p.cards.nHoldCardCnt = p.svrIdx == this.pRoomData.bankerIdx ? 14 : 13 ;
                        if ( p.cards.nHoldCardCnt == 14 )
                        {
                            p.cards.nNewFeatchedCard = 1 ;
                            p.cards.nHoldCardCnt = 13 ;
                        }
                    }
                } ) ;
                this.pLayerPlayerCards.onDistributedCards(this.pRoomData) ;
            }
            break ;
            case eMsgType.MSG_ROOM_SCMJ_GAME_END:
            {
                this.pdlgDismiss.closeDlg();
                this.pdlgSingleReuslt.refresh(msg,this.pRoomData) ;
                this.pdlgSingleReuslt.showDlg();
                this.enterWaitReadyState();
            }
            break ;
            case eMsgType.MSG_ROOM_GAME_OVER:
            {
                this.pdlgDismiss.closeDlg();
                this.pRoomData.isRoomOver = true ;
                this.pdlgRoomOver.refresh(msg,this.pRoomData) ;
                if ( false == this.pdlgSingleReuslt.node.active )
                {
                    this.pdlgRoomOver.showDlg();
                }
            }
            break ;
            case eMsgType.MSG_ROOM_APPLY_DISMISS_VIP_ROOM:
            {
                this.pdlgDismiss.refresh(msg["applyerIdx"],this.pRoomData,300);
                let self = this ;
                this.pdlgDismiss.showDlg(( ret : Object )=>{
                    let isAgree = ret["isAgree"] ;
                    let msgback = {} ;
                    msgback["reply"] = isAgree ? 1 : 0 ;
                    self.sendRoomMsg(msgback,eMsgType.MSG_REPLY_DISSMISS_VIP_ROOM_APPLY) ;
                }) ;
            }
            break ;
            case eMsgType.MSG_ROOM_REPLY_DISSMISS_VIP_ROOM_APPLY:
            {
                this.pdlgDismiss.onPlayerReply(msg["idx"],msg["reply"] == 1 ) ;
                if ( msg["reply"] != 1 )
                {
                    this.pdlgDismiss.closeDlg();
                }
            }
            break;
            case eMsgType.MSG_VIP_ROOM_DO_CLOSED:
            {
                this.pdlgDismiss.closeDlg();
                if ( this.pdlgRoomOver.node.active || this.pdlgSingleReuslt.node.active )
                {

                }
                else
                {
                    cc.director.loadScene(SceneName.Scene_Main) ;
                }
            }
            break ;
            case eMsgType.MSG_ROOM_REFRESH_NET_STATE:
            {
                this.pLayerPlayerInfo.onPlayerRefreshSate(this.pRoomData.svrIdxToClientIdx( msg["idx"] ),msg["state"] == 0 );
            }
            break;
            case eMsgType.MSG_ROOM_CF_GUA_PU:
            {
                let self = this ;
                this.pdlgDuiPu.showDlg( ( score : number )=>{
                    let sendmsg = {} ;
                    sendmsg["race"] = score ;
                    self.sendRoomMsg(sendmsg,eMsgType.MSG_PLAYER_DO_GUA_PU);
                } ,null,( dlg : DlgBase )=>{
                    let sendmsg = {} ;
                    sendmsg["race"] = 0 ;
                    self.sendRoomMsg(sendmsg,eMsgType.MSG_PLAYER_DO_GUA_PU);
                } );
            }
            break ;
            case eMsgType.MSG_PLAYER_DO_GUA_PU:
            {
                let ret = msg["ret"] ;
                if ( ret != null && ret != 0 )
                {
                    Utility.showTip( "gua pu error code =" + ret );
                    break ;
                }

                let svridx = msg["idx"] ;
                let score = msg["race"] ;
                let p = this.pRoomData.getPlayerDataBySvrIdx(svridx);
                if ( p == null )
                {
                    cc.error( "not in client player gua pu svr idx = " + svridx );
                    break ;
                }
                p.race = score ;
                this.pLayerPlayerInfo.onPlayerDuiPu(p.clientIdx,score) ;
            }
            break ;
        } 
    }

    onActDlgResult( pdlgAct : DlgActList, mjAct : eMJActType )
    {
        if ( pdlgAct.isSelfRecievedCardAct() )
        {
            if ( eMJActType.eMJAct_Hu == mjAct || eMJActType.eMJAct_Pass == mjAct )
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
                msg["card"] = card ;
                this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
                return ;
            }
            this.pdlgActOptsCards.showDlgOptsForGang(vCanGangCards) ;
            pdlgAct.hide();
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
            pdlgAct.hide();
        }

    }

    onActDlgOptsResult(  dlgOpts : dlgActOptsCards ,nselIdx : number )
    {
        if ( nselIdx == null ) // pass
        {
            this.pdlgAct.show();
            return ;
        }

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
            if ( CC_DEBUG )
            {
                console.warn( "debug , not in any room but not jump main" );
                return ;
            }
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
        this.pLayerPlayerInfo.enterWaitReadyState(this.pRoomData);
    }

    enterGameState()
    {
        this.pRoomData.enterGameState();
        this.pLayerPlayerCards.enterGameState(this.pRoomData);
        this.pLayerPlayerInfo.enterGameState(this.pRoomData);
        this.pLayerRoomInfo.enterGameState(this.pRoomData);
    }

    onSingleResultCallBack( isContinue : boolean )
    {
        if ( isContinue )
        {
            if ( this.pRoomData.isRoomOver )
            {
                this.pdlgRoomOver.showDlg();
            }
            else
            {
                this.pLayerRoomInfo.onBtnReady();
            }
        }
        else
        {
            console.log( "share single result" );
        }
    }
    // update (dt) {}
}
