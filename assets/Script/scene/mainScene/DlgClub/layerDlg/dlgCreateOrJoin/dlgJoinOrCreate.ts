import DlgBase from "../../../../../common/DlgBase";

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
@ccclass
export default class OptsJoinOrCreate extends DlgBase {
    
    onBtnJoin()
    {
        if ( this.pFuncResult != null )
        {
            this.pFuncResult(0);
        }
        this.closeDlg();
    }

    onBtnCreate()
    {
        if ( this.pFuncResult != null )
        {
            this.pFuncResult(1);
        }
        this.closeDlg();
    }
}
