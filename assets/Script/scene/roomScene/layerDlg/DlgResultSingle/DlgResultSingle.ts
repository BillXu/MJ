import DlgResultSingleItem from "./DlgResultSingleItem";
import { ISingleResultDlgData } from "../ILayerDlgData";

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
export default class DlgResultSingle extends cc.Component {

    @property([ DlgResultSingleItem ])
    mItems : DlgResultSingleItem[] = [] ;

    @property(cc.Node)
    mLiuJuNode : cc.Node = null ;

    @property(cc.Node)
    mBtnNext : cc.Node = null ;

    @property(cc.Node)
    mBtnShowAll : cc.Node = null ;
    // LIFE-CYCLE CALLBACKS:
    onDlgResult : ( isShowAll : boolean ) =>void = null ; // ( isShowAll : bool )
    // onLoad () {}

    start () {

    }

    // update (dt) {}
    showDlg( data : ISingleResultDlgData , lpCallBack : ( isShowAll : boolean ) =>void )
    {
        this.onDlgResult = lpCallBack ;
        this.mItems.forEach( ( item : DlgResultSingleItem )=>{ item.node.active = false ;} );
        if ( data.isLiuJu() )
        {
            this.mLiuJuNode.active = true ;
            return ;
        }
        this.mLiuJuNode.active = false ;

        let selfIdx = data.getSelfIdx();
        selfIdx = selfIdx < 0 ? 0 : selfIdx ;
        let vResults = data.getResultItems();
        for ( let v of vResults )
        {
            if ( v.isEmpty() )
            {
                continue ;
            }

            let clientIdx = ( v.idx - selfIdx + this.mItems.length ) % this.mItems.length ;
            this.mItems[clientIdx].node.active = true ;
            this.mItems[clientIdx].setInfo(v) ;
        }

        this.setBtn(false);
        this.node.active = true ;
    }

    isDlgShowing()
    {
        return this.node.active ;
    }

    closeDlg()
    {
        this.node.active = false ;
    }

    onClickNext( event : cc.Event.EventTouch, isAll : string )
    {
        this.closeDlg();
        let isShowAll : boolean = parseInt( isAll ) == 1 ;
        if ( this.onDlgResult != null )
        {
            this.onDlgResult( isShowAll );
        }
        //cc.Component.EventHandler.emitEvents( this.onDlgResult,isShowAll  );
    }

    setBtn( isAll : boolean )
    {
        this.mBtnNext.active = !isAll ;
        this.mBtnShowAll.active = isAll;
    }
}
