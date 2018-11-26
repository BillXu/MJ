
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
@ccclass
export default class dlgSingleResult extends cc.Component {

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
    // onLoad () {}

    start () {

    }

    showResultDlg( msg : Object , pdata : RoomData )
    {
        let self = this ;
        // fill player info
        pdata.vPlayers.forEach( ( playerData : playerBaseData )=>{
            self.vSingleResultItem[playerData.svrIdx].reset(self.pCardFactory);
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
        let vRealTimeCal : Object[] = msg["realTimeCal"] ;
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

        // parse huinfo ;
        let isZiMo : boolean = jsHuDetail["isZiMo"] ;
        let huCard : number = jsHuDetail["huCard"];
        if ( isZiMo )
        {
            let detail = jsHuDetail["detail"] ;
            let huIdx = detail["idx"] ;
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

    onClickShare()
    {

    }

    onClickGoOn()
    {

    }
}
