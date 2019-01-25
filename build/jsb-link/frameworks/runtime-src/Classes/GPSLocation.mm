//
//  GPSLocation.m
//  hello_world-mobile
//
//  Created by 唐弘 on 2019/1/25.
//
#include "GPSLocation.h"
#include "SDKHelp.h"
#import "cocos2d.h"
#import <AMapFoundationKit/AMapFoundationKit.h>

#import <AMapLocationKit/AMapLocationKit.h>
#import <Foundation/Foundation.h>

#define DefaultLocationTimeout  3
#define DefaultReGeocodeTimeout 6

@interface GPSLocation () <MAMapViewDelegate, AMapLocationManagerDelegate>

@property (nonatomic, copy) AMapLocatingCompletionBlock completionBlock;

@end

@implementation GPSLocation
+(instancetype)GPSdManager {
    static dispatch_once_t onceToken;
    static GPSLocation *instance;
    dispatch_once(&onceToken, ^{
        instance = [[GPSLocation alloc] init];
    });
    return instance;
}
- (void)configLocationManager
{
    self.locationManager = [[AMapLocationManager alloc] init];
    
    [self.locationManager setDelegate:self];
    
    //设置期望定位精度
    [self.locationManager setDesiredAccuracy:kCLLocationAccuracyHundredMeters];
    
//    //设置不允许系统暂停定位
//    [self.locationManager setPausesLocationUpdatesAutomatically:NO];
//
//    //设置允许在后台定位
//    [self.locationManager setAllowsBackgroundLocationUpdates:YES];
    
    //设置定位超时时间
    [self.locationManager setLocationTimeout:DefaultLocationTimeout];
    
    //设置逆地理超时时间
    [self.locationManager setReGeocodeTimeout:DefaultReGeocodeTimeout];
    
    //设置开启虚拟定位风险监测，可以根据需要开启
    //[self.locationManager setDetectRiskOfFakeLocation:NO];
    //[self.locationManager requestLocationWithReGeocode:YES completionBlock]
    [self.locationManager requestLocationWithReGeocode:YES completionBlock:^(CLLocation *location, AMapLocationReGeocode *regeocode, NSError *error) {

        if (error)
        {
            NSLog(@"locError:{%ld - %@};", (long)error.code, error.localizedDescription);

            if (error.code == AMapLocationErrorLocateFailed)
            {
                return;
            }
        }

        NSLog(@"location:%@", location);

        if (regeocode)
        {
            NSLog(@"reGeocode:%@", regeocode);
            std::string lat = [[NSString stringWithFormat:@"%.8f",location.coordinate.latitude] UTF8String];
            std::string log = [[NSString stringWithFormat:@"%.8f",location.coordinate.longitude] UTF8String];
            NSString* address = [NSString stringWithFormat:@"%@", regeocode.formattedAddress];
            NSLog(@"地址%@",[NSString stringWithFormat:@"%@", regeocode.formattedAddress]) ;
            NSString *jstring = [[NSString alloc] initWithString:[NSString stringWithFormat:@"{\"longitude\":%s,\"latitude\":%s,\"address\":\"%@\",\"code\":0}",log.c_str(),lat.c_str(),address]];
            NSLog(@"%@",jstring);
            [SDKHelp sendJsEvent:@"EVENT_GPS_RESULT" detail:jstring];
            //[SDKHelp sendJsEvent:@"EVENT_GPS_RESULT",jstring];
        }
    }];
}

- (void)cleanUpAction
{
    //停止定位
    [self.locationManager stopUpdatingLocation];
    
    [self.locationManager setDelegate:nil];
    
    [self.mapView removeAnnotations:self.mapView.annotations];
}

- (void)locAction
{
    [self.mapView removeAnnotations:self.mapView.annotations];
    
    //进行单次定位请求
    [self.locationManager requestLocationWithReGeocode:NO completionBlock:self.completionBlock];
}

- (void)initCompleteBlock
{
//    __weak GPSLocation *weakSelf = self;
//    self.completionBlock = ^(CLLocation *location, AMapLocationReGeocode *regeocode, NSError *error)
//    {
//        if (error != nil && error.code == AMapLocationErrorLocateFailed)
//        {
//            //定位错误：此时location和regeocode没有返回值，不进行annotation的添加
//            NSLog(@"定位错误:{%ld - %@};", (long)error.code, error.userInfo);
//            return;
//        }
//        else if (error != nil
//                 && (error.code == AMapLocationErrorReGeocodeFailed
//                     || error.code == AMapLocationErrorTimeOut
//                     || error.code == AMapLocationErrorCannotFindHost
//                     || error.code == AMapLocationErrorBadURL
//                     || error.code == AMapLocationErrorNotConnectedToInternet
//                     || error.code == AMapLocationErrorCannotConnectToHost))
//        {
//            //逆地理错误：在带逆地理的单次定位中，逆地理过程可能发生错误，此时location有返回值，regeocode无返回值，进行annotation的添加
//            NSLog(@"逆地理错误:{%ld - %@};", (long)error.code, error.userInfo);
//        }
//        else if (error != nil && error.code == AMapLocationErrorRiskOfFakeLocation)
//        {
//            //存在虚拟定位的风险：此时location和regeocode没有返回值，不进行annotation的添加
//            NSLog(@"存在虚拟定位的风险:{%ld - %@};", (long)error.code, error.userInfo);
//
//            //存在虚拟定位的风险的定位结果
//            __unused CLLocation *riskyLocateResult = [error.userInfo objectForKey:@"AMapLocationRiskyLocateResult"];
//            //存在外接的辅助定位设备
//            __unused NSDictionary *externalAccressory = [error.userInfo objectForKey:@"AMapLocationAccessoryInfo"];
//
//            return;
//        }
//        else
//        {
//            //没有错误：location有返回值，regeocode是否有返回值取决于是否进行逆地理操作，进行annotation的添加
//        }
//
//        //根据定位信息，添加annotation
//        MAPointAnnotation *annotation = [[MAPointAnnotation alloc] init];
//        [annotation setCoordinate:location.coordinate];
//
//        //有无逆地理信息，annotationView的标题显示的字段不一样
//        if (regeocode)
//        {
//            [annotation setTitle:[NSString stringWithFormat:@"%@", regeocode.formattedAddress]];
//            [annotation setSubtitle:[NSString stringWithFormat:@"%@-%@-%.2fm", regeocode.citycode, regeocode.adcode, location.horizontalAccuracy]];
//        }
//        else
//        {
//            [annotation setTitle:[NSString stringWithFormat:@"lat:%f;lon:%f;", location.coordinate.latitude, location.coordinate.longitude]];
//            [annotation setSubtitle:[NSString stringWithFormat:@"accuracy:%.2fm", location.horizontalAccuracy]];
//        }
//
//        //GPSLocation *strongSelf = weakSelf;
//       // [strongSelf GPSLocation:annotation];
//    };
}

-(int)caculateDistance:(double)A_longitude : (double) A_latitude : (double) B_longitude : (double) B_latitude{
    MAMapPoint point1 = MAMapPointForCoordinate(CLLocationCoordinate2DMake(A_latitude,A_longitude));
    MAMapPoint point2 = MAMapPointForCoordinate(CLLocationCoordinate2DMake(B_latitude,B_longitude));
    CLLocationDistance distance = MAMetersBetweenMapPoints(point1,point2);
    NSString* dis = [NSString stringWithFormat:@"%.8f", distance];
    int dist =[dis intValue];
    return dist;
}

-(int)onRecievedJsRequest:(NSString*) SDKRequestID detail:(NSString*)jsArg{
    
    if([SDKRequestID isEqual:@"SDK_GPS_CACULATE_DISTANCE"]){
        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
        [self caculateDistance:[[data objectForKey:@"A_longitude"] doubleValue]: [[data objectForKey:@"A_latitude"] doubleValue]: [[data objectForKey:@"B_longitude"] doubleValue]: [[data objectForKey:@"B_latitude"] doubleValue]];
        return true;
    }
    if([SDKRequestID isEqual:@"SDK_GPS_REQUEST_GPSINFO"]){
        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
        //NSString* str = [data objectForKey:@"isNeedAddress"];
        
        [self configLocationManager];
        return true;
    }
//    if([SDKRequestID isEqual:@"SDK_WECHAT_SHARE_TEXT"]){
//        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
//        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
//        NSString* str = [data objectForKey:@"strContent"];
//        NSString* type = [data objectForKey:@"type"];
//        //NSString* actionTag = [data objectForKey:@"actionTag"];
//        int intType = [type intValue];
//        if(intType == 1 ){
//            [self ShareToChatScene:str];
//        }else{
//            [self ShareToFriendCircle:str];
//        }
//        return true;
//    }
//    if([SDKRequestID isEqual:@"SDK_WECHAT_SHARE_LINK"]){
//        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
//        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
//        NSString* strLink = [data objectForKey:@"strLink"];
//        NSString* strTitle = [data objectForKey:@"strTitle"];
//        NSString* strDesc = [data objectForKey:@"strDesc"];
//        NSString* type = [data objectForKey:@"type"];
//        //NSString* actionTag = [data objectForKey:@"actionTag"];
//        int intType = [type intValue];
//        if(intType == 1 ){
//            [self ShareLinkToChatScene:strLink Title:strTitle Description:strDesc];
//        }else{
//            [self ShareLinkToFriendCircle:strLink Title:strTitle Description:strDesc];
//        }
//        return true;
//    }
//    if([SDKRequestID isEqual:@"SDK_WECHAT_SHARE_IMAGE"]){
//        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
//        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
//        NSString* file = [data objectForKey:@"file"];
//        NSString* type = [data objectForKey:@"type"];
//        //NSString* actionTag = [data objectForKey:@"actionTag"];
//        int intType = [type intValue];
//        if(intType == 1 ){
//            [self ShareImageToChatScene:file];
//        }else{
//            [self ShareImageToChatScene:file];
//        }
//        return true;
//    }
//
    return haveDeal;
}

@end
