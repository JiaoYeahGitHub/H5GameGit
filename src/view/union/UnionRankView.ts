class UnionRankView extends BaseWindowPanel {
	private list_scroll: eui.Scroller;
	private union_list: eui.List;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionRankPanelSkin;
	}
	//供子类覆盖
	protected onInit(): void {
		this.list_scroll.verticalScrollBar.autoVisibility = true;
		this.union_list.percentWidth = 620;
		this.union_list.percentHeight = 136;
		this.union_list.itemRenderer = UnionRankItem;
		this.union_list.itemRendererSkinName = skins.UnionRankItemSkin;
		this.union_list.useVirtualLayout = true;
		this.list_scroll.viewport = this.union_list;
		super.onInit();
		this.setTitle("仙盟排行");
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_LIST_MESSAGE.toString(), this.onResUnionListMsg, this);
		this.onReqUnionListMsg();
	}
	protected onRemove(): void {

		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_LIST_MESSAGE.toString(), this.onResUnionListMsg, this);
		super.onRemove();
	}
	//请求公会排行榜
	private onReqUnionListMsg(): void {
		var unionlistMsg: Message = new Message(MESSAGE_ID.UNION_LIST_MESSAGE);
		unionlistMsg.setShort(1);
		GameCommon.getInstance().sendMsgToServer(unionlistMsg);
	}
	//帮会列表返回
	private onResUnionListMsg(): void {
		var rankList = [];
		for (var i: number = 0; i < DataManager.getInstance().unionManager.applyUnionList.length; i++) {
			rankList.push({ info: DataManager.getInstance().unionManager.applyUnionList[i], rank: i + 1 });
		}
		this.union_list.dataProvider = new eui.ArrayCollection(rankList);
	}
	//The end
}
class UnionRankItem extends eui.ItemRenderer {
	private union_badges: eui.Component;
	private union_name_label: eui.Label;
	private member_num_label: eui.Label;
	private mamber_Name: eui.Label;
	private unionLv: eui.Label;
	// private xuanyan_label: eui.Label;
	private rank_icon: eui.Image;
	private rank_num: eui.BitmapLabel;

	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onComplete, this);
	}
	private onComplete(): void {
	}
	protected dataChanged(): void {
		var unionInfo: UnionInfo = this.data.info as UnionInfo;
		var rankNum: number = this.data.rank;
		var colorIndex: number = Tool.toInt(unionInfo.badgesIndex / UnionDefine.Union_Badges_ColorNum) + 1;
		(this.union_badges["badges_bg"] as eui.Image).source = `union_badges_bg${colorIndex}_png`;
		var iconIndex: number = unionInfo.badgesIndex % UnionDefine.Union_Badges_IconNum + 1;
		(this.union_badges["badges_icon"] as eui.Image).source = `union_badges_icon${iconIndex}_png`;
		this.union_name_label.textFlow = (new egret.HtmlTextParser).parser(unionInfo.name);
		this.unionLv.text = '等级:' + unionInfo.level + "级";
		this.mamber_Name.text = '盟主:' + unionInfo.wangName;
		var unionlevelModel: ModelguildLv = JsonModelManager.instance.getModelguildLv()[unionInfo.level - 1];
		this.member_num_label.text = "盟众:" + unionInfo.memberCount + "/" + (unionlevelModel ? unionlevelModel.renshuMax : 0);
		// this.xuanyan_label.text = unionInfo.xuanyan;
		// this.rank_icon.source = `rank_itemtitle0_png`;
		// this.rank_num.text = "" + rankNum;
		this.rank_num.text = rankNum.toString();
		if (rankNum > 4) {
			// this.rank_icon.source = `rank_4_20_png`;
			this.rank_icon.source = `rankbg_4_png`;
		} else {
			this.rank_icon.source = `rankbg_${rankNum}_png`;
		}
	}
	//The end
}