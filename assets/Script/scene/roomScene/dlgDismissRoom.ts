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
import DlgBase from "../../common/DlgBase"
import PhotoItem from "../../commonItem/photoItem"
import RoomData from "./roomData";
import { playerBaseData } from "./roomInterface";
@ccclass
export default class DlgDismiss extends DlgBase {

    @property([cc.Label])
    vPlayerName: cc.Label[] = [];  // array idx = svr idx ;

    @property(PhotoItem)
    vPlayerIcon : PhotoItem[] = [] ;

    @property(cc.Node)
    vAgreeIcon : cc.Node[] = [] ;

    @property(cc.Label)
    pTimeCountDown : cc.Label = null ;
    nTimeCountDown: number = 0 ;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Label)
    pDesc : cc.Label = null ;
    // onLoad () {}

    refresh( invokerSvrIdx : number , pData : RoomData , time : number , vArgeeSvrIdx? : number[] )
    {
        this.reset();
        pData.vPlayers.forEach( ( p : playerBaseData )=>{
            this.vPlayerIcon[p.svrIdx].photoURL = p.headIconUrl ;
            this.vPlayerName[p.svrIdx].string = p.name ;
            this.vPlayerName[p.svrIdx].node.active = true ;
            this.vPlayerIcon[p.svrIdx].node.active = true ;
        } );

        let invoker = pData.getPlayerDataBySvrIdx(invokerSvrIdx);
        if ( null == invoker )
        {
            cc.error( "invoker is null uid = " + invokerSvrIdx );
            return ;
        }
        this.vAgreeIcon[invoker.svrIdx].active = true ;
        vArgeeSvrIdx = vArgeeSvrIdx || [] ;
        let self = this ;
        vArgeeSvrIdx.forEach( ( svrIdx : number )=>{ self.vAgreeIcon[svrIdx].active = true ;} );

        this.pDesc.string = "玩家【 " + invoker.name + " 】请求解散房间，是否同意?(超过300秒则默认同意)。";

        this.unschedule(this.onTimeCountDown) ;
        this.schedule(this.onTimeCountDown,1,time + 1 ) ;
        this.nTimeCountDown = time ;
        this.pTimeCountDown.string = this.nTimeCountDown.toString();
    }

    onTimeCountDown()
    {
        if ( this.nTimeCountDown <= 0  )
        {
            this.unschedule(this.onTimeCountDown) ;
            // do agree ;
            this.onBtnAgree();
            return ;
        }

        --this.nTimeCountDown ;
        this.pTimeCountDown.string = this.nTimeCountDown.toString();
    }

    onPlayerReply( playerSvrIdx : number, isAgree : boolean  )
    {
        this.vAgreeIcon[playerSvrIdx].active = isAgree ;
    }

    reset()
    {
        for ( let idx = 0 ; idx < this.vPlayerIcon.length ; ++idx )
        {
            this.vAgreeIcon[idx] ? this.vAgreeIcon[idx].active = false : 0 ;
            this.vPlayerIcon[idx] ? this.vPlayerIcon[idx].node.active = false : 0 ;
            this.vPlayerName[idx] ? this.vPlayerName[idx].node.active = false : 0 ;
            this.pTimeCountDown.string = "0" ; 
        }
    }

    start () {

    }

    onBtnAgree()
    {
        if ( this.pFuncResult )
        {
            this.pFuncResult({ isAgree : true }) ;
        }
    }

    onBtnDisagree()
    {
        if ( this.pFuncResult )
        {
            this.pFuncResult({ isAgree : false }) ;
        }
        this.closeDlg();
    }

    // update (dt) {}
}
