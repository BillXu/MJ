import { clientEvent } from "../../common/clientDefine";
import ClientApp from "../../globalModule/ClientApp";

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
export default class Desk2d extends cc.Component {

    @property(cc.Sprite)
    mDeskBg : cc.Sprite = null ;
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        cc.systemEvent.on( clientEvent.setting_update_deskBg,this.onRefreshDesk,this );
        this.onRefreshDesk();
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    start () {
        
    }

    protected onRefreshDesk()
    {
        if ( this.mDeskBg == null )
        {
            this.mDeskBg = this.node.getComponent(cc.Sprite);
        }

        if ( this.mDeskBg == null )
        {
            this.mDeskBg = this.node.addComponent(cc.Sprite);
        }

        let idx = ClientApp.getInstance().getConfigMgr().getSettingConfig().deskBgIdx;

        let vDeskRes = ["zhuomian_lv","zhuomian_lan","zhuomian_hong"] ;
        let self = this ;
        let resName = "Desk2D/" + vDeskRes[idx] ;
        cc.loader.loadRes( resName , cc.SpriteFrame, function (err, atlas) {
            if ( err )
            {
                cc.error( "load new mj error idx = " + resName + " error = " + err  );
                return ;
            }

             self.mDeskBg.spriteFrame = atlas ;
             self.mDeskBg.sizeMode = cc.Sprite.SizeMode.RAW;
        });
    }

    // update (dt) {}
}
