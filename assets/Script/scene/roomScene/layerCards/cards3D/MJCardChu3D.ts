import MJCard, { MJCardState } from "./MJCard";
import MJFactory from "./MJFactory";
import IChuCardArrow from "../IChuCardArrow";

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
export default class MJCardChu3D extends cc.Component {

    mFacotry : MJFactory = null ;
    protected mChuCards : MJCard[] = [] ;
    @property(cc.Node)
    mPosNode : cc.Node = null ;

    mStartX : number = 0 ;
    mStartZ : number = 0 ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.mStartX = this.mPosNode.position.x ;
        this.mStartZ = (this.mPosNode.position as cc.Vec3).z ;
        this.mPosNode.removeFromParent();
    }

    clear()
    {
        for ( const iterator of this.mChuCards )
        {
            this.mFacotry.recycleMJ(iterator);
        }
        this.mChuCards.length = 0 ;
    }

    refresh( cards : number[] )
    {
        this.clear();
        for ( let c of cards )
        {
            this.addChuCard(c,null);
        }
    }

    addChuCard( card : number , ptWorldPos : cc.Vec3 ) : cc.Vec3 
    {
        let chuMJ = this.mFacotry.getMJ(card,MJCardState.FACE_UP,this.node ) ;
        let chuPos = this.getChuCardPos( this.mChuCards.length );
        let ptPos : cc.Vec3 = null ;
        if ( ptWorldPos != null )
        {
            ptPos = this.node.convertToNodeSpaceAR(ptWorldPos);
        }
        chuMJ.node.position = ptPos == null ? chuPos : ptPos ;
        this.mChuCards.push(chuMJ);

        if ( ptPos != null )
        {
            cc.tween(chuMJ.node)
            .to( 0.15, { position: chuPos } )
            .start() ;
        }
        return this.node.convertToWorldSpaceAR(chuPos) ;
    }

    removeChuCard( card : number )
    {
        let p = this.mChuCards.pop();
        if ( card != p.cardNum )
        {
            cc.error( "why last card is not card = " + card + " , last is = " + p.cardNum );
            this.mChuCards.push(p);
            return ;
        }
        this.mFacotry.recycleMJ(p) ;
    }

    protected getChuCardPos( idx : number ) : cc.Vec3
    {
        let nCntPerRow = 7 ;
        let xMargin = 1;
        let zMargin = 1 ;

        let startX = this.mStartX ;//-1 * nCntPerRow * 0.5 * ( MJCard.MODEL_X_SIZE + xMargin ) + 0.5 * MJCard.MODEL_X_SIZE ;
        let startZ = this.mStartZ ;


        let rowIdx = (idx + nCntPerRow ) / nCntPerRow -1;
        rowIdx = Math.floor(rowIdx);
        let colIdx = Math.floor( idx % nCntPerRow ) ;
        let posTarget = new cc.Vec3( startX + colIdx * ( MJCard.MODEL_X_SIZE + xMargin ), MJCard.MODEL_Y_SIZE * 0.5, startZ + ( MJCard.MODEL_Z_SIZE + zMargin ) * rowIdx ) ;
        cc.log( "chu target card = " + posTarget );
        return posTarget;
    }

    // update (dt) {}
}
