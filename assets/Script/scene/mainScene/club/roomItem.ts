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
import PhotoItem from "../../../commonItem/photoItem";
import { RoomDataItem } from "./clubRoomData"
@ccclass
export default class RoomItem extends cc.Component {

    @property(cc.Label)
    pRoomID: cc.Label = null;

    @property(cc.Label)
    pRoundState: cc.Label = null;

    @property(cc.Node)
    pDissmissBtn : cc.Node = null ;

    @property([cc.Label])
    vNames : cc.Label[] = [] ;

    @property([PhotoItem])
    vHeadIcon : PhotoItem[] = [] ;

    @property(cc.Node)
    pWaiting : cc.Node = null ;
    // LIFE-CYCLE CALLBACKS:
    lpfCallBack : ( roomID : number )=>void = null ;

    private  roomID : number = 0 ;

    // onLoad () {}

    set isShowDissmissBtn ( isShowBtn : boolean )
    {
        this.pDissmissBtn.active = isShowBtn ;
    }

    start () {
        this.isShowDissmissBtn = false ;
    }

    refresh( pdata : RoomDataItem )
    {
        this.roomID = pdata.roomID ;
        this.pRoomID.string = pdata.roomID.toString();
        this.pWaiting.active = pdata.isOpen == false ;
        this.pRoundState.node.active = pdata.isOpen ;
        if ( pdata.isOpen )
        {
            this.pRoundState.string = pdata.playedRound + "/" + pdata.totalRound + ( pdata.isCircle ? "圈" : "局" );
        }
        
        for ( let idx = 0 ; idx < this.vHeadIcon.length ; ++idx )
        {
            this.vHeadIcon[idx].node.active = false ;
            this.vNames[idx].node.active = false ;
        }

        let self = this ;
        pdata.vPlayers.forEach( ( pd : Object,idx : number )=>{
            self.vHeadIcon[idx].photoURL = pd["headIcon"] || "" ;
            self.vNames[idx].string = pd["name"] || "loading" ;
            self.vHeadIcon[idx].node.active = false ;
            self.vNames[idx].node.active = false ;
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
            this.lpfCallBack(this.roomID);
        }
    }

    // update (dt) {}
}
