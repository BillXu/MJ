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
import { eMsgPort , eMsgType } from "../../../common/MessageIdentifer"
import ClubList from "./clubList";
import ClubPannel from "./clubPannel";
import LedLabel from "../../../commonItem/ledLabel";
import DlgClubSetting from "./dlgClubSetting";
import dlgClubMessage from "./dlgClubMessage";
import DlgControlCenter from "./dlgControlCenter";
import DlgModifyNotice from "./dlgModifyNotice";
import { eClubSettingBtn } from "./dlgClubSetting"
import Network from "../../../common/Network";
import Utility from "../../../globalModule/Utility";
import WechatManager, { eWechatShareDestType } from "../../../sdk/WechatManager";
import ClientPlayerClubs, { PlayerClubsDelegate } from "../../../clientData/ClientPlayerClubs";
import ClientApp from "../../../globalModule/ClientApp";
import IClubDataComponent from "../../../clientData/clubData/IClubDataComponent";
import ClubData from "../../../clientData/clubData/ClubData";
import { eClubDataComponent } from "../../../clientData/clubData/ClubDefine";
@ccclass
export default class DlgClub extends DlgBase implements PlayerClubsDelegate {

    private pClubDatas : ClientPlayerClubs = null ;
    private pCurrentClub : ClubData = null ;

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

    @property(cc.Node)
    pPublicBtns : cc.Node = null ;

    // LIFE-CYCLE CALLBACKS:
 
    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose);
        this.pClubDatas = ClientApp.getInstance().getClientPlayerData().getClubs() ;
        this.pLeftClubList.refresh(this.pClubDatas.vClubs);
        this.pClubDatas.setDelegate(this) ;
    }

    // delegate function 
    onClubDataRefresh( club : ClubData, refreshedCompoent : IClubDataComponent ) : void 
    {
        let type = refreshedCompoent.getType();
        if ( eClubDataComponent.eClub_Events == type && this.pDlgMessage.node.active )
        {
            this.pDlgMessage.onDataUpdate(-1) ;
        }
        
        if ( type == eClubDataComponent.eClub_BaseData )
        {
            this.pLeftClubList.onClubNameUpdated(club.getClubID(),club.getClubBase().name);
        }

        if ( club.getClubID() == this.pCurrentClub.getClubID() )
        {
            if ( type == eClubDataComponent.eClub_BaseData )
            {
                this.pNoticeLabel.string = club.getClubBase().notice;
            }

            if ( type == this.nCurPannelIdx && this.vClubInfoPannels[type] )
            {
                this.vClubInfoPannels[type].refresh(refreshedCompoent);
            }
        }
    }

    onNewClub( club : ClubData ) : void 
    {
        this.pLeftClubList.refresh(this.pClubDatas.vClubs);
    }

    onLeaveClub( club : ClubData ) : void 
    {
        this.pLeftClubList.refresh(this.pClubDatas.vClubs);
    }

    onEventNewClubMessage( event : cc.Event.EventCustom )
    {
        this.pSettingBtnRedDot.active = true ;
        this.pMessageBtnRedDot.active = true ;
    }
 
    onBtnShare()
    {
        Utility.audioBtnClick();
        if ( null == this.pCurrentClub )
        {
            Utility.showPromptText( "当前无选中俱乐部" );
            return ;
        }

        let id = this.pCurrentClub.getClubID() ;
        let title = "诚邀加入俱乐部ID:"+ id ;
        let pApp = ClientApp.getInstance();
        let desc = pApp.getClientPlayerData().getBaseData().name + " 诚邀您加入俱乐部(ID:" + id +")大家庭，一起为麻将狂欢，请火速集结!";
        WechatManager.getInstance().shareLinkWechat(pApp.getConfigMgr().getClientConfig().APP_DOWNLOAD_URL,eWechatShareDestType.eDest_Firend,title,desc) ;
    }

    onBtnSetting()
    {
        Utility.audioBtnClick();
        if ( ! this.pCurrentClub )
        {
            console.log( "current do not have club , do not show dlg" );
            return ;
        }
        this.pSettingBtnRedDot.active = false ;
        this.pDlgSetting.showDlg(this.onDlgSettingResultCallBack.bind(this),this.pCurrentClub) ;
    }

    onDlgSettingResultCallBack( btn : eClubSettingBtn )
    {
        Utility.audioBtnClick();
        switch ( btn )
        {
            case eClubSettingBtn.Btn_ClubMessage:
            {
                this.pMessageBtnRedDot.active = false ;
                this.pDlgMessage.showDlg(null,this.pCurrentClub.getClubEvents());
            }
            break ;
            case eClubSettingBtn.Btn_ControlCenter:
            {
                this.pDlgControlCenter.showDlg(null , this.pCurrentClub ) ;
            }
            break;
            case eClubSettingBtn.Btn_Leave:
            {
                if ( this.pCurrentClub == null )
                {
                    Utility.showPromptText( "current do not have club" );
                    break ;
                }

                let self = this ;
                let msg = {} ;
                msg["clubID"] = this.pCurrentClub.getClubID();
                Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_PLAYER_LEAVE,eMsgPort.ID_MSG_PORT_CLUB,this.pCurrentClub.getClubID(),( js : Object )=>{
                    let ret = js["ret"] ;
                    let vError = [ "成功退出俱乐部","您本来就不在俱乐部里" ,"code 2 "," code 3","无效玩家对象"] ;
                    if ( ret < vError.length )
                    {
                        Utility.showPromptText(vError[ret]);
                        if ( 0 == ret )
                        {
                            self.pCurrentClub.doDeleteThisClub();
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
                    msg["clubID"] = self.pCurrentClub.getClubID();
                    msg["notice"] = notice ;
                    Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_UPDATE_NOTICE,eMsgPort.ID_MSG_PORT_CLUB,self.pCurrentClub.getClubID(),( js : Object )=>{
                        let ret : number = js["ret"] ;
                        if ( ret == 0 )
                        {
                            self.pCurrentClub.doChangeNotice(notice);
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
                },{ name : this.pCurrentClub.getClubBase().name,notice : this.pCurrentClub.getClubBase().notice });
            }
            break ;
            default:
            console.log( "unknow setting btn type" );
        }
    }

    onSelectClubItem( nClubID : number )
    {
        this.pCurrentClub = this.pClubDatas.getClubByID(nClubID);
        if ( this.pCurrentClub )
        {
            this.pCurrentClub.fetchData(this.nCurPannelIdx,false);
            this.pCurrentClub.fetchData(eClubDataComponent.eClub_BaseData,false);
        }
        else
        {
            this.vClubInfoPannels[this.nCurPannelIdx].refresh(null);
            this.pNoticeLabel.string = "" ;
        }
        Utility.audioBtnClick();
    }

    onChangeClubInfoTable( event : cc.Event.EventTouch, nTablIdx : string )
    {
        if ( this.nCurPannelIdx >= 0 )
        {
            this.vClubInfoPannels[this.nCurPannelIdx].hide();
        }

        this.nCurPannelIdx = parseInt(nTablIdx);
        if ( this.pCurrentClub )
        {
            this.pCurrentClub.fetchData(this.nCurPannelIdx,false);
        }
        this.vClubInfoPannels[this.nCurPannelIdx].show();
    }

    closeDlg()
    {
        super.closeDlg();
        this.pClubDatas.setDelegate(null);
    }
    // update (dt) {}
}
