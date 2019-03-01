class MarryEquipSuitLevelup extends BaseWindowPanel {
	private groupItem: eui.Group;
	private upgrade_btn: eui.Button;
	private cur_attr_lab: eui.Label;
	private next_attr_lab: eui.Label;
	private consumItem: ConsumeBar;

	private item: MarryEquipSuitItem;
	private model: Modeljiehuntaozhuang;

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.MarryEquipSuitLevelupSkin;
	}
	public onShowWithParam(item: MarryEquipSuitItem): void {
		this.item = item;
		this.model = item.model;
		if (this.model) {
			super.onShowWithParam(this.model);
		}
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.setTitle(this.model.name);
		//更新item
		let currLv = DataManager.getInstance().ringManager.getLevelEquipSuit(this.model.id);
		this.groupItem.removeChildren();
		let item = new MarryEquipSuitItem();
		item.init(this.item.idx, false);
		item.setSkinName();
		item.setData(this.model, currLv);
		this.groupItem.addChild(item);
		//更新属性
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
		let cost: AwardItem = this.model.cost;
		this.consumItem.setCostByAwardItem(cost);
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_EQUIP_LEVELUP_MESSAGE.toString(), this.onRefresh, this);
		this.upgrade_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendUpgradeMsg, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_EQUIP_LEVELUP_MESSAGE.toString(), this.onRefresh, this);
		this.upgrade_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendUpgradeMsg, this);
	}
	//发送升级心法的请求
	private onSendUpgradeMsg(): void {
		let cost: AwardItem = this.model.cost;
		if (GameCommon.getInstance().onCheckItemConsume(cost.id, cost.num, cost.type)) {
			let upgradeMsg: Message = new Message(MESSAGE_ID.MARRIAGE_EQUIP_LEVELUP_MESSAGE);
			upgradeMsg.setShort(this.model.id);
			GameCommon.getInstance().sendMsgToServer(upgradeMsg);
		}
	}
	//The end
}