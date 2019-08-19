import { ILayerOpts } from "./ILayerOpts";
import IOpts from "../../../opts/IOpts";
import OptsDanDong from "../../../opts/OptsDanDong";
import { ePayRoomCardType } from "../../../common/clientDefine";
import Prompt from "../../../globalModule/Prompt";

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
export default class LayerOptsDanDong extends ILayerOpts {

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
        if ( false == this.buildOpts() )
        {
            return null ;
        }
        return this.mOpts;
    }

    protected buildOpts() : boolean
    {
        let self = this ;

        // round 
        let vRound = [8,16] ;
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

       // seat ;
       this.mOpts.seatCnt = this.mSeat4.isChecked ? 4 : 3 ;

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
        this.mOpts.isOnePlayerDianPao = this.mOneDianPao.isChecked ;

        // limit fen
        this.mOpts.limitFen = 0 ; 
        if ( this.mGuang.isChecked )
        {
            let vFen = [ 30,50,70,100] ;
            if ( vFen.length != this.mFengLimit.length )
            {
                cc.error( "mFengLimit array is the same length" );
                return false ;
            }
            
            this.mFengLimit.every( ( t : cc.Toggle , idx : number )=>{
                if ( t.isChecked )
                {
                    this.mOpts.limitFen = vFen[idx] ;
                    return false ;
                }
                return false ;
            } );

            if ( this.mOpts.limitFen == 0 )
            {
                Prompt.promptDlg( "请选择分数");
                return false ;
            }
        }

        // rand seat ;
        this.mOpts.isRandSeat = this.mRandSeat.isChecked ;
        
        // ip and gps 
        this.mOpts.isAvoidCheat = this.mIPAndGPS.isChecked ;
        this.mOpts.isForceGPS = false ;
        if ( this.mIPAndGPS.isChecked )
        {
            this.mOpts.isForceGPS = this.mForceGPS.isChecked ;
        }

        return true ;
    }
    // update (dt) {}
}
