class EscortRevengePanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private _data: EscortRecordbase;
	private head_icon: PlayerHeadUI;
	private label_name: eui.Label;
	private label_power: eui.Label;
	private label_time: eui.Label;
	private awardLayer: eui.Group;
	private btn_revenge: eui.Button;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.EscortRevengePanelSkin;
	}
	protected onInit(): void {
		this.setTitle("escort_revenge_title_png");
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_revenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRevenge, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_revenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRevenge, this);
	}
	protected onRefresh(): void {
		this.head_icon.setHead(this._data.headId, this._data.headFrameId);
		this.label_name.text = this._data.name;
		this.label_power.text = `战斗力：${this._data.power}`;
		var date: Date = new Date(this._data.time);
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hours = date.getHours();
		var minute = date.getMinutes();
		this.label_time.text = "抢夺时间：" + month + "/" + day + "日 " + hours + ":" + minute + "分";
		this.awardLayer.removeChildren();
		var goods: GoodsInstance;
		var model: Modeldujie = JsonModelManager.instance.getModeldujie()[this._data.quality];
		if (model) {
			let rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model.jiangli);
			for (var i = 0; i < rewards.length; i++) {
				let awarditem: AwardItem = rewards[i];
				awarditem.num = awarditem.num * 0.2;
				goods = GameCommon.getInstance().createGoodsIntance(awarditem);
				this.awardLayer.addChild(goods);
			}
		}
	}
	private onTouchRevenge(): void {
		DataManager.getInstance().escortManager.onSendRevengeSomeBody(this._data.revengeID, this._data.time);
	}
	public onShowWithParam(param): void {
		this._data = param;
		this.onShow();
	}
}