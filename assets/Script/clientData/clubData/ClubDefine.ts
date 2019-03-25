// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export enum eClubEvent
{
	eClubEvent_ApplyJoin,// some body apply to join club , { uid : 23, respUID : 11, isAgree : 0  }, when processed , contain key : respUID : 11, isAgree 
	eClubEvent_Kick, // { uid : 23 , mgrUID : 23 }
	eClubEvent_Leave, // { uid : 23 }
	eClubEvent_UpdatePrivlige, // { uid : 23 , privilige : eClubPrivilige , actUID : 234 }
	eClubEvent_RespInvite,// { uid : 234 , nIsAgree : 0 }
	eClubEvent_ResetPlayerPoints, // { uid : 23 , mgrUID : 23 }
	eClubEvent_SetPlayerInitPoints, // { uid : 23 , mgrUID : 23, points : 23 }
	eClubEvent_Max,
};

export enum eEventState
{
	eEventState_WaitProcesse,
	eEventState_Processed,
	eEventState_TimeOut,
	eEventState_Max,
};

export enum eClubPrivilige
{
	eClubPrivilige_Forbid, // can not enter room 
	eClubPrivilige_Normal,
	eClubPrivilige_Manager,
	eClubPrivilige_Creator,
	eClubPrivilige_Max,
};

export enum clubMemAct
{
    eAct_Upgrade_Privilige,
    eAct_Down_Privilige,
    eAct_Kick_Out,
}

export enum eClubDataComponent
{
	eClub_Rooms,
	eClub_Members,
	eClub_Recorders,
    eClub_Events,
    eClub_BaseData,
    eClub_Max,
}

