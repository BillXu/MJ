import DlgBase from "../../common/DlgBase";
import { clientEvent, eDeskBg } from "../../common/clientDefine";
import ClientData from "../../globalModule/ClientData";
import roomSceneLayerBase from "./roomSceneLayerBase";
import Utility from "../../globalModule/Utility";
import { eMsgType } from "../../common/MessageIdentifer";
import { eChatMsgType } from "./roomDefine";

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
export default class DlgRoomChat extends DlgBase {

    @property([cc.Sprite])
    vSplitLine: cc.Sprite[] = [];

    @property(cc.Sprite)
    pBtn_Emoji_bg : cc.Sprite = null ;

    @property(cc.Sprite)
    pBtn_Emoji_bgChecked : cc.Sprite = null ;

    @property(cc.Sprite)
    pBtn_Text_bg : cc.Sprite = null ;

    @property(cc.Sprite)
    pBtn_Text_bgChecked : cc.Sprite = null ;

    @property(cc.Sprite)
    pChatContentBg : cc.Sprite = null ;

    @property(cc.Sprite)
    pBtnSend : cc.Sprite = null ;

    @property(cc.EditBox)
    pEditBoxInputText : cc.EditBox = null ;

    roomSceneLayer : roomSceneLayerBase  = null ;

    static vSysText : string[] = [ "咋老胡小的呢，不能整把大的啊？","打个麻将，心情真舒畅","别吵吵，看我给你们漏一个",
                                    "来呀，互相伤害呀","要吃要碰，痛快的啊","这牌擎着点炮啊~","哎呀哥，你这牌打的也太硬",
                                    "光吃不差，胡地不大！","先赢是纸，后赢的才是钱呢！","这麻将，太麻烦了！"] ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    lastSendTextTime : number = 0 ;

    start () {

    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose);
        cc.systemEvent.on(clientEvent.setting_update_deskBg,this.onDeskBgChanged,this) ;
        this.roomSceneLayer = jsUserData ;
        this.onDeskBgChanged();
    }

    closeDlg()
    {
        super.closeDlg();
        this.roomSceneLayer = null ;
    }

    onClickEmoj( event : cc.Event.EventCustom, idx : string )
    {
        this.sendChatMsg(eChatMsgType.eChatMsg_Emoji ,idx );
        Utility.audioBtnClick();
    }

    onClickText( event : cc.Event.EventCustom, idx : string )
    {
        this.sendChatMsg(eChatMsgType.eChatMsg_SysText ,idx );
        Utility.audioBtnClick();
    }

    onClickSendInputMsg()
    {
        if ( this.pEditBoxInputText.string.length < 1 || this.pEditBoxInputText.string.length > 180 )
        {
            Utility.showPromptText( "输入内容长度不合法!" + this.pEditBoxInputText.string.length  );
            return ;
        }

        this.sendChatMsg(eChatMsgType.eChatMsg_InputText ,this.pEditBoxInputText.string );
        Utility.audioBtnClick();
    }

    onDeskBgChanged()
    {
        let path = "room_chat/bg_color" ;
        let bg : eDeskBg = ClientData.getInstance().deskBgIdx;
        if ( bg == null )
        {
            bg = eDeskBg.eDesk_Green ;
        }

        let vColorIdx : number[] = [] ;
        vColorIdx[eDeskBg.eDesk_Blue] = 1;
        vColorIdx[eDeskBg.eDesk_Wood] = 2 ;
        vColorIdx[eDeskBg.eDesk_Green] = 3 
        vColorIdx[eDeskBg.eDesk_Classic] = 0 ; 
        path += ( vColorIdx[bg] + "/" );
        // load line 
        let self = this ;
        cc.loader.loadRes(path + "char_talk_tiao" ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error( path + "char_talk_tiao " );
                return ;
            }

            self.vSplitLine.forEach( ( s : cc.Sprite )=>{ s.spriteFrame = spriteFrame ;} );
        });

        // emoji normal 
        cc.loader.loadRes(path + "chat_btn_biaoqing1" ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error(  path + "chat_btn_biaoqing1 " );
                return ;
            }

            self.pBtn_Emoji_bg.spriteFrame = spriteFrame ;
        });

        cc.loader.loadRes(path + "chat_btn_biaoqing2" ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error( path + "chat_btn_biaoqing2" );
                return ;
            }

            self.pBtn_Emoji_bgChecked.spriteFrame = spriteFrame ;
        });

        // text normal 
        cc.loader.loadRes(path + "chat_btn_liaotian1" ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error( path + "chat_btn_liaotian1" );
                return ;
            }

            self.pBtn_Text_bg.spriteFrame = spriteFrame ;
        });

        cc.loader.loadRes(path + "chat_btn_liaotian2" ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error(path + "chat_btn_liaotian2");
                return ;
            }

            self.pBtn_Text_bgChecked.spriteFrame = spriteFrame ;
        });

        // content di ;
        cc.loader.loadRes(path + "chat_btn_di" ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error( path + "chat_btn_di" );
                return ;
            }

            self.pChatContentBg.spriteFrame = spriteFrame ;
        });

         // send btn ;
        cc.loader.loadRes(path + "chat_btn_lanse" ,cc.SpriteFrame,( err : Error, spriteFrame : cc.SpriteFrame )=>{
            if ( err )
            {
                console.error( "chat_btn_di " +  path );
                return ;
            }

            self.pBtnSend.spriteFrame = spriteFrame ;
        });
    }

    protected sendChatMsg( type : eChatMsgType , content : string )
    {
        let now = Date.now();
        if ( now - this.lastSendTextTime < 2*1000 )
        {
            Utility.showPromptText( "您的发言太频繁，请休息一下再发！" );
            return ;
        }

        let msg = {} ;
        msg["type"] = type ;
        msg["content"] = content;
        this.roomSceneLayer.sendRoomMsg(msg,eMsgType.MSG_PLAYER_CHAT_MSG) ;
        this.lastSendTextTime = now ;
        this.closeDlg();
    }
    // update (dt) {}
}
