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
export default class ClubListItem extends cc.Component {

    @property(cc.Label)
    unCheckName: cc.Label = null;

    @property(cc.Label)
    checkName: cc.Label = null;

    @property(cc.Label)
    checkID: cc.Label = null;

    id : number = 0 ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    refresh( id : number , name : string )
    {
        this.id = id ;
        this.checkID.string = id.toString();
        this.unCheckName.string = name ;
        this.checkName.string = name ;
    }

    // update (dt) {}
}
