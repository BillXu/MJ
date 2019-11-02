import MJCard, { MJCardState } from "./MJCard";
import { eMJCardType } from "../../roomDefine";

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
export default class MJFactory extends cc.Component {

    private mPrefabs : { [ key : number] : cc.Prefab } = {} ;
    private mReserveMJ : { [key : number] : Array<MJCard> } = {} ;
    static EVENT_FINISH_LOAD_CARD : string = "EVENT_FINISH_LOAD_CARD" ; 
    // LIFE-CYCLE CALLBACKS:
    @property()
    containHua : boolean = false ;
    
    @property()
    containFeng : boolean = false ;
    @property()
    containJian : boolean = false ;
    
    mWillLoadMJPrefabCnt : number = 3*9 ;
    onLoad ()
    {
        if ( this.containFeng )
        {
            this.mWillLoadMJPrefabCnt += 4;
        }
        
        if ( this.containHua )
        {
            this.mWillLoadMJPrefabCnt += 8;
        }

        if ( this.containJian )
        {
            this.mWillLoadMJPrefabCnt += 3;
        }

        this.loadMJPrefabs();
        cc.log( "loadMJPrefabs" );
    }

    start () {

    }

    protected loadMJPrefabs()
    {
        if ( Object.keys( this.mPrefabs).length > 0  )
        {
            cc.warn( "already have prefab , do not load again" );
            return ;
        }
        this.doLoadMJPrefab("wan",eMJCardType.eCT_Wan,9);
        this.doLoadMJPrefab("tong",eMJCardType.eCT_Tong,9);
        this.doLoadMJPrefab("tiao",eMJCardType.eCT_Tiao,9);
        
        if ( this.containFeng )
        {
            this.doLoadMJPrefab("feng",eMJCardType.eCT_Feng,4);
        }
        
        if ( this.containHua )
        {
            this.doLoadMJPrefab("hua",eMJCardType.eCT_Hua,8);
        }

        if ( this.containJian )
        {
            this.doLoadMJPrefab("jian",eMJCardType.eCT_Jian,3);
        }
    }

    private doLoadMJPrefab( typeResName : string ,type : eMJCardType, cnt : number ) 
    {
        let self = this ;
        for ( let v = 1 ; v <= cnt ; ++v )
        {
            let num = MJCard.makeCardNum(type,v) ;
            if ( self.mPrefabs[num] != null )
            {
                cc.warn( "already load mj type " + type + " value = " + v );
                continue ;
            }

            cc.loader.loadRes("MJPrefab/mj/" + typeResName + "_" + v, function (err, prefab) {
                if ( err != null )
                {
                    cc.error( "load mj prefab: MJPrefab/mj/" + typeResName + "_" + v + " failed, result :" + err.message );
                    return ;
                }
                self.mPrefabs[num] = prefab ;
                if ( --self.mWillLoadMJPrefabCnt <= 0 )
                {
                    let ev = new cc.Event.EventCustom(MJFactory.EVENT_FINISH_LOAD_CARD,false);
                    cc.systemEvent.dispatchEvent(ev) ;
                } 
            });
        }
    }

    recycleMJ( mj : MJCard )
    {
        let num = mj.cardNum ;
        let vCards : Array<MJCard> = this.mReserveMJ[num] ;
        if ( this.mReserveMJ[num] == null )
        {
            vCards = new Array<MJCard>();
            this.mReserveMJ[num] = vCards ;
        }

        vCards.push(mj) ;
        mj.isSelf = false ;
        mj.node.removeFromParent(true);
    }

    getWallCard( state : MJCardState, nodeParent : cc.Node ) : MJCard
    {
        return this.getMJ( 0 ,state, nodeParent );
    }

    getMJ( cardNum : number , state : MJCardState, nodeParent : cc.Node ) : MJCard
    {
        if ( 0 == cardNum )
        {
            cardNum = MJCard.makeCardNum(eMJCardType.eCT_Tong,1);
        }

        let mj : MJCard = null ;
        if ( this.mReserveMJ[cardNum] != null && this.mReserveMJ[cardNum].length > 0 )
        {
            mj = this.mReserveMJ[cardNum].shift();
        }
        else
        {
            let prefab = this.mPrefabs[cardNum] ;
            if ( prefab == null )
            {
                cc.error( "can not create mj num = " + cardNum + " prefab is null" );
                return null ;
            }
            let node = cc.instantiate(prefab);
            mj = node.addComponent(MJCard);
            mj.isSelf = false ;
        }
        nodeParent.addChild(mj.node);
        mj.curState = state ;
        mj.cardNum = cardNum ;
        return mj ;
    }
}
