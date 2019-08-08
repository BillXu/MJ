 
import { eMJCardType, eArrowDirect } from "./scene/roomScene/roomDefine";
import PlayerMJCard from "./scene/roomScene/layerCards3D/cards/PlayerMJCard";
import MJCard from "./scene/roomScene/layerCards3D/cards/MJCard";
import * as _ from "lodash"
import PlayerInteractEmoji from "./scene/roomScene/layerPlayers/PlayerInteractEmoji";
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
export default class test extends cc.Component {

 
    @property(PlayerMJCard)
    mPlayerCards : PlayerMJCard = null;
    // LIFE-CYCLE CALLBACKS:

    @property(PlayerInteractEmoji)
    mInteractEmoji : PlayerInteractEmoji = null ;

    @property(cc.Node)
    mOrgNode : cc.Node = null ;

    @property(cc.Node)
    mDstNode : cc.Node = null ;
    // onLoad () {}

    start () {
        this.mPlayerCards.isSelf = true;
    }

    mValue = MJCard.makeCardNum(eMJCardType.eCT_Feng,1) ;
    onClick()
    {
        this.mInteractEmoji.playInteractEmoji( "item1",this.mOrgNode.convertToWorldSpaceAR(cc.Vec2.ZERO), this.mDstNode.convertToWorldSpaceAR(cc.Vec2.ZERO) );
        return ;
        cc.log( "distribute" );
        let v : number[] = [] ;
        v.push( this.mValue );
        v.push( this.mValue );
        v.push( this.mValue );
        v.push( this.mValue );
        v.push( this.mValue );
        this.mPlayerCards.onDistribute(v);

        //this.mPlayerCards.onMo( MJCard.makeCardNum(eMJCardType.eCT_Wan,1),null);
    }

    onClick2()
    {
        this.mInteractEmoji.playInteractEmoji( "item2",this.mOrgNode.convertToWorldSpaceAR(cc.Vec2.ZERO), this.mDstNode.convertToWorldSpaceAR(cc.Vec2.ZERO) );
        return ;
        this.mPlayerCards.onChu(this.mValue);
    }

    onClick3()
    {
        this.mInteractEmoji.playInteractEmoji( "item3",this.mOrgNode.convertToWorldSpaceAR(cc.Vec2.ZERO), this.mDstNode.convertToWorldSpaceAR(cc.Vec2.ZERO) );
        return ;
        this.mPlayerCards.onPeng(this.mValue,eArrowDirect.eDirect_Left);
    }

    onClick4()
    {
        this.mInteractEmoji.playInteractEmoji( "item7",this.mOrgNode.convertToWorldSpaceAR(cc.Vec2.ZERO), this.mDstNode.convertToWorldSpaceAR(cc.Vec2.ZERO) );
        return ;
        this.mPlayerCards.onMingGang(this.mValue,eArrowDirect.eDirect_Left,this.mValue + 1,null);
    }
    // update (dt) {}
}
