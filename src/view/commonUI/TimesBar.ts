class TimesBar extends BaseComp {
	private title_desc_lab: eui.Label;
	private times_lab: eui.Label;

	constructor() {
		super();
	}
	protected setSkinName(): void {
		this.skinName = skins.TimesBarSkin;
	}
	protected dataChanged(): void {
		let title_str: string = this._data[0] ? this._data[0] : Language.instance.getText('shengyucishu');
		this.title_desc_lab.text = title_str;
		let currCount: number = this._data[1];
		let totalCount: number = this._data[2];
		this.times_lab.text = `${currCount}/${totalCount}`;
		this.times_lab.textColor = currCount > 0 ? 0x00ff00 : 0xff0000;
	}
	//The end
}