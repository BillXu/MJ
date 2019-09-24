import PlayerInfoDataCacher from "../clientData/PlayerInfoDataCacher";
import PlayerInfoData from "../clientData/playerInfoData";
import { eGender } from "../common/clientDefine";

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
export default class PlayerInfoItem extends cc.Component {

    @property(cc.Label)
    pName: cc.Label = null;

    @property(cc.Label)
    pID: cc.Label = null;

    @property(cc.Node)
    pFemaleIcon: cc.Node = null;

    @property(cc.Node)
    pMaleIcon: cc.Node = null;

    @property(cc.Sprite)
    pPhotoSprite: cc.Sprite = null;

    @property(cc.Sprite)
    pPhotoFrame : cc.Sprite = null ;

    pDefaultPhoto : cc.SpriteFrame = null ;

    nLoadFailedRetryDealy : number = 3000; // micro seconds ;

    private imgUrl : string = "" ;

    private _uid : number = 0 ;

    private _tryLoaderImgTimer : number = -1 ;
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        cc.systemEvent.on(PlayerInfoDataCacher.EVENT_RECIEVED_PLAYER_INFO_DATA,this.onPlayerDataInfoEvent,this);
    }

    start () {
        if ( this.pPhotoSprite.spriteFrame == null )
        {
            console.error( "must have a default sprite frame" );
            return ;
        }

        this.pDefaultPhoto = this.pPhotoSprite.spriteFrame.clone();
    }

    onDestroy()
    {
        if ( -1 != this._tryLoaderImgTimer )
        {
            clearTimeout(this._tryLoaderImgTimer);
        }
        cc.systemEvent.targetOff(this);
    }

    getUID() : number { return this._uid ;}

    refreshInfo( uid : number )
    {
        this._uid = uid ;
        let info = PlayerInfoDataCacher.getInstance().getPlayerInfoByID(uid) ;
        if ( null != info )
        {
            this.doRefresh(info) ;
        }
    }

    onPlayerDataInfoEvent( event : cc.Event.EventCustom )
    {
        let info : PlayerInfoData = <PlayerInfoData>(event.detail);
        if ( info.uid != this.getUID() )
        {
            return false ;
        }
        this.doRefresh(info);
    }

    doRefresh( info : PlayerInfoData )
    {
        if ( this.pName && this.pName.node.active )
        {
            this.pName.string = info.name ;
        }
        
        if ( this.pID && this.pID.node.active )
        {
            this.pID.string = info.uid + "" ;
        }
        
        this.pMaleIcon.active = info.gender == eGender.eGender_Male ;
        this.pFemaleIcon.active = !this.pMaleIcon.active ;

        if ( this.pPhotoSprite.node.getParent().active )
        {
            this.setHeadUrl(info.headUrl) ;
        }
    }

    clear()
    {
        //cc.error( "not implete" );
        this.pName.string = "" ;
        this.setHeadUrl("") ;
        this.pID.string = "" ;
    }

    protected setHeadUrl( strUrl : string )
    {
        if ( this.imgUrl == strUrl )
        {
            cc.warn( "same imgUrl , do not set again" );
            return ;
        }
        
        if ( this.pDefaultPhoto )
        {
            this.pPhotoSprite.spriteFrame = this.pDefaultPhoto ;
        }
        
        this.imgUrl = "" ;  
        if ( null == strUrl || strUrl == "" )
        {
            cc.error( "url can not be null");
            return ;
        }

        if ( strUrl.indexOf("http") != 0 )
        {
            cc.error( "url is not valid = " + strUrl );
            return ;
        }

        //this.pPhotoSprite.node.active = false ;
        this.imgUrl = strUrl ;    
        this.doLoadNetImg();
    }

    private doLoadNetImg()
    {
        //this.pPhotoSprite.node.active = false ;
        let self = this ;
        cc.loader.load({url: self.imgUrl, type: 'png'}, function (err, texture) {
            // Use texture to create sprite frame
            if (err)
             {
                cc.error( "loadimg error try later " + err );
                self._tryLoaderImgTimer = setTimeout(() => {
                    self._tryLoaderImgTimer = -1 ;
                    self.doLoadNetImg();
                }, self.nLoadFailedRetryDealy);
                return ;
            }

            if ( texture == null )
            {
                cc.error("load ok ,but texuture is null ? uir = " + self.imgUrl);
                return ;
            }

            if ( null == self.pDefaultPhoto && self.pPhotoSprite.spriteFrame )
            {
                self.pDefaultPhoto = self.pPhotoSprite.spriteFrame ;
                console.log( "back up default sprite frame" );
            }

            let t = self.pPhotoSprite.node.getContentSize();
            self.pPhotoSprite.spriteFrame = new cc.SpriteFrame(texture);
            self.pPhotoSprite.node.setContentSize(t);
            cc.log("ok load img headphoto");
            //elf.pPhotoSprite.node.active = true ;
        });
    }

    // update (dt) {}
}
