import DlgBase from "../../../common/DlgBase";
import LocationPlayer from "./locatiionPlayer";
import RoomData from "../roomData";
import { playerBaseData } from "../roomInterface";
import GPSManager from "../../../sdk/GPSManager";

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

@ccclass
export default class DlgLocation extends DlgBase {

    @property([cc.Label])
    vDistance: cc.Label[] = []; 

    @property([LocationPlayer]) 
    vPlayers : LocationPlayer[] = [] ;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose);
        let pRoomData : RoomData = jsUserData ;
        this.refresh(pRoomData);
    }

    refresh( pRoomData : RoomData )
    {
        // fill player 
        for ( let idx = 1 ; idx < pRoomData.getMaxTableSeat(); ++idx )
        {
            let localIdx = idx - 1 ;
            if ( localIdx >= this.vPlayers.length )
            {
                console.error( "player is more than seat idx = " + idx + " max = " + pRoomData.getMaxTableSeat() );
                continue ;
            }

            this.vPlayers[localIdx].refresh(pRoomData.getPlayerDataByClientIdx(idx)) ;
        }

        // caculate distance 
        let player1 = pRoomData.getPlayerDataByClientIdx(1);
        let player2 = pRoomData.getPlayerDataByClientIdx(2);
        let player3 = pRoomData.getPlayerDataByClientIdx(3);
        // distance 0 ,  clientidx 1 - 2
        let dis = DlgLocation.getDistance(player1,player2);
        this.vDistance[0].string = dis < 0 ? "?" : ( dis + "米");
        // distance 1 ,cliend idx 2-3 
        dis = DlgLocation.getDistance(player2,player3);
        this.vDistance[1].string = dis < 0 ? "?" : ( dis + "米");
        // disntance 2 , client idx 3- 1
        dis = DlgLocation.getDistance(player3,player1); 
        this.vDistance[2].string = dis < 0 ? "?" : ( dis + "米");
    }

    static getDistance( player1 : playerBaseData, player2 : playerBaseData ) : number
    {
        if ( player1 == null || player2 == null || player1.J < 1 || player2.J < 1 || player1.W < 1 || player2.W < 1 )
        {
            return -1 ;
        }
        else
        {
            return GPSManager.getInstance().caculateDistance(player1.J,player1.W,player2.J,player2.W);
        }
    }
    // update (dt) {}
}
