class XianyuSkillEffect extends SkillEffectBase implements ISkillEffect {
	private wingbodyAnim: BodyAnimation;
	private wingEffectAnim: Animation;

	public constructor(param: SkillEffParam) {
		super(param);
	}
	public play(): void {
		if (this.isdestory) {
			this.end();
			return;
		}
		super.play();
		this.onRemoveAnim();
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		let direction: Direction = releaseBody.direction;

		let wing_Res: string = LoadManager.getInstance().getWingResUrl(releaseBody.data.wing_res, "ride_stand", "1");
		this.wingbodyAnim = new BodyAnimation(wing_Res, -1, this.param.param1);
		if (direction == Direction.LEFTUP || direction == Direction.LEFT || direction == Direction.LEFTDOWN) {
			this.wingbodyAnim.scaleX = -2;
		} else {
			this.wingbodyAnim.scaleX = 2;
		}
		this.wingbodyAnim.scaleY = 2;
		this.wingbodyAnim.alpha = 0;
		releaseBody.addEffectToSelf("TOP", this.wingbodyAnim);

		releaseBody.onHideWing(true);
		egret.Tween.get(this.wingbodyAnim).wait(400).to({ alpha: 0.8 }, 50).to({ alpha: 0.2 }, 500);
		Tool.callbackTime(this.oncreateEffect, this, 400);

		Tool.callbackTime(this.end, this, 1000);
	}
	private oncreateEffect(): void {
		if (!this.isplaying) return;

		this.wingEffectAnim = new Animation("shifa_2_2", 1);
		this.wingEffectAnim.x = this.param.releaseBody.x;
		this.wingEffectAnim.y = this.param.releaseBody.y;
		this.param.releaseBody.addEffectToSprite(this.wingEffectAnim, this.param.releaseBody.parent);
	}
	public dispose(): void {
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		releaseBody.onHideWing(false);
		this.onRemoveAnim();
		super.dispose();
	}
	private onRemoveAnim(): void {
		if (this.wingbodyAnim) {
			egret.Tween.removeTweens(this.wingbodyAnim);
			this.wingbodyAnim.onDestroy();
			this.wingbodyAnim = null;
		}
		if (this.wingEffectAnim) {
			this.wingEffectAnim.onDestroy();
			this.wingEffectAnim = null;
		}
	}
	//The end
}