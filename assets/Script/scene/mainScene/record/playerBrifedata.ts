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
import Network from "../../../common/Network"
import { clientEvent } from "../../../common/clientDefine"
import { eMsgPort,eMsgType } from "../../../common/MessageIdentifer"
import * as _ from "lodash"
@ccclass
export default class PlayerBrifdata extends cc.Component {

    private vData : Object[] = [] ;
    // LIFE-CYCLE CALLBACKS:
    private vReqingUID : number[] = [] ;
    // onLoad () {}

    start () {

    }

    getPlayerDetailByUID( uid : number ) : Object
    {
        let d = this.vData[uid] ;
        if ( d )
        {
            return d ;
        }

        let v = _.find(this.vReqingUID,( id : number )=>{ return id == uid ;} ) ;
        if ( v != null ) // already requested ;
        {
            return null ;
        }

        let reqDetail = {} ;
        reqDetail["nReqID"] = uid;
        reqDetail["isDetail"] = 1 ;
        let self = this ;
        Network.getInstance().sendMsg(reqDetail,eMsgType.MSG_REQUEST_PLAYER_DATA,eMsgPort.ID_MSG_PORT_DATA,uid,( msgRet : Object )=>{
            let retUID = msgRet["uid"];
            self.vData[retUID] = msgRet ;
            _.remove(self.vReqingUID,( id : number )=>{ return id == retUID ;} );
            
            let pEvent = new cc.Event.EventCustom(clientEvent.event_recieved_brifData,true) ;
            pEvent.detail = msgRet;
            cc.systemEvent.dispatchEvent(pEvent);
            return false ;
        } ) ;
        this.vReqingUID.push(uid);
        return null ;
    }

    // update (dt) {}
}
