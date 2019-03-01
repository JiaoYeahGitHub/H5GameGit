class SkillEffectManager {
	private static instance: SkillEffectManager = null;

	public constructor() {
	}
	public static getInstance(): SkillEffectManager {
		if (this.instance == null) {
			this.instance = new SkillEffectManager();
		}
		return this.instance;
	}
	/**创建一个技能特效**/
	private playSkillEffDict = {};//正在播放的技能
	public createSkillEffect(skillInfo: SkillInfo, releaseBody: ActionBody, hurtBody: ActionBody = null): SkillEffectBase {
		let skillEff: SkillEffectBase = releaseBody.getSkillEffectByID(skillInfo.id);
		if (!skillEff) {
			let skillParam: SkillEffParam = new SkillEffParam(skillInfo, releaseBody, hurtBody);
			let effectClass = egret.getDefinitionByName(skillInfo.effectClass);
			if (effectClass) {
				skillEff = new effectClass(skillParam);
				releaseBody.addSkillEffectByID(skillInfo.id, skillEff);
			}
		} else {
			skillEff.param.onUpdate(skillInfo, releaseBody, hurtBody);
		}

		if (skillEff) {
			this.playSkillEffDict[skillEff.id] = skillEff;
		}
		return skillEff;
	}
	/**接收自身播放结束销毁协议**/
	public onPlayFinishHanlde(effectId: number): void {
		var skillEff: ISkillEffect = this.playSkillEffDict[effectId];
		delete this.playSkillEffDict[effectId];
		if (skillEff) {
			skillEff.dispose();
		}
	}
	// private onRecoverySkill(skillEff: ISkillEffect): void {
	// 	let skilleftBase: SkillEffectBase = skillEff as SkillEffectBase;
	// 	// skilleftBase.dispose();
	// 	skilleftBase.onDestory();
	// 	skilleftBase = null;
	// }
	/**销毁所有未播放完的动画**/
	public onDestroyAllSkillEffect(): void {
		for (let effectId in this.playSkillEffDict) {
			var skillEff: ISkillEffect = this.playSkillEffDict[effectId];
			skillEff.dispose();
		}
		this.playSkillEffDict = {};
	}
	//The end
}