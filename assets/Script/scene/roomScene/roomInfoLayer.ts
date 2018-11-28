// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Indicator from "./indicator"
import { eClientRoomState } from "./roomDefine"
import RoomData from "./roomData"
import roomSceneLayerBase from "./roomSceneLayerBase"
import { eMsgType } from "../../common/MessageIdentifer"
import DlgSetting from "../mainScene/dlgSetting"
@ccclass
export default class RoomInfoLayer extends roomSceneLayerBase {

    // wait ready state node
    @property(cc.Node)
    pWaitReadyStateNode : cc.Node = null ;

    @property(cc.Sprite)
    pMJWall : cc.Sprite = null ;
    @property(cc.Label)
    pLabelRoomID : cc.Label = null ;
    
    @property(cc.Node)
    pBtnReady : cc.Node = null ;
    @property(cc.Node)
    pBtnStartGame : cc.Node = null ;

    // in game state node 
    @property(cc.Node)
    pGameStateNode : cc.Node = null ;
    
    @property(cc.ProgressBar)
    pBatteryLevel : cc.ProgressBar = null ;

    @property(cc.Sprite)
    pLeftUpSmallMJ : cc.Sprite = null ;

    @property(cc.Label)
    pLeftMJCnt : cc.Label = null ;

    @property(cc.Label)
    pCircleTitle : cc.Label = null ;
    @property(cc.Label)
    pCircle : cc.Label = null ;
    @property(cc.Label)
    pTime : cc.Label = null ;
    @property(cc.Label)
    pRoomRuleDesc : cc.Label = null ;
    // LIFE-CYCLE CALLBACKS:

    @property(Indicator)
    pIndicator : Indicator = null ;
    
    @property(cc.Node)
    pDlgWantedOneCard : cc.Node = null ;

    @property(DlgSetting)
    pDlgSettting : DlgSetting = null ;

    roomState : eClientRoomState = eClientRoomState.State_WaitReady ;
    onLoad ()
    {
        // update time ;
        let self = this ;
        let dt = new Date();
        if ( dt.getMinutes() < 10 )
        {
            self.pTime.string = dt.getHours() + ":0" + dt.getMinutes();
        }
        else
        {
            self.pTime.string = dt.getHours() + ":" + dt.getMinutes();
        }
        this.schedule( ()=>{
            let dt = new Date();
            if ( dt.getMinutes() < 10 )
            {
                self.pTime.string = dt.getHours() + ":0" + dt.getMinutes();
            }
            else
            {
                self.pTime.string = dt.getHours() + ":" + dt.getMinutes();
            }
            
        },60,cc.macro.REPEAT_FOREVER) ;

        // update battery
        self.pBatteryLevel.progress = cc.sys.getBatteryLevel();
        this.schedule( ()=>{
            self.pBatteryLevel.progress = cc.sys.getBatteryLevel();
        },60*5,cc.macro.REPEAT_FOREVER) ;
    }
   
    start () {
         
 
    }

    set circleCnt( cnt : string )
    {
        this.pCircle.string = cnt ;
    }

    set leftMJCnt( cnt : string )
    {
        this.pLeftMJCnt.string = cnt ;
    }

    enterWaitReadyState( pdata : RoomData )
    {
        this.roomState = eClientRoomState.State_WaitReady ;
        this.pWaitReadyStateNode.active = true ;
        this.pGameStateNode.active = false ;

        this.pBtnStartGame.active = pdata.isRoomOpened == false && pdata.isSelfRoomOwner() ;
        this.pBtnReady.active = !this.pBtnStartGame.active ;
    }

    enterGameState( pdata : RoomData )
    {
        this.roomState = eClientRoomState.State_StartGame ;
        this.pWaitReadyStateNode.active = false ;
        this.pGameStateNode.active = true ;
        this.doIndicatorToPlayer(pdata.curActClientIdx) ;
        this.leftMJCnt = pdata.leftMJCnt.toString() ;
        this.pCircleTitle.string = pdata.isCircleType ? "圈数":"局数" ;
        this.circleCnt = pdata.playedCircle + "/" + pdata.totalCircleOrRoundCnt ;
    }

    doIndicatorToPlayer( clientIdx : number , time : number = 15 )
    {
        this.pIndicator.onStartWait(clientIdx, time ) ;
    }

    refresh( data : RoomData )
    {
        this.roomState = data.nRoomState ;
        if ( eClientRoomState.State_WaitReady == data.nRoomState  )
        {
            this.refreshWaitReadyState(data)
        }
        else
        {
            this.refreshGameState(data);
        }
    }

    protected refreshWaitReadyState( data : RoomData )
    {
        this.pWaitReadyStateNode.active = true ;
        this.pGameStateNode.active = false ;
        this.pBtnStartGame.active = data.isRoomOpened == false && data.isSelfRoomOwner() ;
        this.pBtnReady.active = !this.pBtnStartGame.active ;
        let isSelfReady = data.getPlayerDataByClientIdx(0).isReady;
        if ( isSelfReady )
        {
            this.pBtnStartGame.active = false ;
            this.pBtnReady.active = false ;
        }
        this.pLabelRoomID.string = data.roomID + "号" ;
    }

    protected refreshGameState( data : RoomData )
    {
        this.pWaitReadyStateNode.active = false ;
        this.pGameStateNode.active = true ;
        this.leftMJCnt = data.leftMJCnt.toString();
        this.circleCnt = data.playedCircle + "/" + data.totalCircleOrRoundCnt ;
        this.pRoomRuleDesc.string = "房间号: " + data.roomID ;
        this.pCircleTitle.string = data.isCircleType ? "圈数":"局数" ;
        console.log( "this.doIndicatorToPlayer = " + data.curActClientIdx );
        this.doIndicatorToPlayer(data.curActClientIdx ) ;
    }

    onBtnBack()
    {

    }

    onBtnStartGame()
    {
        let msg = { } ;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_SET_READY) ;

        if ( this.roomScene.pRoomData.isSelfRoomOwner )
        {
            let msgdoOpen = {} ;
            this.sendRoomMsg(msgdoOpen,eMsgType.MSG_PLAYER_OPEN_ROOM);
        }
    }

    onBtnReady()
    {
        let msg = { } ;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_SET_READY) ;
        this.pBtnReady.active = false ;
    }

    onBtnWechatInviate()
    {

    }

    onBtnDismissRoom()
    {
        let msg = {} ;
        this.roomScene.sendRoomMsg(msg,eMsgType.MSG_APPLY_DISMISS_VIP_ROOM) ;
    }

    onBtnRecorderVoice()
    {

    }

    onBtnSetting()
    {
        this.pDlgSettting.showDlg();
    }

    onBtnChat()
    {
        if ( CC_DEBUG )
        {
            this.pDlgWantedOneCard.active = true ;
        }
    }
    // update (dt) {}
}
