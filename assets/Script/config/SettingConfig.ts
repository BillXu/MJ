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
export default class SettingConfig implements IConfig {

    private jsConfigData : Object = {} ;

    set effectVolume( v : number )
    {
        this.jsConfigData["_effectVolume"] = v;
    }

    get effectVolume() : number 
    {
        let v = this.jsConfigData["_effectVolume"];
        if ( v == null )
        {
            return 0.5 ;
        }
        return v  ;
    }

    set musicVolume( v : number )
    {
        this.jsConfigData["_musicVolume"] = v;
    }

    get musicVolume() : number
    {
        let v = this.jsConfigData["_musicVolume"];
        if ( v == null )
        {
            return 0.5 ;
        }
        return v  ;
    }

    set musicTypeIdx( v : number )
    {
        this.jsConfigData["_musicTypeIdx"] = v;
    }

    get musicTypeIdx() : number
    {
        let v = this.jsConfigData["_musicTypeIdx"];
        if ( v == null )
        {
            return 0 ;
        }
        return v  ;
    }

    set deskBgIdx( v : number )
    {
        this.jsConfigData["_deskBgIdx"] = v;
    }

    get deskBgIdx() : number
    {
        let v = this.jsConfigData["_deskBgIdx"];
        if ( v == null )
        {
            return 0 ;
        }
        return v  ;
    }

    set isLocalSpeach( v : boolean )
    {
        this.jsConfigData["_islocalspeach"] = v ? 1 : 0;
    }

    get isLocalSpeach() : boolean
    {
        let v = this.jsConfigData["_islocalspeach"];
        if ( v == null )
        {
            return false ;
        }
        
        return v == 1  ;
    }

    set mjBgIdx( v : number )
    {
        this.jsConfigData["_mjBgIdx"] = v;
    }

    get mjBgIdx() : number
    {
         let v = this.jsConfigData["_mjBgIdx"];
         if ( v == null )
         {
             return 0 ;
         }
         return v  ;
    }


    init()
    {
        let s = cc.sys.localStorage.getItem("setting");
        if ( null != s )
        {
            this.jsConfigData = JSON.parse(s) ;
        }
    }
    
    onAppHide()
    {
        let s = JSON.stringify(this.jsConfigData) ;
        cc.sys.localStorage.setItem( "setting", s );
    }

    onClearLogout()
    {
        this.jsConfigData = {} ;
    }
    
}
