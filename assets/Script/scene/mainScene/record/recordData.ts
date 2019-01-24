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
import PlayerBrifdata from "./playerBrifedata"
import Utility from "../../../globalModule/Utility";
import { eGameType } from "../../../common/clientDefine";
export class RecorderOffset
{
    uid : number = 0 ;
    name : string = "" ;
    offset : number = 0 ;
}

export class RecordItem
{
    roomID : number = 0 ;
    time : string = "" ;
    sieralNum : number = 0 ;
    replayID : number = 0 ;
    vOffset : RecorderOffset[] = [] ;
    rule : string = "" ;
    vSingleDetail : RecordItem[] = [] ;
}

@ccclass
export default class RecordData extends cc.Component {

    @property(PlayerBrifdata)
    pPlayersData : PlayerBrifdata = null ;

    @property([cc.Component.EventHandler])
    vlpfCallBack : cc.Component.EventHandler[] = [] ;

    vRecorder : RecordItem[] = [] ;

    isDataEmpty(){ return this.vRecorder.length == 0 ;}

    currentID  : number  = 0 ;
    isClub : boolean = false ;

    nLastFeatchData : number = 0 ;

    nRefreshRate : number = 30 ; // seconds
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    isMustFeatchData()
    {
        let now = Date.now();
        if ( now - this.nLastFeatchData > this.nRefreshRate*1000 || this.isDataEmpty() )
        {
            return true ;
        }
        return false ;
    }

    doRecievedData()
    {
        this.nLastFeatchData = Date.now();
    }

    fetchData()
    {
        let url = "" ;
        if ( this.isClub )
        {
            url = "http://api.youhoox.com/cfmj.new.club.php?club_id="+this.currentID ;
        }
        else
        {
            url = "http://api.youhoox.com/cfmj.new.uid.php?uid=" + this.currentID + "&self=true";
        }
        var xhr = new XMLHttpRequest();
        let self = this ;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                let js : Object[] = JSON.parse(response) ;
                if ( js == null )
                {
                    Utility.showPromptText( "获取战绩为空" );
                }
                else
                {
                    self.parseRecorder(js);
                }
                self.doRecievedData();
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }

    protected parseRecorder( js : Object[] )
    {
        for ( let v of js )
        {
            let sieal = v["sieralNum"];
            if ( this.getRecroderBySieralNum(sieal) )
            {
                continue ;
            }

            let p = new RecordItem();
            p.roomID = v["roomID"] ;
            p.rule = this.optsToRuleString(v["opts"]);
            p.sieralNum = sieal;
            let t = v["time"] ;
            let pDate = new Date(t * 1000 ) ;
            p.time = pDate.toLocaleString("zh-CN");
            
            let vOffset : Object[] = v["offsets"] ;
            for ( let offset of vOffset )
            {
                let of = new RecorderOffset();
                of.uid = parseInt(offset["userUID"]) ;
                of.offset = offset["offset"] ;
                let pn = this.pPlayersData.getPlayerDetailByUID(of.uid) ;
                if ( pn )
                {
                    of.name = pn["name"] ;
                }
                p.vOffset.push(of);
            }
            this.vRecorder.push(p);
        }
        cc.Component.EventHandler.emitEvents(this.vlpfCallBack,this.vRecorder,false) ;
    }

    fetchRecordDetail( sieralNum : number ) 
    {
        let recorderItem = this.getRecroderBySieralNum(sieralNum);
        if ( null == recorderItem )
        {
            Utility.showPromptText( "序列号对应的记录为空" + sieralNum );
            return ;
        }

        if ( recorderItem.vSingleDetail.length > 0 )
        {
            cc.Component.EventHandler.emitEvents(this.vlpfCallBack,recorderItem.vSingleDetail,true) ;
            return ;
        }

        let url = "http://api.youhoox.com/cfmj.new.serial.php?serial="+ sieralNum ;
        var xhr = new XMLHttpRequest();
        let self = this ;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                let js : Object[] = JSON.parse(response) ;
                if ( js == null )
                {
                    Utility.showPromptText( "获取战绩详情为空" );
                }
                else
                {
                    self.parseRecorderDetail(recorderItem,js);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }

    protected parseRecorderDetail( recorderItem : RecordItem ,js : Object[] )
    {
        for ( let v of js )
        {
            let pItem = new RecordItem();
            pItem.roomID = recorderItem.roomID ;
            pItem.rule = recorderItem.rule ;
            pItem.time = v["time"] ;
            pItem.replayID = v["replayID"] ;
            let vOffset : Object[] = v["resultDetail"] ;
            for ( let offset of vOffset )
            {
                let of = new RecorderOffset();
                of.uid = offset["uid"] ;
                of.offset = offset["offset"] ;
                let pn = this.pPlayersData.getPlayerDetailByUID(of.uid) ;
                if ( pn )
                {
                    of.name = pn["name"] ;
                }
                pItem.vOffset.push(of);
            }
            
            recorderItem.vSingleDetail.push(pItem);
        }
        cc.Component.EventHandler.emitEvents(this.vlpfCallBack,recorderItem.vSingleDetail,true) ;
    }

    getRecroderBySieralNum( sieral : number ) : RecordItem
    {
        for ( let v of this.vRecorder )
        {
            if ( v.sieralNum == sieral )
            {
                return v ;
            }
        }

        return null ;
    }

    protected optsToRuleString( opts : Object )
    {
        if ( opts == null )
        {
            console.error( "recorder opts key is null" );
            return ;
        }

        let ruleString = "" ;
        // wan fa ;
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
                ruleString += "赤峰麻将" ;
            }
            break ;
            case eGameType.eGame_AHMJ:
            {
                ruleString += "敖汉麻将" ;
            }
            break ;
            case eGameType.eGame_NCMJ:
            {
                ruleString += "宁城麻将" ;
            }
            break ;
            default:
            ruleString +="其他麻将" ;
        }

        ruleString += "   "+seatCnt + "人";
        ruleString += "   " + roundOrCircleCnt + (isCirle ? "圈" : "局");
        ruleString += "   " + ( payType == 0 ? "房主扣卡" : "AA扣卡" );
        ruleString += isGuapu ? "    对铺" : "" + isEnableStopCheat ? "    防作弊" : "";
        return ruleString ;
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

    onRecievedBrifData( msg : Object )
    {
        let uid : number = msg["uid"] ;
        let name : string = msg["name"] ;
        this.vRecorder.forEach( ( r : RecordItem )=>{
            r.vOffset.forEach( ( of : RecorderOffset )=>{
                if ( of.uid == uid )
                {
                    of.name = name ;
                }
            } );
        } );
    }
}
