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
export default class PromptText extends cc.Component {

    @property(cc.Label)
    labelText: cc.Label = null;

    @property(cc.Sprite)
    pTextBg: cc.Sprite = null;

    @property
    nLeftRightSpace : number = 160 ;
    // LIFE-CYCLE CALLBACKS:

    @property
    nDisplayTime : number = 3 ;
    // onLoad () {}

    start () {

    }

    setText( strContent : string , closeFunc? : ( target : PromptText )=>void )
    {
        this.labelText.string = strContent ;
        let self = this ;
        setTimeout(() => {
            let contentSize = self.labelText.node.getContentSize();
            contentSize.width += 170*3 ;
            self.pTextBg.node.setContentSize(cc.size(contentSize.width,self.pTextBg.node.getContentSize().height));
        }, 5);

        this.node.active = true ;

        let show = cc.delayTime(this.nDisplayTime);
        let fadeout = cc.fadeTo(0.6,0.4);
        let func = cc.callFunc(()=>{
            if ( closeFunc )
            {
                closeFunc(self);
            }
            self.node.removeFromParent(true);
        });
        
        this.node.runAction(cc.sequence(show,fadeout,func));
    }

    // update (dt) {}
}
