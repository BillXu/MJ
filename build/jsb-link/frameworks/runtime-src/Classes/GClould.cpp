//
//  WXApiManager.m
//  hello_world-mobile
//
//  Created by 唐弘 on 2019/1/21.
//

#include "GClould.h"
#include "ClientApp.h"
#include "AgentManager.h"
#include "ScriptingCore.h"
#include "sources/json/document.h"
#include "sources/json/writer.h"
#include "sources/json/stringbuffer.h"
using namespace std;
using namespace rapidjson;
GClould * GClould::m_sInstance = NULL;

GClould::GClould(){
    //apiist->addListener(*this);
}
GClould::GClould(){
    //apiist->removeListener(*this);
}
GClould * GClould::getInstance(){
    if(!m_sInstance){
        m_sInstance = new(std::nothrow) GClould();
    }
    return m_sInstance;
}
int onRecievedJsRequest(char* SDKRequestID ,char* jsArg){
    
    if([SDKRequestID isEqual:@"SDK_VOICE_INIT"]){
        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
        return [self SetAppInfo:[data objectForKey:@"appID"] Title:[data objectForKey:@"appKey"] detail:[data objectForKey:@"playerTag"]];
    }
    if([SDKRequestID isEqual:@"SDK_VOICE_RECORD"]){
        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
        return [self StartRecording : [data objectForKey:@"fullPathFile"]];
        //return true;
    }
    if([SDKRequestID isEqual:@"SDK_VOICE_STOP_RECORD"]){
        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
        NSString* str = [data objectForKey:@"isUpload"];
        NSString* str1 = [data objectForKey:@"uploadTimeout"];
        int isUpload = [str intValue];
        int time = [str1 intValue];
        return [self StopRecording: isUpload Title:time];
        //return true;
    }
    if([SDKRequestID isEqual:@"SDK_VOICE_DOWNLOAD_FILE"]){
        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
        NSString* fileID = [data objectForKey:@"fileID"];
        NSString* path = [data objectForKey:@"path"];
        NSString* timeout = [data objectForKey:@"timeout"];
        int time = [timeout intValue];
        return [self DownloadRecordedFile : fileID Title:path detail:time];
        //return true;
    }
    if([SDKRequestID isEqual:@"SDK_VOICE_PLAY_FILE"]){
        NSData *stringData = [jsArg dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary* data = [NSJSONSerialization JSONObjectWithData:stringData options:0 error:nil];
        NSString* path = [data objectForKey:@"fullPathFile"];
        [self PlayRecordedFile:path];
        return true;
    }
    
    return haveDeal;
}
GCloudVoiceErrno GClould::SetAppInfo(const char *appID,const char *appKey, const char *openID){
    GCloudVoiceErrno code = gcloud_voice::GetVoiceEngine()->SetAppInfo(appID,appKey,openID);
    gcloud_voice::GetVoiceEngine()->Init();
    gcloud_voice::GetVoiceEngine()->SetMode(gcloud_voice::IGCloudVoiceEngine::Messages);
    cocos2d::Director::getInstance()->getScheduler()->unscheduleAllForTarget(this);
    cocos2d::Director::getInstance()->getScheduler()->schedule([=](float fTime){
        gcloud_voice::GetVoiceEngine()->Poll();
    },this,0,false,"GCloudVoice");
    gcloud_voice::GetVoiceEngine()->ApplyMessageKey(5999);
    gcloud_voice::GetVoiceEngine()->SetMaxMessageLength(30000);
    gcloud_voice::GetVoiceEngine()->SetNotify(this);
    return code;
}
GCloudVoiceErrno GClould::StopRecording(){
    return gcloud_voice::GetVoiceEngine()->StopRecording();
}
GCloudVoiceErrno GClould::StartRecording(const char * filePath){
    return gcloud_voice::GetVoiceEngine()->StartRecording(filePath);
}
GCloudVoiceErrno GClould::OnApplicationPause(){
    return gcloud_voice::GetVoiceEngine()->Pause();
}
GCloudVoiceErrno GClould::OnApplicationResume(){
    return gcloud_voice::GetVoiceEngine()->Resume();
}
GCloudVoiceErrno GClould::UploadRecordedFile(const char * filePath, int msTimeout){
    return gcloud_voice::GetVoiceEngine()->UploadRecordedFile(filePath,msTimeout);
}
GCloudVoiceErrno GClould::DownloadRecordedFile (const char *fileID, const char * downloadFilePath, int msTimeout ){
    return gcloud_voice::GetVoiceEngine()->DownloadRecordedFile(fileID,downloadFilePath,msTimeout);
}
GCloudVoiceErrno GClould::PlayRecordedFile (const char * downloadFilePath){
    return gcloud_voice::GetVoiceEngine()->PlayRecordedFile(downloadFilePath);
}
void GClould::OnApplyMessageKey(GCloudVoiceCompleteCode code){
    log("OnApplyMessageKey code = %d",code);
}
void GClould::OnUploadFile(GCloudVoiceCompleteCode code, const char *filePath, const char *fileID){
    log("OnUploadFile code = %d",code);
    rapidjson::Document document;
    document.SetObject();
    rapidjson::Document::AllocatorType& allocator = document.GetAllocator();
    document.AddMember("code", code, allocator);
    rapidjson::Document::GenericValue filePath1(filePath, internal::StrLen(filePath));
    rapidjson::Document::GenericValue fileID1(fileID, internal::StrLen(fileID));
    document.AddMember("filePath", filePath1, allocator);
    document.AddMember("fileID", fileID1, allocator);
    rapidjson::StringBuffer buffer;
    rapidjson::Writer<rapidjson::StringBuffer> write(buffer);
    document.Accept(write);
    std::string jsStr = "";
    if(!document.GetParseError()){
        jsStr = cocos2d::StringUtils::format("cc.eventManager.dispatchCustomEvent('OnUploadFile','%s')",buffer.GetString());
    }else{
        jsStr = cocos2d::StringUtils::format("cc.eventManager.dispatchCustomEvent('OnUploadFile','{\"code\":%d}')",code);
    }
    ScriptingCore::getInstance()->evalString(jsStr.c_str());
}
void GClould::OnDownloadFile(GCloudVoiceCompleteCode code, const char *filePath, const char *fileID){
    log("OnDownloadFile code = %d",code);
    rapidjson::Document document;
    document.SetObject();
    rapidjson::Document::AllocatorType& allocator = document.GetAllocator();
    document.AddMember("code", code, allocator);
    rapidjson::Document::GenericValue filePath1(filePath, internal::StrLen(filePath));
    rapidjson::Document::GenericValue fileID1(fileID, internal::StrLen(fileID));
    document.AddMember("filePath", filePath1, allocator);
    document.AddMember("fileID", fileID1, allocator);
    rapidjson::StringBuffer buffer;
    rapidjson::Writer<rapidjson::StringBuffer> write(buffer);
    document.Accept(write);
    std::string jsStr = "";
    if(!document.GetParseError()){
        jsStr = cocos2d::StringUtils::format("cc.eventManager.dispatchCustomEvent('OnDownloadFile','%s')",buffer.GetString());
    }else{
        jsStr = cocos2d::StringUtils::format("cc.eventManager.dispatchCustomEvent('OnDownloadFile','{\"code\":%d}')",code);
    }
    ScriptingCore::getInstance()->evalString(jsStr.c_str());

}
void GClould::OnPlayRecordedFile(GCloudVoiceCompleteCode code,const char *filePath){
    log("OnPlayRecordedFile code = %d",code);
    rapidjson::Document document;
    document.SetObject();
    rapidjson::Document::AllocatorType& allocator = document.GetAllocator();
    document.AddMember("code", code, allocator);
    rapidjson::Document::GenericValue filePath1(filePath, internal::StrLen(filePath));
    document.AddMember("filePath", filePath1, allocator);
    rapidjson::StringBuffer buffer;
    rapidjson::Writer<rapidjson::StringBuffer> write(buffer);
    document.Accept(write);
    std::string jsStr = "";
    if(!document.GetParseError()){
        jsStr = cocos2d::StringUtils::format("cc.eventManager.dispatchCustomEvent('OnPlayRecordedFile','%s')",buffer.GetString());
    }else{
        jsStr = cocos2d::StringUtils::format("cc.eventManager.dispatchCustomEvent('OnPlayRecordedFile','{\"code\":%d}')",code);
    }
    ScriptingCore::getInstance()->evalString(jsStr.c_str());
}
