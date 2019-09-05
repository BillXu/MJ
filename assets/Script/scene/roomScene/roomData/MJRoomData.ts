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
import ResultSingleData from "./ResultSingleData";
import ResultTotalData from "./ResultTotalData";

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
export default abstract class MJRoomData extends IModule {

    mOpts : IOpts = null ;
    mBaseData : MJRoomBaseData = null ;
    mPlayers : MJPlayerData[] = [] ;
    mSceneDelegate : IRoomDataDelegate = null ; 
    mSinglResultData : ResultSingleData = new ResultSingleData();
    mTotalResultData : ResultTotalData = new ResultTotalData();

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
                var vMsgPlayers : Object[] = msg["players"] ;
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
                this.mSceneDelegate.showActOptsAboutOtherCard(msg["acts"]);
            }
            break;
            case eMsgType.MSG_ROOM_MQMJ_WAIT_ACT_AFTER_CP:
            case eMsgType.MSG_PLAYER_WAIT_ACT_AFTER_RECEIVED_CARD:
            {
                let vAct : eMJActType[] = [] ;
                let v : Object[] = msg["acts"] ;
                v.forEach( n => vAct.push( n["act"] ) );
                this.mSceneDelegate.showActOptsWhenRecivedCards( vAct ) ;
            }
            break;
            case eMsgType.MSG_ROOM_MQMJ_PLAYER_HU:
            {
                let isZiMo : boolean = msg["isZiMo"] == 1 ;
                let huCard : number  = msg["huCard"] ;
                if ( isZiMo )
                {
                    let huIdx : number = msg["detail"]["huIdx"] ;
                    this.mSceneDelegate.onPlayerActHu(huIdx,huCard,huIdx );
                }
                else
                {
                    let vHuPlayers : number[] = msg["detail"]["huPlayers"];
                    for ( const v of vHuPlayers )
                    {
                        let idx : number = v["idx"];
                        this.mSceneDelegate.onPlayerActHu(idx,huCard,this.mBaseData.lastChuIdx ) ;
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
                this.mSinglResultData.parseResult(msg);
                for ( const item of this.mPlayers )
                {
                    if ( null == item || item.isEmpty() )
                    {
                        continue ;
                    }

                    let pr = this.mSinglResultData.mResults[item.mPlayerBaseData.svrIdx];
                    
                    if ( pr.isEmpty() == false )
                    {
                        item.mPlayerBaseData.chip = pr.mFinalChip ;
                        item.mPlayerCard.vHoldCard.length = 0 ;
                        item.mPlayerCard.vHoldCard = item.mPlayerCard.vHoldCard.concat(pr.mAnHoldCards );
                    }
                }

                this.mSceneDelegate.onGameEnd(this.mSinglResultData) ;
                this.endGame();
            }
            break ;
            case eMsgType.MSG_ROOM_GAME_OVER:
            {
                this.mTotalResultData.parseResult(msg);
                this.mSceneDelegate.onRoomOvered( this.mTotalResultData ) ;
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

        this.mPlayers[idx].parsePlayer(jsInfo); 
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
                roomPlayer.mPlayerCard.onEat(targetCard,withA,withB,invokerIdx) ;
                this.mPlayers[invokerIdx].mPlayerCard.removeChu(targetCard);
                this.mSceneDelegate.onPlayerActChi(svrIdx,targetCard,withA,withB, invokerIdx ) ;
            }
            break ;
            case eMJActType.eMJAct_Peng:
            {
                if ( invokerIdx == -1 )
                {
                    cc.error("peng act do not have invoker idx key ");
                    break;
                }
                roomPlayer.mPlayerCard.onPeng(targetCard,invokerIdx) ;
                this.mPlayers[invokerIdx].mPlayerCard.removeChu(targetCard);
                this.mSceneDelegate.onPlayerActPeng(svrIdx,targetCard,invokerIdx ) ;
            }
            break ;
            case eMJActType.eMJAct_AnGang:
            {
                roomPlayer.mPlayerCard.onAnGang(targetCard,msg["gangCard"] );
                this.mBaseData.leftMJCnt -= 1 ;
                this.mSceneDelegate.onPlayerActAnGang(svrIdx,targetCard,msg["gangCard"] );
            }
            break;
            case eMJActType.eMJAct_BuGang_Done:
            case eMJActType.eMJAct_BuGang:
            {
                this.mBaseData.leftMJCnt -= 1 ;
                roomPlayer.mPlayerCard.onBuGang(targetCard,msg["gangCard"] ) ;
                this.mSceneDelegate.onPlayerActBuGang(svrIdx,targetCard,msg["gangCard"] );
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
                roomPlayer.mPlayerCard.onMingGang(targetCard,msg["gangCard"],invokerIdx) ;
                this.mPlayers[invokerIdx].mPlayerCard.removeChu(targetCard);
                this.mSceneDelegate.onPlayerActMingGang(svrIdx,targetCard,invokerIdx,msg["gangCard"] );
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
                this.mSceneDelegate.onPlayerActHu(svrIdx,targetCard,invokerIdx ) ;
            }
            break ;
            case eMJActType.eMJAct_BuHua:
            {
                roomPlayer.mPlayerCard.onBuHua(targetCard,msg["gangCard"] );
                this.mBaseData.leftMJCnt -= 1 ;
                this.mSceneDelegate.onPlayerActBuHua(svrIdx,targetCard,msg["gangCard"] );
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

    protected doChoseDoActAboutOtherCard( act : eMJActType )
    {
        if ( act != eMJActType.eMJAct_Chi )
        {
            let msg = {} ;
            msg["actType"] = act ;
            msg["card"] = this.mBaseData.otherCanActCard ;
            this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
            return ;
        }

        // check if have eat option ;
        var player = this.mPlayers[this.getSelfIdx()];
        let vL : eEatType[] = []; 
        player.mPlayerCard.getEatOpts(vL,this.mBaseData.otherCanActCard ) ;
        if ( vL.length == 1 )
        {
            this.doChoseEatType(vL[0]);
        }
        else
        {
            // show chose eat type result ;
            this.mSceneDelegate.showEatOpts( vL,this.mBaseData.otherCanActCard );
        }
    }

    protected doChoseActAboutRecievedCard( act : eMJActType,chuCard : number = null ) : boolean
    {
        let playerCard = this.mPlayers[this.getSelfIdx()].mPlayerCard;
        let card = 0;
        switch ( act )
        {
            case eMJActType.eMJAct_BuGang:
            case eMJActType.eMJAct_AnGang:
            {
                let gangOpts : number[] = [];
                playerCard.getGangOpts(gangOpts);
                if ( gangOpts.length == 1 )
                {
                    this.doChosedGangCard(gangOpts[0]) ;
                }
                else
                {
                    // show chose gang card dlg ;
                    this.mSceneDelegate.showGangOpts(gangOpts);
                }
            }
            return;
            case eMJActType.eMJAct_Hu:
            case eMJActType.eMJAct_Pass:
            {

            }
            break;
            case eMJActType.eMJAct_Chu:
            {
                card = chuCard ;
            }
            break;
            default:
            cc.log( "unknown act for recived card = " + act );
            return ;
        }

        let msg = {} ;
        msg["actType"] = act ;
        msg["card"] = card ;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_ACT) ;
    }

    doChosedAct( act : eMJActType, chuCard : number = null ) : boolean
    {
        let playerCard = this.mPlayers[this.getSelfIdx()].mPlayerCard;
        if ( act == eMJActType.eMJAct_Chu || playerCard.vHoldCard.length % 3 == 2 )
        {
            return this.doChoseActAboutRecievedCard(act,chuCard);
        }
        else
        {
            this.doChoseDoActAboutOtherCard(act);
        }

        return true;
    }
    
    doChosedGangCard( cardForGang : number ) // must be anGang or bu Gang ;
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

    doChoseEatType( type : eEatType ) : void
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

    doClickedSitDown( svrIdx : number ) : void
    {
        let msg = {};
        msg["idx"] = svrIdx ;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_SIT_DOWN) ;
    }

    doApplyLeave() : void
    {
        let msg = {} ;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_LEAVE_ROOM) ;
    }

    doApplyDismissRoom() : void
    {
        // send msg ;
        let msg = {} ;
        this.sendRoomMsg(msg,eMsgType.MSG_APPLY_DISMISS_VIP_ROOM) ;
    }

    doReplyDismiss( isAgree : boolean )
    {
        // send msg ;
        let msg = {} ;
        msg["reply"] = isAgree ? 1 : 0 ;
        this.sendRoomMsg(msg,eMsgType.MSG_REPLY_DISSMISS_VIP_ROOM_APPLY) ;
    }

    doReady()
    {
        let msg = {} ;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_SET_READY) ;
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

    doSendPlayerChat( type : eChatMsgType , strContent : string )
    {
        if ( this.getSelfIdx() == -1 )
        {
            Prompt.promptText( "您没有坐下，不能发言。" );
            return ;
        }

        let msg = {};
        msg["type"] = type ;
        msg["content"] = strContent ;
        this.sendRoomMsg( msg,eMsgType.MSG_PLAYER_CHAT_MSG ) ;
    }

    doSendPlayerInteractEmoji( targetIdx : number , emojiName : string )
    {
        let self = this.getSelfIdx();
        if ( self == -1 )
        {
            Prompt.promptText( "您没有坐下，不能发言。" );
            return ;
        }

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

    svrIdxToClientIdx( svrIdx : number ) : number 
    {
        let selfIdx = this.getSelfIdx() ;
        if ( -1 == selfIdx )
        {
            return svrIdx ;
        }

        return ( this.mBaseData.getMaxTableSeat() + svrIdx - selfIdx ) % this.mBaseData.getMaxTableSeat() ;
    }
}
