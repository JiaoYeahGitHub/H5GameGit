class DominateInstance extends eui.Component {
	private selectLayer: eui.Group;
	private selectedAnim: Animation;
	private label_name: eui.Label;
	private label_lv: eui.Label;
	// private num_bg: eui.Image;
	private _data: DominateThing;
	private item_icon: eui.Image;
	private item_frame: eui.Image;
	// private item_back: eui.Image;
	private _currState: string = "normal";
	private otherplayerzhuzai: number = 0;
	private btn: eui.RadioButton;
	public isNeedActivate: boolean = false;
	private otherlvdate: number;
	constructor(currState: string = "normal") {
		super();
		this._currState = currState;
		this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.skinName = skins.DominateInstanceSkin;
	}
	private onLoadComplete(): void {
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
		this.currentState = this._currState;
		if (this._data)
			this.refresh();
	}
	public set data(param: DominateThing) {
		this._data = param;
		this.refresh();
	}
	public get data() {
		return this._data;
	}

	public onTouch(event: egret.TouchEvent): void {
		if (!this._data) return;
		switch (this.currentState) {
			case "normal":
				if (this.otherplayerzhuzai == 0) {
					if (this.isNeedActivate) {//需要激活
						var model = JsonModelManager.instance.getModelfunctionLv()[GameDefine.Dominate_Slot_func[this._data.slot]];
						if (DataManager.getInstance().playerManager.player.level < model.level) {
							// var model = JsonModelManager.instance.getModelfunctionLv()[GameDefine.Dominate_Slot_func[this._data.slot]];
							GameCommon.getInstance().addAlert(`${model.level}级激活`);
							return;
						}
					}
				} else {
					var model = JsonModelManager.instance.getModelfunctionLv()[GameDefine.Dominate_Slot_func[this._data.slot]];
					if (this.otherlvdate < model.level) {
						// var model = JsonModelManager.instance.getModelfunctionLv()[GameDefine.Dominate_Slot_func[this._data.slot]];
						GameCommon.getInstance().addAlert(`${model.level}级激活`);
						return;
					}
				}

				DomUpgradePanel.index = this._data.slot;
				// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "DominatePanel");
				break;
			case "select":
				break;
		}
	}
	private refresh() {
		if (!this._data) return;
		var model;
		this.isNeedActivate = false;
		var model = JsonModelManager.instance.getModelfunctionLv()[GameDefine.Dominate_Slot_func[this._data.slot]];
		if (this.otherplayerzhuzai == 0) {
			if (DataManager.getInstance().playerManager.player.level < model.level) {
				this.isNeedActivate = true;
			} else {
				if (this._data.lv == 0) {
					this.isNeedActivate = true;
				}
			}
		} else {
			if (this.otherlvdate < model.level) {
				this.isNeedActivate = true;
			} else {
				if (this._data.lv == 0) {
					this.isNeedActivate = true;
				}
			}
		}

		switch (this.currentState) {
			case "normal":
				if (this.isNeedActivate) {
					this.label_lv.text = "";
					// this.num_bg.visible = false;
					this.label_name.textFlow = new Array<egret.ITextElement>({ text: `${model.level}级激活`, style: { "textColor": 0xe9deb3 } });
					this.item_icon.source = `a_${this._data.model.icon}`;
					// this.item_back.source = "bag_back_jpg";
					this.item_frame.source = "bag_whiteframe_png";
				} else {
					this.label_lv.text = `+${this._data.lv}`;
					// this.num_bg.visible = true;
					this.item_icon.source = this._data.model.icon;
					// this.item_back.source = GameCommon.getInstance().getDomIconBack(this._data.tier);
					this.item_frame.source = GameCommon.getInstance().getIconFrame(this._data.quality);
					this.label_name.textFlow = new Array<egret.ITextElement>({ text: this._data.model.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this._data.model.quality) } });//+ this._data.tier
				}
				break;
			case "select":
				this.label_lv.text = "";
				// model = JsonModelManager.instance.getModelshanggutaozhuang()[this._data.slot][0];
				this.label_name.textFlow = new Array<egret.ITextElement>({ text: this._data.model.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this._data.model.quality) } });
				this.item_icon.source = this._data.model.icon;
				// this.item_back.source = GameCommon.getInstance().getIconBack(this._data.model.quality);
				this.item_frame.source = GameCommon.getInstance().getIconFrame(this._data.quality);
				break;
		}

	}
	public set otherlv(date) {
		this.otherlvdate = date;
	}
	public get otherlv() {
		return this.otherlvdate;
	}
	public set selected(bl: boolean) {
		this.selectLayer.visible = bl;
		if (bl) {
			if (!this.selectedAnim) {
				this.selectedAnim = new Animation("xuanzhongkuang_3", -1);
				this.selectLayer.addChildAt(this.selectedAnim, 0);
				this.selectedAnim.scaleX = this.selectedAnim.scaleY = 0.6;
			}
			this.selectedAnim.onPlay();
		} else {
			if (this.selectedAnim) {
				this.selectedAnim.onStop();
			}
		}
	}
	public setBtnSelect(bl: boolean) {
		this.btn.selected = bl;
	}
	public setBtnSelectOverturn() {
		this.btn.selected = !this.btn.selected;
	}
	public getBtnSelect() {
		return this.btn.selected;
	}
}
enum DOMINATE_POS {
	EQUIP = 0,
	BAG = 1
}