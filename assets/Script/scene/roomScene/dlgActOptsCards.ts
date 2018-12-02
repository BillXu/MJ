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
import CardFactory from "./cardFactory"
import { eCardSate, eMJCardType } from "./roomDefine"
import Card from "./card";
import { eEatType , eMJActType } from "./roomDefine"
@ccclass
export default class DlgActOptsCards extends cc.Component {

    @property(cc.Node)
    pOptContainer : cc.Node = null;

    @property([cc.Node])
    vOptsBtn : cc.Node[] = [] ;

    @property([cc.Node])
    vMask: cc.Node[] = [];

    @property(cc.Node)
    pBtnPass : cc.Node = null ;
    // LIFE-CYCLE CALLBACKS:

    @property(CardFactory)
    pCardFactory : CardFactory = null ;

    vAllCards : cc.Node[] = [] ;
    
    @property(cc.Node)
    pRootNode : cc.Node = null ;

    vEatType : eEatType[] = [] ;
    nEatTargetCard : number = 0 ;

    vGangOpts : number[] = [] ;

    isEatState : boolean = false ;

    @property([cc.Component.EventHandler])
    vResultEvenHandle : cc.Component.EventHandler[] = [] ;
    onLoad ()
    {
        if ( this.pRootNode == null )
        {
            this.pRootNode = this.node ;
        }

        this.vMask.forEach( (node : cc.Node )=>{ node.active = false ; node.zIndex = 1 ;}  ) ;
        this.pRootNode.active = false ;
    }

    start () {
        this.clear();
    }

    showDlgOptsForGang( vGangNum : number[]  )
    {
        this.isEatState = false ;
        this.vGangOpts.length = 0 ;
        this.vGangOpts = this.vGangOpts.concat(vGangNum);
        let self = this; 
        this.vGangOpts.forEach( ( gangValue : number, index : number)=>{
            let pBtn = self.vOptsBtn[index] ;
            pBtn.active = true ;

            let vCardNum : number[] = [gangValue,gangValue,gangValue,gangValue] ;
           
            vCardNum.forEach( ( num : number, idx : number )=>{
                let pCard = self.pCardFactory.createCard(num, 0,eCardSate.eCard_Hold) ;
                pCard.scale = 1 ;
                let nWidth = pCard.getBoundingBox().width ;
                let posX = nWidth * 0.5 + idx * nWidth;
                pBtn.addChild(pCard);
                self.vAllCards.push(pCard);
                pCard.position = cc.v2(posX,0);
            });

            let size = self.vAllCards[self.vAllCards.length-1].getBoundingBox().size;
            pBtn.setContentSize( cc.size(size.width * 4 , size.height ) );

        } ) ;

        this.pOptContainer.setContentSize(cc.size(this.pOptContainer.getContentSize().width,this.vAllCards[this.vAllCards.length -1 ].getBoundingBox().height + 20 ));
        setTimeout(() => {
            let elaps = 66 ;
            self.pBtnPass.position = cc.v2( self.pOptContainer.position.x + 0.5 * self.pOptContainer.getContentSize().width + self.pBtnPass.getContentSize().width * 0.5 +  elaps ,self.pBtnPass.position.y );
        }, 1);
    }

    showDlgOptsForEat( nTargetCard : number , vEatType : eEatType[] )
    {
        this.isEatState = true ;
        this.nEatTargetCard = nTargetCard ;
        this.vEatType.length = 0 ;
        this.vEatType = this.vEatType.concat(vEatType);

        let self = this; 
        this.vEatType.forEach( ( type : eEatType, index : number)=>{
            let pBtn = self.vOptsBtn[index] ;
            let pMsk = self.vMask[index] ;
            pBtn.active = true ;
            pMsk.active = true ;

            let vCardNum : number[] = null ;
            let nMskCardIdx : number = 0 ;
            if ( eEatType.eEat_Left == type )
            {
                vCardNum = [self.nEatTargetCard , self.nEatTargetCard + 1, self.nEatTargetCard + 2  ] ;
                nMskCardIdx = 0 ;
            }

            if ( eEatType.eEat_Middle == type )
            {
                vCardNum = [self.nEatTargetCard -1 , self.nEatTargetCard, self.nEatTargetCard + 1  ] ;
                nMskCardIdx = 1 ;
            }

            if ( eEatType.eEat_Righ == type )
            {
                vCardNum = [self.nEatTargetCard -2 , self.nEatTargetCard - 1, self.nEatTargetCard] ;
                nMskCardIdx = 2 ;
            }

            vCardNum.forEach( ( num : number, idx : number )=>{
                let pCard = self.pCardFactory.createCard(num, 0,eCardSate.eCard_Hold) ;
                let nWidth = pCard.getBoundingBox().width ;
                let posX = nWidth * 0.5 + idx * nWidth;
                pBtn.addChild(pCard);
                self.vAllCards.push(pCard);
                pCard.position = cc.v2(posX,0);

                if ( idx == nMskCardIdx )
                {
                    pMsk.setContentSize(pCard.getBoundingBox());
                    pMsk.position = pCard.position ;
                }
            });

            let size = self.vAllCards[self.vAllCards.length-1].getBoundingBox().size;
            pBtn.setContentSize( cc.size(size.width * 3 , size.height) );

        } ) ;

        this.pOptContainer.setContentSize(cc.size(this.pOptContainer.getContentSize().width,this.vAllCards[this.vAllCards.length -1 ].getBoundingBox().height + 20 ));
    
        setTimeout(() => {
            let elaps = 66 ;
            self.pBtnPass.position = cc.v2( self.pOptContainer.position.x + 0.5 * self.pOptContainer.getContentSize().width + self.pBtnPass.getContentSize().width * 0.5 +  elaps ,self.pBtnPass.position.y );
        }, 1);
        
    }

    closeDlg()
    {
        this.clear();
        this.pRootNode.active = false ;
    }

    private clear()
    {
        let self = this ;
        this.vAllCards.forEach( ( node : cc.Node)=>{ self.pCardFactory.recycleNode(node); } );
        this.vAllCards.length = 0 ;

        this.vMask.forEach( (node : cc.Node )=>{ node.active = false ;} ) ;
        this.vOptsBtn.forEach( (node : cc.Node )=>{ node.active = false ;} ) ;

        this.vEatType.length = 0 ;
        this.vGangOpts.length = 0 ;
    }

    onClickPass()
    {
        cc.Component.EventHandler.emitEvents(this.vResultEvenHandle,this,null) ;
        this.closeDlg();
    }

    onClickOpts( evnt : cc.Button, groupIdx : string )
    {
        let selIdx : number = parseInt(groupIdx);
        //vResultEvenHandle
        cc.Component.EventHandler.emitEvents(this.vResultEvenHandle,this,selIdx ) ;
        this.closeDlg();
    }

    // update (dt) {}
}
