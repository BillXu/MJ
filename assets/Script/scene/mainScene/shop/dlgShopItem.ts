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
export default class DlgShopItem extends cc.Component {

    @property(cc.Label)
    pItemCnt: cc.Label = null;

    @property(cc.Label)
    pPrice : cc.Label = null ;

    itemID : number = 0 ;
    // LIFE-CYCLE CALLBACKS:

    lpfCallBack : ( itemID : number )=>void = null ;
    // onLoad () {}

    start () {

    }

    refresh( itemID : number , price : number , itmeCnt : number )
    {
        this.pItemCnt.string = itmeCnt.toString();
        this.pPrice.string = "" + price;
        this.itemID = itemID ;
    }

    onClickItem()
    {
        if ( this.lpfCallBack )
        {
            this.lpfCallBack(this.itemID);
        }
    }

    // update (dt) {}
}
