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
import IClubControlCenterData from "./IClubControlCenterData";
import IRulePannel from "./IRulePanel";
import DlgBase from "../../../../../common/DlgBase";
import IOpts from "../../../../../opts/IOpts";
import Utility from "../../../../../globalModule/Utility";
import DlgCreateRoom from "../../../dlgCreateRoom/DlgCreateRoom";
import RulePannelSuZhou from "./rulePannel/RulePannelSuZhou";
@ccclass
export default class DlgControlCenter extends DlgBase {

    @property(cc.Label)
    pCurName: cc.Label = null;

    @property(cc.EditBox)
    pNewName : cc.EditBox = null ;

    @property(cc.Label)
    pClubState : cc.Label = null ;
    
    @property(cc.Node)
    pBtnModifyRule : cc.Node = null ;

    @property(cc.Node)
    pBtnStop : cc.Node = null ;

    @property(cc.Node)
    pBtnOpen : cc.Node = null ;

    @property(DlgCreateRoom)
    pDlgCreateOpts : DlgCreateRoom = null ;

    @property([cc.Toggle])
    pMgrTab : cc.Toggle[] = [] ;
    @property(cc.Toggle)
    pDismissTab : cc.Toggle = null ;
    @property(cc.Toggle)
    pRuleToggle : cc.Toggle = null ;

    @property(cc.Node)
    mRulePanelNode : cc.Node = null ;

    // LIFE-CYCLE CALLBACKS:

    pClubData : IClubControlCenterData = null ;

    // onLoad () {}

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose) ;
        this.refresh(jsUserData);
    }

    protected getRulePanel() : IRulePannel
    {
        return this.mRulePanelNode.getComponent(RulePannelSuZhou) ;
    }

    protected refresh( pdata : IClubControlCenterData )
    {
        let isSelfOwner = pdata.isSelfClubOwner();
        this.pRuleToggle.check();
        this.pDismissTab.node.active = isSelfOwner;
        
        this.pClubData = pdata ;
        this.pCurName.string = pdata.getClubName();
        this.pNewName.string = "" ;
        
        this.pClubState.string = pdata.isClubPaused() ? "俱乐部已经打烊，是否需要营业？" : "俱乐部正在营业，是否要打烊？" ;
        this.pBtnOpen.active = pdata.isClubPaused();
        this.pBtnStop.active = !this.pBtnOpen.active ;
        // wan fa ;
        this.getRulePanel().refresh(pdata.getClubOpts()) ;
    }

    onChangeRule()
    {
        let self = this ; 
        this.pDlgCreateOpts.showDlg( ( msgCreateRoom : IOpts )=>{ 
            self.pClubData.reqUpdateClubOpts( msgCreateRoom.jsOpts ) ; 
            self.getRulePanel().refresh(msgCreateRoom);
        } ) ;
        // let selfUID = ClientApp.getInstance().getClientPlayerData().getSelfUID();
        // this.pDlgCreateOpts.showDlg(( msgCreateRoom : IOpts )=>{
        //     let msg = {} ;
        //     msg["clubID"] = self.pClubData.getClubID() ;
        //     msg["opts"] = msgCreateRoom.jsOpts ;
        //     Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_SET_ROOM_OPTS,eMsgPort.ID_MSG_PORT_CLUB,selfUID,( js : Object )=>{
        //         let ret : number = js["ret"] ;
        //         let vError = [ "玩法更改成功" , "权限不足","code 2"," code 3","无效玩家对象"] ;
        //         if ( ret < vError.length )
        //         {
        //             Utility.showPromptText(vError[ret]) ;
        //             if ( 0 == ret )
        //             {
        //                 self.pClubData.getClubBase().clubOpts = msgCreateRoom.jsOpts ;
        //                 self.refresh(self.pClubData);
        //                 self.pDlgCreateOpts.closeDlg();
        //             }
        //         }
        //         else
        //         {
        //             Utility.showTip("unknown error code = " + ret ) ;
        //         }
        //         return true ;
        //     }) ;
        // });

        Utility.audioBtnClick();
    }

    onChangeName()
    {
        if ( this.pNewName.string.length < 1 )
        {
            Utility.showPromptText( "名字不能为空" );
            return ;
        }

        if ( this.pNewName.string == this.pCurName.string )
        {
            Utility.showPromptText( "新名字与旧名字一样" );
            return ;
        }

        this.pClubData.reqChangeClubName( this.pNewName.string );
        this.pCurName.string = this.pNewName.string ;

        // let clubID = this.pClubData.getClubID();
        // let self = this ;
        // let msg = {} ;
        // msg["clubID"] = clubID ;
        // msg["name"] = this.pNewName.string ;
        // let selfUID = ClientApp.getInstance().getClientPlayerData().getSelfUID();
        // Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_UPDATE_NAME,eMsgPort.ID_MSG_PORT_CLUB,selfUID,( js : Object )=>{
        //     let ret : number = js["ret"] ;
        //     let vError = [ "改名字成功" , "权限不足","新名字与旧名字一样了","名字已经被其他俱乐部使用了","无效玩家对象"] ;
        //     if ( ret < vError.length )
        //     {
        //         Utility.showPromptText(vError[ret]) ;
        //         if ( 0 == ret )
        //         {
        //             self.pClubData.getClubBase().name = self.pNewName.string ;
        //             self.refresh(self.pClubData);
        //         }
        //     }
        //     else
        //     {
        //         Utility.showTip("unknown error code = " + ret ) ;
        //     }
        //     return true ;
        // }) ;

        Utility.audioBtnClick();
    }

    onSwitchStopOpen()
    {
        let state = !this.pClubData.isClubPaused();
        this.pClubData.reqSwitchClubState( state );

        this.pClubState.string = state ? "俱乐部已经打烊，是否需要营业？" : "俱乐部正在营业，是否要打烊？" ;
        this.pBtnOpen.active = state;
        this.pBtnStop.active = !state ;

        // let self = this ;
        // let msg = {} ;
        // msg["clubID"] = this.pClubData.getClubID() ;
        // msg["isPause"] = (!this.pClubData.getClubBase().isStoped) ? 1 : 0 ;
        // let selfUID = ClientApp.getInstance().getClientPlayerData().getSelfUID();
        // Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_SET_STATE,eMsgPort.ID_MSG_PORT_CLUB,selfUID,( js : Object )=>{
        //     let ret : number = js["ret"] ;
        //     let vError = [ "操作成功" , "权限不足"] ;
        //     if ( ret < vError.length )
        //     {
        //         Utility.showPromptText(vError[ret]) ;
        //         if ( 0 == ret )
        //         {
        //             self.pClubData.getClubBase().isStoped = !self.pClubData.getClubBase().isStoped ;
        //             self.refresh(self.pClubData);
        //         }
        //     }
        //     else
        //     {
        //         Utility.showTip("unknown error code = " + ret ) ;
        //     }
        //     return true ;
        // }) ;

        Utility.audioBtnClick();
    }

    onDissmiss()
    {
        this.pClubData.reqDismissClub();
        // let self = this ;
        // let msg = {} ;
        // msg["clubID"] = this.pClubData.getClubID() ;
        // let selfUID = ClientApp.getInstance().getClientPlayerData().getSelfUID();
        // Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_DISMISS_CLUB,eMsgPort.ID_MSG_PORT_CLUB,selfUID,( js : Object )=>{
        //     let ret : number = js["ret"] ;
        //     let vError = [ "操作成功" , "权限不足"," code 2 ","有房间牌局没结束，无法解散，请稍后再试","无效玩家"] ;
        //     if ( ret < vError.length )
        //     {
        //         Utility.showPromptText(vError[ret]) ;
        //         if ( 0 == ret )
        //         {
        //             self.pClubData.doDeleteThisClub();
        //             self.closeDlg();
        //         }
        //     }
        //     else
        //     {
        //         Utility.showTip("unknown error code = " + ret ) ;
        //     }
        //     return true ;
        // }) ;

        Utility.audioBtnClick();
    }    

    onChangeTab( event : cc.Toggle )
    {
        this.pMgrTab.forEach( ( p : cc.Toggle )=>{ p.node.zIndex = event == p ? 1 : 0 ; } );
        Utility.audioBtnClick();
    }
    // update (dt) {}
}
