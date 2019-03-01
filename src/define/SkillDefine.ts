class SkillDefine {
	public constructor() {
	}
	public static MAX_ATKCOUNT: number = 100;//攻击标识数量最大值
	/** 攻击总动作 **/
	public static Attack_Action_Max: number = 3;

	public static MALE_SKILL1_START_IDX: number = 7;//男性基本攻击起始动作
	public static FAMALE_SKILL1_START_IDX: number = 1;//女性基本攻击起始动作
	/**角色施法顺序 按照职业存**/
	public static SKILL_RELEASE_ARY: number[] = [
		5, 4, 3, 2, 1, 1, 1, 1, 2, 1, 3, 4, 1,
		5, 2, 1, 1, 1, 3, 2, 1, 4, 1, 1, 2, 1,
		5, 3, 1, 2, 1, 4, 1, 1, 2, 3, 1, 1, 1,
		5, 2, 4, 1, 3, 1, 2, 1, 1, 1, 1, 2, 4,
		5, 2, 4, 1, 3, 1, 2, 1, 1, 1, 1, 2, 4,
		5, 2, 1, 1, 1, 3, 4, 2, 1, 1, 1, 1, 2,
		5, 4, 2, 1, 3, 1, 1, 2, 1, 1, 1, 4, 3,
		5, 3, 1, 4, 2, 1, 1, 1, 1, 3, 2, 1, 1,
	];
	public static SKILL_RELEASE_SIZE: number = 13;
	/**宠物的技能列表**/
	public static PET_SKILLS: number[] = [6];
	/**随从的技能列表**/
	public static Retinue_Skills: number[] = [6];
	/**冲锋技能ID**/
	public static CHONGFENG_SKILL_ID: number = 0;
	/**普通技能**/
	public static COMMON_SKILL_ID: number = 1;
	/** 击退距离 **/
	public static DRAWBACK_DISTANCE = 10;
	/** 技能数量 */
	public static SKILL_NUM: number = 5;
	/** 技能皮肤数量 */
	public static SKIN_NUM: number = 3;
	/** 技能开启等级 */
	public static SKILL_GRADE_MAX: number = 5;
	/** 技能对应战斗力 */
	public static SKILL_POWER_BASIC: number = 100;
	public static SKILL_GRADE_FIGHTING: number[] = [0, 4000, 6000, 10000, 20000];

	public static getSkillFighting(level: number, grade: number): number {
		var power: number = 0;
		power = level * this.SKILL_POWER_BASIC;
		for (var i: number = 0; i < grade; i++) {
			power += this.SKILL_GRADE_FIGHTING[i];
		}
		return power;
	}
	/**获取技能连续的攻击次数**/
	public static getSkillSeriesCount(skillId: number): number {
		switch (skillId) {
			case SkillDefine.COMMON_SKILL_ID:
				return 3;
			default:
				return 1;
		}
	}
	/**角色时装技能CD（回合）**/
	private static _fashionSkillCD: number;
	public static get FASHION_SKILL_CD(): number {
		if (!Tool.isNumber(this._fashionSkillCD)) {
			this._fashionSkillCD = parseInt(Constant.get(Constant.FASHION_SKILL_CD));
		}
		return this._fashionSkillCD;
	}
	/** 角色时装施法顺序 **/
	private static _fashionSkillOrder: number[];
	public static get FASION_SKILL_ORDER(): number[] {
		if (!this._fashionSkillOrder) {
			this._fashionSkillOrder = [];
			let fs_skill_order: string[] = Constant.get(Constant.FASION_SKILL_TYPE_ORDER).split(',');
			for (let i: number = 0; i < fs_skill_order.length; i++) {
				this._fashionSkillOrder.push(parseInt(fs_skill_order[i]));
			}
		}
		return this._fashionSkillOrder;
	}
	//The end
}