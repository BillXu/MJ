import IRoomLayer from "./IRoomLayer";
import { eMJActType } from "./roomDefine";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default interface ILayerDlg extends IRoomLayer {

    onApplyDismisRoom( idx : number ) : void ;
    onReplayDismissRoom( idx : number , isAgree : boolean ) : void ;
    showActOpts( vActs : eMJActType[] ) : void ;
    showDlgResultSingle() : void ;
    showDlgResultTotal() : void ;
    showDlgPlayerInfo( targetPlayerUID : number ) ;
}
