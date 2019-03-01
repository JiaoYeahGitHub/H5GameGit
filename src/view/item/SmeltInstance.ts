class SmeltInstance extends eui.Component {
	private item_icon: eui.Image;
	private item_frame: eui.Image;
	// private item_back: eui.Image;
	private label_0: eui.Label;
	private label_1: eui.Label;
	// private jobIcon: eui.Image;
	private _thing: EquipThing;
	private _type: number = 0;
	private _own: number;
	private _pos: number;
	private btn: eui.CheckBox;
	// private img_add: eui.Image;
	public constructor(pos: number) {
		super();
		this._pos = pos;
		this.skinName = skins.SmeltInstanceSkin;
	}
	public onUpdate(param: EquipThing, type: number, own: number) {
		this._thing = param;
		this._type = type;
		this._own = own;
		this.refresh();
	}
	public get pos() {
		return this._pos;
	}
	public onRefresh() {
		this.refresh();
	}
	protected refresh() {
		switch (this._type) {
			case SMELTINSTANCE_TYPE.NONE:
				this.currentState = "none";
				this.item_icon.source = "";
				// this.item_back.source = "bag_back_jpg";
				this.item_frame.source = "bag_whiteframe_png";
				// this.jobIcon.source = "";
				this._thing = null;
				// if (this._own == 0) {
				// 	this.img_add.visible = false;
				// } else if (this._own == 1) {
				// 	this.img_add.visible = true;
				// }
				return;
			case SMELTINSTANCE_TYPE.SHOWLV:
				if (!this._thing) return;
				this.currentState = "normal";
				var name: string = "";
				if (this._thing.type == GOODS_TYPE.MASTER_EQUIP) {
					name = this._thing.model.coatardLv + Language.instance.getText("grade");
					this.label_0.textFlow = new Array<egret.ITextElement>({ text: `${name}`, style: { "textColor": 0xE9DEB3 } });
				} else if (this._thing.type == GOODS_TYPE.SERVANT_EQUIP) {
					name = this._thing.model.starNum + Language.instance.getText("star");
					this.label_0.textFlow = new Array<egret.ITextElement>({ text: `${name}`, style: { "textColor": 0xE9DEB3 } });
				}
				this.label_1.textFlow = [];
				break;
			case SMELTINSTANCE_TYPE.SHOWNAME:
				this.currentState = "normal";
				if (!this._thing) return;
				this.label_0.textFlow = new Array<egret.ITextElement>({ text: this._thing.model.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this._thing.model.quality) } });
				this.label_1.textFlow = [];
				break;
			case SMELTINSTANCE_TYPE.SELECT:
				this.currentState = "select";
				if (!this._thing) return;
				this.label_0.textFlow = new Array<egret.ITextElement>({ text: this._thing.model.name, style: { "textColor": 0xE9DEB3 } });
				this.label_1.textFlow = new Array<egret.ITextElement>({ text: `评分:${this._thing.pingfenValue}`, style: { "textColor": 0xE9DEB3 } });
				this.btn.selected = this._thing.selected;
				break;
		}
		this.item_icon.source = this._thing.model.icon;
		this.item_frame.source = GameCommon.getInstance().getIconFrame(this._thing.quality);
	}
	public get thing() {
		return this._thing;
	}
	private _aniSmelt: Animation;
	public playSmelt() {
		if (!this._thing) return;
		if (!this._aniSmelt) {
			this._aniSmelt = new Animation("ronglian", 1);
			this._aniSmelt.x = this.width / 2;
			this._aniSmelt.y = this.height / 2;
			this.addChild(this._aniSmelt);
		} else {
			this._aniSmelt.visible = true;
			this._aniSmelt.playNum = 1;
		}
		this._aniSmelt.playFinishCallBack(this.smeltAnimEnd, this);
	}
	private smeltAnimEnd(): void {
		if (this._aniSmelt) {
			this._aniSmelt.visible = false;
		}
	}
}
enum SMELTINSTANCE_TYPE {
	NONE = 0,
	SHOWLV = 1,
	SHOWNAME = 2,
	SELECT = 3
}