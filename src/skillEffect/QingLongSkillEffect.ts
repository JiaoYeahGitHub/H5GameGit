class QingLongSkillEffect extends SkillEffectBase implements ISkillEffect {
	private ANGLEs: number[] = [0, 90, 180, 270];
	private effects: Animation[];

	public constructor(param: SkillEffParam) {
		super(param);
		this.attackCount = 3;
	}
	public play(): void {
		if (this.isplaying) return;
		if (this.isdestory) {
			this.end();
			return;
		}
		super.play();
		this.effects = [];
		if (!Tool.isNumber(this.skinNum) || this.skinNum != this.param.skillInfo.styleNum) {
			this.skinNum = this.param.skillInfo.styleNum;
		}

		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		let styleNum: number = this.skinNum > 0 ? this.skinNum - ((this.param.skillInfo.id - 1) * SkillDefine.SKIN_NUM) : 0;
		switch (styleNum) {
			case 1:
				this.onplayEffect("skill_longjuanfeng", 0, 700);
				break;
			case 2:
				this.onplayEffect("skill_faqiu", 0, 700);
				break;
			case 3:
				this.onplayEffect("skill_dian", 300, 400);
				break;
			default:
				this.onplayEffect("skill_leibao", 300, 400);
				break;
		}
	}
	/**--------皮肤0技能--------**/
	private onplayEffect(skinRes: string, wait: number, delay: number): void {
		if (!this.isplaying) return;
		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		let _posAry: string[] = ["0,120", "120,0", "0,-120", "-120,0"];

		for (let i: number = 0; i < _posAry.length; i++) {
			let anim: Animation = new Animation(skinRes, 2, true);
			let param: string[] = _posAry[i].split(',');
			anim.x = releaseBody.x + parseInt(param[0]);
			anim.y = releaseBody.y + parseInt(param[1]);
			anim.scaleX = 1.5;
			anim.scaleY = 1.5;
			releaseBody.addEffectToSprite(anim, releaseBody.parent);
			this.effects.push(anim);
			let angle: number = this.ANGLEs[i];
			let pos: egret.Point = Tool.beelinePointByAngle(anim.x, anim.y, angle, 150);
			egret.Tween.get(anim).wait(wait).to({ x: pos.x, y: pos.y }, delay);
		}

		Tool.callbackTime(this.end, this, 700);
	}
	public dispose(): void {
		if (!this.isplaying) return;
		if (this.effects) {
			for (let i: number = this.effects.length - 1; i >= 0; i--) {
				let _skillEft: Animation = this.effects[i];
				egret.Tween.removeTweens(_skillEft);
				_skillEft.onDestroy();
				_skillEft = null;
			}
			this.effects = null;
		}
		super.dispose();
	}
	//The end
}