
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
import RoomData from "./roomData";
import DlgSingleResultItem from "./dlgSingleResultItem"
import CardFactory from "./cardFactory"
import { playerBaseData } from "./roomInterface";
import { eMJActType } from "./roomDefine";
import DlgBase from "../../common/DlgBase"
import WechatManager, { eWechatShareDestType } from "../../sdk/WechatManager";
import Utility from "../../globalModule/Utility";
@ccclass
export default class dlgSingleResult extends DlgBase {

    @property(cc.Label)
    pRoomIDAndCirleState: cc.Label = null;

    @property(cc.Label)
    pRule : cc.Label = null ;

    @property(cc.Label)
    pCurTime : cc.Label = null ;

    @property(cc.Label)
    pCountDownTime : cc.Label = null ;

    @property([DlgSingleResultItem])
    vSingleResultItem : DlgSingleResultItem[] = [] ; // array idx = svr idx ;
    // LIFE-CYCLE CALLBACKS:

    @property(CardFactory)
    pCardFactory : CardFactory = null ;
    
    @property(cc.Node)
    pWinTitle : cc.Node = null ;

    @property(cc.Node)
    pLoseTitile : cc.Node = null ;

    @property(cc.Node)
    pLiujuTitle : cc.Node = null ;

    nCountDownTimer : number = 15 ;

    @property([cc.Component.EventHandler])
    vReusltHandle : cc.Component.EventHandler[] = [] ;

    start () {

    }

    refresh( msg : Object , pdata : RoomData )
    {
        let self = this ;
        this.vSingleResultItem.forEach( ( item : DlgSingleResultItem )=>{ item.reset(self.pCardFactory); item.node.active = false ;} );
        // fill player info
        pdata.vPlayers.forEach( ( playerData : playerBaseData )=>{
            self.vSingleResultItem[playerData.svrIdx].node.active = true ;
            self.vSingleResultItem[playerData.svrIdx].name = playerData.name ;
            self.vSingleResultItem[playerData.svrIdx].clientIdx = playerData.clientIdx ;
            self.vSingleResultItem[playerData.svrIdx].headUrl = playerData.headIconUrl ;
            self.vSingleResultItem[playerData.svrIdx].isBanker = playerData.svrIdx == pdata.bankerIdx ;
            self.vSingleResultItem[playerData.svrIdx].isRoomOwner = playerData.uid == pdata.roomOwnerUID ;
         });

        // parse players cards;
        let vPlayers : Object[] = msg["players"] ;
        vPlayers.forEach( ( obj : Object)=>{
            let svrIdx = obj["idx"] ;
            let singleItem = self.vSingleResultItem[svrIdx] ;
            let vPlayerMing = pdata.vPlayers[svrIdx].cards.vMingCards;
            let vHold = obj["holdCard"] ;
            singleItem.setCardInfo(self.pCardFactory,vPlayerMing,vHold) ;
        } );

        // parse realTimeCal gang offset
        let vGangOffset : number[] = [] ; // array idx = svrIdx ;
        let vHuOffset : number[] = [] ; // array idx = svrIdx ;
        let jsHuDetail : Object = null ;
        let vRealTimeCal : Object[] = msg["realTimeCal"] || [];
        vRealTimeCal.forEach( ( objCal : Object )=>{
            let actType : eMJActType = objCal["actType"] ;
            let vOffseDetail : Object[] = objCal["detial"] ;
            let isHuType = eMJActType.eMJAct_Hu == actType;
            if ( null == jsHuDetail && isHuType )
            {
                jsHuDetail = objCal["msg"] ;
            }

            vOffseDetail.forEach( ( retOffset : Object )=>{
                let idx : number = retOffset["idx"] ;
                let offset : number = retOffset["offset"] ;
                if ( isHuType )
                {
                    vHuOffset[idx] = offset;
                    return ;
                }

                if ( vGangOffset[idx] )
                {
                    vGangOffset[idx] += offset ;
                }
                else
                {
                    vGangOffset[idx] = offset ;
                }
            } );
        } );

        vGangOffset.forEach( ( gangOffset : number, idx : number)=>{
            let singleItem = self.vSingleResultItem[idx] ;
            singleItem.gangScore = gangOffset ;
        } ) ;

        vHuOffset.forEach( ( huOffset : number, idx : number)=>{
            let singleItem = self.vSingleResultItem[idx] ;
            singleItem.huScore = huOffset ;
        } ) ;

        // caculte total offset 
        this.vSingleResultItem.forEach( ( obj : DlgSingleResultItem , idx : number )=>{
            if ( obj.node.active == false )
            {
                return ;
            }

            let offset = vGangOffset[idx] || 0 ;
            offset += vHuOffset[idx] || 0 ;
            obj.totalScore = offset ;
        } );

        // parse huinfo ;
        if ( jsHuDetail != null )
        {
            let isZiMo : boolean = jsHuDetail["isZiMo"] == 1 ;
            let huCard : number = jsHuDetail["huCard"];
            if ( isZiMo )
            {
                let detail = jsHuDetail["detail"] ;
                let huIdx = detail["huIdx"] ;
                let vHuType = detail["vhuTypes"] || [];
                this.vSingleResultItem[huIdx].isHu = true ;
                this.vSingleResultItem[huIdx].isZiMo = true ;
                this.vSingleResultItem[huIdx].huType = vHuType ;
                //this.vSingleResultItem[huIdx].huCard = huCard ; // aready in hold card
            }
            else
            {
                let detail = jsHuDetail["detail"] ;
                let dianPaoIdx : number = detail["dianPaoIdx"] ;
                let vHuPlayers : Object[] = detail["huPlayers"] ;
    
                // sign dian pao player 
                this.vSingleResultItem.forEach( ( item : DlgSingleResultItem, idx : number )=>{
                    item.isDianPao = idx == dianPaoIdx ;
                } )
    
                // huplayers ;
                vHuPlayers.forEach( ( huPlayerItem : Object )=>{
                    let huIdx = huPlayerItem["idx"] ;
                    let vHuType = huPlayerItem["vhuTypes"] || [] ;
                    self.vSingleResultItem[huIdx].isHu = true ;
                    self.vSingleResultItem[huIdx].isZiMo = false ;
                    self.vSingleResultItem[huIdx].huType = vHuType ;
                    self.vSingleResultItem[huIdx].setHuCard(self.pCardFactory,huCard) ;
                } );
            }
        }

        // total title
        let s = this.vSingleResultItem[pdata.clientIdxToSvrIdx(0)].totalScore ;
        this.pWinTitle.active = s > 0 ;
        this.pLiujuTitle.active = s == 0 ;
        this.pLoseTitile.active = s < 0 ;

        // room id and circle state ;
        this.pRoomIDAndCirleState.string = "房间号:" + pdata.roomID + "  " + pdata.playedCircle + "/" + pdata.totalCircleOrRoundCnt ;

        // cur time 
        this.pCurTime.string = (new Date()).toLocaleString();

        // start count down time 
        this.nCountDownTimer = 15 ;
        this.unschedule(this.onCountDownTimer) ;
        this.schedule(this.onCountDownTimer,1,50) ;
        this.pCountDownTime.string = this.nCountDownTimer.toString();

        // rule
        this.pRule.string = pdata.rule;
    }

    onClickShare()
    {
        this.unschedule(this.onCountDownTimer) ;
        cc.Component.EventHandler.emitEvents(this.vReusltHandle,false) ;
        WechatManager.getInstance().shareImageWechat(this.pBgImgArea,eWechatShareDestType.eDest_Firend);
        Utility.audioBtnClick();
    }

    onClickGoOn()
    {
        this.unschedule(this.onCountDownTimer) ;
        this.closeDlg();
        cc.Component.EventHandler.emitEvents(this.vReusltHandle,true) ;
    }

    onCountDownTimer()
    {
        if ( 0 == this.nCountDownTimer )
        {
            this.onClickGoOn();
            return ;
        }
        --this.nCountDownTimer;
        this.pCountDownTime.string = this.nCountDownTimer.toString();
    }
}
