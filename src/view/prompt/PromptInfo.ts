/**
 * 提示信息
 */
class PromptInfo extends eui.Component {

	private _type: PROMPT_TYPE;
	private _label: eui.Label;
	// private _isNext: boolean = false;
	private timer: egret.Timer;
	public boo: boolean = true;
	public speed: number = 5;
	public constructor(type: PROMPT_TYPE) {
		super();
		this._type = type;
		this._label = new eui.Label();
		this.touchEnabled = false;
		this.touchChildren = false;
		if (!this.timer) {
			this.timer = new egret.Timer(1500, 1);
		}

		this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
		this.timer.start();
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage(event: egret.Event): void {
		this.setStyle();
		// this.setAnim();

		this._label.fontFamily = GameCommon.getFontFamily();
		this._label.size = 22;
		this._label.bold = true;
		// this._label.strokeColor = 0;
		// this._label.stroke = 2;
		// this._label.alpha = 1;
		this._label.anchorOffsetX = this._label.width / 2;
		this._label.anchorOffsetY = this._label.height / 2;
		this.addChild(this._label);
	}

	private setStyle(): void {
		switch (this._type) {
			case PROMPT_TYPE.ERROR:
				this._label.textColor = 0xFF0000;
				var bg: eui.Image = new eui.Image();
				bg.y = -this._label.height / 2 - 4;
				bg.source = "tips_alert_txt_bg2_png";
				bg.scale9Grid = new egret.Rectangle(17, 11, 133, 12);
				bg.width = this._label.width + 20;
				bg.height = this._label.height + 8;
				bg.anchorOffsetX = bg.width / 2;
				this.addChild(bg);
				let warnimg: eui.Image = new eui.Image();
				warnimg.y = -this._label.height / 2 - 6;
				warnimg.x = 0 - 4 - (bg.width / 2);
				warnimg.source = "tips_alert_warnimg_png";
				this.addChild(warnimg);
				this._label.x = 10;
				break;
			case PROMPT_TYPE.FUN:
				this._label.textColor = 0xFFFECE;
				//this._label.textColor = 0xFF0000;
				var bg: eui.Image = new eui.Image();
				bg.y = -this._label.height / 2 - 4;
				bg.source = "tips_alert_txt_bg2_png";
				bg.scale9Grid = new egret.Rectangle(17, 11, 133, 12);
				bg.width = this._label.width;
				bg.height = this._label.height + 8;
				bg.anchorOffsetX = bg.width / 2;
				this.addChild(bg);
				break;
			case PROMPT_TYPE.GAIN:
				//this._label.textColor = 0xFF0000;
				var bg: eui.Image = new eui.Image();
				bg.y = -this._label.height / 2 - 4;
				bg.source = "tips_alert_txt_bg2_png";
				bg.scale9Grid = new egret.Rectangle(17, 11, 133, 12);
				bg.width = this._label.width;
				bg.height = this._label.height + 8;
				bg.anchorOffsetX = bg.width / 2;
				this.addChild(bg);
				break;
			case PROMPT_TYPE.CUSTOM:
				//this._label.textColor = 0xFF0000;
				var bg: eui.Image = new eui.Image();
				bg.y = -this._label.height / 2 - 4;
				bg.source = "tips_alert_txt_bg2_png";
				bg.scale9Grid = new egret.Rectangle(17, 11, 133, 12);
				bg.width = this._label.width;
				bg.height = this._label.height + 8;
				bg.anchorOffsetX = bg.width / 2;
				this.addChild(bg);
				break;
		}
	}

	// private setAnim(): void {
	// switch (this._type) {
	// 	case PROMPT_TYPE.ERROR:
	// 		var tw = egret.Tween.get(this);
	// 		tw.to({ y: 400 }, 1200);
	// 		tw.to({ y: 350 }, 500);
	// 		tw.call(this.onRemove, this);
	// 		break;
	// 	case PROMPT_TYPE.FUN:
	// 		var tw = egret.Tween.get(this);
	// 		tw.to({ scaleX: 1.3, scaleY: 1.3 }, 200);
	// 		tw.call(this.onNext, this);
	// 		tw.to({ scaleX: 1, scaleY: 1 }, 200);
	// 		// tw.to({ alpha: 0.2},500);
	// 		tw.call(this.onRemove, this);
	// 		break;
	// 	case PROMPT_TYPE.GAIN:
	// 		var tw = egret.Tween.get(this);
	// 		//tw.to({ scaleX: 1.3,scaleY: 1.3 },200);
	// 		//tw.call(this.onNext,this);
	// 		//tw.to({ scaleX: 1,scaleY: 1 },200);
	// 		tw.to({ y: 400 }, 1000);//,alpha: 0.5
	// 		tw.call(this.onRemove, this);
	// 		break;
	// 	case PROMPT_TYPE.CUSTOM:
	// 		var tw = egret.Tween.get(this);
	// 		tw.to({ scaleX: 1.3, scaleY: 1.3 }, 200);
	// 		tw.call(this.onNext, this);
	// 		tw.to({ scaleX: 1, scaleY: 1 }, 200);
	// 		// tw.to({ alpha: 0.2 }, 500);
	// 		tw.call(this.onRemove, this);
	// 		break;
	// }
	// }
	public get height(): number {
		return this._label ? this._label.textHeight + 10 : 30;
	}
	private timerComFunc() {
		this.boo = false;
		this.timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.timerComFunc, this);
		this.timer = null;
	}

	public get proboodate() {
		return this.boo;
	}
	public onRemove(): void {
		this.removeChildren();
		this._label = null;
		if (this.parent)
			this.parent.removeChild(this);
	}

	// private onNext(): void {
	// 	this._isNext = true;
	// }

	// public isNext(): boolean {
	// 	return this._isNext;
	// }

	public setText(text: string): void {
		this._label.text = text;
	}

	public getText(): string {
		return this._label.text;
	}

	public setTextFlow(text: Array<egret.ITextElement>): void {
		this._label.textFlow = text;
	}

	public get type(): PROMPT_TYPE {
		return this._type;
	}
}