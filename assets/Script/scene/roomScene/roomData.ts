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
import { IHoldMingPai,IPlayerCards,playerBaseData } from "./roomInterface"
import { eClientRoomState } from "./roomDefine"
import { eMsgType } from "../../common/MessageIdentifer"
@ccclass
export default class RoomData extends cc.Component {

    jsRoomOpts : Object = {} ;
    vPlayers : playerBaseData[] = [] ;
     
    nRoomState : eClientRoomState = 0 ;

    lastChuCard : number = 0 ;
    lastChuPlayerClientIdx : number = 0 ;
    nBankerIdx : number = 0 ;
    isRoomOpened : boolean = false ;
    
    letfMJCnt : number = 0 ;
    playedCircle : number = 0 ;

    get totalCircleCnt() : number
    {
        return 0 ;
    }
    
    get roomID() : number 
    {
        return 0 ;
    }



    onLoad () 
    {
        this.nRoomState = eClientRoomState.State_WaitReady ;
    }

    onMsg( msgType : eMsgType , msg : Object )
    {

    }

    getPlayerData( clientIdx : number ) : playerBaseData
    {
        for ( let idx = 0 ; idx < this.vPlayers.length ; ++idx )
        {
            if ( this.vPlayers[idx].clientIdx == clientIdx )
            {
                return this.vPlayers[idx] ;
            }
        }     
        return null ;
    }

    isSelfRoomOwner() : boolean
    {
        return false ;
    }


    enterWaitReadyState()
    {
        this.nRoomState = eClientRoomState.State_WaitReady ;
    }

    enterGameState()
    {
        this.nRoomState = eClientRoomState.State_StartGame ;
    }

    enterGameOverState()
    {
        this.nRoomState = eClientRoomState.State_GameOver ;
    }

    start () {

    }

    // update (dt) {}
}
