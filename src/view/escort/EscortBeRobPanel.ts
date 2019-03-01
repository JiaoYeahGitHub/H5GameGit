class EscortBeRobPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private data: EscortRobData;
	private btn_rob: eui.Button;
	private awardLayer: eui.Group;
	private label_remain: eui.Label;
	private label_owner: eui.Label;
	private label_power: eui.Label;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.EscortBeRobPanelSkin;
	}
	protected onInit(): void {
		this.setTitle("rob_title_png");
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_rob.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRob, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_rob.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRob, this);
	}
	protected onRefresh(): void {
		this.awardLayer.removeChildren();
		let goods: GoodsInstance;
		let model: Modeldujie = JsonModelManager.instance.getModeldujie()[this.data.quality];
		if (model) {
			let rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model.jiangli);
			for (let i = 0; i < rewards.length; i++) {
				let awarditem: AwardItem = rewards[i];
				awarditem.num = awarditem.num / 10;
				goods = GameCommon.getInstance().createGoodsIntance(awarditem);
				this.awardLayer.addChild(goods);
			}
		}
		this.label_remain.text = (EscortData.MAX_ROB_COUNT - DataManager.getInstance().escortManager.escort.rob) + "/" + EscortData.MAX_ROB_COUNT;
		this.label_owner.text = `仙女拥有者：${this.data.name}`;
		this.label_power.text = `${this.data.fightvalue}`;
	}
	public onShowWithParam(param): void {
		this.data = param as EscortRobData;
		this.onShow();
	}
	private onTouchRob(): void {
		if (!this.data) return;
		DataManager.getInstance().escortManager.onSendRobSomeBody(this.data.id);
	}
}