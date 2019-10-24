import IClubMessageData, { IClubMessageDataItem } from "./IClubMessageData";

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
class item implements IClubMessageDataItem
{
    eventID : number = 1 ;
    messageContent : string = "this is message content " ;
}

@ccclass
export default class ClubMessageData implements IClubMessageData {

    getMessageItems() : IClubMessageDataItem[] 
    {
        let cnt = 20 ;
        let v : IClubMessageDataItem[] = [] ;
        while ( cnt-- )
        {
            v.push( new item() );
        }
        return v ;
    }

    reqProcessMessage( eventID : number , isAgree : boolean ) : boolean 
    {
        return false ;
    }
}
