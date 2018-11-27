// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import DlgRoomOverResultItem from "./dlgRoomOverResultItem"
import DlgBase from "../../common/DlgBase"
import RoomData from "./roomData";
import { SceneName } from "../../common/clientDefine"
@ccclass
export default class DlgRoomOverResult extends DlgBase {

    @property(DlgRoomOverResultItem)
    vResultItem: DlgRoomOverResultItem[] = []; // array index = svr idx ;

    @property(cc.Label)
    pRoomIDandCircleState : cc.Label = null ;
    @property(cc.Label)
    pCurTime : cc.Label  = null ;

    @property(cc.Label)
    pRule : cc.Label = null ;

    // LIFE-CYCLE CALLBACKS:
    onLoad ()
    {
        super.onLoad();
        this.closeDlg();
    }

    start () {

    }

    showDlg( msg : Object, pdata : RoomData )
    {
        super.showDlg();
        this.vResultItem.forEach( ( item : DlgRoomOverResultItem)=>{ item.node.active = false ; item.reset();} );
        let vResult : Object[] = msg["result"] ;
        let self = this ;
        let maxScore = 0 ;
        vResult.forEach( ( ret : Object )=>{
            let p = pdata.getPlayerDataByUID(ret["uid"]);
            if ( p == null )
            {
                cc.error( "why player is not in room ; ? uid = " + ret["uid"] );
                return ;
            }

            let item = self.vResultItem[p.svrIdx] ;
            item.node.active = true ;
            item.name = p.name ;
            item.clientIdx = p.clientIdx ;
            item.uid = p.uid ;
            item.headIcon = p.headIconUrl ;
            item.isRoomOwner = p.uid == pdata.roomOwnerUID ;
            item.huCnt = ret["huCnt"] + ret["ZMCnt"];
            item.dianPaoCnt = ret["dianPaoCnt"] ;
            item.finalOffset = ret["final"] ;
            item.bankerCnt = ret["bankerCnt"] ;
            if ( maxScore < ret["final"] )
            {
                maxScore = ret["final"];
            }
        } );

        this.vResultItem.forEach( ( item : DlgRoomOverResultItem)=>{ 
             if ( item.node.active )
             {
                 item.isBigWiner = item.finalOffset == maxScore ;
             }
        } );

        // cur time 
        this.pCurTime.string = (new Date()).toLocaleString();

        // rule
        this.pRule.string = pdata.rule;

        // room id and circle state ;
        this.pRoomIDandCircleState.string = "房间号:" + pdata.roomID + "  " + pdata.totalCircleOrRoundCnt + "/" + pdata.totalCircleOrRoundCnt ;
    }

    onBtnShare()
    {

    }

    onBtnGoOn()
    {
        cc.director.loadScene(SceneName.Scene_Main) ;
    }
    // update (dt) {}
}
