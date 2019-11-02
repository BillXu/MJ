import MJRoomData from "./roomData/MJRoomData";
import IRoomDataDelegate from "./roomData/IRoomDataDelegate";
import MJRoomBaseData from "./roomData/MJRoomBaseData";
import MJPlayerData from "./roomData/MJPlayerData";
import { eChatMsgType, eMJActType, eEatType } from "./roomDefine";
import ResultTotalData from "./roomData/ResultTotalData";
import PlayerInfoData from "../../clientData/playerInfoData";
import ClientApp from "../../globalModule/ClientApp";
import { SceneName } from "../../common/clientDefine";
import Prompt from "../../globalModule/Prompt";
import MJFactory from "./layerCards/cards3D/MJFactory";
import MJCardFactory2D from "./layerCards/cards2D/MJCardFactory2D";
import IResultSingleData from "../roomSceneSZ/layerDlg/dlgResultSingle/IResultSingleDate";
import { PlayerActedCard } from "./roomData/MJPlayerCardData";
import ILayerCards from "./ILayerCards";
import IRoomSceneData, { IRoomPlayerData } from "./IRoomSceneData";
import ILayerRoomInfo from "./ILayerRoomInfo";
import ILayerPlayers from "./ILayerPlayers";
import ILayerDlg from "./ILayerDlg";
import LayerPlayerCards from "./layerCards/LayerPlayerCards";
import LayerPlayers from "./layerPlayers/LayerPlayers";
import LayerDlg from "./layerDlg/LayerDlg";
import LayerRoomInfo from "./layerRoomInfo/LayerRoomInfo";

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
    mLayerRoomInfo : ILayerRoomInfo = null ;

    @property(cc.Node)
    mLayerDlgNode : cc.Node = null ;
    mLayerDlg : ILayerDlg = null ;

    @property(cc.Node)
    mLayerPlayersNode : cc.Node = null ;
    mLayerPlayers : ILayerPlayers = null ;

    @property(cc.Node)
    mLayerPlayerCard : cc.Node = null ;
    mLayerCards : ILayerCards = null ;

    get mData() : IRoomSceneData
    {
        return this.mRoomData ;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        //return ;
        // request info ;
        let self = this ;
        let roomID = ClientApp.getInstance().getClientPlayerData().getBaseData().stayInRoomID;
        cc.systemEvent.once( MJFactory.EVENT_FINISH_LOAD_CARD,()=>{ self.mRoomData.reqRoomInfo( roomID ) ;} ) ;
        //cc.systemEvent.once( MJCardFactory2D.EVENT_FINISH_LOAD_MJ,()=>{ self.mRoomData.reqRoomInfo( roomID ) ;} ) ;
    }

    start () {
        this.mRoomData.mSceneDelegate = this ;
        this.mLayerCards = this.mLayerPlayerCard.getComponent(LayerPlayerCards);
        this.mLayerPlayers = this.mLayerPlayersNode.getComponent(LayerPlayers);
        this.mLayerDlg = this.mLayerDlgNode.getComponent( LayerDlg );
        this.mLayerRoomInfo = this.mLayerInfo.getComponent( LayerRoomInfo );
        ( this.mLayerPlayers as LayerPlayers).mScene = this ;
    }

    onRecivedRoomInfo( info : MJRoomBaseData ) : void 
    {

    }

    onPlayerSitDown( p : IRoomPlayerData ) : void 
    {
        this.mLayerPlayers.onPlayerSitDown( p ) ;
        if ( p.svrIdx == this.mRoomData.getSelfIdx() )
        {
            this.mLayerCards.setBottomSvrIdx( p.svrIdx );
        }
    }

    onRecivedAllPlayers( vPlayers : IRoomPlayerData[] ) : void
    {
        this.mLayerPlayers.refresh( this.mData );
        this.mLayerRoomInfo.refresh( this.mData );
        this.mLayerCards.refresh( this.mData );
        this.mLayerDlg.refresh(this.mData) ;
    }

    onMJActError() : void
    {
        this.mLayerCards.onMJActError();
    }

    onPlayerNetStateChanged( playerIdx : number , isOnline : boolean ) : void 
    {
        this.mLayerPlayers.onPlayerNetStateChanged( playerIdx,isOnline ) ;
    }

    onPlayerChatMsg( playerIdx : number , type : eChatMsgType , strContent : string ) : void
    {
        this.mLayerPlayers.onPlayerChatMsg(playerIdx,type,strContent ) ;
    }

    onInteractEmoji( InvokeIdx : number , targetIdx : number , emoji : string ) : void 
    {
        this.mLayerPlayers.onInteractEmoji( InvokeIdx,targetIdx,emoji );
    }

    onPlayerStandUp( idx : number ) : void 
    {
        this.mLayerPlayers.onPlayerStandUp( idx );
    }

    onPlayerReady( idx : number ) : void 
    {
        this.mLayerPlayers.onPlayerReady( idx ) ;
    }

    onDistributedCards() : void 
    {
        this.mLayerCards.onDistributedCards();
        this.mLayerRoomInfo.leftMJCardCnt = this.mData.getMJCntAfterDistribute();
    }

    onPlayerActMo( idx : number , card : number ) : void 
    {
        this.mLayerCards.onPlayerActMo( idx , card ) ;
        --this.mLayerRoomInfo.leftMJCardCnt;
    }

    onPlayerActChu( idx : number , card : number ) : void 
    {
        this.mLayerCards.onPlayerActChu( idx , card ) ;
    }

    showActOpts( vActs : eMJActType[] ) : void 
    {
        this.mLayerDlg.showActOpts(vActs) ;
    }

    onPlayerActed( idx : number , actedData : PlayerActedCard )
    {
        this.mLayerCards.onPlayerActed(idx,actedData);
        switch ( actedData.eAct )
        {
            case eMJActType.eMJAct_AnGang:
            case eMJActType.eMJAct_BuGang:
            case eMJActType.eMJAct_MingGang:
            case eMJActType.eMJAct_BuHua:
            case eMJActType.eMJAct_BuGang_Done:
            {
                --this.mLayerRoomInfo.leftMJCardCnt ;
            }
            break ;
            default:
            break ;
        }
    }

    onGameStart() : void 
    {
        this.mLayerPlayers.onGameStart();
        this.mLayerRoomInfo.onGameStart();
        this.mLayerCards.onGameStart();
        this.mLayerDlg.onGameStart();
    }

    onGameEnd() : void 
    {
        this.mLayerDlg.showDlgResultSingle() ;
        this.mLayerPlayers.onGameEnd();
        this.mLayerRoomInfo.onGameEnd();
        this.mLayerCards.onGameEnd();
        this.mLayerDlg.onGameEnd();
    }

    onRoomOvered() : void 
    {
        this.mLayerDlg.showDlgResultTotal() ;
    }

    onApplyDismisRoom( idx : number ) : void 
    {
        this.mLayerDlg.onApplyDismisRoom(idx) ;
    }

    onReplayDismissRoom( idx : number , isAgree : boolean ) : void 
    {
        this.mLayerDlg.onReplayDismissRoom( idx,isAgree ) ;
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
        this.mLayerPlayers.refresh( this.mData ) ;
        this.mLayerCards.refresh( this.mData );
    }

    // not delegate funciton 
    showDlgPlayerInfo( targetPlayerUID : number )
    {
        this.mLayerDlg.showDlgPlayerInfo( targetPlayerUID ) ;
    }
}
