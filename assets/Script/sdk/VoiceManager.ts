import Utility from "../globalModule/Utility";
import { SDK_DEF } from "./SDK_DEF";

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
enum GCloudVoiceCompleteCode {
    GV_ON_NET_ERR = 5,
    GV_ON_MESSAGE_KEY_APPLIED_SUCC = 7,
    GV_ON_MESSAGE_KEY_APPLIED_TIMEOUT = 8,
    GV_ON_MESSAGE_KEY_APPLIED_SVR_ERR = 9,
    GV_ON_MESSAGE_KEY_APPLIED_UNKNOWN = 10,
    GV_ON_UPLOAD_RECORD_DONE = 11,
    GV_ON_UPLOAD_RECORD_ERROR = 12,
    GV_ON_DOWNLOAD_RECORD_DONE = 13,
    GV_ON_DOWNLOAD_RECORD_ERROR = 14,
    GV_ON_PLAYFILE_DONE = 21,
    GV_ON_UNKNOWN = 23,
} ;

enum GCloudVoiceErrno
{
    GCLOUD_VOICE_SUCC = 0,
    GCLOUD_VOICE_AUTHKEY_ERR = 12289,
    GCLOUD_VOICE_NEED_AUTHKEY = 12292,
    GCLOUD_VOICE_AUTHING = 12298,
} ;

class VoiceItem
{
    fileID : string = "" ;
    playerUID : number = 0 ;
}

@ccclass
export default class VoiceManager extends cc.Component {

    private static s_voiceMgr : VoiceManager = null ;
    private mDownloadVoiceList : VoiceItem[] = [] ;
    private mPlayerVoiceList : VoiceItem[] = [] ;
    private mPlayersLastVoice : { [key : number] : VoiceItem  } = {} ;

    private APP_ID : string = "1123375188" ;
    private APP_KEY : string = "fecbbfdd3174e7d3493583a413b4da1c" ;
    private isInit : boolean = false ;
    private TEMP_PATH : string = "" ;
    get isPlayVoiceChannelIdle() : boolean
    {
        return this.mPlayerVoiceList.length == 0 ;
    }
    private isApplyedKey : boolean = false ;

    static EVENT_UPLOAED : string = "VOICE_EVENT_UPLOAED"; // { code : 2, isOk : false , fileName : "" }
    static EVENT_PLAY_FINISH : string = "VOICE_EVENT_PLAY_FINISH"; // { code : 2 , fileName : "" }
    static EVENT_APPLY_KEY : string  = "VOICE_EVENT_APPLY_KEY" ;  // { code : 2 }
    static EVENT_DOWNLOADED : string  = "VOICE_EVENT_DOWNLOADED" ; // { code : 2 , fileName : "" }

    static EVENT_QUEUE_START_PLAY : string = "EVENT_QUEUE_START_PLAY" ; // { uid : 1 }
    static EVENT_QUEUE_PLAY_FINISH : string = "EVENT_QUEUE_START_PLAY" ; // { uid : 1 }

    static SDK_VOICE_INIT : string = "SDK_VOICE_INIT" ; // { appID : "adf", appKey : "adf", playerTag : "uid" }
    static SDK_VOICE_RECORD : string = "SDK_VOICE_RECORD"; // { fullPathFile : "c://music/r.mp3" }
    static SDK_VOICE_STOP_RECORD : string = "SDK_VOICE_STOP_RECORD" ; // { isUpload : 1 , uploadTimeout : 4000 } // timeout is milliseconds ;
    static SDK_VOICE_DOWNLOAD_FILE : string = "SDK_VOICE_DOWNLOAD_FILE" ; // { fileID : "23s", path : "c://abc/", timeout : 2000 } // timeout is milliseconds ;
    static SDK_VOICE_PLAY_FILE : string = "SDK_VOICE_PLAY_FILE" ; // { fullPathFile : "c://music/r.mp3" }

    public static getInstance() : VoiceManager
    {
        if ( VoiceManager.s_voiceMgr == null )
        {
            VoiceManager.s_voiceMgr = new VoiceManager();
            if ( CC_JSB )
            {
                this.s_voiceMgr.TEMP_PATH = jsb.fileUtils.getWritablePath();
                console.log( " this.s_voiceMgr.TEMP_PATH :" + VoiceManager.s_voiceMgr.TEMP_PATH );
            } 
        }

        return VoiceManager.s_voiceMgr ;
    } 

    public init( playerTag : string ) : boolean
    {
        if ( this.isInit )
        {
            console.error( "already init voice mgr do not init again" );
            return false;
        }

        this.unRegisterEvent();
        this.registerEvent();
        // do init work
        let nRet = sendRequestToPlatform(VoiceManager.SDK_VOICE_INIT,{ appID : this.APP_ID, appKey : this.APP_KEY, playerTag : playerTag } ) ;
        if ( nRet != GCloudVoiceErrno.GCLOUD_VOICE_SUCC )
        {
            Utility.showTip("语音模块初始化失败，请开启语音授权后，关闭进程重启app再试一下!code = " + nRet ) ;
            return false;
        }

        this.isInit = true ;
        return this.isInit ;
    }

    protected registerEvent()
    {
        //cc.systemEvent.on(VoiceManager.EVENT_UPLOAED,this.onEvent,this) ;
        cc.systemEvent.on(VoiceManager.EVENT_PLAY_FINISH,this.onEvent,this) ;
        cc.systemEvent.on(VoiceManager.EVENT_APPLY_KEY,this.onEvent,this) ;
        cc.systemEvent.on(VoiceManager.EVENT_DOWNLOADED,this.onEvent,this) ;
    }

    unRegisterEvent()
    {
        cc.systemEvent.targetOff(this);
    }

    onEvent( event : cc.Event.EventCustom )
    {
        let eventID = event.getEventName();
        let jsDetail = event.detail ;
        switch (eventID )
        {
            case VoiceManager.EVENT_APPLY_KEY:
            {
                this.onApplyKey( parseInt(jsDetail["code"]) ) ;  
            }
            break;
            case VoiceManager.EVENT_DOWNLOADED:
            {
                this.onDownloadedFile( parseInt(jsDetail["code"]),jsDetail["fileName"] ) ;
            }
            break;
            case VoiceManager.EVENT_PLAY_FINISH:
            {
                this.onPlayedFiled(parseInt(jsDetail["code"]),jsDetail["fileName"] ) ;
            }
            break;
            // case VoiceManager.EVENT_UPLOAED:
            // {

            // }
            // break;
            default:
            console.error( "unknown event voice = " + eventID );
        }
    }

    startRecord( fileName : string ) : boolean
    {
        if ( this.isInit == false )
        {
            Utility.showPromptText( "语音模块没有初始化，暂无法使用语音消息" );
            return false;
        }

        if ( this.isApplyedKey == false )
        {
            Utility.showPromptText( "服务不可用" );
            return false ;
        }

        let nRet : number = sendRequestToPlatform(VoiceManager.SDK_VOICE_RECORD,{ fullPathFile : this.TEMP_PATH + fileName }) ;
        if ( nRet == GCloudVoiceErrno.GCLOUD_VOICE_AUTHKEY_ERR )
        {
            Utility.showPromptText( "语音授权失败" );
            return false;
        }

        if ( nRet == GCloudVoiceErrno.GCLOUD_VOICE_NEED_AUTHKEY )
        {
            Utility.showPromptText( "需要语音授权" );
            return false;
        }

        if ( nRet == GCloudVoiceErrno.GCLOUD_VOICE_AUTHING )
        {
            Utility.showPromptText( "正在等待语音授权,请稍候" );
            return false;
        }

        if ( nRet != GCloudVoiceErrno.GCLOUD_VOICE_SUCC )
        {
            Utility.showPromptText( "录音失败code="+nRet );
            return false;
        }
        return true ;
    }

    stopRecord( isUpLoad : boolean , upLoadTimeOutMiliseconds : number = 6000 ) : boolean
    {
        if ( this.isInit == false )
        {
            Utility.showPromptText( "语音模块没有初始化，暂无法使用语音消息" );
            return false;
        }

        let nRet : number = sendRequestToPlatform(VoiceManager.SDK_VOICE_STOP_RECORD,{ isUpload : (isUpLoad ? 1 : 0) , uploadTimeout : upLoadTimeOutMiliseconds } ) ;
        if ( nRet != GCloudVoiceErrno.GCLOUD_VOICE_SUCC )
        {
            Utility.showPromptText( "停止录音错误code " + nRet );
            return false;
        }
        return true ;
    }

    private downloadFile( fileName : string, downloadTimeOutMiliseconds : number = 6000 ) : boolean
    {
        let nRet : number = sendRequestToPlatform(VoiceManager.SDK_VOICE_DOWNLOAD_FILE,{ fileID :fileName, path : this.TEMP_PATH, timeout : downloadTimeOutMiliseconds }) ;
        if ( nRet != GCloudVoiceErrno.GCLOUD_VOICE_SUCC )
        {
            Utility.showPromptText( "下载录音错误code " + nRet );
            return false;
        }
        return true ;
    }

    protected onDownloadedFile( code : number , fileName : string )
    {
        let downloaded = this.mDownloadVoiceList.shift();
        if ( GCloudVoiceCompleteCode.GV_ON_DOWNLOAD_RECORD_DONE == code && this.doPlayFile(downloaded) )
        {
            

        }
        else
        {
            console.error( "down load file failed = " + fileName + "code = " + code );
            //this.onPlayedFiled( code,fileName);
        }

        if ( this.mDownloadVoiceList.length > 0 )
        {
            this.downloadFile(this.mDownloadVoiceList[0].fileID ) ;
        }
    }

    playVoice( fileName : string , playerUID : number ) : boolean
    {
        if ( this.isInit == false )
        {
            console.warn( "语音模块没有初始化，暂无法使用语音消息" );
            return false;
        }

        if ( this.isPlayVoiceChannelIdle == false )
        {
            console.warn( "语音正在处理，请稍等" );
            return false;
        }

        if ( this.isApplyedKey == false )
        {
            console.warn( "服务器不可用" );
            return false ;
        }
        
        let vi = new VoiceItem();
        vi.fileID = fileName ;
        vi.playerUID = playerUID ;
        this.mDownloadVoiceList.push( vi );
        if ( this.mDownloadVoiceList.length == 1 )
        {
            if ( this.downloadFile(vi.fileID) == false )
            {
                console.log( "下载文件调用返回失败" );
                this.mDownloadVoiceList.shift();
                return false ;
            }
        }
        return true ;
    }

    playLastVoice( playerUID : number ) : boolean
    {
        let v = this.mPlayersLastVoice[playerUID] ;
        if ( v == null )
        {
            return false ;
        }
        
        if ( this.doPlayFile(v) == false )
        {
            this.mPlayersLastVoice[playerUID] = null ;
            return false ;
        }
        return true ;
    }

    private doPlayFile( voice : VoiceItem ) : boolean
    {
        this.mPlayerVoiceList.push( voice );
        if ( this.mPlayerVoiceList.length == 1 )
        {
            let nRet : number = sendRequestToPlatform(VoiceManager.SDK_VOICE_PLAY_FILE,{ fullPathFile : this.TEMP_PATH + voice.fileID }) ;
            if ( nRet != GCloudVoiceErrno.GCLOUD_VOICE_SUCC )
            {
                Utility.showPromptText( "播放录音错误code " + nRet );
                this.mPlayerVoiceList.shift();
                return false;
            }

            let pEvent = new cc.Event.EventCustom(VoiceManager.EVENT_QUEUE_START_PLAY,true) ;
            pEvent.detail = {} ;
            pEvent.detail["uid"] = voice.playerUID ;
            cc.systemEvent.dispatchEvent(pEvent);
        }
        return true ;
    }

    protected onPlayedFiled( code : number , fileName : string )
    {
        let fok = this.mPlayerVoiceList.shift();

        if ( GCloudVoiceCompleteCode.GV_ON_PLAYFILE_DONE != code )
        {
            console.error( "played voice failed code = " + code + " file = " + fileName );
        }
        else
        {
            this.mPlayersLastVoice[fok.playerUID] = fok ;
        }
        
        let pEvent = new cc.Event.EventCustom(VoiceManager.EVENT_QUEUE_PLAY_FINISH,true) ;
        pEvent.detail = {} ;
        pEvent.detail["uid"] = fok.playerUID ;
        cc.systemEvent.dispatchEvent(pEvent);

        // check have more file to player ;
        while ( this.mPlayerVoiceList.length > 0 )
        {
            let nRet : number = sendRequestToPlatform(VoiceManager.SDK_VOICE_PLAY_FILE,{ fullPathFile : this.TEMP_PATH + this.mPlayerVoiceList[0].fileID }) ;
            if ( nRet != GCloudVoiceErrno.GCLOUD_VOICE_SUCC )
            {
                Utility.showPromptText( "播放录音错误code " + nRet );
                this.mPlayerVoiceList.shift();
                continue;
            }

            let pEvent = new cc.Event.EventCustom(VoiceManager.EVENT_QUEUE_START_PLAY,true) ;
            pEvent.detail = {} ;
            pEvent.detail["uid"] = this.mPlayerVoiceList[0].playerUID ;
            cc.systemEvent.dispatchEvent(pEvent);
            break ;
        }
    }

    protected onApplyKey( code : number )
    {
        if ( code != GCloudVoiceCompleteCode.GV_ON_MESSAGE_KEY_APPLIED_SUCC )
        {
            Utility.showTip( "申请语音服务失败");
            this.isApplyedKey = false ;
            this.isInit = false ; // some later , we che req apply key again ;
            return ;
        }
        this.isApplyedKey = true ;
        console.log("申请语音服务ok");
    }   
} ;

