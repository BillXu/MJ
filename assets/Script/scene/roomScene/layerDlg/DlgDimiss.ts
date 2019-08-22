import DlgBase from "../../../common/DlgBase";
import PlayerInfoItem from "../../../commonItem/PlayerInfoItem";
import MJRoomData from "../roomData/MJRoomData";
import Prompt from "../../../globalModule/Prompt";
import PlayerInfoDataCacher from "../../../clientData/PlayerInfoDataCacher";
import * as _ from "lodash"

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
export default class DlgDismiss extends DlgBase {

    @property(cc.Label)
    mDesc: cc.Label = null;

    @property([PlayerInfoItem])
    mPlayerInfos : PlayerInfoItem[] = [] ;

    @property( [cc.Node] )
    mAgreeIcons : cc.Node[] = [] ;

    @property([cc.Node])
    mWaitIcons : cc.Node[] = [] ;

    @property(cc.Label)
    mTimer : cc.Label = null ;

    @property( [cc.Component.EventHandler] )
    mOnDlgResult : cc.Component.EventHandler[] = [] ;  // ( isAgree : bool )

    @property(cc.Node)
    mResponeButton : cc.Node = null ;

    mLeftTime : number = 0 ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    showDlgDismiss( data : MJRoomData )
    {
        super.showDlg(null,null,null);
        let applyIdx = data.mBaseData.applyDismissIdx ;
        if ( applyIdx >= this.mPlayerInfos.length || applyIdx < 0 || applyIdx >= data.mPlayers.length )
        {
            Prompt.promptText( "invalid idx = " + applyIdx + " can not dismiss" );
            this.closeDlg();
            return ;
        }
    
        // set up desc
        let applayerr = PlayerInfoDataCacher.getInstance().getPlayerInfoByID(data.mPlayers[applyIdx].mPlayerBaseData.uid) ;
        let applyerName =  "uid=" + data.mPlayers[applyIdx].mPlayerBaseData.uid ;
        if ( applayerr != null )
        {
            applyerName = applayerr.name ;
        }
        this.mDesc.string = "用户【"+ applyerName +"】请求解散房间，是否同意? (超过300秒默认同意)" ;

        // set players info ;
        let seatCnt = data.mOpts.seatCnt ;
        for ( let idx = 0 ; idx < this.mPlayerInfos.length ; ++idx )
        {
            this.mPlayerInfos[idx].node.active = idx < seatCnt ;
            if ( idx >= seatCnt )
            {
                this.mAgreeIcons[idx].active = false ;
                this.mWaitIcons[idx].active = false ;
                continue ;
            }

            let p = data.mPlayers[idx];
            if ( p == null || p.isEmpty() )
            {
                continue ;
            }

            this.mPlayerInfos[idx].refreshInfo( p.mPlayerBaseData.uid );
            this.mWaitIcons[idx].active = applyIdx != idx ;
            this.mAgreeIcons[idx].active = !this.mWaitIcons[idx].active ;
        }
        
        for ( let idx = 0 ; idx < data.mBaseData.agreeDismissIdx.length ; ++idx )
        {
            this.onPlayerRespone( data.mBaseData.agreeDismissIdx[idx],true );
        }

        // set operater button ;
        let selfIdx = data.getSelfIdx();
        this.mResponeButton.active = selfIdx != applyIdx && ( _.find(data.mBaseData.agreeDismissIdx,( idx : number )=>{ return selfIdx == idx ;}) == null );
        
        // timer ;
        this.unscheduleAllCallbacks();
        this.mLeftTime = data.mBaseData.dimissRoomLeftTime ;
        this.schedule( this.onTimerCountDown,1,this.mLeftTime,0);
        this.onTimerCountDown();
    }

    protected onTimerCountDown()
    {
        if ( this.mLeftTime <= 0 )
        {
            this.onClickResponeButton( null , "1" );
            return ;
        }
        this.mTimer.string = "" + this.mLeftTime ;
        --this.mLeftTime;
    }

    onPlayerRespone( svrIdx : number , isAgree : boolean )
    {
        if ( svrIdx >= this.mAgreeIcons.length || svrIdx < 0 )
        {
            cc.error( "invalid svr idx = " + svrIdx );
            return ;
        }

        this.mAgreeIcons[svrIdx].active = isAgree ;
        this.mWaitIcons[svrIdx].active = false ;

        if ( isAgree == false )
        {
            this.closeDlg();
        }
    }

    onClickResponeButton( event : cc.Event.EventTouch, isAgrre : string )
    {
        let bIsAgree : boolean = parseInt( isAgrre ) == 1 ;
        cc.Component.EventHandler.emitEvents( this.mOnDlgResult,bIsAgree );
        this.mResponeButton.active = false ;
    }

    closeDlg()
    {
        super.closeDlg();
        this.unscheduleAllCallbacks();
    }
    // update (dt) {}
}
