import MJRoomData from "../../roomScene/roomData/MJRoomData";
import OptsDanDong from "../../../opts/OptsDanDong";
import MJRoomBaseData from "../../roomScene/roomData/MJRoomBaseData";
import MJPlayerData from "../../roomScene/roomData/MJPlayerData";

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
export default class DanDongRoomData extends MJRoomData {

    createCompoentData() : void
    {
        this.mOpts = new OptsDanDong();
        this.mBaseData = new MJRoomBaseData();
        let icnt = 4 ;
        while ( icnt-- )
        {
            this.mPlayers.push( new MJPlayerData() );
        }
    }
}
