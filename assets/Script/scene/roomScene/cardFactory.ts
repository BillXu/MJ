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
@ccclass
export default class CardFactory extends cc.Component {

    @property(cc.SpriteAtlas)
    pCurCardAtlas: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    pLeftAnGang : cc.Prefab = null ;
    pLeftAnGangPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pLeftEat : cc.Prefab = null ;
    pLeftEatPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pLeftHold : cc.Prefab = null ;
    pLeftHoldPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pLeftMingGang : cc.Prefab = null ;
    pLeftMingGangPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pLeftOut : cc.Prefab = null ;
    pLeftOutPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pLeftPeng : cc.Prefab = null ;
    pLeftPengPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pRightHold : cc.Prefab = null ;
    pRightHoldPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pSelfAnGang : cc.Prefab = null ;
    pSelfAnGangPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pSelfEat : cc.Prefab = null ;
    pSelfEatPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pSelfHold : cc.Prefab = null ;
    pSelfHoldPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pSelfMingGang : cc.Prefab = null ;
    pSelfMingGangPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pSelfOut : cc.Prefab = null ;
    pSelfOutPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pSelfPeng : cc.Prefab = null ;
    pSelfPengPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pUpHold : cc.Prefab = null ;
    pUpHoldPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pUpAnGang : cc.Prefab = null ;
    pUpAnGangPool : cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    pUpMingGang : cc.Prefab = null ;
    pUpMingGangPool : cc.NodePool = new cc.NodePool();

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let nPosIdx = 2 ;
        // test 
        let cardNum = Card.makeCardNum(4,1) ;
        let pnode = this.createCard(cardNum,nPosIdx,eCardSate.eCard_AnGang) ;
        pnode.position = cc.v2(-326,260);
        this.node.addChild(pnode);

        pnode = this.createCard(cardNum,nPosIdx,eCardSate.eCard_MingGang) ;
        pnode.position = cc.v2(-351,-51);
        this.node.addChild(pnode);

        pnode = this.createCard(cardNum,nPosIdx,eCardSate.eCard_Hold) ;
        pnode.position = cc.v2(192,188);
        this.node.addChild(pnode);

        pnode = this.createCard(cardNum,nPosIdx,eCardSate.eCard_Peng) ;
        pnode.position = cc.v2(192,-43);
        this.node.addChild(pnode);

        pnode = this.createCard(cardNum,nPosIdx,eCardSate.eCard_Out) ;
        pnode.position = cc.v2(68,-315);
        this.node.addChild(pnode);
        // test 

    }

    createCard( cardNum : number , posIdx : number , cardType : eCardSate , nArrowDirection? : eArrowDirect ) : cc.Node
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
            {
                if ( isLeft || isRight )  
                {
                    pCardNode = this.pLeftAnGangPool.get() || cc.instantiate(this.pLeftAnGang);
                    pPool = this.pLeftAnGangPool ;
                    break ;
                }

                if ( isSelf )
                {
                    pCardNode = this.pSelfAnGangPool.get() || cc.instantiate(this.pSelfAnGang);
                    pPool = this.pSelfAnGangPool ;
                    break ;
                }

                // up 
                pCardNode = this.pUpAnGangPool.get() || cc.instantiate(this.pUpAnGang);
                pPool = this.pUpAnGangPool ;
            }
            break ;
            case eCardSate.eCard_Eat:
            {
                if ( isLeft || isRight )  
                {
                    pCardNode = this.pLeftEatPool.get() || cc.instantiate(this.pLeftEat);
                    pPool = this.pLeftEatPool ;
                    break ;
                }
                pCardNode = this.pSelfEatPool.get() || cc.instantiate(this.pSelfEat);
                pPool = this.pSelfEatPool ;
            }
            break ;
            case eCardSate.eCard_Hold:
            {
                if ( isLeft )
                {
                    pCardNode = this.pLeftHoldPool.get() || cc.instantiate(this.pLeftHold);
                    pPool = this.pLeftHoldPool ;
                    break ;
                }

                if ( isRight )
                {
                    pCardNode = this.pRightHoldPool.get() || cc.instantiate(this.pRightHold);
                    pPool = this.pRightHoldPool ;
                    break ;
                }

                if ( isSelf )
                {
                    pCardNode = this.pSelfHoldPool.get() || cc.instantiate(this.pSelfHold);
                    pPool = this.pSelfHoldPool ;
                    break ;
                }

                if ( isUp )
                {
                    pCardNode = this.pUpHoldPool.get() || cc.instantiate(this.pUpHold);
                    pPool = this.pUpHoldPool ;
                    break ;
                }
            }
            break;
            case eCardSate.eCard_Out:
            case eCardSate.eCard_Hu:
            {
                if ( isLeft || isRight )  
                {
                    pCardNode = this.pLeftOutPool.get() || cc.instantiate(this.pLeftOut);
                    pPool = this.pLeftOutPool ;
                    break ;
                }
                pCardNode = this.pSelfOutPool.get() || cc.instantiate(this.pSelfOut);
                pPool = this.pSelfOutPool ;
            }
            break;
            case eCardSate.eCard_MingGang:
            {
                if ( isLeft || isRight )  
                {
                    pCardNode = this.pLeftMingGangPool.get() || cc.instantiate(this.pLeftMingGang);
                    pPool = this.pLeftMingGangPool ;
                    break ;
                }

                if ( isSelf )
                {
                    pCardNode = this.pSelfMingGangPool.get() || cc.instantiate(this.pSelfMingGang);
                    pPool = this.pSelfMingGangPool ;
                    break ;
                }

                // up 
                pCardNode = this.pUpMingGangPool.get() || cc.instantiate(this.pUpMingGang);
                pPool = this.pUpMingGangPool ;

            }
            break ;
            case eCardSate.eCard_Peng:
            {
                if ( isLeft || isRight )  
                {
                    pCardNode = this.pLeftPengPool.get() || cc.instantiate(this.pLeftPeng);
                    pPool = this.pLeftPengPool ;
                    break ;
                }
                pCardNode = this.pSelfPengPool.get() || cc.instantiate(this.pSelfPeng);
                pPool = this.pSelfPengPool ;
            }
            break ;
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
        pCard.pRecyclePool = null ;
        pool.put(pNode);
    }

    onDestroy()
    {
        this.pLeftAnGangPool.clear();
        this.pLeftEatPool.clear();
        this.pLeftHoldPool.clear();
        this.pLeftMingGangPool.clear();
        this.pLeftOutPool.clear();
        this.pLeftPengPool.clear();
        this.pRightHoldPool.clear();

        this.pSelfAnGangPool.clear();
        this.pSelfEatPool.clear();
        this.pSelfHoldPool.clear();
        this.pSelfMingGangPool.clear();
        this.pSelfOutPool.clear();
        this.pSelfPengPool.clear();
        this.pUpHoldPool.clear();

    }

    loadNewCardAtals( idx : number )
    {
        let vAtas : string[] = [ "" ] ;
        let self = this ;
        cc.loader.loadRes(vAtas[idx], cc.SpriteAtlas, function (err, atlas) {
            if ( err )
            {
                cc.error( "load new mj error idx = " + idx + " error = " + err  );
                return ;
            }
            self.pCurCardAtlas = atlas ;

            let pEvent = new cc.Event.EventCustom(RoomEvent.Event_changeMJ,true) ;
            cc.systemEvent.dispatchEvent(pEvent) ;
        });
    }
    // update (dt) {}
}
