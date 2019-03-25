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
import { ClubEvent } from "../../../clientData/clubData/ClubDataEvent";
@ccclass
export default class dlgMessageItem extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    lpfCallBack : ( eventID : number , isAgree : boolean )=>void = null ;
 
    eventID : number = 0 ;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    refresh( item : ClubEvent )
    {
        this.eventID = item.eventID ;
        this.label.string = item.eventString;
    }

    onAgree()
    {
        if ( this.lpfCallBack )
        {
            this.lpfCallBack(this.eventID,true);
        }
    }

    onRefuse()
    {
        if ( this.lpfCallBack )
        {
            this.lpfCallBack(this.eventID,false);
        }
    }

    // update (dt) {}
}
