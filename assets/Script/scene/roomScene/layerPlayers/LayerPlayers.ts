import { eChatMsgType } from "../roomDefine";
import Prompt from "../../../globalModule/Prompt";
import VoiceManager from "../../../sdk/VoiceManager";
import PlayerInteractEmoji from "./PlayerInteractEmoji";
import MJRoomScene from "../MJRoomScene";
import ILayerPlayers from "../ILayerPlayers";
import IRoomSceneData, { ILayerPlayersData, IRoomPlayerData } from "../IRoomSceneData";
import IRoomPlayer from "./IRoomPlayer";
import RoomPlayer from "./RoomPlayer";

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
export default class LayerPlayers extends cc.Component implements ILayerPlayers {

    @property([cc.Node])
    mPlayerNodes : cc.Node[] = [] ;
    mPlayers : IRoomPlayer[] = [] ;

    @property(cc.Node)
    mBankIcon : cc.Node = null ;

    @property(cc.Node)
    mBtnReady : cc.Node = null ;

    @property(PlayerInteractEmoji)
    mInteractEmoji : PlayerInteractEmoji = null ;
    
    mScene : MJRoomScene = null ;
    mData : ILayerPlayersData = null ;
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        cc.systemEvent.on(VoiceManager.EVENT_QUEUE_START_PLAY,this.onEvent,this) ;
        cc.systemEvent.on(VoiceManager.EVENT_QUEUE_PLAY_FINISH,this.onEvent,this) ;
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    protected onEvent( event : cc.Event.EventCustom )
    {
        let eventID = event.getEventName();
        let jsDetail = event.detail ;
        switch (eventID )
        {
            case VoiceManager.EVENT_QUEUE_START_PLAY:
            case VoiceManager.EVENT_QUEUE_PLAY_FINISH:
            {
                let uid : number = jsDetail["uid"] ;
                let clientIdx = this.mData.getPlayerClientIdxByUID( uid );
                if ( clientIdx == -1 )
                {
                    cc.error( "player is null , how to play voice" );
                    return ;
                }
            
                if ( eventID == VoiceManager.EVENT_QUEUE_START_PLAY )
                {
                    this.mPlayers[clientIdx].startChatVoice();
                }
                else
                {
                    this.mPlayers[clientIdx].stopChatVoice();
                }
                
            }
            default:
            console.error( "unknown event voice = " + eventID );
        }
    }

    start () {
        
        for ( let idx = 0 ; idx < this.mPlayerNodes.length ; ++idx )
        {
            this.mPlayers.push( this.mPlayerNodes[idx].getComponent(RoomPlayer) );
        }
    }

    onPlayerNetStateChanged( playerIdx : number , isOnline : boolean ) : void 
    {
        let clientIdx = this.mData.svrIdxToClientIdx( playerIdx );
        this.mPlayers[clientIdx].isOnline = isOnline ;
    }

    onPlayerChatMsg( playerIdx : number , type : eChatMsgType , strContent : string ) : void 
    {
        let clientIdx = this.mData.svrIdxToClientIdx(playerIdx);
        if ( clientIdx >= this.mPlayers.length )
        {
            Prompt.promptText( "没有坐下的玩家不能说话" );
            return ;
        }

        switch ( type )
        {
            case eChatMsgType.eChatMsg_Emoji:
            {
                this.mPlayers[clientIdx].setChatEmoji(strContent);
            }
            break ;
            case eChatMsgType.eChatMsg_SysText:
            {
                this.mPlayers[clientIdx].setChatText(strContent);
            }
            break ;
            case eChatMsgType.eChatMsg_Voice:
            {

            }
            break ;
            default:
            Prompt.promptText( "unknown type = " + type + " c = " + strContent );
        }
    }

    onInteractEmoji( InvokeIdx : number , targetIdx : number , emoji : string ) : void 
    {
        let orgPos : cc.Vec2 = null ;
        let dstPos : cc.Vec2 = null ;
        for ( let clientIdx = 0 ; clientIdx < this.mPlayers.length && ( orgPos == null || dstPos == null ); ++clientIdx )
        {
            let p = this.mPlayers[clientIdx];
            if ( p.mSvrIdx == InvokeIdx )
            {
                orgPos = p.worldPosEmoji;
                continue ;
            }

            if ( p.mSvrIdx == targetIdx )
            {
                dstPos = p.worldPosEmoji ;
            }
        }

        if ( dstPos == null || null == dstPos )
        {
            cc.error( "some pos is null" );
            return ;
        }

        this.mInteractEmoji.playInteractEmoji(emoji,orgPos,dstPos) ;
    }

    onPlayerSitDown( p : IRoomPlayerData ) : void
    {
        if ( p.svrIdx == this.mData.getSelfIdx() )
        {
            this.localRefresh();
            return ;
        }

        let clientIdx = this.mData.svrIdxToClientIdx(p.svrIdx);
        this.mPlayers[clientIdx].refresh(p) ;
    }

    onPlayerStandUp( idx : number ) : void 
    {
        let nselfIdx = this.mData.getSelfIdx();
        if ( idx == nselfIdx || -1 == nselfIdx )
        {
            this.localRefresh();
            return ;
        }

        let clientIdx = this.mData.svrIdxToClientIdx( nselfIdx );
        this.mPlayers[clientIdx].refresh(null);
        this.mPlayers[clientIdx].waitSitDown();
    }

    onPlayerReady( idx : number ) : void 
    {
        let clientIdx = this.mData.svrIdxToClientIdx( idx );
        this.mPlayers[clientIdx].isReady = true ;
        if ( idx == this.mData.getSelfIdx() )
        {
            this.mBtnReady.active = false ;
        }
    }

    refresh( data : IRoomSceneData ) : void 
    {
        this.mData = data.getLayerPlayersData() ;
        this.localRefresh();
    }

    onGameStart() : void
    {
        for ( let p of this.mPlayers )
        {
            p.isReady = false ;
        }
        this.setBankerIdx( this.mData.getBankerIdx() );
    }

    onGameEnd()
    {
        this.refreshPlayerChips();
    }

    //---interface end ;
    protected localRefresh()
    {
        let nselfIdx = this.mData.getSelfIdx();
        let isSelfSitDown = nselfIdx != -1 ;
        let vPlayersData = this.mData.getPlayersData();
        for ( let svrIdx = 0 ; svrIdx < this.mPlayers.length ; ++svrIdx )
        {
            let clientIdx = this.mData.svrIdxToClientIdx(svrIdx);
            if ( clientIdx >= this.mPlayers.length )
            {
                cc.error( "invlid svridx and client idx " + svrIdx + " c = " + clientIdx );
                continue ;
            }
            
            this.mPlayers[clientIdx].mSvrIdx = svrIdx;
            if ( vPlayersData[svrIdx] == null || vPlayersData[svrIdx].isEmpty() )
            {
                this.mPlayers[clientIdx].refresh(null);
                if ( isSelfSitDown == false )
                {
                    this.mPlayers[clientIdx].waitSitDown();
                }
            }
            else
            {
                this.mPlayers[clientIdx].refresh(vPlayersData[svrIdx]) ;
            }
        }

        this.setBankerIdx( this.mData.getBankerIdx() ) ;
        this.mBtnReady.active = this.mData.isShowReadyBtn();
    }

    protected refreshPlayerChips() : void 
    {
        let vPlayersData = this.mData.getPlayersData();
        for ( let svrIdx = 0 ; svrIdx < this.mPlayers.length ; ++svrIdx )
        {
            let clientIdx = this.mData.svrIdxToClientIdx(svrIdx);
            if ( clientIdx >= this.mPlayers.length || vPlayersData[svrIdx] == null || vPlayersData[svrIdx].isEmpty() )
            {
                cc.error( "invlid svridx and client idx " + svrIdx + " c = " + clientIdx );
                continue ;
            }
            
            this.mPlayers[clientIdx].chip = vPlayersData[svrIdx].chip;
 
        }
    }

    protected setBankerIdx( svrIdx : number )
    {
        if ( svrIdx < 0 || svrIdx >= this.mPlayers.length )
        {
            return ;
        }

        let clientIdx = this.mData.svrIdxToClientIdx(svrIdx);
        if ( clientIdx >= this.mPlayers.length )
        {
            return ;
        }
        let targetPos = this.mBankIcon.parent.convertToNodeSpaceAR( this.mPlayers[clientIdx].bankIconWorldPos ) ; 
        cc.tween(this.mBankIcon).to(0.3, { position: targetPos }, { easing: 'sineOut'}).start() ;
    }

    onPlayerRefreshHuaCnt( playerSvrIdx : number , huaCnt : number )
    {
        let playerIdx = this.mData.svrIdxToClientIdx( playerSvrIdx );
        this.mPlayers[playerIdx].huaCnt = huaCnt ;
        //let keep = ( this.mRoomData.mOpts as OptsSuZhou ).ruleMode == 1 ? 2 : 3 ;
        //this.mPlayers[playerIdx].huaCntColor = cc.Color.GREEN.fromHEX( huaCnt > keep ? "#00f200" : "#c96b82" ) ;
    }

    onClickPlayer( isSitDown : boolean , arg : number )
    {
        if ( isSitDown )
        {
            if ( this.mData.getSelfIdx() == -1 )
            {
                this.mData.reqSitDown(arg); ;
            }
        }
        else
        {
            //layer dlg show player info ;
            //cc.log( "clicked player uid = " + arg );
            this.mScene.showDlgPlayerInfo( arg ) ;
        }
    }

    onBtnSetReady()
    {
        this.mData.reqSetReady();
    }
    // update (dt) {}
}
