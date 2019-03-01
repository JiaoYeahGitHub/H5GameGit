class ClientFoursPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private download_btn: eui.Button;
	private closeBtn1: eui.Button;
	private closeBtn2: eui.Button;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		// this.skinName = skins.ClientFoursPanelSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRegist();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.closeBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.closeBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
	}
	//The end
}