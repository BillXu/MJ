import LabelTimer from "../../../common/LabelTimer";
import test from "../../../test";
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
export default class SeatIndicator2d extends IIndicator {

    @property(LabelTimer)
    mTimer : LabelTimer = null;

    @property( cc.Node )
    mSeatRoot : cc.Node = null ;

    @property([cc.Node])
    mSeatNode : cc.Node[] = [] ; 
    // LIFE-CYCLE CALLBACKS:

     onLoad ()
    {
        //this.test();
    }

    setBottomSvrIdx( svrIdx : number )
    {
        this.mSeatRoot.angle = -90 * svrIdx ;
    }

    setCurActIdx( svrIdx : number , leftTimer : number = 30 )
    {
        let cnode : cc.Node = null ;
        let self = this ;
        this.mSeatNode.forEach( ( node : cc.Node, idx : number )=>{ 
             node.active = idx == svrIdx ; 
             if ( node.active )
             { 
                 cnode = node ; 
                 cnode.pauseAllActions();
             } ;
            } ) ;

        this.mTimer.node.active = cnode != null ;
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

    // test------------
    selfidx = 0 ;
    curIdx = 0 ;
    test()
    {
        let self = this;
        cc.systemEvent.on( "click2", ()=>{ 
            ++self.selfidx
            this.setBottomSvrIdx( self.selfidx % 4 );  
            cc.log( "selfIdx = " + self.curIdx % 4  );
        } )

        cc.systemEvent.on( "click", ()=>
        { 
            ++self.curIdx ;
            
            cc.log( "curIdx = " + self.curIdx % 4  );
            this.setCurActIdx( self.curIdx % 4,30 ) ;
        } )
    }
}
