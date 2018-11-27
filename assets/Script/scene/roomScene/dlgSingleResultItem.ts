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
import PhotoItem from "../../commonItem/photoItem"
import { eFanxingType } from "./roomDefine"
import { IHoldMingPai } from "./roomInterface"
import CardFactory from "./cardFactory"
import {eCardSate } from "./roomDefine"
@ccclass
export default class DlgSingleResultItem extends cc.Component {

    @property(PhotoItem)
    pPhoto: PhotoItem = null;

    @property(cc.Label)
    pName : cc.Label = null ;

    @property(cc.Node)
    pBankerIcon : cc.Node = null ;

    @property(cc.Label)
    pHuType : cc.Label = null ;

    @property(cc.Node)
    pCardStartPos  : cc.Node = null ;

    //@property
    nCardElaps : number = 10 ;

    @property(cc.Label)
    pHuScore : cc.Label = null ;

    @property(cc.Label)
    pGangScore : cc.Label = null ;

    @property(cc.Label)
    pTotalScore : cc.Label = null ;

    @property(cc.Label)
    pFanShu : cc.Label = null ;
    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    pHuBg : cc.Node = null ;
    // onLoad () {}

    @property([cc.Node])
    vIdxTag : cc.Node[] = [] ;

    @property(cc.Node)
    pZiMoTag : cc.Node = null ;

    @property(cc.Node)
    pDianPaoTag : cc.Node = null ;

    @property(cc.Node)
    pRoomOwnerTag : cc.Node = null ;

    vCards : cc.Node[] = [] ;

    nOffset : number = 0 ;
    start () {
        this.pCardStartPos.active = false ;
        this.nOffset = 0 ;
    }

    set headUrl ( url : string )
    {
        this.pPhoto.photoURL = url ;
    }

    set name ( name : string )
    {
        this.pName.string = name.toString();
    }

    set isBanker( isbanker : boolean )
    {
        this.pBankerIcon.active = isbanker ;
    }

    set huType( vhuType : eFanxingType[] )
    {
        this.pHuBg.active = vhuType != null ;
        let huStr : string = "平胡" ;
        if ( vhuType && vhuType.length > 0 )
        {
            vhuType.forEach( ( hutype : eFanxingType )=>{
                let strType = "" ;
                switch( hutype )
                {
                    case eFanxingType.eFanxing_DuiDuiHu:
                    {
                        strType = "对对胡" ;
                    }
                    break ;
                    case eFanxingType.eFanxing_QiDui:
                    {
                        strType = "七对";
                    }
                    break;
                    case eFanxingType.eFanxing_ShuangQiDui:
                    {
                        strType = "双七对" ;
                    }
                    break;
                    case eFanxingType.eFanxing_13Yao:
                    {
                        strType = "十三幺" ;
                    }
                    break ;
                    case eFanxingType.eFanxing_GangKai:
                    {
                        strType = "杠开";
                    }
                    break;
                    case eFanxingType.eFanxing_QiangGang:
                    {
                        strType = "抢杠";
                    }
                    break;
                    case eFanxingType.eFanxing_GangHouPao:
                    {
                        strType = "杠后炮";
                    }
                    break;
                    default:
                    cc.error( "unknown hu type = " + hutype );
                    return ;
                }

                huStr += "   " + strType ;
            } );
        }
        this.pHuType.string = huStr ;
    }

    set gangScore ( gangScore : number )
    {
        this.pGangScore.string = gangScore.toString();
        if ( gangScore == 0 )
        {
            this.pGangScore.node.color = cc.Color.GRAY;
        }
        else
        {
            this.pGangScore.node.color = gangScore > 0 ? cc.color().fromHEX("#D15900") : cc.color().fromHEX("#127EC9");
        }
    }

    set huScore ( score : number )
    {
        this.pHuScore.string = score.toString();
        this.pFanShu.string = Math.abs( score) + "番";

        if ( score == 0 )
        {
            this.pHuScore.node.color = cc.Color.GRAY;
        }
        else
        {
            this.pHuScore.node.color = score > 0 ? cc.color().fromHEX("#D15900") : cc.color().fromHEX("#127EC9");
        }
    }

    set totalScore ( score : number )
    {
        this.nOffset = score ;
        this.pTotalScore.string = score.toString();
        if ( score == 0 )
        {
            this.pTotalScore.node.color = cc.Color.GRAY;
        }
        else
        {
            this.pTotalScore.node.color = score > 0 ? cc.color().fromHEX("#D15900") : cc.color().fromHEX("#127EC9");
        }
    }

    get totalScore() : number
    {
        return this.nOffset ;
    }

    set clientIdx ( clientIdx : number )
    {
        this.vIdxTag.forEach( ( pNode : cc.Node, idx : number )=>{ pNode.active = idx == clientIdx ;} );
    }

    set isZiMo( isZiMO : boolean )
    {
        this.pZiMoTag.active = isZiMO ;
        if ( isZiMO )
        {
            this.isHu = true ;
        }
    }

    set isDianPao ( isDianPao : boolean )
    {
        this.pDianPaoTag.active = isDianPao ;
        if ( isDianPao )
        {
            this.isHu = true ;
        }
    }

    set isHu( isHu : boolean )
    {
        this.pHuBg.active = isHu ;
        this.pHuType.node.active = isHu ;
        this.pHuType.node.active = isHu ;
    }

    setHuCard ( factory : CardFactory, huCard : number )
    {
        let pNode = factory.createCard(huCard,0,eCardSate.eCard_Out) ;
        if ( pNode == null )
        {
            cc.error( "create hold card failed num = " + huCard + " client Pos idx = " + 0  );
            return ;
        }

        //pNode.scale = 1 ;
        let pos = this.vCards[this.vCards.length -1].position ;
        pos.x += this.vCards[this.vCards.length -1].getBoundingBox().width + this.nCardElaps;
        pNode.position = pos ;
        this.node.addChild(pNode);
        this.vCards.push(pNode);
    }

    set isRoomOwner( isOwner : boolean )
    {
        this.pRoomOwnerTag.active = isOwner ;
    }

    setCardInfo( factory : CardFactory , vMingCards : IHoldMingPai[], vHoldCards : number[] )
    {
        this.vCards.forEach( ( card : cc.Node )=>{ factory.recycleNode(card);} );
        this.vCards.length = 0 ;

        vMingCards = vMingCards || [] ;
        vHoldCards = vHoldCards || [] ;
        let self = this ;
        vMingCards.forEach( ( pMingCards : IHoldMingPai, idx : number  )=>{
            let pNode : cc.Node = null ;
            let isEat = pMingCards.mjStateType == eCardSate.eCard_Eat ;
            if ( isEat && ( pMingCards.vEatWithCards == null || pMingCards.vEatWithCards.length != 3 ))
            {
                cc.error( "eat vect is not 3 or vEat is null" );
                return ;
            } 
            pNode = factory.createCard( isEat ? pMingCards.vEatWithCards : pMingCards.nCard,0,pMingCards.mjStateType);
            if ( null == pNode )
            {
                cc.error( "cannot create card node type = " + pMingCards.mjStateType + " card = " + pMingCards.nCard + " posidx = " + 0 );
                return ;
            }

            pNode.scale = 0.7 ;
            let pos = self.pCardStartPos.position ;
            if ( idx != 0 )
            {
                pos = self.vCards[idx-1].position ;
                pos.x += self.vCards[idx-1].getBoundingBox().width + self.nCardElaps ;
            }
            else
            {
                pos.x += pNode.getBoundingBox().width * 0.5 ;
            }
            pNode.position = pos ;
            self.node.addChild(pNode);
            self.vCards.push(pNode);
        } ) ;

        for ( let nIdx = 0 ; nIdx < vHoldCards.length ; ++nIdx )
        {
            let nNum : number = nIdx < vHoldCards.length ? vHoldCards[nIdx] : 0 ;
            let pNode = factory.createCard(nNum,0,eCardSate.eCard_Out) ;
            if ( pNode == null )
            {
                cc.error( "create hold card failed num = " + nNum + " client Pos idx = " + 0  );
                continue ;
            }

            //pNode.scale = 1 ;
            let pos = self.pCardStartPos.position ;
            if ( nIdx == 0 )
            {
                if ( self.vCards.length > 0 ) // have ming card 
                {
                    pos = self.vCards[self.vCards.length -1 ].position ;
                    pos.x += self.vCards[self.vCards.length -1 ].getBoundingBox().width * 0.5 ;
                    pos.x += self.nCardElaps + pNode.getBoundingBox().width * 0.5 ;
                }
            }
            else
            {
                pos = self.vCards[self.vCards.length -1].position ;
                pos.x += self.vCards[self.vCards.length -1].getBoundingBox().width ;
            }
            pNode.position = pos ;
            this.node.addChild(pNode);
            this.vCards.push(pNode);
        }
    }

    reset( factory : CardFactory )
    {
        this.vCards.forEach( ( card : cc.Node )=>{ factory.recycleNode(card);} );
        this.vCards.length = 0 ;

        this.isRoomOwner = false ;
        this.isBanker = false ;
        this.isZiMo = false ;
        this.isDianPao = false ;
        this.isHu = false ;
        this.huType = null ;
        this.nOffset = 0 ;
        this.gangScore = 0 ;
        this.huScore = 0 ;
        this.totalScore = 0 ;
    }
    // update (dt) {}
}
