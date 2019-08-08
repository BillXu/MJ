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
export default class PlayerInteractEmoji extends cc.Component {

    @property(dragonBones.ArmatureDisplay)
    mDargon: dragonBones.ArmatureDisplay = null;

    mCacherDisplay : { [key : string ] : dragonBones.ArmatureDisplay[] } = {} ;
    mPlayingDisplays : dragonBones.ArmatureDisplay[] = [] ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    protected onDragonAniFinished( event : dragonBones.EventObject )
    {
        for ( let idx = 0 ; idx < this.mPlayingDisplays.length ; ++idx )
        {
            let ani = this.mPlayingDisplays[idx] ;
            if ( ani.armatureName == event.armature.name )
            {
                ani.node.active = false ;
                this.mPlayingDisplays.splice(idx,1);

                // go on cacher ;
                let vchaher = this.mCacherDisplay[ani.armatureName] ;
                if ( vchaher == null )
                {
                    this.mCacherDisplay[ani.armatureName] = [] ;
                    vchaher = this.mCacherDisplay[ani.armatureName] ;
                }
                vchaher.push(ani);
                return ;
            }
        }
    }

    protected getAni( str : string ) : cc.Node
    {
        let ani : dragonBones.ArmatureDisplay = null ;
        let vchaher = this.mCacherDisplay[str] ;
        if ( vchaher != null && vchaher.length > 0 )
        {
            ani = vchaher.shift();
            //console.log( "use cacher ani str =  " + str  );
        }
        else
        {
            this.mDargon.node.active = true ;
            let p = cc.instantiate(this.mDargon.node) ;
            this.mDargon.node.active = false ;
            p.active = true ;
            this.mDargon.node.parent.addChild(p);
            ani = p.getComponent(dragonBones.ArmatureDisplay);
            ani.on(dragonBones.EventObject.COMPLETE,this.onDragonAniFinished,this);
            ani.armatureName = str ;

            //console.log( "use new ani str =  " + str  );
        }
        ani.node.active = true ;
        ani.playAnimation(str,1) ; 
        this.mPlayingDisplays.push(ani);
        return ani.node ;
    }

    playInteractEmoji( strAni : string ,ptWorldPosOrgi : cc.Vec2, ptWorldPosDest : cc.Vec2 )
    {
        if ( strAni != "item7" )
        {
            let aniNode = this.getAni( strAni );
            aniNode.position = aniNode.parent.convertToNodeSpaceAR(ptWorldPosOrgi);
            cc.tween(aniNode).to(0.3,{ position : aniNode.parent.convertToNodeSpaceAR(ptWorldPosDest) } ).start();
        }
        else
        {
            let aniOrg = this.getAni( strAni );
            aniOrg.position = aniOrg.parent.convertToNodeSpaceAR(ptWorldPosOrgi);
            aniOrg.scaleX = -1 ;

            let localOrg = aniOrg.parent.convertToNodeSpaceAR(ptWorldPosOrgi);
            let localDst = aniOrg.parent.convertToNodeSpaceAR(ptWorldPosDest);
            let dir : cc.Vec2 = localDst.sub(localOrg);  
            dir.normalizeSelf();
            let angle = cc.Vec2.RIGHT.signAngle(dir) ;
            angle = angle / Math.PI * 180;
            aniOrg.angle = angle;

            let aniTarget = this.getAni( "item7_bow" );
            aniTarget.position = aniTarget.parent.convertToNodeSpaceAR(ptWorldPosDest);
        }
    }
    // update (dt) {}
}
