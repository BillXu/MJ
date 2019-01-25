//
//  GPSLocation.h
//  hello_world-mobile
//
//  Created by 唐弘 on 2019/1/25.
//

#ifndef GPSLocation_h
#define GPSLocation_h
#import <AMapFoundationKit/AMapFoundationKit.h>
#import <MAMapKit/MAMapKit.h>
#import <AMapLocationKit/AMapLocationKit.h>
@class SDKHelp;
@interface GPSLocation : NSObject{

}
@property (nonatomic, strong) MAMapView *mapView;

@property (nonatomic, strong) AMapLocationManager *locationManager;

+(instancetype)GPSdManager;

- (void)configLocationManager;

- (void)cleanUpAction;

- (void)locAction;

- (void)initCompleteBlock;

-(int)onRecievedJsRequest:(NSString*)SDKRequestID detail:(NSString*)jsArg;

-(int)caculateDistance:(double)A_longitude : (double) A_latitude : (double) B_longitude : (double) B_latitude;


@end

#endif /* GPSLocation_h */
