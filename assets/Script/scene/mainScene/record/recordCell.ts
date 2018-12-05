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
import { RecorderOffset }  from "./recordData"
import { clientEvent } from "../../../common/clientDefine"
import * as _ from "lodash"
@ccclass
export default class recordCell extends cc.Component {

    @property(cc.Label)
    pTime: cc.Label = null;

    @property(cc.Label)
    pRoomID : cc.Label = null ;

    @property(cc.Label)
    pRule : cc.Label = null ;

    @property(cc.Node)
    pBtnDetail : cc.Node = null ;

    @property(cc.Node)
    pBtnReplay : cc.Node = null ;

    @property([cc.Label])
    vName : cc.Label[] = [] ; 

    @property([cc.Label])
    vOffset : cc.Label[] = [] ;
    // LIFE-CYCLE CALLBACKS:

    vIDs : number[] = [] ;

    idx : number = 0 ;

    lpClickCallfunc : ( cell : recordCell )=>void = null ;

    set rule( str : string )
    {
        this.pRule.string = str ;
    }

    set roomID ( id : number )
    {
        this.pRoomID.string = id.toString();
    } 

    set time ( t : number )
    {
        let pDate = new Date(t * 1000 ) ;
        let s = pDate.toLocaleString();
        this.pTime.string = s ;
    }

    set isBtnDetail( isDetail : boolean )
    {
        this.pBtnDetail.active = isDetail ;
        this.pBtnReplay.active = !isDetail ;
    }

    onLoad () 
    {
        cc.systemEvent.on(clientEvent.event_recieved_brifData,this.onRecievedBrifdata,this);
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    onRecievedBrifdata( event : cc.Event.EventCustom )
    {
        let msgObj : Object = event.detail ;
        let uid : number = msgObj["uid"] ;
        let name : string = msgObj["name"] ;
        let idx = _.findIndex(this.vIDs,( id : number )=>{ return uid == id ;} ) ;
        if ( -1 == idx )
        {
            return ;
        }
        this.vName[idx].string = name ;
    }

    start () {

    }

    setOffsetData( vOffset : RecorderOffset[] )
    {
        this.vName.forEach( ( l : cc.Label )=>{ l.node.active = false ;} );
        this.vOffset.forEach( ( l : cc.Label )=>{ l.node.active = false ;} );
        this.vIDs.length = 0 ;

        let self = this ;
        vOffset.forEach( ( d : RecorderOffset, idx : number  )=>{
            if ( self.name.length <= idx )
            {
                cc.error( "invalid idx too many players  idx = " + idx );
                return ;
            }

            this.vName[idx].node.active = true ;
            this.vOffset[idx].node.active = true ;
            this.vName[idx].string = d.name ;
            this.vIDs[idx] = d.uid ;
            this.vOffset[idx].string = d.offset.toString() ;
            this.vOffset[idx].node.color = d.offset > 0 ? cc.color().fromHEX("#D15900") : cc.color().fromHEX("#127EC9");
        } ) ;
    }

    onClickDetail()
    {
        if ( this.lpClickCallfunc )
        {
            this.lpClickCallfunc(this);
        }
    }
    // update (dt) {}
}
