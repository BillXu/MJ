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
@ccclass
export default class PlayerInfoLayer extends cc.Component {

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

        self.refresh(eClientRoomState.State_WaitReady,null);
    }

    refresh( clientRoomState : eClientRoomState , vPlayers: playerBaseData[] )
    {
        this.roomState = clientRoomState ;

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
            this.enterWaitReadyState();
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
            this.enterGameState();
        }
    }

    start () {

    }

    enterWaitReadyState()
    {
        let self = this ;
        this.vPlayers.forEach( ( p : RoomPlayerInfo, idx : number )=>{
            p.node.position = cc.v2(self.vWaitReadyStatePlayerPos[idx].position);
            if ( p.isEmpty() == false )
            {
                p.enterWaitReadyState();
            }
        } );

        this.pUpTag.active = this.vPlayers[2].isEmpty();
        this.pLeftTag.active = this.vPlayers[3].isEmpty();
        this.pRightTag.active = this.vPlayers[1].isEmpty();

        this.vPlayers[0].node.active = false ;
    }

    enterGameState()
    {
        let self = this ;
        this.vPlayers.forEach( ( p : RoomPlayerInfo, idx : number )=>{
            p.node.position = cc.v2(self.vGameStatePlayerPos[idx]);
            if ( p.isEmpty() == false )
            {
                p.enterGameState();
            }
        } );

        this.pUpTag.active = false;
        this.pLeftTag.active = false;
        this.pRightTag.active = false;

        this.vPlayers[0].node.active = true ;
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
    // update (dt) {}
}
