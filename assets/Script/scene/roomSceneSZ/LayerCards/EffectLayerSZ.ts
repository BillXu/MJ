import EffectLayer from "../../roomScene/layerCards/effectLayer";
import Dice from "./Dice";
import { eMJActType } from "../../roomScene/roomDefine";

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
export default class EffectLayerSZ extends EffectLayer {

    @property(Dice)
    pShaiZi : Dice = null ;

    @property(Dice)
    pShaiZiB : Dice = null ;

    @property(dragonBones.ArmatureDisplay)
    pBuHua : dragonBones.ArmatureDisplay = null ;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.test();    
    }

    playerShaiZiEffect( nDiceA : number , nDiceB : number )
    {
        nDiceA %= 6 ; nDiceB %= 6 ;
        this.pShaiZi.playDice(nDiceA,1.5) ;
        this.pShaiZiB.playDice(nDiceB,1.5);
    }

    playPlayerEffect( clientIdx : number , act : eMJActType )
    {
        if ( act == eMJActType.eMJAct_BuHua )
        {
            this.playBuHuaEffect(clientIdx) ;
            return ;
        }
        super.playPlayerEffect( clientIdx, act ) ;
    }

    protected playBuHuaEffect( clientIdx : number )
    {
        this.pBuHua.node.active = true ;
        this.pBuHua.playAnimation("buhua",1) ;
        this.pBuHua.node.position = this.vHuEffect[clientIdx].node.position ;
    }

    testIdx : number = 0 ;
    test()
    {
        let self = this ;
        cc.systemEvent.on( "click2", ()=>{ 
            self.playBuHuaEffect( ++self.testIdx % 4);
        } )
    }
    // update (dt) {}
}
