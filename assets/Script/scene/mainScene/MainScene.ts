import IModule from "../../common/IModule";
import Utility from "../../globalModule/Utility";
import DlgJoinRoomOrClub from "./dlgJoinRoomOrClub";
import LayerBackground from "./LayerBackground";
import ClientApp from "../../globalModule/ClientApp";
import { eMsgType, eMsgPort } from "../../common/MessageIdentifer";
import { SceneName } from "../../common/clientDefine";
import DlgSetting from "./dlgSetting";
import dlgRecord from "./record/dlgRecord";
import DlgBase from "../../common/DlgBase";
import DlgShop from "./shop/dlgShop";
import DlgShare from "./dlgShare";
import IOpts from "../../opts/IOpts";
import DlgCreateRoom from "./dlgCreateRoom/DlgCreateRoom";

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

@ccclass
export default class MainScene extends IModule {

    @property(DlgCreateRoom)    
    dlgCreateRoom: DlgCreateRoom = null;

    @property(DlgJoinRoomOrClub)
    dlgJoinRoom : DlgJoinRoomOrClub = null ;

    @property(LayerBackground)
    pBackground : LayerBackground = null ;

    @property(DlgBase)
    pDlgClub : DlgBase = null ;

    @property(DlgBase)
    pDlgSetting: DlgBase = null;

    @property(dlgRecord)
    pDlgRecord : dlgRecord = null ;

    @property(DlgBase)
    pDlgHelp : DlgBase = null ;

    @property(DlgShop)
    pDlgShop : DlgShop = null ;

    @property(DlgShare)
    pDlgShare : DlgShare = null ;

    start () {
        this.init();
    }

    onBtnCompetition()
    {
        Utility.showPromptText( "比赛暂未开放，敬请期待！" );
        Utility.audioBtnClick();
    }

    onBtnJoinRoom()
    {
        this.dlgJoinRoom.setDlgTitle(true); // must invoke ,before show ;
        this.dlgJoinRoom.showDlg( this.onJoinRoomDlgResult.bind(this));
        Utility.audioBtnClick();
    }

    protected onJoinRoomDlgResult( nJoinRoomID : string )
    {
        console.log( "onJoinRoomDlgResult " + nJoinRoomID );
        let baseData = ClientApp.getInstance().getClientPlayerData().getBaseData();
        let msg = { } ;
        msg["roomID"] = parseInt(nJoinRoomID);
        msg["uid"] = baseData.uid;
        let port = Utility.getMsgPortByRoomID(parseInt(nJoinRoomID)); 
        if ( eMsgPort.ID_MSG_PORT_ALL_SERVER <= port || port < eMsgPort.ID_MSG_PORT_LUOMJ  )
        {
            Utility.showTip( "房间不存在或已经解散 code" + 0 );
            return ;
        }

        let self = this ;
        this.sendMsg(msg,eMsgType.MSG_ENTER_ROOM,port,parseInt(nJoinRoomID),( msg : Object)=>
        {
            let ret = msg["ret"] ;
            if ( ret )
            {
                Utility.showTip( "房间不存在或已经解散 code" + ret );
                return true;
            }
            console.log( "set join room id = " + nJoinRoomID );
            self.dlgJoinRoom.closeDlg();
            ClientApp.getInstance().getClientPlayerData().getBaseData().stayInRoomID = parseInt(nJoinRoomID) ;
            cc.director.loadScene(SceneName.Scene_Room ) ;
            return true ;
        } );
    }

    onBtnCreateRoom()
    {
        this.pBackground.hide();
        let self = this ;
        this.dlgCreateRoom.showDlg( this.onDlgCreateRoomResult.bind(this) ,null,(dlg : DlgCreateRoom)=>{ self.pBackground.show();});
        Utility.audioBtnClick();
    }

    onDlgCreateRoomResult( opts : IOpts )
    {
        let baseData = ClientApp.getInstance().getClientPlayerData().getBaseData();
        let msgCreateRoom = opts.jsOpts ;
        msgCreateRoom["uid"] = baseData.uid;
        //msgCreateRoom["gameType"] = opts.gameType ;
        //msgCreateRoom["opts"] = opts.toString() ;
        console.log( "onCreateRoomDlgResult" );
        let port = Utility.getMsgPortByGameType(opts.gameType);
        let self = this ;
        this.sendMsg(msgCreateRoom,eMsgType.MSG_CREATE_ROOM,port,msgCreateRoom["uid"],( msg : Object)=>{
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
        Utility.audioBtnClick();
    }

    onBtnClub()
    {
        this.pBackground.hide();
        let self = this ;
        this.pDlgClub.showDlg( null ,null,(dlg : DlgBase)=>{ self.pBackground.show();});
        Utility.audioBtnClick();
    }

    onBtnSetting()
    {
        this.pDlgSetting.showDlg();
        Utility.audioBtnClick();
    }

    onBtnShop()
    {
        let baseData = ClientApp.getInstance().getClientPlayerData().getBaseData();
        this.pDlgShop.showDlg( ( shopItemID : number )=>{
            console.log( "send msg to buy shopitemID " + shopItemID );
        } ,baseData.diamond ) ;
        Utility.audioBtnClick();
    }

    onBtnShowRecord()
    {
        this.pBackground.hide();
        let self = this ;
        let recorderData = ClientApp.getInstance().getClientPlayerData().getRecorder();
        this.pDlgRecord.showDlg( null ,recorderData,(dlg : DlgBase)=>{ self.pBackground.show();});
        Utility.audioBtnClick();
    }

    onBtnHelp()
    {
        this.pDlgHelp.showDlg();
        Utility.audioBtnClick();
    }

    onBtnShare()
    {
        this.pDlgShare.showDlg();
        Utility.audioBtnClick();
    }

    onBtnActivty()
    {
        Utility.audioBtnClick();
        Utility.showPromptText("暂无活动,敬请关注") ;
    }

    // update (dt) {}
}
