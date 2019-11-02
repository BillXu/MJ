import MJRoomBaseData from "./MJRoomBaseData";
import MJPlayerData from "./MJPlayerData";
import { eChatMsgType, eMJActType } from "../roomDefine";
import PlayerInfoData from "../../../clientData/playerInfoData";
import ResultTotalData from "./ResultTotalData";
import IResultSingleData from "../../roomSceneSZ/layerDlg/dlgResultSingle/IResultSingleDate";
import { PlayerActedCard } from "./MJPlayerCardData";
import { IRoomPlayerData } from "../IRoomSceneData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

 export default interface IRoomDataDelegate {

    onRecivedRoomInfo( info : MJRoomBaseData ) : void ;
    onRecivedAllPlayers( vPlayers : IRoomPlayerData[] ) : void;
    
    onPlayerNetStateChanged( playerIdx : number , isOnline : boolean ) : void ;
    onPlayerChatMsg( playerIdx : number , type : eChatMsgType , strContent : string ) : void ;
    onInteractEmoji( InvokeIdx : number , targetIdx : number , emoji : string ) : void ;
    onPlayerSitDown( p : IRoomPlayerData ) : void;
    onPlayerStandUp( idx : number ) : void ;
    onPlayerReady( idx : number ) : void ;

    onDistributedCards() : void ;
    onPlayerActMo( idx : number , card : number ) : void ;
    onPlayerActChu( idx : number , card : number ) : void ;
    showActOpts( vActs : eMJActType[] ) : void ;
    onPlayerActed( idx : number , actedData : PlayerActedCard );
    onMJActError() : void;

    onGameStart() : void ;
    onGameEnd() : void ; 
    onRoomOvered() : void ;
    onApplyDismisRoom( idx : number ) : void ;
    onReplayDismissRoom( idx : number , isAgree : boolean ) : void ;
    onRoomDoClosed( isDismissed : boolean ) : void ;
    onRecivedPlayerBrifeData( infoData : PlayerInfoData  ) : void ;
    onExchangedSeat() : void ;
}
