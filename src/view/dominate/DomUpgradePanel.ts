class DomUpgradePanel extends BaseTabView {
	public static index: number = 0;

	private currLayer: eui.Group;
	private nextLayer: eui.Group;
	private btn_upgrade: eui.Button;
	private label_get: eui.Label;
	private power: PowerBar;
	private animPos: egret.Point = new egret.Point(344, 440);
	private animLayer: eui.Group;
	private starAnimLayer: eui.Group;
	private currNum: number;
	// protected points: redPoint[] = RedPointManager.createPoint(8);
	// private Achive_Items: number[] = [2, 3, 4, 5];
	private select_item_frame: eui.Image;
	private select_item_icon: eui.Image;
	private advance_btn: eui.Button;
	private decompose_btn: eui.Button;
	private current_cost_id: number;
	private nextPro:eui.Label;
	private curPro:eui.Label;
	protected points: redPoint[] = RedPointManager.createPoint(6);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.DomUpgradePanelSkin;
	}
	protected onInit(): void {
		this.label_get.text = Language.instance.getText("huoqutujing");
		GameCommon.getInstance().addUnderlineGet(this.label_get);
		this.label_get.touchEnabled = true;
		for (var i: number = 0; i < GameDefine.Dominate_Slot_Num; i++) {
			this.points[i].register(this[`item${i}`], new egret.Point(66, -5), DataManager.getInstance().dominateManager, "checkJobDomUpgradePointBySlot", i);
		}
		this.points[i].register(this.advance_btn, new egret.Point(70, 0), DataManager.getInstance().dominateManager, "checkDomAdvancePoint");
		this.points[i + 1].register(this.decompose_btn, new egret.Point(70, 0), DataManager.getInstance().dominateManager, "checkDecomposPoint");

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.DOMINATE_UPGRADE_MESSAGE.toString(), this.onUpgradeBack, this);
		var item: DominateInstance;
		for (var i: number = 0; i < 4; i++) {
			item = this[`item${i}`];
			item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquipClick, this);
		}
		this.advance_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAdvance, this);
		this.decompose_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchDecompose, this)
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		this.label_get.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.DOMINATE_UPGRADE_MESSAGE.toString(), this.onUpgradeBack, this);
		var item: DominateInstance;
		for (var i: number = 0; i < 4; i++) {
			item = this[`item${i}`];
			item.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquipClick, this);
		}
		this.advance_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAdvance, this);
		this.decompose_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchDecompose, this)
	}
	protected onRefresh(): void {
		this.onSelectItem();
		this.onUpdatePower();
	}
	//更新人物战斗力
	private onUpdatePower(): void {
		this.power.power = DataManager.getInstance().dominateManager.getOneJobDomPower(0, DomUpgradePanel.index);
	}
	private onUpgradeBack(): void {
		if (DataManager.getInstance().dominateManager.succeed) {
			let thing = this.getPlayerData().getDominateThingBySlot(DomUpgradePanel.index);
			let num = (thing.lv - 1) % 6 - 1;
			if (num >= 0) {
				this.onShowStarAnim(num);
			}
			this.animPos.x = 320;
			this.animPos.y = 205;
			GameCommon.getInstance().addAnimation("lianhua_1", this.animPos, this.animLayer);
		} else {
			this.animPos.x = GameDefine.GAME_STAGE_WIDTH / 2;
			this.animPos.y = 350;
			GameCommon.getInstance().addAnimation("shibai", this.animPos, this.animLayer);
		}
		this.onRefresh();
	}
	private onShowStarAnim(index): void {
		this.starAnimLayer.removeChildren();
		let starimg: eui.Image = new eui.Image();
		starimg.source = this['img_star0'].source;
		starimg.anchorOffsetX = 29;
		starimg.anchorOffsetY = 29;
		starimg.scaleX = 1.2;
		starimg.scaleY = 1.2;
		starimg.x = this.starAnimLayer.width / 5 * index + 29;
		starimg.y = 29;
		starimg.alpha = 0;
		this.starAnimLayer.addChild(starimg);
		egret.Tween.get(starimg).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 500, egret.Ease.circOut).call(function () {
			this.starAnimLayer.removeChildren();
		}, this);
	}
	public onBtnAdvanceClick(param?): void {
		DomUpgradePanel.index = param;
		this.onSelectItem();
	}
	private onGetBtn(event: TouchEvent): void {
		GameCommon.getInstance().onShowFastBuy(this.current_cost_id);
	}
	private onTouchBtn(): void {
		var thing = this.getPlayerData().getDominateThingBySlot(DomUpgradePanel.index);
		var nextModel: Modelshanggutaozhuang = JsonModelManager.instance.getModelshanggutaozhuang()[thing.slot][thing.lv];
		if (nextModel && GameCommon.getInstance().onCheckItemConsume(nextModel.cost.id, nextModel.cost.num)) {
			DataManager.getInstance().dominateManager.onSendUpgradeMessage(0, DomUpgradePanel.index);
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
				if (item.isNeedActivate) {
					this.select_item_frame.source = "bag_whiteframe_png";
					this.select_item_icon.source = `a_${item.data.model.icon}`;
				} else {
					this.select_item_frame.source = GameCommon.getInstance().getIconFrame(item.data.quality);
					this.select_item_icon.source = item.data.model.icon;
				}
			} else {
				item.selected = false;
			}
		}
		this.onShowInfo();
	}
	private onShowInfo(): void {
		var thing = this.getPlayerData().getDominateThingBySlot(DomUpgradePanel.index);
		var player = DataManager.getInstance().playerManager.player;
		var models = JsonModelManager.instance.getModelshanggutaozhuang();
		var currModel: Modelshanggutaozhuang = models[thing.slot][thing.lv - 1];
		var nextModel: Modelshanggutaozhuang = models[thing.slot][thing.lv];
		var model: Modelshanggutaozhuang = currModel || nextModel;
		// var item: AttributesText;
		// this.currLayer.removeChildren();
		// this.nextLayer.removeChildren();
		var add: number = 0;
		var str: string = '';
		var nextPro :string = '';
		for (var key in model.base_effect) {
			if (model.base_effect[key] > 0) {
				// item = new AttributesText();
				add = currModel ? currModel.base_effect[key] : 0;
				str = str + GameDefine.Attr_FontName[key] + "+"+ add+ "\n";
				add = nextModel ? nextModel.base_effect[key] : 0;
				nextPro = nextPro+GameDefine.Attr_FontName[key]+ "+"+add+ "\n";

			}
		}
		this.curPro.text = str;
		this.nextPro.text = nextPro;

		if (thing.lv == 0) {
			this.btn_upgrade.label = Language.instance.getText('activate');
		} else {
			this.btn_upgrade.label = Language.instance.getText('sixiangshengji');
		}
		if (nextModel) {
			//var cons: ConsumeBar2 = this[`cons${0}`];
			//var modelfunc = JsonModelManager.instance.getModelfunctionLv()[GameDefine.Dominate_Slot_func[DomUpgradePanel.index]];
			//cons.arr = ["等级需求", `${modelfunc.level}级`];
			var cons: ConsumeBar2 = this[`cons${0}`];
			cons.thing = new ThingBase(nextModel.cost.type, nextModel.cost.id, nextModel.cost.num);
			cons = this[`cons${1}`];
			cons.arr = ["成功几率", `${nextModel.gailv / 100}%`];
			if (nextModel.cost.num == 0) {
				// this.btn_upgrade.icon = "dom_button_sj_png";
				this.btn_upgrade.label = Language.instance.getText('sixiangshengji');
			}

			this.current_cost_id = nextModel.cost.id;
		}
		this.currNum = (thing.lv - 1) % 6;
		for (var i: number = 0; i < 5; i++) {
			if ((i + 1) <= this.currNum) {
				this[`img_star${i}`].visible = true;
			} else {
				this[`img_star${i}`].visible = false;
			}
		}
	}
	private getPlayerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData(0);
	}
	//切换角色
	public onChangeRole(): void {
		this.onRefresh();
		this.trigger();
	}

	private onTouchAdvance(event: TouchEvent): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "DomAdvancePanel");
	}

	private onTouchDecompose(event: TouchEvent): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "DomDecomposePanel");
	}
}