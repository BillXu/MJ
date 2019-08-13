import PhotoItem from "../../commonItem/photoItem";
import DlgBase from "../../common/DlgBase";
import { playerBaseData } from "./roomInterface";

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
export default class dlgPlayerInfo extends DlgBase {

    @property(cc.Label)
    pName: cc.Label = null;
 
    @property(cc.Label)
    pID : cc.Label = null ;

    @property(cc.Label)
    pIP : cc.Label = null ;  

    @property(PhotoItem)
    pHeadIcon : PhotoItem = null ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose);
        let playerData : playerBaseData = jsUserData;
        this.pName.string = playerData.name ;
        this.pID.string = "ID:" + playerData.uid;
        this.pIP.string = playerData.ip ;
        this.pHeadIcon.photoURL = playerData.headIconUrl ;
    }
    // update (dt) {}
}
