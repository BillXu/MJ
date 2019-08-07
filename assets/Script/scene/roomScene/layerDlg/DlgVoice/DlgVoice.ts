import Prompt from "../../../../globalModule/Prompt";
import VoiceManager from "../../../../sdk/VoiceManager";
import ButtonVoice from "./ButtonVoice";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


//----important
// dlg voice root node can not hide , beacuase some work need be done when dlg was not dispaly 
const {ccclass, property} = cc._decorator;

enum eRecordState
{
    eState_Idle,
    eState_Recording,
    eState_Uploading,
    eState_Max,
} ;

@ccclass
export default class DlgVoice extends cc.Component {

    @property(cc.Node)
    mDlgDisplayNode : cc.Node = null ;

    @property(cc.Sprite)
    mProgress: cc.Sprite = null;

    mState : eRecordState = eRecordState.eState_Idle ;
    mAlreadyTime : number = 0 ;
    mMaxTime : number = 60 ;
    nResetStateTimerOut : number = 0 ;

    @property([cc.Component.EventHandler])
    mOnDlgResult : cc.Component.EventHandler[] = [] ; // ( strFileID : string )

    onLoad()
    {
        cc.systemEvent.on(VoiceManager.EVENT_UPLOAED,this.onUpdateRecordFileOk,this) ;
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    onVoiceButtonCallBack( event : string )
    {
        if ( event == ButtonVoice.BV_EVENT_CANNCEL )
        {
            if ( eRecordState.eState_Recording != this.mState )
            {
                return ;
            }
            this.finishRecorder(true,false) ;
        }
        else if ( event == ButtonVoice.BV_EVENT_DOWN )
        {
            this.startRecorder() ;
        }
        else if ( event == ButtonVoice.BV_EVENT_RELEASE )
        {
            if ( eRecordState.eState_Recording != this.mState )
            {
                return ;
            }
            this.finishRecorder(false,false) ;
        }
        else
        {
            // do not care 
        }
    }

    protected startRecorder()
    {
        if ( eRecordState.eState_Idle != this.mState )
        {
            Prompt.promptText( "上一条语音消息没有处理完毕，请稍后再试 code =" + this.mState );
            return ;
        }

        
        let ret = VoiceManager.getInstance().startRecord("self");
        if ( ret == false )
        {
            Prompt.promptText( "开始录音失败" );
            this.mState = eRecordState.eState_Idle ;
            return ;
        }

        this.mState = eRecordState.eState_Recording ;
        this.mAlreadyTime = 0 ;

        this.mDlgDisplayNode.active = true ;
    }

    update ( dt : number )
    {
        if ( this.mState != eRecordState.eState_Recording  )
        {
            return ;
        }

        this.mAlreadyTime += dt ;
        if ( this.mAlreadyTime > this.mMaxTime )
        {
            this.mAlreadyTime = this.mMaxTime ;
            this.finishRecorder(false,true);
        }

        this.mProgress.fillRange = this.mAlreadyTime / this.mMaxTime ;
    }

    protected finishRecorder( isCanncel : boolean , isTimeOut : boolean )
    {
        let ret = VoiceManager.getInstance().stopRecord( isCanncel == false , 15000 ) ; // max wait 19 seconds ;
        if ( ret && !isCanncel )
        {
            console.warn( "finish record , stop it, upload recordfile" );
            this.mState = eRecordState.eState_Uploading ;
            // at most , 20 secons late , we must reset state , avoid player be stoped recording, forever  
            let self = this ;
            this.nResetStateTimerOut = setTimeout(() => {
                console.log( "time out reset state = " + self.mState );
                if ( self.mState != eRecordState.eState_Uploading )
                {
                    return ;
                }
                self.mState = eRecordState.eState_Idle ;
            }, 16*1000 );
            return ;
        }

        if ( !isCanncel )
        {
            Prompt.promptText( "结束录音发生意外code = " + ret );
        }

        this.mState = eRecordState.eState_Idle ;

        this.mDlgDisplayNode.active = false ;
    }

    protected onUpdateRecordFileOk( event : cc.Event.EventCustom )
    {
        clearTimeout(this.nResetStateTimerOut);
        this.mState = eRecordState.eState_Idle ;

        let detial : Object = event.detail ;
        let isOk = detial["isOk"] ;
        let strFileID = detial["fileName"] ;
        if ( isOk )
        {
            cc.Component.EventHandler.emitEvents( this.mOnDlgResult,strFileID );
        }
        else
        {
            Prompt.promptText( "发送语音消息失败" );
        }
    }
}
