//
//  SDKHelp.m
//  hello_world-mobile
//
//  Created by 唐弘 on 2019/1/15.
//

#import <Foundation/Foundation.h>
#include "SDKHelp.h"
#include "WXApiManager.h"
#include "GClould.h"
#include "GPSLocation.h"
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos2d.h"
//using namespace std;
@implementation SDKHelp
+(int)onRecievedJsRequest:(NSString *)SDKRequestID detail:(NSString *)jsArg{
    NSString* js = nullptr ;
    int num = 20;
    @try {
        js = jsArg;
        WXApiManager* WXapi =[WXApiManager sharedManager];
        int ret = [WXapi onRecievedJsRequest:SDKRequestID detail:jsArg];
        if(ret != haveDeal){
            return ret;
        }
        ret = GClould::GClouldManager()->onRecievedJsRequest(SDKRequestID, jsArg);
//        GCApi = [GClould GClouldManager];
//        ret = [GCApi onRecievedJsRequest:SDKRequestID detail:jsArg];
        if(ret != haveDeal){
            return ret;
        }
        ret = [[GPSLocation GPSdManager] onRecievedJsRequest:SDKRequestID detail:jsArg];
        if(ret != haveDeal){
            return ret;
        }
    }
    @catch ( NSException *exception )
    {
        NSLog(@"SDKHelp 解析json字符串错误");
        return  num ;
    }
    @finally
    {
        // Cleanup, in both success and fail cases
        NSLog( @"In finally block");
    }
     NSLog( @"In finally block");
    return num;
}


+(void) sendJsEvent:(NSString*) eventID  detail:(NSString*) jsDetail {
    
//    NSError *parseError = nil;
//
//    NSData  *jsonData = [NSJSONSerialization dataWithJSONObject:jsDetail
//                                                        options:NSJSONWritingPrettyPrinted
//                                                          error:&parseError];
    
    std::string strRet =  [eventID UTF8String];
    std::string js =  [jsDetail UTF8String];
    //"String js = "sdkSendEvent(\"" + eventID + "\"," + strDetail + ");" ;"
    std::string jsCallStr = cocos2d::StringUtils::format("sdkSendEvent(\"%s\" ,%s);", strRet.c_str(),js.c_str());
    se::Value *ret = new se::Value();
    se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str() , -1 , ret);
    NSLog(@"jsCallStr rtn = %s", jsCallStr.c_str());
}

@end
