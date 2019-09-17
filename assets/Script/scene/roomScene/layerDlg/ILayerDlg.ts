import MJRoomData from "../roomData/MJRoomData";
import { eMJActType, eEatType } from "../roomDefine";
import ResultTotalData from "../roomData/ResultTotalData";
import IResultSingleData  from "../../roomSceneSZ/layerDlg/dlgResultSingle/IResultSingleDate";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
 export interface ILayerDlg
 {
    showDlgActOpts( actOpts : eMJActType[] ) : void ;
    showDlgEatOpts( vEatOpts : eEatType[], nTargetCard : number ) : void ;
    showDlgGangOpts( gangOpts : number[] ) : void ;
    showDlgDismiss( data : MJRoomData ) ;
    onReplayDismissRoom( idx : number , isAgree : boolean ) : void ;
    showDlgResultTotal( result : ResultTotalData, data : MJRoomData ) ;
    showDlgResultSingle( result : IResultSingleData ) ;
    showDlgPlayerInfo( nTargetPlayerID : number ) ;
 }