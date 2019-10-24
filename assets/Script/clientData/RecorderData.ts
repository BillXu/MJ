import ClientApp from "../globalModule/ClientApp";

 // Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export interface IRecorderEntry
{
    vOffsets : PlayerOffsetItem[] ;
    strTime : string ;
}

export interface IRecorderOneRound extends IRecorderEntry
{
    replayID : number ;
}

export interface IRecorderRoom extends IRecorderEntry
{
    roomID : number ;
    rule : string;
    sieralNum : number; 
    vSingleRoundRecorders : IRecorderOneRound[];
}
 
export class PlayerOffsetItem   {
    uid : number = 0 ;
    offset : number = 0 ;
}

export class RecorderSinglRoundEntry implements IRecorderOneRound
{
    replayID : number = 0 ;
    strTime : string = "" ;
    vOffsets : PlayerOffsetItem[] = [] ;

    parseData( jsData : Object )
    {
        this.strTime = jsData["time"] ;
        this.replayID = jsData["replayID"] ;
        let vOffset : Object[] = jsData["resultDetail"] ;
        for ( let offset of vOffset )
        {
            let of = new PlayerOffsetItem();
            of.uid = offset["uid"] ;
            of.offset = offset["offset"] ;
            this.vOffsets.push(of);
        }
    }
}

export class RecorderRoomEntry implements IRecorderRoom
{
    roomID : number = 0 ;
    rule : string = "";
    strTime : string = "" ;
    sieralNum : number = 0 ; 
    vOffsets : PlayerOffsetItem[] = [] ;
    vSingleRoundRecorders : IRecorderOneRound[] = [] ;

    parseData( jsData : Object )
    {
        this.roomID = jsData["roomID"] ;
        this.rule = "rule default";//jsData["opts"];
        this.sieralNum = jsData["sieralNum"];
        let t = jsData["time"] ;
        let pDate = new Date(t * 1000 ) ;
        this.strTime = pDate.toLocaleString("zh-CN");
        
        let vOffset : Object[] = jsData["offsets"] ;
        for ( let offset of vOffset )
        {
            let of = new PlayerOffsetItem();
            of.uid = parseInt(offset["userUID"]) ;
            of.offset = offset["offset"] ;
            this.vOffsets.push(of);
        }
    }

    fetchSingleRoundRecorders( pResultCallBack : ( data : RecorderRoomEntry )=>void )
    {
        if ( this.vSingleRoundRecorders.length  > 0 )
        {
            pResultCallBack(this);
            return ;
        }

        let url = "http://api.youhoox.com/cfmj.new.serial.php?serial="+ this.sieralNum ;
        var xhr = new XMLHttpRequest();
        let self = this ;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                let js : Object[] = JSON.parse(response) ;
                if ( js == null )
                {
                    pResultCallBack(null);
                }
                else
                {
                    for ( let v of js )
                    {
                        let pItem = new RecorderSinglRoundEntry();
                        pItem.parseData(v);
                        self.vSingleRoundRecorders.push(pItem);
                    }
                    pResultCallBack(self);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }
}

export default class RecorderData
{
    vRecorder : RecorderRoomEntry[] = [] ;

    private nOwnerID : number = 0 ;
    private isOwnerClub : boolean = false ;

    private nCacherMaxSerialNum : number = 0 ;
    private nLastFetchDataTime : number = 0 ;

    init( ownerID : number , isClub : boolean = false )
    {
        this.nOwnerID = ownerID ;
        this.isOwnerClub = isClub ;
        this.nCacherMaxSerialNum = 0 ;
        this.nLastFetchDataTime = 0 ;
    }

    fetchData( pResultCallBack : ( data : RecorderData )=>void )
    {
        let now = Date.now();
        if ( now - this.nLastFetchDataTime < 30*1000 ) // at least, half minite  will refresh data 
        {
            pResultCallBack(this) ;
            return ;
        }

        let url = "" ;
        if ( this.isOwnerClub )
        {
            url = "http://api.youhoox.com/cfmj.new.club.php?club_id="+this.nOwnerID ;
        }
        else
        {
            url = "http://api.youhoox.com/cfmj.new.uid.php?uid=" + this.nOwnerID + "&self=false";
        }
        let self = this ;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                let js : Object[] = JSON.parse(response) ;
                if ( js == null )
                {
                    pResultCallBack(null);
                }
                else
                {
                    self.parseRecorder(js);
                    pResultCallBack(self);
                    self.nLastFetchDataTime = Date.now();
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }

    onPlayerClearLogout()
    {
        this.vRecorder.length = 0 ;
        this.nCacherMaxSerialNum = 0 ;
        this.nLastFetchDataTime = 0 ;
        this.nOwnerID = 0 ;
        this.isOwnerClub = false ;
    }

    protected parseRecorder( js : Object[] )
    {
        let maxHoldRecordCnt = ClientApp.getInstance().getConfigMgr().getClientConfig().maxCacheRecorderCnt ;
        let resultCnt = js.length + this.vRecorder.length ;
        if ( resultCnt > maxHoldRecordCnt )
        {
            let eraseCnt = ( resultCnt - maxHoldRecordCnt ) ;
            eraseCnt = Math.min(this.vRecorder.length , eraseCnt);
            while ( eraseCnt-- )
            {
                this.vRecorder.pop();
            }
        }

        for ( let v of js )
        {
            let sieal = v["sieralNum"];
            if ( sieal <= this.nCacherMaxSerialNum )
            {
                continue ;
            }

            if ( sieal > this.nCacherMaxSerialNum  )
            {
                this.nCacherMaxSerialNum = sieal ;
            }

            let p = new RecorderRoomEntry();
            p.parseData(v);
            this.vRecorder.unshift(p);
        }
    }
}


