class PetInstance extends eui.Component {
	protected id;
	private _selected: boolean = false;
	// private img_bg: eui.Image;
	private animLayer: eui.Group;
	private img_icon: eui.Image;
	private lab_state: eui.Label;
	private img_state: eui.Image;
	private lab_name: eui.Label;
	private lab_tier: eui.Label;
	private condition_lab: eui.Label;
	private red_point: eui.Image;
	private _data: PetData;
	private selectAnim: Animation;

	public model: Modelchongwujinjie;

	public constructor() {
		super();
		// this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.skinName = skins.PetInstanceSkin;
	}
	protected refresh() {
		if (this._data.lv == 0) {
			this.currentState = "activate";
			// if (DataManager.getInstance().petManager.onCheckPetCanActivateById(this._data.id)) {
			// 	this.condition_lab.text = Language.instance.getText('kejihuo');
			// 	this.red_point.visible = true;
			// } else {
				this.condition_lab.text = Language.instance.getText('weijihuo');
				this.red_point.visible = false;
			// }
			this.img_icon.source = `pet${this.model.waixing1}_icon_unopen_png`;
		} else {
			this.currentState = "common";
			this.lab_tier.text = Language.instance.getText(this._data.lv + '', 'level', this._data.grade, 'grade');
			this.img_icon.source = `pet${this.model.waixing1}_icon_open_png`;
		}
		if (this._data.isOutBound) {
			this.lab_state.text = Language.instance.getText('chuzhan');
			this.img_state.source = "pet_bg_outbound_png";

		} else {
			this.lab_state.text = Language.instance.getText('rest');
			this.img_state.source = "pet_bg_rest_png";
		}

		// this.lab_name.textFlow = new Array<egret.ITextElement>({ text: this.model.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this.model.quality) } });
	}
	public set data(param: PetData) {
		this._data = param;
		if (param.model) {
			this.model = param.gradeModel;
		} else {
			this.model = JsonModelManager.instance.getModelchongwujinjie()[this._data.id][0];
		}
		this.refresh();
	}
	public get data(): PetData {
		return this._data;
	}
	public set selected(param) {
		this._selected = param;
		if (this._selected) {
			if (!this.selectAnim) {
				this.selectAnim = GameCommon.getInstance().addAnimation('chongwu_xuanzhong', null, this.animLayer, -1);
			}
			this.selectAnim.visible = true;
		} else {
			if (this.selectAnim) {
				this.selectAnim.visible = false;
			}
		}
	}
}