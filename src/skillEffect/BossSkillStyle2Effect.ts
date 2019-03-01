class BossSkillStyle2Effect extends SkillEffectBase implements ISkillEffect {
	private ANGLEs: number[] = [30, 90, 150, 210, 270, 330];
	private effects: SkillEffectBody[];

	public constructor(param: SkillEffParam) {
		super(param);
		this.effects = [];
	}
	public play(): void {
		if (this.isdestory) {
			this.end();
			return;
		}
		super.play();

		this.onplayEffect("Boss_skill_3", 0, 500);
	}
	private onplayEffect(skinRes: string, wait: number, delay: number): void {
		if (!this.isplaying) return;
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;

		for (let i: number = 0; i < this.ANGLEs.length; i++) {
			if (!this.effects[i]) {
				this.effects[i] = new SkillEffectBody(skinRes, null, 1);
			}
			let anim: SkillEffectBody = this.effects[i];
			anim.x = releaseBody.x;
			anim.y = releaseBody.y;
			anim.scaleX = anim.scaleY = 1.2;
			releaseBody.addEffectToSprite(anim, releaseBody.parent);
			let angle: number = this.ANGLEs[i];
			let pos: egret.Point = Tool.beelinePointByAngle(anim.x, anim.y, angle, 160);
			egret.Tween.get(anim).wait(wait).to({ x: pos.x, y: pos.y - 50 }, delay);
		}

		Tool.callbackTime(this.end, this, 500);
	}
	public onDestory(): void {
		if (this.effects) {
			for (let i: number = this.effects.length - 1; i >= 0; i--) {
				let _skillEft: SkillEffectBody = this.effects[i];
				egret.Tween.removeTweens(_skillEft);
				_skillEft.onDestroy();
				_skillEft = null;
			}
			this.effects = null;
		}
		super.onDestory();
	}
}