// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export enum eMJCardType
{
	eCT_None,
	eCT_Wan,
	eCT_Tong,
	eCT_Tiao,
	eCT_Feng,  // 1 dong , 2 nan , 3 xi  4 bei 
	eCT_Jian, // 1 zhong , 2 fa , 3 bai 
	eCT_Hua, 
    eCT_Max,
};

export enum eCardSate
{
    eCard_Hold,
    eCard_Out,
    eCard_Peng,
    eCard_MingGang,
    eCard_AnGang,
    eCard_Eat,
    eCard_Hu,
};

export enum eArrowDirect
{
    eDirect_Left,
    eDirect_Righ,
    eDirect_Opposite,
};

let RoomEvent = 
{
    Event_changeMJ : "event_changeMJ" ,
} ;

export { RoomEvent }  ;