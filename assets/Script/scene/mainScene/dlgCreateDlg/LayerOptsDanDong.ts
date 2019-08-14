import { ILayerOpts } from "./ILayerOpts";
import IOpts from "../../../opts/IOpts";
import OptsDanDong from "../../../opts/OptsDanDong";

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
export default class LayerOptsDanDong extends cc.Component implements ILayerOpts {

    @property([cc.Toggle])
    mRound : cc.Toggle[] = [] ;

    @property(cc.Toggle)
    mSeat4 : cc.Toggle = null ;

    @property([cc.Toggle])
    payTypes : cc.Toggle[] = [] ;
    
    @property(cc.Toggle)
    mOneDianPao : cc.Toggle = null ;

    @property(cc.Toggle)
    mGuang : cc.Toggle = null ;

    @property( [cc.Toggle ] )
    mFengLimit : cc.Toggle[] = [] ;

    @property( cc.Toggle )
    mRandSeat : cc.Toggle = null ;

    @property(cc.Toggle)
    mIPAndGPS : cc.Toggle = null ;

    @property(cc.Toggle)
    mForceGPS : cc.Toggle = null ;

    @property(cc.Label)
    mAAPayDesc : cc.Label = null ;

    @property(cc.Label)
    mMultiDianPaoDesc : cc.Label = null ;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    mOpts : OptsDanDong = new OptsDanDong();

    start () {

    }

    onToggleSeat( seat : cc.Toggle )
    {
        let is4 = this.mSeat4.isChecked ;
        this.mAAPayDesc.string = is4 ? "4人支付" : "3人支付" ; 
        this.mMultiDianPaoDesc.string = is4 ? "三家炮" : "两家炮" ;
    }

    onToggleGuang( guang : cc.Toggle )
    {
        if ( guang.isChecked )
        {
            for ( let item of this.mFengLimit )
            {
                if ( item.isChecked )
                {
                    return ;
                }
            }

            this.mFengLimit[0].isChecked = true ;
        }
        else
        {
            for ( let item of this.mFengLimit )
            {
                if ( item.isChecked )
                {
                    item.isChecked = false ;
                    return ;
                }
            }
        }
    }

    getOpts() : IOpts
    {
        this.buildOpts();
        return this.mOpts;
    }

    protected buildOpts()
    {

    }
    // update (dt) {}
}
