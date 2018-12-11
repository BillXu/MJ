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
import ClubData from "./clubData" ;
import ClubPannel from "./clubPannel" ;
import { ClubMember } from "./clubMemberData"
import { clubMemAct } from "./clubDefine"
import MemberItem from "./memberItem"
@ccclass
export default class PannelMember extends ClubPannel {

    @property(listView)
    pMembersView: listView = null;

    pAdapter : listMemViewAdpter = null ;
    // LIFE-CYCLE CALLBACKS:
    onLoad ()
    {
        this.pAdapter = new listMemViewAdpter();
        this.pAdapter.lpfCallBack = this.onClickMemActBtn.bind(this);
        this.pMembersView.setAdapter(this.pAdapter) ;
    }

    start () {

    }

    show( data : ClubData )
    {
        super.show(data);
        data.pClubMemberData.lpfCallBack = this.onUpdateMember.bind(this);
        this.pAdapter.setDataSet(data.pClubMemberData.vMembers) ;
        this.pMembersView.notifyUpdate();
    }

    onClickMemActBtn( mem : ClubMember, opt : clubMemAct )
    {

    }

    onUpdateMember( idx : number ) 
    {
        if ( idx == -1 )
        {
            this.pMembersView.notifyUpdate();
            return ;
        }
        this.pMembersView.notifyUpdate([idx]);
    }
    // update (dt) {}
}

class listMemViewAdpter extends AbsAdapter
{
    lpfCallBack : ( mem : ClubMember, opt : clubMemAct  )=>void = null ; 
    isShowReplayBtn : boolean = false ;

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

