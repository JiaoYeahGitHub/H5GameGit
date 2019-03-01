class AttributeItem extends BaseComp {
	private attrname_label: eui.Label;
	private label_basis: eui.Label;
	private label_add: eui.Label;
	public constructor() {
		super();
	}
	protected setSkinName(): void {
		this.skinName = skins.AttributeItemSkin;
	}
	protected dataChanged() {
		let param: string[] = this._data;
		if (!GameDefine.Attr_FontName[param[0]]) {
			this.attrname_label.text = param[0];
			this.label_basis.text = param[1];
			this.label_add.text = '';
			return;
		}
		this.attrname_label.text = GameDefine.Attr_FontName[param[0]] + ':';
		this.label_basis.text = param[1];
		if (param[2]) {
			this.label_add.visible = true;
			this.label_add.text = param[2];
		} else {
			this.label_add.visible = false;
		}
	}
}