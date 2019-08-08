import MJRoomData from "./roomData/MJRoomData";
import IRoomDataDelegate from "./roomData/IRoomDataDelegate";
import MJRoomBaseData from "./roomData/MJRoomBaseData";
import MJPlayerData from "./roomData/MJPlayerData";
import { eChatMsgType, eMJActType, eEatType } from "./roomDefine";
import ResultSingleData from "./roomData/ResultSingleData";
import ResultTotalData from "./roomData/ResultTotalData";
import PlayerInfoData from "../../clientData/playerInfoData";
import ILayer from "./ILayer";
import LayerRoomInfo from "./layerRoomInfo/LayerRoomInfo";
import LayerDlg from "./layerDlg/LayerDlg";
import LayerPlayers from "./layerPlayers/LayerPlayers";

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

    mLayerInfo : ILayer = null ;
    mLayerDlg : ILayer = null ;
    mLayerPlayers : ILayer = null ;
    // LIFE-CYCLE CALLBACKS:

    get layerRoomInfo() : LayerRoomInfo
    {
        return <LayerRoomInfo>this.mLayerInfo ;
    }

    get layerDlg() : LayerDlg
    {
        return <LayerDlg>this.mLayerDlg ;
    }

    get layerPlayers() : LayerPlayers
    {
        return <LayerPlayers>this.mLayerPlayers ;
    }
     
    onLoad () 
    {
        // create roomData here 
        this.mRoomData.init();
        // request info ;
    }

    start () {
        this.layerPlayers.mScene = this ;
    }

    onDestroy()
    {
        this.mRoomData.onDestroy();
    }

    onRecivedRoomInfo( info : MJRoomBaseData ) : void 
    {

    }

    onPlayerSitDown( p : MJPlayerData ) : void 
    {

    }

    onRecivedAllPlayers( vPlayers : MJPlayerData[] ) : void
    {
        this.mLayerInfo.refresh( this.mRoomData );
        this.mLayerDlg.refresh( this.mRoomData );
        this.mLayerPlayers.refresh( this.mRoomData );
    }

    onMJActError() : void
    {

    }

    onPlayerNetStateChanged( playerIdx : number , isOnline : boolean ) : void 
    {
        this.layerPlayers.onPlayerNetStateChanged( playerIdx,isOnline ) ;
    }

    onPlayerChatMsg( playerIdx : number , type : eChatMsgType , strContent : string ) : void
    {
        this.layerPlayers.onPlayerChatMsg(playerIdx,type,strContent ) ;
    }

    onInteractEmoji( InvokeIdx : number , targetIdx : number , emoji : string ) : void 
    {
        this.layerPlayers.onPlayerInteractEmoji( InvokeIdx,targetIdx,emoji );
    }

    onPlayerStandUp( idx : number ) : void 
    {
        this.layerPlayers.onPlayerStandUp( idx );
    }

    onPlayerReady( idx : number ) : void 
    {
        this.layerPlayers.onPlayerReady( idx ) ;
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
        this.layerDlg.showDlgActOpts(vActs) ;
    }

    showEatOpts( vEatOpts : eEatType[] , ntargetCard : number ) : void 
    {
        this.layerDlg.showDlgEatOpts( vEatOpts,ntargetCard ) ;
    }

    showGangOpts( vGangOpts : number[] ) : void 
    {
        this.layerDlg.showDlgGangOpts( vGangOpts ) ;
    }


    onGameStart() : void 
    {
        this.mLayerInfo.onGameStart();
        this.mLayerDlg.onGameStart();
        this.mLayerPlayers.onGameStart();
    }

    onGameEnd( result : ResultSingleData  ) : void 
    {
        this.layerDlg.showDlgResultSingle( result ) ;
    }

    onRoomOvered( result : ResultTotalData ) : void 
    {
        this.layerDlg.showDlgResultTotal( result ,this.mRoomData ) ;
    }

    onApplyDismisRoom( idx : number ) : void 
    {
        this.layerDlg.showDlgDismiss( this.mRoomData ) ;
    }

    onReplayDismissRoom( idx : number , isAgree : boolean ) : void 
    {
        this.layerDlg.onReplayDismissRoom( idx,isAgree ) ;
    }

    onRoomDoClosed( isDismissed : boolean ) : void 
    {

    }

    onRecivedPlayerBrifeData( infoData : PlayerInfoData  ) : void 
    {
        
    }

    onExchangedSeat() : void 
    {
        this.layerPlayers.refresh( this.mRoomData ) ;
    }

    // not delegate funciton 
    showDlgPlayerInfo( targetPlayerUID : number )
    {
        this.layerDlg.showDlgPlayerInfo( targetPlayerUID ) ;
    }
}
