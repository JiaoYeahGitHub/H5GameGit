/**
 * <p>Title: 祝福值定义</p>
 */
class BlessDefine {
    public static BLESS_STARS_MAX: number = 10;

    public static BLESS_SLOT_MAXNUM: number = 8;

    public static BLESS_SKILL_BASIC: number = 20;//技能升级初始

    public static BLESS_SKILL_MAX: number = 1000;//技能上限
    
    //大经验丹的使用
    public static BLESS_BIGITEM_LIMIT: number = 4;
    //直升丹的类型
    public static BLESS_UPDAN_NORMALTYPE: number = 1;//普通直升丹
    public static BLESS_UPDAN_SUPERTYPE: number = 2;//超级直升丹

    public static BLESS_UPDAN_MAXGRADE: number[] = [0, 4, 7];//直升丹使用有效最大阶数
    public static BLESS_NAME: string[] = ["飞剑", "神兵", "神装", "法宝", "仙羽", "法座", "幻装", "灵弓", "羽翼", "宝器"];
    public static BLESS_DESC_MIN:number[] = [1,1,1,2,3,4,4,5,5,6,6,7,7,8,8,9];
    public static BLESS_DESC_MAX:number[] = [1,2,3,4,5,5,6,6,7,7,8,8,9,9,10,10];
}
//角色祝福值类型
enum BLESS_TYPE {
    HORSE = 0,//飞剑
    WEAPON = 1,//神兵
    CLOTHES = 2,//神装
    MAGIC = 3,//法宝
    WING = 4,//翅膀
    RETINUE_HORSE = 5,//法座
    RETINUE_CLOTHES = 6,//幻装
    RETINUE_WEAPON = 7,//灵弓
    RETINUE_WING = 8,//羽翼
    RING = 9,//宝器
    SIZE = 5,
}
enum BLESS_TAB_TYPE {
	LINGSHOU = 0,
	SHENGBING = 1,
	SHENZHUANG = 2,
	GUANGHUAN = 3,
	XIANYU = 4,
}