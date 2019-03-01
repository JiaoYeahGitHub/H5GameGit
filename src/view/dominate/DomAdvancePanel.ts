class DomAdvancePanel extends BaseWindowPanel {
	
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private label_get: eui.Label;
	// private role_list_bar: RoleSelectBar;
	private btn_upgrade: eui.Button;
	private animPos: egret.Point = new egret.Point(344, 440);
	private animLayer: eui.Group;
	private currLayer: eui.Group;
	private power: PowerBar;
	// protected points: redPoint[] = RedPointManager.createPoint(8);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.DomAdvancePanelSkin;
	}
	protected onInit(): void {
		this.label_get.text = Language.instance.getText("huoqutujing");
		GameCommon.getInstance().addUnderlineGet(this.label_get);
		this.label_get.touchEnabled = true;
		this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		// this.role_list_bar.registFuncBack(this.onChangeRole, this);
		// for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
		// 	this.points[i].register(this.role_list_bar.getHeadGroup(i), GameDefine.RED_JOB_POS, DataManager.getInstance().dominateManager, "checkJobDomAdvancePoint", i);
		// }
		// this.points[3].register(this.btn_upgrade, GameDefine.RED_BTN_POS, DataManager.getInstance().dominateManager, "checkJobDomAdvancePointBySlot");

		// for (var i: number = 0; i < GameDefine.Dominate_Slot_Num; i++) {
		// 	this.points[i + 4].register(this[`item${i}`], GameDefine.RED_GOODSINSTANCE_POS, DataManager.getInstance().dominateManager, "checkJobDomAdvancePointBySlot");
		// }
		this.setTitle("进阶");
		this.basic["basic_tip_bg"].source="dom_pop_bg_jpg";
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.DOMINATE_ADVANCE_MESSAGE.toString(), this.onUpgradeBack, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
		var item: DominateInstance;
		for (var i: number = 0; i < 4; i++) {
			item = this[`item${i}`];
			item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquipClick, this);
		}
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.DOMINATE_ADVANCE_MESSAGE.toString(), this.onUpgradeBack, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
		var item: DominateInstance;
		for (var i: number = 0; i < 4; i++) {
			item = this[`item${i}`];
			item.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquipClick, this);
		}
	}
	protected onRefresh(): void {
		this.onSelectItem();
		this.onUpdatePower();
	}
	//更新人物战斗力
	private onUpdatePower(): void {
		this.power.power = Tool.toInt(DataManager.getInstance().dominateManager.getOneJobDomPower(0, DomUpgradePanel.index) * GameDefine.Domiante_Advance_add);
	}
	private onUpgradeBack(): void {
		GameCommon.getInstance().addAnimation("进阶成功", this.animPos, this.animLayer);
		this.onRefresh();
	}
	public onBtnAdvanceClick(param?): void {
		DomUpgradePanel.index = param;
		this.onSelectItem();
	}
	private onGetBtn(event: TouchEvent): void {
		GameCommon.getInstance().onShowFastBuy(GameDefine.Domiante_Advance_needID);		
	}
	private onTouchBtn(): void {
		if (GameCommon.getInstance().onCheckItemConsume(GameDefine.Domiante_Advance_needID, GameDefine.Domiante_Advance_needNum)) {
			DataManager.getInstance().dominateManager.onSendAdvanceMessage(0, DomUpgradePanel.index);
		}
	}

	private onEquipClick(e: egret.TouchEvent) {
		var item: DominateInstance = e.currentTarget;
		if (item.isNeedActivate) {
			var model = JsonModelManager.instance.getModelfunctionLv()[GameDefine.Dominate_Slot_func[item.data.slot]];
			if (DataManager.getInstance().playerManager.player.level < model.level) {
				return;
			}
		}
		DomUpgradePanel.index = item.data.slot;
		this.onRefresh();
	}
	private onSelectItem(): void {
		var item: DominateInstance;
		for (var i: number = 0; i < 4; i++) {
			item = this[`item${i}`];
			item.data = this.getPlayerData().getDominateThingBySlot(i);
			if (i == DomUpgradePanel.index) {
				item.selected = true;
				if(item.isNeedActivate){
					this.btn_upgrade.enabled = false;
				}else{
					this.btn_upgrade.enabled = true;
				}
			} else {
				item.selected = false;
			}
		}
		this.onShowInfo();
	}
	private onShowInfo(): void {
		var thing = this.getPlayerData().getDominateThingBySlot(DomUpgradePanel.index);
		var color: number;
		if (thing.tier == 0) {
			this.currentState = "advance";
			color = 0xecd6a2;
		} else {
			this.currentState = "max";
			color = 0x28e828;
			this.btn_upgrade.enabled = false;
		}
		var player = DataManager.getInstance().playerManager.player;
		var models = JsonModelManager.instance.getModelshanggutaozhuang();
		var currModel: Modelshanggutaozhuang = models[thing.slot][thing.lv-1];
		var nextModel: Modelshanggutaozhuang = models[thing.slot][thing.lv];
		var model: Modelshanggutaozhuang = currModel || nextModel;
		var item: suitAttributeItem;
		this.currLayer.removeChildren();
		var add: number = 0;
		var label: eui.Label;
		for (var key in model.base_effect) {
			if (model.base_effect[key] > 0) {
				label = GameCommon.getInstance().createNormalLabel(GameDefine.Domiante_Advance_needNum, color);
				label.text = `${Language.instance.getAttrName(key)}提高${GameDefine.Domiante_Advance_add}倍`;
				this.currLayer.addChild(label);
			}
		}
		var cons: ConsumeBar2 = this[`cons${0}`];
		cons.thing = new ThingBase(GOODS_TYPE.ITEM, GameDefine.Domiante_Advance_needID, GameDefine.Domiante_Advance_needNum);
		cons = this[`cons${1}`];
		cons.arr = ["成功几率", `100%`];
	}
	private getPlayerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData(0);
	}
	//切换角色
	public onChangeRole(): void {
		this.onRefresh();
		this.trigger();
	}
	public trigger(): void {
		// for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
		// 	this.points[i].checkPoint();
		// }
		// this.points[3].checkPoint(true, this.role_list_bar.index, DomUpgradePanel.index);

		// for (var i: number = 0; i < GameDefine.Dominate_Slot_Num; i++) {
		// 	this.points[i + 4].checkPoint(true, this.role_list_bar.index, i);
		// }
	}
}