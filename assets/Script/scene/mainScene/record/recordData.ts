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
export class RecorderOffset
{
    uid : number = 0 ;
    name : string = "" ;
    offset : number = 0 ;
}

export class RecordItem
{
    roomID : number = 0 ;
    time : number = 0 ;
    sieralNum : number = 0 ;
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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    fetchData()
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
            }
        };
        xhr.open("GET", "http://api.youhoox.com/cfmj.new.uid.php?uid=15&self=true", true);
        xhr.send();
    }

    fetchRecordDetail( sieralNum : number ) 
    {

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
