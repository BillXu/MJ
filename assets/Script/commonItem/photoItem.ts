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
export default class PhotoItem extends cc.Component {

    @property(cc.Sprite)
    pPhotoSprite: cc.Sprite = null;

    @property(cc.Sprite)
    pPhotoFrame : cc.Sprite = null ;

    pDefaultFrame : cc.SpriteFrame = null ;

    @property
    nLoadFailedRetryDealy : number = 3000; // micro seconds ;

    private imgUrl : string = "" ;

    set photoURL ( strUrl : string )
    {
        if ( this.imgUrl == strUrl )
        {
            cc.error( "same imgUrl , do not set again" );
            return ;
        }
        
        if ( this.pDefaultFrame )
        {
            this.pPhotoSprite.spriteFrame = this.pDefaultFrame ;
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

        this.pPhotoSprite.node.active = false ;
        this.imgUrl = strUrl ;    
        this.doLoadNetImg();
    }

    private doLoadNetImg()
    {
        this.pPhotoSprite.node.active = false ;
        let self = this ;
        cc.loader.load({url: self.imgUrl, type: 'png'}, function (err, texture) {
            // Use texture to create sprite frame
            if (err)
             {
                cc.error( "loadimg error try later " + err );
                setTimeout(() => {
                    self.doLoadNetImg();
                }, self.nLoadFailedRetryDealy);
                return ;
            }

            if ( texture == null )
            {
                cc.error("load ok ,but texuture is null ? uir = " + self.imgUrl);
                return ;
            }

            let t = self.pPhotoSprite.node.getContentSize();
            self.pPhotoSprite.spriteFrame = new cc.SpriteFrame(texture);
            self.pPhotoSprite.node.setContentSize(t);
            cc.log("ok load img headphoto");
            self.pPhotoSprite.node.active = true ;
        });
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {        
        // do
        // {
        //     let mask : cc.Mask = this.node.getComponent(cc.Mask);
        //     if ( mask == null )
        //     {
        //         cc.error( "photo item can not find Mask component" );
        //         break ;
        //     }

        //     if ( this.pPhotoFrame == null )
        //     {
        //         mask.type = cc.Mask.Type.RECT ;
        //         break ;
        //     }

        //     mask.type = cc.Mask.Type.IMAGE_STENCIL ;
        //     mask.spriteFrame = this.pPhotoFrame.spriteFrame.clone();

        // }while(0);
        if ( this.pPhotoSprite.spriteFrame != null )
        {
            this.pDefaultFrame = this.pPhotoSprite.spriteFrame.clone() ;
        }
    }

    start () {
        //this.photoURL = "http://wx.qlogo.cn/mmopen/EVb7M3xGQDMtNhhB4SYiclsmjibH2zO3Pba4ICR3ib0Aibib4LAoEsk8DCFrXicF1X0lTYFYTYpl4y6q0GjTZxyTJf5oXaufvmHHu3/0" ; 
    }

    // update (dt) {}
}
