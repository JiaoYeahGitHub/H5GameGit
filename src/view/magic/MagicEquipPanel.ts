class MagicEquipPanel extends eui.Component {
	private blessType: number = 0;
	private curPro: eui.Group;
	private nextPro: eui.Group;
	// private closeBtn1: eui.Button;
	private label_points: eui.Label;
	private exp_probar: eui.ProgressBar;
	private consumItem: ConsumeBar;
	private selectedAnim: Animation;
	private selectedAnim2: Animation;
	private btn_equip: eui.Button;
	// private powerbar: PowerBar;
	protected points: redPoint[] = RedPointManager.createPoint(8);
	// public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public isLoaded = false;
	public constructor(blessType: BLESS_TYPE) {
		super();
		this.blessType = blessType;
		this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.once(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
	}
	protected onAddStage(): void {
		this.skinName = skins.MagicEquipSkin;
	}
	private onLoadComplete(): void {
		this.isLoaded = true;
		if (!DataManager.IS_PC_Game) {
			this.width = size.width;
		}
		if (this.isLoaded) {
			this.onInit();
			this.onRegist();
			this.onRefresh();
		}
	}
	protected onInit(): void {

	}
	protected onRegist(): void {
		for (var i = 0; i < BlessDefine.BLESS_SLOT_MAXNUM; i++) {
			this.points[i].register(this[`equip_bar_${i}`], new egret.Point(75, -5), DataManager.getInstance().playerManager, "checkMountEquipRedPoint", this.blessType,i);
		}
		this.btn_equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClothAllEquip, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BLESS_EQUIP_MESSAGE.toString(), this.onReciveEquipsMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BLESS_EQUIP_SLOT_MESSAGE.toString(), this.onReciveSlotMsg, this);
	}

	protected onRemove(): void {
		this.btn_equip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClothAllEquip, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BLESS_EQUIP_MESSAGE.toString(), this.onReciveEquipsMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BLESS_EQUIP_SLOT_MESSAGE.toString(), this.onReciveSlotMsg, this);
	}
	private trigger() {
		for (var i: number = 0; i < this.points.length; i++) {
			this.points[i].checkPointAll();
		}
	}
	private get manager(): PlayerManager {
		return DataManager.getInstance().playerManager;
	}
	private getPlayerData(): PlayerData {
		return this.manager.player.getPlayerData();
	}
	private indexId: number = 0;
	public onRefresh(): void {
		if (this.isLoaded) {
			this.onEquipInfo();
			// this.onUpdatePower();
		}
	}
	private onEquipInfo(): void {
		this.onRefreshEquipSlots();
		this.onRefreshEquips();
	}
	//刷新装备位信息
	private onRefreshEquips(): void {
		//装备信息
		for (let i: number = 0; i < BlessDefine.BLESS_SLOT_MAXNUM; i++) {
			let equipslot: BagInstance = this[`equip_bar_${i}`];
			let equipthing: ServantEquipThing = this.getPlayerData().getBlessEquip(this.blessType, i);
			if (equipthing) {
				equipslot.onThing(equipthing);
			} else {
				equipslot.onReset();
				equipslot.name_label.text = Language.instance.getText(`bless${this.blessType + 1}_slot${i}_name`);
				equipslot.item_icon.source = 'magic_slot' + i + '_png';
			}
		}
	}

	//返回更新装备消息
	private onReciveEquipsMsg(): void {
		this.onRefreshEquips();
		// this.onUpdatePower();
		this.trigger();
	}
	//返回槽位强化成功消息
	private onReciveSlotMsg(event: GameMessageEvent): void {
		var result: boolean = event.message;
		this.onRefreshEquipSlots();
		// this.onUpdatePower();
	}
	//更新战斗力属性
	// private onUpdatePower(): void {
	// 	this.powerbar.power = DataManager.getInstance().playerManager.player.getPlayerData(0).getBlessFightingByType(this.blessType);
	// }
	//一键装备
	private _clothbtnStamp: number = 0;
	private onClothAllEquip(): void {
		if (this._clothbtnStamp > egret.getTimer()) {
			return;
		}
		this._clothbtnStamp = egret.getTimer() + 2000;
		var message = new Message(MESSAGE_ID.BLESS_EQUIP_MESSAGE);
		message.setByte(0);
		message.setByte(this.blessType);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private _showEquipview: boolean;
	//刷新槽位信息
	private _slotEffect: Animation;
	private qhCost: AwardItem;
	private onRefreshEquipSlots(): void {
		//祝福值装备属性
		let attrs: number[] = GameCommon.getInstance().getAttributeAry();
		let equipAry: ServantEquipThing[] = this.getPlayerData().blessEquipDict[this.blessType];
		for (let i = 0; i < equipAry.length; ++i) {
			let servantEquip: ServantEquipThing = equipAry[i];
			if (servantEquip) {
				let model: ModelmountEquipment = JsonModelManager.instance.getModelmountEquipment()[servantEquip.modelId];
				for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
					if (model.attrAry[j] > 0) {
						attrs[j] += model.attrAry[j];
					}
				}
			}
		}

		var idx = 0;
		var item: AttributesText;
		this.curPro.removeChildren();
		this.nextPro.removeChildren();
		for (var key in attrs) {
			if (attrs[key] > 0) {
				idx = idx + 1;
				if (idx % 2 != 0) {
					item = new AttributesText();
					item.updateAttr(key, attrs[key]);
					item.scaleX = 0.8;
					item.scaleY = 0.8;
					this.curPro.addChild(item);
				}
				else {
					item = new AttributesText();
					item.scaleX = 0.8;
					item.scaleY = 0.8;
					item.updateAttr(key, attrs[key]);
					this.nextPro.addChild(item);
				}
			}
		}
	}
	//切换装备槽位
	private currEquipSlot: number = 0;
	private onChangeEquipSlot(event: egret.Event): void {
		var newSlotIdx: number = parseInt(event.currentTarget.name);
		if (this.currEquipSlot != newSlotIdx && newSlotIdx < BlessDefine.BLESS_SLOT_MAXNUM) {
			this.currEquipSlot = newSlotIdx;
			this.onRefreshEquipSlots();
		}
	}
	//进行装备位强化
	private requestStrongSlotMsg(): void {
		if (this.qhCost && !GameCommon.getInstance().onCheckItemConsume(this.qhCost.id, this.qhCost.num, this.qhCost.type)) {
			return;
		}
		var strongMsg: Message = new Message(MESSAGE_ID.BLESS_EQUIP_SLOT_MESSAGE);
		strongMsg.setByte(0);//角色索引
		strongMsg.setByte(this.blessType);//祝福值类型
		strongMsg.setByte(this.currEquipSlot);//槽位索引
		GameCommon.getInstance().sendMsgToServer(strongMsg);
	}

	private getPlayer() {
		return DataManager.getInstance().playerManager.player;
	}
}