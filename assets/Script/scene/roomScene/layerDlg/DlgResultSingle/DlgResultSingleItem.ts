import { ResultItem } from "../../roomData/ResultSingleData";
import { ISingleResultDlgDataItem } from "../ILayerDlgData";

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
export default class DlgResultSingleItem extends cc.Component {

    @property(cc.Label)
    huFen: cc.Label = null;

    @property(cc.Label)
    gangFen: cc.Label = null;

    @property(cc.Label)
    huType : cc.Label = null ;

    @property(cc.Label)
    mFinalWin : cc.Label = null ;

    @property(cc.Label)
    mFinalLose : cc.Label = null ;

    @property(cc.Node)
    mDetailNode : cc.Node = null ;

    @property(cc.Node)
    mSumNode : cc.Node = null ;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    set gangScore( nScore : number )
    {
        this.gangFen.string = (nScore > 0 ? "+" : "" ) + nScore ;
        this.gangFen.node.color = cc.Color.WHITE.fromHEX( nScore >= 0 ? "#FFCD1A":"#43CEFF" );
        this.gangFen.node.parent.color = this.gangFen.node.color.clone();
    }

    set huScore( nScore : number )
    {
        this.huFen.string = (nScore > 0 ? "+" : "" ) + nScore ;
        this.huFen.node.color = cc.Color.WHITE.fromHEX( nScore >= 0 ? "#FFCD1A":"#43CEFF" );
        this.huFen.node.parent.color = this.huFen.node.color.clone();
    }

    set huTypes( huStr : string )
    {
        if ( huStr == null )
        {
            this.huType.node.parent.active = false ;
            return ;
        }
        this.huType.node.parent.active = true ;
        this.huType.string = huStr ;
    }

    set sumFinal( value : number )
    {
        this.mFinalLose.node.active = this.mFinalWin.node.active = false ;
        let p = value > 0 ? this.mFinalWin : this.mFinalLose ;
        p.string = value > 0 ? ( "+" + value ) : ( value + "" ); 
        p.node.active = true ;
    }

    setInfo( dataI : ISingleResultDlgDataItem )
    {
        let data = dataI as ResultItem ;
        this.gangScore = data.mGangScore ;
        this.huScore = data.mHuScore ;
        this.sumFinal = data.mOffset ;

        this.mSumNode.active = true ;
        this.mDetailNode.active = false ;

        this.unscheduleAllCallbacks();
        this.scheduleOnce( this.onShowDetail ,2 ) ;

        if ( data.mHuScore <= 0 )
        {
            this.huTypes = null;
            return ;
        }
        this.huTypes = data.getHuTypeStr();
    }

    onShowDetail()
    {
        this.mSumNode.active = false ;
        this.mDetailNode.active = true ;
    }

    // update (dt) {}
}
