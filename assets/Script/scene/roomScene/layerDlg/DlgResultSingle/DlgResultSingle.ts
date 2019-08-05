import DlgResultSingleItem from "./DlgResultSingleItem";
import ResultSingleData from "../../roomData/ResultSingleData";

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
    @property( [cc.Component.EventHandler ] )
    onDlgResult : cc.Component.EventHandler[] = [] ; // ( isShowAll : bool )
    // onLoad () {}

    start () {

    }

    // update (dt) {}
    showDlg( selfSvrIdx : number , result : ResultSingleData )
    {
        this.mItems.forEach( ( item : DlgResultSingleItem )=>{ item.node.active = false ;} );
        if ( result.mIsLiuJu )
        {
            this.mLiuJuNode.active = true ;
            return ;
        }
        this.mLiuJuNode.active = false ;

        let selfIdx = selfSvrIdx < 0 ? 0 : selfSvrIdx ;
        for ( let v of result.mResults )
        {
            if ( v.isEmpty() )
            {
                continue ;
            }

            let clientIdx = ( v.mIdx - selfIdx + this.mItems.length ) % this.mItems.length ;
            this.mItems[clientIdx].node.active = true ;
            this.mItems[clientIdx].setInfo(v) ;
        }

        this.setBtn(false);
        this.node.active = true ;
    }

    closeDlg()
    {
        this.node.active = false ;
    }

    onClickNext( event : cc.Event.EventTouch, isAll : string )
    {
        this.closeDlg();
        let isShowAll : boolean = parseInt( isAll ) == 1 ;
        cc.Component.EventHandler.emitEvents( this.onDlgResult,isShowAll  );
    }

    setBtn( isAll : boolean )
    {
        this.mBtnNext.active = !isAll ;
        this.mBtnShowAll.active = isAll;
    }
}
