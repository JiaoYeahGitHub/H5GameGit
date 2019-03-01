/***
 * 朱雀技能
 * **/
class ZhuQueSkillEffect extends SkillEffectBase implements ISkillEffect {
	private POINTs: number[][];
	private skillEffects: SkillEffectBody[];
	private _count: number;

	public constructor(param: SkillEffParam) {
		super(param);
		this.attackCount = 3;
	}
	public play(): void {
		if (this.isdestory) {
			this.end();
			return;
		}
		super.play();
		this._count = 0;
		this.skillEffects = [];
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		if (!Tool.isNumber(this.skinNum) || this.skinNum != this.param.skillInfo.styleNum) {
			this.skinNum = this.param.skillInfo.styleNum;
		}
		let styleNum: number = this.skinNum > 0 ? this.skinNum - ((this.param.skillInfo.id - 1) * SkillDefine.SKIN_NUM) : 0;
		switch (styleNum) {
			case 1:
				this.onplayEffect("skill_dici");
				break;
			case 2:
				this.onplayEffect("skill_lianhua");
				break;
			case 3:
				this.onplayEffect("skill_huozhu");
				break;
			default:
				this.onplayEffect("skill_fly3_1");
				break;
		}
	}
	private Style_PosAry: string[][] = [['0,-120', '150,-50', '150,50', '0,120', '-150,50', '-150,-50'], ['0,-250', '280,-120', '280,120', '0,250', '-280,-120', '-280,120']];
	private onplayEffect(skinRes: string): void {
		if (!this.isplaying) return;

		if (!this.isplaying) return;
		if (this.Style_PosAry.length <= this._count) {
			Tool.callbackTime(this.end, this, 500);
			return;
		}

		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		let _posAry: string[] = this.Style_PosAry[this._count];
		let _len: number = _posAry.length;
		for (let i: number = 0; i < _len; i++) {
			let index: number = this._count * _len + i;
			this.skillEffects[index] = new SkillEffectBody(skinRes, null, 1);
			let param: string[] = _posAry[i].split(',');
			this.skillEffects[index].x = releaseBody.x + parseInt(param[0]);
			this.skillEffects[index].y = releaseBody.y + parseInt(param[1]);
			releaseBody.addEffectToSprite(this.skillEffects[index], releaseBody.parent);
		}
		this._count++;
		Tool.callbackTime(this.onplayEffect, this, 100, skinRes);
	}
	public dispose(): void {
		if (!this.isplaying) return;
		if (this.skillEffects) {
			for (var i: number = this.skillEffects.length - 1; i >= 0; i--) {
				var _skillEft: SkillEffectBody = this.skillEffects[i];
				if (_skillEft) {
					egret.Tween.removeTweens(_skillEft);
					_skillEft.onDestroy();
					this.skillEffects.splice(i, 1);
					_skillEft = null;
				}
			}
		}
		this.skillEffects = null;
		super.dispose();
	}
	//The end
}