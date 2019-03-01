/******常量数据 读取constant.xml****** */
class Constant {
	public static readonly FASION_SKILL_TYPE_ORDER: string = "FASION_SKILL_TYPE_ORDER";//时装技能释放顺序
	public static readonly YIYUANLIBAO: string = "YIYUANLIBAO";//一元礼包
	public static readonly FATE_GOD_COST: string = "FATE_GOD_COST";//猎命到XX星
	public static readonly ESCORT_SHUAXIN: string = "ESCORT_SHUAXIN";//刷新镖车价格
	public static readonly CREATE_GANG_DIAMOND: string = "CREATE_GANG_DIAMOND";//创建帮会
	public static readonly LADDER_BUFF_PRICE: string = "LADDER_BUFF_PRICE";//天梯BUFF购买
	public static readonly GANG_WAR_BUFF_DIAMOND_COST: string = "GANG_WAR_BUFF_DIAMOND_COST";//帮会战购买BUFF
	public static readonly REIN_CALL_BACK: string = "REIN_CALL_BACK";//转生BOSS找回奖励消耗
	public static readonly SHOP_PLAYER_REFRESH: string = "SHOP_PLAYER_REFRESH";//神秘商店刷新
	public static readonly FASHION_SKILL_CD: string = "FASHION_SKILL_CD";//法宝技能回合CD
	public static readonly YIJIANZHULING_LV: string = 'YIJIANZHULING_LV';//一键注灵
	public static readonly YIJIANBAOSHI_LV: string = 'YIJIANBAOSHI_LV';//一键宝石
	public static readonly YIJIANJINGMAI_LV: string = 'YIJIANJINGMAI_LV';//一键经脉
	public static readonly YIJIANCHONGWU_LV: string = "YIJIANCHONGWU_LV";//一键宠物
	public static readonly ARENA_FIGHT_BUY_PRICE: string = "ARENA_FIGHT_BUY_PRICE";
	public static readonly SEARCH_CHALLENGE_DIAMOND: string = "SEARCH_CHALLENGE_DIAMOND";//遭遇战寻敌花费
	public static readonly KUAFU_FIGHT_NUM: string = 'KUAFU_FIGHT_NUM';//跨服最大次数
	public static readonly KUAFU_FIGHT_BUY_PRICE: string = 'KUAFU_FIGHT_BUY_PRICE';//跨服购买消耗
	public static readonly ARENA_REWARD_POINT_SUCC: string = "ARENA_REWARD_POINT_SUCC";//竞技场胜利奖励
	public static readonly ARENA_REWARD_POINT_FAIL: string = "ARENA_REWARD_POINT_FAIL";//竞技场失败奖励
	public static readonly CROSSARENA_REWARD_POINT_SUCC: string = "CROSSARENA_REWARD_POINT_SUCC";//跨服竞技场胜利奖励
	public static readonly CROSSARENA_REWARD_POINT_FAIL: string = "CROSSARENA_REWARD_POINT_FAIL";//跨服竞技场失败奖励
	public static readonly FIELD_PVP_REWARD_SUCC: string = "FIELD_PVP_REWARD_SUCC";//野外PVP胜利奖励
	public static readonly FIELD_PVP_REWARD_FAIL: string = "FIELD_PVP_REWARD_FAIL";//野外PVP失败奖励
	public static readonly KUAFU_MOBAI: string = 'KUAFU_MOBAI';
	public static readonly KUAFU_BOSS_HUIHE: string = 'KUAFU_BOSS_HUIHE';//跨服PVE BOSS的存活回合数
	public static readonly KUAFU_BOSS_NUM: string = 'KUAFU_BOSS_NUM';//跨服PVE BOSS战斗次数最大值
	public static readonly KUAFU_BOSS_TIME: string = 'KUAFU_BOSS_TIME';//跨服PVE BOSS时间段
	public static readonly KUAFU_BOSS_BUY: string = 'KUAFU_BOSS_BUY';//跨服PVE BOSS购买价格
	public static readonly XINFA_MAX_NUM: string = 'XINFA_MAX_NUM';//心法加成
	public static readonly WXGAME_INVITE_FIREND: string = 'haoyouyaoqing';//好友邀请
	// public static WXGAME_INVITE_FIREND2: string = 'haoyouyaoqing2';//好友邀请2
	public static readonly WXGAME_FIRSTAWD: string = 'FIRSTSHAREREWARDS';//微信首次分享奖励
	public static readonly LEIJIXIAOHAO_SCORE: string = 'LEIJIXIAOHAO_SCORE';//累计消耗
	public static readonly LEIJIXIAOHAO_ZHUANPAN: string = "LEIJIXIAOHAO_SHOW";//累计消耗转盘
	public static readonly FEASTSHOP_REFRESH_MONEY: string = "FEASTSHOP_REFRESH_MONEY";//节日商店刷新消耗
	public static readonly FEASTSHOP_OPEN_MONEY: string = "FEASTSHOP_OPEN_MONEY";//节日商店充值数开启条件
	public static readonly FANGKUAIWAN_HIDE_SHARE: string = "FANGKUAIWAN_HIDE_SHARE";//方块玩屏蔽分享
	public static readonly FANGKUAIWAN_SHARE_TITLE: string = "FANGKUAIWAN_SHARE_TITLE";//微信分享 标题
	public static readonly FANGKUAIWAN_SHARE_PIC: string = "FANGKUAIWAN_SHARE_PIC";//微信分享 图片
	public static readonly FANGKUAIWAN_SHARE_QUERY: string = "FANGKUAIWAN_SHARE_QUERY";//微信分享 参数
	public static readonly FANGKUAIWAN_IOS_HIDE_PANEL: string = "FANGKUAIWAN_IOS_HIDE_PANEL";//方块玩屏蔽掉IOS充值
	public static readonly XYX_MOREGAME_SWITCH: string = "XYX_MOREGAME_SWITCH";//小游戏更多游戏开关
	public static readonly XYX_CUSTOMSERVICE_SWITCH: string = "XYX_CUSTOMSERVICE_SWITCH";//小游戏客服按钮开关
	public static readonly XYX_SHOUCANGYOUXI_SWITCH: string = "XYX_SHOUCANGYOUXI_SWITCH";//小游收藏游戏

	public static readonly BLESS_WAKE_UP_ITEM: string = "BLESS_WAKE_UP_ITEM";
	public static readonly BLESS_WAKE_UP_PERCENT: string = "BLESS_WAKE_UP_PERCENT";
	public static readonly TAOZHUANG_MAX: string = "TAOZHUANG_MAX";
	public static readonly WELCOME_REWARDS: string = 'WELCOME_REWARDS';
	public static readonly VIP_POWER: string = 'VIP_POWER';
	public static readonly RENAME_COST: string = 'RENAME_COST';
	public constructor() {
	}
	public static get(id: string): string {
		try {
			let _constantDict = JsonModelManager.instance.getModelconstant();
			let model: Modelconstant = _constantDict[id];
			return model.value;
		} catch (e) {
			Tool.throwException(`读取常量${id}出错！`);
		}
	}
}