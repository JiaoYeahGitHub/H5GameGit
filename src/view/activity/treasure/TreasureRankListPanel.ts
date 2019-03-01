class TreasureRankListPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private top_scroll: eui.Scroller;
	private itemGroup: eui.List;
	private closeBtn0: eui.Button;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.TreasureRankListPanelSkin;
	}
	protected onInit(): void {
		super.onInit();
		// this.itemGroup.itemRenderer = TreasureListItemRenderer;
		// this.itemGroup.itemRendererSkinName = skins.TreasureListItemSkin;
		this.itemGroup.useVirtualLayout = true;
		this.top_scroll.viewport = this.itemGroup;
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
	}
	protected onRefresh(): void {
		var ret: TreasureRankBase[] = [];
		var record = DataManager.getInstance().treasureRankManager.record;
		for (var key in record) {
			ret.push(record[key]);
		}
		this.itemGroup.dataProvider = new eui.ArrayCollection(ret);
	}
}
class TreasureListItemRenderer extends eui.ItemRenderer {
	public label_rank: eui.Label;
	public label_name: eui.Label;
	public label_integral: eui.Label;
	public img_bg: eui.Image;
	constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onComplete, this);
	}
	private onComplete(): void {

	}
	protected dataChanged(): void {
		var base: TreasureRankBase = this.data;
		if (base) {
			this.img_bg.visible = (this.itemIndex & 1) == 1;
			this.label_rank.text = (this.itemIndex + 1).toString();
			this.label_name.text = base.name;
			this.label_integral.text = base.integral.toString();
		}
	}
}
