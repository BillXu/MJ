import recordCell from "../mainScene/record/recordCell";
import Utility from "../../globalModule/Utility";
import VoiceManager from "../../sdk/VoiceManager";

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
enum eRecordState
{
    eState_Init,
    eState_Recording,
    eState_WaitCanncel,
    eState_Uploading,
    eState_Max,
}

@ccclass
export default class VoicRecorder extends cc.Component {

    @property(cc.Node)
    pBtnRecord: cc.Node = null;

    @property(cc.Node)
    pCanncelIcon : cc.Node = null ;

    @property(cc.Node)
    pRecordingIcon : cc.Node = null ;

    @property(cc.Label)
    pRecordingTime : cc.Label = null ;

    maxRecorderSeconds : number = 30 ;
    nReocrdedSeconds : number = this.maxRecorderSeconds ;

    _recordState : eRecordState = eRecordState.eState_Max ;
    nResetStateTimerOut : number = -1 ;

    set recordState( state : eRecordState )
    {
        switch(state)
        {
            case eRecordState.eState_Uploading:
            case eRecordState.eState_Init:
            {
                this.pRecordingIcon.active = false ;
                this.pCanncelIcon.active = false ;
                if ( state == eRecordState.eState_Init && this.nResetStateTimerOut != -1 )
                {
                    clearTimeout( this.nResetStateTimerOut );
                    this.nResetStateTimerOut = -1 ;
                }
            }
            break ;
            case eRecordState.eState_Recording:
            {
                this.pRecordingIcon.active = true ;
                this.pCanncelIcon.active = false ;
            }
            break;
            case eRecordState.eState_WaitCanncel:
            {
                this.pRecordingIcon.active = false ;
                this.pCanncelIcon.active = true ;
            }
            break;
            default:
            console.error( "unknown recorder state " + state );
            return ;
        }
        this._recordState = state ;
    }

    get recordState() : eRecordState
    {
        return this._recordState ;
    }
    // LIFE-CYCLE CALLBACKS:
    onLoad () 
    {
        this.pBtnRecord.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this) ;
        this.pBtnRecord.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.pBtnRecord.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCanncel,this);
        this.pBtnRecord.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.recordState = eRecordState.eState_Init ;
        cc.systemEvent.on(VoiceManager.EVENT_UPLOAED,this.onUpdateRecordFileOk,this) ;
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    onTouchStart()
    {
        if ( this.recordState != eRecordState.eState_Init )
        {
            Utility.showPromptText( "上一条语音消息没有处理完毕，请稍微再试 code =" + this.recordState );
            return ;
        }

        this.unschedule(this.onRecordFrame) ;
        this.recordState = eRecordState.eState_Recording ;
        this.nReocrdedSeconds = this.maxRecorderSeconds ;
        this.schedule(this.onRecordFrame,1,this.maxRecorderSeconds) ;
        this.pRecordingTime.string = "" + this.nReocrdedSeconds ;

        let ret = VoiceManager.getInstance().startRecord("self");
        if ( ret == false )
        {
            this.recordState = eRecordState.eState_Init ;
        }
    }

    onTouchMove( touchEvent : cc.Event.EventTouch )
    {
        let ptPos = touchEvent.getLocation();
        //ptPos = this.pBtnRecord.getParent().convertToNodeSpaceAR(ptPos);
        let isContain = this.pBtnRecord.getBoundingBoxToWorld().contains(ptPos);
        this.recordState = isContain ? eRecordState.eState_Recording : eRecordState.eState_WaitCanncel;
    }

    onTouchEnd()
    {
        this.onFinishRecord();
    }

    onTouchCanncel()
    {
        this.recordState = eRecordState.eState_WaitCanncel ;
        this.onFinishRecord();
    }

    onFinishRecord()
    {
        this.unschedule(this.onRecordFrame) ;
        let ret = VoiceManager.getInstance().stopRecord(this.recordState == eRecordState.eState_Recording) ;
        if ( ret && this.recordState == eRecordState.eState_Recording )
        {
            console.warn( "finish record , stop it, upload recordfile" );
            this.recordState = eRecordState.eState_Uploading ;
            // at most , 20 secons late , we must reset state , avoid player be stoped recording, forever  
            let self = this ;
            this.nResetStateTimerOut = setTimeout(() => {
                console.log( "time out reset state = " + self.recordState );
                if ( self.recordState != eRecordState.eState_Uploading )
                {
                    return ;
                }
                self.recordState = eRecordState.eState_Init ;
            }, 20*1000 );
            return ;
        }
        this.recordState = eRecordState.eState_Init ;
    }

    onRecordFrame()
    {
        if ( this.nReocrdedSeconds > 0 )
        {
            --this.nReocrdedSeconds ;
            this.pRecordingTime.string = "" + this.nReocrdedSeconds;       
        }
        else
        {
            this.onFinishRecord();
        }
    }

    onUpdateRecordFileOk()
    {
        this.recordState = eRecordState.eState_Init ;
    }

    start () {

    }
    // update (dt) {}
}
