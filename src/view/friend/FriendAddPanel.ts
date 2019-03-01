class FriendAddPanel extends BaseWindowPanel {
	private btn_add: eui.Button;
	private btn_cancel: eui.Button;
	private input: eui.TextInput;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.FriendAddPanelSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.input.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchInput, this);
		this.btn_add.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdd, this);
		this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCancel, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.input.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchInput, this);
		this.btn_add.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdd, this);
		this.btn_cancel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCancel, this);
	}
	protected onRefresh(): void {
		super.onRefresh();
	}
	private onBtnAdd(): void {
		if (this.input.text != "") {
			DataManager.getInstance().friendManager.onSendSeachAddFriend(this.input.text);
			this.input.text = "";
		}
		this.onHide();
	}
	private onBtnCancel(): void {
		this.onHide();
	}
	private onTouchInput(): void {
		if (this.input.text == "") {
			this.input.text = DataManager.getInstance().playerManager.player.name.split(".")[0] + ".";
		}
	}
}