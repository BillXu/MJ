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


export enum eMJActType
{
	eMJAct_None,
	eMJAct_Mo = eMJAct_None, // 摸牌
	eMJAct_Chi, // 吃
	eMJAct_Peng,  // 碰牌
	eMJAct_MingGang,  // 明杠
	eMJAct_AnGang, // 暗杠
	eMJAct_BuGang,  // 补杠 
	eMJAct_BuGang_Pre, // 补杠第一阶段
	eMJAct_BuGang_Declare = eMJAct_BuGang_Pre, // 声称要补杠 
	eMJAct_BuGang_Done, //  补杠第二阶段，执行杠牌
	eMJAct_Hu,  //  胡牌
	eMJAct_Chu, // 出牌
	eMJAct_Pass, //  过 
	eMJAct_BuHua,  // 补花
	eMJAct_HuaGang, // 花杠
	eMJAct_Followed, // 连续跟了4张牌，要罚钱了
	eMJAct_4Feng, // 前4张出了4张不一样的风牌
	eMJAct_Ting,
	eMJAct_Max,
};

let RoomEvent = 
{
    Event_changeMJ : "event_changeMJ" ,
} ;

export { RoomEvent }  ;