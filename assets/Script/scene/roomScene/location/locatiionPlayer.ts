import PhotoItem from "../../../commonItem/photoItem";
import { playerBaseData } from "../roomInterface";

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
export default class LocationPlayer extends cc.Component {

    @property(cc.Label)
    pName: cc.Label = null;

    @property(cc.Label)
    pIP : cc.Label = null ;

    @property(cc.Node)
    pNoGps : cc.Node = null ;

    @property(cc.Node)
    pMaleIcon : cc.Node = null ;

    @property(cc.Node)
    pFemaleIcon : cc.Node = null ;

    @property(PhotoItem)
    pHeadIcon : PhotoItem = null ;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    refresh( data : playerBaseData )
    {
        if ( null == data )
        {
            this.clear();
            return ;
        }
        this.pName.node.active = true ;
        this.pIP.node.getParent().active = true ;
        this.pMaleIcon.active = data.isMale() ;
        this.pFemaleIcon.active = !data.isMale() ;
        this.pHeadIcon.photoURL = data.headIconUrl ;

        this.pName.string = data.name;
        this.pIP.string = data.ip ;
        this.pNoGps.active = data.J < 1 || data.W < 1 ;
    }

    private clear()
    {
        this.pName.node.active = false ;
        this.pIP.node.getParent().active = false ;
        this.pMaleIcon.active = false ;
        this.pFemaleIcon.active = false ;
        this.pHeadIcon.photoURL = "" ;
        this.pNoGps.active = false ;
    }

    // update (dt) {}
}
