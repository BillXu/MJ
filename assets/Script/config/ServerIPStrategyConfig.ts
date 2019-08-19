import IConfig from "./IConfig";

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
export default class ServerIPStrategyConfig implements IConfig {

    private vDefaultIP : string[] = ["192.168.1.24","192.168.1.24"]; 
    private _exclusiveIP : string = "" ;
    private _isUseExclusiveIP : boolean = false ;
    private _port : string = "40012" ;
    init()
    {
        let eip = cc.sys.localStorage.getItem("exclusiveIP");
        if ( null != eip )
        {
            this._exclusiveIP = eip ;
        }
    }

    onAppHide()
    {
        cc.sys.localStorage.setItem( "exclusiveIP",this._exclusiveIP );
    }

    onClearLogout()
    {
        this._exclusiveIP = "" ;
        this._isUseExclusiveIP = false ;
    }

    onConnectResult( isSuccess : boolean )
    {
        if ( isSuccess )
        {
            this._isUseExclusiveIP = false ;
            return ;
        }

        this._isUseExclusiveIP = !this._isUseExclusiveIP ;
    }

    setExclusiveIP( ip : string )
    {
        this._exclusiveIP = ip ;
    }

    getSvrIP( magicNum : number )
    {
        let ip : string = "" ;
        if ( this._isUseExclusiveIP && this._exclusiveIP.length > 6 )
        {
            ip = this._exclusiveIP ;
        }
        else
        {
            ip = this.vDefaultIP[magicNum%this.vDefaultIP.length] ;
        }
        
        return "ws://" + ip + ":" + this._port ;
    }
}
