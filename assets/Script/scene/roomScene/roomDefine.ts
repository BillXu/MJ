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

export enum eCardSate
{
    eCard_Hold,
    eCard_Out,
    eCard_Peng ,
    eCard_MingGang,
	eCard_AnGang,
	eCard_Back,
    eCard_Eat,
	eCard_Hu,
	eCard_Max,
};

export enum eEatType
{
	eEat_Left , // xAB
	eEat_Middle,// AxB
	eEat_Righ, // ABX,
}

export enum eClientRoomState
{
	State_WaitReady,
	State_StartGame,
	State_GameOver,
};

export enum eChatMsgType
{
	eChatMsg_InputText,
	eChatMsg_Voice,
	eChatMsg_Emoji,
	eChatMsg_SysText,
	eChatMsg_Max,
}

let RoomEvent = 
{
    Event_changeMJ : "event_changeMJ" ,
} ;

export enum eFanxingType
{
	eFanxing_PingHu, // 平胡

	eFanxing_DuiDuiHu, //  对对胡

	eFanxing_QingYiSe, // 清一色
	eFanxing_QiDui, //  七对
	eFanxing_QuanQiuDuDiao, // 全球独钓
	eFanxing_TianHu, //天胡
	eFanxing_ShuangQiDui, // 双七对

	eFanxing_MengQing, // 门清

	eFanxing_YaJue, // 压绝 
	eFanxing_HunYiSe, // 混一色
	eFanxing_WuHuaGuo, // 无花果
	eFanxing_DiHu,//地胡

	eFanxing_HaiDiLaoYue, // 海底捞月
	eFanxing_DaMenQing, // 大门清
	eFanxing_XiaoMenQing, // 小门清

	eFanxing_GangKai, //杠开
	eFanxing_QiangGang, //抢杠
	eFanxing_GangHouPao, //杠后炮
	
	eFanxing_SC_ZhongZhang, //四川麻将中张
	eFanxing_SC_19JiangDui, //四川麻将19将对
	eFanxing_SC_Gen, //四川麻将根(4张相同的牌)

	eFanxing_BianHu, //边张
	eFanxing_JiaHu, //夹胡

	eFanxing_13Yao, //13幺

	eFanxing_Max, // 没有胡
};

export { RoomEvent }  ;