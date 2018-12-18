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
import DlgBase from "../../../common/DlgBase"
import ClubData from "./clubData"
import { eGameType } from "../../../common/clientDefine"
import DlgCreateRoom from "../dlgCreateRoom";
import { eMsgPort,eMsgType } from "../../../common/MessageIdentifer"
import Network from "../../../common/Network"
import Utility from "../../../globalModule/Utility";
@ccclass
export default class DlgControlCenter extends DlgBase {

    @property(cc.Label)
    pCurName: cc.Label = null;

    @property(cc.EditBox)
    pNewName : cc.EditBox = null ;

    @property(cc.Label)
    pClubState : cc.Label = null ;
    
    @property(cc.Label)
    pGameType : cc.Label = null ;

    @property(cc.Label)
    pRoundOrCircle : cc.Label = null ;

    @property(cc.Label)
    pRoundOrCircleCnt : cc.Label = null ;

    @property(cc.Label)
    pPayType : cc.Label = null ;

    @property(cc.Label)
    pSeatCnt : cc.Label = null ;

    @property(cc.Label)
    pOpts : cc.Label = null ;

    @property(cc.Node)
    pBtnModifyRule : cc.Node = null ;

    @property(cc.Node)
    pBtnStop : cc.Node = null ;

    @property(cc.Node)
    pBtnOpen : cc.Node = null ;

    @property(DlgCreateRoom)
    pDlgCreateOpts : DlgCreateRoom = null ;

    @property([cc.Toggle])
    pMgrTab : cc.Toggle[] = [] ;
    @property(cc.Toggle)
    pDismissTab : cc.Toggle = null ;
    @property(cc.Toggle)
    pRuleToggle : cc.Toggle = null ;

    // LIFE-CYCLE CALLBACKS:

    pClubData : ClubData = null ;

    // onLoad () {}

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void  )
    {
        super.showDlg(pfResult,jsUserData,pfOnClose) ;
        this.refresh(jsUserData);
    }

    refresh( pdata : ClubData )
    {
        if ( (pdata.isSelfMgr() || pdata.isSelfOwner()) == false )
        {
            this.pRuleToggle.check();
        }
        this.pBtnModifyRule.active = (pdata.isSelfMgr() || pdata.isSelfOwner());
        this.pDismissTab.node.active = pdata.isSelfOwner();
        this.pMgrTab.forEach( ( pNodeToggle : cc.Toggle )=>{ pNodeToggle.node.active = pdata.isSelfMgr() || pdata.isSelfOwner() ;} );

        this.pClubData = pdata ;
        this.pCurName.string = pdata.name ;
        this.pNewName.string = "" ;
        
        this.pClubState.string = pdata.isStoped ? "俱乐部已经打烊，是否需要营业？" : "俱乐部正在营业，是否要打烊？" ;
        this.pBtnOpen.active = pdata.isStoped ;
        this.pBtnStop.active = !this.pBtnOpen ;
        
        // wan fa ;
        let opts = pdata.opts ;
        let gameType : eGameType = opts["gameType"] ;
        let payType : number = opts["payType"] ;
        let isCirle : boolean = opts["circle"] == 1;
        let isGuapu : boolean = opts["guapu"] == 1 ;
        let seatCnt : number = opts["seatCnt"] ;
        let isEnableStopCheat : boolean = opts["enableAvoidCheat"] == 1 ;
        let roundOrCircleCnt = this.getTotalRoundOrCircle(isCirle,opts["level"] );
        switch( gameType )
        {
            case eGameType.eGame_CFMJ:
            {
                this.pGameType.string = "赤峰麻将" ;
            }
            break ;
            case eGameType.eGame_AHMJ:
            {
                this.pGameType.string = "敖汉麻将" ;
            }
            break ;
            case eGameType.eGame_NCMJ:
            {
                this.pGameType.string = "宁城麻将" ;
            }
            break ;
            default:
            this.pGameType.string = "其他麻将" ;
        }

        this.pPayType.string = payType == 0 ? "房主扣卡" : "AA扣卡";
        this.pRoundOrCircle.string = isCirle ? "圈数：" : "局数：" ;
        this.pRoundOrCircleCnt.string = "" + roundOrCircleCnt;
        this.pOpts.string = isGuapu ? "对铺" : "" + isEnableStopCheat ? "   防作弊" : "";
        this.pSeatCnt.string = seatCnt.toString();
    }

    private getTotalRoundOrCircle( isCircle : boolean , level : number ) : number 
    {
        let createDlgOptIdx = 0 ;
        if ( isCircle == false )
        {
            createDlgOptIdx = level ;
            return createDlgOptIdx == 0 ? 8 : 16 ;
        }
        else
        createDlgOptIdx = level - 2 ;

        let vCircle = [1,2,3,4] ;
        return vCircle[level] ;
    }

    onChangeRule()
    {
        let self = this ;
        this.pDlgCreateOpts.showDlg(( msgCreateRoom : Object )=>{
            let msg = {} ;
            msg["clubID"] = self.pClubData.clubID ;
            msg["opts"] = msgCreateRoom ;
            Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_SET_ROOM_OPTS,eMsgPort.ID_MSG_PORT_CLUB,self.pClubData.clubID,( js : Object )=>{
                let ret : number = js["ret"] ;
                let vError = [ "玩法更改成功" , "权限不足","code 2"," code 3","无效玩家对象"] ;
                if ( ret < vError.length )
                {
                    Utility.showPromptText(vError[ret]) ;
                    if ( 0 == ret )
                    {
                        self.pClubData.opts = msgCreateRoom ;
                        self.refresh(self.pClubData);
                    }
                }
                else
                {
                    Utility.showTip("unknown error code = " + ret ) ;
                }
                return true ;
            }) ;
        });
    }

    onChangeName()
    {
        if ( this.pNewName.string.length < 1 )
        {
            Utility.showPromptText( "名字不能为空" );
            return ;
        }

        if ( this.pNewName.string == this.pCurName.string )
        {
            Utility.showPromptText( "新名字与旧名字一样" );
            return ;
        }

        let self = this ;
        let msg = {} ;
        msg["clubID"] = self.pClubData.clubID ;
        msg["name"] = this.pNewName.string ;
        Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_UPDATE_NAME,eMsgPort.ID_MSG_PORT_CLUB,self.pClubData.clubID,( js : Object )=>{
            let ret : number = js["ret"] ;
            let vError = [ "改名字成功" , "权限不足","新名字与旧名字一样了","名字已经被其他俱乐部使用了","无效玩家对象"] ;
            if ( ret < vError.length )
            {
                Utility.showPromptText(vError[ret]) ;
                if ( 0 == ret )
                {
                    self.pClubData.name = self.pNewName.string ;
                    self.refresh(self.pClubData);
                }
            }
            else
            {
                Utility.showTip("unknown error code = " + ret ) ;
            }
            return true ;
        }) ;
    }

    onSwitchStopOpen()
    {
        let self = this ;
        let msg = {} ;
        msg["clubID"] = self.pClubData.clubID ;
        msg["isPause"] = !this.pClubData.isStoped;
        Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_SET_STATE,eMsgPort.ID_MSG_PORT_CLUB,self.pClubData.clubID,( js : Object )=>{
            let ret : number = js["ret"] ;
            let vError = [ "操作成功" , "权限不足"] ;
            if ( ret < vError.length )
            {
                Utility.showPromptText(vError[ret]) ;
                if ( 0 == ret )
                {
                    self.pClubData.isStoped = !self.pClubData.isStoped ;
                    self.refresh(self.pClubData);
                }
            }
            else
            {
                Utility.showTip("unknown error code = " + ret ) ;
            }
            return true ;
        }) ;
    }

    onDissmiss()
    {
        let self = this ;
        let msg = {} ;
        msg["clubID"] = self.pClubData.clubID ;
        Network.getInstance().sendMsg(msg,eMsgType.MSG_CLUB_DISMISS_CLUB,eMsgPort.ID_MSG_PORT_CLUB,self.pClubData.clubID,( js : Object )=>{
            let ret : number = js["ret"] ;
            let vError = [ "操作成功" , "权限不足"," code 2 ","有房间牌局没结束，无法解散，请稍后再试","无效玩家"] ;
            if ( ret < vError.length )
            {
                Utility.showPromptText(vError[ret]) ;
                if ( 0 == ret )
                {
                    self.pClubData.isStoped = !self.pClubData.isStoped ;
                    if ( self.pFuncResult  )
                    {
                        self.pFuncResult(this.pClubData.clubID);
                    }
                    self.closeDlg();
                }
            }
            else
            {
                Utility.showTip("unknown error code = " + ret ) ;
            }
            return true ;
        }) ;
    }    

    onChangeTab( event : cc.Toggle )
    {
        this.pMgrTab.forEach( ( p : cc.Toggle )=>{ p.node.zIndex = event == p ? 1 : 0 ; } );
    }
    // update (dt) {}
}
