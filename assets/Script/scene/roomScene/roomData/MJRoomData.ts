import MJRoomBaseData from "./MJRoomBaseData";
import MJPlayerData from "./MJPlayerData";
import IModule from "../../../common/IModule";
import { eMsgType } from "../../../common/MessageIdentifer";
import { SceneName } from "../../../common/clientDefine";
import Utility from "../../../globalModule/Utility";
import IOpts from "../../../opts/IOpts";
import Prompt from "../../../globalModule/Prompt";
import IRoomDataDelegate from "./IRoomDataDelegate";
import ClientApp from "../../../globalModule/ClientApp";
import PlayerInfoDataCacher from "../../../clientData/PlayerInfoDataCacher";
import * as _ from "lodash"
import { eMJActType, eChatMsgType, eEatType } from "../roomDefine";
import GPSManager from "../../../sdk/GPSManager";
import { PlayerActedCard } from "./MJPlayerCardData";
import IRoomSceneData, { ILayerPlayersData, IRoomInfoData, IRoomPlayerData } from "../IRoomSceneData";
import ILayerDlgData, { IDissmissDlgData, ISingleResultDlgData, ITotalResultDlgData, ILocationDlgData } from "../layerDlg/ILayerDlgData";
import ILayerCardsData, { IPlayerCardData } from "../layerCards/ILayerCardsData";
import ResultTotalData from "./ResultTotalData";
import ResultSingleData from "./ResultSingleData";

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

@ccclass
export default abstract class MJRoomData extends IModule implements IRoomInfoData ,ILayerPlayersData ,ILayerCardsData ,ILayerDlgData,IDissmissDlgData,ILocationDlgData,IRoomSceneData {

    mOpts : IOpts = null ;
    mBaseData : MJRoomBaseData = null ;
    mPlayers : MJPlayerData[] = [] ;
    mSceneDelegate : IRoomDataDelegate = null ; 
    mSinglResultData : ISingleResultDlgData = null ;
    mTotalResultData : ITotalResultDlgData = null;


    protected init()
    {
        super.init();
        this.createCompoentData();
    }

    abstract createCompoentData() : void ; // create opts , baseData , Players ;

    reqRoomInfo( nRoomID : number )
    {
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
        let port = Utility.getMsgPortByRoomID( nRoomID ) ;
        this.sendMsg(msgReqRoomInfo,eMsgType.MSG_REQUEST_ROOM_INFO,port,nRoomID) ;       
    }

    //-----
    protected onMsg( nMsgID : eMsgType , msg : Object ) : boolean
    {
        if ( this.mBaseData.isRoomOver )  // if room over we can not recieved any msg , user will tansfer scene ;
        {
            return false ;
        } 

        switch ( nMsgID )
        {
            case eMsgType.MSG_REQUEST_ROOM_INFO:
            {
                var isOk = msg["ret"] != null && ( msg["ret"] == 0 );
                if ( isOk == false )
                {
                    Prompt.promptText( "房间已经不存在了！" );
                    cc.director.loadScene(SceneName.Scene_Main);
                }
            }
            break;
            case eMsgType.MSG_ROOM_INFO:
            {
                //this.mIsNeedCheckGPSAndIP = true ;
                this.mBaseData.parseInfo(msg) ;
                this.mOpts.parseOpts(msg["opts"]);
                this.mSceneDelegate.onRecivedRoomInfo(this.mBaseData);
            }
            break ;
            case eMsgType.MSG_ROOM_PLAYER_INFO:
            {
                let vMsgPlayers : Object[] = msg["players"] ;
                if ( vMsgPlayers != null )
                {
                    for ( const item of vMsgPlayers )
                    {
                        this.onRecievedPlayer(item,false);
                    }
                }

                this.mSceneDelegate.onRecivedAllPlayers(this.mPlayers);
                
                this.reqActList();
            }
            break ;
            case eMsgType.MSG_ROOM_PLAYER_EXCHANGE_SEAT:
            {
                let vPlayers : Object[] = msg["detail"];
                for ( let item of vPlayers )
                {
                    let idx : number = item["idx"];
                    let uid : number = item["uid"];
                    let tmp = _.find(this.mPlayers,( p : MJPlayerData)=>{ return p.mPlayerBaseData.uid == uid ;} ) ;
                    if ( tmp == null )
                    {
                        cc.error("why client do not have player uid = " + uid );
                        continue ;
                    }

                    if (  idx == tmp.mPlayerBaseData.svrIdx )
                    {
                        continue;
                    }
                    
                    let orgiIdx = tmp.mPlayerBaseData.svrIdx ;
                    this.mPlayers[orgiIdx] = this.mPlayers[idx];
                    this.mPlayers[orgiIdx].mPlayerBaseData.svrIdx = orgiIdx ;
      
                    this.mPlayers[idx] = tmp;
                    tmp.mPlayerBaseData.svrIdx = idx ;
                }
                this.mSceneDelegate.onExchangedSeat();
            }
            break;
            case eMsgType.MSG_ROOM_SIT_DOWN:
            {
                this.onRecievedPlayer(msg,true);
            }
            break ;
            case eMsgType.MSG_ROOM_STAND_UP:
            {
                let idx : number = msg["idx"] ;
                let uid : number = msg["uid"];
                if ( this.mPlayers[idx] == null || this.mPlayers[idx].mPlayerBaseData.uid != uid )
                {
                    cc.error( "idx and uid not match idx = " + idx + " uid = " + uid );
                    return true ;
                }
                this.mPlayers[idx].clear() ;
                this.mSceneDelegate.onPlayerStandUp(idx);
            }
            break ;
            case eMsgType.MSG_ROOM_PLAYER_READY:
            {
                let idx : number = msg["idx"] ;
                if ( null == this.mPlayers[idx] )
                {
                    cc.error( "idx player is null , how to set ready " + idx );
                    return true;
                } 
                this.mPlayers[idx].mPlayerBaseData.isReady = true ;
                this.mSceneDelegate.onPlayerReady( idx )  ;
            }
            break ;
            case eMsgType.MSG_PLAYER_LEAVE_ROOM:
            {
                cc.log("leave room ret = " + msg["ret"].Number );   
                if ( msg["ret"] == 0 )
                {
                    cc.director.loadScene(SceneName.Scene_Main);
                }
            }
            break;
            case eMsgType.MSG_ROOM_DO_OPEN:
            {
                this.mBaseData.isRoomOpened = true ;
            }
            break ;
            default:
            return this.onMsgPart2(nMsgID,msg);
        } 
        return true ;
    }
    
    protected onMsgPart2( nMsgID : eMsgType , msg : Object ) : boolean
    {
        switch ( nMsgID )
        {
            case eMsgType.MSG_PLAYER_ACT:
            {
                let nret = msg["ret"];
                if ( nret != 0  )
                {
                    cc.log( "act error nret = " + nret );
                    Prompt.promptText( "操作失败code " + nret );
                    
                    this.mSceneDelegate.onMJActError(); // do refresh self cards ;
                }
            }
            break ;
            case eMsgType.MSG_ROOM_ACT:
            {
                this.processRoomActMsg(msg);
            } 
            break ;
            case eMsgType.MSG_PLAYER_WAIT_ACT_ABOUT_OTHER_CARD:
            {
                this.mBaseData.otherCanActCard = msg["cardNum"];
                this.mSceneDelegate.showActOpts(msg["acts"]);
            }
            break;
            case eMsgType.MSG_ROOM_MQMJ_WAIT_ACT_AFTER_CP:
            case eMsgType.MSG_PLAYER_WAIT_ACT_AFTER_RECEIVED_CARD:
            {
                let vAct : eMJActType[] = [] ;
                let v : Object[] = msg["acts"] ;
                v.forEach( n => vAct.push( n["act"] ) );
                this.mSceneDelegate.showActOpts( vAct ) ;
            }
            break;
            case eMsgType.MSG_ROOM_MQMJ_PLAYER_HU:
            {
                let isZiMo : boolean = msg["isZiMo"] == 1 ;
                let huCard : number  = msg["huCard"] ;
                let acted = new PlayerActedCard();
                acted.eAct = eMJActType.eMJAct_Hu ;
                acted.nTargetCard = huCard ;
                if ( isZiMo )
                {
                    let huIdx : number = msg["detail"]["huIdx"] ;
                    acted.nInvokerIdx = huIdx ;
                    this.mSceneDelegate.onPlayerActed(huIdx,acted);
                }
                else
                {
                    let vHuPlayers : number[] = msg["detail"]["huPlayers"];
                    for ( const v of vHuPlayers )
                    {
                        let idx : number = v["idx"];
                        acted.nInvokerIdx = this.mBaseData.lastChuIdx ;
                        this.mSceneDelegate.onPlayerActed(idx,acted);
                    }
                }
            }
            break;
            case eMsgType.MSG_ROOM_CFMJ_GAME_WILL_START:
            {
                this.willStartGame(msg);
            }
            break;
            case eMsgType.MSG_ROOM_MQMJ_GAME_START:
            {
                this.willStartGame(msg);
                this.startGame(msg);
            }
            break ;
            case eMsgType.MSG_ROOM_SCMJ_GAME_END:
            {
                // this.mSinglResultData.parseResult(msg);
                // for ( const item of this.mPlayers )
                // {
                //     if ( null == item || item.isEmpty() )
                //     {
                //         continue ;
                //     }

                //     let pr = this.mSinglResultData.mResults[item.mPlayerBaseData.svrIdx];
                    
                //     if ( pr.isEmpty() == false )
                //     {
                //         item.mPlayerBaseData.chip = pr.mFinalChip ;
                //         item.mPlayerCard.vHoldCard.length = 0 ;
                //         item.mPlayerCard.vHoldCard = item.mPlayerCard.vHoldCard.concat(pr.mAnHoldCards );
                //     }
                // }
                this.getSingleResultDlgData().parseResult(msg);
                this.mSceneDelegate.onGameEnd() ;
                this.endGame();
            }
            break ;
            case eMsgType.MSG_ROOM_GAME_OVER:
            {
                this.getTotalResultDlgData().parseResult(msg);
                this.mSceneDelegate.onRoomOvered() ;
                this.mBaseData.isRoomOver = true ;
            }
            break ;
            case eMsgType.MSG_ROOM_APPLY_DISMISS_VIP_ROOM:
            {
                this.mBaseData.applyDismissIdx = msg["applyerIdx"];
                this.mBaseData.dimissRoomLeftTime = 300 ;
                if ( this.mBaseData.agreeDismissIdx == null )
                {
                    this.mBaseData.agreeDismissIdx = [];
                }
                this.mBaseData.agreeDismissIdx.length = 0 ;
                this.mBaseData.agreeDismissIdx.push(this.mBaseData.applyDismissIdx);
                this.mSceneDelegate.onApplyDismisRoom( this.mBaseData.applyDismissIdx );
            }
            break ;
            case eMsgType.MSG_ROOM_REPLY_DISSMISS_VIP_ROOM_APPLY:
            {
                this.mSceneDelegate.onReplayDismissRoom( msg["idx"],msg["reply"] == 1 ) ;
            }
            break;
            case eMsgType.MSG_VIP_ROOM_DO_CLOSED:
            {
                this.mSceneDelegate.onRoomDoClosed( msg["isDismiss"] == 1 );
            }
            break ;
            case eMsgType.MSG_ROOM_REFRESH_NET_STATE:
            {
                let idx = msg["idx"];
                let isOnline = msg["state"] == 0 ;
                let p = this.mPlayers[idx] ;
                if ( p == null || p.isEmpty() )
                {
                    cc.error("refresh net state player is null or empty idx = " + idx );
                    break ;
                }
                p.mPlayerBaseData.isOnline = isOnline ;
                this.mSceneDelegate.onPlayerNetStateChanged(idx,isOnline) ;
            }
            break;
            case eMsgType.MSG_ROOM_CHAT_MSG:
            {
                let type : eChatMsgType = msg["type"] ;
                let content = msg["content"] ;
                let idx = msg["playerIdx"] ;
                this.mSceneDelegate.onPlayerChatMsg(idx,type,content) ;
                if ( eChatMsgType.eChatMsg_SysText == type )
                {
                    var player = this.mPlayers[idx];
                    if ( player != null )
                    {
                        var pd = PlayerInfoDataCacher.getInstance().getPlayerInfoByID(player.mPlayerBaseData.uid);
                        //AudioMgr.getInstance().playQuickVoice( pd == null ? eSex.eSex_Male : pd.gender , parseInt(content) ); 
                    }
                } 
            }
            break ;
            case eMsgType.MSG_ROOM_INTERACT_EMOJI:
            {
                let invokerIdx = msg["invokerIdx"] ;
                let targetIdx = msg["targetIdx"] ;
                let emoji = msg["emoji"] ;
                this.mSceneDelegate.onInteractEmoji(invokerIdx,targetIdx,emoji) ;
                //AudioMgr.getInstance().playInteractEmoji(emojiIdx);
            }
            break ;
        }
        return true ; 
    }

    protected onRecievedPlayer( jsInfo : Object, isRealSitDown : boolean ) : boolean
    {
        let idx = jsInfo["idx"];
        if ( this.mPlayers[idx] == null )
        {
            this.mPlayers[idx] = null //new RoomPlayerData();
            this.mPlayers[idx].clear();
            cc.log("find a null pos idx = " + idx);
        } 

        if ( this.mPlayers[idx].isEmpty() == false )
        {
            cc.error("why the same pos , have two player ?");
            return false ;
        }

        this.mPlayers[idx].parsePlayer(jsInfo,this); 
        this.mPlayers[idx].mPlayerBaseData.isSelf = ClientApp.getInstance().getClientPlayerData().getSelfUID() == this.mPlayers[idx].mPlayerBaseData.uid ;
        this.mPlayers[idx].mPlayerBaseData.isSitDownBeforSelf = isRealSitDown == false || this.getSelfIdx() == -1;
        if ( isRealSitDown )
        {
            this.mSceneDelegate.onPlayerSitDown(this.mPlayers[idx]);
        }
        else
        {
            if ( this.mPlayers[idx].mPlayerBaseData.isSelf )
            {
                //this.mIsNeedCheckGPSAndIP = false ;
            }
        }

        // force to request new data to refresh ip and GPS , cacher maybe hours ago  or some days ago , if player do not kill app ;
        PlayerInfoDataCacher.getInstance().getPlayerInfoByID( this.mPlayers[idx].mPlayerBaseData.uid , true );
        return true ;
    }

    protected processRoomActMsg( msg : Object ) : boolean
    {
        // svr : { idx : 0 , actType : 234, card : 23, gangCard : 12, eatWith : [22,33], huType : 23, fanShu : 23  }
        let svrIdx : number = msg["idx"] ;
        let actType : eMJActType = msg["actType"]; 
        let targetCard : number = msg["card"] ;
        let roomPlayer = this.mPlayers[svrIdx];
        let invokerIdx = -1;
        if ( msg["invokerIdx"] != null )
        {
            invokerIdx = msg["invokerIdx"];
        }
        else
        {
            invokerIdx = this.mBaseData.lastChuIdx;
        }
        this.mBaseData.curActSvrIdx = svrIdx ;
        switch ( actType )
        {
            case eMJActType.eMJAct_Mo:
            {
                roomPlayer.mPlayerCard.onMo(targetCard);
                this.mBaseData.leftMJCnt -= 1 ;
                this.mSceneDelegate.onPlayerActMo(svrIdx,targetCard);
            }
            break ;
            case eMJActType.eMJAct_Chu:
            {
                this.mBaseData.lastChuIdx = svrIdx ;
                this.mBaseData.otherCanActCard = targetCard ;
                roomPlayer.mPlayerCard.onChu(targetCard) ;
                this.mSceneDelegate.onPlayerActChu(svrIdx,targetCard);

                var p2 = PlayerInfoDataCacher.getInstance().getPlayerInfoByID( roomPlayer.mPlayerBaseData.uid );
                if ( p2 != null )
                {
                    //AudioMgr.getInstance().playMJ(p2.gender,targetCard);
                }
            }
            break ;
            case eMJActType.eMJAct_Chi:
            {
                let withc : number[] = msg["eatWith"] ;
                let withA = withc[0];
                let withB = withc[1];
                if ( invokerIdx == -1 )
                {
                    cc.error("chi act do not have invoker idx key ");
                    invokerIdx = (svrIdx - 1 + this.mOpts.seatCnt) % this.mOpts.seatCnt ;
                }
                this.mPlayers[invokerIdx].mPlayerCard.removeChu(targetCard);
                let acted = roomPlayer.mPlayerCard.onEat(targetCard,withA,withB,invokerIdx) ;
                this.mSceneDelegate.onPlayerActed(svrIdx,acted);
            }
            break ;
            case eMJActType.eMJAct_Peng:
            {
                if ( invokerIdx == -1 )
                {
                    cc.error("peng act do not have invoker idx key ");
                    break;
                }
                this.mPlayers[invokerIdx].mPlayerCard.removeChu(targetCard);
                let acted = roomPlayer.mPlayerCard.onPeng(targetCard,invokerIdx) ;
                this.mSceneDelegate.onPlayerActed(svrIdx,acted);
            }
            break ;
            case eMJActType.eMJAct_AnGang:
            {
                let acted = roomPlayer.mPlayerCard.onAnGang(targetCard,msg["gangCard"] );
                this.mBaseData.leftMJCnt -= 1 ;
                this.mSceneDelegate.onPlayerActed(svrIdx,acted);
            }
            break;
            case eMJActType.eMJAct_BuGang_Done:
            case eMJActType.eMJAct_BuGang:
            {
                this.mBaseData.leftMJCnt -= 1 ;
                let acted = roomPlayer.mPlayerCard.onBuGang(targetCard,msg["gangCard"] ) ;
                this.mSceneDelegate.onPlayerActed(svrIdx,acted);
            }
            break;
            case eMJActType.eMJAct_MingGang:
            {
                this.mBaseData.leftMJCnt -= 1 ;
                if ( invokerIdx == -1 )
                {
                    cc.error("mingGang act do not have invoker idx key ");
                    break;
                }
                this.mPlayers[invokerIdx].mPlayerCard.removeChu(targetCard);
                let acted = roomPlayer.mPlayerCard.onMingGang(targetCard,msg["gangCard"],invokerIdx) ;
                this.mSceneDelegate.onPlayerActed(svrIdx,acted);
            }
            break;
            case eMJActType.eMJAct_Hu:
            {
                roomPlayer.mPlayerCard.onHu(targetCard);
                if ( invokerIdx == -1 )
                {
                    cc.error("mingGang act do not have invoker idx key ");
                    break;
                }

                if ( invokerIdx != svrIdx )
                {
                    this.mPlayers[invokerIdx].mPlayerCard.removeChu(targetCard);
                }

                let acted = new PlayerActedCard();
                acted.eAct = eMJActType.eMJAct_Hu ;
                acted.nTargetCard = targetCard ;
                acted.nInvokerIdx = invokerIdx ;
                this.mSceneDelegate.onPlayerActed(svrIdx,acted);
            }
            break ;
            case eMJActType.eMJAct_BuHua:
            {
                let acted = roomPlayer.mPlayerCard.onBuHua(targetCard,msg["gangCard"] );
                this.mBaseData.leftMJCnt -= 1 ;
                this.mSceneDelegate.onPlayerActed(svrIdx,acted);
            }
            break;
            default:
            cc.error( "unknown act type = " + actType );
            return ;
        }

        var p = PlayerInfoDataCacher.getInstance().getPlayerInfoByID(roomPlayer.mPlayerBaseData.uid);
        if ( p != null && actType != eMJActType.eMJAct_Chu && actType != eMJActType.eMJAct_Mo )
        {
            //AudioMgr.getInstance().playMJAct(p.gender,actType);
        }
        
    }

    protected willStartGame( jsMsg : Object ) : void
    {
        this.mBaseData.onGameWillStart(jsMsg);
        this.mSceneDelegate.onGameStart();
    }

    protected startGame( jsMsg : Object ) : void
    {
        for ( const item of this.mPlayers )
        {
            if ( null == item || item.isEmpty() )
            {
                continue;
            }

            if ( item.mPlayerBaseData.isSelf )
            {
                let cards : number[] = jsMsg["cards"] ;
                console.log( "do self card = " + cards + "lenght = " + cards.length  );
                item.mPlayerCard.onRecivedHoldCard(cards,cards.length) ;
            }
            else
            {
                item.mPlayerCard.onRecivedHoldCard(null,this.mBaseData.bankerIdx == item.mPlayerBaseData.svrIdx ? 14 : 13 );
            }
        }
        this.mBaseData.curActSvrIdx = this.mBaseData.bankerIdx ;
        this.mSceneDelegate.onDistributedCards();
    }

    protected endGame() : void
    {
        this.mBaseData.onEndGame();
        for ( const item of this.mPlayers )
        {
            if ( null != item && item.isEmpty() == false )
            {
                item.onEndGame();
            }
        }
    }
 
    getPlayerDataByUID( uid : number ) : MJPlayerData
    {
        for ( const item of this.mPlayers )
        {
            if ( item != null && item.isEmpty() == false && item.mPlayerBaseData.uid == uid )
            {
                return item ;
            }
        }
        return null ;
    }

    // protected doChoseDoActAboutOtherCard( act : eMJActType )
    // {
    //     if ( act != eMJActType.eMJAct_Chi )
    //     {
    //         let msg = {} ;
    //         msg["actType"] = act ;
    //         msg["card"] = this.mBaseData.otherCanActCard ;
    //         this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
    //         return ;
    //     }

    //     // check if have eat option ;
    //     var player = this.mPlayers[this.getSelfIdx()];
    //     let vL : eEatType[] = []; 
    //     player.mPlayerCard.getEatOpts(vL,this.mBaseData.otherCanActCard ) ;
    //     if ( vL.length == 1 )
    //     {
    //         this.doChoseEatType(vL[0]);
    //     }
    //     else
    //     {
    //         // show chose eat type result ;
    //         this.mSceneDelegate.showEatOpts( vL,this.mBaseData.otherCanActCard );
    //     }
    // }

    // protected doChoseActAboutRecievedCard( act : eMJActType,chuCard : number = null ) : boolean
    // {
    //     let playerCard = this.mPlayers[this.getSelfIdx()].mPlayerCard;
    //     let card = 0;
    //     switch ( act )
    //     {
    //         case eMJActType.eMJAct_BuGang:
    //         case eMJActType.eMJAct_AnGang:
    //         {
    //             let gangOpts : number[] = [];
    //             playerCard.getGangOpts(gangOpts);
    //             if ( gangOpts.length == 1 )
    //             {
    //                 this.doChosedGangCard(gangOpts[0]) ;
    //             }
    //             else
    //             {
    //                 // show chose gang card dlg ;
    //                 this.mSceneDelegate.showGangOpts(gangOpts);
    //             }
    //         }
    //         return;
    //         case eMJActType.eMJAct_Hu:
    //         case eMJActType.eMJAct_Pass:
    //         {

    //         }
    //         break;
    //         case eMJActType.eMJAct_Chu:
    //         {
    //             card = chuCard ;
    //         }
    //         break;
    //         default:
    //         cc.log( "unknown act for recived card = " + act );
    //         return ;
    //     }

    //     let msg = {} ;
    //     msg["actType"] = act ;
    //     msg["card"] = card ;
    //     this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
    // }

    // doChosedAct( act : eMJActType, chuCard : number = null ) : boolean
    // {
    //     let playerCard = this.mPlayers[this.getSelfIdx()].mPlayerCard;
    //     if ( act == eMJActType.eMJAct_Chu || playerCard.vHoldCard.length % 3 == 2 )
    //     {
    //         return this.doChoseActAboutRecievedCard(act,chuCard);
    //     }
    //     else
    //     {
    //         this.doChoseDoActAboutOtherCard(act);
    //     }

    //     return true;
    // }
    
    protected doChosedGangCard( cardForGang : number ) // must be anGang or bu Gang ;
    {
        let playerCard = this.mPlayers[this.getSelfIdx()].mPlayerCard;

        let type = eMJActType.eMJAct_AnGang;
        let isBuGang = playerCard.isCardBePenged(cardForGang);
        if ( isBuGang )
        {
            type = eMJActType.eMJAct_BuGang;
        }

        let msg = {} ;
        msg["actType"] = type;
        msg["card"] = cardForGang ;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
    }

    protected doChoseEatType( type : eEatType ) : void
    {
        let v : number[] = [];
        let nTargetCard = this.mBaseData.otherCanActCard ;
        switch ( type )
        {
            case eEatType.eEat_Left:
            {
                v.push( nTargetCard + 1 );
                v.push( nTargetCard + 2 );
            }
            break;
            case eEatType.eEat_Middle:
            {
                v.push(nTargetCard - 1 );
                v.push(nTargetCard + 1 );
            }
            break;
            case eEatType.eEat_Righ:
            {
                v.push(nTargetCard - 1 );
                v.push(nTargetCard - 2 );
            }
            break;
        }

        let msg = {} ;
        msg["actType"] = eMJActType.eMJAct_Chi ;
        msg["card"] = this.mBaseData.otherCanActCard ;
        msg["eatWith"] = v;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
    }

    sendRoomMsg( jsMsg : Object , msgID : eMsgType ) : boolean
    {
        jsMsg["dstRoomID"] = this.mBaseData.roomID;
        return this.sendMsg(jsMsg,msgID,Utility.getMsgPortByRoomID(this.mBaseData.roomID),this.mBaseData.roomID );
    }

    reqActList() : void
    {
        let msg = {} ;
        this.sendRoomMsg(msg,eMsgType.MSG_REQ_ACT_LIST ) ;
    }
    
    protected onDisconnected() : void
    {
        Prompt.promptText("网络连接丢失，尝试重连");
    }

    protected onReconectedResult( isSuccess : boolean ) : void
    {
        if ( isSuccess )
        {
            Prompt.promptText("网络重连成功！");
            let nStayRoomID = ClientApp.getInstance().getClientPlayerData().getBaseData().stayInRoomID;
            this.reqRoomInfo( nStayRoomID ) ;
        }
        else
        {
            cc.director.loadScene(SceneName.Scene_Main);
        }
    }

    // public int getAlreadyGangCnt()
    // {
    //     int cnt = 0 ;
    //     foreach (var item in this.mPlayers )
    //     {
    //         if ( item == null || item.isEmpty() )
    //         {
    //             continue ;
    //         } 
    //         cnt += item.getGangCnt();
    //     }
    //     return cnt ;
    // }

    doReplayLastVoice( playerUID : number ) : void
    {
        //VoiceManager.getInstance().replayCacheVoice(playerUID);
    }

    checkIPandGPS() : boolean
    {
        let seatCnt = this.mOpts.seatCnt ;
        if ( this.mOpts.isAvoidCheat == false )
        {
            return true;
        }

        let enableGPS = this.mOpts.isForceGPS ;
        let selfBaseData = ClientApp.getInstance().getClientPlayerData().getBaseData();
        if ( selfBaseData.haveGPSInfo() == false )
        {
            Prompt.promptDlg( "未获得您的GPS信息" );
            return false ;
        }

        for ( let i = 0; i < seatCnt; i++ )
        {
            var p = this.mPlayers[i].mPlayerBaseData ;
            if ( p == null || p.uid == selfBaseData.uid || p.isSitDownBeforSelf == false )
            {
                continue ;
            }

            var data = PlayerInfoDataCacher.getInstance().getPlayerInfoByID( p.uid );
            if ( data == null )
            {
                continue ;
            }

            if ( data.ip == selfBaseData.ip )
            {
                Prompt.promptText( "您的IP与玩家【" + data.name + "】相同"  );
                return false ;
            }

            if ( enableGPS == false )
            {
                continue ;
            }

            let dis = GPSManager.getInstance().caculateDistance( data.GPS_J,data.GPS_W,selfBaseData.GPS_J,selfBaseData.GPS_W) ;
            if ( dis < 100 )
            {
                Prompt.promptText( "您与【" + data.name + "】距离太近(" + dis + ")米" );
                return false;
            }
        }
        return true ;
    }

    // interface IRoomSceneData
    getRoomInfoData() : IRoomInfoData 
    {
        return this ;
    }

    getLayerPlayersData() : ILayerPlayersData 
    {
        return this ;
    }

    getLayerDlgData() : ILayerDlgData 
    {
        return this ;
    }

    getLayerCardsData() : ILayerCardsData 
    {
        return this ;
    }

    getMJCntAfterDistribute() : number 
    {
        return this.mBaseData.initCardCnt - ( this.mOpts.seatCnt * 13 + 1 );
    }

    // interface     IRoomInfoData ;
    getLeftMJCnt() : number 
    {
        return this.mBaseData.leftMJCnt ;
    }

    getRoomID() : number 
    {
        return this.mBaseData.roomID;
    }

    getRule() : string 
    {
        return this.mOpts.getRuleDesc();
    }

    getTotalRound() : string 
    {
        return this.mOpts.roundCnt + "" ;
    }

    getCurRound() : string 
    {
        return (this.mOpts.roundCnt - this.mBaseData.leftCircle ) + "";
    }

    isCircle() : boolean 
    {
        return this.mOpts.isCircle ;
    }

    // interface ILayerPlayersData
    getSelfIdx() : number 
    {
        for ( const item of this.mPlayers )
        {
            if ( item != null && item.isEmpty() == false && item.mPlayerBaseData.isSelf )
            {
                return item.mPlayerBaseData.svrIdx ;
            }
        }
        return -1 ;
    }

    svrIdxToClientIdx(svrIdx : number ) : number 
    {
        let selfIdx = this.getSelfIdx() ;
        if ( -1 == selfIdx )
        {
            return svrIdx ;
        }

        return ( this.mBaseData.getMaxTableSeat() + svrIdx - selfIdx ) % this.mBaseData.getMaxTableSeat() ;
    }

    getPlayerClientIdxByUID( uid : number ) : number 
    {
        for ( const item of this.mPlayers )
        {
            if ( item != null && item.isEmpty() == false && item.mPlayerBaseData.uid == uid )
            {
                return item.svrIdx ;
            }
        }
        return -1 ;
    }

    getBankerIdx() : number 
    {
        return this.mBaseData.bankerIdx ;
    } 

    getPlayersData() : IRoomPlayerData[] 
    {
        return this.mPlayers;
    }

    isShowReadyBtn() : boolean 
    {
        return this.mBaseData.isInGamingState() == false && this.getSelfIdx() != -1 && this.mPlayers[this.getSelfIdx()].isReady == false ;
    }

    reqSetReady() : void 
    {
        let msg = {} ;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_SET_READY) ;
    }

    reqSitDown( svrIdx : number ) : number 
    {
        let msg = {};
        msg["idx"] = svrIdx ;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_SIT_DOWN) ;
        return svrIdx ;
    }

    // interface ILayerCardsData
    // getSelfIdx() : number 
    // {

    // }

    getCurActIdx() : number  // -1 means not in game ;
    {
        if ( this.mBaseData.isInGamingState() == false )
        {
            return -1 ;
        }
        return this.mBaseData.curActSvrIdx ;
    }

    // getBankerIdx() : number 
    // {
    //     return this.mBaseData.bankerIdx ;
    // }

    getPlayerCardItems() : IPlayerCardData[]  // array idx = svridx , null == empty ;
    {
        return this.mPlayers ;
    }

    isReplay() : boolean 
    {
        return false ;
    }

    // interface ILayerDlgData
    isShowDismissDlg() : boolean 
    {
        return this.mBaseData.applyDismissIdx != -1 ;
    }

    isSeatFull() : boolean 
    {
        let cnt = 0 ;
        for ( let v of this.mPlayers )
        {
            if ( v == null || v.isEmpty() )
            {
                continue ;
            }
            ++cnt ;
        }
        return cnt == this.mOpts.seatCnt ;
    }

    getDismissDlgData() : IDissmissDlgData 
    {
        return this ;
    }

    getPlayerUIDByIdx( idx : number ) : number 
    {
        if ( idx < 0 || idx >= this.mPlayers.length || this.mPlayers[idx] == null )
        {
            return -1 ;
        }
        return this.mPlayers[idx].uid ;
    }

    getGangOpts() : number[] 
    {
        let v : number[] = [] ;
        let cards = this.mPlayers[this.getSelfIdx()].mPlayerCard ;
        if ( cards.vHoldCard.length % 3 == 1 )
        {
            v.push( this.mBaseData.otherCanActCard );
            return v;
        }
        
        this.mPlayers[this.getSelfIdx()].mPlayerCard.getGangOpts(v) ;
        return v ;
    }

    getEatOpts() : eEatType[] 
    {
        let v : eEatType[] = [] ;
        this.mPlayers[this.getSelfIdx()].mPlayerCard.getEatOpts(v,this.getEatTargetCard());
        return v ;
    }

    getEatTargetCard() : number 
    {
        return this.mBaseData.otherCanActCard ;
    }

    getLocationDlgData() : ILocationDlgData 
    {
        return this ;
    }

    getSingleResultDlgData() : ISingleResultDlgData 
    {
        if ( null == this.mSinglResultData )
        {
            this.mSinglResultData = new ResultSingleData();
            (this.mSinglResultData as ResultSingleData).init(this);
        }
        return this.mSinglResultData ;
    }

    getTotalResultDlgData() : ITotalResultDlgData 
    {
        if ( this.mTotalResultData == null )
        {
            this.mTotalResultData = new ResultTotalData();
            (this.mTotalResultData as ResultTotalData).init(this);
        }
        return this.mTotalResultData ;
    }

    reqAct( act : eMJActType , detail : any ) : void  // detail : gang card or eat type ; 
    {
        switch ( act )
        {
            case eMJActType.eMJAct_Chi:
            {
                this.doChoseEatType(detail);
            }
            break;
            case eMJActType.eMJAct_Peng:
            {
                let msg = {} ;
                msg["actType"] = act;
                msg["card"] = this.mBaseData.otherCanActCard ;
                this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
            }
            break ;
            case eMJActType.eMJAct_AnGang:
            case eMJActType.eMJAct_BuGang:
            case eMJActType.eMJAct_MingGang:
            {
                let playerCard = this.mPlayers[this.getSelfIdx()].mPlayerCard;
                if ( playerCard.vHoldCard.length % 3 == 2 )
                {
                    this.doChosedGangCard(detail) ;
                }
                else
                {
                    let msg = {} ;
                    msg["actType"] = eMJActType.eMJAct_MingGang;
                    msg["card"] = this.mBaseData.otherCanActCard ;
                    this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
                }
            }
            break ;
            case eMJActType.eMJAct_Hu:
            case eMJActType.eMJAct_Pass:
            {
                let msg = {} ;
                msg["actType"] = act;
                msg["card"] = this.mBaseData.otherCanActCard ;
                this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
            }
            break ;
            case eMJActType.eMJAct_Chu:
            {
                let msg = {} ;
                msg["actType"] = act;
                msg["card"] = detail ;
                this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
            }
            break ;
            default :
            return ;
        }
    }

    reqDoReady() : void 
    {
        this.reqSetReady();
    }

    reqSendInteractiveEmoji( targetUID : number , emojiName : string ) : void 
    {
        let self = this.getSelfIdx();
        if ( self == -1 )
        {
            Prompt.promptText( "您没有坐下，不能发言。" );
            return ;
        }

        let targetIdx = this.getPlayerClientIdxByUID(targetUID);
        if ( targetIdx == self )
        {
            Prompt.promptText( "互动表情不能发给自己。" );
            return ;
        }
        
        let msg = {};
        msg["targetIdx"] = targetIdx ;
        msg["emoji"] = emojiName ;
        this.sendRoomMsg( msg,eMsgType.MSG_PLAYER_INTERACT_EMOJI ) ;
    }

    reqSendChat( type : eChatMsgType , content : string ) : void 
    {
        if ( this.getSelfIdx() == -1 )
        {
            Prompt.promptText( "您没有坐下，不能发言。" );
            return ;
        }

        let msg = {};
        msg["type"] = type ;
        msg["content"] = content ;
        this.sendRoomMsg( msg,eMsgType.MSG_PLAYER_CHAT_MSG ) ;
    }

    reqApplyDismiss() : void 
    {
        // send msg ;
        let msg = {} ;
        this.sendRoomMsg(msg,eMsgType.MSG_APPLY_DISMISS_VIP_ROOM) ;
    }

    reqApplyLeave() : void 
    {
        let msg = {} ;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_LEAVE_ROOM) ;
    }

    // interface IDissmissDlgData
    get applyPlayerIdx() : number 
    {
        return this.mBaseData.applyDismissIdx ;
    }

    get applyPlayerUID() : number 
    {
        return this.mPlayers[this.applyPlayerIdx].mPlayerBaseData.uid ;
    }

    get playerCnt() : number 
    {
        let cnt = 0 ;
        for ( let v of this.mPlayers )
        {
            if ( v == null || v.isEmpty() )
            {
                continue ;
            }
            ++cnt ;
        }
        return cnt ;
    }

    get seatCnt(): number 
    {
        return this.mOpts.seatCnt ;
    }

    // getPlayerUIDByIdx( idx : number ) : number 
    // {

    // }
    getAgreedPlayerIdxs() : number[] 
    {
        return this.mBaseData.agreeDismissIdx ;
    }

    isSelfResponed() : boolean 
    {
        let selfIdx = this.getSelfIdx();
        for ( let v of this.mBaseData.agreeDismissIdx )
        {
            if ( v == selfIdx )
            {
                return true ;
            }
        }

        return false ;
    }

    getLeftTime() : number 
    {
        return this.mBaseData.dimissRoomLeftTime ;
    }

    reqRespone( isAgree : boolean ) : number 
    {
        // send msg ;
        let msg = {} ;
        msg["reply"] = isAgree ? 1 : 0 ;
        this.sendRoomMsg(msg,eMsgType.MSG_REPLY_DISSMISS_VIP_ROOM_APPLY) ;
        return 0 ;
    }

    // interface IlocationDlgData
    //seatCnt : number ;
    //getSelfIdx() : number ;
    getPlayerUIDs() : number[]   // when empty , uid = -1 ; , array with server idx ;
    {
        let vIDs : number[] = [] ;
        for ( let v of this.mPlayers )
        {
            if ( v == null || v.isEmpty() )
            {
                vIDs.push( -1 );
            }
            else
            {
                vIDs.push( v.uid );
            }
        }

        return vIDs ;
    }
}
