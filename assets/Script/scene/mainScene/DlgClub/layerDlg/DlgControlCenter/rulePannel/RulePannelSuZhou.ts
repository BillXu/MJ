import IRulePannel from "../IRulePanel";
import IOpts from "../../../../../../opts/IOpts";
import { ePayRoomCardType, eGameType } from "../../../../../../common/clientDefine";

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
export default class RulePannelSuZhou extends cc.Component implements IRulePannel {

    @property(cc.Label)
    mGame : cc.Label = null 

    @property(cc.Label)
    mRound: cc.Label = null;

    @property(cc.Label)
    mPayType : cc.Label = null ;
    
    @property(cc.Label)
    mOptRule : cc.Label = null ;

    refresh( opts : IOpts )
    {
        this.mRound.string = opts.roundCnt + "局" ;
        switch ( opts.payType )
        {
            case ePayRoomCardType.ePayType_AA:
            this.mPayType.string = "AA支付" ;
            break ;
            case ePayRoomCardType.ePayType_RoomOwner :
            this.mPayType.string = "房主支付" ;
            break ;
            case ePayRoomCardType.ePayType_Winer:
            this.mPayType.string = "大赢家支付" ;
            break ;
            default:
            this.mPayType.string = "unknwon : " + opts.payType ;
        }
        this.mOptRule.string = opts.getRuleDesc();

        switch ( opts.gameType )
        {
            case eGameType.eGame_SZMJ:
            {
                this.mGame.string = "苏州麻将" ;
            }
            break ;
            case eGameType.eGame_SDMJ:
            {
                this.mGame.string = "苏州百搭" ;
            }
            break ;
            default:
            {
                this.mGame.string = "麻将" + opts.gameType ;
            }
            break ;
        }
    }
}
