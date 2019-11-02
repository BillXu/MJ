import IRoomLayer from "./IRoomLayer";
import { eChatMsgType } from "./roomDefine";
import { IRoomPlayerData } from "./IRoomSceneData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

 
export default interface ILayerPlayers extends IRoomLayer {
    onPlayerNetStateChanged( playerIdx : number , isOnline : boolean ) : void ;
    onPlayerChatMsg( playerIdx : number , type : eChatMsgType , strContent : string ) : void ;
    onInteractEmoji( InvokeIdx : number , targetIdx : number , emoji : string ) : void ;
    onPlayerSitDown( p : IRoomPlayerData ) : void;
    onPlayerStandUp( idx : number ) : void ;
    onPlayerReady( idx : number ) : void ;
}
