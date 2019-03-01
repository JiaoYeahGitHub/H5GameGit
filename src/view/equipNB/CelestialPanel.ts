class CelestialPanel extends BaseTabView {
	private roleIndex: number = 0;
	private index: number = GameDefine.Equip_Slot_Num * 2;
	private currItem: EquipInstance;
	// private currLayer: eui.Group;
	private powerbar: PowerBar;
	private currency: ConsumeBar;
	private btn_compound: eui.Button;
	private btn_clothAll: eui.Button;
	private reslabel_grp: eui.Group;
	private label_get: eui.Label;
	private curr: Modeltianshenzhuangbei;
	private next: Modeltianshenzhuangbei;
	private aniLayer: eui.Group;
	private ani: Animation;
	private selectAnim: Animation;
	private curPro: eui.Label;
	private nextPro: eui.Label;
	protected points: redPoint[] = RedPointManager.createPoint(7);

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.CelestialPanelSkin;
	}

	protected onInit(): void {
		GameCommon.getInstance().addUnderlineStr(this.label_get, "分解获得");
		this.label_get.touchEnabled = true;
		this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		if (!this.ani) {
			this.ani = new Animation("shenqi1", -1, false);
			this.ani.x = this.aniLayer.width / 2;
			this.ani.y = this.aniLayer.height / 2 + this.aniLayer.height / 4;
			this.aniLayer.addChild(this.ani);
		} else {
			this.ani.onPlay();
		}

		for (var i: number = 0; i < GameDefine.CELESTIAL_EQUIP_SLOTS.length; i++) {
			var instance = this[`item${GameDefine.CELESTIAL_EQUIP_SLOTS[i]}`] as EquipInstance;
			instance.pos = MASTER_EQUIP_TYPE.SIZE * 2 + i;
			this.points[i].register(this[`item${GameDefine.CELESTIAL_EQUIP_SLOTS[i]}`],
				GameDefine.RED_GOODSINSTANCE_POS,
				DataManager.getInstance().celestialManager,
				"checkJobCelestiaPointBySlot", GameDefine.CELESTIAL_EQUIP_SLOTS[i]);

		}
		this.points[GameDefine.CELESTIAL_EQUIP_SLOTS.length].register(this.btn_compound,
			GameDefine.RED_BTN_POS, DataManager.getInstance().celestialManager, "checkJobCelestiaPointBySlot", this.index);

		this.points[GameDefine.CELESTIAL_EQUIP_SLOTS.length + 1].register(this.reslabel_grp, new egret.Point(85, -8),
			DataManager.getInstance().celestialManager, "checkGoldDecomposePoint");

		this.points[GameDefine.CELESTIAL_EQUIP_SLOTS.length + 2].register(this.btn_clothAll,
			GameDefine.RED_BTN_POS, DataManager.getInstance().celestialManager, "checkCanClothGoldEquips");
		super.onInit();
		this.currency.nameColor = 0xf3f3f3;
		this.onRefresh();
	}

	protected onRegist(): void {
		super.onRegist();
		this.btn_compound.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnCompound, this);
		this.btn_clothAll.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClothHanlder, this);
		GameDispatcher.getInstance().addEventListener(MESSAGE_ID.GAME_CLOTHEQUIP_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.CELESTIAL_COMPOUND_MESSAGE.toString(), this.onRefresh, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.CELESTIAL_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GOODS_LIST_ADD_MESSAGE.toString(), this.onUpdateCurrency, this);
		var equip: EquipInstance;
		for (var i: number = 0; i < GameDefine.CELESTIAL_EQUIP_SLOTS.length; i++) {
			equip = (this[`item${GameDefine.CELESTIAL_EQUIP_SLOTS[i]}`] as EquipInstance);
			equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
		}
	}

	protected onRemove(): void {
		super.onRemove();
		this.btn_compound.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnCompound, this);
		this.btn_clothAll.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClothHanlder, this);
		GameDispatcher.getInstance().removeEventListener(MESSAGE_ID.GAME_CLOTHEQUIP_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.CELESTIAL_COMPOUND_MESSAGE.toString(), this.onRefresh, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.CELESTIAL_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GOODS_LIST_ADD_MESSAGE.toString(), this.onUpdateCurrency, this);
		var equip: EquipInstance;
		for (var i: number = 0; i < GameDefine.CELESTIAL_EQUIP_SLOTS.length; i++) {
			equip = (this[`item${GameDefine.CELESTIAL_EQUIP_SLOTS[i]}`] as EquipInstance);
			equip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
		}
		this.index = GameDefine.Equip_Slot_Num * 2;
	}

	protected onRefresh(): void {
		this.clothMsgUpdate();
		this.onShowInfo();
		this.trigger();
	}
	private onTouchBtnCompound(e: egret.Event): void {
		switch ((e.target as eui.Button).label) {
			case "合成":
				DataManager.getInstance().celestialManager.onSendCompoundMessage(this.roleIndex, this.index);
				break;
			case "升级":
				DataManager.getInstance().celestialManager.onSendUpgradeMessage(this.roleIndex, this.index);
				break;
			case "已满级":
				GameCommon.getInstance().addAlert("已满级");
				break;
		}
	}
	private onGetBtn(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("OrangeResPanel", GoodsQuality.Gold));
	}
	private onShowInfo(): void {
		var findLevel: number;
		var level: number = DataManager.getInstance().playerManager.player.rebirthLv;
		var modelcurr: ModelThing;
		var models = JsonModelManager.instance.getModeltianshenzhuangbei();
		var dataCurr: EquipThing = this.getPlayerData().getEquipBySlot(this.index);
		if (dataCurr.model && dataCurr.quality == GoodsQuality.Gold) {
			// this.model = equipThing.model;
			this.curr = models[dataCurr.model.coatardLv][0];
			if (this.curr.coatardLv < this.curr.next) {
				this.next = models[this.curr.next][0];
			} else {
				this.next = null;
			}
		} else {
			this.next = models[GameDefine.MIN_GOLD_COATARD_LV][0];
			let firstEquipId: number = GameCommon.parseIntArray(this.next.eqid)[this.index - GameDefine.Equip_Slot_Num * 2];
			dataCurr = new EquipThing(GOODS_TYPE.MASTER_EQUIP);
			dataCurr.onupdate(firstEquipId, GoodsQuality.Gold);
			this.curr = this.next;
		}
		var str: string = '';
		var nextPro: string = '';
		var item: AttributeItem;
		// this.currLayer.removeChildren();
		// this.label_power.text = `评分：${this.model.pingfenValue}`;
		for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
			let attrValue: number = dataCurr.attributes[i];
			if (attrValue > 0) {
				let addValue: number = dataCurr.addAttributes[i];
				item = new AttributeItem();
				item.data = [i, attrValue, "+" + addValue];
				str = str + GameDefine.Attr_FontName[i] + "+" + attrValue + "\n";
				nextPro = nextPro + GameDefine.Attr_FontName[i] + "+" + (attrValue + addValue) + "\n";
			}
		}
		this.curPro.text = str;
		this.nextPro.text = nextPro;
		this.powerbar.power = GameCommon.calculationFighting(dataCurr.attributes);
		this.onUpdateCurrency();
		this.playSelectAnim();
	}

	public playSelectAnim() {
		if (!this.selectAnim) {
			this.selectAnim = new Animation('xuanzhongkuang_3', -1);
			this.selectAnim.scaleX = 0.9;
			this.selectAnim.scaleY = 0.9;
			this.selectAnim.x = 50;
			this.selectAnim.y = 50;
		}
		if (this.selectAnim.parent) {
			this.selectAnim.parent.removeChild(this.selectAnim);
		}
		this.currItem.addChildAt(this.selectAnim, 0);

		this.ani.onUpdateRes("shenqi" + (this.index + 1 - GameDefine.Equip_Slot_Num * 2), -1);
	}

	private onUpdateCurrency(): void {
		var cost: number;
		if (this.next) {
			this.currency.visible = true;
			this.btn_compound.enabled = true;
			if (this.curr.coatardLv == this.next.coatardLv) {
				this.btn_compound.label = "合成";
				cost = this.next.costNum;
			} else {
				this.btn_compound.label = "升级";
				cost = this.next.costNum - this.curr.costNum;
			}
			this.currency.setConsume(GOODS_TYPE.ITEM, GameDefine.CELESTIAL_EQUIP_ADVANCE_CONS_ID, cost);
		} else {
			this.currency.visible = false;
			this.btn_compound.enabled = false;
			this.btn_compound.label = "已满级";
		}
	}
	private onTouchItem(e: egret.Event): void {
		var equip = <EquipInstance>e.currentTarget;
		if (equip.getEquipThing().position != this.index) {
			this.index = equip.pos;
			this.onRefresh();
			this.trigger();

		}
	}

	public trigger(): void {
		for (var i: number = 0; i < GameDefine.CELESTIAL_EQUIP_SLOTS.length; i++) {
			this.points[i].checkPoint(true, GameDefine.CELESTIAL_EQUIP_SLOTS[i]);
		}
		this.points[GameDefine.CELESTIAL_EQUIP_SLOTS.length].checkPoint(true, this.index);
		this.points[GameDefine.CELESTIAL_EQUIP_SLOTS.length + 1].checkPoint();
		this.points[GameDefine.CELESTIAL_EQUIP_SLOTS.length + 2].checkPoint();
	}
	private clothMsgUpdate(event?: egret.Event): void {
		var equip: EquipInstance;
		var equipThing: EquipThing;
		for (var i: number = 0; i < GameDefine.CELESTIAL_EQUIP_SLOTS.length; i++) {
			equipThing = this.getPlayerData().getEquipBySlot(GameDefine.CELESTIAL_EQUIP_SLOTS[i]);
			equip = (this[`item${GameDefine.CELESTIAL_EQUIP_SLOTS[i]}`] as EquipInstance);
			equip.shieldTip = true;
			if (!equipThing.model || equipThing.quality != GoodsQuality.Gold) {
				equipThing = new EquipThing();
				equipThing.position = GameDefine.CELESTIAL_EQUIP_SLOTS[i];
			}
			equip.onUpdate(equipThing, 0);
			if (this.index == GameDefine.CELESTIAL_EQUIP_SLOTS[i]) {
				// equip.selected = true;
				this.currItem = equip;
			} else {
				// equip.selected = false;
			}
		}
	}

	private getPlayerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData(this.roleIndex);
	}

	private onClothHanlder(): void {
		DataManager.getInstance().bagManager.onClothEquipAll(2);
	}
}