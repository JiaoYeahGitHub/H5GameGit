class OpenFunTipsBar extends BaseWindowPanel {
	private layergrp: eui.Group;
	private button_grp: eui.Group;
	private sure_btn: eui.Button;

	private autocloseTime: number = 0;
	private _unopenFuns: ModelfunctionLv[];
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onInit(): void {
		this.layergrp.x = -Globar_Pos.x;
		this.layergrp.width = size.width;
		this.layergrp.height = size.height;
		super.onInit();
		this.onRefresh();
	}
	protected onSkinName(): void {
		this.skinName = skins.OpenFunTipsBarSkin;
	}
	protected onRefresh(): void {
		this.button_grp.removeChildren();
		var _len: number = Math.max(this._unopenFuns.length - 3, 0)
		for (var i: number = this._unopenFuns.length - 1; i >= _len; i--) {
			var model: ModelfunctionLv = this._unopenFuns[i];
			var button: eui.Button = new eui.Button();
			button.skinName = skins.Fun_ButtonSkin;
			button.icon = model.icon;
			button.name = "" + model.id;
			// button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
			this.button_grp.addChild(button);
		}
	}
	protected onRegist(): void {
		super.onRegist();
		this.layergrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.sure_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.autocloseTime = 6;
		Tool.addTimer(this.onAutoTimeDown, this, 1000);
	}
	protected onRemove(): void {
		super.onRemove();
		this.layergrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.sure_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		Tool.removeTimer(this.onAutoTimeDown, this, 1000);
		// for (var i: number = 0; i < this._unopenFuns.length; i++) {
		// 	var button: eui.Button = new eui.Button();
		// 	button.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		// }
	}
	private onAutoTimeDown(): void {
		if (this.autocloseTime > 0) {
			this.autocloseTime--;
			this.sure_btn.label = Language.instance.getText('sure') + `(${this.autocloseTime})`;
		} else {
			this.onTouch();
		}
	}
	public onShowWithParam(param): void {
		this._unopenFuns = param;
		if (this._unopenFuns && this._unopenFuns.length > 0) {
			this.onShow();
		}
	}
	public onTouch() {
		for (var i: number = 0; i < this.button_grp.numChildren; i++) {
			var button = this.button_grp.getElementAt(i);
			let gotoType: number = parseInt(button.name);
			var funcbody: FuncBody = new FuncBody(gotoType);
			var point: egret.Point = button.localToGlobal();
			funcbody.x = point.x;
			funcbody.y = point.y;
			this.owner.addFuncToDropLayer(funcbody);
		}
		this.onHide();
	}
	//The end
}