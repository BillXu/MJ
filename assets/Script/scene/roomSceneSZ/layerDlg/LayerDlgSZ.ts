import ILayer from "../../roomScene/ILayer";
import MJRoomData from "../../roomScene/roomData/MJRoomData";
import { ILayerDlg } from "../../roomScene/layerDlg/ILayerDlg";
import LayerDlg from "../../roomScene/layerDlg/LayerDlg";
import { eMJActType, eEatType } from "../../roomScene/roomDefine";
import ResultTotalData from "../../roomScene/roomData/ResultTotalData";
import IResultSingleData from "./dlgResultSingle/IResultSingleDate"
import DlgResultSingleSZ from "./dlgResultSingle/DlgResultSingleSZ";
import DlgHuaDetail from "./DlgHuaDetail";

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
export default class LayerDlgSZ extends ILayer implements ILayerDlg
{
    @property(LayerDlg)
    mDefault : LayerDlg = null ;

    @property(DlgResultSingleSZ)
    mDlgResultSingle : DlgResultSingleSZ = null ;

    @property(DlgHuaDetail)
    mDlgHuaDetail : DlgHuaDetail = null ;

    mRoomData : MJRoomData = null ;
    refresh( data : MJRoomData ) : void 
    {
        this.mDefault.refresh(data);
        this.mRoomData = data ;
    }

    onGameStart() : void
    {
        this.mDefault.onGameStart();
    }

    showDlgActOpts( actOpts : eMJActType[] ) : void 
    {
        this.mDefault.showDlgActOpts(actOpts);
    }

    showDlgEatOpts( vEatOpts : eEatType[], nTargetCard : number ) : void 
    {
        this.mDefault.showDlgEatOpts( vEatOpts, nTargetCard );
    }

    showDlgGangOpts( gangOpts : number[] ) : void 
    {
        this.mDefault.showDlgGangOpts( gangOpts );
    }

    showDlgDismiss( data : MJRoomData ) 
    {
        this.mDefault.showDlgDismiss( data );
    }

    onReplayDismissRoom( idx : number , isAgree : boolean ) : void 
    {
        this.mDefault.onReplayDismissRoom( idx , isAgree );
    }

    showDlgResultTotal( result : ResultTotalData, data : MJRoomData ) 
    {
        this.mDlgResultSingle.showTotalReusltBtn();
        this.mDefault.mDlgResultTotal.refreshDlg(data,result) ;
        if ( this.mDefault.mDlgResultSingle.isDlgShowing() )
        {
            return ;
        }
        this.mDefault.mDlgResultTotal.showDlg();
    }

    showDlgResultSingle( result : IResultSingleData ) 
    {
        this.mDlgResultSingle.showDlg(null,result) ;
    }

    showDlgPlayerInfo( nTargetPlayerID : number ) 
    {
        this.mDefault.showDlgPlayerInfo( nTargetPlayerID );
    }

    showDlgHuaDetail()
    {
        this.mDlgHuaDetail.showDlg(null,this.mRoomData );
    }
}