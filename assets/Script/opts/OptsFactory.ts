import IOpts from "./IOpts";
import { eGameType } from "../common/clientDefine";
import OptsSuZhou from "./OptsSuZhou";
import OptsSuZhouBaiDa from "./OptsSuZhouBaiDa";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class OptsFactory{

    static createOpts( js : Object ) : IOpts
    {
        let gameType : eGameType  = js["gameType"] ;
        let opts : IOpts = null ;
        switch ( gameType )
        {
            case eGameType.eGame_SZMJ:
            {
                opts = new OptsSuZhou();
            }
            break ;
            case eGameType.eGame_SDMJ:
            {
                opts = new OptsSuZhouBaiDa();
            }
            break ;
            default:
            {
                cc.error( "unknonw game type = " + gameType );
                return null ;
            }
        }
        opts.init();
        opts.parseOpts(js) ;
        return opts ;
    }

}
