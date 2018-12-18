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
import ClubData from "./clubData" ;
import ClubPannel from "./clubPannel" ;
import ClubRoomData, { RoomDataItem } from "./clubRoomData"
import RoomItem from "./roomItem"
import * as _ from "lodash"
@ccclass
export default class PannelRoom extends ClubPannel {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Prefab)
    pPrefabItem : cc.Prefab = null ;

    @property(cc.Layout)
    pLayout : cc.Layout = null ;

    @property(cc.Node)
    pScrollViewContent : cc.Node = null ;

    @property(cc.Toggle)
    pShowDismissBtn : cc.Toggle = null ;

    pClubRoomData : ClubRoomData = null ;
    vReserveNode : cc.Node[] = [] ;
    start () {

        // // test code 
        // let self = this ;
        // setTimeout(() => {
        //     for ( let idx = 0 ; idx < 10 ; ++idx )
        //     {
        //         let pNode = cc.instantiate(self.pPrefabItem);
        //         self.pLayout.node.addChild(pNode);
        //     }

        //             // delay update scrollview content size ;
        // setTimeout(() => {
        //     let size = self.pLayout.node.getContentSize();
        //     let scrollViewSize = self.pScrollViewContent.getParent().getContentSize();
        //     self.pScrollViewContent.setContentSize(cc.size(scrollViewSize.width,scrollViewSize.height > size.height ? scrollViewSize.height : size.height ) );    
        // }, 80);
        // }, 1000);
        // // test code end 
    }

    show( data : ClubData )
    {
        super.show(data);
        if ( this.pClubRoomData )
        {
            this.pClubRoomData.onLoseFocus();
        }
        
        if ( data == null )
        {
            this.refresh();
            return ;
        }

        this.pShowDismissBtn.node.active = data.canSelfDismissClubRoom();
        this.pClubRoomData = data.pClubRoomData ;
        data.pClubRoomData.lpfCallBack = this.onRoomDataUpdate.bind(this);
        if ( this.pClubRoomData.isNeedRefreshData() )
        {
            this.pClubRoomData.featchData() ;
        }
        this.refresh();
    }

    refresh()
    {
        // recycle node ;
        this.vReserveNode = this.pLayout.node.children.concat(this.vReserveNode) ;
        this.pLayout.node.removeAllChildren();

        if ( this.pClubRoomData == null )
        {
            return ;
        }

        if ( this.pClubRoomData.vRoomDataItems.length <= 0 )
        {
            return ;
        }

        let vRooms : RoomDataItem[] = this.pClubRoomData.vRoomDataItems ;
        let self = this ;
        vRooms.forEach( ( item : RoomDataItem )=>{
            let pNode : cc.Node = null ;
            if ( self.vReserveNode.length > 0 )
            {
                pNode = self.vReserveNode.pop();
            }
            else
            {
                pNode = cc.instantiate(self.pPrefabItem);
            }

            let roomItem : RoomItem = pNode.getComponent(RoomItem);
            if ( roomItem == null )
            {
                cc.error( "why node do not have component RoomItem ");
                return ;
            }
            roomItem.refresh(item);
            roomItem.isShowDissmissBtn = self.pShowDismissBtn.node.active && self.pShowDismissBtn.isChecked ;
            self.pLayout.node.addChild(pNode);
        });

        // delay update scrollview content size ;
        setTimeout(() => {
            let size = self.pLayout.node.getContentSize();
            let scrollViewSize = self.pScrollViewContent.getParent().getContentSize();
            self.pScrollViewContent.setContentSize(cc.size(scrollViewSize.width,scrollViewSize.height > size.height ? scrollViewSize.height : size.height ) );    
        }, 80);
    }

    onRoomDataUpdate( nRoomID : number )
    {
        if ( -1 == nRoomID )
        {
            this.refresh();
            return ;
        }

        let pdata = this.pClubRoomData.getRoomItemByID(nRoomID);
        this.pLayout.node.children.every(( node : cc.Node )=>{
            let pRoomItem : RoomItem = node.getComponent(RoomItem);
            if ( pRoomItem == null )
            {
                cc.error( "why do not have room item compment ? " );
                return true;
            }

            if ( pRoomItem.getRoomID() == nRoomID )
            {
                pRoomItem.refresh(pdata);
                return false ;
            }

            return true ;
        });
    }

    onToggleEvent()
    {
        let isCheck = this.pShowDismissBtn.isChecked ;
        this.pLayout.node.children.forEach(( node : cc.Node )=>{
            let pRoomItem : RoomItem = node.getComponent(RoomItem);
            if ( pRoomItem == null )
            {
                cc.error( "why do not have room item compment ? " );
                return;
            }
            pRoomItem.isShowDissmissBtn = isCheck ;
        });
    }
    // update (dt) {}
}
