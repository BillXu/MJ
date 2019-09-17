import ResultSingleData, { ResultItem } from "../../roomScene/roomData/ResultSingleData";
import IResultSingleData from "../layerDlg/dlgResultSingle/IResultSingleDate";
import {IResultSingleItemData} from "../layerDlg/dlgResultSingle/IResultSingleItemData";
import { eFanxingType, eMJActType, eMJCardType } from "../../roomScene/roomDefine";
import MJRoomData from "../../roomScene/roomData/MJRoomData";
import MJPlayerData from "../../roomScene/roomData/MJPlayerData";
import ClientApp from "../../../globalModule/ClientApp";
import { IPlayerCards } from "../../roomScene/roomData/MJPlayerCardData";
import MJCard from "../../roomScene/layerCards/cards3D/MJCard";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export class ResultSingleItemDataSZ extends ResultItem implements IResultSingleItemData
{
    mPlayerData : MJPlayerData = null ;
    mIsRoomOwner : boolean = false ;
    mIsDianPao : boolean = false;
    mIsSelf : boolean = false ;
    mMingKe : number = 0 ;
    mAnKe : number = 0 ;

    isZiMo() : boolean 
    {
        if ( this.isHu() == false )
        {
            return false ;
        }
        return this.mIsZiMo ;
    }

    isHu() : boolean 
    {
        return this.haveHu();
    }

    isDianPao() : boolean 
    {
        return this.mIsDianPao ;
    }

    isRoomOwner() : boolean 
    {
        return this.mIsRoomOwner ;
    }

    isSelf() : boolean 
    {
        return this.mIsSelf ;
    }

    getUID() : number 
    {
        return this.mPlayerData.mPlayerBaseData.uid ;
    }

    getOffset() : number 
    {
        return this.mOffset ;
    }

    getHuDetail() : string 
    {
        let str = "花+" + this.mPlayerData.mPlayerCard.vBuedHua.length + ",";
        for ( let ref of this.mHuTypes )
        {
            switch (ref)
            {
                case eFanxingType.eFanxing_PingHu:
                {
                    str += "平胡+1，";
                }
                break ;
                case eFanxingType.eFanxing_TianHu:
                {
                    str += "天胡+50，";
                }
                break;
                case eFanxingType.eFanxing_DiHu:
                {
                    str += "地胡+50，";
                }
                break;
                case eFanxingType.eFanxing_HaiDiLaoYue:
                {
                    str += "海底捞月+5，";
                }
                break;
                case eFanxingType.eFanxing_XiaoMenQing:
                {
                    str += "小门清+5，";
                }
                break;
                case eFanxingType.eFanxing_GangKai:
                {
                    str += "杠开+5，";
                }
                break;
                case eFanxingType.eFanxing_HunYiSe:
                {
                    str += "混一色+10，";
                }
                break ;
                case eFanxingType.eFanxing_DuiDuiHu:
                {
                    str += "对对胡+10，";
                }
                break ;
                case eFanxingType.eFanxing_DaMenQing:
                {
                    str += "大门清+10，";
                }
                break ;
                case eFanxingType.eFanxing_QuanQiuDuDiao:
                {
                    str += "全球独钓+10，";
                }
                break;
                case eFanxingType.eFanxing_QingYiSe:
                {
                    str += "清一色+30，";
                }
                break;
                case eFanxingType.eFanxing_ShuangQiDui:
                {
                    str += "双七对+40，";
                }
                break;
                case eFanxingType.eFanxing_QiDui:
                {
                    str += "七对+20，";
                }
                break;
            }
        }

        let cnt = this.getFengAnGang();
        if ( cnt > 0  )
        {
            str += "风暗杠+" + 4 * cnt + ",";
        }

        cnt = this.getFengMingGang();
        if ( cnt > 0  )
        {
            str += " 风明杠+" + 3 * cnt + ",";
        }

        cnt = this.getNormalAnGang();
        if ( cnt > 0  )
        {
            str += " 暗杠+" + 2 * cnt + ",";
        }

        cnt = this.getNormalMingGang();
        if ( cnt > 0  )
        {
            str += " 明杠+" + cnt + ",";
        }

        cnt = this.getFengPengCnt();
        if ( cnt > 0  )
        {
            str += "风碰+" + cnt  + ",";
        }

        if ( this.mAnKe + this.mMingKe > 0 )
        {
            str += "刻字+" + this.mAnKe + this.mMingKe ;
        }
        return str ;
    }

    protected getFengPengCnt() : number
    {
        let cnt = 0 ;
        let actedCards = this.mPlayerData.mPlayerCard.vMingCards ;
        for ( let v of actedCards )
        {
            if ( v.eAct == eMJActType.eMJAct_Peng )
            {
                if ( MJCard.parseCardType(v.nTargetCard) == eMJCardType.eCT_Feng )
                {
                    ++cnt ;
                }
            }
        }
        return cnt ;
    }

    protected getFengMingGang() : number
    {
        let cnt = 0 ;
        let actedCards = this.mPlayerData.mPlayerCard.vMingCards ;
        for ( let v of actedCards )
        {
            if ( v.eAct == eMJActType.eMJAct_MingGang || eMJActType.eMJAct_BuGang == v.eAct || eMJActType.eMJAct_BuGang_Done == v.eAct )
            {
                if ( MJCard.parseCardType(v.nTargetCard) == eMJCardType.eCT_Feng )
                {
                    ++cnt ;
                }
            }
        }
        return cnt ;
    }

    protected getFengAnGang() : number
    {
        let cnt = 0 ;
        let actedCards = this.mPlayerData.mPlayerCard.vMingCards ;
        for ( let v of actedCards )
        {
            if ( v.eAct == eMJActType.eMJAct_AnGang )
            {
                if ( MJCard.parseCardType(v.nTargetCard) == eMJCardType.eCT_Feng )
                {
                    ++cnt ;
                }
            }
        }
        return cnt ;
    }

    protected getNormalAnGang() : number
    {
        let cnt = 0 ;
        let actedCards = this.mPlayerData.mPlayerCard.vMingCards ;
        for ( let v of actedCards )
        {
            if ( v.eAct == eMJActType.eMJAct_AnGang )
            {
                if ( MJCard.parseCardType(v.nTargetCard) != eMJCardType.eCT_Feng )
                {
                    ++cnt ;
                }
            }
        }
        return cnt ;
    }

    protected getNormalMingGang() : number
    {
        let cnt = 0 ;
        let actedCards = this.mPlayerData.mPlayerCard.vMingCards ;
        for ( let v of actedCards )
        {
            if ( v.eAct == eMJActType.eMJAct_MingGang || eMJActType.eMJAct_BuGang == v.eAct || eMJActType.eMJAct_BuGang_Done == v.eAct )
            {
                if ( MJCard.parseCardType(v.nTargetCard) != eMJCardType.eCT_Feng )
                {
                    ++cnt ;
                }
            }
        }
        return cnt ;
    }

    getPlayerCard() : IPlayerCards 
    {
        this.mPlayerData.mPlayerCard.vHoldCard.length = 0 ;
        this.mPlayerData.mPlayerCard.vHoldCard = this.mPlayerData.mPlayerCard.vHoldCard.concat( this.mAnHoldCards );
        return this.mPlayerData.mPlayerCard ;
    }
}

export default class ResultSingleDataSZ extends ResultSingleData implements IResultSingleData{
    mIsLiuJu : boolean = true ;
    mRoomData : MJRoomData = null ;
    parseResultSZ( js : Object , roomData : MJRoomData )
    {
        if ( this.mResults.length == 0 )
        {
            this.mResults.push( new ResultSingleItemDataSZ() );
            this.mResults.push( new ResultSingleItemDataSZ() );
            this.mResults.push( new ResultSingleItemDataSZ() );
            this.mResults.push( new ResultSingleItemDataSZ() );
        }
        this.mRoomData = roomData ;
        super.parseResult(js);

        let selfIdx = this.mRoomData.getSelfIdx();
        for ( let idx = 0 ; idx < this.mResults.length ; ++idx )
        {
            let p = this.mResults[idx] as ResultSingleItemDataSZ;
            p.mIsSelf = idx == selfIdx ;
            p.mPlayerData = this.mRoomData.mPlayers[idx] ;
            p.mIsDianPao = idx == this.mDianPaoIdx ;
            p.mIsRoomOwner = p.getUID() == this.mRoomData.mBaseData.ownerID;
        }
    }

    parseHuInfo( jsHuInfo : Object ) : void
    {
        super.parseHuInfo(jsHuInfo);
        let isZiMo = jsHuInfo["isZiMo"] == 1 ;
        let detail = jsHuInfo["detail"] ;
        if ( isZiMo )
        {
            let idx = detail["huIdx"];
            let p : ResultSingleItemDataSZ = this.mResults[idx] as any;
            p.mMingKe = detail["mingKe"] ;
            p.mAnKe = detail["anKe"] ;
        }
        else
        {
            let huPlayers : Object[] = detail["huPlayers"] ;
            this.mDianPaoIdx = detail["dianPaoIdx"] ;
            for ( let i = 0; i < huPlayers.length; i++ )
            {
                let obj : Object = huPlayers[i];
                let idx : number  = obj["idx"] ;
                let p : ResultSingleItemDataSZ = this.mResults[idx] as any;
                p.mMingKe = obj["mingKe"] ;
                p.mAnKe = obj["anKe"] ;
            }
        }
    }

    getRoomRuleDetail() : string 
    {
        return this.mRoomData.mOpts.getRuleDesc() ;
    }

    getDataItems() : IResultSingleItemData[] 
    {
        return this.mResults as any ;
    }

    isShowWinTitle() : boolean
    {
        for ( let v of this.mResults )
        {
            let p = v as ResultSingleItemDataSZ;
            if ( p.isSelf() )
            {
                return p.getOffset() >= 0 ;
            }
        }
        return false ;
    }
}
