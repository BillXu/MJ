import ILayer from "../ILayer";
import MJRoomData from "../roomData/MJRoomData";
import RoomPlayer, { eRoomPlayerState } from "./RoomPlayer";
import { eChatMsgType } from "../roomDefine";
import MJPlayerData from "../roomData/MJPlayerData";
import Prompt from "../../../globalModule/Prompt";

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
export default class LayerPlayers extends cc.Component implements ILayer {

    @property( [RoomPlayer] )
    mPlayers : RoomPlayer[] = [] ;

    @property(cc.Node)
    mBankIcon : cc.Node = null ;
    
    protected mRoomData : MJRoomData = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    refresh( data : MJRoomData ) : void 
    {
        this.mRoomData = data ;
        let nselfIdx = data.getSelfIdx();
        let isSelfSitDown = nselfIdx != -1 ;
        for ( let svrIdx = 0 ; svrIdx < data.mOpts.seatCnt ; ++svrIdx )
        {
            let clientIdx = data.svrIdxToClientIdx(svrIdx);
            if ( data.mPlayers[svrIdx] == null || data.mPlayers[svrIdx].isEmpty() )
            {
                this.mPlayers[clientIdx].state = isSelfSitDown == false ? eRoomPlayerState.RPS_WaitSitDown : eRoomPlayerState.RPS_Empty ;
            }
            else
            {
                this.mPlayers[clientIdx].state = eRoomPlayerState.RPS_Normal ;
                this.mPlayers[clientIdx].setInfo( data.mPlayers[svrIdx].mPlayerBaseData );
                this.mPlayers[clientIdx].isReady = data.mBaseData.isInGamingState() && data.mPlayers[svrIdx].mPlayerBaseData.isReady ;
            }
        }
    }

    onPlayerStandUp( idx : number ) : void
    {
        let nselfIdx = this.mRoomData.getSelfIdx();
        if ( idx == nselfIdx )
        {
            this.refresh(this.mRoomData);
            return ;
        }

        let clientIdx = this.mRoomData.svrIdxToClientIdx( nselfIdx );
        this.mPlayers[clientIdx].state = nselfIdx == -1 ? eRoomPlayerState.RPS_WaitSitDown : eRoomPlayerState.RPS_Empty ;
    }

    onPlayerReady( idx : number ) : void 
    {
        let clientIdx = this.mRoomData.svrIdxToClientIdx( idx );
        this.mPlayers[clientIdx].isReady = true ;
    }

    onPlayerNetStateChanged( playerIdx : number , isOnline : boolean ) : void 
    {
        let clientIdx = this.mRoomData.svrIdxToClientIdx( playerIdx );
        this.mPlayers[clientIdx].isOnline = isOnline ;
    }

    onPlayerChatMsg( playerIdx : number , type : eChatMsgType , strContent : string ) : void 
    {
        let clientIdx = this.mRoomData.svrIdxToClientIdx(playerIdx);
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

    onInteractEmoji( InvokeIdx : number , targetIdx : number , emojiIdx : number ) : void 
    {

    }

    onPlayerSitDown( p : MJPlayerData ) : void
    {
        if ( p.mPlayerBaseData.svrIdx == this.mRoomData.getSelfIdx() )
        {
            this.refresh( this.mRoomData );
            return ;
        }

        let clientIdx = this.mRoomData.svrIdxToClientIdx(p.mPlayerBaseData.svrIdx);
        this.mPlayers[clientIdx].state = eRoomPlayerState.RPS_Normal ;
        this.mPlayers[clientIdx].setInfo(p.mPlayerBaseData);
        this.mPlayers[clientIdx].isReady = p.mPlayerBaseData.isReady && this.mRoomData.mBaseData.isInGamingState();
    }

    onGameStart() : void 
    {
        for ( let p of this.mPlayers )
        {
            p.isReady = false ;
        }
    }
    // update (dt) {}
}
