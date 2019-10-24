import IClubLogData, { IClubLogDataItem } from "./IClubLogData";

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
class LogDataItem implements IClubLogDataItem
{
    logContent : string = "s安定后方爱说大话噶按劳动法sldhag 阿道夫" ;
    logTimeStr : string = "2019-8-8" ;
}

@ccclass
export default class ClubLogData implements IClubLogData {

    getLogItems() : IClubLogDataItem[] 
    {
        let cnt = 40 ;
        let v : IClubLogDataItem[] = [] ;
        while ( cnt-- )
        {
            v.push( new LogDataItem() );
        }
        return v ;
    }
}
