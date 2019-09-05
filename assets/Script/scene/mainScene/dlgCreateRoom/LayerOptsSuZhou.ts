import { ILayerOpts } from "./ILayerOpts";
import OptsSuZhou from "../../../opts/OptsSuZhou";
import IOpts from "../../../opts/IOpts";
import { ePayRoomCardType } from "../../../common/clientDefine";

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
export default class LayerOptsSuZhou extends ILayerOpts {

    @property([cc.Toggle])
    mRound : cc.Toggle[] = [] ;

    @property([cc.Toggle])
    payTypes : cc.Toggle[] = [] ;

    @property(cc.Toggle)
    mMoChong34 : cc.Toggle = null ;

    @property(cc.Toggle)
    mHaoQi : cc.Toggle = null ;

    @property(cc.Toggle)
    mDiLing : cc.Toggle = null ;

    mOpts : OptsSuZhou = new OptsSuZhou();

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    getOpts() : IOpts 
    {
        if ( false == this.buildOpts() )
        {
            return null ;
        }
        return this.mOpts;
    }

    protected buildOpts() : boolean
    {
        // round
        let self = this ; 
        let vRound = [4,8,16] ;
        if ( vRound.length != this.mRound.length )
        {
            cc.error( "round array is the same length" );
            return false ;
        }

        this.mRound.every( ( t : cc.Toggle, idx : number )=>
        { 
            if ( t.isChecked )
            { 
                self.mOpts.roundCnt = vRound[idx] ;
                return false ;
            } 
        return true ;
        } );

        // pay type ;
       let vPayType = [ ePayRoomCardType.ePayType_RoomOwner,ePayRoomCardType.ePayType_AA ] ;
       if ( vPayType.length != this.payTypes.length )
       {
           cc.error( "payTypes array is the same length" );
           return false ;
       }

       this.payTypes.every(
        ( t : cc.Toggle, idx : number )=>
        {
            if ( t.isChecked )
            {
                this.mOpts.payType = vPayType[idx] ;
                return false ;
            }
            return true ;
        });
        
        // wan fa 
        this.mOpts.ruleMode = this.mMoChong34.isChecked ? 2 :  1 ;

        this.mOpts.isHaoQi = this.mHaoQi.isChecked ;
        this.mOpts.isDiLing = this.mDiLing.isChecked ;
        return true ;
    }

    // update (dt) {}
}
