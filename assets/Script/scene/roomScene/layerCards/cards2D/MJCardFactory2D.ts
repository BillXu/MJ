import MJCard2D from "./MJCard2D";
import { eCardSate, eMJCardType } from "../../roomDefine";
import ClientApp from "../../../../globalModule/ClientApp";
import { clientEvent } from "../../../../common/clientDefine";

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
export default class MJCardFactory2D extends cc.Component {

    mMJCahers : { [ key : number ] : MJCard2D[] } = {} ;
    mSpriteAtals : cc.SpriteAtlas = null ;
    // LIFE-CYCLE CALLBACKS:

    static EVENT_FINISH_LOAD_MJ : string = "EVENT_FINISH_LOAD_MJ" ;
    static EVENT_FINISH_REFRESH_MJ : string =  "EVENT_FINISH_REFRESH_MJ" ;
    misInitLoadMJ : boolean = false ;
    onLoad ()
    { 
        this.misInitLoadMJ = true ;
        let idx = 0 ;
        if ( CC_JSB )
        {
            idx = ClientApp.getInstance().getConfigMgr().getSettingConfig().mjBgIdx ;
        }
        this.loadMJAtals(idx);
        cc.systemEvent.on( clientEvent.setting_update_mjBg,this.onRefreshMJ,this ) ; 
    }

    onDestroy()
    {
        cc.systemEvent.targetOff( this );
    }

    start () {
        //this.test();
        
    }

    protected onRefreshMJ()
    {
        this.misInitLoadMJ = false ;
        let idx = ClientApp.getInstance().getConfigMgr().getSettingConfig().mjBgIdx ;
        this.loadMJAtals(idx);
    }

    getCard( cardNum : number , posIdx : number , cardState : eCardSate ) : MJCard2D
    {
        let cacherID = this.generateCacherID( cardNum,posIdx,cardState );
        if ( this.mMJCahers[cacherID] != null && this.mMJCahers[cacherID].length > 0 )
        {
            let card = this.mMJCahers[cacherID].pop();
            cc.log( "reuse card = " + cardNum );
            return card ;
        }

        return this.createCard( cardNum, posIdx, cardState ) ;
    }

    recycleCard( card : MJCard2D )
    {
        let cacherID = this.generateCacherID(card.mCardNum,card.mPosIdx,card.mCardState ) ;
        if ( this.mMJCahers[cacherID] == null )
        {
            this.mMJCahers[cacherID] = [] ;
        }
        card.node.removeFromParent();
        card.switchHighLight(false);

        if ( card.mAtalsResName != this.mSpriteAtals.name )
        {
            card.mCardSprite.spriteFrame = this.mSpriteAtals.getSpriteFrame( this.getMJResName( card.mCardNum,card.mPosIdx, card.mCardState ) ) ;
            card.mAtalsResName = this.mSpriteAtals.name ;
        } 

        this.mMJCahers[cacherID].push(card);
    }

    protected createCard( cardNum : number , posIdx : number , cardState : eCardSate ) : MJCard2D
    {
        if ( this.mSpriteAtals == null )
        {
            cc.error( "mj sprite atlas is null can not create mj" );
            return null;
        }

        let node = new cc.Node();
        let card2d = node.addComponent(MJCard2D);
        let sp = node.addComponent(cc.Sprite);
        card2d.initCard(sp,posIdx,cardState,cardNum) ;
        sp.spriteFrame = this.mSpriteAtals.getSpriteFrame( this.getMJResName( cardNum,posIdx, cardState ) );
        card2d.mAtalsResName = this.mSpriteAtals.name ;
        node.setContentSize( sp.spriteFrame.getOriginalSize() ) ;

        cc.log( "create card = " + cardNum );
        return card2d ;
    }

    protected generateCacherID( cardNum : number , posIdx : number , cardState : eCardSate ) : number
    {
        return (cardNum << 16 | posIdx << 8 | cardState );
    }

    protected getMJResName( cardNum : number , posIdx : number , cardState : eCardSate ) : string
    {
        let strType = ["","W","B","T","F","J","H"] ;
        switch ( cardState )
        {
            case eCardSate.eCard_Hold:
            {
                if ( posIdx == 1 ) return "RightHold" ;
                if ( 2 == posIdx ) return "UpHold" ;
                if ( 3 == posIdx ) return "LeftHold" ;
                let type = this.parseCardType(cardNum);
                let value = this.parseCardValue( cardNum );
                if ( type >= strType.length )
                {
                    cc.error( "invalid type " + type + "for card num " + cardNum  );
                    return "" ;
                }
                return "MyHold_" + strType[type] + ""+value;
            }
            case eCardSate.eCard_Out:
            {
                let type = this.parseCardType(cardNum);
                let value = this.parseCardValue( cardNum );
                if ( type >= strType.length )
                {
                    cc.error( "invalid type " + type + "for card num " + cardNum  );
                    return "" ;
                }
                let vPos = [ "MyOut","R","UpOut","L" ] ;
                return vPos[posIdx] + "_" + strType[type] + "" + value ;
            }
            case eCardSate.eCard_Back:
            {
                let vBack = ["MyBack","RightBack","UpBack","LeftBack"] ;
                return vBack[posIdx] ;
            }
        }
    }

    protected parseCardValue( nCardNumer : number ) : number
    {
        return  (nCardNumer & 0xF) ;
    }

    protected parseCardType( nCardNum : number ) : eMJCardType  
    {
        let nType : number = nCardNum & 0xF0 ;
        nType = nType >> 4 ;
        if ( (nType < eMJCardType.eCT_Max && nType > eMJCardType.eCT_None) == false )
        {
            cc.error("parse card type error , cardnum = " + nCardNum) ;
        }

        return nType ;
    }

    protected loadMJAtals( idx : number )
    {
        let vMJRes = [ "blueCard","goldCard","greenCard","pinkCard" ] ;
        if ( idx >= vMJRes.length )
        {
            cc.error( "invalid mj atals idx = " + idx + " max lenght = " + vMJRes.length );
            idx = 0 ;
        }

        let self = this ;
        let resName = "MJCards2D/" + vMJRes[idx] ;
        cc.loader.loadRes( resName , cc.SpriteAtlas, function (err, atlas) {
            if ( err )
            {
                cc.error( "load new mj error idx = " + resName + " error = " + err  );
                return ;
            }

            self.mSpriteAtals = atlas ;
            self.onFinishLoadMJAtlas();
        });
    }

    protected onFinishLoadMJAtlas()
    {
        let v = Object.keys( this.mMJCahers );
        for ( let k of v )
        {
            let vArr = this.mMJCahers[k];
            if ( vArr.lenght == 0 )
            {
                continue ;
            }

            for ( let card of vArr )
            {
                if ( card.mAtalsResName != this.mSpriteAtals.name )
                {
                    card.mCardSprite.spriteFrame = this.mSpriteAtals.getSpriteFrame( this.getMJResName( card.mCardNum,card.mPosIdx, card.mCardState ) ) ;
                    card.mAtalsResName = this.mSpriteAtals.name ;
                } 
            }
        }

        let pEvent = new cc.Event.EventCustom( this.misInitLoadMJ ? MJCardFactory2D.EVENT_FINISH_LOAD_MJ : MJCardFactory2D.EVENT_FINISH_REFRESH_MJ,true) ;
        cc.systemEvent.dispatchEvent(pEvent) ;
    }


    ////-----------------------
    mjidxTest = 0 ; 
    test()
    {
        let pos = 0 ;
        let state = eCardSate.eCard_Hold ;
        let cardNum = 24 ;

        let self = this ;
        cc.systemEvent.on( "click", ()=>{ 
            if ( this.mSpriteAtals == null )
            {
                cc.error( "sprite atlas is null" );
                return ;
            }
            let card = self.getCard(cardNum,pos,state );
            self.node.addChild(card.node);
            card.node.position = cc.v2( self.node.childrenCount * card.node.getContentSize().width , 0 );
        } )

        cc.systemEvent.on( "click3", ()=>{ 
            if ( self.node.childrenCount <= 0 )
            {
                cc.error( "cnt is zero child " );
                return ;
            }

            let card = self.node.children[0].getComponent(MJCard2D);
            self.recycleCard(card);
        } )


        cc.systemEvent.on( "click2", ()=>{ 
            self.loadMJAtals((this.mjidxTest++)%4);    
        } )

        cc.systemEvent.on( MJCardFactory2D.EVENT_FINISH_LOAD_MJ,()=>{
            let cnt = self.node.childrenCount ;
            let c = self.node.children;
            while ( c.length > 0 )
            {
                self.recycleCard( self.node.children[0].getComponent(MJCard2D) );
            }

            while ( cnt-- )
            {
                let card = self.getCard(cardNum,pos,state );
                self.node.addChild(card.node);
                card.node.position = cc.v2( self.node.childrenCount * card.node.getContentSize().width , 0 );
            }
        } );
    }
    // update (dt) {}
}
