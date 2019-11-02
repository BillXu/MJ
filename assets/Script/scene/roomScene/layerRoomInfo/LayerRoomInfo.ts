import ClientApp from "../../../globalModule/ClientApp";
import ILayerRoomInfo from "../ILayerRoomInfo";
import IRoomSceneData, { IRoomInfoData } from "../IRoomSceneData";

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
export default class LayerRoomInfo extends cc.Component implements ILayerRoomInfo {

    @property(cc.Label)
    roomID: cc.Label = null;

    @property(cc.Label)
    baseScore: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Label)
    rules : cc.Label = null;

    @property(cc.Label)
    leftMJCnt : cc.Label = null;

    @property(cc.Label)
    version : cc.Label = null;

    @property(cc.Label)
    curTime : cc.Label = null;

    @property([cc.Sprite])
    batteryLevel : cc.Sprite[] = [] ;

    _leftMJCnt : number = 0 ;

    mData : IRoomInfoData = null ;
    get leftMJCardCnt() : number
    {
        return this._leftMJCnt ;
    }

    set leftMJCardCnt( v : number )
    {
        this._leftMJCnt = v ;
        this.leftMJCnt.string = v.toString();
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    refresh( data : IRoomSceneData ) : void 
    {
        this.mData = data.getRoomInfoData();
        this.unscheduleAllCallbacks();
        this.roomID.string = this.mData.getRoomID().toString() ;
        this.baseScore.string = "1" ;
        this.rules.string = this.mData.getRule() ;
        this.leftMJCardCnt = this.mData.getLeftMJCnt() ;
        this.version.string = ClientApp.getInstance().getConfigMgr().getClientConfig().VERSION;
        
        this.schedule(this.refreshTime,60,cc.macro.REPEAT_FOREVER,0);
        this.schedule(this.refreshBatteryLevel,300,cc.macro.REPEAT_FOREVER,0);
    }

    onGameStart() : void
    {

    }

    onGameEnd()
    {

    }

    protected refreshTime()
    {
        let dt = new Date();
        if ( dt.getMinutes() < 10 )
        {
            this.curTime.string = dt.getHours() + ":0" + dt.getMinutes();
        }
        else
        {
            this.curTime.string = dt.getHours() + ":" + dt.getMinutes();
        }
    }

    protected refreshBatteryLevel()
    {
        let power = cc.sys.getBatteryLevel() * this.batteryLevel.length;
        for ( let i = 0 ; i < this.batteryLevel.length ; ++i )
        {
            this.batteryLevel[i].node.active = i <= power ;
        }
    }

    // update (dt) {}
}
