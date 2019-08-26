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
export default class test extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}

    start () {
        //this.mPlayerCards.isSelf = false;  
    }

     onClick()
    {
        cc.log( "click" );
        let pEvent = new cc.Event.EventCustom( "click",true) ;
        cc.systemEvent.dispatchEvent(pEvent) ;
    }

    onClick2()
    {
        cc.log( "click2" );
        let pEvent = new cc.Event.EventCustom( "click2",true) ;
        cc.systemEvent.dispatchEvent(pEvent) ;
    }

    onClick3()
    {
        cc.log( "click3" );
        let pEvent = new cc.Event.EventCustom( "click3",true) ;
        cc.systemEvent.dispatchEvent(pEvent) ;
    }

    onClick4()
    {
        cc.log( "click4" );
        let pEvent = new cc.Event.EventCustom( "click4",true) ;
        cc.systemEvent.dispatchEvent(pEvent) ;
    }
    // update (dt) {}
}
