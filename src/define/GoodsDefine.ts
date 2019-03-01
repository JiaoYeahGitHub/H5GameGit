/** 主角装备类型 */
enum MASTER_EQUIP_TYPE {
    HEIMET = 0, //主角装备头盔
    PAULDRON = 1, //主角装备护肩
    CLOAK = 2, //主角装备披风护手
    NECKLACES = 3, //主角装备项链
    BELT = 4, //主角装备腰带
    CLOTHES = 5, //主角装备衣服
    TROUSERS = 6,//主角装备裤子
    SHOES = 7,//主角装备鞋子
    WEAPON = 8,//武器
    RING = 9,//主角装备戒指

    SIZE = 10,//长度
}

class GoodsDefine {
    /**装备槽位对应的装备类型**/
    public static EQUIP_SLOT_TYPE: number[] = [MASTER_EQUIP_TYPE.HEIMET, MASTER_EQUIP_TYPE.PAULDRON, MASTER_EQUIP_TYPE.CLOAK,
    MASTER_EQUIP_TYPE.NECKLACES, MASTER_EQUIP_TYPE.BELT, MASTER_EQUIP_TYPE.CLOTHES,
    MASTER_EQUIP_TYPE.TROUSERS, MASTER_EQUIP_TYPE.SHOES, MASTER_EQUIP_TYPE.WEAPON, MASTER_EQUIP_TYPE.RING];
    /**装备槽位对应宝石类型**/

    public static SLOT_GEMTYPE: number[][] = [[1, 2, 1, 0, 3], [1, 3, 1, 0, 2], [3, 1, 0, 1, 2], [3, 1, 0, 1, 2], [1, 2, 1, 0, 3], [1, 3, 1, 0, 2], [3, 1, 0, 1, 2], [3, 1, 0, 1, 2], [1, 2, 1, 0, 3], [1, 3, 1, 0, 2]];
    /**装备品质系数**/
    public static EQUIP_QUALITY_ADDRATE: number[] = [1, 1.25, 1.75, 2.5, 3.5, 1, 1];
    /** 道具:左眼神魂 */
    public static ITEM_ID_SP_ZUOYAN: number = 14;
    /** 道具:右眸神魂 */
    public static ITEM_ID_SP_YOUMOU: number = 15;
    /** 展示道具:声望 **/
    public static SHOWITEM_ID_PRESTIGE: number = 0;
    /** 道具:注灵石 */
    public static ITEM_ID_ZHULINGSHI: number = 3;
    /**道具：炼化之魂**/
    public static ITEM_ID_LIANHUAZHIHUN: number = 5;
    /**道具：橙装碎片**/
    public static ITEM_ID_CZSP: number = 41;
    /**道具：红装碎片**/
    public static ITEM_ID_TSSP: number = 141;
    /** 道具:坐骑成长丹 */
    public static ITEM_ID_HORSE_GROW: number = 12;
    /** 道具:神兵成长丹 */
    public static ITEM_ID_WEAPON_GROW: number = 13;
    /** 道具:神装成长丹 */
    public static ITEM_ID_CLOTHES_GROW: number = 14;
    /** 道具:仙羽成长丹 */
    public static ITEM_ID_WING_GROW: number = 15;
    /** 道具:法宝成长丹 */
    public static ITEM_ID_MAGIC_GROW: number = 16;
    /** 道具:神兵资质丹 */
    public static ITEM_ID_WEAPON_APTITUDE: number = 23;
    /** 道具:神装资质丹 */
    public static ITEM_ID_CLOTHES_APTITUDE: number = 24;
    /** 道具:仙羽资质丹 */
    public static ITEM_ID_WING_APTITUDE: number = 25;
    /** 道具:法宝资质丹 */
    public static ITEM_ID_MAGIC_APTITUDE: number = 26;
    /** 道具:限时坐骑进阶丹 */
    public static ITEM_ID_LIMIT_HORSE_RANK: number = 39;
    /** 道具:限时仙羽进阶丹 */
    public static ITEM_ID_LIMIT_WING_RANK: number = 42;
    /** 道具:限时法宝进阶丹 */
    public static ITEM_ID_LIMIT_MAGIC_RANK: number = 43;
    /** 道具:激活啸天幼犬道具 */
    public static ITEM_PET_XIAOTIAN: number = 40;
    /**道具：激活青丘狐道具**/
    public static ITEM_PET_QINGQIU: number = 53;
    /**道具：小福袋**/
    public static ITEM_FUDAI: number = 51;
    /**时装 首充**/
    public static ITEM_FIRSTPAY_FASHION: number = 543;
    /**玄器 首充**/
    public static ITEM_FIRSTPAY_XUANQI: number = 253;
    //淬炼丹
    public static ITEM_ID_CUILIAN: number = 4;

    //祝福值直升丹
    public static ITEM_BLESS_UPDAN: number[] = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
    //祝福值超级直升丹
    public static ITEM_BLESS_SUPERUPDAN: number[] = [162, 163, 164, 165, 166, 167, 168, 169, 170, 171];
    //命格神签消耗
    public static FATE_GOD_COST: number = 50;
    //命格普通抽奖
    public static ITEM_ID_FATE: number = 153;
    //命格slot等级    
    public static FATE_UNLOCK: number[] = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];
}

/** 物品类型 */
enum GOODS_TYPE {
    MASTER_EQUIP = 0, //主角装备
    SERVANT_EQUIP = 1, //灵器装备
    ITEM = 2, //道具
    BOX = 3, //宝箱
    GOLD = 4, //绑元
    DIAMOND = 5, //元宝
    EXP = 6,    //经验
    SHENGWANG = 7, //声望
    ANIMA = 8, //灵气
    YUANSHEN = 9, //元神
    FAHUN = 10,//法魂
    RONGYU = 11,  //荣誉
    VIPEXP = 12,  //VIP经验
    ARENA = 13,   //竞技点
    POINTS = 14,    //转盘积分
    SHOW = 15,  //显示
    DONATE = 16,    //帮会贡献
    SAVVY = 17, //悟性
    VIGOUR = 18, //修为
    SHENTONG = 19,//神通
    TLINTEGRAL = 20,//限时积分
    SHOJIFEN = 21,//商城积分
    HUANQI = 22,//幻气值
    DANYAO = 24,//丹药
    CAOYAO = 25,//幻气值
    RNUES = 26,//符文
    YUELI = 27,   //阅历
    ZHANGONG = 28,//战功
    // ZHULIBI = 29,//助力币
    SHAREEXP = 29,//分享货币
    GEM = 100000,
}
enum PSYCH_CHANGE_TYPE {
    CHANGE_ADD = 10075,     //装备元神获得
    //  CHANGE_ADD = 20069,     //装备元神消耗
}

enum GOODS_CHANGE_TYPE {
    GM_ADD = 0,     //GM添加
    TAKEOFF_ADD = 10001, //脱装备获得
    MERIDIAN_UP_ADD = 10002, //经脉升级奖励
    LADDER_FIGHT_REWARD = 10003, //竞技场场次奖励
    FIGHT_BRUSH_MONSTER_ADD = 10004, //挂机小怪获得
    FIGHT_BRUSH_BOSS_ADD = 10005, //挂机Boss获得
    FIGHT_DUNGEON_ADD = 10006, //副本获得
    SHOP_BUY_ADD = 10007, //商城购买获得
    MAIL_ADD = 10008, //邮件获得
    SWORD_POOL_ADD = 10009, //剑池获得
    GOODS_USE_ADD = 10010, //使用物品获得
    SPIRIT_LOTTERY_ADD = 10011, //元魂求签获得
    BLOODY_BATTLE_ADD = 10012, //血战获得
    BLESS_EQUIP_ADD = 10091,//祝福值装备获得
    MELT_ADD = 10013, //熔炼获得
    DIAL_ADD = 10035,//转盘获得
    MAGIC_TURNPLATE_ADD = 10068,//法宝转盘获得
    YEWAI_PVP_ADD = 10073,//遭遇战
    CELESTIAL_COMPOUND = 10069,//天神装备合成
    ORANGE_COMPOUND = 10014,//橙装合成
    WISHINGWELL_ADD = 10101,//许愿池获得
    SERVER_ARENA_ADD = 10109,//跨服竞技场
    XIANSHAN_ADD = 10127,//仙山
    VIPZHUANPAN_ADD = 10131,//vip转盘
    RNUES_EQUIP_PACKAGE_ADD = 10143,//战纹换下来
    RNUES_EQUIP_ADD = 10144,//战纹换下来
    /************************************************* 奖励消耗的分隔线 ****************************************************/
    STRENGTHEN_CONSUME = 20001, //强化消耗
    PASSIVESKILL_UP_CONSUME = 20002, //被动技升级消耗
    SKILL_UP_CONSUME = 20003, //技能升级消耗
    ZHULING_CONSUME = 20004, //注灵消耗
    MELT_CONSUME = 20005, //熔炼消耗
    HORSE_BLESS_CONSUME = 20006, //坐骑祝福值
    WEAPON_BLESS_CONSUME = 20007, //武器祝福值
    WING_UP_CONSUME = 20008, //翅膀升级
    CLOTHES_UP_CONSUME = 20009, //神装升级
    MAGIC_UP_CONSUME = 20010, //法宝升级
    TAKEOFF_CONSUME = 20012, //脱装备消耗
    SHENQI_UP_CONSUME = 20013, //神器升级消耗
    MERIDIAN_UP_CONSUME = 20014, //经脉升级消耗
    SHOP_BUY_CONSUME = 20015, //商城购买消耗
    DUNGEON_SWEEP_CONSUME = 20016, //副本扫荡消耗
    LADDER_BUY_COUNT_CONSUME = 20017, //天梯购买次数消耗
    SPIRIT_UPGRADE_CONSUME = 20018, //元魂升级消耗
    GOODS_USE_CONSUME = 20019, //使用物品消耗
    SPIRIT_LOTTERY_CONSUME = 20020, //元魂求签消耗
    DELAY_ADD = 1,//延迟显示
}
/** 四象装备类型 */
enum Fourinages_Type {
    XUANWU = 0,
    BAIHU = 1,
    ZHUQUE = 2,
    QINGLONG = 3,
    SIZE = 4,
}
