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
import PlayerInfoItem from "../../../../commonItem/PlayerInfoItem";
import { IClubRoomsDataItem, ClubRoomItemPlayer } from "./IClubRoomsData";
@ccclass
export default class RoomItem extends cc.Component {

    @property(cc.Label)
    pRoomID: cc.Label = null;

    @property(cc.Label)
    pRoundState: cc.Label = null;

    @property(cc.Node)
    pDissmissNode : cc.Node = null ;

    @property(cc.Node)
    pBtnCover : cc.Node = null ;

    @property([PlayerInfoItem])
    vHeadIcon : PlayerInfoItem[] = [] ; 

    @property(cc.Node)
    pWaiting : cc.Node = null ;

    @property([cc.Node])
    vSeats : cc.Node[] = [] ;
    // LIFE-CYCLE CALLBACKS:
    lpfCallBack : ( isDismiss : boolean,roomID : number )=>void = null ;

    private  roomID : number = 0 ;

    // onLoad () {}

    set isShowDissmissBtn ( isShowBtn : boolean )
    {
        this.pDissmissNode.active = isShowBtn ;
        this.pBtnCover.active = !isShowBtn ;
    }

    start () {
        
    }

    refresh( pdata : IClubRoomsDataItem )
    {
        this.isShowDissmissBtn = false ;
        this.roomID = pdata.nRoomID ;
        this.pRoomID.string = pdata.nRoomID.toString();
        this.pWaiting.active = pdata.isOpen == false ;
        this.pRoundState.node.active = pdata.isOpen ;
        for ( let idx in this.vSeats )
        {
            this.vSeats[idx].active = parseInt(idx) < pdata.seatCnt ;
        }
        
        if ( pdata.isOpen )
        {
            this.pRoundState.string = pdata.playedRound + "/" + pdata.totalRound + ( pdata.isCircle ? "圈" : "局" );
        }
        
        for ( let idx = 0 ; idx < this.vHeadIcon.length ; ++idx )
        {
            this.vHeadIcon[idx].node.active = false ;
        }

        let self = this ;
        pdata.vRoomPeers.forEach( ( pd : ClubRoomItemPlayer,idx : number )=>{
            self.vHeadIcon[idx].refreshInfo( pd.nUID) ;
        } );
    }

    getRoomID() : number
    {
        return this.roomID ;
    }

    onClickDismiss()
    {
        if ( this.lpfCallBack )
        {
            this.lpfCallBack(true,this.roomID);
        }
    }

    onClickRoomItem()
    {
        if ( this.lpfCallBack )
        {
            this.lpfCallBack(false,this.roomID);
        }
    }

    // update (dt) {}
}
