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
import {SceneName, clientEvent} from "../common/clientDefine" 
@ccclass
export default class InitScene extends cc.Component {

    @property(cc.Node)
    pNodePersite: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        cc.game.addPersistRootNode(this.pNodePersite);
        cc.systemEvent.on(clientEvent.event_checkUpdateOk,this.onCheckupdateOk,this) ;
    }

    start () {
        
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    onCheckupdateOk()
    {
        setTimeout(() => {
            cc.director.loadScene(SceneName.Scene_login);
        }, 5000);
        
    }

    // update (dt) {}
}
