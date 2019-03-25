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
import IModule from "../common/IModule";
@ccclass
export default class InitScene extends IModule {

    @property(cc.Node)
    pNodePersite: cc.Node = null;

    isCheckUpdateOk : boolean = false ;
    isConnectedSvr : boolean = false ;
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        super.init();
        cc.game.addPersistRootNode(this.pNodePersite);
        cc.systemEvent.on(clientEvent.event_checkUpdateOk,this.onCheckupdateOk,this) ;
    }

    onCheckupdateOk()
    {
        this.isCheckUpdateOk = true ;
        console.log( "check update ok" );
        this.tryLoadLoginScene();
    }

    onConnectOpen()
    {
        this.isConnectedSvr = true ;
        console.log( "cannect to svr " );
        this.tryLoadLoginScene();
    }

    private canLoadLoginScene() : boolean 
    {
        return cc.sys.isNative == false || ( this.isCheckUpdateOk && this.isConnectedSvr )  ;
    }

    private tryLoadLoginScene()
    {
        if ( this.canLoadLoginScene() )
        {
            cc.director.loadScene(SceneName.Scene_login);
        }
    }

    // update (dt) {}
}
