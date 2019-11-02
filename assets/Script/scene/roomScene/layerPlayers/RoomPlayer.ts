import PlayerInfoItem from "../../../commonItem/PlayerInfoItem";
import IRoomPlayer from "./IRoomPlayer";
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

const {ccclass, property} = cc._decorator;
enum eRoomPlayerState
{
    RPS_Empty,
    RPS_WaitSitDown,
    RPS_Normal,
    RPS_Max,
};

@ccclass
export default class RoomPlayer extends cc.Component implements IRoomPlayer {

    @property(PlayerInfoItem)
    mInfoItem : PlayerInfoItem = null;

    @property(cc.Node)
    mCommonInfoNode : cc.Node = null ;

    @property(cc.Label)
    mHuaCnt : cc.Label = null ;

    @property(cc.Node)
    mHuaZi : cc.Node = null ;

    @property(cc.Label)
    mChip : cc.Label = null ;

    @property(cc.Node)
    mOfflineIcon : cc.Node = null ;

    @property(cc.Label)
    mTextChat : cc.Label = null ;

    @property(dragonBones.ArmatureDisplay)
    mVoiceChat : dragonBones.ArmatureDisplay = null ;

    @property(dragonBones.ArmatureDisplay)
    mEmoji : dragonBones.ArmatureDisplay = null ;

    @property(cc.Node)
    mReadyIcon : cc.Node = null ;

    @property(cc.Node)
    mBtnSitdown : cc.Node = null ;
    
    @property(cc.Node)
    mBankIconPos : cc.Node = null ;

    @property([cc.Component.EventHandler])
    lpfPlayerCallBack : cc.Component.EventHandler[] = [] ;  // ( isSitDown : boolean , uid : number | mSvrIdx )

    onLoad ()
    {
        this.mBankIconPos.active = false ;
    }

    set huaCntColor( clr : cc.Color )
    {
        this.mHuaCnt.node.color = clr ;
        this.mHuaZi.color = clr ;
    }

    private mState : eRoomPlayerState = eRoomPlayerState.RPS_Empty ;
    
    set state( rs : eRoomPlayerState )
    {
        this.mState = rs ;
        switch ( this.mState )
        {
            case eRoomPlayerState.RPS_Empty:
            {
                this.mCommonInfoNode.active = false ;
                this.mReadyIcon.active = false ;
                this.mBtnSitdown.active = false ;
            }
            break;
            case eRoomPlayerState.RPS_Normal:
            {
                this.mCommonInfoNode.active = true ;
                this.mBtnSitdown.active = false ;
                this.mTextChat.node.parent.active = false ;
                this.mVoiceChat.node.parent.active = false ;
                this.mEmoji.node.active = false ;
                this.mBankIconPos.active = false ;
            }
            break;
            case eRoomPlayerState.RPS_WaitSitDown:
            {
                this.mCommonInfoNode.active = false ;
                this.mReadyIcon.active = false ;
                this.mBtnSitdown.active = true ;
            }
            break ;
        }

    }

    get state() : eRoomPlayerState
    {
        return this.mState ;
    }

    onClickBtnSitdown( c : Object , a : string )
    {
        cc.Component.EventHandler.emitEvents(this.lpfPlayerCallBack,true,this.mSvrIdx );
    }

    onClickHeadIcon( c : Object , b : string )
    {
        cc.Component.EventHandler.emitEvents(this.lpfPlayerCallBack,false,this.mInfoItem.getUID() );
    }

    // update (dt) {}
    // interface IRoomPlayer
    set isOnline( isOnline : boolean )
    {
        this.mOfflineIcon.active = !isOnline ;
    }

    mSvrIdx : number = -1;
    get chip() : number
    {
        return parseInt(this.mChip.string);
    }

    set chip( n : number )
    {
        this.mChip.string = n.toString() ;
    }

    set huaCnt( cnt : number ) 
    {
        this.mHuaCnt.string = cnt + "" ;
    }

    protected mWorlPosOfBankIcon : cc.Vec2 = null ;
    get bankIconWorldPos() : cc.Vec2
    {
        if ( this.mWorlPosOfBankIcon == null )
        {
            this.mWorlPosOfBankIcon = this.mBankIconPos.parent.convertToWorldSpaceAR(cc.v2(this.mBankIconPos.position.x,this.mBankIconPos.position.y));
        }
        return this.mWorlPosOfBankIcon;
    }

    protected mWorldPosOfInteractEmoji = null ;
    get worldPosEmoji() : cc.Vec2
    {
        if ( this.mWorldPosOfInteractEmoji == null )
        {
            this.mWorldPosOfInteractEmoji = this.mOfflineIcon.parent.convertToWorldSpaceAR(cc.v2(this.mOfflineIcon.position.x,this.mOfflineIcon.position.y));
        }
        return this.mWorldPosOfInteractEmoji;
    }

    set isReady( isReady : boolean )
    {
        this.mReadyIcon.active = isReady ;
    }

    refresh( data : IRoomPlayerData ) : void 
    {
        if ( data == null )
        {
            this.state = eRoomPlayerState.RPS_Empty ;
            return ;
        }
        this.state = eRoomPlayerState.RPS_Normal ;
        this.mInfoItem.refreshInfo(data.uid) ;
        this.chip = data.chip;
        this.isOnline = data.isOnline ;
        this.isReady = data.isReady ;
    }

    setChatEmoji( strEoji : string )
    {
        this.mEmoji.node.active = true ;
        this.mEmoji.armatureName = strEoji;
        this.mEmoji.playAnimation(strEoji,1) ;
        let self = this ;
        this.mEmoji.addEventListener(dragonBones.EventObject.COMPLETE,( e : cc.Event )=>{ self.mEmoji.node.active = false ;}) ;
    }

    setChatText( strContent : string )
    {
        this.mTextChat.string = strContent ;
        this.mTextChat.node.parent.active = true ;

        let pn = this.mTextChat.node.parent ;
        cc.tween(this.mTextChat.node)
        .delay(2)
        .call( ()=>{ pn.active = false ;} )
        .start();
    }

    startChatVoice()
    {
        this.mVoiceChat.node.parent.active = true ;
        this.mVoiceChat.playAnimation(null,-1) ;
    }

    stopChatVoice()
    {
        this.mVoiceChat.playAnimation(null,1) ;
        this.mVoiceChat.node.parent.active = false ;
    }

    waitSitDown() : void 
    {
        this.state = eRoomPlayerState.RPS_WaitSitDown ;
    }
}
