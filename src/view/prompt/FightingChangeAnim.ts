/**
 * 战斗力变化动画
 */
class FightingChangeAnim extends eui.Component {
	private fightingNum: eui.BitmapLabel;
	private change_label: eui.BitmapLabel;

	private _targetValue: number = 0;
	private _currentValue: number = 0;
	private _differenceValue: number = 0;
	private _step: number = 0;
	private _timeStamp: number;

	public constructor() {
		super();
		this.width = 625;
		this.fightingNum = new eui.BitmapLabel();
		this.fightingNum.font = "font_fight_yellow_fnt";
		this.fightingNum.letterSpacing = -8;
		this.fightingNum.x = 250;
		this.fightingNum.y = 150;
		this.fightingNum.scaleX = 0.65;
		this.fightingNum.scaleY = 0.65;
		this.fightingNum.verticalCenter = 0;
		this.change_label = new eui.BitmapLabel();
		this.change_label.letterSpacing = -8;
		this.change_label.x = 350;
		this.change_label.scaleX = 0.5;
		this.change_label.scaleY = 0.5;
		this.touchEnabled = false;
		this.touchChildren = false;
	}

	private setFighting(): void {
		this.fightingNum.text = Math.floor(this._currentValue).toString();
	}

	public onEnterFrame(e: egret.Event): void {
		if (this._step != 0) {
			this._currentValue += this._step;
			if (Math.abs(this._currentValue - this._targetValue) < Math.abs(this._step)) {
				this._currentValue = this._targetValue;
			}
			this.setFighting();
			if (this._currentValue == this._targetValue) {
				this._step = 0;
				this.change_label.alpha = 0.4;
				this.change_label.y = 0;
				this.addChild(this.change_label);
				var tw = egret.Tween.get(this.change_label);
				tw.to({ y: -40, alpha: 1 }, 800).call(function (): void {
					egret.Tween.removeTweens(this.change_label);
				}, this);
				if (this._differenceValue > 1000) {
					this.onPlayAnim3();
				}
			}
		}
		if (this._timeStamp < egret.getTimer()) {
			this.onFinish();
		}
	}

	public show(currentValue: number, targetValue: number): void {
		this._currentValue = currentValue;
		this._targetValue = targetValue;
		this._differenceValue = this._targetValue - this._currentValue;
		this._timeStamp = egret.getTimer() + 3000;
		this.onPlayAnim1();
	}
	//动画1
	private _fightAnim1: Animation;
	private _fightAnim2: Animation;
	private _fightAnim3: Animation;
	private _fightAnim4: Animation;
	private onPlayAnim1(): void {
		if (!this._fightAnim2) {
			this._fightAnim2 = new Animation("zhandoulibianhua2", 1);
			this._fightAnim2.x = 270;
			this._fightAnim2.y = 25;
		} else {
			this._fightAnim2.playNum = 1;
		}
		this.addChild(this._fightAnim2);

		if (!this._fightAnim1) {
			this._fightAnim1 = new Animation("zhandoulibianhua", 1);
			this._fightAnim1.x = 300;
			this._fightAnim1.y = 25;
		} else {
			this._fightAnim1.playNum = 1;
		}
		this._fightAnim1.playFinishCallBack(this.onPlayAnim2, this, this);
		this.addChild(this._fightAnim1);
	}
	//动画2 显示字
	private onPlayAnim2(): void {
		// let _fightAnim1: Animation = new Animation("zhandoulihuoyan", 3, true);
		// _fightAnim1.playFinishCallBack(this.onFinish, this, this);
		// _fightAnim1.x = -210;
		// _fightAnim1.y = -470;
		// this.addChild(_fightAnim1);

		this.addChild(this.fightingNum);
		this.setFighting();
		this._step = this._differenceValue / 25;
		if (this._differenceValue > 0) {
			this.change_label.font = "font_fight_green_fnt";
			this.change_label.text = "+" + this._differenceValue.toString();
		} else {
			this.change_label.font = "font_fight_red_fnt";
			this.change_label.text = this._differenceValue.toString();
		}
	}
	//动画3 战斗力暴增
	private onPlayAnim3(): void {
		if (!this._fightAnim3) {
			this._fightAnim3 = new Animation("zhandouli_baozeng_1", 1);
			this._fightAnim3.x = 0;
			this._fightAnim3.y = -450;
		} else {
			this._fightAnim3.playNum = 1;
		}
		this._fightAnim3.playFinishCallBack(this.onPlayAnim4, this, this);
		this.addChild(this._fightAnim3);
	}
	private onPlayAnim4(): void {
		if (!this._fightAnim4) {
			this._fightAnim4 = new Animation("zhandouli_baozeng_2", 3);
			this._fightAnim4.x = 0;
			this._fightAnim4.y = -450;
		} else {
			this._fightAnim4.playNum = 3;
		}
		this.addChild(this._fightAnim4);
	}
	//结束
	public onFinish(): void {
		this._step = 0;
		this.removeChildren();
		if (this.parent) {
			this.parent.removeChild(this);
		}
		egret.Tween.removeTweens(this.change_label);
	}
	//The end
}