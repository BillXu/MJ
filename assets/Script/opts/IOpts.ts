import { eGameType, ePayRoomCardType } from "../common/clientDefine";

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
    jsOpts : Object = {};
    init() : void {} ;
    get payType() : ePayRoomCardType
    {
        return this.jsOpts["payType"] ;
    }

    set payType( type : ePayRoomCardType ) 
    {
        this.jsOpts["payType"] = type ;
    } 

    get seatCnt() : number
    {
        return this.jsOpts["seatCnt"] ;
    }

    set seatCnt( cnt : number )
    {
        if ( CC_JSB == false )
        {
            if ( cnt == 3 ) cnt = 2 ;
        }
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


    get roundCnt() : number
    {
        if ( this.jsOpts["level"] == null )
        {
            this.jsOpts["level"] = 0 ;
            cc.error("round key is null");
        }
        return this.jsOpts["level"] == 0 ? 8 : 16; 
    } 

    set roundCnt( value : number)
    {
        this.jsOpts["level"] = value == 8 ? 0 : 1 ;
    }


//    totalCircleOrRoundCnt : number ;

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
        return this.getRuleDesc() ;
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

    toString() : string
    {
        return JSON.stringify( this.jsOpts );
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

    parseFromString( strFmt : string )
    {
        if ( this.jsOpts = JSON.parse(strFmt) == null )
        {
            cc.error( "parse opt string error = " + strFmt );
        }
    }
} 
