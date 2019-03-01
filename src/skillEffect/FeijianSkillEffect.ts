class FeijianSkillEffect extends SkillEffectBase implements ISkillEffect {
	private Copy_Pos_Ary: string[][] = [["60,0", "-60,0", "60,0", "-60,0"], ["0,60", "60,0", "0,60", "60,0"],
	["60,-60", "60,60", "60,-60", "60,60"], ["60,0", "0,-60", "60,0", "0,-60"], ["-60,-60", "60,-60", "-60,-60", "60,-60"],
	["0,-60", "-60,0", "0,-60", "-60,0"], ["-60,60", "-60,-60", "-60,60", "-60,-60"], ["-60,0", "0,60", "-60,0", "0,60"]];
	private feijianAnims: BodyAnimation[];
	private skillEffects: SkillEffectBody[];

	public constructor(param: SkillEffParam) {
		super(param);
		this.attackCount = 5;
	}
	public play(): void {
		if (this.isdestory) {
			this.end();
			return;
		}
		super.play();

		if (this.feijianAnims) {
			this.onRemoveFeijianAnim();
		}
		if (this.skillEffects) {
			this.onRemoveSkillEft();
		}

		this.skillEffects = [];
		this.feijianAnims = [];
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		let startX: number = releaseBody.x;
		let startY: number = releaseBody.y;
		let direction: Direction = releaseBody.direction;

		let _scaleX: number = 1;
		if (direction == Direction.LEFTUP || direction == Direction.LEFT || direction == Direction.LEFTDOWN) {
			_scaleX = -1;
		}
		let feijian_Res: string = LoadManager.getInstance().getFeijianUrl(releaseBody.data.feijian_Res, "stand", this.param.param1);

		let Pos_Ary: string[] = this.Copy_Pos_Ary[direction - 1];
		for (let i: number = 0; i <= Pos_Ary.length; i++) {
			let postionXY: string[] = i == Pos_Ary.length ? ['0', '0'] : Pos_Ary[i].split(',');

			let feijianAnim: BodyAnimation = new BodyAnimation(feijian_Res, -1, this.param.param1);
			feijianAnim.scaleX = _scaleX;
			feijianAnim.x = startX;
			feijianAnim.y = startY;
			feijianAnim.alpha = 0;
			releaseBody.addEffectToSprite(feijianAnim, releaseBody.parent, "BOTTOM");
			let targetX: number = startX + parseInt(postionXY[0]);
			let targetY: number = startY + parseInt(postionXY[1]) - releaseBody.data.model.high / 2;
			let targetPos: egret.Point = Tool.getPosByRadiiAndAngle(targetX, targetY, Tool.getAngleByDir(direction) - 90, Math.max(size.width / 2, size.height / 2));
			egret.Tween.get(feijianAnim).to({ x: targetX, y: targetY, alpha: 1 }, 400);
			Tool.callbackTime(this.onCreateFeijianEffect, this, 400 + i * 200, feijianAnim, targetPos);
			if (i >= Tool.toInt(Pos_Ary.length / 2)) {
				Tool.callbackTime(this.onCreateEffect, this, 400 + i * 200, targetX, targetY);
			}
		}

		releaseBody.onHideRide(true);
		this.startGhostTimer();
		Tool.callbackTime(this.end, this, 1500);
	}
	//显示飞剑飞出特效
	private onCreateFeijianEffect(feijianAnim: BodyAnimation, targetPos: egret.Point): void {
		if (!this.isplaying) return;

		egret.Tween.get(feijianAnim).to({ x: targetPos.x, y: targetPos.y }, 300).to({ alpha: 0 }, 10);
		this.feijianAnims.push(feijianAnim);
	}
	//显示裂地特效
	private onCreateEffect(x, y): void {
		if (!this.isplaying) return;
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		let direction: Direction = releaseBody.direction;
		let skillEffect: SkillEffectBody = new SkillEffectBody("wushuangyehuo", null, 1);
		skillEffect.isUnder = true;
		skillEffect.x = x;
		skillEffect.y = y;
		if (direction == Direction.LEFTUP || direction == Direction.LEFT || direction == Direction.LEFTDOWN) {
			skillEffect.scaleX = -2;
		} else {
			skillEffect.scaleX = 2;
		}
		skillEffect.scaleY = 2;
		skillEffect.rotation = -Tool.getAngleByDir(direction);
		releaseBody.addEffectToSprite(skillEffect, releaseBody.parent);
		this.skillEffects.push(skillEffect);
	}
	//启动幻影
	private ghostAnimAry: EffectBody[];
	// private ghostBmpAry: egret.Bitmap[];
	private startGhostTimer(): void {
		if (!this.isplaying) return;
		Tool.addTimer(this.onGhostHandler, this, 50);
	}
	private endGhostTimer(): void {
		Tool.removeTimer(this.onGhostHandler, this, 50);
		// if (this.ghostBmpAry) {
		// 	for (let i: number = 0; i < this.ghostBmpAry.length; i++) {
		// 		var ghostBmp: egret.Bitmap = this.ghostBmpAry[i];
		// 		if (ghostBmp.parent) {
		// 			ghostBmp.parent.removeChild(ghostBmp);
		// 		}
		// 		ghostBmp = null;
		// 	}
		// 	this.ghostBmpAry = null;
		// }
		if (this.ghostAnimAry) {
			for (let i: number = 0; i < this.ghostAnimAry.length; i++) {
				var ghostAnim: EffectBody = this.ghostAnimAry[i];
				egret.Tween.removeTweens(ghostAnim);
				ghostAnim.onDestroy();
				ghostAnim = null;
			}
			this.ghostAnimAry = null;
		}
	}
	private onGhostHandler(): void {
		if (!this.isplaying) {
			this.endGhostTimer();
			return;
		}
		// if (!this.ghostBmpAry) {
		// 	this.ghostBmpAry = [];
		// 	return;
		// }
		// let direction: Direction = this.param.releaseBody.direction;
		// let _scaleX: number = 1.2;
		// if (direction == Direction.LEFTUP || direction == Direction.LEFT || direction == Direction.LEFTDOWN) {
		// 	_scaleX = -1.2;
		// }
		// for (let i: number = 0; i < this.feijianAnims.length; i++) {
		// 	let _skillEft: BodyAnimation = this.feijianAnims[i];
		// 	if (_skillEft.alpha == 0) continue;
		// 	let bodyTexture: egret.Texture = _skillEft.currFrameTexture;
		// 	if (bodyTexture) {
		// 		let ghostBmp: egret.Bitmap = new egret.Bitmap(bodyTexture);
		// 		ghostBmp.scaleX = _scaleX;
		// 		ghostBmp.scaleY = 1.2;
		// 		if (_scaleX > 0) {
		// 			ghostBmp.x = _skillEft.x - Tool.toInt(ghostBmp.width * 1.2 / 2);
		// 		} else {
		// 			ghostBmp.x = _skillEft.x + Tool.toInt(ghostBmp.width * 1.2 / 2);
		// 		}
		// 		ghostBmp.y = _skillEft.y - Tool.toInt(ghostBmp.height * 1.2 / 2);

		// 		ghostBmp.alpha = 0.8;
		// 		GameFight.getInstance().addBodyToMapLayer(ghostBmp);
		// 		TweenLiteUtil.onHideTween(ghostBmp, null, null, 200);
		// 		this.ghostBmpAry.push(ghostBmp);
		// 	}
		// }
		if (!this.ghostAnimAry) {
			this.ghostAnimAry = [];
			return;
		}
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;

		for (let i: number = 0; i < this.feijianAnims.length; i++) {
			let _skillEft: BodyAnimation = this.feijianAnims[i];
			if (_skillEft.alpha == 0) continue;
			let ghostAnim: EffectBody = new EffectBody(releaseBody.data.feijian_Res + "_" + "stand_ying" + "_" + this.param.param1, this.param.param1, -1);
			ghostAnim.scaleX = _skillEft.scaleX;
			ghostAnim.x = _skillEft.x;
			ghostAnim.y = _skillEft.y;
			ghostAnim.alpha = 0.8;
			ghostAnim.isUnder = true;
			releaseBody.addEffectToSprite(ghostAnim, releaseBody.parent, "BOTTOM");
			TweenLiteUtil.onHideTween(ghostAnim, null, null, 400);
			this.ghostAnimAry.push(ghostAnim);
		}
	}
	//隐藏飞剑
	private onRemoveFeijianAnim(): void {
		this.endGhostTimer();
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		releaseBody.showRideEffect();
		if (this.feijianAnims) {
			for (let i: number = this.feijianAnims.length - 1; i >= 0; i--) {
				let anim: BodyAnimation = this.feijianAnims[i];
				if (!anim) continue;
				egret.Tween.removeTweens(anim);
				anim.onDestroy();
				anim = null;
			}
			this.feijianAnims = null;
		}
	}
	//移除地裂
	private onRemoveSkillEft(): void {
		if (this.skillEffects) {
			for (let i: number = this.skillEffects.length - 1; i >= 0; i--) {
				let anim: SkillEffectBody = this.skillEffects[i];
				if (!anim) continue;
				egret.Tween.removeTweens(anim);
				anim.onDestroy();
				anim = null;
			}
			this.skillEffects = null;
		}
	}
	public dispose(): void {
		this.onRemoveFeijianAnim();
		this.onRemoveSkillEft();
		super.dispose();
	}
	//The end
}