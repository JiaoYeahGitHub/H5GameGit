class TopRankSimplePanel extends BaseWindowPanel {
	private top_scroll: eui.Scroller;
	private itemGroup: eui.List;
	private currType: number;
	private closeBtn2: eui.Button;
	private label_value_name: eui.Label;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.TopRankSimpleSkin;
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
		// this.top_scroll.verticalScrollBar.autoVisibility = true;
		// this.top_scroll.verticalScrollBar.visible = true;
		this.itemGroup.itemRenderer = TopRankSimpleItem;
		this.itemGroup.itemRendererSkinName = skins.TopRankSimpleItemSkin;
		this.itemGroup.useVirtualLayout = true;
		this.top_scroll.viewport = this.itemGroup;
		super.onInit();
		this.onRefresh();
	}
	public static ADD_STR: string = "关";
	public static NAME2_VISIBLE = true;
	protected onRefresh(): void {
		var topManager: TopRankManager = DataManager.getInstance().topRankManager;
		this.currType = topManager.lastRankType;
		this.onRefreshTitle();
		this.itemGroup.dataProvider = new eui.ArrayCollection(topManager.lastDataList);
	}
	private onRefreshTitle(): void {
		this.setTitle("排名");
		this.label_value_name.text = "关卡";
	}
	public onShowWithParam(param): void {
		var topManager: TopRankManager = DataManager.getInstance().topRankManager;
		topManager.lastRankType = param.currType;
		topManager.lastDataList = param.dataList;
		super.onShowWithParam(param);
	}
	//The end
}
class TopRankSimpleItem extends eui.ItemRenderer {
	private label_rank: eui.Label;
	private label_vip: eui.Image;
	private label_name: eui.Label;
	private bg_img: eui.Image;
	// private label_fighting: eui.Label;
	private label_value: eui.Label;

	constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onComplete, this);
	}
	private onComplete(): void {
	}
	protected dataChanged(): void {
		var rank: TopRankSimple = this.data as TopRankSimple;
		this.label_rank.text = rank.rank + "";
		this.bg_img.source = rank.rank % 2 == 0 ? "public_di1_png" : "public_di5_png";
		if (rank.vip > 0) {
			this.label_vip.visible = true;
			this.label_vip.source = "vip_v_png";
		} else {
			this.label_vip.visible = false;
			this.label_vip.source = "";
		}
		this.label_name.text = rank.name + "";
		// if (!TopRankSimplePanel.NAME2_VISIBLE)
		// 	this.label_fighting.visible = false;
		// else
		// 	this.label_fighting.visible = true;
		// this.label_fighting.text = GameCommon.getInstance().getFormatNumberShow(rank.fighting);
		this.label_value.text = GameCommon.getInstance().getFormatNumberShow(rank.value) + TopRankSimplePanel.ADD_STR;
	}
	//The end
}
class TopRankSimpleParam {
	public currType: number;
	public dataList: TopRankSimple[];
}