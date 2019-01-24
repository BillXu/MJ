// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

function sdkSendEvent( eventID  , detail )
{
    let evet = new cc.Event.EventCustom(eventID,true);
    evet.detail = detail ;
    cc.systemEvent.dispatchEvent(evet) ;
    console.log( "大师的立即发货给sdkSendEvent" + eventID + " detail :" + detail );
}


function sendRequestToPlatform( eventID , jsDetail )
{
    if ( false == cc.sys.isNative )
    {
        cc.warn( "only navtive platform can use this function" );
        return ;
    }

    let jsString = JSON.stringify(jsDetail);
    if (cc.sys.os == cc.sys.OS_ANDROID )
    {
        console.log("android")
        return jsb.reflection.callStaticMethod("SDKHelp/SDKHelp", "onRecievedJsRequest", "(Ljava/lang/String;Ljava/lang/String;)I", eventID, jsString );
    }

    if (cc.sys.os == cc.sys.OS_IOS )
    {
        console.log("ios")
        return jsb.reflection.callStaticMethod("SDKHelp","onRecievedJsRequest:detail:",eventID,jsString);
    }
    console.error( "unknown platform Request do not dispatch" );
    return 0 ;
}

// let SDKHelp = {} ;

// // voice module ;
// let SDK_Voice = {} ;
// let v = SDK_Voice; 
