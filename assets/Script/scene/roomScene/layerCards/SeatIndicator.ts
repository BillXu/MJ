import LabelTimer from "../../../common/LabelTimer";
import IIndicator from "./IIndicator";

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
export default class SeatIndicator extends IIndicator {

    @property(LabelTimer)
    mTimer : LabelTimer = null;

    @property([cc.Node])
    mSeatNode : cc.Node[] = [] ;  // client idx ;

    mSeatAniPic : cc.SpriteFrame[] = [] ;  // 0-3 , dong nan xi bei 
    mSeatText : cc.SpriteFrame[] = [] ;    // 0-3 , dong nan xi bei 
    // LIFE-CYCLE CALLBACKS:
    mBottomSeatSvrIdx : number = 0 ;
    onLoad () 
    {
        for ( let idx = 0 ; idx < this.mSeatNode.length ; ++idx )
        {
            this.mSeatAniPic[idx] = this.mSeatNode[idx].getComponent(cc.Sprite).spriteFrame ;
            this.mSeatText[idx] = this.mSeatNode[idx].parent.getComponent(cc.Sprite).spriteFrame ;
        }
    }

    setBottomSvrIdx( selfIdx : number )
    {
        if ( selfIdx == this.mBottomSeatSvrIdx )
        {
            return ;
        }

        this.mBottomSeatSvrIdx = selfIdx ;
        for ( let clientIdx = 0 ; clientIdx < this.mSeatNode.length ; ++clientIdx )
        {
            let svrIdx = ( this.mBottomSeatSvrIdx + clientIdx ) % this.mSeatNode.length ;
            this.mSeatNode[clientIdx].getComponent(cc.Sprite).spriteFrame = this.mSeatAniPic[svrIdx] ;
            this.mSeatNode[clientIdx].parent.getComponent(cc.Sprite).spriteFrame = this.mSeatText[svrIdx] ;
        }
    }

    setCurActIdx( svrIdx : number , leftTimer : number = 30 )
    {
        let cnode : cc.Node = null ;
        let self = this ;
        this.mSeatNode.forEach( ( node : cc.Node, idx : number )=>{  node.active = ( ( self.mBottomSeatSvrIdx + idx ) % self.mSeatNode.length) == svrIdx ; if ( node.active ){ cnode = node ; cnode.pauseAllActions();} ;} ) ;
        if ( cnode == null )
        {
            return ;
        }
        
        if ( cnode.getActionByTag(1) )
        {
            cc.log( "use cacher" );
            cnode.resumeAllActions();
        }
        else
        {
            cc.log( "use new" );
            let fo = cc.fadeTo(0.7,100) ;
            let fi = cc.fadeTo(0.7,255);
            let seq = cc.sequence(fo,fi) ;
            let repeat = cc.repeatForever( seq ) ;
            repeat.setTag( 1 );
            cnode.runAction(repeat) ;
        }
        this.mTimer.setTime(leftTimer);
    }   

    // update (dt) {}
}
