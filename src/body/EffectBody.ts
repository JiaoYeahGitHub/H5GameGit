/**
 * 生物对象的父类
 * **/
class EffectBody extends egret.DisplayObjectContainer {
	private _isFlip: boolean = false;
	protected _effectBody: Animation;
	public isUnder: boolean;

	public constructor(resName, direction = null, playnum = 1) {
		super();
		var isAutoRemove: boolean = playnum > 0 ? true : false;
		this._effectBody = new Animation(resName, playnum, isAutoRemove);
		if (isAutoRemove) {
			this._effectBody.playFinishCallBack(this.onDestroy, this);
		}

		var _fiip: boolean;
		if (direction == Direction.LEFTUP || direction == Direction.LEFT || direction == Direction.LEFTDOWN) {
			_fiip = true;
		} else {
			_fiip = false;
		}
		if (_fiip != this._isFlip) {
			this._isFlip = _fiip;
			this._effectBody.scaleX *= -1;
		}
		this.addChild(this._effectBody);
	}

	public onDestroy(): void {
		if (this.parent) {
			this.parent.removeChild(this);
		}
		if (this._effectBody) {
			this._effectBody.onDestroy();
			this._effectBody = null;
			this.dispatchEvent(new egret.Event(Action_Event.BODY_EFFECT_DESTROY));
		}
	}

	public get currFrameTexture(): egret.Texture {
		if (this._effectBody) {
			return this._effectBody.currFrameTexture;
		}
		return null;
	}
	//The end
}

/**
 * 
 * 需要上下层的特效
 * 无需判断上下层的用EffectBody
 * 
 * **/
class SkillEffectBody extends EffectBody {

	public constructor(resName, direction = null, playnum = 1) {
		super(resName, direction, playnum);
	}
	//重新播放
	public onRePlay(playnum, callback = null, callobj = null, param = null): void {
		if (this._effectBody) {
			this._effectBody.playNum = playnum;
			if (callback && callobj) {
				this._effectBody.playFinishCallBack(callback, callobj, param);
			}
		}
	}
	//The end
}
