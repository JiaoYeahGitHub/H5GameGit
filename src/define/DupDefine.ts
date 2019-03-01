class DupDefine {
	public static AllPEOPLE_MAX_TIMES: number = 10;//全民BOSS次数上限

	public static ALLPEOPLE_SHOWBODY_MAX: number = 20;//全民BOSS显示其他玩家上限

	public static UnionDup_Limit_Time: number = 60;//帮会副本的时间限制

	public static TeamDup_Limit_Time: number = 180;//组队副本的时间

	public static VipTeam_Limit_Time: number = 180;//vip组队副本时间
	
	public static MarryTeam_Limit_Time: number = 180;//夫妻组队副本时间

	public static UnionDup_Derate_Rate: number = 20;

	public static SixiangDup_Npc_Id: number = 188;

	public static SixiangDup_Drops_Id: number[] = [10, 11, 12, 13];

	public static BlessDup_WarnDist: number = 500;

	public static BLESSDUP_POINTS: number[] = [103, 107, 111, 115, 119, 123, 127, 235, 239, 243, 247, 251, 255, 259, 367, 371, 375, 379, 383, 387, 391, 499, 503, 507, 511, 515, 519, 523, 576, 631, 635, 639, 643, 647, 651, 655, 763, 767, 771, 775, 779, 783, 787, 895, 899, 903, 907, 911, 915, 919];

}
/**副本类型**/
enum DUP_TYPE {
	DUP_PERSONALLY = 1,//个人BOSS
	DUP_CAILIAO = 2,//材料副本
	DUP_CHALLENGE = 3,//诛仙台
	DUP_UNION = 4,//帮会副本
	DUP_SIXIANG = 5,//四象
	DUP_ZHUFU = 6,//祝福
	DUP_TEAM = 7,//组队
	DUP_DIFU = 8,//地府
	DUP_XIANSHAN = 9,//仙山
	DUP_VIP_TEAM = 10,//VIP组队副本
	DUP_BLESS = 11,//祝福值挑战
	DUP_LINGXING = 12,//灵性副本
	DUP_MARRY = 13,//结婚本
	DUP_MARRY_EQUIP_SUIT_BOSS = 14,//结婚套装boss
}
/**副本子类型**/
enum CAILIAO_SUBTYPE {
	GEM = 1,//宝石
	PULSE = 2,//经脉
	PET_LEVEL = 3,//宠物升级
	PET_GRADE = 4,//宠物进阶
	CUILIAN = 5,//淬炼材料
	// PET_JINGMAI = 7,//宠物材料
	// PET_SKILL = 8,//宠物材料
}