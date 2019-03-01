class GameDefine {
	public static readonly GAME_STAGE_WIDTH: number = 600;
	public static readonly GAME_STAGE_HEIGHT: number = 1080;

	public static readonly Define_Move_Speed: number = 250;//默认行走速度
	public static readonly Attack_Move_Speed: number = 100;//攻击行动速度
	public static readonly XG_Move_Speed: number = 50;//小怪行走速度
	public static readonly PET_Move_Speed: number = 50;//宠物移动速度
	public static readonly MAGIC_Move_Speed: number = 50;//法宝移动速度
	public static readonly Jackaroo_Move_Speed: number = 400;//新手凤凰的速度
	public static readonly CHONGFENG_SPEED: number = 1200;/**冲锋速度**/

	public static PLAYER_JUMP_DIST: number = 1200;//人的跳跃距离

	public static Cover_Alpha_Value: number = 0.6;//遮挡区域的透明度

	public static Max_Role_Num: number = 1;//最大主角数量

	public static WEEK_DAY: number = 7;//每周多少天

	public static JACKAROO_AVATAR: number[] = [11];//新手外形

	public static JACKAROO_GUIDE_NUM: number = 3;

	public static PLAYER_DEFUALT_AVATAR: number[] = [0, 0, 0, -1, -1];

	public static SMELT_EQUIPS_NUM: number = 50;//熔炼提示数量
	/**属性相关**/
	public static ATTR_OBJ_KEYS: string[] = ["hp", "attack", "phyDef", "magicDef", "hit", "dodge", "crit", "duct", "block", "counter"];
	/**
	 * 游戏数值百分比量级
	 * **/
	public static GAME_ADD_RATIO: number = 10000;

	public static Max_Role_Head: number = 6;//最大头像数量

	public static MASSAGE_FAIL_MAX: number = 3;//消息通信失败最大次数

	public static Equip_Slot_Num: number = 10;
	public static Equip_Cuilian_Max: number = 10;
	public static QIANGHUA_MAX: number = 1000;//强化最大等级
	public static GEM_SLOT_NUM: number = 5;//宝石槽位数

	public static Dominate_Slot_Num: number = 4;

	public static Psych_Slot_Num: number = 7;

	public static Tujian_MAX_Lv: number = 50;

	public static OPEN_AutoFight_Wave: number = 7;

	public static UnionDup_Boss_Node: number = 148;

	public static LADDER_FIGHTCOUNT_MAX: number = 12;//天梯最大挑战次数

	public static Local_Arena_Enemy_Max: number = 5;
	public static Arena_Enemy_Max: number = 4;

	public static Xuezhan_LayerWaveNum: number = 3;//血战副本每层多少关
	public static Xuezhan_Dupid: number = 12;
	public static Xuezhan_Attr_Icons: string[] = ["gong", "fang", "xue", "ming", "shan", "zhao", "po", "bao", "ren"];

	public static VIP_BOX_ID: number = 32;

	public static Dir_All_Ary: Direction[] = [Direction.DOWN, Direction.LEFT, Direction.LEFTDOWN, Direction.LEFTUP, Direction.RIGHT, Direction.RIGHTDOWN, Direction.RIGHTUP, Direction.UP];
	/**属性名称**/
	public static Attr_Name: string[] = [];//已废弃
	public static Attr_FontName: string[] = ["生命", "攻击", "物防", "法防", "命中", "闪避", "暴击", "抗暴", "招架", "破招"];
	public static BlessName: string[] = ["飞剑", "神兵", "神装", "法宝", "仙羽"];
	/**角色属性强化显示颜色 */
	public static Attr_After_Color: number = 0x5aff91;
	/*被动技能对应ID*/
	public static InitiativeSkill = [1, 2, 3, 4];
	/*被动技能对应ID*/
	public static PassivitySkill = [10001, 10002, 10003, 10009, 10008, 10006, 10007, 10004, 10005];
	/**探索怪物列表**/
	public static Explore_Monsters: number[] = [16018, 16019, 16020, 16021, 16022, 16023, 16024, 16025];
	/**参与世界BOSS上限**/
	public static Enjoy_WorldBoss_Num: number = 20;
	/**世界BOSS显示玩家数量**/
	public static WorldBoss_PlayerNum: number = 5;
	/**世界BOSS冷却CD时间毫秒**/
	public static WorldBoss_CD_Time: number = 30000;
	/**世界BOSS排行数据最大值**/
	public static WorldBoss_RankMax: number = 10;
	/**聊天气泡持续时间**/
	public static BodyChat_ShowTime: number = 5000;

	/**神通最大槽位**/
	public static Shentong_MaxSlot: number = 8;
	/**神通槽位对应的修真的等级**/
	public static Shentong_Open_XZLevel: number[] = [1, 3, 4, 5, 6, 8, 10, 12];

	public static Domiante_IDs: number[] = [15, 16, 17, 18];

	public static Domiante_decomposeNum: number = 5;

	public static Domiante_decomposeID: number = 19;

	public static Dominate_Slot_func: number[] = [73, 74, 75, 76];

	public static Domiante_Advance_needID: number = 20;

	public static Domiante_Advance_needNum: number = 20;

	public static Domiante_Advance_add: number = 1.25;

	/**汉字数字**/
	public static Chinese_Number_Ary: string[] = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
	public static Chinese_Company_Ary: string[] = ["零", "十", "百", "千", "万", "十万", "百万", "千万", "亿"];
	/**最大神通条数**/
	public static ShenTong_MaxNum: number = 8;
	/**神通品质返还基础值**/
	public static ShenTong_Restore_Qulity: number[] = [4000, 10000, 20000, 40000, 80000, 160000];

	/*灰色滤镜*/
	// public static GaryColorFlilter: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([0.3, 0.6, 0, 0, 0, 0.3, 0.6, 0, 0, 0, 0.3, 0.6, 0, 0, 0, 0, 0, 0, 1, 0]);
	// public static WirteColorFlilter: egret.ColorMatrixFilter = new egret.ColorMatrixFilter([1, 0, 0, 0, 200, 0, 1, 0, 0, 200, 0, 0, 1, 0, 200, 0, 0, 0, 1, 0]);//[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);

	/**经脉最大数从1开始**/
	public static MAX_PULSE: number = 8;
	/**经脉最大层数从0开始**/
	public static MAX_TIER: number = 9;
	/**最大穴位数从1开始**/
	public static MAX_ACUPOINT: number = 10;

	/**获得提示优先级顺序**/
	public static HINT_PRIORITY: number[] = [13, 14, 15, 16, 17];

	/**元魂镶嵌开启等级**/
	public static PSYCH_OPEN_LV: number[] = [35, 35, 40, 45, 50, 60, 70, 80, 90, 100];

	/**熔炼装备品质提供熔炼值**/
	public static FORGE_SMELT_QUALITY_VALUE: number[] = [10, 15, 20, 40];

	/**屏蔽文字提示**/
	public static SHIELD_TXT_HINT: boolean = false;
	
	//微信首次分享等级
	public static FANGKUAI_FIRST_SHARE_LV: number = 20;

	/**天神装备位置数组**/
	public static CELESTIAL_EQUIP_SLOTS: number[] = [20, 21, 22, 23];

	public static CELESTIAL_EQUIP_ADVANCE_CONS_ID: number = 141;

	public static RED_TAB_BTN_POS: egret.Point = new egret.Point(50, 5);// 三级菜单按钮红点坐标
	public static RED_MAIN_POS: egret.Point = new egret.Point(55, 5);
	public static RED_TAB_POS: egret.Point = new egret.Point(80, -10);
	public static RED_BTN_POS: egret.Point = new egret.Point(145, -10);
	public static RED_BTN_POS_YELLOW_LITTLE: egret.Point = new egret.Point(151, -10);
	public static RED_BTN_SIXIANG: egret.Point = new egret.Point(50, 15);
	public static RED_CRICLE_STAGE_PRO: egret.Point = new egret.Point(50, 5);
	public static RED_EQUIP_SLOT: egret.Point = new egret.Point(125, 8);
	public static RED_TUJIAN_SLOT: egret.Point = new egret.Point(140, 10);

	public static RED_BTN_ACTIVITY_POS: egret.Point = new egret.Point(153, 0);
	public static RED_MAIN_II_POS: egret.Point = new egret.Point(35, 0);
	public static RED_MAIN_BTN_POS: egret.Point = new egret.Point(65, -10);
	public static RED_GOODSINSTANCE_POS: egret.Point = new egret.Point(80, -5);
	public static RED_ROLE_EQUIP_BOTTOM_POS: egret.Point = new egret.Point(60, 15);
	public static RED_FASHION_ITEM_POS: egret.Point = new egret.Point(70, -5);

	public static Pass_Wave_Num: number = 10;//10关一个奖励

	public static EQUIP_QUALITE_NAME: string[] = ["白色", "绿色", "蓝色", "紫色", "橙色", "诛仙", "伏魔"];

	public static EQUIP_QUALITE_NAME1: string[] = ["白", "绿", "蓝", "紫", "橙", "红", "暗金"];

	public static UNION_TURNPLATE_GAINID: number = 17;

	public static DISCOUNT_GOODS: string[] = ["零折", "一折", "二折", "三折", "四折", "五折", "六折", "七折", "八折", "九折"];

	//龙魂数据
	public static LONGHUAN_ATTR: number[] = [0, 1, 2, 3];
	public static LONGHUN_GOODS_ID: number = 56;
	public static LONGHUN_GOODS_NUM: number = 5;
	public static LONGHUN_DIAMOND_NUM: number = 20;
	/**回收装备价格**/
	public static EQUIP_SMELTS: number[] = [50, 100, 200, 400, 1000, 0, 0];
	/**一键回收功能开启VIPLevel**/
	public static ALL_SMELTS_VIPLEVEL: number = 4;
	//宠物数据
	public static PET_ATTR: number[] = [0, 1, 2, 3];
	public static PET_GOODS_ID: number = 468;
	public static PET_GOODS_NUM: number = 5;
	public static PET_DIAMOND_NUM: number = 500;
	//附灵数据
	public static FULING_ATTR: number[] = [0, 1, 2, 3, 6, 7];
	public static WUXIN_NUM = 5;
	//元戒数据
	public static YUANJIE_ATTR: number[] = [0, 1, 2, 3];

	public static UNION_TURNPLATE_SHOW = "3,73,1#3,72,1#3,69,1#3,19,1#2,2,5#2,14,5#2,1,100";

	public static MIN_GOLD_COATARD_LV = 6;

	public static Fate_Slot_Num = 21;
	public static ZHUANSHENG_PLUS: number[] = [0, 500, 1000, 2000, 4000];
	public static getAttrPlusKey(idx: number): string {
		return this.ATTR_OBJ_KEYS[idx - this.ATTR_OBJ_KEYS.length] + 'plus';
	}
}

/** 性别类型 */
enum SEX_TYPE {
	MALE = 0,//男
	FEMALE = 1,//女
}