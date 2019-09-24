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
import OptsJoinOrCreate from "./dlgJoinOrCreate"
import DlgJoinRoomOrClub from "../dlgJoinRoomOrClub"
import DlgCreateClubTip from "./dlgCreateClubTip";
import DlgCreateClubVerify from "./dlgCreateClubVerify";
import Network from "../../../common/Network";
import { eMsgPort,eMsgType } from "../../../common/MessageIdentifer"
import Utility from "../../../globalModule/Utility";
import ClubData from "../../../clientData/clubData/ClubData";
import ClientApp from "../../../globalModule/ClientApp";
import DlgCreateRoom from "../dlgCreateRoom/DlgCreateRoom";
import IOpts from "../../../opts/IOpts";
class clubItemData
{
    name : string = "" ;
    id : number = 0 ;    
    isSelected : boolean = false ;    
}

@ccclass
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
 
    }

    start () {
        // this.pListAdapter = new listClubAdpter();
        // this.pListAdapter.lpCallBack = this.onClubListItemSel.bind(this) ;
        // this.pListAdapter.setDataSet([1,1,1,1,1,1,1,1]);
        // this.pList.setAdapter(this.pListAdapter);
    }

    getSelectedClubID() : number 
    {
        let selectedClubID = -1 ;
        for ( let v of this.vClubs )
        {
            if ( v.isSelected )
            {
                selectedClubID = v.id ;
                break ;
            }
        }

        return selectedClubID ;
    }

    refresh( vClubs : ClubData[] )
    {
        if ( null == this.pListAdapter )
        {
            this.pListAdapter = new listClubAdpter();
            this.pListAdapter.lpCallBack = this.onClubListItemSel.bind(this) ;
            this.pListAdapter.setDataSet(this.vClubs);
            this.pList.setAdapter(this.pListAdapter);
        }

        let selectedClubID = this.getSelectedClubID() ;

        let self = this ;
        this.vClubs.length = 0 ;
        vClubs.forEach( ( d : ClubData,idx : number )=>{
            let p = new clubItemData();
            p.id = d.getClubID() ;
            p.name = "" ;
            if ( d.getClubBase()._dataJs )
            {
                p.name = d.getClubBase().name ;
            }
            
            if ( selectedClubID == -1 )
            {
                p.isSelected = idx == 0 ;
            }
            else
            {
                p.isSelected = selectedClubID == p.id ;
            }
            self.vClubs.push(p);
        } );
        this.pListAdapter.setDataSet(this.vClubs);
        this.pList.notifyUpdate();
        if ( selectedClubID == -1 && this.vClubs.length > 0 )
        {
            selectedClubID = this.vClubs[0].id ;
        }
        cc.Component.EventHandler.emitEvents(this.vSelClubItemCallBack, this.vClubs.length == 0 ? -1 : selectedClubID ) ;
    }

    onClubListItemSel( toggle : cc.Toggle, clubID : number  )
    {
        let selClubID = clubID  ;
        cc.Component.EventHandler.emitEvents(this.vSelClubItemCallBack,selClubID) ;

        for ( let v of this.vClubs )
        {
            v.isSelected = v.id == clubID ;
        }
        this.pList.notifyUpdate();
        Utility.audioBtnClick();
    }

    onClickAddClub()
    {
        // show dlg ;
        this.pOptsJoinOrCreate.showDlg();
        Utility.audioBtnClick();
    }

    onShowJoinClubDlg( btn : cc.Button )
    {
        this.pDlgJoinClub.closeDlg();
        this.pDlgJoinClub.setDlgTitle(false); // must invoke ,before show ;
        this.pDlgJoinClub.showDlg( this.onJoinClubDlgResult.bind(this));
    }

    protected onJoinClubDlgResult( nJoinRoomID : string )
    {
        console.log( "onJoinClubDlgResult " + nJoinRoomID );
        let applyClubID : number = parseInt(nJoinRoomID);
        let msg = { } ;
        msg["clubID"] = applyClubID;
        let self = this ;
        let selfUID = ClientApp.getInstance().getClientPlayerData().getSelfUID();
        Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_APPLY_JOIN,eMsgPort.ID_MSG_PORT_CLUB,selfUID,( msg : Object)=>
        {
            let ret = msg["ret"] ;
            let vError = [ "加入申请已经提交，请耐心等待管理员审批","您已经在该俱乐部里","您已经申请了，请勿重复申请，耐心等待管理员审批","俱乐部成员数量已达上限","玩家对象为空"] ;
            if ( vError.length <= ret )
            {
                Utility.showTip("unknown error code = " + ret ) ;
                self.pDlgJoinClub.closeDlg();
                return true ;
            }
            Utility.showTip( vError[ret] );
            return true ;
        } );
    }

    showCreateClubDlg()
    {
        this.pDlgJoinClub.closeDlg();
        this.pDlgCrateClubTip.showDlg(this.onClubTipResult.bind(this)) ;
    }

    onClubNameUpdated( id : number , NewName : string )
    {
        for ( let v of this.vClubs )
        {
            if ( v.id == id )
            {
                v.name = NewName ;
                break ;
            }
        }

        this.pList.notifyUpdate();
        console.log( "onClubNameUpdated" );
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

    protected onCreateRoomDlgResult( msgCreateRoom : IOpts )
    {
         let self = this ;
         let msg = { } ;
         msg["name"] = this.strCreateRoomName ;
         msg["opts"] = msgCreateRoom.jsOpts ;
         let selfUID = ClientApp.getInstance().getClientPlayerData().getSelfUID() ;
         Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_CREATE_CLUB,eMsgPort.ID_MSG_PORT_CLUB,selfUID ,( msg : Object )=>{
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
                self.pDlgCreateRoom.closeDlg();
            }
            else
            {
                if ( vError.length > ret )
                {
                    Utility.showTip(vError[ret]);
                }
                else
                {
                    Utility.showTip("error code = " + ret );
                }
            }
            return true ;
         }) ;
    }
    // update (dt) {}
}

class listClubAdpter extends AbsAdapter
{
    lpCallBack : ( toggle : cc.Toggle, clubID : number )=>void = null ;
    updateView( item: cc.Node, posIndex: number )
    {
        let comp = item.getComponent(ClubListItem);
        if (comp) {
            let pInfo = this.getItem(posIndex) ;
            comp.refresh(pInfo.id,pInfo.name) ;
            comp.lpCallBack = this.lpCallBack ;
        }

        let comp2 = item.getComponent(cc.Toggle);
        if ( comp2 )
        {
            let pInfo = this.getItem(posIndex) ;
            comp2.isChecked = pInfo.isSelected ;
        }
    }
}
