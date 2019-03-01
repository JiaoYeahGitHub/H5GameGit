class BossSkillStyle1Effect extends SkillEffectBase implements ISkillEffect {
	private skillEffects: SkillEffectBody[];
	private POS_ARY: number[][];
	private _count: number;

	public constructor(param: SkillEffParam) {
		super(param);
		this.skillEffects = [];
	}
	public play(): void {
		if (this.isdestory) {
			this.end();
			return;
		}
		super.play();
		this._count = 0;
		this.onplayEffect("Boss_skill_4");
	}
	private Style_PosAry: number[] = [330, 30, 90, 150, 210, 270];
	private Style_Distances: number[] = [150];
	private onplayEffect(skinRes: string): void {
		if (!this.isplaying) return;

		if (this.Style_Distances.length <= this._count) {
			Tool.callbackTime(this.end, this, 500);
			return;
		}

		let distance: number = this.Style_Distances[this._count];
		let _len: number = this.Style_PosAry.length;
		for (let i: number = 0; i < _len; i++) {
			let index: number = this._count * _len + i;
			if (!this.skillEffects[index]) {
				this.skillEffects[index] = new SkillEffectBody(skinRes, null, 1);
			}
			let angleNum: number = (this.Style_PosAry[i] - this._count * 30) % 360;
			let pos: egret.Point = Tool.getPosByRadiiAndAngle(this.param.releaseBody.x, this.param.releaseBody.y, angleNum, distance);
			this.skillEffects[index].x = pos.x;
			this.skillEffects[index].y = pos.y;
			this.param.releaseBody.addEffectToSprite(this.skillEffects[index], this.param.releaseBody.parent);
			this.skillEffects[index].onRePlay(1);
		}

		this._count++;
		Tool.callbackTime(this.onplayEffect, this, 100, skinRes);
	}
	//动画结束
	public dispose(): void {
		if (!this.isplaying) return;
		for (var i: number = this.skillEffects.length - 1; i >= 0; i--) {
			var _skillEft: SkillEffectBody = this.skillEffects[i];
			egret.Tween.removeTweens(_skillEft);
			_skillEft.onRePlay(0);
			if (_skillEft.parent) {
				_skillEft.parent.removeChild(_skillEft);
			}
		}
		super.dispose();
	}
	public onDestory(): void {
		this.isplaying = false;
		for (var i: number = this.skillEffects.length - 1; i >= 0; i--) {
			var _skillEft: SkillEffectBody = this.skillEffects[i];
			if (_skillEft) {
				egret.Tween.removeTweens(_skillEft);
				_skillEft.onDestroy();
				this.skillEffects.splice(i, 1);
				_skillEft = null;
			}
		}
		this.skillEffects = [];
	}
	//The end
}