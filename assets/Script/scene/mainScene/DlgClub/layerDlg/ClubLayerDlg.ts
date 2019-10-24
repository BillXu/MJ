import IClubLayerDlg from "../IClubLayerDlg";
import DlgBase from "../../../../common/DlgBase";
import IOpts from "../../../../opts/IOpts";
import { eClubSettingBtn } from "./DlgSetting/dlgClubSetting";
import IClubLayerDlgData from "./IClubLayerDlgData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClubLayerDlg extends cc.Component implements IClubLayerDlg {

    @property(DlgBase)
    mDlgJoinOrCreate : DlgBase = null 

    @property(DlgBase)
    mDlgJoin : DlgBase = null ;

    @property(DlgBase)
    mDlgCreateClubTip : DlgBase = null ;

    @property(DlgBase) 
    mDlgCreateClubVerify : DlgBase = null ;

    @property(DlgBase)
    mDlgCreateOpts : DlgBase = null ;

    @property(DlgBase)
    mDlgSetting : DlgBase = null ;

    @property(DlgBase)
    mDlgModifyNotice : DlgBase = null ;

    @property(DlgBase)
    mDlgMessage : DlgBase = null ;

    @property(DlgBase)
    mDlgControlCenter : DlgBase = null ;

    @property(cc.Node)
    mBtnSetting : cc.Node = null ;

    @property(cc.Node)
    mBtnShare : cc.Node = null ;

    @property(cc.Node)
    mNewMessageIcon : cc.Node = null ; // red dot ;

    mData : IClubLayerDlgData = null ;
    mJsCreateClubMsg : Object = {} ;

    onChangedClub( data : IClubLayerDlgData ) : void 
    {
        this.mData = data;
        this.refresh();
    }

    onBtnAddClub()
    {
        this.mDlgJoinOrCreate.showDlg(this.onDlgJoinOrCreate.bind(this)) ;
    }

    onBtnSetting()
    {
        let o = {} ;
        o["isOwner"] = this.mData.isSelfClubOwner();
        o["haveNewMessage"] = this.mData.isHaveNewMessage();
        this.mDlgSetting.showDlg( this.onDlgSetting.bind(this), o ) ;
        this.mNewMessageIcon.active = false ; // when open dlg ,just clear the new message red dot ;
    }

    onBtnShare()
    {
        cc.log( "share" );
    }

    protected refresh()
    {
        this.mBtnShare.active = this.mData.isCurrentHaveClub();
        this.mBtnSetting.active = this.mData.isCurrentHaveClub() && ( this.mData.isSelfClubMgr() || this.mData.isSelfClubOwner() );
        this.mNewMessageIcon.active = this.mData.isHaveNewMessage();

        if ( this.mDlgControlCenter.isShow() )
        {
            this.mData.isCurrentHaveClub() ? this.mDlgControlCenter.showDlg( null , this.mData.getClubControlCenterData() ) : this.mDlgControlCenter.closeDlg();
        }

        if ( this.mDlgMessage.isShow() )
        {
            this.mData.isCurrentHaveClub() ? this.mDlgMessage.showDlg(null,this.mData.getClubMessageData()) : this.mDlgMessage.closeDlg();
        }
    }

    // dlg callback 
    onDlgJoinOrCreate( idx : number )
    {
        let self = this ;
        if ( idx == 0 ) 
        {
            this.mDlgJoin.showDlg( ( nJoinRoomID : string )=>{ this.mData.reqJoinClub( parseInt( nJoinRoomID ) ); } ) ;
        }
        else
        {
            this.mDlgCreateClubTip.showDlg( ()=>{
                self.mDlgCreateClubVerify.showDlg( self.onDlgCreateClubVerfify.bind(self)) ;
            } );
        }
    }

    onDlgCreateClubVerfify( clubName : string )
    {
        this.mDlgCreateOpts.showDlg( this.onDlgCreateClubOpts.bind(this));
        this.mJsCreateClubMsg["name"] = clubName ;
    }

    onDlgCreateClubOpts( msgCreateRoom : IOpts )
    {
        this.mJsCreateClubMsg["opts"] = msgCreateRoom.jsOpts;
        this.mData.reqCreateClub(this.mJsCreateClubMsg);
    }

    onDlgSetting( idx : number )
    {
        switch ( idx )
        {
            case eClubSettingBtn.Btn_ClubMessage:
            {
                this.mDlgMessage.showDlg(null,this.mData.getClubMessageData());
            }
            break ;
            case eClubSettingBtn.Btn_ControlCenter:
            {
                this.mDlgControlCenter.showDlg( null , this.mData.getClubControlCenterData() );
            }
            break;
            case eClubSettingBtn.Btn_Leave:
            {
                this.mData.reqLeaveCurClub();
            }
            break;
            case eClubSettingBtn.Btn_Notice:
            {
                let o = {} ;
                o["name"] = this.mData.getClubName() ;
                o["notice"] = this.mData.getClubNotice();
                let self = this ;
                this.mDlgModifyNotice.showDlg( ( newNotice : string )=>{ self.mData.reqUpdateNotice(newNotice) ; },o ) ;
            }
            break ;
        }
    }
}
