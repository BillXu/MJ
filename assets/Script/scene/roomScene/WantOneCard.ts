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
import Card from "./card"
import { eMJCardType, eCardSate } from "./roomDefine"
import CardFactory from "./cardFactory"
import * as _ from "lodash"
import RoomScene from "./roomScene"
import { eMsgType } from "../../common/MessageIdentifer"
@ccclass
export default class WantOneCard extends cc.Component {

    @property(CardFactory)
    pCardFactory : CardFactory = null;

    vCards : cc.Node[] = [] ;

    @property(RoomScene)
    pScene : RoomScene = null ;
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        for ( let type = eMJCardType.eCT_Wan ; type <= eMJCardType.eCT_Tiao ; ++type )
        {
            for ( let value = 1 ; value <= 9 ; ++value )
            {
                let cardNum = Card.makeCardNum(type,value) ;
                let node = this.pCardFactory.createCard(cardNum,0,eCardSate.eCard_Hold) ;
                this.node.addChild(node);
                this.vCards.push(node);
            }
        }

        // do layout 
        let size = this.vCards[0].getBoundingBox().size ;
        let nCol = 6 ;
        let nRow = ( this.vCards.length + nCol - 1 ) / nCol ;
        nRow = Math.floor(nRow);
        for ( let nRowIdx = 0 ; nRowIdx < nRow ; ++nRowIdx )
        {
            for ( let nColIdx = 0 ; nColIdx < nCol ; ++nColIdx )
            {
                let nIdx = nCol * nRowIdx + nColIdx ;
                if ( nIdx >= this.vCards.length )
                {
                    break ;
                }

                let pNode = this.vCards[nIdx] ;
                pNode.position = cc.v2( ( nColIdx + 0.5) * size.width , (nRowIdx + 0.5)* size.height );
            }
        }

        let bgSize = cc.size( size.width * nCol,size.height * nRow ) ;
        this.node.setContentSize(bgSize) ; 
        this.node.position = cc.v2( -0.5 * bgSize.width,-0.5 * bgSize.height );

        // touch event 
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
    }

    onTouchEnd( event : cc.Event.EventTouch )
    {
        this.node.active = false ;

        let localPos = event.getLocation();
        localPos = this.node.convertToNodeSpaceAR(localPos);
        let pClickNode = _.find(this.vCards,( node : cc.Node )=>{
            return node.getBoundingBox().contains(localPos) ;
        }) ;

        if ( pClickNode == null )
        {
            return ;
        }

        let pcard : Card = pClickNode.getComponent(Card);

        let msg = { } ;
        msg["card"] = pcard.cardNumber ;
        this.pScene.sendRoomMsg(msg,eMsgType.MSG_SET_NEXT_CARD);
    }

    start () {

    }

    // update (dt) {}
}
