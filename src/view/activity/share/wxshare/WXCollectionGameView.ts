class WXCollectionGameView extends BaseWindowPanel {
	private reward_btn: eui.Button;
	private closeBtn1: eui.Group;

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}

	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}

	protected onSkinName(): void {
		this.skinName = skins.WXCollectionPanelSkin;
	}

	protected onRefresh(): void {
		if (DataManager.getInstance().playerManager.player.wxcolletion) {
			this.reward_btn.enabled = false;
			this.reward_btn.label = "已领取";
		}
	}
	protected onRegist(): void {
		super.onRegist();
		this.reward_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReward, this);
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XYX_COLLECTION_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.reward_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReward, this);
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XYX_COLLECTION_MESSAGE.toString(), this.onRefresh, this);
	}
	private onTouchReward(): void {
		if (!DataManager.getInstance().wxgameManager.isColletionScene) {
			GameCommon.getInstance().addAlert("error_tips_10007");
			return;
		}
		let rewardMsg: Message = new Message(MESSAGE_ID.XYX_COLLECTION_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(rewardMsg);
	}
}