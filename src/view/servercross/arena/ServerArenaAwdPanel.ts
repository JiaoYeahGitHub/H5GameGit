class ServerArenaAwdPanel extends BaseWindowPanel {
	private scroll: eui.Scroller;
	private awardList: eui.List;
	private sure_btn: eui.Button;

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onInit(): void {
		this.setTitle('排名奖励');
		this.scroll.verticalScrollBar.autoVisibility = false;
		this.scroll.verticalScrollBar.visible = false;
		this.awardList.itemRenderer = ArenaSinlgeRankAwdItem;
		this.awardList.itemRendererSkinName = skins.ArenaSingleAwdItemSkin;
		this.awardList.useVirtualLayout = true;
		this.scroll.viewport = this.awardList;

		let datas: Modelkuafujingjichang[] = [];
		for (let id in JsonModelManager.instance.getModelkuafujingjichang()) {
			datas.push(JsonModelManager.instance.getModelkuafujingjichang()[id]);
		}
		this.awardList.dataProvider = new eui.ArrayCollection(datas);
	}
	protected onSkinName(): void {
		this.skinName = skins.SeverArenaAwdPanelSkin;
	}
	protected onRefresh(): void {
	}
	protected onRegist(): void {
		super.onRegist();
		this.sure_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.sure_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
	}
	//The end
}
class ArenaSinlgeRankAwdItem extends BaseListItem {
	private rank_icon: eui.Image;
	private rank_num_label: eui.BitmapLabel;
	private award_grp: eui.Group;

	constructor() {
		super();
	}
	protected onUpdate(): void {
		let awardModel: Modelkuafujingjichang = this.data as Modelkuafujingjichang;
		if (awardModel.min == awardModel.max) {
			this.rank_icon.source = `rankbg_${Math.min(4, awardModel.min)}_png`;
			this.rank_num_label.scaleX = this.rank_num_label.scaleY = 1;
			this.rank_num_label.text = awardModel.min + '';
		} else {
			this.rank_icon.source = ``;
			this.rank_num_label.scaleX = this.rank_num_label.scaleY = 0.6;
			this.rank_num_label.text = awardModel.min + '-' + awardModel.max;
		}
		this.award_grp.removeChildren();
		for (var i: number = 0; i < awardModel.rewards.length; i++) {
			var goodsItem: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awardModel.rewards[i]);
			this.award_grp.addChild(goodsItem);
		}
	}
} 