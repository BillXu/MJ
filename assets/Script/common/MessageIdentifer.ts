export enum eMsgPort
{
	ID_MSG_PORT_NONE, // client to game server 
	ID_MSG_PORT_CLIENT = ID_MSG_PORT_NONE,
	ID_MSG_PORT_GATE,
	ID_MSG_PORT_CENTER,
	ID_MSG_PORT_VERIFY,
	ID_MSG_PORT_RECORDER_DB,
	ID_MSG_PORT_DATA,
	ID_MSG_PORT_CLUB = ID_MSG_PORT_DATA,
	ID_MSG_PORT_DB,
	ID_MSG_PORT_MJ,
	ID_MSG_PORT_BI_JI,
	ID_MSG_PORT_NIU_NIU,
	ID_MSG_PORT_DOU_DI_ZHU,
	ID_MSG_PORT_GOLDEN,
	ID_MSG_PORT_SCMJ,
	ID_MSG_PORT_MQMJ,
	ID_MSG_PORT_LUOMJ,
	ID_MSG_PORT_FXMJ,
	ID_MSG_PORT_CFMJ,
	ID_MSG_PORT_AHMJ,
	ID_MSG_PORT_NCMJ,
	ID_MSG_PORT_DDMJ,
	ID_MSG_PORT_SZMJ,
	ID_MSG_PORT_SDMJ,
	ID_MSG_PORT_YZMJ,
	ID_MSG_PORT_NJMJ,
	ID_MSG_PORT_ALL_SERVER,
	ID_MSG_PORT_MAX,
};

export enum eMsgType
{
	MSG_NONE,
	//--new define begin---
	// the msg title used between servers 
	MSG_SERVERS_USE,
	MSG_VERIFY_SERVER,   // used between svr , not by transfer data ;
	MSG_VERIFY_CLIENT, // verify that is client ;
	MSG_TRANSER_DATA, // tranfer data between servers ;
	MSG_SERVER_DISCONNECT, // some svr disconnected ;  // svr recived , send by center svr , not by transfer data ;
	MSG_ASYNC_REQUEST, // asyn request 
	MSG_JSON_CONTENT,
	MSG_RECONNECT,   // client with gate 
	MSG_TELL_CLIENT_SVR_DISCONNECT, // tell client svr
	MSG_CLIENT_CONNECT_STATE_CHANGED,  // client connect state changed ;  // send by gate 
	MSG_GATE_SVR_IS_FULL, // gate connect is full , let client change other gate ;
	MSG_PLAYER_REGISTER,     // register an account ;
	MSG_PLAYER_LOGIN,  // check an account is valid ;
	MSG_TELL_GATE_PLAYER_OTHER_LOGIN,

	MSG_REQUEST_PLAYER_DATA, // request player brif data 
	// client : { nReqID : 23  isDetail : 0 }
	// svr : { uid : 23 , name : "hello" , headIcon : "http://weshg.wx.com",sex : 1 , ip : "1.0.0.1" , J : 23.0002, W : 232.234, isInRoom : 0 ,isOnline : 0 ,lastLoginTime : 2345234 }  // J , W : GPS positon , maybe null ;
	// isInRoom : only when player is online , have this key .
	// loginTime : only when player is offline , have this key .
	MSG_PLAYER_OTHER_LOGIN,  // more than one place login , prelogin need disconnect ; client recived must disconnect from server
	// svr : null 
	MSG_PLAYER_BASE_DATA,
	// svr: { uid : 23,name : "lucy" , sex : 1 , headIcon : "http://url.com",diamond : 23 , coin : 20,emojiCnt : 23, ip: "234.234.234",stayRoomID : 0  }
	// stayRoomID , if not in any room , this key is null ;
	MSG_PLAYER_UPDATE_INFO,
	// client : { name : "lucy", sex : 1 , headIcon : "http://url.com"  }
	// svr: { ret : 0 }
	MSG_PLAYER_UPDATE_GPS,
	// client : { J : 23.23 , W : 2345  }   // j : jing du , w: wei du ;  
	// svr : null 
	MSG_PLAYER_REFRESH_MONEY,
	// client : null ;
	// svr { coin: 235 , diamond : 235 }
	MSG_PLAYER_LOGOUT,
	// client : null ;
	// svr : { ret : 0 }  // ret: 0 success , 1 can not find player , 2 player is doing something , can not logout,eg: in some room ;
	MSG_SHOP_MAKE_ORDER,
	// client : { shopItemID : 23 , channel : ePayChannel }  // ePayChannel ����ö��
	// svr : { ret : 0 , shopItemID : 23 , channel : ePayChannel,cPrepayId : "asdgsfh234g22jhbjadjg",cOutTradeNo : "232hlhsfhasdg" }
	// ret : 0 success , 1 can not find shop item , 2 , can not find player , 3 pay channel error , 4 argument error ; 
	MSG_SHOP_BUY_ITEM,
	// client : { shopItemID : 23 , channel : ePayChannel, transcationID : "20 len" }
	// svr : { ret : 0 , shopItemID : 23 }
	// ret : 0 success , 1 can not find shop item , 2 can not find player , 3 transcationID lenght is not 20 ,4 pay channel error ,5 platform verify error , 6 time out;

	MSG_ASYNC_REQUEST_RESULT,  // temp put here
	// in room msg ;
	MSG_REQUEST_ROOM_INFO,
	// client : null ;

	MSG_PLAYER_CHAT_MSG, // ��ҷ��� ������Ϣ
	// client : { type : 1 , content : "biao qing or viceID" }
	// svr : { ret : 0 } 
	MSG_ROOM_CHAT_MSG, // ����������� ����������Ϣ��
	// svr:  { playerIdx : 2 , type : 1 , content : "biao qing or viceID" } 

	MSG_NEW_MAIL,
	// svr : { mailID : 234 , type : 0 ,state : 0 , detail : { } }
	// type : eMailType
	// state : eMailState ö��ֵ
	// detail : ��ͬ���ʼ����ͣ����ݲ�һ����

	MSG_PLAYER_INTERACT_EMOJI,
	// client : { targetIdx : 0 , emoji : 23 }
	// svr : { ret : 0 }  // 0 success , 1 money is not enough , 2 player is not online , 3 you are not sitdown  in room ;
	
	MSG_ROOM_INTERACT_EMOJI,
	// svr : { invokerIdx : 1 ,targetIdx : 0 , emoji : 23 } 

	MSG_REQUEST_JOINED_CLUBS,
	// client : {}
	// svr : { clubs : [ 23,1,23 ] } 

	MSG_PLAYER_RECIEVED_NEW_MAIL,
	// svr : { maxMailID : 23 }

	MSG_PLAYER_REQ_MAILS,
	// client : { clientMaxMailID : 23   }
	// svr : { pageIdx : 1 , mails : [ { mailID : 234 , type : 0 ,state : 0 ,time : 234523, detail : { } }, ....  ] } 
	// 10 cnt per page ,if mails size < 10 , means end ;
	
	MSG_PLAYER_PROCESS_MAIL,
	// client : { mailID : 23 , state : eMailState, arg : {}  } . arg : can be null , depend on mail type and process type ;
	// svr : { ret : 0 ,mailID : 23 ,state : eMailState }
	// ret : 0 success , 1 mail state error , 2 arg invliad ;

	MSG_CREATE_ROOM = 300,
	// client: { uid : 234 ,gameType : 0 , seatCnt : 4 , payType : 1 , level : 2 , opts : {  .... }  }
	// payType : 0 the room owner pay cards , 1 AA pay card type , 2 big winer pay cards 
	// svr : {  ret : 0 , roomID : 23 } // ret : 0 success , 1 diamond is not enough, 2 create room count reach limit , 3 argument error , 4 room type error ,can not create room,  5  server maintenance,create room later   , 6 svr is busy , please try later , 7 internal time out;
	MSG_ROOM_REQ_ROOM_LIST, // send to data svr ;
	// client : null 
	// svr : { ret : 0 , rooms : [{id : 234, port : 23 }, ... ], stayInRoom : { id : 0 , port : 23 }  }
	// if player is not in any room , "stayInRoom" will be null , svr do not send this key 

	MSG_ENTER_ROOM,
	// client : { roomID : 23, uid : 23 }
	// svr: { roomID : 23 , ret : 0 } // ret : 0 success , 1 can not find room , 2 you already in other room ;3, room is full , 4, uid error ,5 , can not enter room , 6 unknown error, 7 arg not allow enter , 8 dianmond not enough, 9 can not enter club room;
	MSG_ROOM_CHANGE_STATE,
	// svr : { lastState : 23 , newState : 23 }
	MSG_ROOM_INFO, 
	// svr: { state : 2 , stateInfo : {} , roomID: 23, opts: {} , leftCircle : 2 ,isOpen : 1 , isWaitingDismiss : 0 ,applyDismissUID : 234, agreeIdxs : [2,3,1] ��leftWaitTime : 234, etc }
	// detail info , deponed on sepcail game ;

	MSG_ROOM_SIT_DOWN,   // tell all players , some one sit down ;
	// svr : { idx : 23 , uid : 23 ,isOnline : 0 , chips : 23 ... }  // the same as MSG_ROOM_INFO players item ;
	MSG_PLAYER_SIT_DOWN,
	// client : { idx : 1 } 
	// svr : { ret : 0 , idx : 1 } ;  // ret : 0 success , 1 pos already have players , 2, already in other room , 3, not in room , can not sit down , 4 already sit down , 5 session id error , 6 , unknown error  , 7 not in white list , 8 room open , can not sit down;
	MSG_PLAYER_STAND_UP,
	// client : null ;
	// svr : { ret : 0 } // ret : 0 success , 1 you are not sit down ,
	MSG_ROOM_STAND_UP,   // tell all players some one stand up 
	// svr : { idx : 23 , uid : 234 } 
	MSG_PLAYER_LEAVE_ROOM,
	// client : null 
	// svr : { ret : 0 }; // ret : 0 success , 1 you are not in this room , 2 unknown errro ;
	MSG_ROOM_REFRESH_NET_STATE, // player net state , changed 
	// svr : { idx : 0 , uid : 235 , state : 0  } , 0 is online , 1 lose connect , wait reconnect; 
	MSG_PLAYER_OPEN_ROOM,
	// client : null ;
	// svr: { ret : 0 } // 0 success , 1 you are not owner , 2 you are not in room ;
	MSG_ROOM_DO_OPEN,
	// svr : null ;
	MSG_ROOM_PLAYER_INFO,  // ��������ҵ������Ϣ����һ������,�����Ϣ���ܻ��յ����
	// svr : {  players:[ { idx : 23 , uid : 23 ,isOnline : 0 , chips : 23, state : 23 ...}, ... ]  }

	MSG_APPLY_DISMISS_VIP_ROOM, // �����ɢvip ����
	// client : { dstRoomID : 234 } 

	MSG_ROOM_APPLY_DISMISS_VIP_ROOM, //���������������ɢvip ����
	// svr : { applyerIdx : 2 }
	// applyerIdx : �����ߵ�idx 

	MSG_REPLY_DISSMISS_VIP_ROOM_APPLY,  // �������ɢ������
	// client { dstRoomID : 23 , reply : 0 }
	// reply �� 1 ��ʾͬ�⣬ 0 ��ʾ�ܾ���

	MSG_ROOM_REPLY_DISSMISS_VIP_ROOM_APPLY, // �յ����˻ظ���ɢ����
	// svr { idx : 23 , reply : 0 }
	// reply �� 1 ��ʾͬ�⣬ 0 ��ʾ�ܾ���

	MSG_VIP_ROOM_DO_CLOSED, // vip �������֪ͨ
	// svr : { isDismiss : 0 , roomID : 2345 , eType : eroomType }  
	// isDismiss : �Ƿ��ǽ�ɢ�����ķ��䡣1 �ǽ�ɢ���䣬0 ����Ȼ������

	MSG_ADD_WHILE_LIST,
	// client : { uid : 23 }
	// ret : { ret : 0 , uid : 23 }
	// 0 success , 1 white list is full  ;

	MSG_REMOVE_WHITE_LIST,
	// client : { uid : 23 }
	// svr : { ret : 0 , uid : 23 }
	// ret : 0 success , 1 , uid not in white list ;

	MSG_REQUEST_WHITE_LIST,
	// client : null
	// svr : { list : [ 23, 232,52 ... ] } 

	MSG_ROOM_TEMP_OWNER_UPDATED,
	// svr : { uid : 23 }

	MSG_ROOM_KICK_PLAYER,
	// svr : { uid : 23 , targetUID : 123 }

	MSG_PLAYER_SET_READY = 600,   	// player do ready
	// client : { dstRoomID : 2345 } ;
	// svr : { ret : 1 , curState : 23 } // 1 you are not in room , 2 you are not state waitNextGame, tell curState ;
	MSG_ROOM_PLAYER_READY,  // some player did ready
	// svr : { idx : 2 }

	// niuniu msg 
	MSG_ROOM_PRODUCED_BANKER,
	// svr : { bankerIdx : 0, vCandinates : [2 ,3 ]  } 

	MSG_ROOM_START_BET,
	// svr : { players : [ { lastOffset : 0 , canTuiZhuang : 1 }, .... ] } ;

	MSG_PLAYER_DO_BET,
	// client : { betTimes : 2 }
	// svr : { ret: 0 } , ret : 0 success , 1 invalid arguments , 2 you are not in room , 3 already beted, 4 state error  ;
	MSG_ROOM_DO_BET,
	// svr : { idx : 2 , betTimes : 23 }
	MSG_ROOM_START_ROBOT_BANKER,
	// svr : null ;
	MSG_PLAYER_ROBOT_BANKER,
	// client : { robotTimes : 2 }
	// svr : { ret : 0 }  ret : 0 success , 1 invalid arguments , 2 you are not in room , 3 already beted, 4 state error  ;
	MSG_ROOM_ROBOT_BANKER,
	// svr : { idx : 2 , robotTimes : 23 }
	MSG_ROOM_DISTRIBUTE_CARD,
	// svr: { info : [ { idx : 0 , cards : [23,23,42,2] }, ..... ] } // info is a array , per item is a player , idx is player idx , cards is current sended hold cards , may be not 5 ;
	MSG_PLAYER_CACULATE_NIU,
	// client : null ;
	// svr : { ret: 0 } , ret : 0 success , 1 you are not in room , 2 already beted ;
	MSG_ROOM_CACULATE_NIU,
	// svr : { idx : 2  }
	MSG_ROOM_NIUNIU_GAME_END, 
	// svr: { bankerIdx : 2 , result : [ { uid : 23 , offset : 23, final : -23 }, .... ] }
	MSG_ROOM_GAME_OVER,
	// svr : { dismissID : 23 , result: [ { uid : 23 , final : -23 }, .... ]  }
	// dismissID is null or 0 , means normal dismiss ;
	// dismissID is 1 , means system dismiss room ;
	// dismissID biger than 1 , means player dismiss room ;

	MSG_REQ_ROOM_ITEM_INFO,
	// client : { roomID : 23 }
	// svr : { state : 2 ,isOpen : 0 ,leftRound : 2 , roomID: 23, opts: {} , players: [23,234,23 ..] }

	MSG_NN_PLAYER_UPDATE_TUO_GUAN,
	// client : { isTuoGuan : 0  }
	// svr : { ret : 0 } ;   // 0 success , 1 the same , not change , 2 not in Room , 3 arg error;

	MSG_NN_ROOM_UPDATE_TUO_GUAN,
	// svr : { idx : 0 , isTuoGuan : 0 } 

	MSG_POKER_BJ_BEGIN = 800,
	
	MSG_ROOM_BJ_START_GAME,
	// svr : { vSelfCard : [23,23,23,2,23] }

	MSG_PLAYER_MAKED_GROUP,
	// client : { vCards : [23,23,23,23,23] } 
	// svr : { ret : 0 }
	// ret : 0 success , 1 you are not in this room ,2 cards not fit , 3 already maked card ;

	MSG_ROOM_BJ_MAKE_GROUP_CARD,
	// svr : { idx : 0 }

	MSG_ROOM_BJ_GAME_END,
	//svr : { players : [ { idx : 23 ,offset : 23 ,xiPaiOffset : 2 , xiPaiTypes : [2,23,23] , tongGuanOffset : 23 ,vGuoInfo : [ { type : 23 , offset : 2 , cards : [23,23,21] }, ..... ]  } , .....    ] } 
	// offset ��ʾ������յ���Ӯ,eXiPaiType ������ϲ��ö�٣����û�о���eXiPai_Max

	MSG_ROOM_BJ_GAME_OVER,
	// svr : { dismissID : 23 , result: [ { uid : 23 , final : -23, win : 0 , lose : -2 , xiPai : -23  }, .... ]  }
	// dismissID is null or 0 , means normal dismiss ;
	// dismissID is 1 , means system dismiss room ;
	// dismissID biger than 1 , means player dismiss room ;

	MSG_POKER_GAME_MSG_MAX = 1000,
	
	// dou di zhu 
	MSG_DDZ_ROOM_WAIT_ROBOT_DZ,
	// svr: { idx : 2 }

	MSG_DDZ_PLAYER_ROBOT_DZ,
	// client: { times : 0 }
	// svr: { ret : 0 }
	// times ; 0 means do not robot , 1 means one times ;
	// ret : 0 success , 1 you are not in room , 2 argument error , 3 you are not cur act player, 4 times must big than previous player, 5 you must rob banker 

 	MSG_DDZ_ROOM_ROBOT_DZ,  // some player roboted dz ;
	// svr : { times : 0 , idx } 

	MSG_DDZ_ROOM_PRODUCED_DZ,
	// svr: { dzIdx : 2 , times : 2 , cards : [23,23,23] }

	MSG_DDZ_ROOM_WAIT_CHU,
	// svr: { idx : 0 }

	MSG_DDZ_PLAYER_SHOW_CARDS,
	// client : null ;
	// svr : { ret : 0  }
	// 0 success , 1 you aret not banker , 2 already show cards , 3 only can shou cards before chu pai , 4 other code ;

	MSG_DDZ_ROOM_SHOW_CARDS,
	// svr : { idx : 2 , cards: [ 23,23,2,23] }

	MSG_DDZ_PLAYER_CHU,
	// client: { cards: [23,23,2] , type : 23 }
	// svr : { ret : 0 } // 0 success , 1 you don't have card , 2 you can not chu card , weight invalid , 3 you are not in room , 4 argument error, 5 you are not current act player; 
	MSG_DDZ_ROOM_CHU,
	// svr: { cards : [ 23,22,23], type : 23, idx : 2 }
	MSG_DDZ_ROOM_RESULT,
	// svr : { bombCnt : 2 , isChunTian : 0 , isMingPai : 1 , bottom : 2 , players : [ { idx : 2 , offset : -2,cards : [23,23,2] }, ..... ]  } 
	
	MSG_DDZ_PLAYER_UPDATE_TUO_GUAN, 
	// client : { isTuoGuan : 0  }
	// svr : { ret : 0 } ;   // 0 success , 1 the same , not change , 2 not in Room , 3 arg error;

	MSG_DDZ_ROOM_UPDATE_TUO_GUAN,
	// svr : { idx : 0 , isTuoGuan : 0 } 
	
	MSG_DDZ_WAIT_PLAYER_CHAO_ZHUANG,
	// svr: null
	
	MSG_DDZ_PLAYER_CHAO_ZHUANG,
	// client : { isChao : 0 }
	// svr : { ret : 0 } // ret : 0 success , 1 not in room , 2 you can not chao 
	
	MSG_DDZ_ROOM_CHAO_ZHUANG,
	// svr: { idx : 0 , isChao : 0 }
	
	MSG_ROOM_DDZ_START_GAME,
	// svr : { vSelfCard : [23,23,23,2,23] }

	MSG_DDZ_WAIT_PLAYER_TI_LA_CHUAI,
	// svr: { waitTiLaChuaiPlayers : [ 2,2]}

	MSG_DDZ_PLAYER_TI_LA_CHUAI,
	// client : { isTiLaChuai : 0 }
	// svr : { ret : 0 } // ret : 0 success , 1 not in room , 2 you can not TiLaChuai 

	MSG_DDZ_ROOM_TI_LA_CHUAI,
	// svr: { idx : 0 , isTiLaChuai : 0 }

	MSG_DDZ_PLAYER_DOUBLE,
	// svr : {ret : 0} if 0 add {idx : 0} send all
	// svr : {state : 1} //��ʼ�ӱ�������Ϣ

	MSG_DDZ_MAX = 1500,

	    // club msg 
	MSG_CLUB_MSG = 2800,
	MSG_CLUB_CREATE_CLUB,
	// client : { name : "23",opts : {} }
	// svr : { ret : 0 , clubID : 2 } 
	// ret : 0 success , 1 condition is not meet , 2 name duplicate;

	MSG_CLUB_DISMISS_CLUB,
	// client : { clubID : 23 }
	// svr : { ret : 0 }
	// ret : 0 , 1 invalid privilige ,3 still have playing room , can not dissmiss , 4 player is null;

	MSG_CLUB_SET_STATE,
	// client: { clubID : 23 , isPause : 0 }
	// svr : { ret : 0 }
	// ret : 0 success , 1 invalid privilige 

	MSG_CLUB_APPLY_JOIN, 
    // client : { clubID : 23 }
	// svr : { ret : 0 }
	// ret : 0 success , 1 already in club , 2 already applyed , do not apply again , 3 memeber cnt  reach limit , 4 player is null ;
	MSG_CLUB_KICK_PLAYER,
	// client : { clubID : 23 , kickUID : 23 }
	// svr : { ret : 0 }
	// ret : 0 success ,1  kickUID not in club , 2 you are not mangager , 4 you do not login , invalid player 
	MSG_CLUB_PLAYER_LEAVE,
	// client : { clubID : 0 }
	// svr : { ret : 0 }
	// ret : 0 success , 1 you are not in club ,4 you do not login , invalid player  ;
	MSG_CLUB_SET_ROOM_OPTS,
	// client : { clubID : 0 , opts : { }  }
	// svr : { ret :0 }
	// ret : 0 success , 1 privilige too low ,4 you do not login , invalid player  ; .
	// opts : create room opts ;
	MSG_CLUB_UPDATE_PRIVILIGE,
	// client : { clubID : 0 , playerUID : 234 , privilige : eClubPrivilige }
	// svr : { ret : 0 }
	// ret : 0 success , 1 privilige invalid, 2 mgr cnt reach limit ,  3 player not in club , 4 you do not login , invalid player , 5 the same privilige ;
	MSG_CLUB_REQ_EVENTS,
	// client : { clubID : 23, clientMaxEventID : 23, state : eEventState   }
	// svr : { ret : 0 ,pageIdx : 0 , vEvents : [ { eventID : 8 , type : eClubEvent , state : eEventState , time : 23452 ,detail : {} } ] }
	// ret : 0 success , 4 ,you do not login , invalid player , 1 privilige invalid 
	// ps : if vEvents's size less then 10 , means last page ;
	MSG_CLUB_PROCESS_EVENT,
	// client : { clubID : 23 , eventID : 23 ,  detial : {} }
	// svr : { ret : 0 }
	// ret : 0 success , 1 event not exsit , 2 already processed ,3 invalid privilige , 4 you are not login, 5 invalid detail ;
	MSG_CLUB_REQ_INFO,
	// client : { clubID : 23 }
	// svr : {  inviteCnt : 23 , notice : "this is notice" name : 2 , creator : 23, mgrs : [23,23,52], clubID : 23,diamond : 23 , state : 0, curCnt : 23, capacity : 23 , maxEventID : 23 ,opts : {} }
	// state : 0 normal , 1 pause ;
	MSG_CLUB_REQ_ROOMS,
	// client : { clubID : 0 }
	// svr : { clubID : 234, name : 23, fullRooms : [ 23,23,4 ], emptyRooms :  [  23,2, .... ]  }

	MSG_CLUB_REQ_PLAYERS,
	// client : { clubID : 10  }
	// svr : { pageIdx : 0 ,players : [ { uid : 235, privilige : eClubPrivilige  } .... ] } 
	// ret : 0 , players's size < 10 means last page;
	MSG_CLUB_INVITE_JOIN,
	// client : { clubID : 3, invites : [ 23,45,2] }
	// svr : { ret : 0 }
	// ret : 0 , 1 invalid privilige 
	MSG_CLUB_RESPONE_INVITE,
	// client : { clubID : 3 , nIsAgree : 0  }
	// svr : { ret : 0 }
	// ret : 0 success , 1 member cnt reach limit , 2 invitation time out ;
	MSG_CLUB_REQ_INVITATIONS ,
	// client : { clubID : 3 }
	// svr : { ret : 0 , invitations : [ 23,23,42] } ;
	MSG_CLUB_UPDATE_NOTICE,
	// client : { clubID : 23 , notice : "hello hapyy join" }
	// svr : { ret : 0 , notice : "hello" }
	// ret : 0 , 1 invalid privilige
	MSG_CLUB_UPDATE_NAME,
	// client : { clubID : 23 , name : "hello hapyy join" }
	// svr : { ret : 0 , name : "hello" }
	// ret : 0 , 1 invalid privilige , 2 new name is the same as old name , 3 duplicate name 

	MSG_CLUB_CHECK_NAME, // check if the name is duplicate 
	// client : { name : 234 }
	// svr : { ret : 0 } // ret : 0 ok , 1 duplicate 

	MSG_CLUB_UPDATE_DIAMOND, 
	// client : { clubID : 23 }
	// svr : { ret : 0 ,clubID : 23, diamond : 23 }

	MSG_CLUB_SET_PLAYER_INIT_POINTS,
	// client : { clubID : 23 , uid : 23 , points : 23 }
	// svr : { ret : 0 ,clubID : 23 , uid : 23 , points : 23 }
	// ret : 0 success , 1 privilige is invalid , 2 player is not in club , 3 invalid points ;

	MSG_CLUB_RESET_PLAYER_POINTS,
	// client : { clubID : 23 , uid : 23 }
	// svr : { ret : 0 ,clubID : 23 , uid : 23 }
	// ret : 0 success , 1 privilige is invalid , 2 player is not in club ;

	MSG_CLUB_CREATE_PRIVATE_ROOM, //�����齫���ֲ�����Խ�����

	MSG_CLUB_PLAYER_APPLY_LEAVE, //�����齫��������뿪���ֲ�

	MSG_CLUB_MSG_END = 2900,

	// mj specail msg ;
	MSG_PLAYER_WAIT_ACT_ABOUT_OTHER_CARD,  // ���˳���һ���ƣ��ȴ���Ҫ�����Ƶ���� ���������� �����ܣ���
	// svr : { invokerIdx : 2,cardNum : 32 , acts : [type0, type 1 , ..] }  ;
	// �����Ϣ����㲥��ֻ�ᷢ����Ҫ�����Ƶ���ң�cardNum ����Ҫ���ƣ�type ���Ͳ��� eMJActType

	MSG_PLAYER_WAIT_ACT_AFTER_RECEIVED_CARD,  // �Լ����һ���ƣ��ܻ�������Ȼ����Խ��еĲ��� �ܣ���
	// svr : { acts : [ {act :eMJActType , cardNum : 23 } , {act :eMJActType , cardNum : 56 }, ... ]  }  ;
	// �����Ϣ����㲥��ֻ�ᷢ����ǰ��������ң�acts�� �ɲ��������飬 ��Ϊ���һ���ƣ��Ժ���Խ��еĲ����ܶࡣcardNum �������Ӧ���ƣ�type ���Ͳ��� eMJActType

	MSG_PLAYER_ACT, // ��Ҳ���
	// client : { dstRoomID : 2345 ,actType : 0 , card : 23 , eatWith : [22,33] }
	// actType : eMJActType   �������ͣ�����ö��ֵ, card ������Ŀ���ơ�eatWith: �����������ǳԵ�ʱ������������ʾҪ���������Ƴ�
	// svr : { ret : 0 }
	// ret : 0 �����ɹ� , 1 û���ֵ������ , 2 ����ִ��ָ���Ĳ���������������, 3 �������� , 4 ״̬���� ;

	MSG_ROOM_ACT,  // �����������ִ����һ������
	// svr : { idx : 0 , actType : 234, card : 23, gangCard : 12, eatWith : [22,33], huType : 23, fanShu : 23  }
	// idx :  ִ�в������Ǹ���ҵ������� actType : ִ�в��������ͣ�����ö��ֵeMJActType �� card�� �����漰������  gangCard: ���ƺ� ��õ���;
	// eatWith : �����Ƶ�ʱ�򣬱�ʾ���������ƽ��г�
	// huType : �������ͣ�ֻ���Ǻ��Ķ�����������ֶΣ�
	// fanShu :  ���Ƶ�ʱ��ķ�����ֻ�к��ƵĶ�����������ֶ�

	MSG_REQ_ACT_LIST,   //����������ߣ��������� �յ�roomInfo �󣬷��ʹ���Ϣ������Ҳ����б�
	// client : { dstRoomID : 356 } ,
	// svr : { ret : 0 } ;
	// ret : 0 �ȴ�����ƣ�ֻ�ܳ��ƣ�1 �˿̲�����ò�����ʱ��
	MSG_SET_NEXT_CARD, // send to mj server 
	 //client : {card : 0,dstRoomID : 123465}

	// new request zhan ji 
	MSG_ROOM_SETTLE_DIAN_PAO, //  ʵ����� ����
	//svr : { paoIdx : 234 , isGangPao : 0 , isRobotGang : 0 , huPlayers : [ { idx : 2 , coin : 2345 }, { idx : 2, coin : 234 }, ... ]  }
	// paoIdx : �����ߵ������� isGangShangPao �� �Ƿ��Ǹ����ڣ� isRobotGang �� �Ƿ��Ǳ����ܣ� huPlayer �� ��һ�� ���������к����⣬��һ�����顣 { idx �� �����˵������� coin ������Ӯ�Ľ��} 

	MSG_ROOM_SETTLE_MING_GANG, // ʵ���� ���� 
	// svr :  { invokerIdx : 234 , gangIdx : 234 , gangWin : 2344 }
	// invokerIdx �� �����ߵ������� gangIdx �� ����������� �� gangWin�� �˴θ���Ӯ��Ǯ��

	MSG_ROOM_SETTLE_AN_GANG, // ʵʱ���� ���� 
	//svr�� { gangIdx: 234, losers : [{idx: 23, lose : 234 }, .....] }
	// gangIdx : �����ߵ������� losers �˴θ�����Ǯ���ˣ����顣 { idx ��Ǯ�˵������� lose  ���˶���Ǯ }

	MSG_ROOM_SETTLE_BU_GANG, // ʵ�ʽ��� ����
	// svr : �����ͽ��Ͷ��� ����һ����

	MSG_ROOM_SETTLE_ZI_MO, // ʵʱ���� ����
	// svr �� { ziMoIdx: 234, losers : [{idx: 23, lose : 234 }, .....] }
	// ziMoIdx : �������˵������� losers �� �������±�����Ǯ�ˡ�һ�����֡� {idx ��Ǯ�˵������� lose �� ���˶���Ǯ } 

	MSG_PLAYER_DETAIL_BILL_INFOS, // ��Ϸ�������յ��ĸ�����ϸ�˵���ÿ����ֻ���յ��Լ��ġ�
	// svr �� { idx�� 23 �� bills��[ { type: 234, offset : -23, huType : 23, beiShu : 234, target : [2, 4] } , .......... ] } 
	// idx : ��ҵ�������
	// bills : ��ҵ��˵����飬ֱ�ӿ���������ʾ�� �˵��ж�����
	// �˵��ڽ��ͣ� type �� ȡֵ�ο�ö�� eSettleType �� offset �� ����˵�����Ӯ��������ʾ���ˣ� ���type �ó����������磺Type Ϊ���ڣ��������Ǳ����ڣ��������ǵ��ڣ�
	// ͬ��type ��������ʱ�����offset Ϊ��������ô���Ǳ������������������������������������͡�
	// huType : ֻ�е���������ʱ����Ч����ʾ�����ĺ����ͣ����߱����� ����ֶ�Ҳ����Ч�ġ�beiShu �����Ǻ��Ƶı�������Ч����ͬ������ԣ���塣 
	// target : �����Լ�����˵� ��Ե�һ���� ����Ӯ����Щ�˵�Ǯ���������˭�ˡ���˭�����ˣ���˭�����ˣ�������˭�����嵽�ͻ��˱��֣��������ұ��Ǹ� �ϼ��¼ң�֮�����һ�С�

	MSG_ROOM_PLAYER_CARD_INFO,
	// svr : { idx : 2, queType: 2, anPai : [2,3,4,34], mingPai : [ 23,67,32] , huPai : [1,34], chuPai: [2,34,4] },{ anPai : [2,3,4,34], mingPai : [ 23,67,32], anGangPai : [23,24] , huPai : [1,34] }
	//  anPai �����ƣ�û��չʾ�����ģ�mingPai �����Ѿ�չʾ�������ƣ������ܣ���huPai �� �Ѿ����˵��ơ� queType : 1,�� 2, Ͳ 3, ��
	// anGangPai : ���ǰ��ܵ��ƣ����ţ�����4�š����� ����8����ô����һ��8��Ҳ����4��8��

	// NanJing ma jiang :
	// svr: { idx : 2 , newMoCard : 2, anPai : [2,3,4,34] , chuPai: [2,34,4] , huaPai: [23,23,23] , anGangPai : [23,24],buGang : [23,45] ,pengGangInfo : [ { targetIdx : 23 , actType : 23 , card : 23 } , .... ]  }
	// idx �� �������,  anPai �����ƣ�û��չʾ������, chuPai �� �����Ѿ����˵��ơ�buGang : ���ܵ���
	// newMoCard : ���������ƣ������Ǹ� ���� ����
	// pengGangInfo: ���ƺ����Ƶ����顣{ targetIdx �� 23�� actType �� 23 �� card �� 234 } �ֱ��ǣ� ����������������actType �� �������� ���Ǹ��ˣ�card ���������ƣ�

	// SuZhou ma jiang
	// svr: { idx : 2 , newMoCard : 2, anPai : [2,3,4,34] , chuPai: [2,34,4] , huaPai: [23,23,23] , anGangPai : [23,24],buGang : [23,45], pengCard : [23,45] }
	// idx �� �������,  anPai �����ƣ�û��չʾ������, chuPai �� �����Ѿ����˵��ơ�buGang : ���ܵ���, pengCard: ������
	// newMoCard : ���������ƣ������Ǹ� ���� ����

	MSG_MJ_ROOM_INFO,  // ����Ļ�����Ϣ
	// svr : { roomID �� 23 , configID : 23 , waitTimer : 23, bankerIdx : 0 , curActIdex : 2 , leftCardCnt : 23 , roomState :  23 , players : [ {idx : 0 , uid : 233, coin : 2345 , state : 34, isOnline : 0  }, {idx : 0 , uid : 233, coin : 2345, state : 34, isOnline : 0 },{idx : 0 , uid : 233, coin : 2345 , state : 34,isOnline : 0 } , ... ] }
	// roomState  , ����״̬
	// isOnline : ��������� �� 1 �����ߣ� 0 �ǲ�����
	// leftCardCnt : ʣ���Ƶ����������½����Ѿ�����ķ��䣬���߶����������ͻ��յ������Ϣ��
	// bankerIdx : ׯ�ҵ�����
	// curActIdx :  ��ǰ���ڵȴ����������

	

	MSG_VIP_ROOM_CLOSED,
	// { uid : 2345 , roomID : 2345 , eType : eroomType } 

	MSG_ROOM_PLAYER_ENTER, // ��������ҽ��뷿��
	// svr : {idx : 0 , uid : 233, coin : 2345,state : 34 }

	MSG_ROOM_PLAYER_LEAVE, // ������뿪����;
	// svr : { idx : 2 ,isExit : 0 }
	// isExit : �Ƿ����뿪����������˳��� 1 ������˳� ��һ��Ҫ�ж� isExit ���ֵ�Ǵ��ڣ�������ֵΪ 1 ��

	MSG_ROOM_NJ_PLAYER_HU, // �Ͼ��齫��Һ��� 
	// svr : { isZiMo : 0 , detail : {}, realTimeCal : [ { actType : 23, detial : [ {idx : 2, offset : -23 } ]  } , ... ] }
	//  ����������ʱ��isZiMo : 1 , detail = { huIdx : 234 , isKuaiZhaoHu : 0, baoPaiIdx : 2 , winCoin : 234,huardSoftHua : 23, gangKaiCoin : 0 ,vhuTypes : [ eFanxing , ], LoseIdxs : [ {idx : 1 , loseCoin : 234 }, .... ]   }
	// ������������ʱ��isZiMo : 0 , detail = { dianPaoIdx : 23 , isRobotGang : 0 , nLose : 23, nWaiBaoLose : 23 huPlayers : [{ idx : 234 , win : 234 , baoPaiIdx : 2  , isKuaiZhaoHu : 0, huardSoftHua : 23, vhuTypes : [ eFanxing , ] } , .... ] } 
	//	isKuaiZhaoHu : �Ƿ��ǿ��պ���
	// huPlayers : json ������������ͣ���ʾ������ҵ����飬һ�ڶ��죬�ж��������� 
	// ����������: idx :������ҵ�idx �� huardSoftHua : ��������offset ���������Ӯ��Ǯ��gangFlag ����������Ƿ��Ǹܿ��� vhuTypes ��һ�����飬��ʾ����ʱ��� ���ַ��͵���, baoPaiIdx : �����ߵ�������ֻ�а���������������keyֵ������ǮҪ�ж�
	// invokerIdx : �����ߵ�UID,  InvokerGangFlag : ������ �ǲ��Ǳ����ܡ� ��������ʱ�����idx �� ���Ƶ������һ���ġ�
	// realTimeCal :ʵʱ�������Ϣ ��һ������ ����ÿһ�ε����������飻
	// ʵʱ�����������ǣ�actType ��ʲô����ʱ�䵼�µĽ��㣬�ο�eMJActType�� detial�� Ҳ��һ������ ��ʾ����ν���ÿ����ҵ���Ӯ��idx ��ҵ�������offset����ʾ��Ǯ ���Ǽ�Ǯ��������ʾ��

	MSG_ROOM_NJ_GAME_OVER, // �Ͼ��齫����
	// svr: { isLiuJu : 0 , isNextBiXiaHu : 0 , detail : [ {idx : 0 , offset : 23, waiBaoOffset : 234 }, ...  ], realTimeCal : [ { actType : 23, detial : [ {idx : 2, offset : -23 } ]  } , ... ] } 
	// svr : isLiuJu : �Ƿ�������
	// detail : �������ÿ����ҵı��ֵ�������Ӯ ��
	// realTimeCal : ʵʱ������Ϣ��ֻ�����ֵ�����Ŵ�������ֶΣ�
	// isNextBiXiaHu : ��һ���Ƿ�Ҫ���º�

	MSG_ROOM_NJ_REAL_TIME_SETTLE, // �Ͼ��齫ʵʱ����
	// svr : {  actType : 0 , winers : [ {idx : 2, offset : 23}, .... ] , loserIdxs : [ {idx : 2 , offset : 23} , ... ]  } } 
	// actType �˴ν����ԭ����ʲô���ο�eMJActType ;
	// winers : ����ӮǮ�˵����� �� { ӮǮ�˵������� Ӯ�˶���Ǯ }
	// loserIdxs : ������Ǯ�˵����飬 { ��Ǯ�������� ���˶���Ǯ } 

	MSG_REQ_MJ_ROOM_BILL_INFO,  // ����vip ������˵�, ����Ϣ�����齫��Ϸ��������
	// client : { sieral : 2345 }
	// svr : { ret : 0 , sieral : 234, billTime : 23453, roomID : 235, roomType : eRoomType , creatorUID : 345 , circle�� 8 ��initCoin : 2345 , detail : [  { uid : 2345 , curCoin : 234, ziMoCnt : 2 , huCnt : 23,dianPaoCnt :2, mingGangCnt : 23,AnGangCnt : 23  }, ....]  } 
	// ret : 0 �ɹ���1 �˵�id�����ڣ�billID, �˵�ID�� billTime �� �˵�������ʱ��, roomID : ����ID �� roomType ��������eRoomType�� creatorUID �����ߵ�ID��circle �����Ȧ����initCoin �� ��ʼ��ң�detail : ÿ���˵���Ӯ���� json����
	// uid : ��ҵ�uid��curCoin ����ʱʣ��Ǯ��

	// su zhou ma jiang
	MSG_ROOM_SZ_PLAYER_HU, // �����齫��Һ��� 
   // svr : { isZiMo : 0 ,isFanBei : 0 , detail : {} }
   //  ����������ʱ��isZiMo : 1 , detail = { huIdx : 234 , winCoin : 234,huHuaCnt : 23,holdHuaCnt : 0, isGangKai :0 , invokerGangIdx : 0, vhuTypes : [ eFanxing , ] }
   // ������������ʱ��isZiMo : 0 , detail = { dianPaoIdx : 23 , isRobotGang : 0 , nLose : 23, huPlayers : [{ idx : 234 , win : 234 , huHuaCnt : 23,holdHuaCnt : 0, vhuTypes : [ eFanxing , ] } , .... ] } 
   // huPlayers : json ������������ͣ���ʾ������ҵ����飬һ�ڶ��죬�ж��������� 
   // ����������: idx :������ҵ�idx �� huaCnt : ��������offset ���������Ӯ��Ǯ��isGangKai ����������Ƿ��Ǹܿ��� vhuTypes ��һ�����飬��ʾ����ʱ��� ���ַ��͵���,
   // invokerGangIdx : �����ߵ������������ܣ�ֱ�ܲ������keyֵ,���ܵ�ʱ��������Ǻ������Լ�

	MSG_ROOM_SZ_GAME_OVER, // �����齫����
	// svr: { isLiuJu : 0 , isNextFanBei : 0 , detail : [ {idx : 0 , offset : 23 }, ...  ] } 
   // svr : isLiuJu : �Ƿ�������
	// detail : �������ÿ����ҵı��ֵ�������Ӯ ��
	// isNextFanBei : ��һ���Ƿ�Ҫ����

	MSG_ROOM_UPDATE_PLAYER_NET_STATE, // ���·�������ҵ�����״̬
	// svr : { idx : 0 , isOnLine : 0 } // isOnline 0 �����ߣ�1 ���� ��  

	MSG_REQ_ZHAN_JI, // send to mj server 
	// client : { userUID : 234 , curSerial : 2345 }
	// svr : { nRet : 0 ,sieral : 2345 ,cirleCnt : 2, roomID : 235 , createrUID : 234, roomOpts : {} , rounds : [ { replayID : 234, time : 234 , result : [ { uid :234�� offset �� 234  }, ... ]  }, .... ]    } 
	//	nRet: 0 �ɹ��� 1 �Ҳ���ս��, 2 uid ��û�����ƶ�ս������
	// userUID : �����ߵ�Uid �� curSerial �� �ͻ��˵�ǰ�� �����кţ����ص� ս����������кſ�ʼ
	// sieral : ��ǰ����ս���ķ������кţ�roomOpts �� ��ͬ����Ϸ������һ����
	// cirleCnt �� Ȧ�� ���� ����
	//  rounds �� ÿһ�ֵ�ս���������飬������ replayID �ط�ID�� time ����ʱ�䣬result�� ÿ����ҵ���Ӯ��¼���飬{ ���id �� �����Ӯ} 

	// ���Ͼ��齫��ʱ��opts �� { isBiXiaHu : 0 , isHuaZa : 0 , isKuaiChong : 0 , kuaiChongPool : 234 , isJinYuanZi : 0 , yuanZi : 200 }
	// ÿ���� ÿ����ҵ���Ӯ ��һ�� �����keyֵ�� waiBaoOffset : ��ʾ�����Ӯ�� 

	MSG_CHANGE_BAOPAI_CARD,
	// svr: {idx : 0,card : 0}
	//card : 0��ȡ�����������ǰ��Ƶ�card

	MSG_ROOM_GOLDEN_BEGIN = 1700, //��������ſ�ʼ��ʶ

	MSG_ROOM_GOLDEN_GAME_END, //������Ϸ������Ϣ
	// svr: { bankerIdx : 2 , result : [ { uid : 23 , offset : 23, final : -23 }, .... ] }

	MSG_ROOM_GOLDEN_GAME_WAIT_ACT, //���ŷ�����Ҳ����б���Ϣ
	// sur: { acts : { act �� 1 , info : 1 } , { act : 2 , info : 1 } ... }

	MSG_ROOM_GOLDEN_GAME_PASS, //�����������
	// sur : { ret : 0 }  0, �ɹ�; 1, ���Ϊ��.

	MSG_ROOM_GOLDEN_GAME_CALL, //������Ҹ�ע
	// sur : { ret : 0 , idx : 1 , coin : 10 , (mutiple : 1)//ֻ���ڼ�עʱ�ᷢ }

	MSG_ROOM_GOLDEN_GAME_CALL2END, //������Ҹ���һ������
	// sur : { ret : 0, call2end : 1 }

	MSG_ROOM_GOLDEN_GAME_LOOK_CARDS, //���ſ���
	// sur : { ret : 0, (idx : 1)//Ⱥ�������������֪��, (cards : { 23 , 24, 25 })//���ڷ��͸����Ƶ����֪�� } ��ʧ��ʱֻ��Ҫ������ҷ�ʧ����Ϣ(ֻ��ret)

	MSG_ROOM_GOLDEN_GAME_PK, //���ű���
	// sur : { ret : 0, idx : 1, withIdx : 2, result : 1 }
	// result : 1, ʤ��; 0, ʧ��

	MSG_ROOM_GOLDEN_GAME_END_PK, //��������PK
	// sur : { participate : { 1 , 2, 3 } , lose : { 2 , 3 } }
	// participate : ������
	// lose : �����

	MSG_ROOM_GOLDEN_GAME_CANCLE_TRUSTEE, //����ȡ���й�
	// sur : { ret : 0}

	MSG_ROOM_GOLDEN_GAME_UPDATE_TRUSTEE, //�����й�״̬�仯
	// sur : { idx : 1 , state : 1 }
	// state : 0, ȡ���й�  1, �й�

	MSG_ROOM_GOLDEN_END = 1900, //��������Ž�����ʶ



	MSG_ROOM_SICHUAN_MAJIANG_BEGIN = 2000, //�Ĵ��齫����ſ�ʼ���

	MSG_ROOM_SCMJ_GAME_END, //�Ĵ��齫��Ϸ����

	MSG_ROOM_SCMJ_PLAYER_HU, //�Ĵ��齫��

	MSG_ROOM_SCMJ_PLAYER_EXCHANGE_CARDS, //�Ĵ��齫������

	MSG_ROOM_SCMJ_PLAYER_DECIDE_MISS, //�Ĵ��齫��ȱ

	MSG_ROOM_SCMJ_GAME_START, //�Ĵ��齫��ʼ��Ϸ��Ϣ

	MSG_ROOM_SICHUAN_MAJIANG_END = 2100, //�Ĵ��齫����Ž�����ʶ


	MSG_ROOM_MOQI_MAJIANG_BEGIN = 2200, //Ī���齫����ſ�ʼ���

	MSG_ROOM_MQMJ_GAME_START, //Ī���齫��Ϸ��ʼ��Ϣ

	MSG_ROOM_MQMJ_PLAYER_HU, //Ī���齫��

	MSG_ROOM_MQMJ_WAIT_ACT_AFTER_CP, //Ī���齫������ȴ���Ҳ���

	MSG_ROOM_FXMJ_PLAYER_TING,

	MSG_ROOM_FXMJ_WAIT_GANG_TING, //�����齫�ȴ���Ҹܺ��Ƿ�����

	MSG_ROOM_FXMJ_DO_GANG_TING, //�����齫���ѡ������������

	MSGNU_CLUB_CREATE_PRIVATE_ROOM, //�����齫���ֲ�����Խ�����

	MSG_ROOM_FXMJ_PLAYER_ONFOLLOW, //�����齫��Ҵ��Ƹ�ׯ

	MSG_ROOM_FXMJ_REAL_TIME_CELL, //�����齫ʵʱ����

	MSG_ROOM_PLAYER_EXCHANGE_SEAT, //�齫������·���λ��

	MSG_ROOM_PLAYER_WAIT_IDX, //�齫���͵ȴ��������

	MSGNU_CLUB_PLAYER_APPLY_LEAVE, //�����齫��������뿪���ֲ�

	MSG_GET_SHARE_PRIZE, //��������
	// sur : {diamond : 0, sharetimes : 0}

	MSG_PLAYER_REFRESH_GATE_IP, //ˢ��gateIP

	MSG_ROOM_CHIFENG_MAJIANG_BEGIN = 2300, //����齫����ſ�ʼ��ʶ

	MSG_ROOM_CF_GUA_PU, //����齫������Ϣ
	MSG_PLAYER_DO_GUA_PU,
	MSG_ROOM_CFMJ_GAME_WILL_START,

































































	///------new define end---
	MSG_SERVER_AND_CLIENT_COMMON_BEGIN,  // server and client common msg , beyond specail game 
	MSG_PLAYER_ENTER_GAME,    // after check , enter game 
	
	//MSG_PLAYER_CONTINUE_LOGIN,  // contiune login prize ;
	
	MSG_CREATE_ROLE,
	// player base Data 
	
	MSG_SHOW_CONTINUE_LOGIN_DLG,
	MSG_GET_CONTINUE_LOGIN_REWARD,

	MSG_PLAYER_UPDATE_VIP_LEVEL,


	// slot machine 
	MSG_PLAYER_SLOT_MACHINE, // lao hu ji ;

	// item 
	MSG_REQUEST_ITEM_LIST ,
	MSG_SAVE_ITEM_LIST,
	MSG_PLAYER_PAWN_ASSERT, //  dian dang zi chan
	MSG_PLAYER_USE_GIFT,
	// rank
	MSG_REQUEST_RANK,
	MSG_REQUEST_RANK_PEER_DETAIL,
	// inform 
	MSG_INFORM_NEW_NOTICES ,
	MSG_PLAYER_REQUEST_NOTICE,
	MSG_GLOBAL_BROCAST,
	MSG_PLAYER_SAY_BROCAST,
	// shop 
	MSG_SAVE_SHOP_BUY_RECORD,
	MSG_GET_SHOP_BUY_RECORD,
	MSG_PLAYER_REQUEST_SHOP_LIST,
	
	MSG_PLAYER_RECIEVED_SHOP_ITEM_GIFT,
	// mission 
	MSG_GAME_SERVER_SAVE_MISSION_DATA,
	MSG_GAME_SERVER_GET_MISSION_DATA,
	MSG_PLAYER_REQUEST_MISSION_LIST,
	MSG_PLAYER_NEW_MISSION_FINISHED,
	MSG_PLAYER_REQUEST_MISSION_REWORD,

	// online box 
	MSG_PLAYER_REQUEST_ONLINE_BOX_REWARD,
	MSG_PLAYER_REQUEST_ONLINE_BOX_STATE,

	// room common msg ;
	MSG_ROOM_MSG_BEGIN,
	MSG_ROOM_RET,
	MSG_ROOM_SPEAK,
	MSG_ROOM_OTHER_SPEAK,  
	MSG_ROOM_REQUEST_PEER_DETAIL,
	MSG_ROOM_KICK_PEER,
	MSG_ROOM_OTHER_KICK_PEER,
	MSG_ROOM_EXE_BE_KICKED,
	MSG_ROOM_PROCESSE_KIKED_RESULT,

	MSG_ROOM_ENTER,
	//MSG_ROOM_PLAYER_ENTER,  // MSG_ROOM_PLAYER_x means other player actions 
	MSG_PLAYER_FOLLOW_TO_ROOM, // zhui zong pai ju 

	MSG_ROOM_LEAVE,
	//MSG_ROOM_PLAYER_LEAVE,
	// private room 
	MSG_PLAYER_CREATE_PRIVATE_ROOM,  // create private Room ;

	// message for robot 
	MSG_ROBOT_ORDER_TO_ENTER_ROOM = 25000,
	MSG_ROBOT_APPLY_TO_LEAVE,
	MSG_ROBOT_CHECK_BIGGIEST,
	MSG_ROBOT_INFORM_IDLE,
	
	// all room msg above ,

	// golden room 
	MSG_GOLDEN_ROOM_ENTER,
	MSG_GOLDEN_ROOM_LEAVE,
	MSG_GOLDEN_ROOM_INFO,
	MSG_GOLDEN_ROOM_STATE,

	MSG_GOLDEN_ROOM_PLAYER_SHOW_CARD,
	MSG_GOLDEN_ROOM_SHOW_CARD,

	MSG_GOLDEN_ROOM_PLAYER_CHANGE_CARD,
	MSG_GOLDEN_ROOM_CHANGE_CARD,

	MSG_GOLDEN_ROOM_PLAYER_PK_TIMES,
	MSG_GOLDEN_ROOM_PK_TIMES,

	MSG_GOLDEN_ROOM_PLAYER_READY,
	MSG_GOLDEN_ROOM_READY,

	
	MSG_GOLDEN_ROOM_INFORM_ACT,
	
	//MSG_GOLDEN_ROOM_PLAYER_LOOK,
	//MSG_GOLDEN_ROOM_LOOK,
	
	MSG_GOLDEN_ROOM_PLAYER_GIVEUP,
	MSG_GOLDEN_ROOM_GIVEUP,

	MSG_GOLDEN_ROOM_PLAYER_FOLLOW,
	MSG_GOLDEN_ROOM_FOLLOW,

	MSG_GOLDEN_ROOM_PLAYER_ADD,
	MSG_GOLDEN_ROOM_ADD,

	MSG_GOLDEN_ROOM_PLAYER_PK,

	MSG_GOLDEN_ROOM_RESULT,
};
