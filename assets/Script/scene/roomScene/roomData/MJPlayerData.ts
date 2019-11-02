import MJPlayerBaseData from "./MJPlayerBaseData";
import { IPlayerCards, PlayerActedCard } from "./MJPlayerCardData";
import { IRoomPlayerData } from "../IRoomSceneData";
import { IPlayerCardData } from "../layerCards/ILayerCardsData";
import MJRoomData from "./MJRoomData";
import { eMJActType } from "../roomDefine";

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
export default class MJPlayerData implements IRoomPlayerData, IPlayerCardData
{
    mPlayerBaseData : MJPlayerBaseData = null ;
    mPlayerCard : IPlayerCards = null ;
    mRoomData : MJRoomData = null ;
    parsePlayer( jsPlayer : Object , roomData : MJRoomData )
    {
        this.mRoomData = roomData ;
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

    onEndGame() : void
    {
        this.mPlayerCard.clear();
    }

    //  interface IRoomPlayerData
    get isOnline() : boolean
    {
        return this.mPlayerBaseData.isOnline ; 
    } 

    get uid () : number
    {
        return this.mPlayerBaseData.uid ;
    }

    get isReady() : boolean 
    {
        return this.mPlayerBaseData.isReady ;
    }

    set isReady( isr : boolean )
    {
        this.mPlayerBaseData.isReady = isr ;
    }

    get svrIdx () : number 
    {
        return this.mPlayerBaseData.svrIdx ;
    }

    set svrIdx( idx : number ) 
    {
        this.mPlayerBaseData.svrIdx = idx ;
    } 

    get chip () : number 
    {
        return this.mPlayerBaseData.chip ;
    }

    set chip( idx : number ) 
    {
        this.mPlayerBaseData.svrIdx = this.chip ;
    } 

    isEmpty() : boolean 
    {
        return null == this.mPlayerBaseData || this.mPlayerBaseData.uid == -1 ;
    }

    // interface  IPlayerCardData   
    getHolds() : number[] 
    {
        if ( this.isEmpty() )
        {
            return [] ;
        }
        return this.mPlayerCard.vHoldCard ;
    }

    getChus() : number[] 
    {
        if ( this.isEmpty() )
        {
            return [] ;
        }
        return this.mPlayerCard.vChuCards ;
    }

    getMings() : PlayerActedCard[] 
    {
        if ( this.isEmpty() )
        {
            return [] ;
        }
        return this.mPlayerCard.vMingCards ;
    }

    reqChu( card : number ) : boolean 
    {
        if ( this.getHolds().length % 3 != 2 )
        {
            return false ;
        }
        this.mRoomData.reqAct(eMJActType.eMJAct_Chu,card) ;
        return true ;
    }
}
