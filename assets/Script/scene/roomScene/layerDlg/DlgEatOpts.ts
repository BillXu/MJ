import { eEatType, eMJCardType } from "../roomDefine";
import MJCard from "../layerCards/cards3D/MJCard";

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
export default class DlgEatOpts extends cc.Component {

    @property([cc.Node])
    mGroups: cc.Node[] = [];

    @property([cc.Sprite])
    mCards : cc.Sprite[] = [] ;

    mOnDlgResult : ( eatType : eEatType )=>void = null ;  // ( eatType : eEatType , nTargetCard : number )
    
    private mTargetCard : number = 0 ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onClickGroup( event : cc.Event.EventTouch , arg : string )
    {
        let node : cc.Node = event.currentTarget ;
        console.log( "click gruop node name = " + node.name );
        if ( this.mOnDlgResult != null )
        {
            this.mOnDlgResult( parseInt(node.name) );
        }
        this.node.active = false ;
    }

    showDlg( vEatOpts : eEatType[], nTargetCard : number, lpCallBack : ( eatType : eEatType )=>void )
    {
        this.mOnDlgResult = lpCallBack ;
        this.mTargetCard = nTargetCard ;
        this.node.active = true ;
        this.mGroups.forEach( ( n : cc.Node )=>{ n.active = false ;} ) ;

        for ( let idx = 0 ; idx < vEatOpts.length ; ++idx )
        {
            let group = this.mGroups[idx] ;
            group.active = true ;
            group.name = vEatOpts[idx] + "" ;
            let cardIdx = idx * 3 ;
            switch ( vEatOpts[idx] )
            {
                case eEatType.eEat_Left:
                {
                    DlgEatOpts.setCard(this.mCards[cardIdx],nTargetCard); 
                    ++cardIdx ;
                    DlgEatOpts.setCard(this.mCards[cardIdx],nTargetCard + 1 );
                    ++cardIdx ;
                    DlgEatOpts.setCard(this.mCards[cardIdx],nTargetCard + 2 );
                }
                break ;
                case eEatType.eEat_Middle:
                {
                    DlgEatOpts.setCard(this.mCards[cardIdx],nTargetCard - 1 ); 
                    ++cardIdx ;
                    DlgEatOpts.setCard(this.mCards[cardIdx],nTargetCard );
                    ++cardIdx ;
                    DlgEatOpts.setCard(this.mCards[cardIdx],nTargetCard + 1 );
                }
                break;
                case eEatType.eEat_Righ:
                {
                    DlgEatOpts.setCard(this.mCards[cardIdx],nTargetCard -2 ); 
                    ++cardIdx ;
                    DlgEatOpts.setCard(this.mCards[cardIdx],nTargetCard - 1 );
                    ++cardIdx ;
                    DlgEatOpts.setCard(this.mCards[cardIdx],nTargetCard );
                }
                break ;
            }
        }
    }

    static setCard( card : cc.Sprite , cardNum : number )
    {
        let type = MJCard.parseCardType(cardNum);
        var value = MJCard.parseCardValue(cardNum); 
        let startValue : number = 0 ;
        switch( type )
        {
            case eMJCardType.eCT_Wan:
            {
                startValue = 17 ;
            }
            break;
            case eMJCardType.eCT_Tong:
            {
                startValue = 33 ;
            }
            break;
            case eMJCardType.eCT_Tiao:
            {
                startValue = 49 ;
            }
            break;
            case eMJCardType.eCT_Feng:
            {
                startValue = 65 ;
            }
            break;
            case eMJCardType.eCT_Jian:
            {
                startValue = 81 ;
            }
            break;
            default:
            {
                cc.error("unknown card type = " + type);
            }
            return;
        }
        var url = "MJActOpts/"+(startValue + value - 1 ) ;

        cc.loader.loadRes( url ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error( "loading card error card = " + url + " error info = " + err.message );
                return ;
            }

            card.spriteFrame = spriteFrame ;
        });
    }
    // update (dt) {}
}
