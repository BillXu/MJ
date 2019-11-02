import ILayerDlgData from "./layerDlg/ILayerDlgData";
import ILayerCardsData from "./layerCards/ILayerCardsData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export interface IRoomInfoData
{
    getLeftMJCnt() : number ;
    getRoomID() : number ;
    getRule() : string ;
    getTotalRound() : string ;
    getCurRound() : string ;
    isCircle() : boolean ;
}

export interface IRoomPlayerData
{
    svrIdx : number ;
    chip : number ;
    uid : number ;
    isOnline : boolean ;
    isReady : boolean ;
    isEmpty() : boolean ;
}

export interface ILayerPlayersData
{
    getSelfIdx() : number ;
    svrIdxToClientIdx(svrIdx : number ) : number ;
    getPlayerClientIdxByUID( uid : number ) : number ;
    getBankerIdx() : number ; 
    getPlayersData() : IRoomPlayerData[] ;
    isShowReadyBtn() : boolean ;
    reqSetReady() : void ;
    reqSitDown( svrIdx : number ) : number ;
}

export default interface IRoomSceneData {
    getRoomInfoData() : IRoomInfoData ;
    getLayerPlayersData() : ILayerPlayersData ;
    getLayerDlgData() : ILayerDlgData ;
    getLayerCardsData() : ILayerCardsData ;
    getMJCntAfterDistribute() : number ;
}
