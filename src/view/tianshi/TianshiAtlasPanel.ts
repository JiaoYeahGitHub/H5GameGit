class TianshiAtlasPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public scroller: eui.Scroller;
	public atlas_list: eui.List;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.TianshiAtlasPanelSkin;
	}
	protected onInit(): void {
		this.setTitle("历史天师");
		this.atlas_list.itemRenderer = TianshiAtlasItem;
		this.atlas_list.itemRendererSkinName = skins.TianshiAtlasItemSkin;
		this.atlas_list.useVirtualLayout = true;
		this.scroller.viewport = this.atlas_list;

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
	}
	private get playerM() {
		return DataManager.getInstance().playerManager;
	}
	protected onRefresh(): void {
		let models: ModelshareMaster[] = [];
		for (let id in JsonModelManager.instance.getModelshareMaster()) {
			let model: ModelshareMaster = JsonModelManager.instance.getModelshareMaster()[id];
			models.push(model);
		}
		this.atlas_list.dataProvider = new eui.ArrayCollection(models);
	}
}
/**天师图鉴ITEM**/
class TianshiAtlasItem extends BaseListItem {
	public atlas_img: eui.Image;
	public lv_lab: eui.Label;
	public attr_desc_lab: eui.Label;
	private not_open_lab: eui.Label;

	public constructor() {
		super();
	}
	protected onUpdate(): void {
		let model: ModelshareMaster = this.data;
		if (DataManager.getInstance().playerManager.player.shareMasterId < model.id) {
			this.lv_lab.text = "";
			this.atlas_img.source = "";
			if (model.id == DataManager.getInstance().playerManager.player.shareMasterId + 1) {
				this.not_open_lab.text = "下级预览";
				this.attr_desc_lab.text = Language.instance.parseInsertText("tianshi_plus_type" + model.type, (model.allplus / GameDefine.GAME_ADD_RATIO * 100) + "%");
			} else {
				this.not_open_lab.text = "暂未激活";
				this.attr_desc_lab.text = "";
			}
		} else {
			this.not_open_lab.text = "";
			this.lv_lab.text = Language.instance.parseInsertText("tianshi_level", model.id);
			this.attr_desc_lab.text = Language.instance.parseInsertText("tianshi_plus_type" + model.type, (model.allplus / GameDefine.GAME_ADD_RATIO * 100) + "%");
			this.atlas_img.source = model.pic;
		}
	}
}