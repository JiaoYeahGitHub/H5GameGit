class ShenbingSkillEffect extends SkillEffectBase implements ISkillEffect {
	private weaponbodyAnim: BodyAnimation;
	private weaponEffects: EffectBody[];

	private DISTANCE_ARY: number[] = [100, 200, 300];

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
		this.onRemoveAnim();
		this.weaponEffects = [];

		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		let direction: Direction = releaseBody.direction;
		let weapon_Res: string = LoadManager.getInstance().getWeaponResUrl(releaseBody.data.weapon_res, "attack4", this.param.param1)
		this.weaponbodyAnim = new BodyAnimation(weapon_Res, 1, this.param.param1);
		this.weaponbodyAnim.autoRemove = true;
		if (direction == Direction.LEFTUP || direction == Direction.LEFT || direction == Direction.LEFTDOWN) {
			this.weaponbodyAnim.scaleX = -2;
		} else {
			this.weaponbodyAnim.scaleX = 2;
		}
		this.weaponbodyAnim.scaleY = 2;
		this.weaponbodyAnim.x = releaseBody.x;
		this.weaponbodyAnim.y = releaseBody.y;
		releaseBody.addEffectToSprite(this.weaponbodyAnim, releaseBody.parent);

		for (let i: number = 0; i < this.DISTANCE_ARY.length; i++) {
			Tool.callbackTime(this.onCreateEffect, this, i * 200, this.DISTANCE_ARY[i]);
		}

		this.startGhostTimer();
		Tool.callbackTime(this.end, this, 1500);
	}
	//显示裂地特效
	private onCreateEffect(distance: number): void {
		if (!this.isplaying) return;
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		let direction: Direction = releaseBody.direction;
		let weaponEffectAnim: EffectBody = new EffectBody("shenbing_01", null, 1);
		let targetPos: egret.Point = Tool.beelinePoint(releaseBody.x, releaseBody.y, releaseBody.direction, distance);
		weaponEffectAnim.x = targetPos.x;
		weaponEffectAnim.y = targetPos.y;
		releaseBody.addEffectToSprite(weaponEffectAnim, releaseBody.parent, "BOTTOM");
		this.weaponEffects.push(weaponEffectAnim);
	}
	//启动幻影
	private ghostBmpAry: egret.Bitmap[];
	private startGhostTimer(): void {
		if (!this.isplaying) return;
		Tool.addTimer(this.onGhostHandler, this, 50);
	}
	private endGhostTimer(): void {
		Tool.removeTimer(this.onGhostHandler, this, 50);
		if (this.ghostBmpAry) {
			for (let i: number = 0; i < this.ghostBmpAry.length; i++) {
				var ghostBmp: egret.Bitmap = this.ghostBmpAry[i];
				egret.Tween.removeTweens(ghostBmp);
				if (ghostBmp.parent) {
					ghostBmp.parent.removeChild(ghostBmp);
				}
				ghostBmp = null;
			}
			this.ghostBmpAry = null;
		}
	}
	private onGhostHandler(): void {
		if (!this.isplaying) {
			this.endGhostTimer();
			return;
		}
		if (!this.ghostBmpAry) {
			this.ghostBmpAry = [];
			return;
		}
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		let direction: Direction = this.param.releaseBody.direction;
		let _scaleX: number = 2;
		if (direction == Direction.LEFTUP || direction == Direction.LEFT || direction == Direction.LEFTDOWN) {
			_scaleX = -2;
		}
		let bodyTexture: egret.Texture = this.weaponbodyAnim.currFrameTexture;
		if (bodyTexture) {
			let ghostBmp: egret.Bitmap = new egret.Bitmap(bodyTexture);
			ghostBmp.scaleX = _scaleX;
			ghostBmp.scaleY = 2;
			ghostBmp.x = this.weaponbodyAnim.x + this.weaponbodyAnim.currFrameData.x * _scaleX;
			ghostBmp.y = this.weaponbodyAnim.y + this.weaponbodyAnim.currFrameData.y * 2;
			ghostBmp.alpha = 0.8;
			releaseBody.addEffectToSprite(ghostBmp, releaseBody.parent);
			egret.Tween.get(ghostBmp).wait(200).to({ alpha: 0 }, 10);
			this.ghostBmpAry.push(ghostBmp);
		}
	}
	public dispose(): void {
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		this.onRemoveAnim();
		super.dispose();
	}
	private onRemoveAnim(): void {
		this.endGhostTimer();

		if (this.weaponbodyAnim) {
			this.weaponbodyAnim.onDestroy();
			this.weaponbodyAnim = null;
		}

		if (this.weaponEffects) {
			for (let i: number = 0; i < this.weaponEffects.length; i++) {
				let anim: EffectBody = this.weaponEffects[i];
				if (!anim) continue;
				anim.onDestroy();
				anim = null;
			}
		}
		this.weaponEffects = null;
	}
	//The end
}