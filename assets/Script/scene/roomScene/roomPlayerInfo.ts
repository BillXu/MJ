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
import PhotoItem  from "../../commonItem/photoItem"
import { playerBaseData } from "./roomInterface"
import { eClientRoomState } from "./roomDefine"
@ccclass
export default class RoomPlayerInfo extends cc.Component {

    @property(PhotoItem  )
    pHoto: PhotoItem = null;

    @property(cc.Node)
    pOfflineMask: cc.Node = null;

    @property(cc.Label)
    pName : cc.Label = null ;

    @property(cc.Label)
    pCoin : cc.Label = null ;

    @property(cc.Node)
    pVoiceNode : cc.Node = null ;
    @property(cc.Animation)
    pVoiceAnimation : cc.Animation = null ;

    @property(cc.Node)
    pTextMsgNode : cc.Node = null ;
    @property(cc.Label)
    pTextChatMsg : cc.Label = null ;
    @property(cc.Node)
    pTextChatMsgBg : cc.Node = null ;

    @property(cc.Node)
    pReadyNode : cc.Node = null ;
    @property(cc.Node)
    pWaitReadyNode : cc.Node = null ;
    
    @property(cc.Sprite)
    pSeatEmptyPhoto : cc.Sprite = null ;

    // LIFE-CYCLE CALLBACKS:
    vTextChatMsgCacher : string[] = [] ;

    @property(cc.Node)
    pBankIcon : cc.Node = null ;

    @property
    nPosIdx : number = 0 ;

    isShowingTextMsg : boolean = false ;
    isPlayingVoice : boolean = false ;

    private _nUserUID : number = 0 ;

    isEmpty(){ return 0 == this._nUserUID ;}
    isRight(){ return this.nPosIdx == 1 ;}

    set userID( nID : number )
    {
        this._nUserUID = nID ;
    }

    get userID() : number 
    {
        return this._nUserUID ;
    }

    showBankerIcon()
    {
        this.pBankIcon.active = true ;
    }

    flipBankerIcon()
    {
       this.pBankIcon.getComponent(cc.Animation).play();
    }

    refresh( data? : playerBaseData , state? : eClientRoomState )
    {
        this._nUserUID = data == null ? 0 : data.uid ;
        this.pHoto.node.active = this.isEmpty() == false;
        this.pSeatEmptyPhoto.node.active = this.isEmpty();
        this.pName.node.active = !this.isEmpty();
        this.pCoin.node.active = !this.isEmpty();
        this.pReadyNode.active = false ;
        this.pWaitReadyNode.active = false ;
        this.pOfflineMask.active = false ;
        if ( this.isEmpty() )
        {
            return ;
        }

        this.pHoto.photoURL = data.headIconUrl ;
        this.pName.string = data.name ;
        this.pCoin.string = data.chip.toString();
        this.isOnline = data.isOnline ;
        if ( state == eClientRoomState.State_WaitReady )
        {
            this.enterWaitReadyState();
            if ( data.isReady )
            {
                this.doReady();
            }
        }
        else
        {
            this.enterGameState();
        }
    }

    onLoad ()
    {
        this.pBankIcon.active = false ;
        this.refresh(null);
    }

    enterWaitReadyState()
    {
       if ( this.isEmpty() )
       {
           cc.log( "we are empty do nothing" );
           return ;
       }

       this.pCoin.node.active = false ;
       this.pWaitReadyNode.active = true ;
       this.pReadyNode.active = false ;
       this.pBankIcon.active = false ;
    }

    enterGameState()
    {
        this.pCoin.node.active = true ;
        this.pWaitReadyNode.active = false ;
        this.pReadyNode.active = false ;
    }

    doReady()
    {
        this.pWaitReadyNode.active = false ;
        this.pReadyNode.active = true ;
    }


    get bankIconPos () : cc.Vec2
    {
        return cc.v2(this.pBankIcon.position );
    }

    set headUrl ( strHeadIcon : string )
    {
        this.pHoto.photoURL = strHeadIcon ;
    }

    set name ( strName : string )
    {
        this.pName.string = strName ;
        this.pName.node.getParent().active = strName.length > 0 ;
    }

    set coin( coin : number )
    {
        this.pCoin.string = coin.toString();
    }

    set isOnline( isOn : boolean )
    {
        this.pOfflineMask.active = !isOn ;
    }

    setInfo( strHeadIcon : string , name : string , coin : number )
    {
        this.headUrl = strHeadIcon ;
        this.name = name ;
        this.coin = coin ;
    }

    onTextMsg(  strText : string )
    {
        if ( this.isShowingTextMsg )
        {
            this.vTextChatMsgCacher.push(strText);
            return ;
        }

        this.setTextMsg(strText);
    }

    private setTextMsg( text : string )
    {
        this.pTextMsgNode.stopAllActions() ;
        this.pTextMsgNode.opacity = 255 ;
        this.isShowingTextMsg = true ;
        this.pTextMsgNode.active = true ;
        this.pTextChatMsg.string = text ;
        let self = this ;
        setTimeout(() => {
            let arrowSideExten = 24 ;
            let otherSideExter = 14 ;
            self.pTextChatMsgBg.setContentSize(cc.size(self.pTextChatMsg.node.getContentSize().width + arrowSideExten + otherSideExter,self.pTextChatMsgBg.getContentSize().height));
        }, 1);

        this.scheduleOnce(()=>{
           if ( self.vTextChatMsgCacher.length > 0 )
           {
                self.setTextMsg(self.vTextChatMsgCacher[0]) ;
                self.vTextChatMsgCacher.splice(0,1);
           } 
           else
           {
               let fade = cc.fadeOut(1);
               this.pTextMsgNode.runAction(fade) ;
           }
        },3);
    }

    onVoice( voiceUrl : string )
    {
        console.log( "player voice " );
        this.pVoiceNode.active = true ;
        this.pVoiceAnimation.play();
    }

    stopVoice()
    {
        this.pVoiceNode.active = false ;
        this.pVoiceAnimation.stop();
    }

    start () {
        //this.onTextMsg( "dflaskjdghasjdfashgasjdfadf" );
    }

    // update (dt) {}
}
