import { eEatType, eMJActType, eChatMsgType } from "../roomDefine";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
export interface IDissmissDlgData
{
    applyPlayerIdx : number ;
    applyPlayerUID : number ;
    playerCnt : number ;
    seatCnt : number ;
    getPlayerUIDByIdx( idx : number ) : number ;
    getAgreedPlayerIdxs() : number[] ;
    isSelfResponed() : boolean ;
    getLeftTime() : number ;
    reqRespone( isAgree : boolean ) : number ;
}

export interface ILocationDlgData
{
    seatCnt : number ;
    getSelfIdx() : number ;
    getPlayerUIDs() : number[] ;  // when empty , uid = -1 ; , array with server idx ;
}

export interface ISingleResultDlgDataItem
{
    isEmpty() : boolean ;
    idx : number ;
}

export interface ISingleResultDlgData
{
    parseResult( js : Object ) : void ;
    isLiuJu() : boolean ;
    getSelfIdx() : number ;
    getResultItems() : ISingleResultDlgDataItem[] ;
}

export interface ITotalResultDlgDataItem
{
    uid : number ;
}

export interface ITotalResultDlgData
{
    roomID : number ;
    ruleDesc : string ;
    parseResult( js : Object ) : void ;
    isPlayerApplyDismiss( uid : number ) : boolean ;
    isPlayerRoomOwner( uid : number ) : boolean ;
    isPlayerBigWiner( uid : number ) : boolean ;
    isPlayerTuHao( uid : number ) : boolean ;
    isSelf( uid : number ) : boolean;
    getResultItems() : ITotalResultDlgDataItem[] ;
}

export default interface ILayerDlgData {
    isShowDismissDlg() : boolean ;
    isSeatFull() : boolean ;
    getDismissDlgData() : IDissmissDlgData ;
    getPlayerUIDByIdx( idx : number ) : number ;
    getGangOpts() : number[] ;
    getEatOpts() : eEatType[] ;
    getEatTargetCard() : number ;
    getLocationDlgData() : ILocationDlgData ;
    getSingleResultDlgData() : ISingleResultDlgData ;
    getTotalResultDlgData() : ITotalResultDlgData ;

    reqAct( act : eMJActType , detail : any ) : void ; // detail : gang card or eat type ; 
    reqDoReady() : void ;
    reqSendInteractiveEmoji( targetUID : number , emoji : string ) : void ;
    reqSendChat( type : eChatMsgType , content : string ) : void ;
    reqApplyDismiss() : void ;
    reqApplyLeave() : void ;
}
