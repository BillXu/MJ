import { eMJActType ,eFanxingType } from "../roomDefine";
import { ISingleResultDlgDataItem, ISingleResultDlgData } from "../layerDlg/ILayerDlgData";
import MJRoomData from "./MJRoomData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass

export class ResultItem implements ISingleResultDlgDataItem
{
    mHuScore : number ;
    mGangScore : number  ;
    mOffset : number ; 
    idx : number ;
    mIsZiMo : boolean = false ; 
    mHuTypes : eFanxingType[] = []; 

    mFinalChip : number = 0 ;
    mAnHoldCards : number[] = [];

    clear() : void
    {
        this.mHuScore = 0 ;
        this.mGangScore = 0 ;
        this.idx = -1 ;
        if ( this.mHuTypes != null )
        {
            this.mHuTypes.length = 0 ;
        }

        this.mFinalChip = 0 ;
        this.mOffset = 0 ;
        this.mIsZiMo = false ;
        this.mAnHoldCards.length = 0;
    }

    isEmpty() : boolean
    {
        return this.idx == -1 ;
    }

    haveHu() : boolean
    {
        return this.mHuTypes != null && this.mHuTypes.length > 0 ;
    }

    getHuTypeStr() : string
    {
        let str = "" ;
        if ( this.mHuTypes != null )
        {
            for ( let i = 0 ; i < this.mHuTypes.length ; ++i )
            {
            if ( i != 0 )
            {
                str += " " ;
            }

            str = str.concat("【",this.huTypeToString(this.mHuTypes[i]),"】" );
            }
        }

        if ( this.mIsZiMo )
        {
            
           if ( this.mHuTypes != null && this.mHuTypes.length > 0 )
           {
             str += " " ;
           }
           str = str.concat("【","自摸","】" );             
        }
        return str;
    }

    public huTypeToString( type : eFanxingType ) : string
    {
        let strHu = "" ;
        switch ( type )
        {
            case eFanxingType.eFanxing_PingHu:
            {
                strHu = "平胡";
            }
            break;
            case eFanxingType.eFanxing_QingYiSe:
            {
                strHu = "清一色";
            }
            break ;
            case eFanxingType.eFanxing_MengQing:
            {
                strHu = "门清";
            }
            break ;
            case eFanxingType.eFanxing_QiangGang:
            {
                strHu = "抢杠胡";
            }
            break;
            case eFanxingType.eFanxing_DaMenQing:
            {
                strHu = "大门清";
            }
            break;
            case eFanxingType.eFanxing_XiaoMenQing:
            {
                strHu = "小门清";
            }
            break ;
            case eFanxingType.eFanxing_GangKai:
            {
                strHu = "杠开";
            }
            break ;
            case eFanxingType.eFanxing_JiaHu:
            {
                strHu = "夹胡";
            }
            break;
            case eFanxingType.eFanxing_QiDui:
            {
                strHu = "七对";
            }
            break;
            case eFanxingType.eFanxing_QuanQiuDuDiao:
            {
                strHu = "全球独钓";
            }
            break ;
            case eFanxingType.eFanxing_HunYiSe:
            {
                strHu = "混一色";
            }
            break;
            case eFanxingType.eFanxing_DiHu:
            {
                strHu = "地胡";
            }
            break;
            case eFanxingType.eFanxing_ShuangQiDui:
            {
                strHu = "双七对";
            }
            break;
            case eFanxingType.eFanxing_WuHuaGuo:
            {
                strHu = "无花果";
            }
            break ;
            case eFanxingType.eFanxing_BianHu:
            {
                strHu = "边胡";
            }
            break;
            case eFanxingType.eFanxing_DuiDuiHu:
            {
                strHu = "对对胡";
            }
            break;
            case eFanxingType.eFanxing_GangHouPao:
            {
                strHu = "杠后炮" ;
            }
            break;
            case eFanxingType.eFanxing_YaJue:
            {
                strHu = "压绝" ;
            }
            break;
            default:
            {
                strHu = type + " ";
            }
            break ;
        }
        return strHu ;
    }

} 

export default class ResultSingleData implements ISingleResultDlgData {

    mResults : ResultItem[] = []; 

    mIsLiuJu : boolean = true ;
    mDianPaoIdx : number = -1 ;
    mRoomData : MJRoomData = null ;
    init( data : MJRoomData )
    {
        this.mRoomData = data ;
    }

    parseResult( js : Object ) : void
    {
        if ( this.mResults.length == 0 )
        {
            this.mResults.push( new ResultItem() );
            this.mResults.push( new ResultItem() );
            this.mResults.push( new ResultItem() );
            this.mResults.push( new ResultItem() );
        }

        for ( const item of this.mResults )
        {
            item.clear();
        }
        this.mIsLiuJu = true ;

        let realTimeCal : Object[] = js["realTimeCal"] ;
        for ( const obj of realTimeCal )
        {
            let actType : eMJActType  = obj["actType"];
            let detail : Object[] = obj["detial"];
            for ( let i = 0; i < detail.length; i++ )
            {
                let ret = detail[i];
                let idx = ret["idx"];
                let offset = ret["offset"];
                if ( actType == eMJActType.eMJAct_Hu )
                {
                    this.mResults[idx].mHuScore += offset ;
                }
                else
                {
                    this.mResults[idx].mGangScore += offset ;
                }
                this.mResults[idx].idx = idx ;
            }

            if ( actType == eMJActType.eMJAct_Hu )
            {
                this.mIsLiuJu = false ;
                this.parseHuInfo( obj["msg"] );
            }
        }
        let players : Object[] = js["players"] ;
        for ( const itemPlayer of players )
        {
            let idx : number = itemPlayer["idx"];
            let offset : number = itemPlayer["offset"];
            let chip : number  = itemPlayer["chips"];
            let holdCards : number[] = itemPlayer["holdCard"];
            let itp = this.mResults[idx];
            itp.idx = idx ;
            itp.mFinalChip = chip ;
            itp.mOffset = offset ;
            for ( let i = 0; i < holdCards.length; i++)
            {
                itp.mAnHoldCards.push( holdCards[i] );
            }
        }

        // init data from room data 
        if ( this.mRoomData == null )
        {
            cc.error( "why room data is null for single result data" );
            return ;
        }
        
        for ( const item of this.mRoomData.mPlayers )
        {
            if ( null == item || item.isEmpty() )
            {
                continue ;
            }

            let pr = this.mResults[item.mPlayerBaseData.svrIdx];
            
            if ( pr.isEmpty() == false )
            {
                item.mPlayerBaseData.chip = pr.mFinalChip ;
                item.mPlayerCard.vHoldCard.length = 0 ;
                item.mPlayerCard.vHoldCard = item.mPlayerCard.vHoldCard.concat(pr.mAnHoldCards );
            }
        }
    }

    protected parseHuInfo( jsHuInfo : Object ) : void
    {
        let isZiMo = jsHuInfo["isZiMo"] == 1 ;
        let detail = jsHuInfo["detail"] ;
        if ( isZiMo )
        {
            let idx = detail["huIdx"];
            this.mResults[idx].mIsZiMo = true ;
            let vht : eFanxingType[] = detail["vhuTypes"] ;
            if ( vht != null )
            {
                for ( let i = 0; i < vht.length; i++ )
                {
                    if ( null == this.mResults[idx].mHuTypes )
                    {
                        this.mResults[idx].mHuTypes = [];
                    } 
                    this.mResults[idx].mHuTypes.push( vht[i] );
                }
            }
        }
        else
        {
            let huPlayers : Object[] = detail["huPlayers"] ;
            this.mDianPaoIdx = detail["dianPaoIdx"] ;
            for ( let i = 0; i < huPlayers.length; i++ )
            {
                let obj : Object = huPlayers[i];
                let idx : number  = obj["idx"] ;
                let vht : eFanxingType[] = obj["vhuTypes"] ;
                if ( vht != null )
                {
                    for ( let ht= 0; ht < vht.length; ht++ )
                    {
                        if ( null == this.mResults[idx].mHuTypes )
                        {
                            this.mResults[idx].mHuTypes = [];
                        } 
                        this.mResults[idx].mHuTypes.push( vht[ht] );
                    }                   
                }
                else
                {
                    if ( null == this.mResults[idx].mHuTypes )
                    {
                        this.mResults[idx].mHuTypes = [];
                    } 
                    this.mResults[idx].mHuTypes.push( eFanxingType.eFanxing_PingHu );
                }

            }
        }
    }

    isLiuJu() : boolean 
    {
        return this.mIsLiuJu ;
    }

    getSelfIdx() : number 
    {
        return this.mRoomData.getSelfIdx();
    }

    getResultItems() : ISingleResultDlgDataItem[] 
    {
        return this.mResults ;
    }

    // update (dt) {}
}
