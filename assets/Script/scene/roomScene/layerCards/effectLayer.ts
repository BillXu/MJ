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
import { eMJActType } from "../roomDefine"
@ccclass
export default class EffectLayer extends cc.Component {

    @property( [dragonBones.ArmatureDisplay] )
    vHuEffect : dragonBones.ArmatureDisplay[] = [] ;

    @property(dragonBones.ArmatureDisplay)
    pEatEffect : dragonBones.ArmatureDisplay = null ;

    @property(dragonBones.ArmatureDisplay)
    pPengEffect : dragonBones.ArmatureDisplay = null ;

    @property(dragonBones.ArmatureDisplay)
    pGangEffect : dragonBones.ArmatureDisplay = null ;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    start () {

    }

    // loadEffect( name : string , ptPos : cc.Vec2)
    // {
    //     let self = this ;
    //     cc.loader.loadResDir("effect/"+name,
    //     ( err : Error, assets : any[] )=>{
    //         if ( err )
    //         {
    //             cc.error( "load effect " + name + "failed"  );
    //             return null ;
    //         }

    //         if ( assets.length < 1 )
    //         {
    //             cc.error( "load effect " + name + "failed  lack of res"  );
    //             return null ;
    //         }

    //         let pEffectNode = new cc.Node();
    //         self.node.addChild(pEffectNode);
    //         pEffectNode.position = ptPos ;
    //         let dragDisplay : dragonBones.ArmatureDisplay = pEffectNode.addComponent(dragonBones.ArmatureDisplay);

    //         for ( let i in assets )
    //         {
    //             if ( assets[i] instanceof dragonBones.DragonBonesAsset )
    //             {
    //                 dragDisplay.dragonAsset = assets[i] ;
    //             }

    //             if ( assets[i] instanceof dragonBones.DragonBonesAtlasAsset )
    //             {
    //                 dragDisplay.dragonAtlasAsset = assets[i] ;
    //             }
    //         }

    //         dragDisplay.armatureName = "armatureName" ;
    //         //dragDisplay.playAnimation("play",1);
    //         console.log( "load and player" );
    //     }) ;
    // }

    playPlayerEffect( clientIdx : number , act : eMJActType )
    {
        switch ( act )
        {
            case eMJActType.eMJAct_Hu:
            {
                this.vHuEffect[clientIdx].node.active = true ;
                this.vHuEffect[clientIdx].playAnimation("play",1) ;
            }
            break ;
            case eMJActType.eMJAct_BuGang:
            case eMJActType.eMJAct_BuGang_Done:
            case eMJActType.eMJAct_AnGang:
            case eMJActType.eMJAct_MingGang:
            {
                this.pGangEffect.node.active = true ;
                this.pGangEffect.playAnimation("play",1) ;
                this.pGangEffect.node.position = this.vHuEffect[clientIdx].node.position ;
            }
            break ;
            case eMJActType.eMJAct_Chi:
            {
                this.pEatEffect.node.active = true ;
                this.pEatEffect.playAnimation("play",1) ;
                this.pEatEffect.node.position = this.vHuEffect[clientIdx].node.position ;
            }
            break;
            case eMJActType.eMJAct_Peng:
            {
                this.pPengEffect.node.active = true ;
                this.pPengEffect.playAnimation("play",1) ;
                this.pPengEffect.node.position = this.vHuEffect[clientIdx].node.position ;
            }
            break;
            default:
            cc.error( "effect unknown act type = " + act );
            break ;
        }
    }

    // update (dt) {}
}
