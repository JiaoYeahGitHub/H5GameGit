class UnionLimitLevelPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private limit_input: eui.TextInput;
	private btn_sure: eui.Button;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionLimitSkin;
	}
	protected onInit(): void {
		// this.setTitle("applylevel_title_png");
		// this.basic["basic_tip_bg"].source = "union_setting_bg_png";
		this.setTitle("权限设置");
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.limit_input.text = DataManager.getInstance().unionManager.unionInfo.info.applyLevel + "";
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
	}
	protected onRemove(): void {
		super.onRemove();

		this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
	}
	public onHide(): void {
		super.onHide();

		var limitLevel: number = parseInt(this.limit_input.text);
		if (Tool.isNumber(limitLevel) && limitLevel != DataManager.getInstance().unionManager.unionInfo.info.applyLevel) {
			var unionLimitLvMsg: Message = new Message(MESSAGE_ID.UNION_CHANGE_LVLIMIT_MESSAGE);
			unionLimitLvMsg.setShort(limitLevel);
			GameCommon.getInstance().sendMsgToServer(unionLimitLvMsg);
		}
	}
	//The end
}