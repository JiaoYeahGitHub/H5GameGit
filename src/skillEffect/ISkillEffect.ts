/**技能特效扩展 接口**/
interface ISkillEffect {
	id: number;
	attackCount: number;
	skinNum: number;
	// time: number;
	play(): void;//开始动作
	end(): void;//结束动作
	dispose(): void;//销毁
}
class SkillEffParam {
	public skillInfo: SkillInfo;
	public releaseBody: ActionBody;//施法对象
	public hurtBody: ActionBody;//命中对象
	public param1;//参数1

	constructor(skillInfo: SkillInfo, releaseBody: ActionBody, hurtBody: ActionBody = null) {
		this.onUpdate(skillInfo, releaseBody, hurtBody);
	}
	public onUpdate(skillInfo: SkillInfo, releaseBody: ActionBody, hurtBody: ActionBody = null): void {
		this.skillInfo = skillInfo;
		this.releaseBody = releaseBody;
		this.hurtBody = hurtBody;
	}
}
class SkillParam {
	public eftRes: string;
	public dirType: SKILL_DIR_TYPE;
	public target;
	public x: number = 0;
	public y: number = 0;
	public isBottom: boolean = false;
	public playNum: number = 1;
	public scale: number = 1;
	public layer: string = "TOP";

	constructor() {
	}
}