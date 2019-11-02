import { IRoomPlayerData } from "../IRoomSceneData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export default interface IRoomPlayer {
    isOnline : boolean ;
    mSvrIdx : number ;
    chip : number ;
    huaCnt : number ;
    worldPosEmoji : cc.Vec2 ;
    bankIconWorldPos : cc.Vec2 ;
    isReady : boolean ;
    refresh( data : IRoomPlayerData ) : void ;
    setChatEmoji( strContent : string ) : void ;
    setChatText( strContent : string ) : void ;
    startChatVoice() : void ;
    stopChatVoice() : void ;
    waitSitDown() : void ;
}
