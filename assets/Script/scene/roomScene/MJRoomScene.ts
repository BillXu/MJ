import MJRoomData from "./roomData/MJRoomData";
import IRoomDataDelegate from "./roomData/IRoomDataDelegate";
import MJRoomBaseData from "./roomData/MJRoomBaseData";
import MJPlayerData from "./roomData/MJPlayerData";
import { eChatMsgType, eMJActType, eEatType } from "./roomDefine";
import ResultSingleData from "./roomData/ResultSingleData";
import ResultTotalData from "./roomData/ResultTotalData";
import PlayerInfoData from "../../clientData/playerInfoData";

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
export default class MJRoomScene extends cc.Component implements IRoomDataDelegate {

    mRoomData : MJRoomData = null ;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onRecivedRoomInfo( info : MJRoomBaseData ) : void 
    {

    }

    onPlayerSitDown( p : MJPlayerData ) : void 
    {

    }

    onRecivedAllPlayers( vPlayers : MJPlayerData[] ) : void
    {

    }

    onMJActError() : void
    {

    }

    onPlayerNetStateChanged( playerIdx : number , isOnline : boolean ) : void 
    {

    }

    onPlayerChatMsg( playerIdx : number , type : eChatMsgType , strContent : string ) : void
    {

    }

    onInteractEmoji( InvokeIdx : number , targetIdx : number , emojiIdx : number ) : void 
    {

    }

    onPlayerStandUp( idx : number ) : void 
    {

    }

    onPlayerReady( idx : number ) : void 
    {

    }

    onDistributedCards() : void 
    {

    }

    onPlayerActMo( idx : number , card : number ) : void 
    {

    }

    onPlayerActChu( idx : number , card : number ) : void 
    {

    }

    showActOptsAboutOtherCard( vActs : eMJActType[] ) : void 
    {

    }

    onPlayerActChi( idx : number , card : number , withA : number , withB : number, invokeIdx : number ) : void 
    {

    }

    onPlayerActPeng( idx : number , card : number, invokeIdx : number ) : void 
    {

    }

    onPlayerActMingGang( idx : number , card : number, invokeIdx : number, newCard : number ) : void 
    {

    }

    onPlayerActAnGang( idx : number , card : number , NewCard : number ) : void 
    {

    }

    onPlayerActBuGang( idx : number , card : number , NewCard : number ) : void 
    {

    }

    onPlayerActHu( idx : number, card : number , invokeIdx : number ) : void 
    {

    }

    showActOptsWhenRecivedCards( vActs : eMJActType[] ) : void 
    {

    }

    showEatOpts( vEatOpts : eEatType[] , ntargetCard : number ) : void 
    {
        
    }

    showGangOpts( vGangOpts : number[] ) : void 
    {

    }


    onGameStart() : void 
    {

    }

    onGameEnd( result : ResultSingleData  ) : void 
    {
        
    }

    onRoomOvered( result : ResultTotalData ) : void 
    {
        
    }

    onApplyDismisRoom( idx : number ) : void 
    {

    }

    onReplayDismissRoom( idx : number , isAgree : boolean ) : void 
    {

    }

    onRoomDoClosed( isDismissed : boolean ) : void 
    {

    }

    onRecivedPlayerBrifeData( infoData : PlayerInfoData  ) : void 
    {
        
    }

    onExchangedSeat() : void 
    {

    }
}
