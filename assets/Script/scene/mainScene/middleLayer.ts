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
@ccclass
export default class MiddleLayer extends cc.Component {

    @property(DlgCreateRoom)
    dlgCreateRoom: DlgCreateRoom = null;

    @property(DlgJoinRoomOrClub)
    dlgJoinRoom : DlgJoinRoomOrClub = null ;

    @property(Bacground)
    pBackground : Bacground = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onClickClubBtn( btn : cc.Button )
    {

    }

    onClickCreateRoom( btn : cc.Button )
    {
        this.pBackground.hide();
        let self = this ;
        this.dlgCreateRoom.showDlg( this.onCreateRoomDlgResult.bind(this) ,null,(dlg : DlgCreateRoom)=>{ self.pBackground.show();});
    }

    protected onCreateRoomDlgResult( msgCreateRoom : Object )
    {
        console.log( "onCreateRoomDlgResult" );
    }

    onClickJoinRoom( btn : cc.Button )
    {
        this.dlgJoinRoom.setDlgTitle(true); // must invoke ,before show ;
        this.dlgJoinRoom.showDlg( this.onJoinRoomDlgResult.bind(this));
    }

    protected onJoinRoomDlgResult( nJoinRoomID : string )
    {
        console.log( "onJoinRoomDlgResult " + nJoinRoomID );
    }

    onClickCompetition( btn : cc.Button )
    {

    }
    // update (dt) {}
}
