class PsychDecompose extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private btn_decompose: eui.Button;
	private btn_orange: eui.CheckBox;
	private btn_purple: eui.CheckBox;
	private orangeLayer: eui.Group;
	private purpleLayer: eui.Group;
	private itemLayer: eui.Group;
	// private img_icon: eui.Image;
	// private label_goodsName: eui.Label;
	// private label_has: eui.Label;
	// private label_add: eui.Label;
	private model: Modelyuanshen;
	private decomposeQueue: PsychBase[];
	private cons: eui.Label;
	private goods: ModelThing;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PsychDecomposeSkin;
	}
	protected onInit(): void {
		this.model = JsonModelManager.instance.getModelyuanshen()[1];
		var item = GameCommon.parseAwardItem(this.model.fenjie);
		this.goods = GameCommon.getInstance().getThingModel(item.type, item.id);
		// this.label_goodsName.text = `${this.goods.name}:`;
		// this.img_icon.source = this.goods.dropicon;
		// this.cons.label_r.textColor = 0x28e828;
		this.setTitle("元神分解");
		// this.basic["basic_tip_bg"].source = "psych_pop_bg_png";
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_decompose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		this.orangeLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchOrange, this);
		this.purpleLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPurple, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_decompose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		this.orangeLayer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchOrange, this);
		this.purpleLayer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPurple, this);
	}
	protected onRefresh(): void {
		var base: PsychBase;
		var data = DataManager.getInstance().psychManager.psychQueue;
		for (var key in data) {
			base = data[key];
			base.seletced = true;
		}
		this.btn_orange.selected = this.btn_purple.selected = true;
		this.onUpdateInfo();
		this.onChangeHandler();
		this.onShowInfo();
	}
	private onUpdateInfo(): void {
		var base: PsychBase;
		var item: PsychInstance;
		var data = DataManager.getInstance().psychManager.psychQueue;
		this.itemLayer.removeChildren();
		for (var key in data) {
			base = data[key];
			item = new PsychInstance(0);
			item.onUpdate(base, PSYCHSTATE_TYPE.SELECT, 0);
			item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
			this.itemLayer.addChild(item);
		}
	}
	private onSetBtnSelect(type: number, bl: boolean): void {
		switch (type) {
			case GoodsQuality.Orange:
				this.btn_orange.selected = bl;
				break;
			case GoodsQuality.Purple:
				this.btn_purple.selected = bl;
				break;
		}
	}
	private onTouchItem(e: egret.Event): void {
		var item = <PsychInstance>e.currentTarget;
		item.thing.seletced = !item.thing.seletced;
		item.onChangeCheckBox();
		this.onChangeHandler();
		this.onShowInfo();
	}
	private onChangeHandler(): void {
		var base: PsychBase;
		var data = DataManager.getInstance().psychManager.psychQueue;
		var allOrange: boolean = true;
		var allPurple: boolean = true;
		for (var key in data) {
			base = data[key];
			switch (base.model.pinzhi) {
				case GoodsQuality.Orange:
					if (!base.seletced) {
						allOrange = false;
					}
					break;
				case GoodsQuality.Purple:
					if (!base.seletced) {
						allPurple = false;
					}
					break;
			}
		}
		this.onSetBtnSelect(GoodsQuality.Orange, allOrange);
		this.onSetBtnSelect(GoodsQuality.Purple, allPurple);
	}
	private onTouchOrange(e: egret.Event) {
		this.btn_orange.selected = !this.btn_orange.selected;
		this.onSetBaseSelect(GoodsQuality.Orange, this.btn_orange.selected);
		this.onShowInfo();
	}
	private onTouchPurple(e: egret.Event) {
		this.btn_purple.selected = !this.btn_purple.selected;
		this.onSetBaseSelect(GoodsQuality.Purple, this.btn_purple.selected);
		this.onShowInfo();
	}
	private onSetBaseSelect(type: number, bl: boolean): void {
		var base: PsychBase;
		var data = DataManager.getInstance().psychManager.psychQueue;
		for (var key in data) {
			base = data[key];
			if (base.model.pinzhi == type) {
				base.seletced = bl;
			}
		}
	}
	private onShowInfo() {
		var item: PsychInstance;
		for (var i: number = this.itemLayer.numChildren - 1; i >= 0; i--) {
			item = this.itemLayer.getChildAt(i) as PsychInstance;
			item.onChangeCheckBox();
		}
		this.decomposeQueue = [];
		var add: number = 0;
		var base: PsychBase;
		var data = DataManager.getInstance().psychManager.psychQueue;
		for (var key in data) {
			base = data[key];
			if (base.seletced) {
				var awardItem = GameCommon.parseAwardItem(base.model.fenjie);
				add += awardItem.num;
				this.decomposeQueue.push(base);
			}
		}
		var awardItem = GameCommon.parseAwardItem(this.model.fenjie);
		var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(awardItem.id, awardItem.type);
		var _hasitemNum = _itemThing ? _itemThing.num : 0;
		// this.label_has.text = _hasitemNum.toString();
		this.cons.text = add + '';//["分解可获得：", `+${add}`];
	}


	private onTouchBtn(): void {
		if (this.decomposeQueue.length == 0) {
			GameCommon.getInstance().addAlert("请选择元神");
		} else {
			DataManager.getInstance().psychManager.onSendDecomposeMessage(this.decomposeQueue);
			this.onHide();
		}
	}
}