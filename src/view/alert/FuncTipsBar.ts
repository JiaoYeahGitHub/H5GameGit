class FuncTipsBar extends egret.DisplayObjectContainer {
	private tipsBg: eui.Image;
	private tipsDescLabel: eui.Label;
	public param: FuncTipsObj;

	public constructor() {
		super();
		this.tipsBg = new eui.Image();
		this.tipsBg.source = "prompt_bg3_png";
		this.tipsBg.scaleX = -1;
		this.tipsBg.scale9Grid = new egret.Rectangle(64, 18, 55, 53);
		this.tipsBg.width = 235;
		this.tipsBg.height = 90;
		this.tipsBg.x = 235;
		this.tipsBg.y = 0;
		this.addChild(this.tipsBg);
		this.tipsDescLabel = new eui.Label();
		this.tipsDescLabel.x = 10;
		this.tipsDescLabel.y = 10;
		this.tipsDescLabel.width = 220;
		this.tipsDescLabel.height = 78;
		this.tipsDescLabel.lineSpacing = 6;
		this.tipsDescLabel.textAlign = egret.HorizontalAlign.LEFT;
		this.tipsDescLabel.horizontalCenter = egret.VerticalAlign.MIDDLE;
		this.tipsDescLabel.size = 22;
		this.tipsDescLabel.fontFamily = "SimHei";
		this.tipsDescLabel.textColor = 0xe9deb3;
		this.addChild(this.tipsDescLabel);
	}
	public onShow(param: FuncTipsObj): void {
		this.param = param;
		if (!param.parentTarget) return;
		this.refreshPosition();

		if (!this.parent) {
			param.parentTarget.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
			this.tipsDescLabel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		}
		this.showOrHideDesc(param.desc != "");
		if (param.desc) {
			this.tipsDescLabel.text = param.desc;
		}
		this.closeTimeCount = param.autoClose;
		if (this.closeTimeCount > 0) {
			Tool.addTimer(this.onCloseTimeDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCloseTimeDown, this, 1000);
		}
	}
	private refreshPosition(): void {
		if (!this.param || !this.parent) return;
		try {
			let point: egret.Point = this.param.parentTarget.localToGlobal();
			if (!this.param.parentTarget.parent || (point.x == 0 && point.y == 0)) {
				Tool.callbackTime(this.refreshPosition, this, 1000);
				return;
			}

			this.x = point.x + this.param.offX;
			this.y = point.y + this.param.offY;
		} catch (e) {
			this.onHide();
		}
	}
	//自动关闭倒计时
	private closeTimeCount: number = 0;
	private onCloseTimeDown(): void {
		if (this.closeTimeCount <= 0) {
			this.onHide();
			return;
		}
		this.closeTimeCount--;
	}
	public onHide(): void {
		if (this.parent) {
			this.parent.removeChild(this);
		}
		if (this.param) {
			this.tipsDescLabel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
			this.param.parentTarget.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
			this.closeTimeCount = 0;
			Tool.removeTimer(this.onCloseTimeDown, this, 1000);
			this.param = null;
		}
	}
	private onTouch(): void {
		if (this.param) {
			this.param.parentTarget.dispatchEvent(new egret.TouchEvent(egret.TouchEvent.TOUCH_TAP));
		}
	}
	private showOrHideDesc(bool: boolean): void {
		this.tipsBg.visible = bool;
		this.tipsDescLabel.visible = bool;
	}
	//The end
}
class FuncTipsObj {
	public type: FUNCTIP_TYPE;
	public parentTarget: egret.DisplayObject;
	public desc: string = "";
	public offX: number;
	public offY: number;
	public autoClose: number = 0;
	constructor(type, desc) {
		this.type = type;
		this.desc = desc;
	}
}
enum FUNCTIP_TYPE {
	BOSS_REMIND = 1,
	BAGFULL = 2,
}
