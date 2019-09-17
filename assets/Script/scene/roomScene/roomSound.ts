import { eMJActType, eMJCardType } from "./roomDefine";
import MJCard from "./layerCards/cards3D/MJCard";

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

@ccclass
export default class RoomSound extends cc.Component {
    // @property(cc.AudioSource)
    // vMaleWanCardSound : cc.AudioSource[] = [] ;

    // @property(cc.AudioSource)
    // vMaleTongCardSound : cc.AudioSource[] = [] ;

    // @property(cc.AudioSource)
    // vMaleTiaoCardSound : cc.AudioSource[] = [] ;

    // @property(cc.AudioSource)
    // vMaleFengCardSound : cc.AudioSource[] = [] ;

    // @property(cc.AudioSource)
    // vMaleJianCardSound : cc.AudioSource[] = [] ;

    // @property(cc.AudioSource)
    // pMaleEat : cc.AudioSource = null ;

    // @property(cc.AudioSource)
    // pMalePeng : cc.AudioSource = null ;

    // @property(cc.AudioSource)
    // pMaleGang : cc.AudioSource = null ;

    // @property(cc.AudioSource)
    // pMaleAnGang : cc.AudioSource = null ;

    // @property(cc.AudioSource)
    // pMaleHu : cc.AudioSource = null ;

    ///-----------female sound
    // @property(cc.AudioSource)
    // vFemaleWanCardSound : cc.AudioSource[] = [] ;

    // @property(cc.AudioSource)
    // vFemaleTongCardSound : cc.AudioSource[] = [] ;

    // @property(cc.AudioSource)
    // vFemaleTiaoCardSound : cc.AudioSource[] = [] ;

    // @property(cc.AudioSource)
    // vFemaleFengCardSound : cc.AudioSource[] = [] ;

    // @property(cc.AudioSource)
    // vFemaleJianCardSound : cc.AudioSource[] = [] ;

    // @property(cc.AudioSource)
    // pFemaleEat : cc.AudioSource = null ;

    // @property(cc.AudioSource)
    // pFemalePeng : cc.AudioSource = null ;

    // @property(cc.AudioSource)
    // pFemaleGang : cc.AudioSource = null ;

    // @property(cc.AudioSource)
    // pFemaleAnGang : cc.AudioSource = null ;

    // @property(cc.AudioSource)
    // pFemaleHu : cc.AudioSource = null ;
    // // LIFE-CYCLE CALLBACKS:

    // @property(cc.AudioSource)
    // cardChuToDesk : cc.AudioSource = null ;

    //------
    vMaleCardAudioID : cc.AudioClip[] = [] ;
    vFemalCardAudioID : cc.AudioClip[] = [] ;

    vActAudioID : cc.AudioClip[] = [] ;

    vGameTalk : cc.AudioClip[] = [] ;
    // onLoad () {}

    start () {

    }

    // playerCardSound( isMale : boolean , cardNum : number )
    // {
    //     let type : eMJCardType = Card.parseCardType(cardNum);
    //     let value : number = Card.parseCardValue(cardNum); 
    //     let sound : cc.AudioSource = null ;
    //     if ( isMale ) // male 
    //     {
    //         let vCards = [] ;
    //         vCards[eMJCardType.eCT_Wan] = this.vMaleWanCardSound;
    //         vCards[eMJCardType.eCT_Tong] = this.vMaleTongCardSound;
    //         vCards[eMJCardType.eCT_Tiao] = this.vMaleTiaoCardSound;
    //         vCards[eMJCardType.eCT_Feng] = this.vMaleFengCardSound;
    //         vCards[eMJCardType.eCT_Jian] = this.vMaleJianCardSound;
    //         let idx = value ;
    //         if ( idx > 0 ){ idx -= 1 ;}
    //         sound = vCards[type][idx];
    //     } 
    //     else
    //     {
    //         let vCards = [] ;
    //         vCards[eMJCardType.eCT_Wan] = this.vFemaleWanCardSound;
    //         vCards[eMJCardType.eCT_Tong] = this.vFemaleTongCardSound;
    //         vCards[eMJCardType.eCT_Tiao] = this.vFemaleTiaoCardSound;
    //         vCards[eMJCardType.eCT_Feng] = this.vFemaleFengCardSound;
    //         vCards[eMJCardType.eCT_Jian] = this.vFemaleJianCardSound;
    //         let idx = value ;
    //         if ( idx > 0 ){ idx -= 1 ;}
    //         sound = vCards[type][idx];
    //     }

    //     if ( sound )
    //     {
    //         sound.play();
    //     }
    //     else
    //     {
    //         console.error( "why card sound is null card = " + cardNum );
    //     }
    // }

    playerCardSound( isMale : boolean , cardNum : number )
    {
        let vCacher = isMale ? this.vMaleCardAudioID : this.vFemalCardAudioID ;
        if ( vCacher[cardNum] != null )
        {
            cc.audioEngine.playEffect(vCacher[cardNum],false);
            console.log( "reuse audio clip" );
            return ;
        }

        let type : eMJCardType = MJCard.parseCardType(cardNum);
        let value : number = MJCard.parseCardValue(cardNum); 

        let vType = [ "","wan","tong","tiao","feng","zi"] ;
        let url = "sound/"+ (isMale ? "man" : "female") + "/" + value + vType[type];

        let self = this ;
        cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
            if ( err )
            {
                console.error( "load card audio error type = " + type + " value = " + value + " url = " + url );
                return ;
            }
            cc.audioEngine.playEffect(clip, false);
            let vCacher = isMale ? self.vMaleCardAudioID : self.vFemalCardAudioID ;
            vCacher[cardNum] = clip;
        });
    }

    playerActSound( isMale : boolean, act : eMJActType )
    {
        let url = "sound/"+ (isMale ? "man" : "female") + "/" ;
        let rNum = Math.random() * 10 ;
        rNum = Math.ceil(rNum) ;
        switch ( act )
        {
            case eMJActType.eMJAct_Chu:
            {
                url = "sound/OUT_CARD" ;
                console.warn( "player sound chu" );
            }
            break;
            case eMJActType.eMJAct_Chi:
            {
                 rNum = 1 + rNum % 2 ;
                 url += "chi" + rNum ;
            }
            break ;
            case eMJActType.eMJAct_Peng:
            {
                rNum = 1 + rNum % 4 ;
                url += "cha" + rNum ;
            }
            break ;
            case eMJActType.eMJAct_Hu:
            {
                rNum = 1 + rNum % 3 ;
                url += "hu" + rNum ;
            }
            break ;
            case eMJActType.eMJAct_AnGang:
            case eMJActType.eMJAct_BuGang:
            case eMJActType.eMJAct_BuGang_Pre:
            case eMJActType.eMJAct_BuGang_Declare:
            case eMJActType.eMJAct_MingGang:
            {
                rNum = 1 + rNum % 4 ;
                url += "gang" + rNum ;
            }
            break ;
            default:
            console.error( "unknown act , no sound  act = " + act );
            return;
        }

        if ( this.vActAudioID[url] )
        {
            cc.audioEngine.playEffect(this.vActAudioID[url], false);
            console.log( "play audio = " + url );
            return ;
        }

        let self = this ;
        cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
            if ( err )
            {
                console.error( "load act audio error type = " + act  + " url = " + url );
                return ;
            }
            cc.audioEngine.playEffect(clip, false);
            self.vActAudioID[url] = clip;
        });
    }

    playGameTalk( isMale : boolean ,idx : number )
    {
        let url = "sound/"+ (isMale ? "man" : "female") + "/game_talk_"+idx ;
        if ( this.vGameTalk[url] )
        {
            cc.audioEngine.playEffect(this.vGameTalk[url], false);
            return ;
        }

        let self = this ;
        cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
            if ( err )
            {
                console.error( "load act audio error game talk = " + idx  + " url = " + url );
                return ;
            }
            cc.audioEngine.playEffect(clip, false);
            self.vGameTalk[url] = clip;
        });
    }

    // playerActSound( isMale : boolean, act : eMJActType )
    // {
    //     switch ( act )
    //     {
    //         case eMJActType.eMJAct_Chu:
    //         {
    //             this.cardChuToDesk.play();
    //         }
    //         return;
    //         case eMJActType.eMJAct_Chi:
    //         {
    //             ( isMale ? this.pMaleEat : this.pFemaleEat ).play();
    //         }
    //         return ;
    //         case eMJActType.eMJAct_Peng:
    //         {
    //             ( isMale ? this.pMalePeng : this.pFemalePeng ).play() ;
    //         }
    //         return ;
    //         case eMJActType.eMJAct_Hu:
    //         {
    //             ( isMale ? this.pMaleHu : this.pFemaleHu ).play();
    //         }
    //         return ;
    //         case eMJActType.eMJAct_AnGang:
    //         {
    //             (isMale ? this.pMaleAnGang : this.pFemaleAnGang ).play();
    //         }
    //         return;
    //         case eMJActType.eMJAct_BuGang:
    //         case eMJActType.eMJAct_BuGang_Pre:
    //         case eMJActType.eMJAct_BuGang_Declare:
    //         case eMJActType.eMJAct_MingGang:
    //         {
    //             ( isMale ? this.pMaleGang : this.pFemaleGang ).play();
    //         }
    //         return ;
    //     }
    //     console.error( "unknown act , no sound  act = " + act );
    // }

    // update (dt) {}
}
