import MJRoomData from "../../roomScene/roomData/MJRoomData";
import OptsSuZhou from "../../../opts/OptsSuZhou";
import MJRoomBaseData from "../../roomScene/roomData/MJRoomBaseData";
import MJPlayerData from "../../roomScene/roomData/MJPlayerData";
import ResultSingleDataSZ from "./ResultSingleDataSZ";
import { eMsgType } from "../../../common/MessageIdentifer";

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
export default class RoomDataSuZhou extends MJRoomData {

    createCompoentData() : void
    {
        this.mOpts = new OptsSuZhou();
        this.mBaseData = new MJRoomBaseData();
        this.mSinglResultData = new ResultSingleDataSZ();
 
        let icnt = 4 ;
        while ( icnt-- )
        {
            this.mPlayers.push( new MJPlayerData() );
        }
    }

    protected onMsgPart2( nMsgID : eMsgType , msg : Object ) : boolean
    {
        if ( eMsgType.MSG_ROOM_SCMJ_GAME_END == nMsgID )
        {
            this.mSinglResultData.parseResultSZ(msg,this);
            for ( const item of this.mPlayers )
            {
                if ( null == item || item.isEmpty() )
                {
                    continue ;
                }

                let pr = this.mSinglResultData.mResults[item.mPlayerBaseData.svrIdx];
                
                if ( pr.isEmpty() == false )
                {
                    item.mPlayerBaseData.chip = pr.mFinalChip ;
                    item.mPlayerCard.vHoldCard.length = 0 ;
                    item.mPlayerCard.vHoldCard = item.mPlayerCard.vHoldCard.concat(pr.mAnHoldCards );
                }
            }

            this.mSceneDelegate.onGameEnd(this.mSinglResultData) ;
            this.endGame();
            return true;
        }
        return super.onMsgPart2( nMsgID, msg );
    }
}
