import MJPlayerBaseData from "./MJPlayerBaseData";
import { IPlayerCards } from "./MJPlayerCardData";

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
export default class MJPlayerData
{
    mPlayerBaseData : MJPlayerBaseData = null ;
    mPlayerCard : IPlayerCards = null ;

    parsePlayer( jsPlayer : Object )
    {
        if ( this.mPlayerBaseData == null )
        {
            this.mPlayerBaseData = new MJPlayerBaseData();
        }

        this.mPlayerBaseData.parseFromMsg( jsPlayer );

        if ( this.mPlayerCard == null )
        {
            this.mPlayerCard = new IPlayerCards();
        }
        
        if ( jsPlayer["holdCnt"] == null && jsPlayer["holdCards"] == null )
        {
            // no card info ;
            return ;
        }
        this.mPlayerCard.parseFromMsg( jsPlayer,this.mPlayerBaseData.svrIdx );
    }

    clear()
    {
        this.mPlayerBaseData.uid = -1 ;
        this.mPlayerCard.clear();
    }

    isEmpty() : boolean 
    {
        return null == this.mPlayerBaseData || this.mPlayerBaseData.uid == -1 ;
    }

    onEndGame() : void
    {
        this.mPlayerCard.clear();
    }
}
