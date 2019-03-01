/**
 * 
 * @author 
 * 
 */
class FightDefine {
	/**三个人物的进场延迟**/
	public static Player_ReStart_Delay: number[] = [0, 0, 0];
	/**跟随距离**/
	public static Follow_Dictance: number[] = [150, 300, 150];
	/**宠物跟随距离**/
	public static Pet_Follow_Dist: number = 333;
	/**战斗顺序**/
	public static ATTACT_ORDER: number[] = [0, 2, 1];

	/** 战斗结果：失败 */
	public static FIGHT_RESULT_FAIL: number = 0;
	/** 战斗结果：成功 */
	public static FIGHT_RESULT_SUCCESS: number = 1;
	/** 战斗结果：平局 */
	public static FIGHT_RESULT_TIE: number = 2;

	/**非服务器派发结果**/
	public static FIGHT_NOT_SERVERREUSLT: number = -1;

	/**剧情对话距离**/
	public static STORY_TALK_DISTANCE: number = 180;
	/**宝箱对话距离**/
	public static TREASURE_TALK_DISTANCE: number = 100;

	/**新手地图ID**/
	public static PVE_FIRST_MAPID: number = 1;
	/**PVE小怪刷怪数量**/
	public static PVE_MONSTER_NUM: number[][] = [[10, 3], [30, 5], [99999, 7]];
	/**PVEBoss刷怪数量**/
	public static PVE_BOSS_NUM: number = 1;
	/**PVE小怪起始ID**/
	public static PVE_MONSTER_COMID: number = 200;
	/**PVEBOSS起始ID**/
	public static PVE_BOSS_COMID: number = 1000;
	/**PVEBOSS模板总数**/
	public static PVE_BOSS_TOTALMODEL: number = 500;
	/**小怪的总模型数**/
	public static TOTAL_MONSTER_MODELNUM: number = 18;
	/**PVE地图其他玩家数量**/
	public static PVP_MAX_NUM: number = 4;
	/**全民BOSS 复活CD**/
	public static ALLPEOPLE_REBORN_CD: number = 20;
	/**转生BOSS 复活CD**/
	public static SAMSARA_REBORN_CD: number = 60;
	/**麻痹的CD时间**/
	public static MABI_EFFECT_CD: number = 10000;
	/**沉默的CD时间**/
	public static CHENMO_EFFECT_CD: number = 10000;

	public static ladderBuffEffect: number[] = [5, 10, 15, 25, 35, 35];

	/** 基础系数 */
	public static BASE_RATIO: number = 1.0;
	/** 防御系数 */
	// public static DEF_RATIO: number = 1.05;
	/** 攻击系数 */
	public static ATTACK_RATIO: number = 0.05;
	/** 暴击系数 */
	public static CRIT_RATIO: number = 2.0;
	/** 招架系数 */
	public static BLOCK_RATIO: number = 0.5;

	/** 闪避判定 */
	public static JUDGE_DODGE: number = 0;
	/** 暴击判定 */
	public static JUDGE_CRIT: number = 1;
	/** 招架判定 */
	public static JUDGE_BLOCK: number = 2;
	/** 麻痹判定 */
	public static JUDGE_MABI: number = 3;
	/** 沉默判定 **/
	public static JUDGE_CHENMO: number = 4;
	/** 破甲类型 **/
	public static JUDGE_POJIA: number = 5;
	/** 吸收类型 **/
	public static JUDGE_XISHOU: number = 6;
	/** 复活类型 **/
	public static JUDGE_FUHUO: number = 7;
	/** 分段判定 **/
	public static JUDGE_DUODUAN: number = 1000;

	public static JUDEGE_TXT: string[] = ["闪", "暴", "招", "晕", "默", "破", "吸", "活"];

	/** 生命战斗力系数 */
	public static FIGHT_HP_FACTOR: number = 0.4;
	/** 攻击战斗力系数 */
	public static FIGHT_ATTACK_FACTOR: number = 4;
	/** 物理防御战斗力系数 */
	public static FIGHT_PHYDEF_FACTOR: number = 2;
	/** 魔法防御战斗力系数 */
	public static FIGHT_MAGICDEF_FACTOR: number = 2;
	/** 命中战斗力系数 */
	public static FIGHT_HIT_FACTOR: number = 100;
	/** 闪避战斗力系数 */
	public static FIGHT_DODGE_FACTOR: number = 100;
	/** 招架战斗力系数 */
	public static FIGHT_BLOCK_FACTOR: number = 50;
	/** 破招战斗力系数 */
	public static FIGHT_BREAK_FACTOR: number = 50;
	/** 暴击战斗力系数 */
	public static FIGHT_CRIT_FACTOR: number = 50;
	/** 抗暴战斗力系数 */
	public static FIGHT_DUCT_FACTOR: number = 50;

	/** PVP场景伤害比例 **/
	public static readonly PVPFIGHT_DAMAGE_RATE: number = 5;
	/** 全民 血战 战斗回合 **/
	public static ALLPEOPLE_FIGHT_ROUND: number = 4;

	public constructor() {
	}
	/**获取当前关卡的小怪几刀打死**/
	public static YEWAI_XG_DEATHCOUNT: number[][] = [[99999, 4]];/**几刀砍死的规则**/
	public static getXgDeathCount(): number {
		for (let i: number = 0; i < FightDefine.YEWAI_XG_DEATHCOUNT.length; i++) {
			let passNum: number = FightDefine.YEWAI_XG_DEATHCOUNT[i][0];
			if (passNum >= GameFight.getInstance().yewaiMapId) {
				return FightDefine.YEWAI_XG_DEATHCOUNT[i][1];
			}
		}
		return 0;
	}

	/**获取判定的结果**/
	public static getFightJudge(random, mabi, chenmo, hit, crit, block): number {
		if (random < 0) return -1;
		if (random < mabi) {
			return FightDefine.JUDGE_MABI;
		} else if (random < (mabi + chenmo)) {
			return FightDefine.JUDGE_CHENMO;
		} else if (random < (mabi + chenmo + hit)) {
			return FightDefine.JUDGE_DODGE;
		} else if (random < (mabi + chenmo + hit + crit)) {
			return FightDefine.JUDGE_CRIT;
		} else if (random < (mabi + chenmo + hit + crit + block)) {
			return FightDefine.JUDGE_BLOCK;
		}
		return -1;
	}
}

/** 属性类型 */
enum ATTR_TYPE {
	HP = 0,	//生命属性
	ATTACK = 1,	//攻击属性
	PHYDEF = 2,	//物理防御属性
	MAGICDEF = 3,//法术防御属性
	HIT = 4,	//命中属性
	DODGE = 5,	//闪避属性
	CRIT = 6,	//暴击属性
	DUCT = 7,	//抗暴属性
	BLOCK = 8,	//招架属性
	BREAK = 9,	//破招属性
	SIZE = 10,	//属性数量
}
//任务类型
enum TASK_TYPE {
	Talk = 1,
}
/**采集类型**/
enum COLLECTION {
	Treasure = 1,
}
/**任务事件类型**/
enum TASK_EVENT {
	COMPLETE = 0,//0是完成任务
	Monster_Fight = 1,//触发打怪的战斗
	Treasure = 2,//触发宝箱
	Treasure_PVP = 3,//触发宝箱的PVP
	Talk = 4,//只是交谈
	PVP_Fight = 5,//交谈触发PVP
}
/**战斗场景类型**/
enum FIGHT_SCENE {
	YEWAI_XG = 0,//野外
	YEWAI_BOSS = 1,//野外BOSS
	DUP = 2,//副本
	YEWAIPVP = 3,//野外PVP
	ALLPEOPLE_BOSS = 4,//全民BOSS
	XUEZHAN_BOSS = 5,//血战BOSS
	VIP_BOSS = 6,//VIPBOSS
	SAMSARA_BOSS = 7,//转生BOSS
	LODDER_ARENA = 8,//天梯竞技场
	UNION_BOSS = 9,//帮会BOSS
	ESCORT = 10,//劫镖
	UNION_BATTLE = 11,//帮会战
	SERVER_ARENA = 12,//跨服竞技场
	EXPLORE_BOSS = 13,//世界boss
	THRONE = 14,//武坛
	REVENGE = 15,//复仇
	LOCAL_ARENA = 16, //单服竞技场
	MYSTERIOUS_BOSS = 17,//神秘boss
	DIFU_DUP = 18,//地府副本
	XIANSHAN_BOSS = 19,//仙山副本
	CROSS_PVE_BOSS = 20,//跨服PVE BOSS
}