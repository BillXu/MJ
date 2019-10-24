import IClubList from "./IClubList";
import IClubListData, { IClubListDataItem } from "./IClubListData";
import ListView, { AbsAdapter } from "../../../../commonItem/ListView";
import ClubListItem from "./clubListItem";
import Utility from "../../../../globalModule/Utility";
import ClubListData from "./ClubListData";

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
export default class ClubListNew extends cc.Component implements IClubList {

    @property(ListView)
    mList: ListView = null;

    mListAdapter : listClubAdpter = null ;
    
    mCallBack : ( selectedClubID : number )=>void = null ;
    mData : IClubListData = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //this.refresh( new ClubListData() );  // test code ;
    }

    // update (dt) {}
    addClubItem( item : IClubListDataItem ) : void 
    {
        let haveSeletct = this.mListAdapter.getCount() > 0 ;
        item.isCurrentSelected = haveSeletct == false;
        this.mListAdapter.pushItem(item) ;
        this.mList.notifyUpdate(false);
        if ( this.mCallBack != null && haveSeletct == false )
        {
            this.mCallBack(item.clubID);
        }
    }

    deleteClubItem( clubID : number ) : void 
    {
        let cnt = this.mListAdapter.getCount();
        let isDeleteCurSelected = false ;
        for ( let idx = 0 ; idx < cnt ; ++idx )
        {
            let p = <IClubListDataItem>this.mListAdapter.getItem(idx) ;
            if ( p.clubID == clubID )
            {
                isDeleteCurSelected = p.isCurrentSelected ;
                this.mListAdapter.deleteItem(idx) ;
                break ;
            }
        }

        if ( isDeleteCurSelected && this.mListAdapter.getCount() > 0 )
        {
            let p = <IClubListDataItem>this.mListAdapter.getItem(0) ;
            p.isCurrentSelected = true ;
            if ( this.mCallBack != null )
            {
                this.mCallBack(p.clubID);
            }
        }

        if ( this.mListAdapter.getCount() == 0 )
        {
            if ( this.mCallBack != null )
            {
                this.mCallBack( 0 );
            }
        }

        this.mList.notifyUpdate(false);
    }

    refresh( data : IClubListData ) : void 
    {
        this.mData = data ;
        if ( this.mListAdapter == null )
        {
            this.mListAdapter = new listClubAdpter() ;
            this.mList.setAdapter(this.mListAdapter);
            this.mListAdapter.lpCallBack = this.onClubListItemSel.bind(this) ;
        }
        this.mListAdapter.setDataSet(this.mData.getClubLists()) ;
        
        let selectedID = 0 ;
        for ( let idx = 0 ; idx < this.mListAdapter.getCount() ; ++idx )
        {
            let p = <IClubListDataItem>this.mListAdapter.getItem(idx) ;
            if ( p.isCurrentSelected )
            {
                selectedID = p.clubID ;
                break ;
            }
        }

        if ( selectedID == 0 && this.mListAdapter.getCount() > 0 )
        {
            let p = <IClubListDataItem>this.mListAdapter.getItem(0) ;
            p.isCurrentSelected = true ;
            selectedID = p.clubID ;
        }

        if ( this.mCallBack != null )
        {
            this.mCallBack( selectedID );
        }

        this.mList.notifyUpdate();
    }

    setCallBack( pCallBack : ( selectedClubID : number )=>void ) : void
    {
        this.mCallBack = pCallBack ;
    }

    protected onClubListItemSel( toggle : cc.Toggle, clubID : number  )
    {
        let cnt = this.mListAdapter.getCount();
        let vi : number[] = []
        for ( let idx = 0 ; idx < cnt ; ++idx )
        {
            let p = <IClubListDataItem>this.mListAdapter.getItem(idx) ;
            let isSel = p.clubID == clubID ;
            if ( isSel != p.isCurrentSelected )
            {
                vi.push(idx);
            }
            p.isCurrentSelected = isSel;
        }

        if ( vi.length > 1 ) // clicked diffrent item ;
        {
            this.mList.notifyUpdate(false);

            if ( this.mCallBack != null )
            {
                this.mCallBack(clubID) ;
            }
        }
        
        Utility.audioBtnClick();
    }
}

class listClubAdpter extends AbsAdapter
{
    lpCallBack : ( toggle : cc.Toggle, clubID : number )=>void = null ;
    updateView( item: cc.Node, posIndex: number )
    {
        let comp = item.getComponent(ClubListItem);
        let pInfo = <IClubListDataItem>this.getItem(posIndex) ;
        if (comp) {
            comp.refresh(pInfo.clubID,pInfo.clubName) ;
            comp.lpCallBack = this.lpCallBack ;
        }

        let comp2 = item.getComponent(cc.Toggle);
        if ( comp2 )
        {
            let fun = comp.lpCallBack ;
            comp.lpCallBack = null ;
            comp2.isChecked = pInfo.isCurrentSelected ;
            comp.lpCallBack = fun ;
            cc.log( "pInfo is select " + pInfo.isCurrentSelected + " info id =  " + pInfo.clubID + " pos idx = " + posIndex );
        }
    }
}
