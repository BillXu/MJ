import DlgBase from "../../../common/DlgBase";
import PlayerInfoItem from "../../../commonItem/PlayerInfoItem";
import MJCardFactory2D from "../../roomScene/layerCards/cards2D/MJCardFactory2D";
import MJRoomData from "../../roomScene/roomData/MJRoomData";
import MJPlayerData from "../../roomScene/roomData/MJPlayerData";
import { eCardSate } from "../../roomScene/roomDefine";
import MJCard2D from "../../roomScene/layerCards/cards2D/MJCard2D";

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
export default class DlgHuaDetail extends DlgBase {

    @property([PlayerInfoItem])
    mPlayerInfoItems : PlayerInfoItem[] = [] ;

    @property([cc.Node])
    mHuaCards : cc.Node[] = [] ;

    @property(MJCardFactory2D)
    mCardFactory : MJCardFactory2D = null ;

    @property(cc.Node)
    mBtnShow : cc.Node = null ;

    @property(cc.Node)
    mBtnHide : cc.Node = null ;

    @property(cc.Node)
    mBodyNode : cc.Node = null ;

    TAG_SHOW : number = 1 ;
    TAG_HILDE : number = 2 ;

    start()
    {
        this.closeDlg();
    }

    protected refreshDlg( roomData : MJRoomData )
    {
        this.clearCards();
        for ( let idx = 0 ; idx < this.mPlayerInfoItems.length ; ++idx )
        {
            this.refreshPlayer(idx,roomData.mPlayers[idx]);
        }
    }

    protected refreshPlayer( idx : number , player : MJPlayerData )
    {
        let isEmpty = player == null || player.isEmpty();
        this.mPlayerInfoItems[idx].node.active = !isEmpty ;
        this.mHuaCards[idx].active = !isEmpty ;
        if ( isEmpty )
        {
            return ;
        }

        this.mPlayerInfoItems[idx].refreshInfo( player.mPlayerBaseData.uid ) ;
        let vHua = player.mPlayerCard.vBuedHua;
        let huaDetailNode = this.mHuaCards[idx] ;
        huaDetailNode.scaleX = vHua.length >= 9 ? 0.68 : 1 ;
        huaDetailNode.scaleY = vHua.length >= 9 ? 0.7 : 1 ;
        for ( let v of vHua )
        {
            let card = this.mCardFactory.getCard(v,0,eCardSate.eCard_Out) ;
            huaDetailNode.addChild(card.node);
        }
    }

    protected clearCards()
    {
        for ( let v of this.mHuaCards )
        {
            for ( let cardNode of v.children )
            {
                let card = cardNode.getComponent(MJCard2D);
                if ( card == null )
                {
                    cc.error( "why child is not card2d ?" );
                    continue ;
                }
                this.mCardFactory.recycleCard(card) ;
            }
        }
    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose );
        this.refreshDlg(<MJRoomData>jsUserData);
        this.pRootNode.getChildByName("capNode").active = true ;

        this.mBtnHide.active = true ;
        this.mBtnShow.active = !this.mBtnHide.active ;

        this.pBgImgArea.active = true ;
        let tag = this.mBodyNode.getActionByTag(this.TAG_SHOW);
        if ( tag != null )
        {
            this.mBodyNode.runAction(tag);
            return ;
        }
        let move = cc.moveTo(0.3,cc.v2(0,0)) ;
        move.setTag( this.TAG_SHOW ) ;
        this.mBodyNode.runAction(move) ;
    }

    closeDlg()
    {
        super.closeDlg();
        this.pRootNode.getChildByName("capNode").active = false ;
        this.pRootNode.active = true ;
        this.mBtnHide.active = false ;
        this.mBtnShow.active = !this.mBtnHide.active ;

        let tag = this.mBodyNode.getActionByTag(this.TAG_HILDE);
        if ( tag != null )
        {
            this.mBodyNode.runAction(tag);
            return ;
        }

        let move = cc.moveTo(0.3,cc.v2(this.pBgImgArea.getContentSize().width * -1 + 10,0)) ;
        let self = this ;
        let cal = cc.callFunc(()=>{self.pBgImgArea.active = false ;}) ;
        let seq = cc.sequence( move,cal );
        seq.setTag( this.TAG_HILDE );
        this.mBodyNode.runAction(seq) ;
    }
    // update (dt) {}
}
