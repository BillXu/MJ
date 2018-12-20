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
import DlgCreateRoom from "./dlgCreateRoom"
import DlgJoinRoomOrClub from "./dlgJoinRoomOrClub"
import Bacground from "./background"
import ClientData from "../../globalModule/ClientData";
import Network from "../../common/Network";
import { eMsgType, eMsgPort } from "../../common/MessageIdentifer";
import Utility from "../../globalModule/Utility";
import { SceneName } from "../../common/clientDefine"
import DlgClub from "./club/dlgClub";
@ccclass
export default class MiddleLayer extends cc.Component {

    @property(DlgCreateRoom)
    dlgCreateRoom: DlgCreateRoom = null;

    @property(DlgJoinRoomOrClub)
    dlgJoinRoom : DlgJoinRoomOrClub = null ;

    @property(Bacground)
    pBackground : Bacground = null ;

    @property(DlgClub)
    pDlgClub : DlgClub = null ;
    // LIFE-CYCLE CALLBACKS:

    start () {

    }

    onClickClubBtn( btn : cc.Button )
    {
        this.pBackground.hide();
        let self = this ;
        this.pDlgClub.showDlg( null ,null,(dlg : DlgCreateRoom)=>{ self.pBackground.show();});
    }

    onClickCreateRoom( btn : cc.Button )
    {
        this.pBackground.hide();
        let self = this ;
        this.dlgCreateRoom.showDlg( this.onCreateRoomDlgResult.bind(this) ,null,(dlg : DlgCreateRoom)=>{ self.pBackground.show();});
    }

    protected onCreateRoomDlgResult( msgCreateRoom : Object )
    {
        msgCreateRoom["uid"] = ClientData.getInstance().selfUID;
        console.log( "onCreateRoomDlgResult" );
        let port = ClientData.getInstance().getMsgPortByGameType(msgCreateRoom["gameType"]);
        let self = this ;
        Network.getInstance().sendMsg(msgCreateRoom,eMsgType.MSG_CREATE_ROOM,port,msgCreateRoom["uid"],( msg : Object)=>{
            let ret = msg["ret"] ;
            let roomID = msg["roomID"] ;
            if ( ret )
            {
                Utility.showTip("error code " + ret ) ;
                return true;
            }
            self.onJoinRoomDlgResult(roomID) ;
            return true ;
        });

    }

    onClickJoinRoom( btn : cc.Button )
    {
        this.dlgJoinRoom.setDlgTitle(true); // must invoke ,before show ;
        this.dlgJoinRoom.showDlg( this.onJoinRoomDlgResult.bind(this));
    }

    protected onJoinRoomDlgResult( nJoinRoomID : string )
    {
        console.log( "onJoinRoomDlgResult " + nJoinRoomID );
        let msg = { } ;
        msg["roomID"] = parseInt(nJoinRoomID);
        msg["uid"] = ClientData.getInstance().selfUID;
        let port = ClientData.getInstance().getMsgPortByRoomID(parseInt(nJoinRoomID));
        if ( eMsgPort.ID_MSG_PORT_ALL_SERVER <= port || port < eMsgPort.ID_MSG_PORT_LUOMJ  )
        {
            Utility.showTip( "房间不存在或已经解散 code" + 0 );
            return ;
        }

        let self = this ;
        Network.getInstance().sendMsg(msg,eMsgType.MSG_ENTER_ROOM,port,parseInt(nJoinRoomID),( msg : Object)=>
        {
            let ret = msg["ret"] ;
            if ( ret )
            {
                Utility.showTip( "房间不存在或已经解散 code" + ret );
                return true;
            }
            console.log( "set join room id = " + nJoinRoomID );
            self.dlgJoinRoom.closeDlg();
            ClientData.getInstance().stayInRoomID = parseInt(nJoinRoomID) ;
            cc.director.loadScene(SceneName.Scene_Room ) ;
            return true ;
        } );
    }

    onClickCompetition( btn : cc.Button )
    {

    }
    // update (dt) {}
}
