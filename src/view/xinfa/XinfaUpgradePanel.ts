class XinfaUpgradePanel extends BaseWindowPanel {
	private name_label: eui.Label;
	private icon_img: eui.Image;
	private frame_img: eui.Image;
	private nameframe_img: eui.Image;
	private level_label: eui.Label;
	private upgrade_btn: eui.Button;
	private cur_attr_lab: eui.Label;
	private next_attr_lab: eui.Label;
	private consumItem: ConsumeBar;

	private model: Modeltujian2;

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.XinfaUpgradePanelSkin;
	}
	public onShowWithParam(model: Modeltujian2): void {
		this.model = model;
		if (this.model) {
			super.onShowWithParam(model);
		}
	}
	protected onInit(): void {
		super.onInit();
		this.setTitle("法 器");
		this.onRefresh();
	}
	protected onRefresh(): void {
		let xinfaData: PlayerXinfaData = DataManager.getInstance().playerManager.getXinfaDataByID(this.model.id);
		//更新心法图鉴
		this.name_label.text = this.model.name;
		this.icon_img.source = this.model.waixing1;
		this.frame_img.source = `xinfa_border_${this.model.pinzhi}_png`;
		this.nameframe_img.source = `xinfa_namebg_${this.model.pinzhi}_png`;
		this.level_label.text = xinfaData.level + Language.instance.getText('level');
		//更新心法属性
		let currLv: number = xinfaData.level;
		let currAttrDesc: string = '';
		let nextAttrDesc: string = '';
		for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
			let attrValue: number = this.model.attrAry[i];
			if (attrValue > 0) {
				currAttrDesc += Language.instance.getAttrName(i) + '+' + attrValue * currLv;
				nextAttrDesc += Language.instance.getAttrName(i) + '+' + attrValue * (currLv + 1);
			}
			if (i < ATTR_TYPE.SIZE - 1) {
				currAttrDesc += '\n';
				nextAttrDesc += '\n';
			}
		}
		this.cur_attr_lab.text = currAttrDesc;
		this.next_attr_lab.text = nextAttrDesc;
		//更新消耗
		let costNum: number = DataManager.getInstance().playerManager.getoneXinfaUpCostByID(this.model.id);
		this.consumItem.setCostByAwardItem(this.model.cost);
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.XINFA_TUJIAN_MESSAGE.toString(), this.onRefresh, this);
		this.upgrade_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendUpgradeMsg, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XINFA_TUJIAN_MESSAGE.toString(), this.onRefresh, this);
		this.upgrade_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendUpgradeMsg, this);
	}
	//发送升级心法的请求
	private onSendUpgradeMsg(): void {
		let costNum: number = DataManager.getInstance().playerManager.getoneXinfaUpCostByID(this.model.id);
		if (GameCommon.getInstance().onCheckItemConsume(this.model.cost.id, costNum)) {
			let upgradeMsg: Message = new Message(MESSAGE_ID.XINFA_TUJIAN_MESSAGE);
			upgradeMsg.setByte(0);
			upgradeMsg.setShort(this.model.id);
			GameCommon.getInstance().sendMsgToServer(upgradeMsg);
		}
	}
	//The end
}