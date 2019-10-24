import ListView, { AbsAdapter } from "../../../../commonItem/ListView";
import IClubPannelMember from "./IClubPannelMember";
import IClubMemberData, { IClubMemberDataItem } from "./IClubMemberData";
import MemberItem from "./memberItem";
import { clubMemAct, eClubPrivilige } from "../../../../clientData/clubData/ClubDefine";
import ClubMemberData from "./ClubMemberData";
import IDlgClubData from "../IDlgClubData";

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
export default class ClubPannelMember extends cc.Component implements IClubPannelMember {

    @property(ListView)
    mList : ListView = null ;

    mListAdapter : listMemViewAdpter = null ;

    mData : IClubMemberData = null ;
    mIsDirty : boolean = false ;
    // onLoad () {}

    start () {
       // this.refresh( new ClubMemberData() );
    }

    onChangedClub( data : IDlgClubData )
    {
        this.mData = data == null ? null : data.getClubMemberData();
        this.mIsDirty = true ;
    }

    onShowPannel() : void 
    {
        if ( this.mIsDirty )
        {
            this.mData != null ? this.refresh( this.mData ) : this.clear();
            this.mIsDirty = false ;
        }
        
    }

    onHidePannel() : void 
    {

    }

    protected refresh( data : IClubMemberData )
    {
        this.mData = data ;
        if ( null == this.mListAdapter )
        {
            this.mListAdapter = new listMemViewAdpter();
            this.mListAdapter.lpfCallBack = this.onClickMemberCallBack.bind(this);
            this.mList.setAdapter( this.mListAdapter ) ;
        }
        this.mListAdapter.setDataSet(data.getMembers());
        this.mList.notifyUpdate();
    }

    protected clear()
    {
        this.mData = null ;
        if ( this.mListAdapter )
        {
            this.mListAdapter.setDataSet([]);
            this.mList.notifyUpdate();
        }
    }

    addMember( mem : IClubMemberDataItem ) : void 
    {
        this.mListAdapter.pushItem(mem) ;
        this.mList.notifyUpdate(false) ;
    }

    deleteMember( uid : number ) : void 
    {
        for ( let idx = 0 ; idx < this.mListAdapter.getCount(); ++idx )
        {
            let p : IClubMemberDataItem = this.mListAdapter.getItem(idx) ;
            if ( p.uid == uid )
            {
                this.mListAdapter.deleteItem(idx) ;
                this.mList.notifyUpdate(false);
                break ;
            }
        }
    }

    updateMember( mem : IClubMemberDataItem ) : void 
    {
        for ( let idx = 0 ; idx < this.mListAdapter.getCount(); ++idx )
        {
            let p : IClubMemberDataItem = this.mListAdapter.getItem(idx) ;
            if ( p.uid == mem.uid )
            {
                this.mListAdapter.updateItem(idx,mem) ;
                this.mList.notifyUpdate(false);
                break ;
            }
        }
    }

    onClickMemberCallBack( mem : IClubMemberDataItem, opt : clubMemAct )
    {
        if ( clubMemAct.eAct_Kick_Out == opt )
        {
            this.mData.reqKickMember(mem.uid) ;
            return ;
        }
        this.mData.reqSetMemberPriviliage(mem.uid,opt == clubMemAct.eAct_Down_Privilige ? eClubPrivilige.eClubPrivilige_Normal : eClubPrivilige.eClubPrivilige_Manager ) ;
    }
    // update (dt) {}
}

class listMemViewAdpter extends AbsAdapter
{
    lpfCallBack : ( mem : IClubMemberDataItem, opt : clubMemAct  )=>void = null ; 

    updateView( item: cc.Node, posIndex: number )
    {
        let comp = item.getComponent(MemberItem);
        if (comp) {
            let pMemInfo : IClubMemberDataItem = this.getItem(posIndex) ;
            comp.refresh(pMemInfo) ;
            comp.lpfCallBack = this.lpfCallBack ;
        }
    }
}
