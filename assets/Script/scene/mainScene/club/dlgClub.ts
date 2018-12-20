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
import DlgBase from "../../../common/DlgBase"
import { clientDefine ,clientEvent} from "../../../common/clientDefine"
import { eMsgPort , eMsgType } from "../../../common/MessageIdentifer"
import ClubData from "./clubData";
import ClubList from "./clubList";
import ClubPannel from "./clubPannel";
import LedLabel from "../../../commonItem/ledLabel";
import DlgClubSetting from "./dlgClubSetting";
import dlgClubMessage from "./dlgClubMessage";
import DlgControlCenter from "./dlgControlCenter";
import DlgModifyNotice from "./dlgModifyNotice";
import PlayerBrifdata from "../record/playerBrifedata"
import ClientData from "../../../globalModule/ClientData";
import { eClubSettingBtn } from "./dlgClubSetting"
import Network from "../../../common/Network";
import Utility from "../../../globalModule/Utility";
@ccclass
export default class DlgClub extends DlgBase {

    private vClubDatas : ClubData[] = [] ;
    private nCurSelClubIdx : number = -1 ;
    private nSelfUID : number = ClientData.getInstance().selfUID;

    @property(PlayerBrifdata)
    pPlayerDatas : PlayerBrifdata = null ;

    @property(ClubList)
    pLeftClubList : ClubList = null;

    @property([ClubPannel])
    vClubInfoPannels : ClubPannel[] = [] ;
    private nCurPannelIdx : number = 0 ;

    @property(LedLabel)
    pNoticeLabel : LedLabel = null ;

    // dlg 
    @property(DlgClubSetting)
    pDlgSetting : DlgClubSetting = null ;

    @property(dlgClubMessage)
    pDlgMessage : dlgClubMessage = null ;

    @property(DlgControlCenter)
    pDlgControlCenter : DlgControlCenter = null ;

    @property(DlgModifyNotice)
    pDlgNotice : DlgModifyNotice = null ;

    @property(cc.Node)
    pSettingBtnRedDot : cc.Node = null ;
    @property(cc.Node)
    pMessageBtnRedDot : cc.Node = null ;

    // LIFE-CYCLE CALLBACKS:
    onRecievedBrifdata( event : cc.Event.EventCustom )
    {
        for ( let v of this.vClubDatas )
        {
            v.onRecivedPlayerBrifData(event.detail);
        }
    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose);
        let vClubIDs : number[] = ClientData.getInstance().getJoinedClubsID();
        let vClubDatas : ClubData[] = [] ;
        for ( let v of vClubIDs )
        {
            let pClubData : ClubData = null ;
            for ( let vData of this.vClubDatas )
            {
                if ( vData.clubID == v && vData.isRecievdInfo() )
                {
                    pClubData = vData ;
                    break ;
                }
            }

            if ( pClubData == null )
            {
                let p = new ClubData();
                p.init(v,this.pPlayerDatas);
                vClubDatas.push(p);
            }
            else
            {
                vClubDatas.push(pClubData);
            }
        }

        this.vClubDatas.length = 0 ;
        this.vClubDatas = vClubDatas ;

        if ( this.vClubDatas.length > 0 && this.isAllClubRecievd() )
        {
            let selectClubID = this.pLeftClubList.getSelectedClubID();
            let seleIdx = -1 ;
            if ( -1 != selectClubID )
            {
                for ( let idx in this.vClubDatas )
                {
                    if ( selectClubID == this.vClubDatas[idx].clubID )
                    {
                        seleIdx = parseInt(idx);
                        break ;
                    }
                }
            }

            this.vClubDatas[ seleIdx != -1 ? seleIdx : 0 ].refreshInfo();
            this.pLeftClubList.refresh(this.vClubDatas);
            this.onChangeClubInfoTable(null,this.nCurPannelIdx.toString()) ;
        }

        cc.systemEvent.on(clientDefine.netEventMsg,this.onMsg,this) ;
        cc.systemEvent.on(clientEvent.event_recieved_brifData,this.onRecievedBrifdata,this);
        cc.systemEvent.on(clientEvent.event_leave_club,this.onEventLeaveClub,this);
        cc.systemEvent.on(clientEvent.event_joined_club,this.onEventJoinedClub,this);
        cc.systemEvent.on(clientEvent.event_recived_new_clubMessage,this.onEventNewClubMessage,this);
    }

    onEventNewClubMessage( event : cc.Event.EventCustom )
    {
        this.pSettingBtnRedDot.active = true ;
        this.pMessageBtnRedDot.active = true ;
    }

    onEventJoinedClub( event : cc.Event.EventCustom )
    {
        let clubID : number = event.detail ;
        let p = new ClubData();
        p.init(clubID,this.pPlayerDatas);
        this.vClubDatas.push(p);
    }

    onEventLeaveClub( event : cc.Event.EventCustom  )
    {
        let clubID : number = event.detail ;
        for ( let idx in this.vClubDatas )
        {
            if ( clubID == this.vClubDatas[idx].clubID )
            {
                this.vClubDatas.splice(parseInt(idx),1) ;
                
                this.pLeftClubList.refresh(this.vClubDatas);
                return ;
            }
        }

        console.error( "you are not in this club how to leave ? id = " + clubID );
        return ;
    }

    onMsg( event : cc.Event.EventCustom )
    {
        let nMsgID : eMsgType = event.detail[clientDefine.msgKey] ;
        let msg : Object = event.detail[clientDefine.msg] ;
        if ( this.nCurSelClubIdx != -1 )
        {
            this.vClubDatas[this.nCurSelClubIdx].onMsg(nMsgID,msg);
        }
        else
        {
            this.vClubDatas.forEach( ( cd : ClubData )=>{ cd.onMsg(nMsgID,msg);} );
        }

        if ( nMsgID == eMsgType.MSG_CLUB_REQ_INFO && this.isAllClubRecievd() )
        {
            this.pLeftClubList.refresh(this.vClubDatas) ; 
        }
    }

    protected isAllClubRecievd() : boolean 
    {
        for ( let v of this.vClubDatas )
        {
            if ( v.isRecievdInfo() == false )
            {
                return  false ;
            }
        }
        return true ;
    }

    onBtnShare()
    {

    }

    onBtnSetting()
    {
        if ( ! this.vClubDatas[this.nCurSelClubIdx] )
        {
            console.log( "current do not have club , do not show dlg" );
            return ;
        }
        this.pSettingBtnRedDot.active = false ;
        this.pDlgSetting.showDlg(this.onDlgSettingResultCallBack.bind(this),this.vClubDatas[this.nCurSelClubIdx]) ;
    }

    onDlgSettingResultCallBack( btn : eClubSettingBtn )
    {
        switch ( btn )
        {
            case eClubSettingBtn.Btn_ClubMessage:
            {
                this.pMessageBtnRedDot.active = false ;
                this.pDlgMessage.showDlg(null,this.vClubDatas[this.nCurSelClubIdx].pClubMessageData);
            }
            break ;
            case eClubSettingBtn.Btn_ControlCenter:
            {
                let self = this ;
                this.pDlgControlCenter.showDlg(( js : Object )=>{
                    if ( js["type"] == "updateName" )
                    {
                        self.pLeftClubList.onClubNameUpdated(self.vClubDatas[self.nCurSelClubIdx].clubID,self.vClubDatas[self.nCurSelClubIdx].name);
                    } 
                    else if ( js["type"] == "dissmiss" )
                    {
                        console.log( "control center dlg result callback invoke only dissmessage club" );
                        self.onDoLevedCurClub();
                    }
                    else
                    {
                        console.error( "unkown call back type = " + js );
                    }
                } , this.vClubDatas[this.nCurSelClubIdx] ) ;
            }
            break;
            case eClubSettingBtn.Btn_Leave:
            {
                let self = this ;
                let msg = {} ;
                msg["clubID"] = this.vClubDatas[this.nCurSelClubIdx].clubID;
                Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_PLAYER_LEAVE,eMsgPort.ID_MSG_PORT_CLUB,this.nSelfUID,( js : Object )=>{
                    let ret = js["ret"] ;
                    let vError = [ "成功退出俱乐部","您本来就不在俱乐部里" ,"code 2 "," code 3","无效玩家对象"] ;
                    if ( ret < vError.length )
                    {
                        Utility.showPromptText(vError[ret]);
                        if ( 0 == ret )
                        {
                            self.onDoLevedCurClub();
                        }
                    }
                    else
                    {
                        Utility.showTip( "unknown error code = " + ret );
                    }
                    return true ;
                }) ;
            }
            break ;
            case eClubSettingBtn.Btn_Notice:
            {
                let self = this ;
                this.pDlgNotice.showDlg( ( notice : string )=>{ 
            
                    let msg = {} ;
                    msg["clubID"] = self.vClubDatas[self.nCurSelClubIdx].clubID ;
                    msg["notice"] = notice ;
                    let selfID = ClientData.getInstance().selfUID ;
                    Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_UPDATE_NOTICE,eMsgPort.ID_MSG_PORT_CLUB,selfID,( js : Object )=>{
                        let ret : number = js["ret"] ;
                        if ( ret == 0 )
                        {
                            self.vClubDatas[self.nCurSelClubIdx].notice = notice ;
                            self.pNoticeLabel.string = notice ;
                            self.pDlgNotice.closeDlg();
                        }

                        let verror = ["操作成功","权限不足"] ;
                        if ( ret < verror.length )
                        {
                            Utility.showPromptText(verror[ret]);
                        }
                        else
                        {
                            Utility.showPromptText( "error code = " + ret );
                        }
                        return true ;
                    } );
                },{ name : this.vClubDatas[this.nCurSelClubIdx].name,notice : this.vClubDatas[this.nCurSelClubIdx].notice });
            }
            break ;
            default:
            console.log( "unknow setting btn type" );
        }
    }

    onSelectClubItem( nClubID : number )
    {
        if ( this.nCurSelClubIdx != -1 &&  this.vClubDatas[this.nCurSelClubIdx] && this.vClubDatas[this.nCurSelClubIdx].clubID == nClubID )
        {
            this.vClubDatas[this.nCurSelClubIdx].onFocus();
            console.log( "select the same club id" );
            return ;
        }

        if ( this.nCurSelClubIdx != -1 && this.vClubDatas[this.nCurSelClubIdx] )
        {
            this.vClubDatas[this.nCurSelClubIdx].onLoseFocus();
        }

        this.nCurSelClubIdx = -1 ;
        for ( let idx in this.vClubDatas )
        {
            if ( this.vClubDatas[idx].clubID == nClubID )
            {
                this.nCurSelClubIdx = parseInt(idx) ;
                console.log( "change clubID = " + nClubID + " idx = " + idx );
                break ;
            }
        }

        if ( this.nCurSelClubIdx != -1 )
        {
            this.vClubDatas[this.nCurSelClubIdx].onFocus();
        }
        
        this.vClubInfoPannels[this.nCurPannelIdx].show(this.vClubDatas[this.nCurSelClubIdx]) ;
        if ( -1 == this.nCurSelClubIdx )
        {
            this.pNoticeLabel.string = "" ;
            console.log( "no club is current selected = " + nClubID );
            this.vClubInfoPannels[this.nCurPannelIdx].hide();
        }
        else
        {
            this.pNoticeLabel.string = this.vClubDatas[this.nCurSelClubIdx].notice ;
        }
        
    }

    onCreateNewClub( nClubID : number )
    {
        let p = new ClubData();
        p.init(nClubID,this.pPlayerDatas);
        this.vClubDatas.push(p);
        ClientData.getInstance().onJoinedNewClubID(nClubID);
    }

    onChangeClubInfoTable( event : cc.Event.EventTouch, nTablIdx : string )
    {
        if ( this.nCurPannelIdx >= 0 )
        {
            this.vClubInfoPannels[this.nCurPannelIdx].hide();
        }
        this.nCurPannelIdx = parseInt(nTablIdx);
        this.vClubInfoPannels[this.nCurPannelIdx].show(this.vClubDatas[this.nCurSelClubIdx]) ;
    }

    protected onDoLevedCurClub()
    {
        ClientData.getInstance().onDoLevedClub(this.vClubDatas[this.nCurSelClubIdx].clubID );
        this.vClubDatas.splice(this.nCurSelClubIdx,1) ;
        this.pLeftClubList.refresh(this.vClubDatas);
    }

    closeDlg()
    {
        super.closeDlg();
        if ( this.nCurSelClubIdx != -1 && this.vClubDatas[this.nCurSelClubIdx] )
        {
            this.vClubDatas[this.nCurSelClubIdx].onLoseFocus();
        }
    }
    // update (dt) {}
}
