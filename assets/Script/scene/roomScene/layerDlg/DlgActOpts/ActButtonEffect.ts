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
export default class ActButtonEffect extends cc.Component {

    @property(cc.Node)
    mBg : cc.Node = null ;

    start () {
        let t = cc.tween;
        let a = t().to(0.9, { scale: 1.3 ,opacity: 0 }, { easing: 'sineOut'});
        let b = t().to(0, { scale: 1 ,opacity: 255 } );
        let c = t().delay(0.3);
        t(this.mBg).sequence(a,c,b).repeatForever().start();
    }

    // update (dt) {}
}
