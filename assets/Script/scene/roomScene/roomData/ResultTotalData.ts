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

export class ResultTotalDataItem 
{
    uid : number = 0 ;
    huCnt : number = 0 ;
    gangCnt : number = 0 ;
    dianPaoCnt : number = 0 ;
    SingleBestWin : number = 0 ;
    final : number = 0 ;
    waitTime : number = 0 ;
}

export default class ResultTotalData {

    mResults : ResultTotalDataItem[] = [];
    mBigWinerUID : number[] = [] ;
    mApplyDismissID : number = 0 ;
    mTuHaoID : number[] = [] ;

    isRecived() : boolean
    {
        return this.mResults.length > 0 ;
    }

    parseResult( js : Object )
    {
        if ( js["dismissID"] != null )
        {
            this.mApplyDismissID = js["dismissID"] ;
        }

        let jsRs : Object[] = js["result"];
        for ( const jsobj of jsRs )
        {
            let p = new ResultTotalDataItem();
            p.uid = jsobj["uid"];
            p.dianPaoCnt = jsobj["dianPaoCnt"];
            p.final = jsobj["final"];
            p.gangCnt = (jsobj["anGangCnt"] + jsobj["mingGangCnt"]);
            p.huCnt = jsobj["huCnt"];
            p.waitTime = jsobj["extraTime"] / 60 ;
            this.mResults.push(p);
        }

        // find tu hao , and big winer ;
        let tuHaoLose = -1 ;
        let nBigWiner = 1 ;
        for ( const item of this.mResults )
        {
            if ( tuHaoLose > item.final )
            {
                this.mTuHaoID.length = 0;
                this.mTuHaoID.push( item.uid );
                tuHaoLose = item.final ;
            }

            if ( item.final == tuHaoLose )
            {
                this.mTuHaoID.push( item.uid );
            }

            if ( nBigWiner < item.final )
            {
                this.mBigWinerUID.length = 0;
                this.mBigWinerUID.push(item.uid );
                nBigWiner = item.final ;
            }

            if ( nBigWiner == item.final )
            {
                this.mBigWinerUID.push(item.uid );
            }
        }
    }
}
