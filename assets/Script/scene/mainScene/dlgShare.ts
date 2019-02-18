import DlgBase from "../../common/DlgBase";
import WechatManager, { eWechatShareDestType } from "../../sdk/WechatManager";
import { configDef } from "../../common/clientDefine";
import Utility from "../../globalModule/Utility";

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
@ccclass
export default class DlgShare extends DlgBase {
    start () {

    }

    onClickShareToFriend()
    {
        this.share(eWechatShareDestType.eDest_Firend);
        this.closeDlg();
    }

    onClickShareToTimeLine()
    {
        this.share(eWechatShareDestType.eDest_TimeLine) ;
        this.closeDlg();
    }

    protected share( type : eWechatShareDestType )
    {
        Utility.audioBtnClick();
        WechatManager.getInstance().shareLinkWechat(configDef.APP_DOWNLOAD_URL,type,"赤峰麻将","我在赤峰麻将等你，快快下载，一起玩耍！") ;
    }
    // update (dt) {}
}
