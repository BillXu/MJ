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
export default class EffectLayer extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    loadEffect( name : string )
    {
        let self = this ;
        cc.loader.loadResDir("effect/"+name,
        ( err : Error, assets : any[] )=>{
            if ( err )
            {
                cc.error( "load effect " + name + "failed"  );
                return null ;
            }

            if ( assets.length < 1 )
            {
                cc.error( "load effect " + name + "failed  lack of res"  );
                return null ;
            }

            let pEffectNode = new cc.Node();
            //self.node.addChild(pEffectNode);
            let dragDisplay : dragonBones.ArmatureDisplay = pEffectNode.addComponent(dragonBones.ArmatureDisplay);

            for ( let i in assets )
            {
                if ( assets[i] instanceof dragonBones.DragonBonesAsset )
                {
                    dragDisplay.dragonAsset = assets[i] ;
                }

                if ( assets[i] instanceof dragonBones.DragonBonesAtlasAsset )
                {
                    dragDisplay.dragonAtlasAsset = assets[i] ;
                }
            }

            dragDisplay.armatureName = "armatureName" ;
            //dragDisplay.playAnimation("play",1);
            console.log( "load and player" );
        }) ;
    }

    // update (dt) {}
}
