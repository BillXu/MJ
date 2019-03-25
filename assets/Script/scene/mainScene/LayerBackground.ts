import Utility from "../../globalModule/Utility";
import ClientApp from "../../globalModule/ClientApp";
//import ClientData from "../../globalModule/ClientData";

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

@ccclass
export default class LayerBackground extends cc.Component {

    @property(cc.Node)
    selfInfoNode: cc.Node = null;
    private ptSelfInfoPos : cc.Vec2 = null ;
    
    @property(cc.Node)
    pMainAdNode : cc.Node = null ;

    @property(cc.Node)
    bottomNode: cc.Node = null;
    private ptBottomNodePos : cc.Vec2 = null ;

    @property(cc.Node)
    middleNode: cc.Node = null;
    private ptMiddleNodePos : cc.Vec2 = null ;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    settingAndMsgNode: cc.Node = null;
    private ptsettingAndMsgNodePos : cc.Vec2 = null ;
    onLoad () 
    {
        if ( cc.audioEngine.isMusicPlaying() == false )
        {
            let setConfig = ClientApp.getInstance().getConfigMgr().getSettingConfig();
            Utility.bgMusic(setConfig.musicTypeIdx);
        }
    }

    start () {
        this.ptSelfInfoPos = this.selfInfoNode.position ;
        this.ptBottomNodePos = this.bottomNode.position ;
        this.ptMiddleNodePos = this.middleNode.position ;
        this.ptsettingAndMsgNodePos = this.settingAndMsgNode.position ;
    }

    hide( funcDoHide?: ()=>void )
    {
        let fActTime = 0.7;
        let v : cc.ActionInterval = cc.moveTo(fActTime,cc.v2(this.ptSelfInfoPos.x,this.ptSelfInfoPos.y + 200 ));
        this.selfInfoNode.runAction(v);

        v = cc.moveTo(fActTime,cc.v2(this.ptBottomNodePos.x,this.ptBottomNodePos.y - 200 ));
        this.bottomNode.runAction(v);

        //v = cc.moveTo(fActTime,this.ptMiddleNodePos);
        //this.middleNode.runAction(v);
        this.middleNode.active = false ;
        this.pMainAdNode.active = false ;

        v = cc.moveTo(fActTime,cc.v2(this.ptsettingAndMsgNodePos.x,this.ptsettingAndMsgNodePos.y + 200 ));
        this.settingAndMsgNode.runAction(v);

        if ( null != funcDoHide )
        {
            v = cc.delayTime(fActTime) ;
            let fun = cc.callFunc(funcDoHide) ;
            this.node.runAction(cc.sequence(v,fun));
        }
    }

    show( funcDoShow?: ()=>void )
    {
        let fActTime = 0.7;
        let v : cc.ActionInterval = cc.moveTo(fActTime,this.ptSelfInfoPos);
        this.selfInfoNode.runAction(v);

        v = cc.moveTo(fActTime,this.ptBottomNodePos);
        this.bottomNode.runAction(v);

        //v = cc.moveTo(fActTime,this.ptMiddleNodePos);
        //this.middleNode.runAction(v);

        this.pMainAdNode.active = true ;
        this.middleNode.active = true ;

        v = cc.moveTo(fActTime,this.ptsettingAndMsgNodePos);
        this.settingAndMsgNode.runAction(v);

        if ( null != funcDoShow )
        {
            v = cc.delayTime(fActTime) ;
            let fun = cc.callFunc(funcDoShow) ;
            this.node.runAction(cc.sequence(v,fun));
        }
    }

    // update (dt) {}
}
