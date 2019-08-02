import Utility from "../globalModule/Utility";

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
export default class DlgBase extends cc.Component {

    @property(cc.Node)
    pRootNode : cc.Node = null ;

    @property(cc.Node)
    pBgImgArea : cc.Node = null;

    @property()
    isClickOutsideClose : boolean = false ;

    @property()
    isPopout : boolean = false ; // show dlg effect

    protected pFuncResult : ( jsResult : Object ) => void = null ;
    protected pOnCloseCallBack : ( pTargetDlg : DlgBase ) => void = null ;
    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        if ( this.pRootNode == null )
        {
            this.pRootNode = this.node ;
        }

        if ( null == this.pBgImgArea )
        {
            this.pBgImgArea = this.pRootNode ;
        }

        let pCaptureEnvetNode = new cc.Node();
        pCaptureEnvetNode.setContentSize(cc.size(1000000,100000));
        this.pRootNode.addChild(pCaptureEnvetNode,-1,"capNode");
        pCaptureEnvetNode.on( cc.Node.EventType.TOUCH_START ,this.onTouchBegin,this ) ;
        pCaptureEnvetNode.on( cc.Node.EventType.TOUCH_END ,this.onTouchEnd,this ) ;
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }
    
    protected onTouchBegin( touch : cc.Touch )
    {
        //console.log("touch begin");
        return true ;
    }

    protected onTouchEnd( touchEvent : cc.Event.EventTouch )
    {
        if ( this.pBgImgArea == null )
        {
            return false ;
        }

        if ( false == this.isClickOutsideClose )
        {
            return true ;
        }
        
        let v = touchEvent.getLocation();
        let inViewPos : cc.Vec2 = this.pBgImgArea.getParent().convertToNodeSpaceAR(v); ;
        let isInArea = this.pBgImgArea.getBoundingBox().contains(inViewPos);
        if ( false == isInArea )
        {
            this.closeDlg();
        }
        return true ;
    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        this.pFuncResult = pfResult ;
        this.pOnCloseCallBack = pfOnClose ;
        this.pRootNode.active = true ;
        console.log( " super is showDlg ");
        if ( this.isPopout )
        {
            this.pBgImgArea.scale = 0.8;
            let s : cc.ActionInterval = cc.scaleTo(0.5,1);
            this.pBgImgArea.runAction(s.easing(cc.easeBounceOut()) );
        }
    }

    closeDlg()
    {
        this.pRootNode.active = false ;
        if ( this.pOnCloseCallBack )
        {
            this.pOnCloseCallBack(this);
        }
        cc.systemEvent.targetOff(this); 

        // play audio effect
        let url = "sound/Button32";
        cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
            if ( err )
            {
                console.error( "load btn audio error + url = " + url );
                return ;
            }
            cc.audioEngine.playEffect(clip, false);  
        });
    }

    isShow() : boolean
    {
        return this.pRootNode.active ;
    }
    
    // update (dt) {}
}
