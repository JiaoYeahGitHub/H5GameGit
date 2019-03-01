class RareEquip extends BaseComp {
	private goods: GoodsInstance;
	private label_desc: eui.Label;
	public constructor() {
		super();
	}
	protected setSkinName(): void {
		this.skinName = skins.RareEquipSkin;
	}
	protected onInit(): void {
	}
	protected dataChanged() {
		if (!this._data) {
			return;
		}
		this.goods.onUpdate(this._data.type, this._data.id, 0, this._data.quality);
		var arr: Array<egret.ITextElement> = new Array<egret.ITextElement>();
		arr.push({ text: `恭喜获得${GameDefine.EQUIP_QUALITE_NAME[this._data.quality]}装备-`, style: { "textColor": 0xffae21 } });
		arr.push({ text: this._data.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this._data.quality) } });
		this.label_desc.textFlow = arr;
	}
	//The end
}