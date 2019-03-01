// TypeScript file
class UnionDefine {
    /**TAB类型**/
    public static TAB_HALL: number = 0;
    public static TAB_BOSS: number = 1;
    public static TAB_DUP: number = 2;
    public static TAB_BATTLE: number = 3;
    /**帮会徽章图案数**/
    public static Union_Badges_IconNum: number = 4;
    /**帮会徽章图案底色数**/
    public static Union_Badges_ColorNum: number = 4;
    /**帮会技能开启等级**/
    public static Union_Skill_Level: number = 3;
    /**帮会转盘开启等级**/
    public static Union_Trunplate_Level: number = 2;
    /**帮会技能最大数量**/
    public static Union_Skill_Max: number = 5;
    /**职位的名称列表**/
    public static Union_Postions: string[] = ["", "盟主", "副盟主", "长老", "护法", "盟众"];
    /**职位的Icon列表**/
    public static Union_Postion_Icons: string[] = ["", "wang_title_png", "fubang_title_png", "zhanglao_title_png", "hufa_title_png", "bangzhong_title_png"];
    /**帮会BOSS挑战上限**/
    public static Union_Boss_Max: number = 5;
    /**最大助威的百分比**/
    public static Union_Max_CheerNum: number = 10;
    /**帮会副本的奖励关数**/
    public static Union_Dup_AwardWave: number = 5;//每5关一个奖励
    /**帮会战最多参战帮会个数**/
    public static Union_Battle_JoinMax: number = 4;
    /** 帮会战超时时间毫秒 */
    public static UNION_BATTLE_OVER_TIME: number = 15000;
    /** 帮会战准备时间秒 */
    public static UNION_BATTLE_READY_TIME: number = 15;
    /** 帮会战总积分上限 */
    public static UNIONBATTLE_SCORE_MAX: number = 60;
    /** 帮会战复活时间 **/
    public static UNIONBATTLE_REBORN_TIME: number = 60;
    /** 帮会战复活最大次数 **/
    public static UNIONBATTLE_LIFE_TIMES: number = 3;
    /** 帮会战鼓舞消耗 **/
    public static UNIONBATTLE_BUFF_MAX: number = 5;
    /** 帮会战进场所耗时间 **/
    public static UNIONBATTLE_RUNTIME: number = 5000;
}
/**帮会职务**/
enum UNION_POSTION {
    WANG = 1,//帮主
    FUBANG = 2,//副帮主
    ZHANGLAO = 3,//长老
    HUFA = 4,//护法
    BANGZHONG = 5,//帮众
}