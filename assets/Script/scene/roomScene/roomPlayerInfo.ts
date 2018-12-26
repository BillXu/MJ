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

    @property(cc.Sprite)
    pEmoji : cc.Sprite = null ;

    // LIFE-CYCLE CALLBACKS:
    vTextChatMsgCacher : string[] = [] ;

    @property(cc.Node)
    pBankIcon : cc.Node = null ;

    @property
    nPosIdx : number = 0 ;

    @property([cc.Node])
    vDuiPuScore : cc.Node[] = [] ;

    isShowingTextMsg : boolean = false ;
    isPlayingVoice : boolean = false ;

    isAdjustTextBgLen : boolean = false ;

    private _nUserUID : number = 0 ;

    isEmpty(){ return 0 == this._nUserUID ;}
    isRight(){ return this.nPosIdx == 1 ;}

    set duiPuScore( score : number )
    {
        this.vDuiPuScore.forEach( ( node : cc.Node, idx : number  )=>{ node.active = score == (idx + 2) ;} );
    }

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
        this.duiPuScore = 0 ;
        if ( this.isEmpty() )
        {
            return ;
        }

        this.pHoto.photoURL = data.headIconUrl ;
        this.pName.string = data.name ;
        this.pCoin.string = data.chip.toString();
        this.isOnline = data.isOnline ;
        this.duiPuScore = data.race ;
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
        this.pTextChatMsg.node.on('size-changed',this.updateTextBgSize,this);
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
       this.duiPuScore = 0 ;
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

    onEmojiMsg( idx : string )
    {
        let self = this ;
        cc.loader.loadRes( "room_chat/chat_bg_lian" + idx ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error( "load failed room_chat/chat_bg_lian" + idx );
                return ;
            }

            self.pEmoji.spriteFrame = spriteFrame ;
            self.pEmoji.node.scale = 0.4 ;

            let scale = cc.scaleTo(0.3,1.3);
            let erase = scale.easing(cc.easeBounceInOut()) ;
            let state = cc.delayTime(2) ;
            let dispear = cc.fadeOut(0.2);
            let hide = cc.callFunc(( node : cc.Node)=>{ node.active = false ;},this,self.pEmoji.node ) ;
            self.pEmoji.node.stopAllActions();
            self.pEmoji.node.active = true ;
            self.pEmoji.node.opacity = 255 ;
            self.pEmoji.node.runAction(cc.sequence(erase,state,dispear,hide)) ;
            //console.log( "show emoji + " + idx + " opactie =" + self.pEmoji.node.opacity + " isactive " + self.pEmoji.node.active  );
        });
    }

    private setTextMsg( text : string )
    {
        console.log( " set text msg = " + text );
        this.pTextMsgNode.stopAllActions() ;
        this.pTextMsgNode.opacity = 255 ;
        this.isShowingTextMsg = true ;
        this.pTextMsgNode.active = true ;
        this.pTextChatMsg.string = text ;
        this.isAdjustTextBgLen = true ;
        let self = this ;
        // setTimeout(() => {
        //     console.log( "set text adjust size = " + self.pTextChatMsg.node.getContentSize().width );
        //     let arrowSideExten = 24 ;
        //     let otherSideExter = 14 ;
        //     let size = cc.size(self.pTextChatMsg.node.getContentSize().width + arrowSideExten + otherSideExter,self.pTextChatMsgBg.getContentSize().height);
        //     self.pTextChatMsgBg.setContentSize(size);
        // }, 500);

        this.scheduleOnce(()=>{
           if ( self.vTextChatMsgCacher.length > 0 )
           {
                console.log( "when set next adjust size = " + self.pTextChatMsg.node.getContentSize().width );
                self.setTextMsg(self.vTextChatMsgCacher[0]) ;
                self.vTextChatMsgCacher.splice(0,1);
           } 
           else
           {
               console.log( "when fade adjust size = " + self.pTextChatMsg.node.getContentSize().width );
               let fade = cc.fadeTo(1,100);
               let cal = cc.callFunc( ( node : cc.Node )=>{ node.active = false ; self.isShowingTextMsg = false ;},self,self.pTextMsgNode ) ;
               self.pTextMsgNode.runAction( cc.sequence(fade,cal) ) ;
                
           }
        },2);
    }

    updateTextBgSize(): void
    {
        // if ( this.isAdjustTextBgLen == false )
        // {
        //     return ;
        // }

        this.isAdjustTextBgLen = false ;
        let self = this ;
        let arrowSideExten = 24 ;
        let otherSideExter = 14 ;
        let size = cc.size(self.pTextChatMsg.node.getContentSize().width + arrowSideExten + otherSideExter,self.pTextChatMsgBg.getContentSize().height);
        self.pTextChatMsgBg.setContentSize(size);
    }

    onVoice()
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
