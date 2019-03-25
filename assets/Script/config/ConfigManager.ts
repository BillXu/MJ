import IConfig from "./IConfig";
import ClientConfig from "./ClientConfig";
import ServerIPStrategyConfig from "./ServerIPStrategyConfig";
import SettingConfig from "./SettingConfig";

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
enum eConfig
{
    eConfig_Client,
    eConfig_ServerIPStrategy,
    eConfig_Setting,
    eConfig_Max,
} ;

@ccclass
export default class ConfigManager {

    private _vConfigs : { [ key : number] : IConfig } = {} ;

    getSettingConfig() : SettingConfig
    {
        return <SettingConfig>this._vConfigs[eConfig.eConfig_Setting] ;
    }

    getClientConfig() : ClientConfig
    {
        return <ClientConfig>this._vConfigs[eConfig.eConfig_Client] ;
    }

    getServerIPStrategyConfig()
    {
        return <ServerIPStrategyConfig>this._vConfigs[eConfig.eConfig_ServerIPStrategy] ;
    }

    init()
    {
        this._vConfigs[eConfig.eConfig_Client] = new ClientConfig();
        this._vConfigs[eConfig.eConfig_ServerIPStrategy] = new ServerIPStrategyConfig();
        this._vConfigs[eConfig.eConfig_Setting] = new SettingConfig();
        
        for( const key of Object.keys(this._vConfigs)) {
            if(this._vConfigs.hasOwnProperty(key))
            {
                this._vConfigs[key].init();
            }
        }
    }

    onAppHide()
    {
        for( const key of Object.keys(this._vConfigs)) {
            if(this._vConfigs.hasOwnProperty(key))
            {
                this._vConfigs[key].onAppHide();
            }
        }
    }

    onClearLogout()
    {
        for( const key of Object.keys(this._vConfigs)) {
            if(this._vConfigs.hasOwnProperty(key))
            {
                this._vConfigs[key].onClearLogout();
            }
        }
    }
}
