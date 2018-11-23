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
export default class Indicator extends cc.Component {

    @property(cc.Label)
    pTime: cc.Label = null;

    @property(cc.Animation)
    pIndicatorAni: cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.stop();
    }

    private nTimeLeft : number = 0 ;

    start () {
        // let self = this ;
        // setTimeout(() => {
        //     self.onStartWait(0,20);
        // }, 2000);

        // setTimeout(() => {
        //     self.onStartWait(1,20);
        // }, 6000);

        // setTimeout(() => {
        //     self.onStartWait(2,20);
        // }, 10000);

        // setTimeout(() => {
        //     self.onStartWait(2,20);
        // }, 16000);
    }

    onStartWait( nClientIdx : number, nTime : number = 15 )
    {
        this.nTimeLeft = nTime ;
        let vAni : string[] = ["indicator_self","indicator_right","indicator_up","indicator_left"] ;
        this.pIndicatorAni.play(vAni[nClientIdx]) ;

        this.unschedule(this.timeDecrease);
        this.schedule( this.timeDecrease,1,this.nTimeLeft) ;
        this.pTime.string = this.nTimeLeft.toString();
    }

    timeDecrease()
    {
        if ( this.nTimeLeft > 0 )
        {
            --this.nTimeLeft;
        }
        this.pTime.string = this.nTimeLeft.toString();
    }

    stop()
    {
        this.pIndicatorAni.play("indicator_hide");
    }

    // update (dt) {}
}
