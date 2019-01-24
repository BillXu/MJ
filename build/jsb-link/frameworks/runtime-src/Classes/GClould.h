//
//  GClould.h
//  hello_world
//
//  Created by 唐弘 on 2019/1/23.
//

#ifndef GClould_h
#define GClould_h
#import <UIKit/UIKit.h>
#import "GCloudVoice.h"
#import <Foundation/Foundation.h>
#include "cocos2d.h"
USING_NS_CC;
using namespace gcloud_voice;

class GClould:public IGCloudVoiceNotify{
public:
    static GClould * GClouldManager();
    GCloudVoiceErrno SetAppInfo(NSString* appID ,NSString* appKey,NSString* openID);
    GCloudVoiceErrno StopRecording(int isUpload,int time);
    int onRecievedJsRequest(NSString* SDKRequestID ,NSString* jsArg);
    GCloudVoiceErrno StartRecording(NSString* path);
    GCloudVoiceErrno OnApplicationPause();
    GCloudVoiceErrno DownloadRecordedFile(NSString* fileID ,NSString* Path ,int mostLog);
    GCloudVoiceErrno PlayRecordedFile(NSString* path);
    GCloudVoiceErrno OnApplicationResume();
    GCloudVoiceErrno UploadRecordedFile(NSString* path,int mostLog);
    void OnUploadFile(GCloudVoiceCompleteCode code ,const char * path ,const char * id);
    void OnDownloadFile(GCloudVoiceCompleteCode code, const char * path ,const char * id);
    void OnPlayRecordedFile(GCloudVoiceCompleteCode code ,const char * path);
    void OnApplyMessageKey(GCloudVoiceCompleteCode code);
    void checkVoice();
    static GClould * m_sInstance;
    NSString* _Path;
};
//@interface GClould : NSObject{
//    NSString* _Path;
//}

//+(instancetype)GClouldManager;
//
//-(GCloudVoiceErrno)SetAppInfo:(NSString*)appID Title:(NSString*)appKey detail:(NSString*)openID;
//
//-(GCloudVoiceErrno) StopRecording:(int) isUpload Title:(int) time ;
//
//-(int)onRecievedJsRequest:(NSString*)SDKRequestID detail:(NSString*)jsArg;
//
//-(GCloudVoiceErrno)StartRecording:(NSString*)path;
//
//-(GCloudVoiceErrno)OnApplicationPause;
//
//-(GCloudVoiceErrno)OnApplicationResume;
//
//-(GCloudVoiceErrno)UploadRecordedFile:(NSString*)path Title:(int)mostLog;
//
//-(void)OnUploadFile:(int)code Title:(NSString*)path detal:(NSString*)id;
//
//-(void)OnDownloadFile:(int)code Title:(NSString*)path detal:(NSString*)id;
//
//-(void)OnPlayRecordedFile:(int)code Title:(NSString*)path;
//
//-(void)OnApplyMessageKey:(GCloudVoiceCompleteCode) code;
//
//-(void)checkVoice;
//@end
#endif /* GClould_h */
