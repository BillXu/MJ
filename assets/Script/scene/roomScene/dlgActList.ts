
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
import {eMJActType }from "./roomDefine"
import * as _ from "lodash"
@ccclass
export default class DlgActList extends cc.Component {

    @property(cc.Node)
    pBtnEat: cc.Node = null;

    @property(cc.Node)
    pBtnPeng: cc.Node = null;

    @property(cc.Node)
    pBtnGang: cc.Node = null;

    @property(cc.Node)
    pBtnHu: cc.Node = null;

    @property([cc.Component.EventHandler])
    vResultEvenHandle : cc.Component.EventHandler[] = [] ;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    pRootNode : cc.Node = null ;

    ptDisplayPos : cc.Vec2 = cc.Vec2.ZERO ;
    mjGangType : eMJActType = undefined ;
    onLoad () 
    {
        if ( this.pRootNode == null )
        {
            this.pRootNode = this.node ;
        }
        this.ptDisplayPos = cc.v2(this.pRootNode.position);
        //this.closeDlg();
        this.showDlg([eMJActType.eMJAct_Chi,eMJActType.eMJAct_Peng,8]);
    }

    start () {
        let self = this ;
        setTimeout(() => {
            console.log("do show dlg");
            self.showDlg([eMJActType.eMJAct_Chi,eMJActType.eMJAct_Peng,8]);
        }, 5000);
    }

    onClickBtn( btn : cc.Button )
    {
        let mjAct = eMJActType.eMJAct_Chi ;
        if ( btn.node == this.pBtnEat )
        {
            mjAct = eMJActType.eMJAct_Chi ;
        }
        else if ( this.pBtnGang == btn.node )
        {
            mjAct = this.mjGangType ;
        }
        else if ( this.pBtnPeng == btn.node )
        {
            mjAct = eMJActType.eMJAct_Peng;
        }
        else if ( this.pBtnHu == btn.node )
        {
            mjAct = eMJActType.eMJAct_Hu ;
        }

        cc.Component.EventHandler.emitEvents(this.vResultEvenHandle,mjAct);
        this.closeDlg();
    }

    onClickPass()
    {
        this.closeDlg();
    }


    showDlg( actList : eMJActType[] )
    {
        this.pBtnEat.active = _.find(actList,( v : eMJActType )=>{ return v == eMJActType.eMJAct_Chi }) != undefined;
        this.pBtnPeng.active = _.find(actList,( v : eMJActType )=>{ return v == eMJActType.eMJAct_Peng }) != undefined;
        this.pBtnHu.active = _.find(actList,( v : eMJActType )=>{ return v == eMJActType.eMJAct_Hu }) != undefined;
        this.mjGangType = undefined ;
        if ( _.find(actList,( v : eMJActType )=>{ return v == eMJActType.eMJAct_AnGang }) != undefined )
        {
            this.mjGangType = eMJActType.eMJAct_AnGang ;
        }
        else if ( _.find(actList,( v : eMJActType )=>{ return v == eMJActType.eMJAct_MingGang }) != undefined ) 
        {
            this.mjGangType = eMJActType.eMJAct_MingGang ;
        }
        else if ( _.find(actList,( v : eMJActType )=>{ return v == eMJActType.eMJAct_BuGang }) != undefined )
        {
            this.mjGangType = eMJActType.eMJAct_BuGang ;
        } 
        this.pBtnGang.active = this.mjGangType != undefined ;
        
        let outPos = this.pRootNode.getParent().getContentSize().width * 0.5 + this.pRootNode.getContentSize().width ;
        this.pRootNode.active = true ;
        this.pRootNode.position = cc.v2( outPos, this.pRootNode.position.y) ;
        this.pRootNode.stopAllActions();
        this.pRootNode.runAction(cc.moveTo(0.2,this.ptDisplayPos));
    }

    closeDlg()
    {
        this.pRootNode.stopAllActions();
        let outPos = this.pRootNode.getParent().getContentSize().width * 0.5 + this.pRootNode.getContentSize().width ;
        this.pRootNode.runAction(cc.moveTo( 0.2,cc.v2( outPos, this.pRootNode.position.y) ));
    }
    // update (dt) {}
}
