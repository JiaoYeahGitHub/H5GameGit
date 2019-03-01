class FabaoSkillEffect extends SkillEffectBase implements ISkillEffect {
	private shandianSprites: egret.DisplayObjectContainer[];
	private LIGHTNING_HIGH: number = 400;

	public constructor(param: SkillEffParam) {
		super(param);
		this.attackCount = 2;
	}
	public play(): void {
		if (this.isdestory) {
			this.end();
			return;
		}
		super.play();
		this.onRemoveAnim();
		this.shandianSprites = [];
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		if (!releaseBody.magicbody) {
			this.end();
			return;
		}
		releaseBody.magicbody.onAttack();
		let hurtBody: ActionBody = this.param.hurtBody;

		let skill: SkillInfo = this.param.skillInfo;
		let targets: ActionBody[] = [];
		let _targetbody: ActionBody;
		let startX: number = releaseBody.magicbody.x;
		let startY: number = releaseBody.magicbody.y + releaseBody.mountOffY - releaseBody.data.model.high - 10;
		for (let i: number = 0; i < releaseBody.data.targets.length; i++) {
			_targetbody = releaseBody.data.targets[i];
			let _attackDist: number = 0;
			_attackDist = hurtBody.distanceToSelf(_targetbody);
			if (skill.model.rectType >= _attackDist) {
				targets.push(_targetbody);
				let anim: Animation = new Animation('fabao_shandian', 0, false);
				let animSprite: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
				animSprite.addChild(anim);
				this.oncraeteLightning(releaseBody.magicbody, _targetbody, animSprite, startX, startY);
				this.shandianSprites.push(animSprite);
			}
		}
		for (let i: number = 0; i < targets.length - 1; i++) {
			startX = targets[i].x;
			startY = targets[i].y + targets[i].mountOffY - targets[i].data.model.high / 2;
			Tool.callbackTime(this.onplayHurtEffect, this, 300 + Math.min(i * 100, 1000), targets[i], targets[i + 1], this.shandianSprites[i], startX, startY);
		}

		Tool.callbackTime(this.end, this, 1500);
	}
	private oncraeteLightning(releasebody: BaseBody, targetbody: ActionBody, animSprite: egret.DisplayObjectContainer, startX: number, startY: number): void {
		if (!this.isplaying) return;
		let anim: Animation = animSprite.getChildAt(0) as Animation;
		let dist: number = Math.ceil(targetbody.distanceToSelf(releasebody));
		let endX: number = targetbody.x;
		let endY: number = targetbody.y - targetbody.data.model.high / 2 + targetbody.mountOffY;
		let angle = (-(Math.atan2((endY - startY), (endX - startX))) * (180 / Math.PI));
		angle = angle < 0 ? 360 + angle : angle;
		let targetPos: egret.Point = Tool.getPosByRadiiAndAngle(startX, startY, angle, dist);
		animSprite.x = startX;
		animSprite.y = startY;
		animSprite.scaleY = Tool.toInt(dist / this.LIGHTNING_HIGH * 100) / 100;
		animSprite.rotation = Math.round(-angle - 90);
		this.param.releaseBody.addEffectToSprite(animSprite, this.param.releaseBody.parent);
		anim.playNum = 1;
	}
	private onplayHurtEffect(releasebody: BaseBody, targetbody: ActionBody, animSprite: egret.DisplayObjectContainer, startX: number, startY: number): void {
		if (!this.isplaying) return;
		this.oncraeteLightning(releasebody, targetbody, animSprite, startX, startY);
		let hurtAnim: Animation = new Animation("shandian_beiji", 2, true);
		targetbody.addEffectToSelf("TOP", hurtAnim);
		hurtAnim.y = -targetbody.data.model.high / 2;
	}
	public dispose(): void {
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		releaseBody.onHideWing(false);
		this.onRemoveAnim();
		super.dispose();
	}
	private onRemoveAnim(): void {
		if (this.shandianSprites) {
			for (let i: number = 0; i < this.shandianSprites.length; i++) {
				let sprite: egret.DisplayObjectContainer = this.shandianSprites[i];
				let anim: Animation = sprite.getChildAt(0) as Animation;
				anim.onDestroy();
				anim = null;
				if (sprite.parent) {
					sprite.parent.removeChild(sprite);
				}
				sprite = null;
			}
			this.shandianSprites = null;
		}
	}
	//The end
}