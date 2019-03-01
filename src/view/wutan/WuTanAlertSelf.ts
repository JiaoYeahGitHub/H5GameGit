class WuTanAlertSelf extends BaseWindowPanel {
	public priority = PANEL_HIERARCHY_TYPE.II;
	public btnBack: eui.Button;
	public lbAlert: eui.Label;
	public lbTime: eui.Label;
	public my_head_img: PlayerHeadUI;
	public my_name_label: eui.Label;
	public my_fightvalue_label: eui.BitmapLabel;
	public good: GoodsInstance;
	public param: WuTanAlertParam;
	private timeStart: number;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.WuTanAlertSelfSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		let data: WuTanListbody = this.param.param as WuTanListbody;
		let model: Modelwutan = data.getModel();
		this.timeStart = data.timeStart;
		this.my_head_img.setHead();
		this.my_name_label.text = DataManager.getInstance().playerManager.player.name;
		this.my_fightvalue_label.text = DataManager.getInstance().playerManager.player.playerTotalPower.toString();
		let awarditem = data.getRewardBox();
		if (awarditem) {
			this.good.onUpdate(awarditem.type, awarditem.id, awarditem.uid, awarditem.quality, awarditem.num);
		} else {
			this.good.visible = this.lbAlert.visible = false;
		}
	}
	public onShowWithParam(param: WuTanAlertParam): void {
		this.param = param;
		this.onShow();
	}
	public onEventBack() {
		this.onHide();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBack, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.WUTAN_HEART_MESSAGE.toString(), this.onEventBack, this);
		this.examineCD();
	}
	protected onRemove(): void {
		super.onRemove();
		this.examineCD(false);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.WUTAN_HEART_MESSAGE.toString(), this.onEventBack, this);
		this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBack, this);
	}
	private examineCD(open: boolean = true) {
		if (open) {
			Tool.addTimer(this.updateTime, this, 1000);
		} else {
			Tool.removeTimer(this.updateTime, this, 1000);
		}
	}
	private updateTime() {
		let timeDis = Math.min(Tool.getCurrTime() - this.timeStart, 12 * 60 * 60000);
		this.lbTime.text = Tool.getTimeStr(timeDis / 1000);
	}
}