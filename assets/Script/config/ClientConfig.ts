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
export default class ClientConfig implements IConfig {

    private _version : string = "1.0.0" ;
    private _downloadUrl : string = "http://qq.com" ;
    private _maxHoldSelfRecorderCnt : number = 40 ;

    private _curValidAccount : string = "" ;
    private _curValidPwd : string = "" ;

    get VERSION() : string
    {
        return this._version ;
    } 

    get APP_DOWNLOAD_URL() : string 
    {
        return this._downloadUrl ;
    }
    
    get maxCacheRecorderCnt() : number 
    {
        return this._maxHoldSelfRecorderCnt ;
    }
    
    get validAccount() : string
    {
        return this._curValidAccount ;
    }

    get validPassword() : string 
    {
        return this._curValidPwd ;
    }

    isHaveValidAccount() : boolean
    {
        return this.validAccount.length > 0 ;
    }

    storeValidAccound( acc : string , pwd : string )
    {
        this._curValidAccount = acc ;
        this._curValidPwd = pwd ;
    }

    init()
    {
        let acc = cc.sys.localStorage.getItem( "account" );
        if ( null != acc )
        {
            this._curValidAccount = acc ;
        }

        let pwd = cc.sys.localStorage.getItem( "password");
        if ( null != pwd )
        {
            this._curValidPwd = pwd ;
        }
    }

    onAppHide()
    {
        if ( this.isHaveValidAccount() )
        {
            cc.sys.localStorage.setItem("account",this._curValidAccount);
            cc.sys.localStorage.setItem("password",this._curValidPwd );
        }
    }

    onClearLogout()
    {
        this._curValidAccount = "" ;
        this._curValidPwd = "" ;
    }
}
