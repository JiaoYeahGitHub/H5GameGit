class NormalTipsBar extends BaseTipsBar {
	public constructor(owner: ItemIntroducebar) {
		super(owner);
	}
	protected initSkinName(): void {
		this.skinName = skins.NormalTipsBarSkin;
	}
	public onUpdate(param: IntroduceBarParam): void {
		super.onUpdate(param);
		var model: ModelThing;
		if (egret.is(param.model, "ThingBase")) {
			model = param.model.model;
		} else if (egret.is(param.model, "ModelThing")) {
			model = param.model;
		}
		var levelDesc;
		if (model.level) {
			levelDesc = '等级:'+ model.level;// + Language.instance.getText("level");
		} else {
			levelDesc =  '等级:'+1 ;//+ Language.instance.getText("level");
		}
		this.level_label.text = levelDesc;
		this.timeGoods = DataManager.getInstance().timeGoodsManager.getTimeGoods(model.type, model.id);
		super.onRefreshCommonUI(model);
	}
}