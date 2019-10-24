import IClubList from "./clubList/IClubList";
import ClubListNew from "./clubList/ClubListNew";
import IClubPannelRoom from "./pannelRoom/IClubPannelRoom";
import ClubPannelRoom from "./pannelRoom/ClubPannelRoom";
import IClubPannelMember from "./pannelMember/IClubPannelMember";
import ClubPannelMember from "./pannelMember/ClubPannelMember";
import IClubPannelLog from "./pannelLog/IClubPannelLog";
import ClubPannelLog from "./pannelLog/ClubPannelLog";
import IClubPannelRecorder from "./pannelRecorder/IClubPannelRecorder";
import ClubPannelRecorder from "./pannelRecorder/ClubPannelRecorder";
import IDlgClubData from "./IDlgClubData";
import IClubPannelNew from "./IClubPannelNew";
import DlgBase from "../../../common/DlgBase";
import DlgClubData from "./DlgClubData";
import LedLabel from "../../../commonItem/ledLabel";
import IClubLayerDlg from "./IClubLayerDlg";
import ClubLayerDlg from "./layerDlg/ClubLayerDlg";
import ClientPlayerClubs, { PlayerClubsDelegate } from "../../../clientData/ClientPlayerClubs";
import ClubData from "../../../clientData/clubData/ClubData";
import IClubDataComponent from "../../../clientData/clubData/IClubDataComponent";
import ClientApp from "../../../globalModule/ClientApp";
import { eClubDataComponent } from "../../../clientData/clubData/ClubDefine";

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
export default class DlgClubNew extends DlgBase implements PlayerClubsDelegate {

    @property(LedLabel)
    pNoticeLabel : LedLabel = null ;

    @property(cc.Node)
    mClubListNode : cc.Node = null ;

    @property(cc.Node)
    mPanelRoomNode : cc.Node = null ;

    @property(cc.Node)
    mPannelMemberNode : cc.Node = null ;

    @property(cc.Node)
    mPannelRecorderNode : cc.Node = null ;

    @property(cc.Node)
    mPannelLogNode : cc.Node = null ;

    @property(cc.Node)
    mClubLayerDlgNode : cc.Node = null ;

    mData : IDlgClubData = null ;

    mCurShowPannel : IClubPannelNew = null ;
    mCurPannelType : eClubDataComponent = eClubDataComponent.eClub_Rooms ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    protected clubList() : IClubList
    {
        return this.mClubListNode.getComponent(ClubListNew);
    }

    protected pannelRoom() : IClubPannelRoom
    {
        return this.mPanelRoomNode.getComponent(ClubPannelRoom);
    }

    protected pannelMember() : IClubPannelMember
    {
        return this.mPannelMemberNode.getComponent( ClubPannelMember );
    }

    protected pannelLog() : IClubPannelLog
    {
        return this.mPannelLogNode.getComponent( ClubPannelLog );
    }

    protected pannelRecorder() : IClubPannelRecorder
    {
        return this.mPannelRecorderNode.getComponent( ClubPannelRecorder );
    }

    protected clubLayerDlg() : IClubLayerDlg
    {
        return this.mClubLayerDlgNode.getComponent( ClubLayerDlg );
    }

    onTogglePannel( toggle : cc.Toggle )
    {
        let node = toggle.node ;
        if ( this.mCurShowPannel != null )
        {
            this.mCurShowPannel.onHidePannel();
        }

        let type = eClubDataComponent.eClub_Max ;
        if ( this.mPanelRoomNode == node )
        {
            type = eClubDataComponent.eClub_Rooms ;
            this.mCurShowPannel = this.pannelRoom();
        }
        else if ( this.mPannelLogNode == node )
        {
            type = eClubDataComponent.eClub_Events ;
            this.mCurShowPannel = this.pannelLog() ;
        }
        else if ( this.mPannelMemberNode == node )
        {
            type = eClubDataComponent.eClub_Members ;
            this.mCurShowPannel = this.pannelMember();
        }
        else if ( this.mPannelRecorderNode == node )
        {
            type = eClubDataComponent.eClub_Recorders ;
            this.mCurShowPannel = this.pannelRecorder();
        }
        else
        {
            cc.error( "unknown node name = " + node.name );
            return ;
        }

        this.mCurPannelType = type ;
        this.mData.fetchData( type ,false) ;
        this.mCurShowPannel.onShowPannel();
    }

    protected onChangedClub( newClubID : number )
    {
        if ( this.mData != null )
        {
            this.mData.setCurrentClubID( newClubID );
        }

        let data = newClubID == 0 ? null : this.mData ;
        this.pannelRoom().onChangedClub(data);
        this.pannelRecorder().onChangedClub(data);
        this.pannelMember().onChangedClub(data);
        this.pannelLog().onChangedClub(data);
        if ( this.mCurShowPannel != null )
        {
            this.mData.fetchData( this.mCurPannelType ,false) ;
            this.mCurShowPannel.onShowPannel();
        }
        this.clubLayerDlg().onChangedClub( this.mData.getClubLayerDlgData() );

        this.pNoticeLabel.string = data == null ? "" : this.mData.getCurClubNotice();
    }   
    
    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        super.showDlg( pfResult, jsUserData,pfOnClose);
        let clubs = ClientApp.getInstance().getClientPlayerData().getClubs();
        clubs.setDelegate(this);
        this.mData = clubs;
        this.clubList().setCallBack(this.onChangedClub.bind(this));
        if ( this.mCurShowPannel == null )
        {
            this.mCurShowPannel = this.pannelRoom();
        }
        this.clubList().refresh(this.mData.getClubListData());
    }

    closeDlg()
    {
        super.closeDlg();
        ClientApp.getInstance().getClientPlayerData().getClubs().setDelegate( null );
    }
    // interface PlayerClubsDelegate
    onClubDataRefresh( club : ClubData, refreshedCompoent : IClubDataComponent ) : void 
    {
        switch (refreshedCompoent.getType())
        {
            case eClubDataComponent.eClub_BaseData:
            {
                this.clubList().refresh(this.mData.getClubListData());
                this.pNoticeLabel.string = this.mData.getCurClubNotice();
                this.clubLayerDlg().onChangedClub( this.mData.getClubLayerDlgData() );
            }
            break;
            case eClubDataComponent.eClub_Events:
            {
                this.clubLayerDlg().onChangedClub( this.mData.getClubLayerDlgData() );
                this.pannelLog().onChangedClub(this.mData);
            }
            break;
            case eClubDataComponent.eClub_Members:
            {
                this.pannelMember().onChangedClub(this.mData);
            }
            break;
            case eClubDataComponent.eClub_Recorders:
            {
                this.pannelRecorder().onChangedClub(this.mData);
            }
            break;
            case eClubDataComponent.eClub_Rooms:
            {
                this.pannelRoom().onChangedClub(this.mData);
            }
            break ;
        }
        this.mCurShowPannel.onShowPannel();
    }

    onNewClub( club : ClubData ) : void 
    {

    }

    onLeaveClub( club : ClubData ) : void 
    {
        this.clubList().refresh(this.mData.getClubListData());
    }
    // update (dt) {}
}
