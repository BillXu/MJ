import DlgBase from "../../../common/DlgBase";
import PlayerInfoItem from "../../../commonItem/PlayerInfoItem";
import PlayerInfoDataCacher from "../../../clientData/PlayerInfoDataCacher";
import Prompt from "../../../globalModule/Prompt";
import ClientApp from "../../../globalModule/ClientApp";
import VoiceManager from "../../../sdk/VoiceManager";

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
export default class DlgPlayerInfo extends DlgBase {

    @property(PlayerInfoItem)
    mPlayerInfo : PlayerInfoItem = null ;

    @property(cc.Label)
    mAddress : cc.Label = null;

    @property(cc.Label)
    mIP : cc.Label = null ;

    @property(cc.Node)
    mEmojiNode : cc.Node = null ;

    //@property([cc.Component.EventHandler])
   // mOnDlgResult : cc.Component.EventHandler[] = [] ;  // ( targetID : number , emojiName : string )

    mLastTimeSendEmoji : number = 0 ;
    mLastTimeReplay : number = 0 ;

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose) ;

        let id : number = jsUserData as number ;
        this.mPlayerInfo.refreshInfo(id);
        let pdata = PlayerInfoDataCacher.getInstance().getPlayerInfoByID( id ) ;
        this.mAddress.string = pdata != null ? pdata.address : "loading" ;
        this.mIP.string = "IP: " + ( pdata != null ? pdata.ip : "loading" );

        this.mEmojiNode.active = ClientApp.getInstance().getClientPlayerData().getSelfUID() != id ;
    }

    onClickReplayVoice()
    {
        let now = Date.now();
        if ( now - this.mLastTimeReplay < 5 )
        {
            Prompt.promptText( "请休息一下下，再回放语音！" );
            return ;
        }
        this.mLastTimeReplay = now ;

        VoiceManager.getInstance().playLastVoice( this.mPlayerInfo.getUID() ) ;
        this.closeDlg();
    }

    onClickEmoji( event : cc.Event.EventTouch )
    {
        let now = Date.now();
        if ( now - this.mLastTimeSendEmoji < 4 )
        {
            Prompt.promptText( "请休息一下下再发！" );
            return ;
        }
        this.mLastTimeSendEmoji = now ;

        let node = event.getCurrentTarget();
        let str = node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame.name ;
        //cc.Component.EventHandler.emitEvents( this.mOnDlgResult, this.mPlayerInfo.getUID() ,str );
        if ( this.pFuncResult != null )
        {
            this.pFuncResult( str );
        }
        
        this.closeDlg();
    }

    getUID() : number
    {
        return this.mPlayerInfo.getUID() ;
    }
}
