import DlgBase from "../../../../../common/DlgBase";
import Utility from "../../../../../globalModule/Utility";

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
export default class DlgCreateClubVerify extends DlgBase {

    @property(cc.EditBox)
    pName: cc.EditBox = null;

    @property(cc.EditBox)
    pPhoneNumer: cc.EditBox = null;

    @property(cc.EditBox)
    pCode: cc.EditBox = null;

    @property(cc.Button)
    pFeatchCodeBtn : cc.Button = null ;

    @property(cc.Label)
    pFeatchCodeTimer : cc.Label = null ;

    // LIFE-CYCLE CALLBACKS:
    featchCodeBtnTimeSeconds : number = 0 ;
    // onLoad () {}

    start () {
        
    }

    onClickFetachCode()
    {
        if ( this.pName.string.length < 1 )
        {
            Utility.showTip( "俱乐部名字不能为空" );
            return ;
        }

        if ( this.pPhoneNumer.string.length != 11 )
        {
            Utility.showTip( "手机号长度错误" );
            return ;
        }

        if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.pPhoneNumer.string)))
        {
            Utility.showTip( "手机号格式错误" );
            return ;
        }

        this.pFeatchCodeBtn.interactable = false ;
        this.pFeatchCodeTimer.node.active = true ;
        this.featchCodeBtnTimeSeconds = 60 ;
        this.pFeatchCodeTimer.string = this.featchCodeBtnTimeSeconds.toString() ;
        let self = this ;
        this.schedule(()=>{
            if ( self.featchCodeBtnTimeSeconds > 0 )
            {
                --self.featchCodeBtnTimeSeconds;
                self.pFeatchCodeTimer.string = self.featchCodeBtnTimeSeconds.toString() ;
            }
            else
            {
                self.pFeatchCodeBtn.interactable = true ;
                self.pFeatchCodeTimer.node.active = false ;
                self.unscheduleAllCallbacks();
            }
        },1,this.featchCodeBtnTimeSeconds) ;

        // do send http request to featch code ;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                let response = xhr.responseText;
                let ret : Object = JSON.parse(response);
                if ( ret["status"] == "fail")
                {
                    Utility.showTip(ret["message"]);
                }
            }
        };
        let url = "http://cf2.youhoox.com/?ct=club&ac=send_code&mobile=" + this.pPhoneNumer.string ;
        xhr.open("GET", url, true);
        xhr.send();
        Utility.audioBtnClick();
    }

    onClickNext()
    {
        if ( CC_DEBUG || 1 )
        {
            this.pFuncResult(this.pName.string) ;
            this.closeDlg();
            Utility.showPromptText("测试环境，不验证手机号");
            return ;
        } 

        if ( this.pName.string.length < 1 )
        {
            Utility.showTip( "俱乐部名字不能为空" );
            return ;
        }

        if ( this.pCode.string.length == 0 )
        {
            Utility.showTip( "验证码不能为空" );
            return ;
        }

        if ( this.pPhoneNumer.string.length != 11 )
        {
            Utility.showTip( "手机号长度错误" );
            return ;
        }

        if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.pPhoneNumer.string)))
        {
            Utility.showTip( "手机号格式错误" );
            return ;
        }

        // do check code 
        let self = this ;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                let response = xhr.responseText;
                console.log(response);
                let ret : Object = JSON.parse(response);
                if ( ret["status"] != "fail")
                {
                    self.pFuncResult(self.pName.string) ;
                    self.closeDlg();
                }
            }
        };
        let url = "http://cf2.youhoox.com/?ct=club&ac=check_code&mobile=" + this.pPhoneNumer.string + "&code=" + this.pCode.string;
        xhr.open("GET", url, true);
        xhr.send();

        Utility.audioBtnClick();
    }

    // update (dt) {}
}
