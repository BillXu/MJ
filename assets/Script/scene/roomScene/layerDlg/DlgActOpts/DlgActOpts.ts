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

    mOnDglResult : (actTpe : eMJActType)=>void = null ; // ( actTpe : eMJActType ) 

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    showDlg( actOpts : eMJActType[] , lpCallBack : (actTpe : eMJActType)=>void )
    {
        this.mOptNodeEat.active = _.find(actOpts,( t : eMJActType )=>{ return t == eMJActType.eMJAct_Chi ;}) != null ;
        this.mOptNodePeng.active = _.find(actOpts,( t : eMJActType )=>{ return t == eMJActType.eMJAct_Peng ;}) != null ;
        this.mOptNodeGang.active = _.find(actOpts,( t : eMJActType )=>{ 
            console.log( "gang check node = " + t.toString() ); 
            let isGang = t == eMJActType.eMJAct_AnGang || eMJActType.eMJAct_BuGang == t || t == eMJActType.eMJAct_MingGang;
            if ( isGang )
            {
                this.mOptNodeGang.name = t + "" ;
            }
            return isGang ; }) != null ;
        this.mOptNodeHu.active = _.find(actOpts,( t : eMJActType )=>{ return t == eMJActType.eMJAct_Hu ;}) != null ;
        this.node.active = true ;
        this.mOnDglResult = lpCallBack ;
    }

    onClickButton( event : cc.Event.EventTouch , type : string )
    {
        let actType : eMJActType = parseInt(type);
        if ( actType == eMJActType.eMJAct_AnGang )
        {
            actType = parseInt( this.mOptNodeGang.name );
        }
        if ( this.mOnDglResult != null )
        {
            this.mOnDglResult(actType);
        }
        this.node.active = false ;
    }
    // update (dt) {}
}
