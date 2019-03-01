class TopRankActivityPanel extends BaseWindowPanel {
	private top_scroll: eui.Scroller;
	private itemGroup: eui.List;
	private currType: number;
	//	private closeBtn2: eui.Button;
	private label_value_name: eui.Label;
	// private label_name2: eui.Group;
	// private label_value_name2: eui.Label;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.TopRankActivitySkin;
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
		this.setTitle("排行");
		this.itemGroup.itemRenderer = TopRankActivityItem;
		this.itemGroup.itemRendererSkinName = skins.TopRankSimpleItemSkin;
		this.itemGroup.useVirtualLayout = false;
		this.top_scroll.viewport = this.itemGroup;
		super.onInit();
		this.onRefresh();
	}
	// public static ADD_STR: string = "";
	// public static NAME2_VISIBLE = true;
	protected onRefresh(): void {
		var topManager: TopRankManager = DataManager.getInstance().topRankManager;
		this.currType = topManager.lastRankType;
		this.onRefreshTitle();
		this.itemGroup.dataProvider = new eui.ArrayCollection(topManager.lastDataList);
	}
	private onRefreshTitle(): void {
		// this.setTitle("rank_paihangbangtitle_png");
		// TopRankSimplePanel.ADD_STR = "";
		// TopRankSimplePanel.NAME2_VISIBLE = false;
		// this.label_name2.visible = false;
		this.currentState = "lineThree";
		//达标活动
		if (this.currType == TopRankManager.RANK_SIMPLE_TYPE_DABIAO) {
			this.label_value_name.text = DataManager.getInstance().newactivitysManager.dabiao_model.ranktitle;
			// var dabiaoType = DataManager.getInstance().newactivitysManager.dabiao_model.type;
			// TopRankSimplePanel.ADD_STR = "阶";
			// this.label_value_name.text = dabiao_model.
			// if (dabiaoType == NewactivitysManager.DABIAO_TYPE_JEWEL) {
			// 	this.label_value_name.text = "宝石";
			// 	TopRankSimplePanel.ADD_STR = "级";
			// 	TopRankSimplePanel.NAME2_VISIBLE = false;
			// 	this.label_name2.visible = false;
			// } else if (dabiaoType == NewactivitysManager.DABIAO_TYPE_HORSE) {
			// 	this.label_value_name.text = "坐骑战力";
			// 	TopRankSimplePanel.NAME2_VISIBLE = false;
			// 	this.label_name2.visible = false;
			// } else if (dabiaoType == NewactivitysManager.DABIAO_TYPE_YUDI) {
			// 	this.label_value_name.text = "玉笛";
			// 	TopRankSimplePanel.ADD_STR = "级";
			// 	TopRankSimplePanel.NAME2_VISIBLE = false;
			// 	this.label_name2.visible = false;
			// } else if (dabiaoType == NewactivitysManager.DABIAO_TYPE_FABAO) {
			// 	this.label_value_name.text = "法宝";
			// 	this.label_value_name2.text = "星级";
			// 	TopRankSimplePanel.ADD_STR = "阶";
			// 	TopRankSimplePanel.NAME2_VISIBLE = true;
			// 	this.label_name2.visible = true;
			// } else if (dabiaoType == NewactivitysManager.DABIAO_TYPE_REIN) {
			// 	this.label_value_name.text = "转生";
			// 	this.label_value_name2.text = "等级";
			// 	TopRankSimplePanel.ADD_STR = "转";
			// 	TopRankSimplePanel.NAME2_VISIBLE = true;
			// 	this.label_name2.visible = true;
			// } else if (dabiaoType == NewactivitysManager.DABIAO_TYPE_FIGHT) {
			// 	this.label_value_name.text = "战力";
			// 	TopRankSimplePanel.NAME2_VISIBLE = false;
			// 	this.label_name2.visible = false;
			// }
		} else if (this.currType == TopRankManager.RANK_SIMPLE_TYPE_FESTIVAL_TARGET) {
			this.label_value_name.text = "消费钻石";
			// TopRankSimplePanel.NAME2_VISIBLE = false;
			// this.label_name2.visible = false;
		} else if (this.currType == TopRankManager.RANK_SIMPLE_TYPE_FESTIVAL_PAYTARGET) {
			this.label_value_name.text = "充值钻石";
			// TopRankSimplePanel.NAME2_VISIBLE = false;
			// this.label_name2.visible = false;
		} else if (this.currType == TopRankManager.RANK_SIMPLE_TYPE_FESTIVAL_ZHUANPAN) {
			this.label_value_name.text = "转盘次数";
		}
	}
	//The end
}

class TopRankActivityItem extends eui.ItemRenderer {
	private label_rank: eui.Label;
	private label_vip: eui.Image;
	private label_name: eui.Label;
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
		if (rank.vip > 0) {
			this.label_vip.visible = true;
			this.label_vip.source = "vip_v_png";
		} else {
			this.label_vip.visible = false;
			this.label_vip.source = "";
		}
		this.label_name.text = rank.name;
		if (rank.fighting >= 0) {
			this.label_value.text = rank.value + "阶" + rank.fighting + "星";
		} else {
			this.label_value.text = rank.value + "";
		}
	}
	//The end
}