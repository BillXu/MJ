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
import listView from "../../../commonItem/ListView"
import { AbsAdapter } from "../../../commonItem/ListView"
import ClubListItem from "./clubListItem"
import ClubData from "./clubData"
import OptsJoinOrCreate from "./dlgJoinOrCreate"
import DlgJoinRoomOrClub from "../dlgJoinRoomOrClub"
import DlgCreateClubTip from "./dlgCreateClubTip";
import DlgCreateClubVerify from "./dlgCreateClubVerify";
import DlgCreateRoom from "../dlgCreateRoom";
import Network from "../../../common/Network";
import { eMsgPort,eMsgType } from "../../../common/MessageIdentifer"
import Utility from "../../../globalModule/Utility";
@ccclass
class clubItemData
{
    name : string = "" ;
    id : number = 0 ;
}

export default class ClubList extends cc.Component {

    @property(listView)
    pList: listView = null;

    pListAdapter : listClubAdpter = null ;
    // LIFE-CYCLE CALLBACKS:
    vClubs : clubItemData[] = [] ;
    
    @property([cc.Component.EventHandler])
    vSelClubItemCallBack : cc.Component.EventHandler[] = [] ;

    @property([cc.Component.EventHandler])
    vCreateClubSuccess : cc.Component.EventHandler[] = [] ;

    @property(OptsJoinOrCreate)
    pOptsJoinOrCreate : OptsJoinOrCreate = null ;

    @property(DlgJoinRoomOrClub)
    pDlgJoinClub : DlgJoinRoomOrClub = null ;

    @property(DlgCreateClubTip)
    pDlgCrateClubTip : DlgCreateClubTip = null ;

    @property(DlgCreateClubVerify)
    pDlgCrateClubVerify : DlgCreateClubVerify = null ;

    @property(DlgCreateRoom)
    pDlgCreateRoom : DlgCreateRoom = null ;

    strCreateRoomName : string = "";

    onLoad () 
    {
        this.pListAdapter = new listClubAdpter();
        this.pListAdapter.targetNode = this.node ;
        this.pList.setAdapter(this.pListAdapter);
        this.pListAdapter.setDataSet(this.vClubs);
    }

    start () {

    }

    refresh( vClubs : ClubData[] )
    {
        let self = this ;
        vClubs.forEach( ( d : ClubData)=>{
            let p = new clubItemData();
            p.id = d.clubID ;
            p.name = d.name ;
            self.vClubs.push(p);
        } );
        this.pListAdapter.setDataSet(this.vClubs);
        this.pList.notifyUpdate();
    }

    onClubListItemSel( event : cc.Event.EventTouch )
    {
        let node = event.target ;
        let com : cc.Toggle = node.getComponent(cc.Toggle);
        if ( com.isChecked == false )
        {
            return ;
        }

        let com2 : ClubListItem = node.getComponent(ClubListItem);
        let selClubID = com2.id  ;
        cc.Component.EventHandler.emitEvents(this.vSelClubItemCallBack,selClubID) ;
    }

    onClickAddClub()
    {
        // show dlg ;
        this.pOptsJoinOrCreate.showDlg();
    }

    onShowJoinClubDlg( btn : cc.Button )
    {
        this.pDlgJoinClub.setDlgTitle(false); // must invoke ,before show ;
        this.pDlgJoinClub.showDlg( this.onJoinClubDlgResult.bind(this));
    }

    protected onJoinClubDlgResult( nJoinRoomID : string )
    {
        console.log( "onJoinClubDlgResult " + nJoinRoomID );
        let applyClubID : number = parseInt(nJoinRoomID);
        let msg = { } ;
        msg["clubID"] = applyClubID;
        Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_APPLY_JOIN,eMsgPort.ID_MSG_PORT_CLUB,applyClubID,( msg : Object)=>
        {
            let ret = msg["ret"] ;
            let vError = [ "加入申请已经提交，请耐心等待管理员审批","您已经在该俱乐部里","您已经申请了，请勿重复申请，耐心等待管理员审批","俱乐部成员数量已达上限","玩家对象为空"] ;
            if ( vError.length <= ret )
            {
                Utility.showTip("unknown error code = " + ret ) ;
                return true ;
            }
            Utility.showTip( vError[ret] );
            return true ;
        } );
    }

    showCreateClubDlg()
    {
        this.pDlgCrateClubTip.showDlg(this.onClubTipResult.bind(this)) ;
    }

    protected onClubTipResult()
    {
        this.pDlgCrateClubVerify.showDlg( this.onDlgVerifyResult.bind(this) );
    }

    protected onDlgVerifyResult( jsName : string )
    {
        this.strCreateRoomName = jsName ;
        this.pDlgCreateRoom.showDlg(this.onCreateRoomDlgResult.bind(this)) ;
    }

    protected onCreateRoomDlgResult( msgCreateRoom : Object )
    {
         let self = this ;
         let msg = { } ;
         msg["name"] = this.strCreateRoomName ;
         msg["opts"] = msgCreateRoom ;
         Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_CREATE_CLUB,eMsgPort.ID_MSG_PORT_CLUB,Math.random() % 100 ,( msg : Object )=>{
            let ret : number = msg["ret"] ;
            let vError = ["ok","条件不满足","名字重复"] ;
            if ( ret == 0 )
            {
                let p = new clubItemData();
                p.id = msg["clubID"] ;
                p.name = self.strCreateRoomName ;
                self.vClubs.push(p);
                self.pList.notifyUpdate();
                cc.Component.EventHandler.emitEvents(self.vCreateClubSuccess,p.id) ;
            }
            else
            {
                Utility.showTip(vError[ret]);
            }
            return true ;
         }) ;
    }
    // update (dt) {}
}

class listClubAdpter extends AbsAdapter
{
    targetNode : cc.Node = null  ;
    updateView( item: cc.Node, posIndex: number )
    {
        let comp = item.getComponent(ClubListItem);
        if (comp) {
            let pInfo = this.getItem(posIndex) ;
            comp.refresh(pInfo.id,pInfo.name) ;
        }

        let comp2 = item.getComponent(cc.Toggle);
        if ( comp2 )
        {
            if ( comp2.clickEvents.length == 0 )
            {
                let handle = new cc.Component.EventHandler();
                handle.target = this.targetNode  ;
                handle.component = "ClubList";
                handle.handler = "onClubListItemSel" ;
                comp2.clickEvents.push(handle);
            }
        }
    }
}
