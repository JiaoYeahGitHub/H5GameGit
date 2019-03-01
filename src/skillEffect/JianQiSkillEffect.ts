class JianQiSkillEffect extends SkillEffectBase implements ISkillEffect {
	private effectLayer: egret.DisplayObjectContainer;
	private skillEffects: Animation[];
	private LEVEL_Y: number[] = [0, 100];
	private LEVEL_X: number[] = [0, -10, 10, 20, -20];
	private ROTATIONs: number[] = [0, -10, 10, -15, 15];
	private DELAYs: number[] = [0, 100, 150, 200, 250];
	private counts: number[] = [3, 4, 5, 5, 5];

	public constructor(param: SkillEffParam) {
		super(param);
		this.skillEffects = [];
		this.effectLayer = new egret.DisplayObjectContainer();
		this.attackCount = this.counts[this.param.skillInfo.grade - 1];
	}
	public play(): void {
		if (this.isdestory) {
			this.end();
			return;
		}

		super.play();

		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		let hurtBody: PlayerBody = this.param.hurtBody as PlayerBody;
		this.effectLayer.removeChildren();
		this.effectLayer.x = releaseBody.x;
		this.effectLayer.y = releaseBody.y - (releaseBody.data.model.high / 2) + releaseBody.mountOffY;
		this.effectLayer.rotation = (Math.atan2((hurtBody.y - releaseBody.y), (hurtBody.x - releaseBody.x))) * (180 / Math.PI) - 90;//this.param.rotation;
		if (releaseBody.inMap) {
			releaseBody.addEffectToSprite(this.effectLayer, releaseBody);
		} else {
			if (releaseBody.parent) {
				releaseBody.parent.addChild(this.effectLayer);
			}
		}

		if (!Tool.isNumber(this.skinNum) || this.skinNum != this.param.skillInfo.styleNum) {
			this.skinNum = this.param.skillInfo.styleNum;
			for (let i: number = this.skillEffects.length - 1; i >= 0; i--) {
				let _skillEft: Animation = this.skillEffects[i];
				_skillEft.onDestroy();
				_skillEft = null;
				this.skillEffects.splice(i, 1);
			}
		}

		let styleNum: number = this.skinNum > 0 ? this.skinNum - ((this.param.skillInfo.id - 1) * SkillDefine.SKIN_NUM) + 1 : 1;
		let _count: number = 0;
		for (let i: number = 0; i < this.LEVEL_Y.length; i++) {
			for (let j: number = 0; j < this.attackCount; j++) {
				let skillAnim: Animation;
				if (!this.skillEffects[_count]) {
					this.skillEffects[_count] = new Animation(`skill_fly${styleNum}_2`, 0);
				}
				skillAnim = this.skillEffects[_count];
				skillAnim.x = this.LEVEL_X[j];
				skillAnim.y = this.LEVEL_Y[i];
				skillAnim.rotation = this.ROTATIONs[j];
				_count++;
				Tool.callbackTime(this.createEffect, this, this.DELAYs[j] + i * 200, skillAnim, _count == (this.attackCount * this.LEVEL_Y.length));
			}
		}
	}
	/**创建剑气特效**/
	private createEffect(anim: Animation, isLast: boolean): void {
		if (!this.isplaying) return;
		this.effectLayer.addChild(anim);
		anim.playNum = 1;
		if (isLast) {
			anim.playFinishCallBack(this.end, this);
		}
	}
	public dispose(): void {
		if (!this.isplaying) return;
		for (var i: number = this.skillEffects.length - 1; i >= 0; i--) {
			var _skillAnim: Animation = this.skillEffects[i];
			_skillAnim.onStop();
		}
		if (this.effectLayer.parent) {
			this.effectLayer.parent.removeChild(this.effectLayer);
		}
		this.effectLayer.removeChildren();
		super.dispose();
	}
	public onDestory(): void {
		super.onDestory();
		for (var i: number = this.skillEffects.length - 1; i >= 0; i--) {
			var _skillAnim: Animation = this.skillEffects[i];
			_skillAnim.onDestroy();
		}
		this.skillEffects = null;
		if (this.effectLayer.parent) {
			this.effectLayer.parent.removeChild(this.effectLayer);
		}
		this.effectLayer = null;
	}
}