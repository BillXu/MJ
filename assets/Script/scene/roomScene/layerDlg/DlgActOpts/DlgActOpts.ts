import { eMJActType } from "../../roomDefine";
import * as _ from "lodash"

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
export default class DlgActOpts extends cc.Component {

    @property(cc.Node)
    mOptNodeEat : cc.Node = null ;

    @property(cc.Node)
    mOptNodePeng : cc.Node = null ;

    @property(cc.Node)
    mOptNodeGang : cc.Node = null ;

    @property(cc.Node)
    mOptNodeHu : cc.Node = null ;

    @property([cc.Component.EventHandler])
    mOnDglResult : cc.Component.EventHandler[] = [] ; // ( actTpe : eMJActType ) 

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    showDlg( actOpts : eMJActType[] )
    {
        this.mOptNodeEat.active = _.find(actOpts,( t : eMJActType )=>{ return t == eMJActType.eMJAct_Chi ;}) != null ;
        this.mOptNodePeng.active = _.find(actOpts,( t : eMJActType )=>{ return t == eMJActType.eMJAct_Peng ;}) != null ;
        this.mOptNodeGang.active = _.find(actOpts,( t : eMJActType )=>{ return t == eMJActType.eMJAct_AnGang || eMJActType.eMJAct_BuGang == t || t == eMJActType.eMJAct_MingGang ;}) != null ;
        this.mOptNodeHu.active = _.find(actOpts,( t : eMJActType )=>{ return t == eMJActType.eMJAct_Hu ;}) != null ;
        this.node.active = true ;
    }

    onClickButton( event : cc.Event.EventTouch , type : string )
    {
        let actType : eMJActType = parseInt(type);
        cc.Component.EventHandler.emitEvents(this.mOnDglResult,actType ) ;
        this.node.active = false ;
    }
    // update (dt) {}
}
