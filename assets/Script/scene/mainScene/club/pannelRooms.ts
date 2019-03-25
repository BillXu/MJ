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
import ClubPannel from "./clubPannel" ;
import RoomItem from "./roomItem"
import * as _ from "lodash"
import { eMsgPort,eMsgType } from "../../../common/MessageIdentifer"
import Network from "../../../common/Network";
import Utility from "../../../globalModule/Utility";
import { SceneName } from "../../../common/clientDefine";
import IClubDataComponent from "../../../clientData/clubData/IClubDataComponent";
import ClubDataRooms, { ClubRoomItem } from "../../../clientData/clubData/ClubDataRooms";
import ClientApp from "../../../globalModule/ClientApp";
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

    pClubDataRooms : ClubDataRooms = null ;

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

    refresh( data : IClubDataComponent )
    {
        if ( null == data )
        {
            this.hide();
            return ;
        }
        this.show();
        let club = data.getClub();
        this.pClubDataRooms = <ClubDataRooms>data;
        // recycle node ;
        this.vReserveNode = this.pLayout.node.children.concat(this.vReserveNode) ;
        this.pLayout.node.removeAllChildren();

 
        this.pShowDismissBtn.node.active = club.isSelfPlayerMgr() || club.isSelfPlayerOwner();

        if ( this.pClubDataRooms.vRooms.length <= 0 )
        {
            return ;
        }

        let vRooms : ClubRoomItem[] = this.pClubDataRooms.vRooms ;
        let self = this ;
        vRooms.forEach( ( item : ClubRoomItem )=>{
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
            roomItem.lpfCallBack = self.onRoomItemCallBack.bind(self);
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

    // onRoomDataUpdate( nRoomID : number )
    // {
    //     if ( -1 == nRoomID )
    //     {
    //         this.refresh();
    //         return ;
    //     }

    //     let pdata = this.pClubRoomData.getRoomItemByID(nRoomID);
    //     this.pLayout.node.children.every(( node : cc.Node )=>{
    //         let pRoomItem : RoomItem = node.getComponent(RoomItem);
    //         if ( pRoomItem == null )
    //         {
    //             cc.error( "why do not have room item compment ? " );
    //             return true;
    //         }

    //         if ( pRoomItem.getRoomID() == nRoomID )
    //         {
    //             pRoomItem.refresh(pdata);
    //             return false ;
    //         }

    //         return true ;
    //     });
    // }

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

    onRoomItemCallBack( isDismiss : boolean ,  nRoomID : number )
    {
        if ( isDismiss )
        {
            let self = this ;
            let msg = {} ;
            let port = Utility.getMsgPortByRoomID(nRoomID);
            Network.getInstance().sendMsg(msg,eMsgType.MSG_APPLY_DISMISS_VIP_ROOM,port,nRoomID,( js : Object )=>{
                let ret = js["ret"] ;
                if ( ret == 0 )
                {
                    self.pClubDataRooms.fetchData(true) ;
                }
                else
                {
                    Utility.showPromptText("error code = " + ret ) ;
                }
                return true ;
            });
        }
        else // enter room 
        {
            let msg = { } ;
            msg["roomID"] = nRoomID;
            msg["uid"] = ClientApp.getInstance().getClientPlayerData().getSelfUID();//ClientData.getInstance().selfUID;
            let port = Utility.getMsgPortByRoomID(nRoomID);
            if ( eMsgPort.ID_MSG_PORT_ALL_SERVER <= port || port < eMsgPort.ID_MSG_PORT_LUOMJ  )
            {
                Utility.showTip( "房间不存在或已经解散 code" + 0 );
                return ;
            }
    
            Network.getInstance().sendMsg(msg,eMsgType.MSG_ENTER_ROOM,port,nRoomID,( msg : Object)=>
            {
                let ret = msg["ret"] ;
                if ( ret )
                {
                    if ( 8 == ret )
                    {
                        Utility.showTip( "您的钻石不足，无法进入房间" + ret );
                        return true;
                    }
                    Utility.showTip( "房间不存在或已经解散 code" + ret );
                    return true;
                }
                console.log( "set join room id = " + nRoomID );
                ClientApp.getInstance().getClientPlayerData().getBaseData().stayInRoomID = nRoomID ;
                cc.director.loadScene(SceneName.Scene_Room ) ;
                return true ;
            } );
        }
    }
    // update (dt) {}
}
