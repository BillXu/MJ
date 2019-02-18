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
import DlgBase from "../../common/DlgBase"
import Utility from "../../globalModule/Utility";
@ccclass
export default class DlgJoinRoomOrClub extends DlgBase {

    @property([cc.Label])
    vInputLabel: cc.Label[] = [];

    @property(cc.Sprite)
    pClubTitle : cc.Sprite = null ;

    @property(cc.Sprite)
    pJoinRoomTitle : cc.Sprite = null ;

    private inputedCnt : number = 0 ;
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        super.onLoad();
        this.onClickClearAll();
    }

    start () {

    }

    showDlg( pfResult? : ( jsResult : Object ) => void, jsUserData? : any, pfOnClose? : ( pTargetDlg : DlgBase ) => void )
    {
        this.onClickClearAll();
        super.showDlg(pfResult,jsUserData,pfOnClose);
    }

    setDlgTitle( isJoinRoom : boolean )
    {
        this.pJoinRoomTitle.node.active = isJoinRoom ;
        this.pClubTitle.node.active = !isJoinRoom ;
    }

    onClickNumKey( btn : cc.Button, numb : string )
    {
        if ( this.inputedCnt >= this.vInputLabel.length )
        {
            console.log( "can not input more" );
            return ;
        }
        this.vInputLabel[this.inputedCnt++].string = numb ;
        
        // finish input 
        if ( this.vInputLabel.length == this.inputedCnt )
        {
            let strNum : string = "";
            this.vInputLabel.forEach(( label : cc.Label )=>{ strNum += label.string ;}) ;
            if ( this.pFuncResult )
            {
                console.log( "inform result" + strNum );
                this.pFuncResult(strNum);
            }
        }

        Utility.audioBtnClick();
    }

    onClickClearAll()
    {
        this.vInputLabel.forEach(( label : cc.Label )=>{ label.string = "" ;}) ;
        this.inputedCnt = 0 ;
        Utility.audioBtnClick();
    }

    onClickBackDel()
    {
        if ( this.inputedCnt == 0 )
        {
            console.log( "back del all" );
            return ;
        }
        this.vInputLabel[--this.inputedCnt].string = "";
        Utility.audioBtnClick();
    }

    // update (dt) {}
}
