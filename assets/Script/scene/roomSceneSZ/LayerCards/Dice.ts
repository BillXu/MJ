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
export default class Dice extends cc.Component {

    @property
    mAniTime : number = 1.1 ;
    
    @property([cc.Node])
    mAniPath : cc.Node[] = [] ;

    @property(dragonBones.ArmatureDisplay)
    pShaiZi : dragonBones.ArmatureDisplay = null ;

    @property([cc.SpriteFrame])
    mDiceNumFrame : cc.SpriteFrame[] = [] ;

    @property(cc.Sprite)
    mDiceNum : cc.Sprite = null ;

    vPathPoint : cc.Vec2[] = [] ;

    onLoad()
    {
        this.vPathPoint.length = 0 ;
        for ( let n of this.mAniPath )
        {
            let pos : cc.Vec2 = n.position as cc.Vec2; //n.parent.convertToWorldSpaceAR( n.position );
            //pos = this.node.parent.convertToNodeSpaceAR( pos );
            this.vPathPoint.push(pos);
        }
    }

    playDice( num : number , keepTime : number )
    {
        this.node.active = true ;
        this.node.stopAllActions();
        this.node.position = this.vPathPoint[0] ;
        this.mDiceNum.spriteFrame = this.mDiceNumFrame[num%this.mDiceNumFrame.length] ;
        this.mDiceNum.enabled = false ;
        this.pShaiZi.enabled = true ;
        //this.pShaiZi.node.position = cc.v2(-592,311);
        this.pShaiZi.playAnimation("Sprite",0);
        let b = cc.bezierTo(this.mAniTime,this.vPathPoint.concat([])) ;
        let m = b.easing(cc.easeCubicActionOut()); 

        let self = this ;
        let ac = cc.callFunc( ()=>{ self.pShaiZi.enabled = false ; self.mDiceNum.enabled = true ;} );

        let acHide = cc.callFunc( ()=>{ self.node.active = false ;} );
        let seqA = cc.sequence(m,ac,cc.delayTime(keepTime),acHide ) ;
        this.node.runAction(seqA);
    }
    // update (dt) {}
}
