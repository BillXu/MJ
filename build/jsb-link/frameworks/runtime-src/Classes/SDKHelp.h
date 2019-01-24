//
//  SDKHelp.h
//  hello_world
//
//  Created by 唐弘 on 2019/1/21.
//

#ifndef SDKHelp_h
#define SDKHelp_h
//#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
//using namespace std;

//@class SDKHelp{
//public:
//    SDKHelp();
//    ~SDKHelp();
//    static SDKHelp* getInstace();
//    static int onRecievedJsRequest( NSString* SDKRequestID, NSString* jsArg );
//    void sendJsEvent( NSString* eventID , NSString* jsDetail );
//private:
//    static SDKHelp* m_sInstace;
//};
//#endif /* SDKHelp_h */
#import <UIKit/UIKit.h>
@class WXApiManager;
//@class GClould;
extern int const haveDeal = -1;
@interface SDKHelp : NSObject


+(int)onRecievedJsRequest:(NSString *)SDKRequestID detail:(NSString *)jsArg;
+(void )sendJsEvent:(NSString *)str detail:(NSString *)tit;
@property(nonatomic, readonly) SDKHelp* SDKHelp;

@end
#endif
