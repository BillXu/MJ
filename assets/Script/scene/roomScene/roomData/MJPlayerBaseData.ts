import { eRoomPeerState } from "../../../common/clientDefine";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MJPlayerBaseData {

    uid : number = 0 ;
    svrIdx : number = -1 ;
    chip : number = 0 ;
    isOnline : boolean = false; 
    isReady : boolean = false;
    isSelf : boolean = false ;
    isSitDownBeforSelf : boolean = false ;

    parseFromMsg( info : Object )
    {
        this.uid = info["uid"] ;
        this.svrIdx = info["idx"] ;
        this.isOnline = info["isOnline"] ; 
        this.isReady = ( info["state"] & eRoomPeerState.eRoomPeer_Ready) == eRoomPeerState.eRoomPeer_Ready; 
        this.chip = info["chips"] ;
    }
    // update (dt) {}
}
