class AllPeopleRemindPanel extends BaseWindowPanel {
	// private closeBtn2: eui.Button;
	private boss_scroll: eui.Scroller;
	private itemGroup: eui.List;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.AllPeopleRemindSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		// this.closeBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
	}
	protected onRemove(): void {
		super.onRemove();
		// this.closeBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
	}
	//供子类覆盖
	protected onInit(): void {
		this.setTitle("cross_boss_remind_title_png");
		// this.setTitlePercent(0.8);
		// this.boss_scroll.verticalScrollBar.autoVisibility = true;
		// this.boss_scroll.verticalScrollBar.visible = true;
		this.itemGroup.itemRenderer = AllPeopleRemindItem;
		this.itemGroup.itemRendererSkinName = skins.AllPeopleRemindItemSkin;
		this.itemGroup.useVirtualLayout = false;
		this.boss_scroll.viewport = this.itemGroup;
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.itemGroup.dataProvider = new eui.ArrayCollection(Tool.Object2Ary(JsonModelManager.instance.getModelquanminboss()));
	}
	public onHide(): void {
		var remindBossIds: number[] = [];
		var isChange: boolean = false;
		for (var i: number = 0; i < this.itemGroup.dataProvider.length; i++) {
			var bossId: number = this.itemGroup.dataProvider.getItemAt(i).id;
			if ((this.itemGroup.getChildAt(i) as AllPeopleRemindItem).isRemind)
				remindBossIds.push(bossId);
			if (!isChange && DataManager.getInstance().dupManager.allpeoplebossData.remindBossIds.indexOf(bossId) < 0)
				isChange = true;
		}
		if (isChange || DataManager.getInstance().dupManager.allpeoplebossData.remindBossIds.length != remindBossIds.length) {
			DataManager.getInstance().dupManager.allpeoplebossData.remindBossIds = [];
			var remindMsg: Message = new Message(MESSAGE_ID.ALLPEOPLE_SET_REMIND_MSG);
			remindMsg.setShort(remindBossIds.length);
			for (var i: number = 0; i < remindBossIds.length; i++) {
				remindMsg.setShort(remindBossIds[i]);
				DataManager.getInstance().dupManager.allpeoplebossData.remindBossIds.push(remindBossIds[i]);
			}
			GameCommon.getInstance().sendMsgToServer(remindMsg);
		}
		super.onHide();
	}
	//The end
}
class AllPeopleRemindItem extends BaseListItem {
	private imgBG: eui.Image;
	private monster_name_label: eui.Label;
	private level_label: eui.Label;
	private remind_checkbox: eui.CheckBox;
	private unopen_label: eui.Label;

	constructor() {
		super();
	}
	protected onUpdate(): void {
		var model: Modelquanminboss = this.data as Modelquanminboss;
		var monsterFigtter: Modelfighter = ModelManager.getInstance().getModelFigher(model.modelId);
		this.monster_name_label.text = monsterFigtter.name;

		this.level_label.text = Language.instance.getText(`coatard_level${model.limitLevel}`, 'jingjie');
		var isOpen: boolean = model.limitLevel <= DataManager.getInstance().playerManager.player.coatardLv;
		this.remind_checkbox.visible = isOpen;
		this.unopen_label.visible = !isOpen;
		var isSelected: boolean = DataManager.getInstance().dupManager.allpeoplebossData.remindBossIds.indexOf(model.id) >= 0;
		this.remind_checkbox.selected = isSelected;
		this.imgBG.visible = (parseInt(model.id) % 2) == 0;
	}
	public get isRemind(): boolean {
		return this.remind_checkbox.selected;
	}
	//The end
}