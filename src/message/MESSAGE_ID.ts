/**
 *
 * @author 
 * 
 */
enum MESSAGE_ID {
    ERROR_TIP_MESSAGE = 400,		//错误提示信息

    GAME_TICK_MESSAGE = 99,  //游戏心跳
    GAME_LOGON_MESSAGE = 101,  //登录服
    SELECT_SERVER_MESSAGE = 102,   //选择游戏服
    LOGIN_SERVER_MESSAGE = 103,   //登录游戏服
    CREATE_ROLE_MESSAGE = 104,	//创建角色
    ENTER_GAME_MESSAGE = 105,	//进入游戏
    PLAYER_MESSAGE = 106,		//玩家消息
    TIMEOUT_MESSAGE = 110,      //连接超时
    PLAYER_CURRENCY_UPDATE = 107, //货币更新
    PLAYER_EXP_UPDATE = 108,        //经验更新
    NOVICE_GUIDE_UPDATE = 109,        //新手引导更新
    REPEAT_LOGIN_MESSAGE = 114,   //用户重复登录
    OFFLINE_EXP_REWARD = 115,   //离线经验
    PASS_SCENE_REWARD = 117,    //领取通关奖励
    RECEIVE_ONLINE_GIFT = 118,	//领取在线礼包
    LOGIN_BAN_MESSAGE = 119,   //封号
    OPT_PLAYER_HEAD_MESSAGE = 121,//头像修改
    OPT_PLAYER_HEAD_NAME_MESSAGE = 123,//名称修改
    OFFLINE_EXP_SHARE_COMPLETE = 124,//离线经验奖励分享成功
    OPT_PLAYER_HEAD_FRAME_CHANGE_MESSAGE = 120,//头像框修改
    OPT_PLAYER_HEAD_FRAME_UP_MESSAGE = 133,//头像框升级
    OPT_PLAYER_HEAD_UP_MESSAGE = 134,//头像升级

    OPEN_PLAYER_MESSAGE = 201,//开启角色
    OTHER_MESSAGE = 131,//别人玩家的信息

    GOODS_LIST_MESSAGE = 301,		//物品列表
    GOODS_LIST_ADD_MESSAGE = 302,   //背包列表增加
    GOODS_LIST_USE_MESSAGE = 303,   //背包列表使用
    GAME_CLOTHEQUIP_MESSAGE = 304,        //穿装备
    GOODS_ARTIFACT_EQUIP_MESSAGE = 305, //装备灵器
    USE_HORSE_ORDER_MESSAGE = 306,	//使用坐骑副本令
    USE_WEAPON_ORDER_MESSAGE = 307,	//使用神兵副本令
    USE_CLOTHES_ORDER_MESSAGE = 308,//使用神装副本令
    USE_WING_ORDER_MESSAGE = 309,	//使用仙羽副本令
    USE_MAGIC_ORDER_MESSAGE = 310,	//使用法宝副本令
    USE_LADDER_ORDER_MESSAGE = 311,	//使用天梯挑战令
    USE_EXPLORE_ORDER_MESSAGE = 312,//使用探索令
    USE_ESCORT_PASS_ORDER_MESSAGE = 313,//使用渡魂通行令
    USE_ESCORT_ROB_ORDER_MESSAGE = 314, //使用渡魂抢夺令
    USE_BOSS_DEKARON_ORDER_MESSAGE = 315, //使用Boss挑战令
    GOODS_LIMIT_LIST_MESSAGE = 316, //限时物品列表
    GOODS_LIMIT_ADD_MESSAGE = 317,	//添加限时物品
    USE_ARENA_ORDER_MESSAGE = 318,	//使用竞技令

    FOURINAGE_UPLEVEL_MESSAGE = 331,//铜镜玉笛升级更新消息
    FOURINAGE_UPUPGRADE_MESSAGE = 332,//左眼右眸升级更新消息

    TITLE_LIST_MESSAGE = 365,//称号列表消息
    TITLE_WEAR_MESSAGE = 366,//佩戴称号消息
    TITLE_JIHUO_MESSAGE = 367,//激活称号消息

    FASHIONSETL_ACT_MESSAGE = 368,//套装激活
    FASHIONSETL_UPLV_MESSAGE = 369,//套装升级

    //战斗
    GAME_FIGHT_START_MSG = 2001,    //战斗请求
    GAME_FIGHT_RESULT_MSG = 2002,   //战斗结果
    GAME_FIGHT_DUP_ENTER = 2003,    //进入副本
    GAME_FIGHT_DUP_RESULT = 2004,   //副本结果
    GAME_DUP_INFO_MESSAGE = 2005,   //副本信息请求
    GAME_DUP_BUYNUM_MESSAGE = 2006, //副本次数购买
    GAME_DUP_SWEEP_MESSAGE = 2007, //副本扫荡
    GAME_BLESSDUP_PROGRESS_MSG = 3006,//祝福本进度
    GAME_SIXIANG_PROGRESS_MSG = 3007,//四象本进度消息
    GAME_SIXIANG_REWARD_MSG = 333,//四象本领取奖励
    GAME_BLESSDUP_REWARD_MSG = 334,//祝福本领奖

    //组队副本
    TEAMDUP_CREATETEAM_MESSAGE = 2301,//创建队伍
    TEAMDUP_JOINTEAM_MESSAGE = 2302,//加入队伍
    TEAMDUP_LEAVETEAM_MESSAGE = 2303,//离开队伍
    TEAMDUP_READYINFO_MESSAGE = 2304,//队伍准备
    TEAMDUP_TEAMDAMAGE_MESSAGE = 2305,//伤害信息
    TEAMDUP_QUITSCENE_MESSAGE = 2306,//退出场景
    TEAMDUP_DROPGOODS_MESSAGE = 2307,//组队副本掉落物品

    //遭遇战
    YEWAIPVP_FIGHTTER_INFO_MSG = 2801,//野外PVP周围玩家信息
    YEWAIPVP_FIND_FIGHTTER_MSG = 2802,//野外PVP寻找
    PAIHANGBANG_ZAOYUBANG_MESSAGE = 2803,//排行榜遭遇榜
    YEWAIPVP_FIGHT_LOG_MSG = 2804,//野外PVP战斗记录
    YEWAIPVP_FIGHT_PK_MSG = 2805,//野外PVP请求战斗
    YEWAIPVP_FIHGT_RESULT_MSG = 2806,//野外PVP战斗结果

    //全民BOSS
    ALLPEOPLE_BOSS_LISTINFO_MSG = 730,//全民BOSS列表信息
    ALLPEOPLE_BOSS_ENTER_MSG = 731,//进入全民BOSS战斗
    ALLPEOPLE_BOSS_LEAVE_MSG = 732,//退出全民BOSS战斗
    ALLPEOPLE_BOSS_RESULT_MSG = 733,//全民BOSS结算
    ALLPEOPLE_FIGHT_UPDATE_MSG = 734,//全民BOSS战斗轮询
    ALLPEOPLE_RANK_INFO_MSG = 735,//全民BOSS排行榜数据
    ALLPEOPLE_REBORN_NOTICE_MSG = 736,//全民BOSS BOSS刷新提示
    ALLPEOPLE_SET_REMIND_MSG = 737,//设置全民BOSS提示
    ALLPEOPLE_OTHERBODY_MSG = 738,//全民BOSS场景内其他玩家
    ALLPEOPLE_PK_MESSAGE = 739,//全民BOSS pk
    ALLPEOPLE_PVP_REVIVE = 7391,//全民BOSS 复活
    ALLPEOPLE_DEAD_MSG = 754, //全民BOSS死亡消息
    ALLPEOPLE_FT_MSG = 755,  //全民BOSS战斗次数

    //血战BOSS
    XUEZHANBOSS_LISTINFO_MSG = 1600,//血战BOSS列表信息
    XUEZHANBOSS_ENTER_MSG = 1601,//进入血战BOSS战斗
    XUEZHANBOSS_LEAVE_MSG = 1602,//退出血战BOSS战斗
    XUEZHANBOSS_RESULT_MSG = 1603,//血战BOSS结算
    XUEZHANBOSS_FIGHT_UPDATE_MSG = 1604,//血战BOSS战斗轮询
    XUEZHANBOSS_RANK_INFO_MSG = 1605,//血战BOSS排行榜数据
    XUEZHANBOSS_REBORN_NOTICE_MSG = 1606,//血战BOSS BOSS刷新提示
    XUEZHANBOSS_SET_REMIND_MSG = 1607,//设置血战BOSS提示
    XUEZHANBOSS_OTHERBODY_MSG = 1608,//血战BOSS场景内其他玩家
    XUEZHANBOSS_OTHERPK_MSG = 1609,//血战BOSS发起PK行为
    XUEZHANBOSS_OTHERPK_FINISH_MSG = 1610,//血战BOSS PK结束
    XUEZHANBOSS_REBORN_MSG = 1611,//血战BOSS 复活
    //VIPBOSS
    VIPBOSS_LISTINFO_MSG = 1650,//VIPBOSS列表信息
    VIPBOSS_ENTER_MSG = 1651,//VIPBOSS进入战斗
    VIPBOSS_LEAVE_MSG = 1652,//退出VIPBOSS战斗
    VIPBOSS_RESULT_MSG = 1653,//VIPBOSS结算
    VIPBOSS_FIGHT_UPDATE_MSG = 1654,//VIPBOSS战斗轮询
    VIPBOSS_RANK_INFO_MSG = 1655,//VIPBOSS排行榜数据
    VIPBOSS_REBORN_NOTICE_MSG = 1656,//VIPBOSS BOSS刷新提示
    VIPBOSS_SET_REMIND_MSG = 1657,//设置VIPBOSS提示
    VIPBOSS_OTHERBODY_MSG = 1658,//VIPBOSS场景内其他玩家
    VIPBOSS_OTHERPK_MSG = 1659,//VIPBOSS发起PK行为
    VIPBOSS_OTHERPK_FINISH_MSG = 1660,//VIPBOSS PK结束
    VIPBOSS_REBORN_MSG = 1661,//VIPBOSS 复活
    //转生BOSS
    SAMSARA_BOSS_LISTINFO_MSG = 740,//转生BOSS列表信息
    SAMSARA_BOSS_ENTER_MSG = 741,//进入转生BOSS战斗
    SAMSARA_BOSS_FIGHT_MSG = 742,//转生BOSS的战斗轮询
    SAMSARA_BOSS_TARGET_MSG = 743,//转生BOSS的目标
    SAMSARA_BOSS_RANK_MSG = 744,//转生BOSS战斗排行榜
    SAMSARA_BOSS_OTHERBODY_MSG = 745,//转生BOSS场景内其他玩家
    SAMSARA_BOSS_REBORN_MSG = 746,//转生BOSS 复活
    SAMSARA_BOSS_KILLLOG_MSG = 747,//转生BOSS上期击杀日志
    SAMSARA_BOSS_REMIND_MSG = 748,//转生BOSS 提醒
    SAMSARA_BOSS_OTHERLEAVE_MSG = 749,//有人离开了战场
    SAMSARA_BOSS_BACKAWD_MSG = 850,//找回奖励
    //探索BOSS
    EXPLOREBOSS_BOSS_INIT = 7500,    //初始化BOSS列表
    EXPLOREBOSS_BOSS_RANK = 7510,    //BOSS伤害排行
    EXPLOREBOSS_BOSS_FIGHTENTER = 7520,   //参与击杀BOSS
    EXPLOREBOSS_BOSS_FIGHTRESULT = 7530,  //BOSS战斗结果
    EXPLOREBOSS_LIFE_MSG = 7540,    //更新探索体力
    EXPLOREBOSS_ENTER_MSG = 7550,  //进入探索地图
    EXPLOREBOSS_EXPLORETASK_MSG = 7560,//进行一次探索
    EXPLOREBOSS_FINISH_MSG = 7570,   //探索任务结束
    EXPLOREBOSS_LEAVE_MSG = 7580,    //离开探索地图

    SKILL_UP_MESSAGE = 501,        //技能升级
    SKILL_UP_AUTO_MESSAGE = 502,   //一键技能升级
    SKILL_UPGRADE_MESSAGE = 503,   //技能升阶消息
    GONGFA_DATE_MESSAGE = 555,//功法信息消息

    GEM_LOTTERY_MESSAGE = 563,//宝石抽奖
    GEM_LOTTERY_LOGS_MESSAGE = 564,//宝石抽奖log

    BLESS_UP_MESSAGE = 601,	//祝福值升阶
    BLESS_HORSE_UP_MESSAGE = 1601,	//战骑升阶
    // BLESS_WEAPON_UP_MESSAGE = 602,	//神兵升阶
    // BLESS_CLOTHES_UP_MESSAGE = 603,	//神装升阶
    // BLESS_WING_UP_MESSAGE = 604,	//仙羽升阶
    // BLESS_MAGIC_UP_MESSAGE = 605,   //法宝升阶
    BLESS_HORSE_GROW_MESSAGE = 606, //坐骑成长丹
    BLESS_HORSE_APTITUDE_MESSAGE = 607, //坐骑资质丹
    BLESS_WEAPON_GROW_MESSAGE = 608, //神兵成长丹
    BLESS_WEAPON_APTITUDE_MESSAGE = 609, //神兵资质丹
    MOUNT_UP_PILL_MESSAGE = 610, //坐骑直升丹
    BLESS_CLOTHES_APTITUDE_MESSAGE = 611, //神装资质丹
    BLESS_WING_GROW_MESSAGE = 612, //仙羽成长丹
    BLESS_WING_APTITUDE_MESSAGE = 613, //仙羽资质丹
    BLESS_MAGIC_GROW_MESSAGE = 614, //法宝成长丹
    BLESS_MAGIC_APTITUDE_MESSAGE = 615, //法宝资质丹
    BLESS_COUNT_DOWN_MESSAGE = 616, //祝福值倒计时
    BLESS_HORSE_UP_PILL_MESSAGE = 617,	//坐骑直升丹
    BLESS_WEAPON_UP_PILL_MESSAGE = 618,	//神兵直升丹
    BLESS_CLOTHES_UP_PILL_MESSAGE = 619,	//神装直升丹
    BLESS_EQUIP_MESSAGE = 620,	//祝福值装备
    BLESS_EQUIP_SLOT_MESSAGE = 621,	//祝福值装备槽位
    BLESS_UP_SKILL_MESSAGE = 630,//祝福值技能升级
    BLESS_UP_DAN_MESSAGE = 631,//祝福值丹
    BLESS_WAKE_UP_MESSAGE = 632,  //祝福值玩法觉醒

    PLAYER_INTENSIFY_MESSAGE = 551,//强化操作
    PLAYER_INFUSE_SOUL_MESSAGE = 550,//注灵操作
    PLAYER_SMELT_SPECIAL_MESSAGE = 552,//坐骑装备熔炼
    PLAYER_SMELT_COMMON_MESSAGE = 554,  //人物装备熔炼


    PLAYER_ZHUHUN_MESSAGE = 553, //装备铸魂

    PLAYER_LEGEND_ACTIVATE_MESSAGE = 651,//神器激活
    PLAYER_LEGEND_UPGRADE_MESSAGE = 652,//神器升级

    VIPGOD_ARTIFACT_ACTIVATE_MESSAGE = 656,//VIP神器激活
    VIPGOD_ARTIFACT_UPGRADE_MESSAGE = 657,//VIP神器升级

    PLAYER_PULSE_UPGRADE_MESSAGE = 660,//经脉升级
    PLAYER_QIHUN_UPGRADE_MESSAGE = 665,//经脉升级

    PLAYER_BUY_SHOP_GOODS_MESSAGE = 801,//购买商城商品
    PLAYER_SHENMISHOP_GOODS_MESSAGE = 160,//神秘商店
    PLAYER_SHENMISHOP_BUY_MESSAGE = 161,//购买神秘商店
    PLAYER_SHENMISHOP_UPDATE_MESSAGE = 162,//刷新神秘商店
    SHOP_DISCOUNT_INFO_MESSAGE = 800,//商店折扣信息

    ARENE_LADDERARENE_UPDATE_MESSAGE = 700,//天梯竞技场更新协议
    ARENE_LADDERARENE_FIGHT_MESSAGE = 701,//天梯匹配
    ARENE_LADDERARENE_RESULT_MESSAGE = 702,//天梯战斗结果
    ARENE_LADDERARENE_INSPIRE_MESSAGE = 703,//天梯鼓舞
    ARENE_LADDERARENE_RANK_MESSAGE = 704,//天梯排行榜

    ARENE_CROSS_INFO_UPDATE_MESSAGE = 2101,//跨服竞技场面板信息协议
    ARENE_CROSS_REFRESH_ENEMYLIST_MESSAGE = 2102,//跨服更换对手
    ARENE_CROSS_FIGHT_ENTER_MESSAGE = 2103,//跨服竞技场战斗请求
    ARENE_CROSS_RANK_UPDATE_MESSAGE = 2104,//跨服竞技场排行榜
    ARENE_CROSS_RANK_HISTROY_MESSAGE = 2105,//跨服竞技场战报
    ARENE_CROSS_BUY_FIGHTCOUNT_MESSAGE = 2106,//跨服竞技场购买次数
    ARENE_CROSS_WORSHIP_MESSAGE = 2107,//跨服竞技场膜拜

    ARENE_INFO_UPDATE_MESSAGE = 2201,//竞技场面板信息协议
    ARENE_REFRESH_ENEMYLIST_MESSAGE = 2202,//更换对手
    ARENE_FIGHT_ENTER_MESSAGE = 2203,//竞技场战斗请求
    ARENE_RANK_UPDATE_MESSAGE = 2204,//竞技场排行榜
    ARENE_RANK_HISTROY_MESSAGE = 2205,//竞技场战报
    ARENE_FIGHT_RESULT_MESSAGE = 2206,//竞技场战斗结果
    ARENE_BUY_FIGHTCOUNT_MESSAGE = 2207,//竞技场购买次数
    ARENA_BATTLE_SWEEP = 2208,//竞技场扫荡次数
    ARENE_FIRST_AWARD_MESSAGE = 2209,//领取首次排名奖励

    ESCORT_REVENGE_MESSAGE = 708,//复仇开始
    ESCORT_REVENGE_RESULT_MESSAGE = 709,//复仇返回

    ESCORT_DETAIL_MESSAGE = 710,//押镖数据详情
    ESCORT_DISPATCH_MESSAGE = 711,//镖车押运
    ESCORT_ROB_MESSAGE = 712,//镖车劫杀
    ESCORT_REFRESH_QUALITY_MESSAGE = 713,//镖车刷品质
    ESCORT_ROBLIST_MESSAGE = 714,//劫镖车队列表
    ESCORT_ROB_RESULT_MESSAGE = 715,//飙车劫杀返回
    ESCORT_ESCORT_DONE = 716,//运镖结束
    ESCORT_ESCORT_RECORD = 717,//渡魂日志
    ESCORT_REDPOINT_MESSAGE = 718,//渡魂日志红点
    ESCORT_AWARD_RECEIVE_MESSAGE = 719,//渡魂奖励领取

    ORANGE_MIX_MESSAGE = 720,//橙装合成
    ORANGE_UPGRADE_MESSAGE = 721,//橙装升级
    ORANGE_RES_MESSAGE = 722,//橙装分解
    CELESTIAL_COMPOUND_MESSAGE = 723,//天神装备合成
    CELESTIAL_UPGRADE_MESSAGE = 724,//天神装备升级
    CELESTIAL_DECOMPOSE_MESSAGE = 725,//天神装备分解
    TREASURE_CELESTIAL_MEESAGE = 726,//天神装备寻宝
    TREASURE_CELESTIAL_LOG_MEESAGE = 727,//天神寻宝日志
    WAREHOUSE_TAKEOUT_MESSAGE = 728,//仓库装备取出
    WAREHOUSE_MESSAGE = 729,//仓库装备
    TREASURE_WEEK_AWARD_MESSAGE = 3008,//寻宝周奖励
    ACTIVITY_CONSUMEITEM_MESSAGE = 3009,//消耗活动请求进度
    ACTIVTIY_CONSUMEITEM_RANK_MSG = 3013,//消耗活动排行
    ACTIVITY_CONSUME_TURNPLATE_MSG = 3014,//消耗转盘活动

    TASK_CHAIN_UPDATE_MESSAGE = 901,    //支线任务更新
    TASK_CHAIN_REWARD_MESSAGE = 902,    //支线任务领奖
    TASK_DAILY_INIT_MESSAGE = 903,    //日常任务初始化
    TASK_DAILY_UPDATE_MESSAGE = 904,    //日常任务更新
    JIANCHI_INFO_UPDATE_MESSAGE = 905,  //剑池属性更新
    JIANCHI_LEVELUP_MESSEAGE = 906,     //剑池升级

    SHARE_INFO_MESSAGE = 921,           //分享信息
    SHARE_COMPLETE_MESSAGE = 922,       //分享完成
    SHARE_REWARD_MESSAGE = 923,         //分享奖励
    FOCUS_REWARD_MESSAGE = 924,           //关注奖励
    WXGAME_SHARE_LEVEL_MESSAGE = 925,       //微信小游戏分享
    WXGAME_INVITE_FRIEND_MSG = 926,         //微信邀请好友
    XYX_IOS_CHARGE_MESSAGE = 927,          //微信IOS充值
    // WXGAME_SHARE_WEEKEND_MESSAGE = 928,        //周末活动
    XYX_SHARE_EXP_MESSAGE = 930,        //天师分享经验 领取
    XYX_SHARE_MASTER_MESSAGE = 931,     //分享等级激活
    SHARE_REWARD2_MESSAGE = 929,         //分享奖励2
    XYX_COLLECTION_MESSAGE = 932,       //小程序收藏奖励

    PLAYER_MAIL_MESSAGE = 810,//邮件信息
    PLAYER_MAIL_READ_MESSAGE = 811,//阅读邮件
    PLAYER_MAIL_GET_ACCESSORY_MESSAGE = 812,//领取单个附件
    PLAYER_MAIL_GET_ACCESSORY_ALL_MESSAGE = 813,//领取所有附件
    PLAYER_MAIL_NEW_MESSAGE = 814,//新邮件

    PLAYER_CHAT_RECEIVE_MESSAGE = 820,//聊天信息返回    
    PLAYER_CHAT_SEND_MESSAGE = 821,//聊天信息请求    

    PLAYER_BROADCAST_MESSAGE = 822,//广播信息    
    PLAYER_INVESTTURNPLATE_MESSAGE = 823,//转盘抽取记录


    PLAYER_PSYCH_UPGRADE_MESSAGE = 680,//元神升级
    PLAYER_PSYCH_EQUIP_MESSAGE = 681,//元神装备
    PLAYER_PSYCH_PROPHECY_MESSAGE = 682,//元神求签
    PLAYER_PSYCH_GAIN_MESSAGE = 683,//元神获得
    PLAYER_PSYCH_DECOMPOSE_MESSAGE = 684,//元神分解

    UNION_INFO_MESSAGE = 1101,//帮会信息
    UNION_LIST_MESSAGE = 1102,//帮会列表
    UNION_CREATE_MESSAGE = 1103,//创建帮会
    UNION_SEARCH_MESSAGE = 1104,//搜索帮会
    UNION_CHANGE_XUYAN_MESSAGE = 1105,//修改帮会宣言
    UNION_CHANGE_NOTICE_MESSAGE = 1106,//修改公会公告
    UNION_CHANGE_LVLIMIT_MESSAGE = 1107,//修改公会等级限制
    UNION_CHANGE_AUTOADOPT_MESSAGE = 1108,//修改帮会自动审核
    UNION_MEMBER_LIST_MESSAGE = 1109,//帮会成员
    UNION_APPLY_JOIN_MESSAGE = 1110,//请求加入帮会
    UNION_POSTION_MESSAGE = 1111,//任职
    UNION_DELETE_MEMBER_MESSAGE = 1112,//踢人
    UNION_DISSOLVED_MESSAGE = 1113,//解散帮会
    UNION_QUIT_MESSAGE = 1114,//退出帮会
    UNION_REVIEW_LIST_MESSAGE = 1115,//请求返回帮会审核成员列表
    UNION_REVIEW_OPERATION_MESSAGE = 1116,//审核操作
    UNION_TRIBUTE_MESSAGE = 1117,//帮会上香
    // UNION_SKILL_UPGRADE_MESSAGE = 1118,//公会技能升级
    UNION_TURNPLATE_FILT_MESSAGE = 1119,//公会转盘
    // UNION_SKILL_UPDATE_MESSAGE = 1120,//公会技能更新
    UNION_LOG_MESSAGE = 1121,//工会log
    UNION_SKILL2_UPGRADE_MESSAGE = 1122,//公会技能2升级
    UNION_PRIZE_RECORD_MESSAGE = 1123,//公会转盘奖励记录
    UNION_TASK_MESSAGE = 1124,//公会任务
    UNION_TASK_UPDATE_MESSAGE = 1125,//公会任务更新
    UNION_DUP_REWARD_MESSAGE = 1126,//公会副本每日奖励领取
    UNION_DUP_RANK_MESSAGE = 1127,//公会副本排行信息
    UNION_DUP_ZHUWEI_MESSAGE = 1128,//公会副本助威
    UNION_IMPEACHMENT_MESSAGE = 1129,//公会弹劾帮主
    UNION_BOSS_INFO_MESSAGE = 1131,//公会BOSS信息
    UNION_BOSS_LIST_MESSAGE = 1132,//公会BOSS列表
    UNION_BOSS_FIGHT_MESSAGE = 1133,//公会BOSS战斗
    UNION_BOSS_RESUTL_MESSAGE = 1134,//公会BOSS结果
    UNION_REVIEW_AGREE_ALL = 1135, //一键同意
    MYSTERIOUS_BOSS_INFO = 1136, //召唤神秘boss消息
    MYSTERIOUS_BOSS_FIGHT = 1137, //神秘boss开始战斗
    MYSTERIOUS_BOSS_OTHERBODY_MSG = 1138,//转生BOSS场景内其他玩家
    MYSTERIOUS_BOSS_FIGHT_INFO = 1139,    //神秘boss战斗信息
    BOSS_MYSTERIOUS_TOP_MESSAGE = 1150,    //神秘boss排行
    BOSS_MYSTERIOUS_REVIVE_MESSAGE = 1151, //神秘 BOSS复活
    BOSS_MYSTERIOUS_TARGET_MESSAGE = 1152,//神秘 BOSS目标
    BOSS_MYSTERIOUS_QUIT_MESSAGE = 1153,//神秘 BOSS目标退出
    BOSS_MYSTERIOUS_HISTORY_TOP_MESSAGE = 1154,//神秘boss历史排行

    //公会战
    UNION_BATTLE_GROUPINFO_MESSAGE = 1140,//帮会战分组信息
    UNION_BATTLE_ENJOIN_MESSAGE = 1141,//进入公会战场景消息
    UNION_BATTLE_FIGHT_MESSAGE = 1142,//公会战参战消息
    UNION_BATTLE_FIGHTRESULT_MESSAGE = 1143,//公会战战斗结果
    UNION_BATTLE_RANK_MESSAGE = 1144,//公会战排行
    UNION_BATTLE_ALLOT_MESSAGE = 1145,//公会战分配战利品
    UNION_BATTLE_DEPOT_MESSAGE = 1146,//公会战仓库
    UNION_BATTLE_BUYBUFF_MESSAGE = 1147,//购买BUFF
    UNION_BATTLE_QUIT_MESSAGE = 1148,//退出场景
    UNION_BATTLE_COMEIN_MESSAGE = 1149,//有人进场的消息

    XUEZHAN_INIT_MESSAGE = 2010,//血战信息初始化
    XUEZHAN_FIGHT_MESSAGE = 2011,//血战战斗请求
    XUEZHAN_RESULT_MESSAGE = 2012,//血战副本结果返回
    XUEZHAN_BUFF_MESSAGE = 2013,//血战BUFF
    XUEZHAN_REWARD_MESSAGE = 2014,//血战领取通关奖励
    XUEZHAN_SAODANG_MESSAGE = 2015,//血战扫荡

    //跨服BOSS
    CROSS_PVEBOSS_INFO_MESSAGE = 2151,//跨服PVEBOSS基本信息
    CROSS_PVEBOSS_RANK_MESSAGE = 2152,//跨服PVEBOSS排行信息
    CROSS_PVEBOSS_FIGHT_MESSAGE = 2153,//跨服PVEBOSS战斗消息
    CROSS_PVEBOSS_COUNTBUY_MESSAGE = 2154,//跨服PVEBOSS购买参与次数

    TEST_FIGHTING_MESSAGE = 1,//测试战斗力

    ACTIVITY_MESSAGE = 1000,//活动大厅信息
    ACTIVITY_SEVDAYLOGIN_AWARD_RECEIVE = 1001,//七日登录奖励领取
    ACTIVITY_SEVDAYOBJECTIVE_AWARD_RECEIVE = 1002,//七日目标奖励领取
    ACTIVITY_SEVDAY_MESSAGE = 1003,//七日活动信息

    ACTIVITY_COATARD_REWARD = 1004, //境界领奖

    /**神通相关**/
    SHENTONG_INIT_BAG_MESSAGE = 1201,//神通背包位始化
    SHENTONG_LOTTERY_MESSAGE = 1202,//神通抽奖
    SHENTONG_ADD_MESSAGE = 1203,//神通添加
    SHENTONG_INIT_SLOT_MESSAGE = 1204,//培养列表
    SHENTONG_LEARN_MESSAGE = 1205,//神通领悟
    SHENTONG_UPLEVEL_MESSAGE = 1206,//神通升级
    SHENTONG_UPGRADE_MESSAGE = 1207,//神通进阶
    SHENTONG_REMOVE_MESSAGE = 1208,//神通删除
    /**幻化**/
    HUANHUA_ACTIVATE_MESSMAGE = 653,//幻化激活成功
    HUANHUA_CHANGE_MESSAGE = 654,//更改幻化外形
    GAME_TOPRANK_INFO_MESSAGE = 130,//返回玩家排行榜信息
    GAME_TOPRANK_SIMPLE_MESSAGE = 132,//简易玩家排行榜信息
    ACTIVITY_MONTHCARD_MESSAGE = 135,//月卡信息
    MONTHLY_CARD_REWARD = 136,//领取月卡
    RECHAREG_RECORD_MESSAGE = 140,//充值档位记录返回
    DAILY_WELFARE_MESSAGE = 141,//每日福利信息
    REBATE_TO_BUY_MESSAGE = 142,//购买百倍返利
    INVEST_TO_BUY_MESSAGE = 143,//购买投资计划
    INVEST_TO_OBTAIN_MESSAGE = 144,//领取投资计划利息
    TURNPLATE_FILT_MESSAGE = 145,//转盘抽奖
    TLSHOP_TO_BUY_MESSAGE = 146,//限时商城购买
    TLGIFT_TO_OBTAIN_MESSAGE = 147,//领取限时有礼奖励
    TOPRANK_GIFT_MESSAGE = 148,//冲榜有礼信息
    VIPTLGIFT_TO_BUY_MESSAGE = 149,//VIP限时有礼购买
    VIPTLSHOP_TO_BUY_MESSAGE = 150,//VIP限时商城购买
    CASHCOW_LOTTERY_MESSAGE = 151,//摇钱树抽奖
    COLLECTWORD_EXCHANGE_MESSAGE = 152,//集字兑换
    TLDOGZ_EXCHANGE_MESSAGE = 153,//神兽兑换
    ACT_RONGLIAN_DUIHUAN = 154,//熔炼兑换
    SPRINGTLSHOP_TO_BUY_MESSAGE = 155,//春节限时商城购买
    INVESTTURNPLATE_LOTTERY_MESSAGE = 156,//转盘抽奖信息
    SPATBLOOD_BUY_MESSAGE = 157,//吐血抢购
    ONEREBATEST_BUY_MESSAGE = 158,//一折神通购买
    ONEREBATEST_RECEIVE_MESSAGE = 159,//一折神通礼包领取
    XIANGOULIBAO_BUY_MESSAGE = 163,//限购礼包购买
    CHONGJILIBAO_BUY_MESSAGE = 164,//冲级礼包购买
    DABIAOJIANGLI_BUY_MESSAGE = 165,//达标奖励领取
    DABIAOPAIHANG_DATE_MESSAGE = 166,//达标排行
    LOGON_REWARD_MESSAGE = 167,//登录领取
    SIGN_REWARD_MESSAGE = 168,//签到领取
    PLAYER_CHONGZHI_LINGQV_MESSAGE = 169,//充值领取
    YAOQIANSHU_YAOQIAN = 170,// 摇钱树摇钱
    YAOQIANSHU_LINGJIANG = 171,//摇钱树领奖
    TREASURE_RANK_LIST_MESSAGE = 172,//查看寻宝排行榜详情
    WISHINGWELL_ADVANCE_MESSAGE = 173,//许愿池许愿
    ACTIVITY_FUDAI_MESSAGE = 185,//福袋活动
    LIMIT_SIGN_REWARD_MESSAGE = 186, //限时登录领取
    VIP_XIANGOULIBAO_BUY_MESSAGE = 187,//限购礼包购买
    ZHIZUN_XIANGOULIBAO_BUY_MESSAGE = 188,//至尊限购礼包购买
    FUNCTION_REWARD_MESSAGE = 190,//领取开启功能奖励
    ACTIVITY_XIANFENG = 191,   //先锋

    THRONE_INFO_MESSAGE = 760,//武坛信息
    THRONE_OCCUPY_INFO_MESSAGE = 761,//武坛争夺信息
    THRONE_OCCUPY_LEAVE_MESSAGE = 763,//武坛离开
    THRONE_OCCUPY_OBTAIN_MESSAGE = 764,//武坛领取收益
    THRONE_OCCUPY_PK_MESSAGE = 765,//武坛PK请求消息
    THRONE_OCCUPY_PK_RESULT_MESSAGE = 766,//武坛PK结果返回

    UPDATE_BAG_UPPERLIMIT = 111,//更新背包上限
    UPDATA_BAG_USELIMIT = 112,//更新使用上限

    GEM_INLAY_MESSAGE = 560,//宝石镶嵌信息
    GEM_SYNTHETIC_MESSAGE = 561,//宝石合成信息
    GEM_UPGRADE_MESSAGE = 562,//宝石升级信息

    DOMINATE_UPGRADE_MESSAGE = 351,//主宰套装升级
    DOMINATE_ADVANCE_MESSAGE = 352,//主宰套装升阶
    DOMINATE_DECOMPOSE_MESSAGE = 353,//主宰套装分解

    FASHION_ACTIVE_MESSAGE = 361, //时装激活消息
    FASHION_SHOW_MESSAGE = 362, //时装装扮消息
    FASHION_UPLEVEL_MESSAGE = 363,//时装升级

    EXCHANGE_HZSP_MESSAGE = 371,//兑换天神碎片

    PLAYER_MAGIC_MESSAGE = 602,//法宝信息
    PLAYER_MAGIC_UPGRADE_MESSAGE = 603,//法宝升级
    PLAYER_MAGIC_ADVANCE_MESSAGE = 604,//法宝进阶
    PLAYER_MAGIC_TURNPLATE_MESSAGE = 605,//法宝转盘

    PLAYER_FRIEND_LIST_MESSAGE = 1301,//好友信息
    PLAYER_FRIEND_ADD_MESSAGE = 1302,//添加好友信息
    PLAYER_FRIEND_APPLY_MESSAGE = 1303,//申请好友操作信息
    PLAYER_FRIEND_SHIELD_MESSAGE = 1304,//屏蔽操作
    PLAYER_FRIEND_DEL_MESSAGE = 1305,//删除好友或黑名单
    PLAYER_FRIEND_APPLYNEW_MESSAGE = 1306,//新申请好友提示

    PLAYER_FRIEND_SEARCH_MESSAGE = 122,//查找添加好友
    EQUIPSLOT_QUENCHING_MESSAGE = 556,//装备淬炼

    //节日商店
    FESTIVAL_SHOP_INFO_MESSAGE = 1900,//节日商店详情消息
    FESTIVAL_SHOP_BUY_MESSAGE = 1901,//节日商店购买消息
    FESTIVAL_SHOP_REFRESH_MESSAGE = 1902,//刷新节日商店

    FESTIVAL_LOGIN_AWARD_RECEIVE = 174,//节日登录活动奖励领取
    FESTIVAL_LIMIT_PURCHASE_BUY = 175,//节日限购购买
    FESTIVAL_WISHING_WELL_MESSAGE = 176,//节日许愿池许愿
    FESTIVAL_TARGET_AWARD_RECEIVE = 177,//节日达标奖励领取
    FESTIVAL_TARGET_RANKLIST_MESSAGE = 178,//节日达标排行榜
    PAY_TARGET_AWARD_RECEIVE = 179,//节日达标奖励领取
    PAY_TARGET_RANKLIST_MESSAGE = 180,//节日达标排行榜
    WEEKEND_LIMIT_PURCHASE_BUY = 181,//周末限购
    WEEKEND_LOGIN_AWARD_RECEIVE = 182,//周末登录奖励领取
    PLAYCAFE_EXCLUSIVE_AWARD_RECEIVE = 183,//玩吧专属奖励领取
    FESTIVAL_TURNPLATE_LOTTERY_MESSAGE = 184,//节日转盘转动

    //六一抽奖榜单活动
    FESTIVAL_TURNPLATE_LOTTERY_RANK = 192,//节日转盘榜单
    //活跃任务活动
    FESTIVAL_MISSION_ACT_UPDATE = 3051,//更新任务进度
    FESTIVAL_MISSION_ACT_REWARD = 3052,//领取任务奖励

    //合服活动
    HEFU_ACT_MISSION_UPDATE = 3053,//更新任务进度
    HEFU_ACT_MISSION_REWARD = 3054,//领取任务奖励
    HEFU_ACT_TURNPLATE_LOTTERY_MESSAGE = 3055,//转盘抽奖
    HEFU_ACT_TURNPLATE_LOTTERY_RANK_MSG = 3056,//转盘榜单
    HEFU_ACT_INVESTTURNPLATE_MESSAGE = 3057,//抽奖记录

    ARTIFACT_ROLL_PLATE = 3058,//神器转盘抽奖
    ARTIFACT_ROLL_RANK_MESSAGE = 3059,//神器转盘榜单
    BROADCAST_ARTIFACT_ROLL_MESSAGE = 3060,//神器抽奖记录

    PET_UPDATE_MESSAGE = 381,//宠物升级
    PET_UPGRADE_MESSAGE = 382,//宠物升阶
    PET_ACTIVE_MESSAGE = 383,//宠物激活
    PET_TRAIN_RANDOM_MESSAGE = 384,//宠物培养
    PET_TRAIN_CHANGE_MESSAGE = 385,//确认宠物培养
    PET_TRAIN_CANCEL_MESSAGE = 386,//取消宠物培养
    PET_DAN_MESSAGE = 387,//宠物丹药
    TUJIAN_MESSAGE = 391,//妖怪图鉴
    XINFA_TUJIAN_MESSAGE = 392,//心法图鉴
    PET_LOTTERY_LOG_MESSAGE = 824,//宠物抽奖的LOG
    WANBA_DESK_INFO_MESSAGE = 3001, //玩吧发送桌面信息
    WANBA_DESK_REWARD_MESSAGE = 3002, //玩吧发送桌面领奖
    WANBA_GIFT_MESSAGE = 3003, //玩吧礼包

    REBIRTH_TASK_INIT_MSG = 3004,//转生任务初始化
    REBIRTH_TASK_UPDATE_MSG = 3005,//转生任务更新
    REBIRTH_TASK_LV_MSG = 3021,//成就等级


    REBIRTH_UPGRAGE_MESSAGE = 670,//转生协议
    VIGOUR_EXCHANGE_MESSAGE = 671,//修为兑换

    //龙魂
    LONGHUN_RANDOM = 1400, //随机龙魂
    LONGHUN_CHANGE = 1401, //确认龙魂
    LONGHUN_CANCEL = 1402, //取消龙魂    

    //五行
    WUXING_UP = 1500, //五行升级
    //猎命
    FATE_UPGRADE_MESSAGE = 690,//命格升级
    FATE_ACTIVE_MESSAGE = 691,//命格装备
    FATE_LOTTERY_MESSAGE = 692,//命格抽取
    FATE_REWARD_MESSAGE = 693,//命格获取

    //天书
    TIANSHU_LEVELUP_MESSAGE = 3401,//天书升级
    TIANSHU_UPGRADE_MESSAGE = 3402,//天书升阶

    //技能附魔
    SKILLENCHANT_LEVELUP_MESSAGE = 3451,//技能附魔升级
    SKILLENCHANT_CLOTH_MESSAGE = 3452,//穿戴技能特效
    SKILLENCHANT_UPGRADE_MESSAGE = 3453,//技能附魔升阶
    SKILLENCHANT_ACTIVE_MESSAGE = 3454,//心法激活

    //仙丹
    PILL_ROLL_MESSAGE = 1701,//抽取仙丹
    PILL_USE_MESSAGE = 1702,//使用仙丹
    PILL_MESSAGE = 1703,//丹药
    PILL_HIDE_BOSS_MESSAGE = 1704,//隐藏BOSS刷新
    ONLINE_BOSS_MESSAGE = 1705,//上线仙山BOSSsize
    ENERGY_MESSAGE = 1751,//仙山
    ENERGY_GIFT = 1752,//活力赠送
    ENERGY_GIFT_RECEIVE = 1753,//活力领取
    ENERGY_GIFT_NOTIFY = 1754,//活力赠送通知

    //仙丹召唤boss
    BOSS_PILL_INFO_MESSAGE = 1800,//仙丹召唤boss
    BOSS_PILL_START_MESSAGE = 1801, //丹药召唤BOSS相关
    BOSS_PILL_QUIT_MESSAGE = 1802,//仙山BOSS退出
    BOSS_PILL_REWARD_MESSAGE = 1803,
    BOSS_PILL_FIGHT_MESSAGE = 1804,
    BOSS_PILL_TOP_MESSAGE = 1805,
    BOSS_PILL_APPEAR_MESSAGE = 1806,

    //VIP转盘
    VIP_ROLL_PLATE = 3100,
    ROLL_PLATE_REWARD = 3101,//VIP转盘奖励

    VERIFY_GIFT = 3201,//实名制礼包

    FULING_MESSAGE = 3301, //附灵
    YUANJIE_MESSAGE = 3302, //元戒

    RUNE_WEAR = 3351,//符文穿戴
    RUNE_COMPOS = 3352,//符文合成
    RUNE_COMPOSE_QUICK = 3353,//一键合成

    CROSS_CONSUMERANK = 3010,//跨服消费排行
    ACT_TUANGOU_MESSAGE = 3011,//团购活动
    ACT_CROSS_PAYRANK = 3012,//跨服充值排行

    ACT_LABA_MESSAGE = 3015,// 拉霸请求
    ACT_LABA_RANK_MESSAGE = 3016,// 拉霸排行榜请求

    ACT_FEAST_GET_MESSAGE = 3017,// 中秋信息获取
    ACT_FEAST_RUN_MESSAGE = 3018,// 中秋转盘抽取

    ACT_666_LABA_MESSAGE = 3019,// 仙侣碎片拉霸活动请求
    ACT_666_RANK_MESSAGE = 3020,// 仙侣碎片拉霸排行榜请求

    WUTAN_INFO_GET_MESSAGE = 3550,// 获取武坛信息
    WUTAN_LIST_GET_MESSAGE = 3551,// 获取武坛列表
    WUTAN_FIGHT_MESSAGE = 3552,// 武坛挑战
    WUTAN_BUY_MESSAGE = 3553,// 武坛购买
    WUTAN_HEART_MESSAGE = 3554,// 武坛心跳

    ZHANGONG_INFO_GET_MESSAGE = 3651,// 战功信息获取

    MARRIAGE_AD_MESSAGE = 3701,//征婚广告
    MARRIAGE_APPLY_MESSAGE = 3702, //征婚应答
    MARRIAGE_AD_LIST_MESSAGE = 3703,   //征婚广告列表
    MARRIAGE_DIVORCE_MESSAGE = 3704, //离婚请求
    MARRIAGE_DIVORCE_APPLY_MESSAGE = 3705, //离婚应答
    MARRIAGE_TREE_UP_MESSAGE = 3706, //姻缘树升级
    MARRIAGE_RING_UP_MESSAGE = 3707, //钻戒升级
    MARRIAGE_TREE_EXP_RECEIVE_MESSAGE = 3708, //领取对方的经验 
    MARRIAGE_TREE_EXP_MESSAGE = 3709, //有新经验获得
    MARRIAGE_PARTNER_INFO_MESSAGE = 3710, //伴侣信息
    MARRIAGE_EQUIP_LEVELUP_MESSAGE = 3711,// 结婚套装升级

    STRONGER_ACT = 3601,//强化大师激活
}