import IClubRecorderData from "./IClubRecorderData";
import { IRecorderRoom, RecorderRoomEntry, RecorderSinglRoundEntry, PlayerOffsetItem } from "../../../../clientData/RecorderData";

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
export default class ClubRecorderData implements IClubRecorderData {

    getRecorderItems() : IRecorderRoom[] 
    {
        let pOf = new PlayerOffsetItem();
        pOf.offset = 10 ;
        pOf.uid = 100 ;

        let v : IRecorderRoom[] = [] ;
        let cnt = 8 ;
        while ( cnt-- )
        {
            let p = new RecorderRoomEntry() ;
            p.roomID = 201601 + cnt ;
            p.vOffsets.push(pOf);
            p.vOffsets.push(pOf);
            p.vOffsets.push(pOf);
            p.vOffsets.push(pOf);
            p.strTime = "2019-4-2" ;
            p.rule = "this is rule" ;

            let subCnt = 10 ;
            while ( subCnt-- )
            {
                let s = new RecorderSinglRoundEntry();
                s.strTime = "2018-4-2" ;
                s.replayID = subCnt ;
                s.vOffsets.push(pOf);
                s.vOffsets.push(pOf);
                s.vOffsets.push(pOf);
                s.vOffsets.push(pOf);
                p.vSingleRoundRecorders.push(s);
            }
            v.push(p);
        }

        return v ;
    }
}
