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
import RoomPlayerInfo from "./roomPlayerInfo"
import { playerBaseData } from "./roomInterface"
import { eClientRoomState } from "./roomDefine"
import roomSceneLayerBase from "./roomSceneLayerBase"
import RoomData from "./roomData"
import { eMsgType } from "../../common/MessageIdentifer"
@ccclass
export default class PlayerInfoLayer extends roomSceneLayerBase {

    @property([RoomPlayerInfo])
    vPlayers : RoomPlayerInfo[] = [] ;

    @property([cc.Node])
    vWaitReadyStatePlayerPos : cc.Node[] = [] ;

    vGameStatePlayerPos : cc.Vec2[] = [];

    @property(cc.Node)
    pLeftTag : cc.Node = null ;

    @property(cc.Node)
    pRightTag : cc.Node = null ;

    @property(cc.Node)
    pUpTag : cc.Node = null ;

    @property(cc.Node)
    pBankIconForMoveAni : cc.Node = null ;

    ptBankIconAniStartPos : cc.Vec2 = cc.Vec2.ZERO ;

    // LIFE-CYCLE CALLBACKS:

    roomState : eClientRoomState = eClientRoomState.State_WaitReady ;
    isSelfRoomOwner : boolean = false ;
    onLoad () 
    {
        let self = this ;
        this.vPlayers.forEach( ( v : RoomPlayerInfo , idx : number )=>{
                this.vGameStatePlayerPos[idx] = cc.v2(v.node.position);
            } ) ;
        this.vWaitReadyStatePlayerPos.forEach( ( v: cc.Node)=>{ v.active = false ;});
        this.ptBankIconAniStartPos = this.pBankIconForMoveAni.position ;
        this.pBankIconForMoveAni.active = false ;
    }

    refresh( pdata : RoomData )
    {
        this.roomState = pdata.nRoomState ;
        let vPlayers = pdata.vPlayers ;

        this.vPlayers.forEach( ( v : RoomPlayerInfo )=>{
            v.refresh(null);
        } ) ;

        if ( vPlayers && vPlayers.length > 0 )
        {
            let self = this ;
            vPlayers.forEach( ( player : playerBaseData )=>{
                if ( player )
                {
                    self.vPlayers[player.clientIdx].refresh(player,self.roomState);
                }
            } ) ;
        }

        if ( eClientRoomState.State_WaitReady == this.roomState )
        {
            this.enterWaitReadyState(pdata);
            let self = this ;
            vPlayers.forEach( ( player : playerBaseData )=>{
                if ( player && player.isReady )
                {
                    self.onPlayerReady(player.clientIdx) ;
                }
            } ) ;
        }
        else 
        {
            this.enterGameState(pdata);
        }
    }

    start () {
        // let self = this ;
        // setTimeout(() => {
        //     self.vPlayers[0].showBankerIcon();
        //     self.playBankIconMoveAni(0);
        // }, 1000);

        // setTimeout(() => {
        //     self.vPlayers[0].showBankerIcon();
        //     self.playBankIconMoveAni(0);
        // }, 5000);
    }

    enterWaitReadyState( pdata : RoomData )
    {
        let self = this ;
        this.vPlayers.forEach( ( p : RoomPlayerInfo, idx : number )=>{
            p.node.position = cc.v2(self.vWaitReadyStatePlayerPos[idx].position);
            if ( p.isEmpty() == false )
            {
                p.enterWaitReadyState();
            }
            console.log( "update card to wait ready position = " + p.node.position.toString() + " idx = " + idx );
        } );

        this.pUpTag.active = this.vPlayers[2].isEmpty();
        this.pLeftTag.active = this.vPlayers[3].isEmpty();
        this.pRightTag.active = this.vPlayers[1].isEmpty();

        this.vPlayers[0].node.active = false ;
    }

    enterGameState( pdata : RoomData )
    {
        let self = this ;
        this.vPlayers.forEach( ( p : RoomPlayerInfo, idx : number )=>{
            p.node.position = cc.v2(self.vGameStatePlayerPos[idx]);
            if ( p.isEmpty() == false )
            {
                p.enterGameState();
                if ( pdata.svrIdxToClientIdx(pdata.bankerIdx) == idx )
                {
                    p.showBankerIcon();
                }
            }
        } );

        this.pUpTag.active = false;
        this.pLeftTag.active = false;
        this.pRightTag.active = false;

        this.vPlayers[0].node.active = true ;

        // delay player banker icon move ani
        setTimeout(() => {
            self.playBankIconMoveAni( pdata.svrIdxToClientIdx(pdata.bankerIdx)) ;
        }, 500);
    }

    onPlayerJoin( player : playerBaseData  )
    {
        this.vPlayers[player.clientIdx].refresh(player,this.roomState);
        if ( eClientRoomState.State_WaitReady == this.roomState )
        {
            this.pUpTag.active = this.vPlayers[2].isEmpty();
            this.pLeftTag.active = this.vPlayers[3].isEmpty();
            this.pRightTag.active = this.vPlayers[1].isEmpty();
        }
    }

    onPlayerLeave( clientIdx : number )
    {
        if ( this.roomState == eClientRoomState.State_StartGame)
        {
            cc.error( "not wait state , how can leave ?" );
            return ;
        }

        if ( 0 == clientIdx )
        {
            cc.error( "self leave should not come here" );
            return ;
        }

        this.vPlayers[clientIdx].refresh(null) ;
        if ( eClientRoomState.State_WaitReady == this.roomState )
        {
            this.pUpTag.active = this.vPlayers[2].isEmpty();
            this.pLeftTag.active = this.vPlayers[3].isEmpty();
            this.pRightTag.active = this.vPlayers[1].isEmpty();
        }
    }

    onPlayerReady( clientIdx : number )
    {
        if ( eClientRoomState.State_WaitReady != this.roomState )
        {
            cc.error( "not wait ready state , can not do ready idx = " + clientIdx );
            return ;
        }
        this.vPlayers[clientIdx].doReady();
        if ( clientIdx == 0 )
        {
            this.vPlayers[0].node.active = true ;
        }
    }

    onPlayerRefreshSate( clientIdx : number , isOnlien : boolean )
    {
        this.vPlayers[clientIdx].isOnline = isOnlien ;
    }

    onRefreshPlayerDetail( player : playerBaseData )
    {
        this.vPlayers[player.clientIdx].refresh(player,this.roomState);
    }

    playBankIconMoveAni( nBakerClientIdx : number )
    {
        this.pBankIconForMoveAni.active = true ;
        this.pBankIconForMoveAni.position = this.ptBankIconAniStartPos ;
        this.pBankIconForMoveAni.scale = 2;
        let actShow = cc.show() ;
        let actScaleSmall = cc.scaleTo(0.3,1);
        let delay = cc.delayTime(0.1) ;
        let actScaleBig = cc.scaleTo(0.2,2);
        let targetPos = this.vPlayers[nBakerClientIdx].pBankIcon.position ;
        targetPos = this.vPlayers[nBakerClientIdx].pBankIcon.getParent().convertToWorldSpaceAR(targetPos);
        targetPos = this.pBankIconForMoveAni.getParent().convertToNodeSpaceAR(targetPos);
        let actMove = cc.moveTo(0.9,targetPos);
        let scaleNormal = cc.scaleTo(actMove.getDuration(),1);
        let spawMove = cc.spawn(actMove,scaleNormal);
        let acthide = cc.hide();
        let playerInfo = this.vPlayers[nBakerClientIdx] ;
        let actFunc = cc.callFunc(()=>{ playerInfo.flipBankerIcon();});
        this.pBankIconForMoveAni.runAction(cc.sequence(actShow,actScaleSmall,delay,actScaleBig,spawMove,acthide,actFunc));
    }

    onMsg( nMsgID : eMsgType , msg : Object ) : boolean 
    {
        if ( eMsgType.MSG_ROOM_SCMJ_GAME_END == nMsgID )
        {
            let vPlayer : Object[] = msg["players" ] ;
            let self = this ;
            vPlayer.forEach( ( p : Object )=>{
                let svrIdx = p["idx"] ;
                let coin = p["chips"] ;
                let clientIdx = self.roomScene.pRoomData.svrIdxToClientIdx(svrIdx);
                this.vPlayers[clientIdx].coin = coin ;
            } );
        }
        return false ;
    }
    // update (dt) {}
}
