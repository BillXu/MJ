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

export enum eWechatShareDestType
{
    eDest_Firend = 1,
    eDest_TimeLine = 2,
    eDest_Max,
} ;

@ccclass
export default class WechatManager  {

    private APP_ID : string = "wx7858ac6ee1b0b978" ;
    private APP_KEY : string = "b7b23107433cb9ac13bf46d3151f8011" ;
    private access_token : string = "" ;
    static s_instance : WechatManager = null ;

    static EVENT_WECHAT_CODE : string = "EVENT_WECHAT_CODE" ; // { errorCode : 0 , code : "" } 
    static EVENT_SHARE_RESULT : string = "EVENT_SHARE_RESULT" ; // { isOk : 0 , actFlag : "" } 
    static EVENT_RECIEVED_WECHAT_INFO : string = "EVENT_RECIEVED_WECHAT_INFO" ; // { isOk : 0 , unionid : "",nickname : "" ,sex : 1 , headimgurl : "" }
    static EVENT_WECHAT_SHARE_RESULT : string = "EVENT_WECHAT_SHARE_RESULT"; // { isOk : 0 , actionTag : "" }

    static SDK_WECHAT_INIT : string = "SDK_WECHAT_INIT" ; // { appID : "dsjfa" }
    static SDK_WECHAT_AUTHOR : string = "SDK_WECHAT_AUTHOR" ; // {} 
    static SDK_WECHAT_SHARE_TEXT : string = "SDK_WECHAT_SHARE_TEXT" ; // { strContent : "aa", type : eWechatShareDestType, actionTag : "aa" }
    static SDK_WECHAT_SHARE_LINK : string = "SDK_WECHAT_SHARE_LINK" ; // { strLink : "http://abc.com", type : eWechatShareDestType, strTitle : "hello", strDesc : "desc", actionTag : "tag"}
    static SDK_WECHAT_SHARE_IMAGE :string = "SDK_WECHAT_SHARE_IMAGE" ; // { file : "c://hello/a.png" , type : eWechatShareDestType , actionTag : "aa" }

    static getInstance() : WechatManager
    {
        if ( WechatManager.s_instance == null )
        {
            WechatManager.s_instance = new WechatManager();
            WechatManager.s_instance.init();
        }
        return WechatManager.s_instance ;
    }

    private init()
    {
        this.registerEvent();

        sendRequestToPlatform(WechatManager.SDK_WECHAT_INIT,{ appID : this.APP_ID } ) ;
        return ;
    }

    private registerEvent()
    {
        cc.systemEvent.on(WechatManager.EVENT_WECHAT_CODE,this.onEvent,this);
    }

    unregisterEvent()
    {
        cc.systemEvent.targetOff(this);
    }

    reqAuthor()
    {
        sendRequestToPlatform(WechatManager.SDK_WECHAT_AUTHOR,{} ) ;
        return ;
        if ( CC_JSB && cc.sys.ANDROID )
        {
            jsb.reflection.callStaticMethod( SDK_DEF.PACKAGE_NAME_PATH + "WechatManager", "JSreqAuthor", "()V" );
        }
        else
        {
            console.warn( "other platform not implement reqAuthor " );
        }
    }

    onEvent( event : cc.Event.EventCustom )
    {
        let eventID = event.getType();
        switch( eventID )
        {
            case WechatManager.EVENT_WECHAT_CODE:
            {
                let errocode = event.detail["errorCode"] ;
                if ( errocode )
                {
                    let event = new cc.Event.EventCustom(WechatManager.EVENT_RECIEVED_WECHAT_INFO,true) ;
                    event.detail = {} ;
                    event.detail["isOk"] = 0 ; 
                    cc.systemEvent.dispatchEvent(event) ;
                    console.error( "获取授权失败code="+errocode );
                    return ;
                }
                else
                {
                    this.requestAccessToken(event.detail["code"]) ;
                }
            }
            break;
        }
    }

    private requestAccessToken( code : string )
    {

        let url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + this.APP_ID + "&secret="+this.APP_KEY+"&code="+code+"&grant_type=authorization_code" ;
        if ( CC_DEBUG )
        {
            console.log( "uirl ==== " + url );
        }
        var xhr = new XMLHttpRequest();
        let self = this ;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                let js : Object[] = JSON.parse(response) ;
                if ( js == null || js["access_token"] == null )
                {
                    let event = new cc.Event.EventCustom(WechatManager.EVENT_RECIEVED_WECHAT_INFO,true) ;
                    event.detail = {} ;
                    event.detail["isOk"] = 0 ; 
                    cc.systemEvent.dispatchEvent(event) ;
                    console.error( "获取授权令牌失败code=" + (( js == null ) ? "unknown" : js["errmsg"]) );
                }
                else
                {
                    self.access_token = js["access_token"] ;
                    self.requestPlayerWechatInfo(js["access_token"],js["openid"]);
                }
  
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }

    protected requestPlayerWechatInfo( token : string , openID : string )
    {
        let url = "https://api.weixin.qq.com/sns/userinfo?access_token="+token+"&openid="+openID ;
 
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                let js : Object[] = JSON.parse(response) ;
                if ( js == null || js["nickname"] == null )
                {
                    let event = new cc.Event.EventCustom(WechatManager.EVENT_RECIEVED_WECHAT_INFO,true) ;
                    event.detail = {} ;
                    event.detail["isOk"] = 0 ; 
                    cc.systemEvent.dispatchEvent(event) ;
                    console.error( "获取用户信息失败code=" + (( js == null ) ? "unknown" : js["errmsg"]) );
                }
                else
                {
                    let event = new cc.Event.EventCustom(WechatManager.EVENT_RECIEVED_WECHAT_INFO,true) ;
                    event.detail = js ;
                    event.detail["isOk"] = 1 ; 
                    cc.systemEvent.dispatchEvent(event) ;
                    console.error( "获取用户信息成功" );
                }
  
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }

    shareTextWechat( strContent : string,type : eWechatShareDestType, strTitle : string, actionTag : string= "defaultTag" )
    {
        let jsArg = {} ;
        jsArg["strContent"] = strContent;
        jsArg["type"] = type;
        jsArg["actionTag"] = actionTag ;
        sendRequestToPlatform(WechatManager.SDK_WECHAT_SHARE_TEXT,jsArg) ;
        return ;

        if ( CC_JSB && cc.sys.ANDROID )
        {
            jsb.reflection.callStaticMethod( SDK_DEF.PACKAGE_NAME_PATH + "WechatManager", "JSshareTextToWechat", "(Ljava/lang/String;ILjava/lang/String;Ljava/lang/String;)Z",strContent, type,strTitle,actionTag );
        }
        else
        {
            console.warn( "other platform not implement shareTextWechat " );
        }
    }

    shareLinkWechat( strLink : string,type : eWechatShareDestType, strTitle : string, strDesc : string, actionTag : string= "defaultTag" )
    {
        sendRequestToPlatform(WechatManager.SDK_WECHAT_SHARE_LINK,{ strLink : strLink , type : type , strTitle : strTitle , strDesc : strDesc, actionTag : actionTag } ) ;
        return ;
        if ( CC_JSB && cc.sys.ANDROID )
        {
            jsb.reflection.callStaticMethod( SDK_DEF.PACKAGE_NAME_PATH + "WechatManager", "JSshareLinkToWechat", "(Ljava/lang/String;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Z",strLink,type, strTitle,strDesc,actionTag );
        }
        else
        {
            console.warn( "other platform not implement shareLinkWechat " );
        }
    }

    shareImageWechat( pCaptureNode: cc.Node ,type : eWechatShareDestType, actionTag : string = "defaultTag" )
    {
        let strPathFile = "" ;
        if ( CC_JSB )
        {
            strPathFile = jsb.fileUtils.getWritablePath() + "screen_shoot.png" ;
        }

        this.captureScreen(pCaptureNode,strPathFile) ;

        sendRequestToPlatform(WechatManager.SDK_WECHAT_SHARE_IMAGE,{ file : strPathFile,type : type , actionTag : actionTag}) ;
        return ;
        if ( CC_JSB && cc.sys.ANDROID )
        {
            jsb.reflection.callStaticMethod( SDK_DEF.PACKAGE_NAME_PATH + "WechatManager", "JSshareImageToWeChat", "(Ljava/lang/String;ILjava/lang/String;)Z",strPathFile,type,actionTag );
        }
        else
        {
            console.warn( "other platform not implement shareImageWechat " );
        }
    }

    public captureScreen(parent: cc.Node, filePath: string)
    {
        if ( cc.sys.isNative == false )
        {
            console.warn( "platform is not native , so can not capture screen" );
            return false ;
        }

        if ( parent == null )
        {
            console.error( "capture node is null" );
            return ;
        }

        console.log( "captureScreen(parent: cc.Node, filePath: string)" );

        let node = new cc.Node();
        node.setParent(parent);
        node.width = parent.getContentSize().width;
        node.height = parent.getContentSize().height;
        let camera = node.addComponent(cc.Camera);
        // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
        let texture = new cc.RenderTexture();
        texture.initWithSize(node.width, node.height);
        camera.targetTexture = texture;

        // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
        parent.scaleY = -1;
        camera.render(parent);
        parent.scaleY = 1;

        // 这样我们就能从 RenderTexture 中获取到数据了
        let data = texture.readPixels();
        let width = texture.width;
        let height = texture.height;
        let fullPath = filePath;
        if (jsb.fileUtils.isFileExist(fullPath)) {
        jsb.fileUtils.removeFile(fullPath);
        }

        return jsb.saveImageData(data, width, height, fullPath);
    }
}
