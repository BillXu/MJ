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
import * as _ from "lodash"
import { PlayerOffsetItem } from "../../../clientData/RecorderData";
import PlayerInfoDataCacher from "../../../clientData/PlayerInfoDataCacher";
import PlayerInfoData from "../../../clientData/playerInfoData";
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

    set roomID ( id : string )
    {
        this.pRoomID.string = id;
    } 

    set time ( t : string )
    {
        this.pTime.string = t ;
    }

    set isBtnDetail( isDetail : boolean )
    {
        this.pBtnDetail.active = isDetail ;
        this.pBtnReplay.active = !isDetail ;
    }

    onLoad () 
    {
        cc.systemEvent.on(PlayerInfoDataCacher.EVENT_RECIEVED_PLAYER_INFO_DATA,this.onRecievedBrifdata,this);
    }

    onDestroy()
    {
        cc.systemEvent.targetOff(this);
    }

    onRecievedBrifdata( event : cc.Event.EventCustom )
    {
        let p : PlayerInfoData = event.detail ;
        let uid : number = p.uid;
        let name : string = p.name;
        let idx = _.findIndex(this.vIDs,( id : number )=>{ return uid == id ;} ) ;
        if ( -1 == idx )
        {
            return ;
        }
        this.vName[idx].string = name ;
    }

    start () {

    }

    setOffsetData( vOffset : PlayerOffsetItem[] )
    {
        this.vName.forEach( ( l : cc.Label )=>{ l.node.active = false ;} );
        this.vOffset.forEach( ( l : cc.Label )=>{ l.node.active = false ;} );
        this.vIDs.length = 0 ;

        let self = this ;
        vOffset.forEach( ( d : PlayerOffsetItem, idx : number  )=>{
            if ( self.name.length <= idx )
            {
                cc.error( "invalid idx too many players  idx = " + idx );
                return ;
            }

            this.vName[idx].node.active = true ;
            this.vOffset[idx].node.active = true ;
            let p = PlayerInfoDataCacher.getInstance().getPlayerInfoByID(d.uid);
            if ( p )
            {
                this.vName[idx].string = p.name ;
            }
            else
            {
                this.vName[idx].string =  "" + d.uid ;
            }
            
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
