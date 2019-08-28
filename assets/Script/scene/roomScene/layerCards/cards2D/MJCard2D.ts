import { eCardSate } from "../../roomDefine";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MJCard2D extends cc.Component {

    mCardSprite : cc.Sprite = null ;
    mPosIdx : number = 0 ;
    mCardState : eCardSate = eCardSate.eCard_Max ;
    mCardNum : number = 0 ;
    mCardUniqueID : number = 0 ;
    mAtalsResName : string = "" ;  // used by mj factory ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
 
    initCard( sp : cc.Sprite , posIdx : number , state : eCardSate , cardNum : number ) 
    {
        this.mCardNum = cardNum ;
        this.mCardSprite = sp ;
        this.mCardState = state ;
        this.mPosIdx = posIdx ;
    }

    switchHighLight( isLight : boolean )
    {
        this.node.color = isLight ? cc.Color.WHITE.fromHEX("#EBC634") : cc.Color.WHITE;
    }

    start () {

    }
    // update (dt) {}
}