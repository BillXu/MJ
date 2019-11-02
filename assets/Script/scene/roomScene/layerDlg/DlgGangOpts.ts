import DlgEatOpts from "./DlgEatOpts";

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
export default class DlgGangOpts extends cc.Component {

    @property([cc.Node])
    mOptsCardNodes: cc.Node[] = [];

    @property([cc.Sprite])
    mCardsSprite : cc.Sprite[] = [] ;

    mOnDlgResult : ( chosedCard : number )=>void = null ;  // ( chosedCard : number )
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    showDlg( gangCards : number[] , lpCallback : ( chosedCard : number )=>void  )
    {
        this.mOnDlgResult = lpCallback ;
        this.node.active = true ;
        this.mOptsCardNodes.forEach( ( c : cc.Node )=>{ c.active = false ;} );
        for ( let idx = 0 ; idx < gangCards.length ; ++idx )
        {
            this.mOptsCardNodes[idx].active = true ;
            this.mOptsCardNodes[idx].name = gangCards[idx] + "" ;
            DlgEatOpts.setCard( this.mCardsSprite[idx],gangCards[idx] );
        }
    }

    onClickCardBtn( event : cc.Event.EventTouch )
    {
        let node : cc.Node  = event.currentTarget ;
        if ( this.mOnDlgResult != null )
        {
            this.mOnDlgResult( parseInt(node.name) );
        }
        this.node.active = false ;
    }
    // update (dt) {}
}
