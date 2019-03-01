class RetinueSkillEffect extends SkillEffectBase implements ISkillEffect {
	private arrowAnims: Animation[];
	// private MOVE_SPEED: number = 2;

	public constructor(param: SkillEffParam) {
		super(param);
		this.arrowAnims = [];
	}
	public play(): void {
		if (this.isdestory) {
			this.end();
			return;
		}
		super.play();
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		let skillAnim: Animation = BodyFactory.instance.createRetinueArrow();
		skillAnim.playNum = -1;

		let offY: number = this.param.hurtBody.data.model ? this.param.hurtBody.data.model.high / 2 : 0;
		let startX: number = releaseBody.x;
		let startY: number = releaseBody.y - 50;
		let endX: number = this.param.hurtBody.x;
		let endY: number = this.param.hurtBody.y - offY;
		let angle = (-(Math.atan2((endY - startY), (endX - startX))) * (180 / Math.PI));
		angle = angle < 0 ? 360 + angle : angle;
		// let targetPos: egret.Point = Tool.getPosByRadiiAndAngle(startX, startY, angle, Math.max(size.width / 2, size.height / 2));

		skillAnim.x = startX;
		skillAnim.y = startY;
		skillAnim.rotation = Math.round(-angle - 90);
		releaseBody.addEffectToSprite(skillAnim, releaseBody.parent);
		this.arrowAnims.push(skillAnim);
		let time: number = Math.max(200, Math.ceil(this.param.releaseBody.distanceToSelf(this.param.hurtBody)));
		egret.Tween.get(skillAnim).to({ x: endX, y: endY }, time).call(this.onRemoveArrowAnim, this, [skillAnim]);
		Tool.callbackTime(this.end, this, time + 10);
	}
	private onRemoveArrowAnim(anim: Animation): void {
		let aryIdx: number = this.arrowAnims.indexOf(anim);
		if (aryIdx >= 0) {
			BodyFactory.instance.onRecoverRetinueArrow(anim);
			this.arrowAnims.splice(aryIdx, 1);
		}
	}
	public dispose(): void {
		if (!this.isplaying) return;
		super.dispose();
	}
	public onDestory(): void {
		super.onDestory();
		for (let i: number = this.arrowAnims.length - 1; i >= 0; i--) {
			this.onRemoveArrowAnim(this.arrowAnims[i]);
		}
		this.arrowAnims = [];
	}
	//The end
}