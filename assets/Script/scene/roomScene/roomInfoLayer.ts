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
import { eDeskBg, clientEvent, eMJBg, SceneName } from "../../common/clientDefine"
import ClientData from "../../globalModule/ClientData";
import Utility from "../../globalModule/Utility";
import DlgRoomChat from "./dlgRoomChat";
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

    @property(cc.Sprite)
    pRoomRuleBg : cc.Sprite = null ;
    @property(cc.Label)
    pRoomRuleDesc : cc.Label = null ;
    // LIFE-CYCLE CALLBACKS:

    @property(Indicator)
    pIndicator : Indicator = null ;
    
    @property(cc.Node)
    pDlgWantedOneCard : cc.Node = null ;

    @property(DlgSetting)
    pDlgSettting : DlgSetting = null ;

    @property(cc.Sprite)
    pDeskBg : cc.Sprite = null ;

    @property(DlgRoomChat)
    pDlgChat : DlgRoomChat = null ;

    roomState : eClientRoomState = eClientRoomState.State_WaitReady ;
    onLoad ()
    {
        this.refreshDeskBg();
        this.onMjBgChanged();
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

        // reg event ;
        cc.systemEvent.on(clientEvent.setting_update_deskBg,this.refreshDeskBg,this) ;
        cc.systemEvent.on(clientEvent.setting_update_mjBg,this.onMjBgChanged,this);
    }
   
    onDestroy()
    {
        cc.systemEvent.targetOff(this) ;
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
        this.circleCnt = pdata.playedCircle + "/" + pdata.totalCircleOrRoundCnt ;
    }

    doIndicatorToPlayer( clientIdx : number , time : number = 15 )
    {
        this.pIndicator.onStartWait(clientIdx, time ) ;
    }

    refresh( data : RoomData )
    {
        this.roomState = data.nRoomState ;
        this.pLabelRoomID.string = data.roomID + "号" ;
        this.pRoomRuleDesc.string = "房间号: " + data.roomID + "    " + data.rule ;
        this.pCircleTitle.string = data.isCircleType ? "圈数":"局数" ;
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
    }

    protected refreshGameState( data : RoomData )
    {
        this.pWaitReadyStateNode.active = false ;
        this.pGameStateNode.active = true ;
        this.leftMJCnt = data.leftMJCnt.toString();
        this.circleCnt = data.playedCircle + "/" + data.totalCircleOrRoundCnt ;
        console.log( "this.doIndicatorToPlayer = " + data.curActClientIdx );
        this.doIndicatorToPlayer(data.curActClientIdx ) ;
    }

    onBtnBack()
    {
        let msg = {} ;
        this.sendRoomMsg(msg,eMsgType.MSG_PLAYER_LEAVE_ROOM,( js : Object )=>{
            let ret = js["ret"] ;
            if ( ret == 0 || 1 == ret )
            {
                console.log( "leave room ret = " + ret );
                cc.director.loadScene(SceneName.Scene_Main);
            }
            else
            {
                Utility.showPromptText( "当前不能离开房间code=" + ret );
            }
            return true ;
        }) ;
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

        this.pDlgChat.showDlg(null,this);
    }

    refreshDeskBg()
    {
        let bg : eDeskBg = ClientData.getInstance().deskBgIdx;
        if ( bg == null )
        {
            bg = eDeskBg.eDesk_Green ;
        }

        let bgname = "desk/" ;
        let indicator = "indicator/xymjdh_vipindicator0" ;
        switch ( bg )
        {
            case eDeskBg.eDesk_Blue:
            {
                bgname += "cardtable_bg_color1/";
                indicator = "indicator/xymjdh_vipindicatorblue0" ;
            }
            break ;
            case eDeskBg.eDesk_Classic:
            {
                bgname += "cardtable_bg_color0/";
            }
            break ;
            case eDeskBg.eDesk_Green:
            {
                bgname += "cardtable_bg_color3/";
            }
            break ;
            case eDeskBg.eDesk_Wood:
            {
                bgname += "cardtable_bg_color2/";
                indicator = "indicator/xymjdh_vipindicatoryellow0" ;
            }
            break;
            default:
            {
                cc.error( "unknown unkown bg type = " + bg );
            }
            break;
        }

        this.pIndicator.onDeskChanged(indicator);
        
        let self = this ;
        cc.loader.loadRes(bgname + "cardtable_bg_ditu" ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error( "loading bg sprite error " +  bgname );
                return ;
            }
            self.pDeskBg.spriteFrame = spriteFrame ;
        });

        let rulebg = this.pRoomRuleBg ;
        cc.loader.loadRes(bgname + "waitplayer_bg_tiao" ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error( "loading bg sprite error " +  bgname );
                return ;
            }
            rulebg.spriteFrame = spriteFrame ;
        });
    }

    onMjBgChanged()
    {
        let idx : eMJBg = ClientData.getInstance().mjBgIdx ;
        let vMJ = [] ;
        vMJ[eMJBg.eMJ_Blue] = "cards/pai_lanse" ;
        vMJ[eMJBg.eMJ_Golden] = "cards/pai_huangse" ;
        vMJ[eMJBg.eMJ_Green] = "cards/pai_lvse" ;
        let mjIcon = this.pLeftUpSmallMJ ;
        cc.loader.loadRes( vMJ[idx] ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error( "loading smallIcon ");
                return ;
            }
            mjIcon.spriteFrame = spriteFrame ;
        });


        // mj wall
        let vMJWall = [] ;
        vMJWall[eMJBg.eMJ_Blue] = "cards/waitplayer_bg_mahjiong" ;
        vMJWall[eMJBg.eMJ_Golden] = "cards/waitplayer_bg_mahjiong_gold" ;
        vMJWall[eMJBg.eMJ_Green] = "cards/waitplayer_bg_mahjiong_green" ;
        let mjWall = this.pMJWall ;
        cc.loader.loadRes( vMJWall[idx] ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error( "loading mj wall ");
                return ;
            }
            mjWall.spriteFrame = spriteFrame ;
        });
    }
    // update (dt) {}
}
