let clientDefine = 
{
    //netEventRecievedBaseData : "recievedBaseData",
    // msgKey : "msgID",
	// msg : "msg"
} ;

let clientEvent = 
{
	setting_upate_Music :  "setting_upate_Music" ,
	setting_update_deskBg : "setting_update_deskBg",
	setting_update_mjBg : "setting_update_mjBg",
	event_recieved_brifData : "event_recieved_brifData",
	event_update_money : "event_update_money",
	event_leave_club : "event_leave_club",
	event_joined_club : "event_joined_club",
	event_recived_new_clubMessage : "event_recived_new_clubMessage",
	event_checkUpdateOk : "event_checkUpdateOk",
} ;

let SceneName =
{
    Scene_Load : "loading",
    Scene_login : "login",
    Scene_Main : "main",
    Scene_Room : "room3D",
    Scene_Replay : "replay",
}

 export enum eGender
{
	eGender_Male,
	eGender_Femal,
};

export enum eMusicType
{
	eMusic_Relax,
	eMusic_Idle,
	eMusic_Classic,
	eMusic_Max,
};

export enum eDeskBg
{
	eDesk_Classic,
	eDesk_Blue,
	eDesk_Wood,
	eDesk_Green,
	eDesk_Max,
};

export enum eMJBg
{
	eMJ_Blue,
	eMJ_Golden,
	eMJ_Green,
	eMJ_Max,
}

export enum eGameType
{
	eGame_None,
	eGame_NiuNiu,
	eGame_BiJi,
	eGame_CYDouDiZhu,
	eGame_JJDouDiZhu,
	eGame_TestMJ,
	eGame_Golden,
	eGame_SCMJ,
	eGame_MQMJ,
	eGame_LuoMJ,
	eGame_FXMJ,
	eGame_CFMJ,
	eGame_AHMJ,
	eGame_NCMJ,
	eGame_DDMJ,
	eGame_SZMJ,
	eGame_SDMJ,
	eGame_YZMJ,
	eGame_NJMJ,
	eGame_Max,
};


export enum eRoomPeerState
{
	eRoomPeer_None,
	// peer state for taxas poker peer
	eRoomPeer_SitDown = 1,
	eRoomPeer_StandUp = 1 << 1,
	eRoomPeer_Ready = (1 << 12) | eRoomPeer_SitDown,
	eRoomPeer_StayThisRound = ((1 << 2) | eRoomPeer_SitDown),
	eRoomPeer_WaitCaculate = ((1 << 7) | eRoomPeer_StayThisRound),
	eRoomPeer_AllIn = ((1 << 3) | eRoomPeer_WaitCaculate),
	eRoomPeer_GiveUp = ((1 << 4) | eRoomPeer_StayThisRound),
	eRoomPeer_CanAct = ((1 << 5) | eRoomPeer_WaitCaculate),
	eRoomPeer_WaitNextGame = ((1 << 6) | eRoomPeer_SitDown),
	eRoomPeer_DoMakedCardGroup = (1 << 8) | eRoomPeer_CanAct,
	eRoomPeer_WillLeave = (1 << 10) | eRoomPeer_StandUp,
	eRoomPeer_Looked = (1 << 13) | eRoomPeer_CanAct,
	eRoomPeer_PK_Failed = (1 << 14) | eRoomPeer_StayThisRound,
	eRoomPeer_ShowedHoldCard = ( 1 << 16 ),
	eRoomPeer_SysAutoAct = ( 1 << 18), // 托管状态
	eRoomPeer_AlreadyHu = ((1 << 15) | eRoomPeer_CanAct),  //  已经胡牌的状态
	eRoomPeer_DelayLeave = (1 << 17),  //  牌局结束后才离开
	eRoomPeer_TiLaChuai = (1 << 19),  //  提拉踹
	eRoomPeer_Max,
};


export enum eRoomState
{
	// new state 
	eRoomSate_WaitReady,
	eRoomState_StartGame,

	// Caution! special define can not be use
	eRoomState_AskForHuAndPeng = 12, // 询问玩家碰或者胡  { invokeIdx : 2 , card : 23 }

	eRoomState_Common_Max = 20,

	// niu niu special ;
	eRoomState_DecideBanker,
	eRoomState_RobotBanker = eRoomState_DecideBanker,
	eRoomState_DistributeFirstCard,
	eRoomState_DoBet ,
	eRoomState_DistributeCard, 
	eRoomState_DistributeFinalCard = eRoomState_DistributeCard,
	eRoomState_CaculateNiu,
	eRoomState_GameEnd,
	eRoomState_NN_Max = 50,
	
	// mj specail ;
	eRoomState_WaitPlayerAct,  // 等待玩家操作 { idx : 0 , huaCard : 23 }
	eRoomState_DoPlayerAct,  // 玩家操作 // { idx : 0 ,huIdxs : [1,3,2,], act : eMJAct_Chi , card : 23, invokeIdx : 23, eatWithA : 23 , eatWithB : 22 }
	eRoomState_AskForRobotGang, // 询问玩家抢杠胡， { invokeIdx : 2 , card : 23 }
	eRoomState_WaitPlayerChu, // 等待玩家出牌 { idx : 2 }
	eRoomState_AfterChiOrPeng, //吃碰后等待玩家操作
	eRoomState_AfterGang, //杠后等待玩家操作（摸牌前）
	eRoomState_MJ_Common_Max = 80, 

	// bj specail 
	eRoomState_BJ_Make_Group,
	eRoomState_BJ_Max = 100,
	// dou di zhu specail 
	eRoomState_DDZ_Chu,
	eRoomState_JJ_DDZ_Ti_La_Chuai, 
	eRoomState_JJ_DDZ_Chao_Zhuang,
	eRoomState_DDZ_Double,
	eRoomState_Max,
};

export enum eMailType
{
	eMail_Wechat_Pay, // { ret : 0 , diamondCnt : 23 }  // ret : 1 means verify error 
	eMail_AppleStore_Pay, // { ret : 0 , diamondCnt : 23 }   // ret : 1 means verify error 
	eMail_Agent_AddCard, // { agentID : 23 , serialNo : 2345 , cardOffset : 23 }
	eMail_Consume_Diamond, // { diamond : 23 , roomID :23, reason : 0 } 
	eMail_GiveBack_Diamond, // { diamond : 23 , roomID :23, reason : 0  } 
	eMail_Consume_Emoji, // { roomID :23, cnt : 0 }
	eMail_Agent_AddEmojiCnt, // { agentID : 23 ,addCnt : 23 }
	// club 
	eMail_ResponeClubApplyJoin,// { clubID : 23 , clubName : "abc", nIsAgree : 0  }
	eMail_ClubInvite , //  { clubID : 23 , clubName : "abc",mgrID : 23  }
	eMail_ClubBeKick, // { clubID : 23 , clubName : "abc",mgrID : 23  }
	eMail_ClubDismiss, // { clubID : 23 , clubName : "abc"  }
	eMail_Max,
};

export enum eMailState
{
	eMailState_Unread,
	eMailState_WaitSysAct,
	eMailState_WaitPlayerAct,
	eMailState_SysProcessed,
	eMailState_Delete,
	eMailState_PlayerProcessed,
	eMailState_Max,
};

export enum ePayRoomCardType
{
	ePayType_None,
	ePayType_RoomOwner = ePayType_None,
	ePayType_AA,
	ePayType_Winer,
	ePayType_Max,
};

export { clientDefine , SceneName,clientEvent }  ;