import IOpts from "./IOpts";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

 export default class ChiFengOpts extends IOpts
{   
    get isDuipu() : boolean 
    {
        return this.jsOpts["guapu"] == 1 ;
    }

    set level( le : number )
    {
        this.jsOpts["level"] = le ;
    }

    get level() : number
    {
       return this.jsOpts["level"] ;
    }

    get roundCnt() : number
    {
        if ( this.isCircle )
        {
            return -1 ;
        }

        return this.level == 0 ? 8 : 16 ;
    }

    get circleCnt() : number
    {
        if ( this.isCircle == false )
        {
            return -1 ;
        }

        let createDlgOptIdx = this.level - 2 ;
        let vCircle = [1,2,3,4] ;
        return vCircle[createDlgOptIdx] ;
    }

    get isGuapu() : boolean
    {
        return this.jsOpts["guapu"] == 1;
    }

    set isGuapu( is : boolean )
    {
        this.jsOpts["guapu"] = is ? 1 : 0 ;
    }

    getRuleDesc() : string 
    {
        return "" ;
    }

    getDiamondFee() : number 
    {
        return 0 ;
    }

}
