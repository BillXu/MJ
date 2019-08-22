import { eRoomState } from "../../../common/clientDefine";

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
export default class MJRoomBaseData {

    applyDismissIdx : number = -1 ;
    dimissRoomLeftTime : number = 0 ;
    agreeDismissIdx : number[] = [] ;

    roomID : number = 0 ;
    initCardCnt : number = 0 ;
    isRoomOver : boolean = false ;
    isRoomOpened : boolean = false ;
    leftCircle : number = 0 ;
    
    curActSvrIdx : number = -1 ;
    lastChuIdx : number = -1 ;    // svr not give
    otherCanActCard : number = 0 ;  // svr not give 
    leftMJCnt : number = 0 ;
    bankerIdx : number = -1 ;
    state : eRoomState = eRoomState.eRoomSate_WaitReady ;
    ownerID : number = 0 ;

    parseInfo( msg : Object )
    {
        this.initCardCnt = msg["initCards"];
        this.curActSvrIdx = msg["curActIdex"] ;
        this.isRoomOpened = msg["isOpen"] ;
        this.leftCircle = msg["leftCircle"] ;
        this.leftMJCnt = msg["leftCards"] ;
        this.roomID = msg["roomID"] ;
        this.bankerIdx = msg["bankIdx"] ;
        this.state = msg["state"] ;

        if ( msg["isWaitingDismiss"] == 1 )
        {
            let AgreeIdx : number[] = msg["agreeIdxs"];
            this.agreeDismissIdx.length = 0 
            for ( const item of AgreeIdx )
            {
                this.agreeDismissIdx.push( item );
            }

            this.dimissRoomLeftTime = msg["leftWaitTime"];
            this.applyDismissIdx = this.agreeDismissIdx[0];
        }
        else
        {
            this.applyDismissIdx = -1 ;
            this.agreeDismissIdx.length = 0;
        }

        if ( this.state != eRoomState.eRoomSate_WaitReady )
        {
            this.isRoomOpened = true ;
        }

        if ( msg["lastActInfo"] != null )
        {
            this.otherCanActCard = msg["lastActInfo"]["card"] ;
            this.lastChuIdx = msg["lastActInfo"]["idx"];
        }
    }

    getMaxTableSeat() : number
    {
        return 4 ;
    }
 
    onGameWillStart( jsMsg : Object ) : void
    {
        this.bankerIdx = jsMsg["bankerIdx"] ;
        this.isRoomOpened = true ;
        this.leftMJCnt = this.initCardCnt ;
        this.curActSvrIdx = this.bankerIdx ;
        this.state = eRoomState.eRoomState_StartGame ;
    }

    isInGamingState()
    {
        return this.state != eRoomState.eRoomSate_WaitReady && eRoomState.eRoomState_GameEnd != this.state ;
    }

    onEndGame() : void
    {
        this.state = eRoomState.eRoomState_GameEnd ;
        this.curActSvrIdx = -1 ;
        this.lastChuIdx = -1 ;
        this.otherCanActCard = 0 ;
        this.leftMJCnt = this.initCardCnt ;
        this.bankerIdx = -1 ;
    }
}
