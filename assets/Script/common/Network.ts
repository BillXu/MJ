const {ccclass, property} = cc._decorator;
import {clientDefine} from "./clientDefine"
import { eMsgPort, eMsgType } from "./MessageIdentifer"
import { IOneMsgCallback } from "./NetworkInterface"
@ccclass
export default class Network{
    private static s_pNetwork : Network = null ;
    protected mWebSocket : WebSocket = null;
    protected mDstIP : string ;
    protected vMsgCallBack : [number,IOneMsgCallback][] = [];
    protected nSessionID : number = 0 ;
    protected isRecievedHeatBet : boolean = false ;
    protected nTimeoutHandleNum : number = -1 ;
    protected nReconnectInterval : number = -1 ;
    // when client side close connect , or reconnect error , onClose always be invoked , so we don't want this result ,
    // we only error one time is ok ;  
    protected isSkipOnCloseEnvet : boolean = false ; 
    private constructor () {}
    static getInstance() : Network
    {
        if ( Network.s_pNetwork == null )
        {
            Network.s_pNetwork = new Network();
        }
        return Network.s_pNetwork ;
    }
    
    getSessionID()
    {
        return this.nSessionID ;
    }

    tryNewDstIP( newIP : string )
    {
        this.mDstIP = newIP ;
    }

    // can ony invoke in init method , only invoke one time , connect other ip ,please use function : tryNewDstIP()
    connect( dstIP : string ) 
    {
       this.mDstIP = dstIP ;
       console.log( "direct connect to svr" );
       this.doConnect(); 
    }

    sendMsg( jsMsg : any , msgID : number, targetPort : number , targetID : number , callBack? : IOneMsgCallback ):boolean
    {
        if ( this.mWebSocket.readyState != WebSocket.OPEN )
        {
            cc.error( "socket is not open , can not send msgid = " + msgID );
            return false;
        }
        let jsPacket = { } ;
        jsMsg[clientDefine.msgKey] = msgID ;

        jsPacket["cSysIdentifer"] = targetPort ;
        jsPacket["nTargetID"] = targetID ;
        jsPacket["JS"] = JSON.stringify(jsMsg);
        this.mWebSocket.send(JSON.stringify(jsPacket)) ;

        console.log( "send msg : " + JSON.stringify(jsPacket) );
        if ( callBack != null ) // reg call back ;
        {
            let p : [ number , IOneMsgCallback] ;
            p = [msgID,callBack];
            this.vMsgCallBack.push(p) ; 
        }
        return true;
    }

    protected setSessionID( newSessionID : number )
    {
        this.nSessionID = newSessionID ;
    }
    
    protected doConnect()
    {
        if ( this.mWebSocket != null && ( this.mWebSocket.readyState == WebSocket.CONNECTING || WebSocket.OPEN == this.mWebSocket.readyState ) )
        {
            console.log( "ok = " + WebSocket.OPEN + "ing = " + WebSocket.CONNECTING );
            cc.error( "alredy doing reconnect , so need not connect state : " + this.mWebSocket.readyState  );
            return ;
        }

        console.log( "do connecting..." );
        this.mWebSocket = new WebSocket(this.mDstIP) ;
        this.mWebSocket.onclose = this.onClose.bind(this) ; 
        this.mWebSocket.onopen = this.onOpen.bind(this); ;
        this.mWebSocket.onmessage = this.onMsg.bind(this) ;
        this.mWebSocket.onerror = this.onError.bind(this);
    }

    protected onClose( ev: CloseEvent )
    {
        // if ( this.mWebSocket != null && ( this.mWebSocket.readyState == WebSocket.CONNECTING || WebSocket.OPEN == this.mWebSocket.readyState ) )
        // {
        //     cc.log( "alredy doing reconnect , so need not connect state : " + this.mWebSocket.readyState  );
        //     return ;
        // }

        // console.log(" on closed  try again  " + ev.data );
        // if ( this.nDelayConnectTimeoutHandleNum != -1 )
        // {
        //     console.log( "already delay connect , give this time onClose" );
        //     return ;
        // }

        // let self = this ;
        // this.nDelayConnectTimeoutHandleNum = setTimeout(function() {
        //     cc.log("do reconnecting onClose");
        //     self.nDelayConnectTimeoutHandleNum = -1 ;
        //     self.doConnect();
        // }, 1000);

        if ( this.mWebSocket != null && WebSocket.OPEN == this.mWebSocket.readyState )
        {
            cc.error( "socke already open , should not recived close event" );
            return ;
        }

        if ( this.isSkipOnCloseEnvet )
        {
            console.log( "skip on close event" );
            return ;
        }

        console.log( "on colse " );
        this.isSkipOnCloseEnvet = true ; // we do on close event invoke twice , before connected success ;

        console.log("stop heat beat");
        clearTimeout(this.nTimeoutHandleNum); // sytem tell or heatbeat time out , lead to on close ,we should stop heatBet ;
        this.nTimeoutHandleNum = -1 ;

        // dispatch event ;
        let pEvent = new cc.Event.EventCustom(clientDefine.netEventClose,true) ;
        cc.systemEvent.dispatchEvent(pEvent);
        if ( -1 == this.nReconnectInterval )
        {
            this.doConnect();
            this.doTryReconnect();
        }
    }

    protected close()
    {
        console.log( "self colse" );
        this.mWebSocket.close();
    }

    protected onOpen( ev : any )
    {
        console.log(" on open +  " + this.mWebSocket.readyState );
        if ( this.nReconnectInterval != -1 )
        {
            console.log("clear time out ");
            clearInterval(this.nReconnectInterval);
            this.nReconnectInterval = -1 ;
        }
        this.isSkipOnCloseEnvet = false ; // reset flag ;

        // start heat beat ;
        if ( -1 != this.nTimeoutHandleNum )
        {
            clearTimeout(this.nTimeoutHandleNum) ;
        }
        this.doSendHeatBet();

        // verify client ;
        let jsMsg = {} ;
        let self = this ;
        this.sendMsg(jsMsg,eMsgType.MSG_VERIFY_CLIENT,eMsgPort.ID_MSG_PORT_GATE,0 , ( jsm :any)=>
        {
            let pEvent : any ;
            if ( jsm["nRet"] != 0 )
            {
                cc.error("can not verify this client ret :" + jsm["nRet"] );
                pEvent = new cc.Event.EventCustom(clientDefine.netEventFialed,true) ;
                cc.systemEvent.dispatchEvent(pEvent);
                return ;
            }

            // decide if need reconnect 
            if ( self.getSessionID() == 0 ) // we need not reconnect 
            {
                self.setSessionID( jsm["nSessionID"] );
                pEvent = new cc.Event.EventCustom(clientDefine.netEventOpen,true) ;
                pEvent.detail = self.getSessionID();
                cc.systemEvent.dispatchEvent(pEvent);
                cc.log("verifyed session id = " + jsm["nSessionID"] + " ret =" + jsm["nRet"] );
                return ;
            }
            
            // we need do reconnect 
            let jsRec = {};
            jsRec["nSessionID"] = self.getSessionID();
            self.sendMsg(jsRec,eMsgType.MSG_RECONNECT,eMsgPort.ID_MSG_PORT_GATE,0,( jsRet : any)=>{
                let ret : number = jsRet["nRet"];
                self.setSessionID(jsRet["sessionID"]);
                let ev : any = clientDefine.netEventReconnectd ;
                if ( 0 != ret ) // reconnect ok 
                {
                    ev = clientDefine.netEventReconnectdFailed ;
                }
                let pEvent = new cc.Event.EventCustom(ev,true) ;
                pEvent.detail = self.getSessionID();
                cc.systemEvent.dispatchEvent(pEvent);
                return true ;
            } ) ;
            
            cc.log("verifyed session id = " + jsm["nSessionID"] + " ret =" + jsm["nRet"] + "do reconnect" );
            return true ;
        } ) ;      
    }

    protected onMsg( ev : any )
    {
        //cc.log(" on msg " + ev.data );
        if ( ev.data == "H" )
        {
            //cc.log(" do read heat bet on msg " + ev.data );
            this.isRecievedHeatBet = true ;
            return ;
        }

        console.log(" on msg " + ev.data );
        let msg = JSON.parse(ev.data) ;
        if ( msg == null )
        {
            cc.error("can not pase set msg : " + ev.data );
            return ;
        }

        let nMsgID : number = msg[clientDefine.msgKey];
        // check call back 
        for ( let idx = 0 ; idx < this.vMsgCallBack.length; ++idx )
        {
            if ( this.vMsgCallBack[idx][0] != nMsgID )
            {
                continue ;
            }
            let isCapture = this.vMsgCallBack[idx][1](msg);
            this.vMsgCallBack.splice(idx,1);
            if ( false == isCapture )
            {
                break ;
            }
            return  ;
        }
       //console.log("dispath msg id " + msg );
        /// dispatch event ;
        let pEvent = new cc.Event.EventCustom(clientDefine.netEventMsg,true) ;
        pEvent.detail = {};
        pEvent.detail[clientDefine.msgKey] = nMsgID ;
        pEvent.detail[clientDefine.msg] = msg ;
        cc.systemEvent.dispatchEvent(pEvent);
    }

    protected onError( ev : Event )
    {
        this.isSkipOnCloseEnvet = true ;
        cc.log(" on error  " );
        // if ( this.mWebSocket != null && ( this.mWebSocket.readyState == WebSocket.CONNECTING || WebSocket.OPEN == this.mWebSocket.readyState ) )
        // {
        //     cc.log( "alredy doing reconnect , so need not connect state : " + this.mWebSocket.readyState  );
        //     return ;
        // }

        // if ( this.nDelayConnectTimeoutHandleNum != -1 )
        // {
        //     console.log( "already delay connect , give this time onError" );
        //     return ;
        // }

        // let self = this ;
        // this.nDelayConnectTimeoutHandleNum = setTimeout(function() {
        //     cc.log("do reconnecting error");
        //     this.nDelayConnectTimeoutHandleNum = -1 ;
        //     self.doConnect();
        // }, 1000);
        
        let pEvent = new cc.Event.EventCustom(clientDefine.netEventFialed,true) ;
        cc.systemEvent.dispatchEvent(pEvent);
        if ( -1 == this.nReconnectInterval )
        {
            this.doConnect();
            this.doTryReconnect();
        }
    }

    protected doSendHeatBet()
    {
        // send heat bet ;
        if ( this.mWebSocket.readyState != WebSocket.OPEN )
        {
            cc.error( "socket is not open , can not send heat bet " );
            return ;
        }

        let p = 'H' ;
        this.mWebSocket.send(p);
        this.isRecievedHeatBet = false ;
        let self = this ;
        this.nTimeoutHandleNum = setTimeout(function() {
            if ( self.isRecievedHeatBet == false )
            {
                if ( self.mWebSocket.readyState != WebSocket.OPEN )
                {
                    cc.log("already known disconnect so need not notify close");
                    return ;
                }

                // do disconnected ; heat beat time out 
                console.log( "heat bet out , invoke on close event" )
                self.close();
                self.onClose(undefined);
            }
            else
            {
                self.doSendHeatBet();
            }
        }, clientDefine.time_heat_bet * 1000 );
    }

    protected doTryReconnect()
    {
       let self = this ;
       this.nReconnectInterval = setInterval(()=>{ console.log("interval try connect"); self.doConnect();},2000);
    }
}
