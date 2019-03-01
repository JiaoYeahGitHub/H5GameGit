class UnionBattleRankPanel extends BaseWindowPanel {
	private Rank_TYPE: UNIONBATTLE_RANKTYPE = UNIONBATTLE_RANKTYPE.UNION_BALLTE;
	private btn_sure: eui.Button;
	private boss_scroll: eui.Scroller;
	private itemGroup: eui.List;
	private my_self_infogrp: eui.Group;
	private tabtitle_name_label: eui.Label;
	private myrank_label: eui.Label;
	private mystar_count_label: eui.Label;
	private my_score_label: eui.Label;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionBattleRankSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BATTLE_RANK_MESSAGE.toString(), this.onResBaltteRankMsg, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BATTLE_SINGLERANK_MSG.toString(), this.onResBaltteRankMsg, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BATTLE_RANK_MESSAGE.toString(), this.onResBaltteRankMsg, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BATTLE_SINGLERANK_MSG.toString(), this.onResBaltteRankMsg, this);
	}
	//供子类覆盖
	protected onInit(): void {
		this.itemGroup.itemRenderer = UnionBattleRankItem;
		this.itemGroup.itemRendererSkinName = skins.UnionBattleRankItemSkin;
		this.itemGroup.useVirtualLayout = true;
		this.boss_scroll.viewport = this.itemGroup;
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.onRequestRankInfoMsg();
		// this.my_self_infogrp.visible = false;
		// this.my_self_infogrp.visible = this.Rank_TYPE == UNIONBATTLE_RANKTYPE.UNION_SINGLE;
		if (this.Rank_TYPE == UNIONBATTLE_RANKTYPE.UNION_SINGLE) {
			this.tabtitle_name_label.text = "玩家名称";
			// this.setTitle("unionbattle_singlerank_title_png");
		} else if (this.Rank_TYPE == UNIONBATTLE_RANKTYPE.UNION_BALLTE) {
			// this.tabtitle_name_label.text = "帮会名称";
			// this.setTitle("unionbattle_rank_title_png");
		}
	}
	private onRequestRankInfoMsg(): void {
		if (this.Rank_TYPE == UNIONBATTLE_RANKTYPE.UNION_BALLTE) {
			var rankInfoMsg: Message = new Message(MESSAGE_ID.UNION_BATTLE_RANK_MESSAGE);
			GameCommon.getInstance().sendMsgToServer(rankInfoMsg);
		} else if (this.Rank_TYPE == UNIONBATTLE_RANKTYPE.UNION_SINGLE) {
			// var rankInfoMsg: Message = new Message(MESSAGE_ID.UNION_BATTLE_SINGLERANK_MSG);
			GameCommon.getInstance().sendMsgToServer(rankInfoMsg);
		}
	}
	private onResBaltteRankMsg(): void {
		if (this.Rank_TYPE == UNIONBATTLE_RANKTYPE.UNION_SINGLE) {
			var singleRanks: UnionBattleRank[] = DataManager.getInstance().unionManager.unionbattleInfo.singleRanks;
			var rankData: UnionBattleRank = singleRanks.shift();
			this.myrank_label.text = "我的排名：" + (rankData.rank > 0 ? rankData.rank + "" : "暂无");
			this.mystar_count_label.text = "" + rankData.starCount;
			this.my_score_label.text = GameCommon.getInstance().getFormatNumberShow(rankData.scoreCount);

			this.itemGroup.dataProvider = new eui.ArrayCollection(singleRanks);
		} else if (this.Rank_TYPE == UNIONBATTLE_RANKTYPE.UNION_BALLTE) {
			this.itemGroup.dataProvider = new eui.ArrayCollection(DataManager.getInstance().unionManager.unionbattleInfo.rankDatas);
		}
	}

	public onShowWithParam(param): void {
		this.Rank_TYPE = param;
		this.onShow();
	}
	//The end
}
class UnionBattleRankItem extends eui.ItemRenderer {
	private rank_icon: eui.Image;
	private name_label: eui.Label;
	// private rank_num_label: eui.BitmapLabel;
	// private rank_num_group: eui.Group;
	private mystar_count_label: eui.Label;
	private my_score_label: eui.Label;

	constructor() {
		super();
	}
	protected dataChanged(): void {
		var rankData: UnionBattleRank = this.data as UnionBattleRank;
		if (rankData.rank > 3) {
			this.rank_icon.visible = false;
			// this.rank_num_group.visible = true;
			// this.rank_num_label.text = "" + rankData.rank;
		} else {
			this.rank_icon.visible = true;
			// this.rank_num_group.visible = false;
			this.rank_icon.source = `rank_itemtitle${rankData.rank}_png`;
		}
		this.name_label.text = rankData.name;
		this.mystar_count_label.text = "" + rankData.starCount;
		this.my_score_label.text = GameCommon.getInstance().getFormatNumberShow(rankData.scoreCount);
	}
	//The end
}
enum UNIONBATTLE_RANKTYPE {
	UNION_BALLTE = 0,//帮会战排名
	UNION_SINGLE = 1,//个人积分排名
}