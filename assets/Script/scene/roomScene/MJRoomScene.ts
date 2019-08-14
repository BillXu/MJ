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
import ILayerPlayerCard from "./layerCards/ILayerPlayerCard";

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

    mLayerPlayerCard3d : ILayerPlayerCard = null ;
    mLayerPlayerCard2d : ILayerPlayerCard = null ;
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

    get layerPlayerCards() : ILayerPlayerCard
    {
        return this.mLayerPlayerCard3d ;
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
        this.layerPlayers.onPlayerSitDown( p ) ;
        if ( p.mPlayerBaseData.svrIdx == this.mRoomData.getSelfIdx() )
        {
            this.layerPlayerCards.setBottomSvrIdx( p.mPlayerBaseData.svrIdx );
        }
    }

    onRecivedAllPlayers( vPlayers : MJPlayerData[] ) : void
    {
        this.mLayerInfo.refresh( this.mRoomData );
        this.mLayerDlg.refresh( this.mRoomData );
        this.mLayerPlayers.refresh( this.mRoomData );
        this.layerPlayerCards.refresh( this.mRoomData );
    }

    onMJActError() : void
    {
        this.layerPlayerCards.onMJActError();
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
        this.layerPlayerCards.onDistributedCards();
    }

    onPlayerActMo( idx : number , card : number ) : void 
    {
        this.layerPlayerCards.onPlayerActMo( idx , card ) ;
    }

    onPlayerActChu( idx : number , card : number ) : void 
    {
        this.layerPlayerCards.onPlayerActChu( idx , card ) ;
    }

    showActOptsAboutOtherCard( vActs : eMJActType[] ) : void 
    {
        this.layerDlg.showDlgActOpts(vActs) ;
    }

    onPlayerActChi( idx : number , card : number , withA : number , withB : number, invokeIdx : number ) : void 
    {
        this.layerPlayerCards.onPlayerActChi( idx, card, withA, withB,invokeIdx ) ;
    }

    onPlayerActPeng( idx : number , card : number, invokeIdx : number ) : void 
    {
        this.layerPlayerCards.onPlayerActPeng( idx, card, invokeIdx ) ;
    }

    onPlayerActMingGang( idx : number , card : number, invokeIdx : number, newCard : number ) : void 
    {
        this.layerPlayerCards.onPlayerActMingGang( idx, card, invokeIdx, newCard ) ;
    }

    onPlayerActAnGang( idx : number , card : number , NewCard : number ) : void 
    {
        this.layerPlayerCards.onPlayerActAnGang( idx, card, NewCard ) ;
    }

    onPlayerActBuGang( idx : number , card : number , NewCard : number ) : void 
    {
        this.layerPlayerCards.onPlayerActBuGang( idx, card, NewCard );
    }

    onPlayerActHu( idx : number, card : number , invokeIdx : number ) : void 
    {
        this.layerPlayerCards.onPlayerActHu( idx, card, invokeIdx );
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
        this.layerPlayerCards.onGameStart();
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
        this.layerPlayerCards.refresh( this.mRoomData );
    }

    // not delegate funciton 
    showDlgPlayerInfo( targetPlayerUID : number )
    {
        this.layerDlg.showDlgPlayerInfo( targetPlayerUID ) ;
    }
}
