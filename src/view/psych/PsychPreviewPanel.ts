class PsychPreviewPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	
	private itemLayer: eui.Group;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PsychPreviewPanelSkin;
	}
	protected onInit(): void {
		this.setTitle("元神预览");
		// this.basic["basic_tip_bg"].source = "psych_pop_bg_png";
		var item: PsychInstance;
		var data = DataManager.getInstance().psychManager.getOneLvAllPsych();
		for (var i: number = 0; i < data.length; i++) {
			item = new PsychInstance(i);
			item.onUpdate(new PsychBase(data[i]), PSYCHSTATE_TYPE.SHOWNAME, 0);
			item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
			this.itemLayer.addChild(item);
		}

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
	}
	protected onRefresh(): void {

	}
	private onTouchItem(e: egret.Event): void {
		var psych = <PsychInstance>e.currentTarget;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("PsychIntroducebar",
				new PsychIntroducebarParam(psych.thing.model))
		);
	}
}