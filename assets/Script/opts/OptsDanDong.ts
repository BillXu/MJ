import IOpts from "./IOpts";
import { eGameType, ePayRoomCardType } from "../common/clientDefine";

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
export default class OptsDanDong extends IOpts {

    constructor()
    {
        super();
        this.isCircle = false ;
        this.gameType = eGameType.eGame_DDMJ ;
        this.baseScore = 1 ;
    }

    init() : void
    {

    }

    get isOnePlayerDianPao() : boolean
    {
        return this.jsOpts["dpOnePay"] == 1 ;
    }

    set isOnePlayerDianPao( value : boolean )
    {
        this.jsOpts["dpOnePay"] = value ? 1 : 0;
    }

    get limitFen() : number
    {
        return this.jsOpts["guang"] ;
    }

    set limitFen( value : number )
    {
        this.jsOpts["guang"] = value ;
    }

    get isRandSeat() : boolean
    {
        return this.jsOpts["rcs"].Number == 1 ;
    }

    set isRandSeat( value : boolean )
    {
        this.jsOpts["rcs"] = value ? 1 : 0 ;
    }

    getRuleDesc() : string 
    {
        let str = "" ;
        if ( this.isOnePlayerDianPao )
        {
            str = "[一家炮] ";
        }
        else
        {
            str = this.seatCnt == 4 ? "[三家炮]" : "[两家炮]" ;
        }

        if ( this.limitFen > 0 )
        {
            str = str + " [上限" + this.limitFen + "分]" ;
        }
        return str ;
    }

    getDiamondFee() : number 
    {
        let diamond = this.roundCnt == 8 ? 4 : 8 ;
        if ( this.payType == ePayRoomCardType.ePayType_AA )
        {
            return Math.ceil( diamond / this.seatCnt );
        } 
        return diamond ;
    }

    // update (dt) {}
}
