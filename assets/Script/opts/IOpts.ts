import { eGameType } from "../common/clientDefine";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class IOpts
{
    protected jsOpts : Object ;

    get payType() : number
    {
        return this.jsOpts["payType"] ;
    }

    set payType( type : number ) 
    {
        this.jsOpts["payType"] = type ;
    } 

    get seatCnt() : number
    {
        return this.jsOpts["seatCnt"] ;
    }

    set seatCnt( cnt : number )
    {
        this.jsOpts["seatCnt"] = cnt ;
    }

    get isCircle() : boolean
    {
        return this.jsOpts["circle"] == 1;
    }

    set isCircle( is : boolean )
    {
        this.jsOpts["circle"] = is ? 1 : 0 ;
    }

    totalCircleOrRoundCnt : number ;

    get gameType() : eGameType
    {
        return this.jsOpts["gameType"] ;
    }

    set gameType( type : eGameType )
    {
        this.jsOpts["gameType"] = type ;
    }

    get ruleDesc() : string
    {
        return " not define " ;
    }

    get baseScore() : number
    {
        return this.jsOpts["baseScore"];
    }

    set baseScore( is : number )
    {
        this.jsOpts["baseScore"] = is ;
    }

    get isAvoidCheat() : boolean
    {
        return this.jsOpts["enableAvoidCheat"] == 1;
    }

    set isAvoidCheat( is : boolean )
    {
        this.jsOpts["enableAvoidCheat"] = is ? 1 : 0 ;
    }

    set isForceGPS ( is : boolean )
    {
        this.jsOpts["gps"] = is ? 1 : 0 ;
    } 

    get isForceGPS()
    {
        return this.jsOpts["gps"] == 1 ;
    }

    getRuleDesc() : string 
    {
        return "" ;
    }

    getDiamondFee() : number 
    {
        return 0 ;
    }

    parseOpts( js : Object ) : void 
    {
        this.jsOpts = js ;
    }
} 
