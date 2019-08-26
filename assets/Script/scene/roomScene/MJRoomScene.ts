import MJRoomData from "./roomData/MJRoomData";
import IRoomDataDelegate from "./roomData/IRoomDataDelegate";
import MJRoomBaseData from "./roomData/MJRoomBaseData";
import MJPlayerData from "./roomData/MJPlayerData";
import { eChatMsgType, eMJActType, eEatType } from "./roomDefine";
import ResultSingleData from "./roomData/ResultSingleData";
import ResultTotalData from "./roomData/ResultTotalData";
import PlayerInfoData from "../../clientData/playerInfoData";
import LayerRoomInfo from "./layerRoomInfo/LayerRoomInfo";
import LayerDlg from "./layerDlg/LayerDlg";
import LayerPlayers from "./layerPlayers/LayerPlayers";
import ClientApp from "../../globalModule/ClientApp";
import { SceneName } from "../../common/clientDefine";
import Prompt from "../../globalModule/Prompt";
import LayerPlayerCards from "./layerCards/LayerPlayerCards";
import MJFactory from "./layerCards/cards3D/MJFactory";

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

    @property(MJRoomData)
    mRoomData : MJRoomData = null ;

    @property(cc.Node)
    mLayerInfo : cc.Node = null ;

    @property(cc.Node)
    mLayerDlg : cc.Node = null ;

    @property(cc.Node)
    mLayerPlayers : cc.Node = null ;

    @property(cc.Node)
    mLayerPlayerCard : cc.Node = null ;
    // LIFE-CYCLE CALLBACKS:

    get layerRoomInfo() : LayerRoomInfo
    {
        return this.mLayerInfo.getComponent(LayerRoomInfo) ;
    }

    get layerDlg() : LayerDlg
    {
        return this.mLayerDlg.getComponent(LayerDlg) ;
    }

    get layerPlayers() : LayerPlayers
    {
        return this.mLayerPlayers.getComponent(LayerPlayers) ;
    }

    get layerPlayerCards() : LayerPlayerCards
    {
        return this.mLayerPlayerCard.getComponent(LayerPlayerCards) ;
    }
     
    onLoad () 
    {
        // request info ;
        let self = this ;
        //let roomID = ClientApp.getInstance().getClientPlayerData().getBaseData().stayInRoomID;
        //cc.systemEvent.once( MJFactory.EVENT_FINISH_LOAD_CARD,()=>{ self.mRoomData.reqRoomInfo( roomID ) ;} ) ;
    }

    start () {
        //this.mRoomData.mSceneDelegate = this ;
        //this.layerPlayers.mScene = this ;
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
        this.layerRoomInfo.refresh( this.mRoomData );
        this.layerDlg.refresh( this.mRoomData );
        this.layerPlayers.refresh( this.mRoomData );
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
        let self = this;
        self.layerRoomInfo.leftMJCardCnt = this.mRoomData.mBaseData.initCardCnt;
        this.mRoomData.mPlayers.forEach( ( player : MJPlayerData )=>{ 
            if ( player == null || player.isEmpty() )
            {
                return ;
            }
            self.layerRoomInfo.leftMJCardCnt -= player.mPlayerCard.vHoldCard.length ;
        } ) ;
    }

    onPlayerActMo( idx : number , card : number ) : void 
    {
        this.layerPlayerCards.onPlayerActMo( idx , card ) ;
        --this.layerRoomInfo.leftMJCardCnt;
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
        --this.layerRoomInfo.leftMJCardCnt;
    }

    onPlayerActAnGang( idx : number , card : number , NewCard : number ) : void 
    {
        this.layerPlayerCards.onPlayerActAnGang( idx, card, NewCard ) ;
        --this.layerRoomInfo.leftMJCardCnt;
    }

    onPlayerActBuGang( idx : number , card : number , NewCard : number ) : void 
    {
        this.layerPlayerCards.onPlayerActBuGang( idx, card, NewCard );
        --this.layerRoomInfo.leftMJCardCnt;
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
        this.layerRoomInfo.onGameStart();
        this.layerDlg.onGameStart();
        this.layerPlayers.onGameStart();
        this.layerPlayerCards.onGameStart();
    }

    onGameEnd( result : ResultSingleData  ) : void 
    {
        this.layerDlg.showDlgResultSingle( result ) ;
        this.layerPlayers.refreshPlayerChips();
        this.layerPlayerCards.showHoldCardAfterGameEnd() ;
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
        if ( isDismissed )
        {
            Prompt.promptText("房间已经解散");
        }

        if ( this.mRoomData.mBaseData.isRoomOpened == false )
        {
            cc.director.loadScene( SceneName.Scene_Main );
        }
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
