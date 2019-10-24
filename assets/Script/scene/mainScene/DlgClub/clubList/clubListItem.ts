import Utility from "../../../../globalModule/Utility";

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
export default class ClubListItem extends cc.Component {

    @property(cc.Label)
    unCheckName: cc.Label = null;

    @property(cc.Label)
    checkName: cc.Label = null;

    @property(cc.Label)
    checkID: cc.Label = null;

    id : number = 0 ;
    // LIFE-CYCLE CALLBACKS:

    lpCallBack : ( toggle : cc.Toggle, clubID : number )=>void = null ;
    // onLoad () {}

    start () {

    }

    refresh( id : number , name : string )
    {
        this.id = id ;
        this.checkID.string = id.toString();
        this.unCheckName.string = name ;
        this.checkName.string = name ;
    }

    onToggleEvent( toggle : cc.Toggle )
    {
        if ( toggle.isChecked == false )
        {
            if ( this.lpCallBack != null )
            {
                toggle.isChecked = true ;
            }
            return ;
        }
        //console.log( "toggle state = " + toggle.isChecked + " id = " + this.id );
        if ( this.lpCallBack && toggle.isChecked )
        {
           // console.log( " lpCallBack toggle state = " + toggle.isChecked );
            this.lpCallBack( toggle , this.id );
            Utility.audioBtnClick();
        }
    }

    // update (dt) {}
}
