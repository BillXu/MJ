import DlgActOpts from "./DlgActOpts/DlgActOpts";
import { eMJActType, eEatType, eChatMsgType } from "../roomDefine";
import DlgEatOpts from "./DlgEatOpts";
import DlgGangOpts from "./DlgGangOpts";
import DlgDismiss from "./DlgDimiss";
import PlayerInfoDataCacher from "../../../clientData/PlayerInfoDataCacher";
import Prompt from "../../../globalModule/Prompt";
import DlgResultTotal from "./DlgResultTotal/DlgResultTotal";
import DlgResultSingle from "./DlgResultSingle/DlgResultSingle";
import DlgChat from "./DlgChat";
import DlgLocation from "./DlgLocation";
import DlgVoice from "./DlgVoice/DlgVoice";
import DlgPlayerInfo from "./DlgPlayerInfo";
import DlgShowMore from "./DlgShowMore";
import ILayerDlg from "../ILayerDlg";
import IRoomSceneData from "../IRoomSceneData";
import ILayerDlgData from "./ILayerDlgData";

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
export default class LayerDlg extends cc.Component implements ILayerDlg {

    @property(DlgActOpts)
    mDlgActOpts: DlgActOpts = null;

    @property(DlgEatOpts)
    mDlgEatOpts : DlgEatOpts = null ;

    @property(DlgGangOpts)
    mDlgGangOpts : DlgGangOpts = null ;

    @property(DlgDismiss)
    mDlgDismiss : DlgDismiss = null ;

    @property(DlgResultTotal)
    mDlgResultTotal : DlgResultTotal = null ;

    @property(DlgResultSingle)
    mDlgResultSingle : DlgResultSingle = null ;

    @property(DlgChat)
    mDlgChat : DlgChat = null ;

    @property(DlgLocation)
    mDlgLocation : DlgLocation = null ;

    //----important
    // dlg voice root node can not hide , beacuase some work need be done when dlg was not dispaly 
    @property(DlgVoice)
    mDlgVoice : DlgVoice = null ;

    @property( DlgPlayerInfo )
    mDlgPlayerInfo : DlgPlayerInfo = null ;

    @property(cc.Node)
    mBtnCopyRoomNum : cc.Node = null ;

    @property(cc.Node)
    mBtnInvite : cc.Node = null ;

    @property(cc.Toggle)
    mBtnShowMore : cc.Toggle = null ;

    @property(DlgShowMore)
    mDlgShowMore : DlgShowMore = null ;

    protected mData : ILayerDlgData = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // dlg chat 
    protected showDlgChat()
    {
        this.mDlgChat.showDlg(null) ;
        this.mDlgChat.mOnDlgResult = this.onDlgChatResult.bind(this);
    }

    protected onDlgChatResult( isEmoji : boolean , strContent : string )
    {
        this.mData.reqSendChat( isEmoji ? eChatMsgType.eChatMsg_Emoji : eChatMsgType.eChatMsg_SysText, strContent ) ;
    }

    // dlg localtion 
    protected showDlgLocaltion()
    {
        this.mDlgLocation.showDlg(null,this.mData.getLocationDlgData() );
    }

    // dlg voice 
    //----important
    // dlg voice root node can not hide , beacuase some work need be done when dlg was not dispaly 
    protected onButtonVoiceEvent( event : string )
    {
        this.mDlgVoice.onVoiceButtonCallBack(event);
    }

    protected onDlgVoiceResult( strFileID : string )
    {
        //this.mRoomData.doSendPlayerChat(eChatMsgType.eChatMsg_Voice,strFileID) ;
        this.mData.reqSendChat( eChatMsgType.eChatMsg_Voice,strFileID );
    }

    protected onBtnCopyRoomID()
    {
        cc.log( "copy room id " );
    }

    protected onBtnInvite()
    {
        cc.log( "invite" );
    }

    // dlg show more 
    protected showDlgShowMore( toggle : cc.Toggle )
    {
        if ( toggle.isChecked )
        {
            let self = this ;
            this.mDlgShowMore.showDlg(null,null,()=>{ self.mBtnShowMore.isChecked = false ;});
        }
        else
        {
            if ( this.mDlgShowMore.isShow() )
            {
                this.mDlgShowMore.closeDlg();
            }
            
        }
    }

    protected onDlgShowMoreResult( btnType : string )
    {
        cc.log( "dlg show more type = " + btnType );
        switch ( btnType )
        {
            case DlgShowMore.BTN_DISMISS:
            {
                this.mData.reqApplyDismiss();
            }
            break ;
            case DlgShowMore.BTN_LEAVE:
            {
                this.mData.reqApplyLeave();
            }
            break;
            case DlgShowMore.BTN_SETTING:
            {
                Prompt.promptDlg( "setting dlg" );
            }
            break ;
        }
    }

    // interface IlayerDlg
    refresh( data : IRoomSceneData ) : void 
    {
        this.mData = data.getLayerDlgData() ;
        if ( this.mDlgDismiss.isShow() )
        {
            this.mDlgDismiss.closeDlg();
        }

        if ( this.mData.isShowDismissDlg() )
        {
            this.mDlgDismiss.showDlg(null,this.mData.getDismissDlgData(),null ) ;
        }
  
        this.mDlgLocation.closeDlg();

        this.mBtnCopyRoomNum.active = this.mBtnInvite.active = this.mData.isSeatFull() == false;
    }

    onGameStart() : void
    {
        this.mBtnCopyRoomNum.active = this.mBtnInvite.active = false ;
        if (  this.mDlgResultSingle != null )
        {
            this.mDlgResultSingle.closeDlg();
        }
    }

    onGameEnd()
    {

    }

    onApplyDismisRoom( idx : number ) : void 
    {
        this.mDlgDismiss.showDlg(null,this.mData.getDismissDlgData(),null ) ;
    }

    onReplayDismissRoom( idx : number , isAgree : boolean ) : void 
    {
        this.mDlgDismiss.onPlayerRespone(idx,isAgree) ;
        if ( isAgree == false )
        {
            let uid = this.mData.getPlayerUIDByIdx(idx);
            if ( -1 == uid )
            {
                cc.error( "player is null ? idx = " + idx );
                return ;
            }
            
            let pd = PlayerInfoDataCacher.getInstance().getPlayerInfoByID( uid ) ;
            let name = " uid = " + uid ;
            if ( pd != null )
            {
                name = pd.name ;
            }

            Prompt.promptText( "玩家【"+ name + "】拒绝解散房间" );
        }
    }

    // dlg act opts 
    showActOpts( actOpts : eMJActType[] ) : void 
    {
        if ( actOpts.length == 1 && ( actOpts[0] == eMJActType.eMJAct_Pass || actOpts[0] == eMJActType.eMJAct_Chu )  )
        {
            return ;
        }

        this.mDlgActOpts.showDlg(actOpts,this.onDlgActOptsResult.bind(this) );
    }

    protected onDlgActOptsResult( act : eMJActType )
    {
        if ( eMJActType.eMJAct_AnGang == act || eMJActType.eMJAct_BuGang == act || eMJActType.eMJAct_MingGang == act )
        {
            let vGantOpts = this.mData.getGangOpts();
            if ( vGantOpts.length == 1 )
            {
                this.mData.reqAct(act,vGantOpts[0]);
            }
            else
            {
                let self = this ;
                this.mDlgGangOpts.showDlg( vGantOpts , ( card : number )=>{ self.mData.reqAct( act, card );} );
            }
        }
        else if ( act == eMJActType.eMJAct_Chi )
        {
            let vEatOpts = this.mData.getEatOpts();
            if ( 1 == vEatOpts.length )
            {
                this.mData.reqAct( act, vEatOpts[0] );
            }
            else
            {
                let self = this ;
                this.mDlgEatOpts.showDlg(vEatOpts,this.mData.getEatTargetCard(),( eatType : eEatType )=>{ self.mData.reqAct(act,eatType );}) ;
            }
        }
        else
        {
            this.mData.reqAct(act,null);
        }
    }

    showDlgResultSingle() : void 
    {
        this.mDlgResultSingle.showDlg( this.mData.getSingleResultDlgData() , this.onDlgResultSingleResult.bind( this ) ) ;
    }

    protected onDlgResultSingleResult( isAllBtn : boolean )
    {
        if ( isAllBtn )
        {
            this.mDlgResultTotal.showDlg(null) ;
        }
        else
        {
            this.mData.reqDoReady();
        }
    }

    // dlg total result
    showDlgResultTotal() : void 
    {
        this.mDlgResultSingle.setBtn(true);
        this.mDlgResultTotal.refreshDlg(this.mData.getTotalResultDlgData()) ;
        if ( this.mDlgResultSingle.isDlgShowing() )
        {
            return ;
        }
        this.mDlgResultTotal.showDlg();
    }

    // dlg player info 
    showDlgPlayerInfo( targetPlayerUID : number ) 
    {
        this.mDlgPlayerInfo.showDlg( this.onDlgPlayerInfoResult.bind(this) , targetPlayerUID );
    }

    protected onDlgPlayerInfoResult( emoji : string )
    {
        this.mData.reqSendInteractiveEmoji( this.mDlgPlayerInfo.getUID(),emoji ) ;
    }
}
