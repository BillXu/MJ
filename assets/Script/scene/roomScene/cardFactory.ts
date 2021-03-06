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
import {eCardSate, eArrowDirect, RoomEvent } from "./roomDefine"
import Card from "./card" 
import ClientData from "../../globalModule/ClientData";
import { eMJBg, clientEvent } from "../../common/clientDefine"
@ccclass
export default class CardFactory extends cc.Component {

    @property(cc.SpriteAtlas)
    pCurCardAtlas: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    pLeftRightEatPengGang : cc.Prefab = null ;
    pLeftRightEatPengGangPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pSelfEatPengGang : cc.Prefab = null ;
    pSelfEatPengGangPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pUpEatPengGang : cc.Prefab = null ;
    pUpEatPengGangPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pSingleCard : cc.Prefab = null ;
    pSingleCardPool : cc.NodePool = new cc.NodePool();

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.refreshMJ();
        cc.systemEvent.on(clientEvent.setting_update_mjBg,this.refreshMJ,this);
    }

    onDestroy()
    {
        this.pLeftRightEatPengGangPool.clear();
        this.pUpEatPengGangPool.clear();
        this.pSelfEatPengGangPool.clear();
        this.pSingleCardPool.clear();
        cc.systemEvent.targetOff(this);
    }

    start () {
        // let nPosIdx = 2 ;
        // // test 
        // let cardNum = Card.makeCardNum(4,1) ;
        // let pnode = this.createCard(cardNum,nPosIdx,eCardSate.eCard_AnGang) ;
        // pnode.position = cc.v2(-326,260);
        // this.node.addChild(pnode);

        // pnode = this.createCard(cardNum,nPosIdx,eCardSate.eCard_MingGang) ;
        // pnode.position = cc.v2(-351,-51);
        // this.node.addChild(pnode);

        // pnode = this.createCard(cardNum,nPosIdx,eCardSate.eCard_Hold) ;
        // pnode.position = cc.v2(192,188);
        // this.node.addChild(pnode);

        // pnode = this.createCard(cardNum,nPosIdx,eCardSate.eCard_Peng) ;
        // pnode.position = cc.v2(192,-43);
        // this.node.addChild(pnode);

        // pnode = this.createCard(cardNum,nPosIdx,eCardSate.eCard_Out) ;
        // pnode.position = cc.v2(68,-315);
        // this.node.addChild(pnode);
        // test 

    }

    createCard( cardNum : any , posIdx : number , cardType : eCardSate , nArrowDirection? : eArrowDirect ) : cc.Node
    {
        let pCardNode : cc.Node = null ;
        let isSelf = 0 == posIdx ;
        let isLeft = 3 == posIdx ;
        let isRight = 1 == posIdx ;
        let isUp = 2 == posIdx ;
        let pPool : cc.NodePool = null ;
        // "self = 0 , right = 1 , up = 2 , left = 3 "
        //"hold = 0,out = 1,peng=2 ,mingGang = 3,Angang = 4,eat = 5 , hu = 6"
        let vScale : number[][] = [ [1.52,1.14,1.33,1.33,1.33,1.33,1.14] 
                                   ,[1.35,1.29,1.27,1.27,1.27,1.27,1.29]
                                   ,[1.11,1.14,1.1,1.1,1.1,1.1,1.14]
                                   ,[1.35,1.29,1.27,1.27,1.27,1.27,1.29]
    
        ]  ; // vScale[posIdx][eCardSate]
        switch( cardType )
        {
            case eCardSate.eCard_AnGang:
            case eCardSate.eCard_Eat:
            case eCardSate.eCard_MingGang:
            case eCardSate.eCard_Peng:
            {
                if ( isLeft || isRight )  
                {
                    pCardNode = this.pLeftRightEatPengGangPool.get() || cc.instantiate(this.pLeftRightEatPengGang);
                    pPool = this.pLeftRightEatPengGangPool ;
                    break ;
                }

                // up and sel
                if ( isSelf )
                {
                    pCardNode = this.pSelfEatPengGangPool.get() || cc.instantiate(this.pSelfEatPengGang);
                    pPool = this.pSelfEatPengGangPool ;
                    break ;
                }

                pCardNode = this.pUpEatPengGangPool.get() || cc.instantiate(this.pUpEatPengGang);
                pPool = this.pUpEatPengGangPool ;
            }
            break ;
            case eCardSate.eCard_Hold:
            case eCardSate.eCard_Out:
            case eCardSate.eCard_Hu:
            {
                pCardNode = this.pSingleCardPool.get() || cc.instantiate(this.pSingleCard);
                pPool = this.pSingleCardPool ;
            }
            break;
            default:
            cc.error( "invalid state card type " + cardType );
        }

        if ( pCardNode == null )
        {
            cc.error( "can not create card node " + cardNum + "  " + posIdx + " " + cardType );
            return pCardNode ;
        }

        let pCard : Card = pCardNode.getComponent(Card);
        pCard.nPosIdx = posIdx ;
        pCard.eState = cardType ;
        pCard.setCard(cardNum,this.pCurCardAtlas) ;
        pCard.pRecyclePool = pPool ;
        if ( nArrowDirection != null )
        {
            let nArrowDirectOffset : number = ( isRight || isUp )  ? 180 : 0 ;
            let vDirectDegree : number[] = [90,-90,180] ;
            if ( nArrowDirection > vDirectDegree.length )
            {
                cc.error( "invalid direction value = " + nArrowDirection );
                nArrowDirection = 0 ;
            }
            let nRotation = nArrowDirection + vDirectDegree[nArrowDirection] ;
            pCard.pDirection.node.rotation = nRotation ;
            pCard.pDirection.node.active = false ;  // disable arrow
        }
        pCardNode.scale = vScale[posIdx][cardType] ;
        return pCardNode ;
    }

    recycleNode( pNode : cc.Node )
    {
        let pCard : Card = pNode.getComponent(Card);
        if ( pCard == null )
        {
            cc.error( "we cannot recycle this node" );
            return ;
        }

        let pool : cc.NodePool = pCard.pRecyclePool ;
        pool.put(pNode);

        //console.log(" pool size = " + pool.size() );
    }

    loadNewCardAtals( strCardName : string )
    {
        let self = this ;
        cc.loader.loadRes(strCardName, cc.SpriteAtlas, function (err, atlas) {
            if ( err )
            {
                cc.error( "load new mj error idx = " + strCardName + " error = " + err  );
                return ;
            }
            self.pCurCardAtlas = atlas ;

            let pEvent = new cc.Event.EventCustom(RoomEvent.Event_changeMJ,true) ;
            pEvent.detail = atlas ;
            cc.systemEvent.dispatchEvent(pEvent) ;
        });
    }

    refreshMJ()
    {
        let idx : eMJBg = ClientData.getInstance().mjBgIdx ;
        let vMJ = [] ;
        vMJ[eMJBg.eMJ_Blue] = "cards/CFBlueMJ" ;
        vMJ[eMJBg.eMJ_Golden] = "cards/CFGoldMJ" ;
        vMJ[eMJBg.eMJ_Green] = "cards/CFGreenMJ" ;
        if ( idx >= vMJ.length )
        {
            cc.error( "invalid mj bg = " + idx );
            return ;
        }

        if ( this.pCurCardAtlas == null )
        {
            this.loadNewCardAtals(vMJ[idx]) ;
            return ;
        }

        let curAtalsName = "cards/" + this.pCurCardAtlas.name;
        let at = this.pCurCardAtlas ;
        if ( curAtalsName == vMJ[idx] + ".plist" )
        {
            cc.warn( "cur and set is the same = " + vMJ[idx] );
            return ;
        }
        this.loadNewCardAtals(vMJ[idx]) ;
        
        // setTimeout(() => {
        //     let nPos = curAtalsName.indexOf(".") ;
        //     let rs = curAtalsName.slice(0,nPos);
        //     cc.loader.release(at);
        // }, 600);

    }
    // update (dt) {}
}
