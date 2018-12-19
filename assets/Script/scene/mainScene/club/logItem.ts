// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { eClubEvent,eClubPrivilige } from "./clubDefine"
import { LogDataItem } from "./clubLogData"
@ccclass
export default class LogItem extends cc.Component {

    @property(cc.RichText)
    pContent: cc.RichText = null;

    @property(cc.Label)
    pTime : cc.Label = null ;

    nameClr : number = 0xeb6c1f ;
    refresh( data : LogDataItem )
    {
        let strContent : string = "" ;
        let jsDetail = data.jsDetail ;
        switch ( data.logEventType )
        {
            case eClubEvent.eClubEvent_ApplyJoin:
            {
                strContent = "【<color=#eb6c1f>" + data.getNameByID(jsDetail["respUID"]) + ( jsDetail["isAgree"] == 1 ? "</color>】同意了【<color=#eb6c1f>" : "</color>】拒绝了【<color=#eb6c1f>" ) + data.getNameByID(jsDetail["uid"]) + "</color>】加入俱乐部"; 
            }
            break;
            case eClubEvent.eClubEvent_Kick:
            {
                strContent = "【<color=#eb6c1f>" + data.getNameByID(jsDetail["uid"]) + "</color>】被【<color=#eb6c1f>" + data.getNameByID(jsDetail["mgrUID"]) + "</color>】请出了俱乐部"; 
            }
            break ;
            case eClubEvent.eClubEvent_Leave:
            {
                strContent = "【<color=#eb6c1f>" + data.getNameByID(jsDetail["uid"]) + "</color>】离开了俱乐部"; 
            }
            break;
            case eClubEvent.eClubEvent_UpdatePrivlige:
            {
                let prori : eClubPrivilige = jsDetail["privilige"] ;
                let vstr : string[] = [] ;
                vstr[eClubPrivilige.eClubPrivilige_Creator] = "创建者" ;
                vstr[eClubPrivilige.eClubPrivilige_Forbid] = "禁止入局" ;
                vstr[eClubPrivilige.eClubPrivilige_Manager] = "管理员" ;
                vstr[eClubPrivilige.eClubPrivilige_Normal] = "普通玩家" ;
                if ( vstr.length <= prori )
                {
                    cc.error("invalid privilage club = " + prori );
                    break ;
                }
                strContent = "【<color=#eb6c1f>" + data.getNameByID(jsDetail["actUID"]) + "</color>】将玩家【<color=#eb6c1f>" + data.getNameByID(jsDetail["actUID"]) + "</color>】设置为" + vstr[prori] ; 
            }
            break;
            default:
            cc.error( "unknown log event type = " + data.logEventType + " do not process" );
             strContent = "default "
        }

        this.pContent.string = "<color=#835B35>" + strContent + "</c>" ;
        let date = new Date(data.time * 1000 ) ;
        this.pTime.string = date.toLocaleString();
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
