let clientDefine = 
{
    time_heat_bet : 3,
    netEventOpen : "open",
    netEventFialed : "failed",
    netEventMsg : "msg",
    netEventClose : "close",
    netEventReconnectd : "reconnect",
    netEventReconnectdFailed : "reconnectFailed",
    netEventRecievedBaseData : "recievedBaseData",
    msgKey : "msgID",
    msg : "msg"
} ;

let SceneName =
{
    Scene_Load : "loading",
    Scene_login : "login",
    Scene_Main : "main",
    Scene_Room : "room",
    Scene_Replay : "replay",
}

export { clientDefine , SceneName }  ;