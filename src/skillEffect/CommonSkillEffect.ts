/***
 * 基础技能效果
 * **/
class CommonSkillEffect extends SkillEffectBase implements ISkillEffect {
	private _effectBody: EffectBody;

	public constructor(param: SkillEffParam) {
		super(param);
	}
	public play(): void {
		if (this.isdestory) {
			this.end();
			return;
		}
		super.play();
		if (this._effectBody) {
			this._effectBody.onDestroy();
		}
		this._effectBody = null;

		let releaseBody: PlayerBody = this.param.releaseBody as PlayerBody;
		this._effectBody = new EffectBody(this.param.param1, null, 1);
		this._effectBody.x = releaseBody.x;
		this._effectBody.y = releaseBody.y + releaseBody.mountOffY;

		let direction: Direction = releaseBody.direction;
		let _fiip: boolean = false;
		if (direction == Direction.LEFTUP || direction == Direction.LEFT || direction == Direction.LEFTDOWN) {
			_fiip = true;
		}
		if (_fiip) {
			this._effectBody.scaleX = -1;
		} else {
			this._effectBody.scaleX = 1;
		}

		Tool.callbackTime(this.end, this, 600);
		releaseBody.addEffectToSprite(this._effectBody, releaseBody.parent);
	}
	public dispose(): void {
		if (!this.isplaying) return;
		super.dispose();
	}
	public onDestory(): void {
		super.onDestory();
		if (this._effectBody) {
			this._effectBody.onDestroy();
		}
		this._effectBody = null;
	}
	//The end
}