//
//  WXApiManager.h
//  hello_world
//
//  Created by 唐弘 on 2019/1/21.
//

//#ifndef WXApiManager_h
//#define WXApiManager_h
//
//
//#endif /* WXApiManager_h */
#import "WXApi.h"
@class SDKHelp;
@interface WXApiManager : NSObject{

}

+(instancetype)sharedManager;

-(void)RegisterAppID:(NSString*)app_id;

-(void)SendAuthRequest;

-(int)onRecievedJsRequest:(NSString*)SDKRequestID detail:(NSString*)jsArg;

-(BOOL)ShareToChatScene:(NSString*)content_txt;

-(BOOL)ShareToFriendCircle:(NSString*)content_txt;

-(BOOL)ShareLinkToChatScene:(NSString*)content_link Title:(NSString*)title_txt Description:(NSString*)desc_txt;

-(BOOL)ShareLinkToFriendCircle:(NSString*)content_link Title:(NSString*)title_txt Description:(NSString*)desc_txt;

-(BOOL)ShareImageToChatScene:(NSString*)path;

-(BOOL)ShareImageFriendCircle:(NSString*)path;

//+(BOOL)ShareImageToChatScene:(NSString*)file_path Title:(NSString*)title_txt Description:(NSString*)desc_txt;

+(void)StartPay:(NSString* )partner_id PrepayId:(NSString*)prepay_id NonceStr:(NSString*)nonce_str TimeStamp:(UInt32)timestamp Sign:(NSString*)sign;

+(BOOL)CheckWXInstalled;

//+(NSString *) getIPWithHostName:(const NSString *)hostName;

-(UIImage*)scaleToSize:(CGSize)size Target:(UIImage*)target_img;

@end

