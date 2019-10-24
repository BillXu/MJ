import IClubPannelRoom from "./IClubPannelRoom";
import IClubRoomsData, { IClubRoomsDataItem } from "./IClubRoomsData";
import RoomItem from "./roomItem";
import IDlgClubData from "../IDlgClubData";

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
export default class ClubPannelRoom extends cc.Component implements IClubPannelRoom {

    @property(cc.Prefab)
    mRoomItemPrefab : cc.Prefab = null ;

    @property(cc.Node)
    mContent : cc.Node = null ;

    @property(cc.Toggle)
    mToggleDismissRoom : cc.Toggle = null ;

    mData : IClubRoomsData = null ;
    mIsDitry : boolean = false ;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}

    start () {
        //this.refresh( new ClubRoomsData() );
    }

    protected refresh( data : IClubRoomsData )
    {
        this.mData = data ;
        this.mToggleDismissRoom.node.active = data.canDimissRoom();
        this.mToggleDismissRoom.uncheck();
        let vRecycle : cc.Node[] = this.mContent.children ;
        this.mContent.removeAllChildren(true);
        let vItmes : IClubRoomsDataItem[] = data.getRoomItems();
        for ( let idx = 0 ; idx < vItmes.length; ++idx )
        {
            let p : cc.Node = null ;
            if ( idx < vRecycle.length )
            {
                p = vRecycle[idx] ;
            }
            else
            {
                p = cc.instantiate(this.mRoomItemPrefab) ;
            }
            this.mContent.addChild(p);
            let roomItem = p.getComponent(RoomItem);
            roomItem.lpfCallBack = this.onRoomItemCallBack.bind(this);
            roomItem.refresh(vItmes[idx]) ;
            roomItem.isShowDissmissBtn = this.mToggleDismissRoom.isChecked && data.canDimissRoom();
            cc.log( "toggole dismiss is check = " + this.mToggleDismissRoom.isChecked );
        }
    }

    protected clear()
    {
        this.mContent.removeAllChildren();
        this.mToggleDismissRoom.node.active = false ;
        this.mData = null ;
    }

    protected onRoomItemCallBack( isDismiss : boolean ,  nRoomID : number )
    {
        if ( isDismiss )
        {
            this.mData.reqDissmissRoom( nRoomID ) ;
        }
        else
        {
            this.mData.reqEnterRoom( nRoomID );
        }
    }
    // update (dt) {}
    onChangedClub( data : IDlgClubData ) : void 
    {
        this.mIsDitry = true ;
        this.mData = data == null ? null : data.getClubRoomData() ;
    }

    onShowPannel() : void 
    {
        if ( this.mIsDitry )
        {
            this.mData != null ? this.refresh( this.mData ) : this.clear();
            this.mIsDitry = false ;
        }
    }

    onHidePannel() : void 
    {

    }

    onToggleDissmissButton( toggle : cc.Toggle )
    {
        this.mContent.children.forEach( ( p : cc.Node )=>{
            let pi = p.getComponent(RoomItem);
            pi.isShowDissmissBtn = toggle.isChecked ;
        } );
    }
}
