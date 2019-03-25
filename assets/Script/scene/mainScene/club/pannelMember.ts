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
import ClubPannel from "./clubPannel" ;
import MemberItem from "./memberItem"
import Network from "../../../common/Network";
import { eMsgPort, eMsgType } from "../../../common/MessageIdentifer";
import Utility from "../../../globalModule/Utility";
import ClubDataMembers, { ClubMember } from "../../../clientData/clubData/ClubDataMembers";
import IClubDataComponent from "../../../clientData/clubData/IClubDataComponent";
import { clubMemAct, eClubPrivilige } from "../../../clientData/clubData/ClubDefine";
@ccclass
export default class PannelMember extends ClubPannel {

    @property(listView)
    pMembersView: listView = null;

    pAdapter : listMemViewAdpter = null ;

    pData : ClubDataMembers = null ;
    // LIFE-CYCLE CALLBACKS:
    onLoad ()
    {

    }

    start () {

    }

    show()
    {
        super.show();
        if ( null == this.pAdapter )
        {
            this.pAdapter = new listMemViewAdpter();
            this.pAdapter.lpfCallBack = this.onClickMemActBtn.bind(this);
            this.pMembersView.setAdapter(this.pAdapter) ;
        }

        this.pAdapter.setDataSet([]);
        this.pMembersView.notifyUpdate();
        return ;
    }

    refresh( data : IClubDataComponent )
    {
        this.pData = <ClubDataMembers>data ;
        this.pAdapter.setDataSet(this.pData.vMembers) ;
        this.pMembersView.notifyUpdate();
    }

    onClickMemActBtn( mem : ClubMember, opt : clubMemAct )
    {
        let clubID = this.pData.clubID;
        let self = this ;
        if ( clubMemAct.eAct_Kick_Out == opt )
        {
            let msg = {} ;
            msg["clubID"] = clubID;
            msg["kickUID"] = mem.uid ; 
            Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_KICK_PLAYER,eMsgPort.ID_MSG_PORT_CLUB,clubID, ( js : Object )=>{
                let ret = js["ret"] ;
                if ( 0 == ret )
                {
                    self.pData.fetchData(true);
                    return ;
                }
    
                let verror = ["操作成功","该玩家不是俱乐部会员","权限不足","","错误玩家对象"] ;
                if ( ret < verror.length )
                {
                    Utility.showPromptText(verror[ret]);
                }
                else
                {
                    Utility.showPromptText( "error code " + ret );
                }
    
                return true ;
            }) ;
            return ;
        }

        let msg = {} ;
        msg["clubID"] = this.pData.clubID;
        msg["playerUID"] = mem.uid ;
        msg["privilige"] = opt == clubMemAct.eAct_Down_Privilige ? eClubPrivilige.eClubPrivilige_Normal : eClubPrivilige.eClubPrivilige_Manager ;
        Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_UPDATE_PRIVILIGE,eMsgPort.ID_MSG_PORT_CLUB,clubID, ( js : Object )=>{
            let ret = js["ret"] ;
            if ( 0 == ret )
            {
                self.pData.fetchData(true);
                return ;
            }

            let verror = ["操作成功","权限不足","管理员数量超过限制","该玩家不是俱乐部会员","错误玩家对象","权限相同"] ;
            if ( ret < verror.length )
            {
                Utility.showPromptText(verror[ret]);
            }
            else
            {
                Utility.showPromptText( "error code " + ret );
            }

            return true ;
        }) ;

        Utility.audioBtnClick();
    }

    onUpdateMember( idx : number ) 
    {
        if ( idx == -1 )
        {
            this.pMembersView.notifyUpdate();
            console.log( "onUpdateMember cnt = " + this.pData.vMembers.length );
            return ;
        }
        this.pMembersView.notifyUpdate();
        console.log( "onUpdateMember idx = " + idx );
    }
    // update (dt) {}
}

class listMemViewAdpter extends AbsAdapter
{
    lpfCallBack : ( mem : ClubMember, opt : clubMemAct  )=>void = null ; 

    updateView( item: cc.Node, posIndex: number )
    {
        let comp = item.getComponent(MemberItem);
        if (comp) {
            let pMemInfo : ClubMember = this.getItem(posIndex) ;
            comp.refresh(pMemInfo) ;
            comp.lpfCallBack = this.lpfCallBack ;
        }
    }
}

