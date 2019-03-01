class XuanWuSkillEffect extends SkillEffectBase implements ISkillEffect {
	private LEVELS: number[] = [1, 2, 3, 3, 3];
	private posAry: number[][] = [[60, 60], [60, -60], [-60, 60], [-60, -60]];
	private skillEffects: SkillEffectBody[];
	private _count: number;

	public constructor(param: SkillEffParam) {
		super(param);
		this.attackCount = 2;
		this.attackCount = this.LEVELS[this.param.skillInfo.grade - 1];
	}
	public play(): void {
		if (this.isdestory) {
			this.end();
			return;
		}
		super.play();
		this.skillEffects = [];
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		if (!Tool.isNumber(this.skinNum) || this.skinNum != this.param.skillInfo.styleNum) {
			this.skinNum = this.param.skillInfo.styleNum;
		}

		this._count = 0;
		let styleNum: number = this.skinNum > 0 ? this.skinNum - ((this.param.skillInfo.id - 1) * SkillDefine.SKIN_NUM) : 0;
		switch (styleNum) {
			case 1:
				this.onCreateEffect("skill_ta");
				break;
			case 2:
				this.onCreateEffect("skill_quantou");
				break;
			case 3:
				this.onCreateEffect("skill_bing2");
				break;
			default:
				this.onCreateEffect("skill_diyuhuo");
				break;
		}
	}
	/**--------皮肤0技能--------**/
	private Style_Levels: number[] = [2, 3, 4];
	private Style_Angles: number[] = [60, 40, 30];
	private onCreateEffect(skinRes: string): void {
		if (!this.isplaying) return;

		if (this.Style_Levels.length <= this._count) {
			Tool.callbackTime(this.end, this, 700);
			return;
		}
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		let animCount: number = this.Style_Levels[this._count];
		let gap_angle: number = this.Style_Angles[this._count];
		let distance: number = (this._count + 1) * 150;
		for (let i: number = 0; i < animCount; i++) {
			let index: number = i;
			for (let n: number = 0; n < this._count; n++) {
				index += this.Style_Levels[n];
			}
			this.skillEffects[index] = new SkillEffectBody(skinRes, null, 1);
			let _rotationDir: number = parseInt(String(releaseBody.direction)) - 1;
			let angle: number = _rotationDir * 45;
			if (i == 0 && animCount % 2 != 0) {
			} else if (i % 2 != 0) {
				angle += animCount % 2 != 0 ? Math.ceil(i / 2) * gap_angle : Math.ceil(i / 2) * gap_angle - (gap_angle / 2);
			} else {
				angle -= animCount % 2 != 0 ? Math.ceil(i / 2) * gap_angle : Math.ceil(i / 2) * gap_angle + (gap_angle / 2);
			}
			let pos: egret.Point = Tool.beelinePointByAngle(this.param.releaseBody.x, this.param.releaseBody.y, angle, distance);
			this.skillEffects[index].x = pos.x;
			this.skillEffects[index].y = pos.y;
			releaseBody.addEffectToSprite(this.skillEffects[index], releaseBody.parent);
		}
		this._count++;
		Tool.callbackTime(this.onCreateEffect, this, 100, skinRes);
	}
	public dispose(): void {
		if (!this.isplaying) return;
		if (this.skillEffects) {
			for (let i: number = this.skillEffects.length - 1; i >= 0; i--) {
				let _skillEft: SkillEffectBody = this.skillEffects[i];
				egret.Tween.removeTweens(_skillEft);
				_skillEft.onDestroy();
				_skillEft = null;
			}
			this.skillEffects = null;
		}
		super.dispose();
	}
	//The end
}