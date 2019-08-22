import ILayer from "../ILayer";
import MJRoomData from "../roomData/MJRoomData";
import DlgActOpts from "./DlgActOpts/DlgActOpts";
import { eMJActType, eEatType, eChatMsgType } from "../roomDefine";
import DlgEatOpts from "./DlgEatOpts";
import DlgGangOpts from "./DlgGangOpts";
import DlgDismiss from "./DlgDimiss";
import PlayerInfoDataCacher from "../../../clientData/PlayerInfoDataCacher";
import Prompt from "../../../globalModule/Prompt";
import DlgResultTotal from "./DlgResultTotal/DlgResultTotal";
import ResultTotalData from "../roomData/ResultTotalData";
import DlgResultSingle from "./DlgResultSingle/DlgResultSingle";
import ResultSingleData from "../roomData/ResultSingleData";
import DlgChat from "./DlgChat";
import DlgLocation from "./DlgLocation";
import DlgVoice from "./DlgVoice/DlgVoice";
import DlgPlayerInfo from "./DlgPlayerInfo";
import DlgShowMore from "./DlgShowMore";

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
export default class LayerDlg extends ILayer {

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

    protected mRoomData : MJRoomData = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    refresh( data : MJRoomData ) : void
    {
        this.mRoomData = data ;
        if ( this.mDlgDismiss.isShow() )
        {
            this.mDlgDismiss.closeDlg();
        }

        if ( data.mBaseData.applyDismissIdx >= 0 && data.mBaseData.applyDismissIdx < data.mOpts.seatCnt )
        {
            this.showDlgDismiss(data);
        }

        this.mDlgLocation.closeDlg();

        this.mBtnCopyRoomNum.active = this.mBtnInvite.active = ( data.mBaseData.isRoomOpened == false && data.mBaseData.isInGamingState() == false );
    }

    onGameStart()
    {
        this.mBtnCopyRoomNum.active = this.mBtnInvite.active = false ;
        this.mDlgResultSingle.closeDlg();
    }

    // dlg act opts 
    showDlgActOpts( actOpts : eMJActType[] )
    {
        if ( actOpts.length == 1 && ( actOpts[0] == eMJActType.eMJAct_Pass || actOpts[0] == eMJActType.eMJAct_Chu )  )
        {
            return ;
        }

        this.mDlgActOpts.showDlg(actOpts);
    }

    protected onDlgActOptsResult( act : eMJActType )
    {
        this.mRoomData.doChosedAct(act) ;
    }

    // dlg eat opts ;
    showDlgEatOpts( vEatOpts : eEatType[], nTargetCard : number )
    {
        this.mDlgEatOpts.showDlg(vEatOpts,nTargetCard) ;
    }

    protected onDlgEatOptsResult( type : eEatType, nTargetCard : number )
    {
        this.mRoomData.doChoseEatType(type) ;
    }
    
    // dlg gang opts 
    showDlgGangOpts( gangOpts : number[] )
    {
        this.mDlgGangOpts.showDlg( gangOpts );
    }

    protected onDlgGangOptsResult( gangCard : number )
    {
        this.mRoomData.doChosedGangCard( gangCard ) ;
    }

    // dlg dimisss 
    showDlgDismiss( data : MJRoomData )
    {
        this.mDlgDismiss.showDlgDismiss(data);
    }

    protected onDlgDismissResult( isAgree : boolean )
    {
        this.mRoomData.doReplyDismiss( isAgree ) ;
    }

    onReplayDismissRoom( idx : number , isAgree : boolean ) : void
    {
        this.mDlgDismiss.onPlayerRespone(idx,isAgree) ;
        if ( isAgree == false )
        {
            let p = this.mRoomData.mPlayers[idx];
            if ( p == null )
            {
                cc.error( "player is null ? idx = " + idx );
                return ;
            }
            
            let pd = PlayerInfoDataCacher.getInstance().getPlayerInfoByID( p.mPlayerBaseData.uid ) ;
            let name = " uid = " + p.mPlayerBaseData.uid ;
            if ( pd != null )
            {
                name = pd.name ;
            }

            Prompt.promptText( "玩家【"+ name + "】拒绝解散房间" );
        }
    }

    // dlg total result
    showDlgResultTotal( result : ResultTotalData, data : MJRoomData )
    {
        this.mDlgResultSingle.setBtn(true);
        this.mDlgResultTotal.refreshDlg(data,result) ;
        if ( this.mDlgResultSingle.isDlgShowing() )
        {
            return ;
        }
        this.mDlgResultTotal.showDlg();
    }

    // dlg result single 
    showDlgResultSingle( result : ResultSingleData )
    {
        this.mDlgResultSingle.showDlg(this.mRoomData.getSelfIdx(),result ) ;
    }

    protected onDlgResultSingleResult( isAllBtn : boolean )
    {
        if ( isAllBtn )
        {
            this.mDlgResultTotal.showDlg(null) ;
        }
        else
        {
            this.mRoomData.doReady();
        }
    }

    // dlg chat 
    protected showDlgChat()
    {
        this.mDlgChat.showDlg(null) ;
    }

    protected onDlgChatResult( isEmoji : boolean , strContent : string )
    {
        this.mRoomData.doSendPlayerChat( isEmoji ? eChatMsgType.eChatMsg_Emoji : eChatMsgType.eChatMsg_SysText, strContent ) ;
    }

    // dlg localtion 
    protected showDlgLocaltion()
    {
        this.mDlgLocation.showDlg(null,this.mRoomData);
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
        this.mRoomData.doSendPlayerChat(eChatMsgType.eChatMsg_Voice,strFileID) ;
    }

    // dlg player info 
    showDlgPlayerInfo( nTargetPlayerID : number )
    {
        this.mDlgPlayerInfo.showDlg( null , nTargetPlayerID );
    }

    protected onDlgPlayerInfoResult( uid : number, emoji : string )
    {
        let pp = this.mRoomData.getPlayerDataByUID(uid);
        if ( pp == null )
        {
            return ;
        }

        this.mRoomData.doSendPlayerInteractEmoji( pp.mPlayerBaseData.svrIdx,emoji )
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
                this.mRoomData.doApplyDismissRoom();
            }
            break ;
            case DlgShowMore.BTN_LEAVE:
            {
                this.mRoomData.doApplyLeave();
            }
            break;
            case DlgShowMore.BTN_SETTING:
            {
                Prompt.promptDlg( "setting dlg" );
            }
            break ;
        }
    }
}
