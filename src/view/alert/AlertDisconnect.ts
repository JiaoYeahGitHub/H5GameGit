/**
 * 
 */
class AlertDisconnect extends eui.Component {
	private labelAlert: eui.Label;
	private btnOk: eui.Button;
	private viewmask: egret.Shape;
	// private btn_reload: eui.Button;
	// private btn_return: eui.Button;
	// private reload_group: eui.Group;
	private isInit: boolean;
	private text: string;

	public constructor() {
		super();
		if (!DataManager.IS_PC_Game) {
			this.width = size.width;
			this.height = size.height;
		}
		this.touchEnabled = true;
		this.once(egret.Event.COMPLETE, this.onComplete, this);
		this.skinName = skins.AlertFrameSkin;
	}

	private onComplete(): void {
		if (this['basic']['label_title']) {
			this.onBasicComplete();
		} else {
			this['basic'].once(egret.Event.COMPLETE, this.onBasicComplete, this);
		}
		this.isInit = true;
		this.viewmask = new egret.Shape();
		this.viewmask.touchEnabled = true;
		this.addChildAt(this.viewmask, 0);
		if (this.text) {
			this.onShowAlert(this.text);
		}
	}
	private onBasicComplete(): void {
		this['basic']['label_title'].text = '异常提示';
		this['basic']['closeBtn2'].visible = false;
	}
	public onShowAlert(showTxt: string) {
		if (!this.isInit) {
			this.text = showTxt;
			return;
		}
		this.viewmask.graphics.clear();
		this.viewmask.graphics.beginFill(0, 0.6);
		this.viewmask.graphics.drawRect(-Globar_Pos.x, 0, size.width + Globar_Pos.x, size.height);
		this.viewmask.graphics.endFill();

		this.labelAlert.text = showTxt;
		this.btnOk.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this);
		// if (Language.ALERT_DISCONNECT_3 == showTxt) {
		// 	this.reload_group.visible = true;
		// 	this.btn.visible = false;
		// 	this.btn_reload.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRelogin, this);
		// 	this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this);
		// } else {
		// 	this.reload_group.visible = false;
		// 	this.btn.visible = true;
		// 	this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this);
		// }
	}
	private onBtnClick(event: egret.TouchEvent): void {
		location.reload();
	}
	//重新连接
	// private onRelogin(): void {
	// 	GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_RELOGIN_EVENT));
	// 	this.onClose();
	// }
	//关闭面板
	private onClose(): void {
		// this.btn_reload.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this);
		// this.btn_reload.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this);
		this.btnOk.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnClick, this);
		if (this.parent) {
			this.parent.removeChild(this);
		}
	}
	//The end
}