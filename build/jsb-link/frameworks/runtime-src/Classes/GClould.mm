//
//  GClould.m
//  hello_world-mobile
//
//  Created by 唐弘 on 2019/1/23.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#include "GClould.h"
#include "sources/json/document.h"
#include "sources/json/writer.h"
#include "sources/json/stringbuffer.h"
#import "GCloudVoiceErrno.h"
//#import "cocos2d.h"
//#import "GCloudVoice.h"
#import "cocos2d.h"
#import "SDKHelp.h"
#import <netdb.h>
#include <iostream>
//using namespace rapidjson;

//@implementation GClould
GClould * GClould::m_sInstance = NULL;

GClould* GClould::GClouldManager() {
    if(!m_sInstance){
        m_sInstance = new(std::nothrow) GClould();
    }
    return m_sInstance;
}


int GClould::onRecievedJsRequest(NSString* SDKRequestID ,NSString* jsArg){
    
    if([SDKRequestID isEqual:@"SDK_VOICE_INIT"]){
        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
        return SetAppInfo([data objectForKey:@"appID"],[data objectForKey:@"appKey"],[data objectForKey:@"playerTag"]);
        //return [self SetAppInfo:[data objectForKey:@"appID"] Title:[data objectForKey:@"appKey"] detail:[data objectForKey:@"playerTag"]];
    }
    if([SDKRequestID isEqual:@"SDK_VOICE_RECORD"]){
        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
        return StartRecording([data objectForKey:@"fullPathFile"]);
        //[this StartRecording : [data objectForKey:@"fullPathFile"]];
        //return true;
    }
    if([SDKRequestID isEqual:@"SDK_VOICE_STOP_RECORD"]){
        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
        NSString* str = [data objectForKey:@"isUpload"];
        NSString* str1 = [data objectForKey:@"uploadTimeout"];
        int isUpload = [str intValue];
        int time = [str1 intValue];
        return StopRecording(isUpload,time);
        //[self StopRecording: isUpload Title:time];
        //return true;
    }
    if([SDKRequestID isEqual:@"SDK_VOICE_DOWNLOAD_FILE"]){
        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
        NSString* fileID = [data objectForKey:@"fileID"];
        NSString* path = [data objectForKey:@"path"];
        NSString* timeout = [data objectForKey:@"timeout"];
        int time = [timeout intValue];
        return DownloadRecordedFile(fileID,[path stringByAppendingString:fileID],time);
        //[self DownloadRecordedFile : fileID Title:path detail:time];
        //return true;
    }
    if([SDKRequestID isEqual:@"SDK_VOICE_PLAY_FILE"]){
        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
        NSString* path = [data objectForKey:@"fullPathFile"];
        return PlayRecordedFile(path);
//        [self PlayRecordedFile:path];
//        return true;
    }

    return haveDeal;
}

GCloudVoiceErrno GClould::SetAppInfo(NSString* appID,NSString* appKey ,NSString* openID)
{
    GCloudVoiceErrno code = gcloud_voice::GetVoiceEngine()->SetAppInfo([appID UTF8String],[appKey UTF8String],[openID UTF8String]);
    gcloud_voice::GetVoiceEngine()->Init();
    gcloud_voice::GetVoiceEngine()->SetMode(gcloud_voice::IGCloudVoiceEngine::Messages);
    gcloud_voice::GetVoiceEngine()->SetNotify(this);
    // Step4:定时调用Poll函数，驱动引擎回调
    [NSTimer scheduledTimerWithTimeInterval:1.000/15 repeats:YES block:^(NSTimer * _Nonnull timer) {
        gcloud_voice::GetVoiceEngine()->Poll();
    }];
//    cocos2d::Director::getInstance()->getScheduler()->unscheduleAllForTarget(self);
//    cocos2d::Director::getInstance()->getScheduler()->schedule([=](float fTime){
//        gcloud_voice::GetVoiceEngine()->Poll();
//    },self,0,false,"GCloudVoice");
    gcloud_voice::GetVoiceEngine()->ApplyMessageKey(5999);
    gcloud_voice::GetVoiceEngine()->SetMaxMessageLength(30000);
    checkVoice();
    //[self checkVoice];
//    gcloud_voice::GetVoiceEngine()->SetNotify(this);
    return code;
}
GCloudVoiceErrno GClould::StopRecording(int isUpload ,int time){
    GCloudVoiceErrno code =gcloud_voice::GetVoiceEngine()->StopRecording();
    if (code == GCLOUD_VOICE_SUCC){
        return UploadRecordedFile(_Path,time);
        //[self UploadRecordedFile:_Path Title:time];
    }
    return code;
}

GCloudVoiceErrno GClould::StartRecording(NSString* parh)
{
    _Path = [parh mutableCopy];
    return gcloud_voice::GetVoiceEngine()->StartRecording([parh UTF8String]);
}
GCloudVoiceErrno GClould::OnApplicationPause()
{
    return gcloud_voice::GetVoiceEngine()->Pause();
}

GCloudVoiceErrno GClould::OnApplicationResume()
{
    return gcloud_voice::GetVoiceEngine()->Resume();
}
GCloudVoiceErrno GClould::UploadRecordedFile(NSString* path ,int mostLog)
{
    return gcloud_voice::GetVoiceEngine()->UploadRecordedFile([path UTF8String],mostLog);
}

GCloudVoiceErrno GClould::DownloadRecordedFile(NSString* fileID ,NSString* Path ,int mostLog)
{
    std::string str = [Path UTF8String];
    printf("_____%s",str.c_str());
    return gcloud_voice::GetVoiceEngine()->DownloadRecordedFile([fileID UTF8String],[Path UTF8String] ,mostLog);
}
GCloudVoiceErrno GClould::PlayRecordedFile(NSString* path)
{
    return gcloud_voice::GetVoiceEngine()->PlayRecordedFile([path UTF8String]);
}

void GClould::OnUploadFile(GCloudVoiceCompleteCode code ,const char * path ,const char* id){
    
    if(code == GV_ON_UPLOAD_RECORD_DONE){
        std::string filePath = path ;
        std::string fileID = id ;
        NSString *jstring = [[NSString alloc] initWithString:[NSString stringWithFormat:@"{\"code\":%d,\"fileName\":\"%s\",\"isOk\":1}",code,fileID.c_str()]];
        
        NSLog(@"%@",jstring);
        [SDKHelp sendJsEvent:@"VOICE_EVENT_UPLOAED" detail:jstring];
    }
}

void GClould::OnDownloadFile(GCloudVoiceCompleteCode code ,const char * path ,const char* id){
    //log("OnDownloadFile code = %d",code);
    if(code == GV_ON_DOWNLOAD_RECORD_DONE){
        std::string filePath = path ;
        std::string fileID = id ;
        NSString *jstring = [[NSString alloc] initWithString:[NSString stringWithFormat:@"{\"code\":%d,\"fileName\":\"%s\"}",code,fileID.c_str()]];
        
        NSLog(@"%@",jstring);
        [SDKHelp sendJsEvent:@"VOICE_EVENT_DOWNLOADED" detail:jstring];
    }

}
void GClould::OnPlayRecordedFile(GCloudVoiceCompleteCode code ,const char* path){
    
    if(code == GV_ON_PLAYFILE_DONE){
        std::string filePath = path ;
        //std::string fileID = id ];
        NSString *jstring = [[NSString alloc] initWithString:[NSString stringWithFormat:@"{\"code\":%d,\"fileName\":\"%s\"}",code,filePath.c_str()]];
        
        NSLog(@"%@",jstring);
        [SDKHelp sendJsEvent:@"VOICE_EVENT_PLAY_FINISH" detail:jstring];
    }
    
}
void GClould::OnApplyMessageKey(GCloudVoiceCompleteCode code) {
    if(code == GV_ON_MESSAGE_KEY_APPLIED_SUCC){
        NSString *jstring = [[NSString alloc] initWithString:[NSString stringWithFormat:@"{\"code\":%d}",code]];
        NSLog(@"%@",jstring);
        [SDKHelp sendJsEvent:@"VOICE_EVENT_APPLY_KEY" detail:jstring];
    }
}

void GClould::checkVoice(){
    AVAudioSession *avSession = [AVAudioSession sharedInstance];
    
    if ([avSession respondsToSelector:@selector(requestRecordPermission:)]) {
        
        [avSession requestRecordPermission:^(BOOL available) {
            
            if (available) {
                //completionHandler
            }
            else
            {
                dispatch_async(dispatch_get_main_queue(), ^{
                    [[[UIAlertView alloc] initWithTitle:@"无法录音" message:@"请在“设置-隐私-麦克风”选项中允许<赤峰麻将>访问你的麦克风" delegate:nil cancelButtonTitle:@"确定" otherButtonTitles:nil] show];
                });
            }
        }];
    }
}

//@end
