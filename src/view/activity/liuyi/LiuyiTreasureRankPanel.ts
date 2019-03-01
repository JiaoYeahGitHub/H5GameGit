class LiuyiTreasureRankPanel extends BaseTabView {
	private time_label: eui.Label;
	private scroll: eui.Scroller;
	private itemlist: eui.List;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.LiuyiTreasureRankPanelSkin;
	}
	private get manager(): FestivalWuYiManager {
		return DataManager.getInstance().festivalWuYiManager;
	}
	protected onInit(): void {
		this.scroll.verticalScrollBar.autoVisibility = false;
		this.scroll.verticalScrollBar.visible = false;
		this.itemlist.itemRenderer = LiuyiTreasureItem;
		this.itemlist.itemRendererSkinName = skins.LiuyiTreasureRankItemSkin;
		this.itemlist.useVirtualLayout = true;
		this.scroll.viewport = this.itemlist;

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FESTIVAL_TURNPLATE_LOTTERY_RANK.toString(), this.onupdateRanks, this);
		GameDispatcher.getInstance().addEventListener('LIUYI_ZHUANPAN_LOOP_RANK', this.openRankView, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FESTIVAL_TURNPLATE_LOTTERY_RANK.toString(), this.onupdateRanks, this);
		GameDispatcher.getInstance().removeEventListener('LIUYI_ZHUANPAN_LOOP_RANK', this.openRankView, this);
		this.examineCD(false);
	}
	protected onRefresh(): void {
		this.requestRankInfo();
	}
	private requestRankInfo(): void {
		let rankMsg: Message = new Message(MESSAGE_ID.FESTIVAL_TURNPLATE_LOTTERY_RANK);
		GameCommon.getInstance().sendMsgToServer(rankMsg);
	}
	public onupdateRanks(): void {
		let ranknums: number[] = [];
		for (let i: number = 0; i < ActivityDefine.LIUYI_ZHUANPAN_AWARD.length; i++) {
			ranknums[i] = i + 1;
		}
		this.itemlist.dataProvider = new eui.ArrayCollection(ranknums);
	}
	public examineCD(open: boolean): void {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown(): void {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.ZHUANPANACTIVITY);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number): void {
		this.time_label.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
	private openRankView(): void {
		//给排行榜赋值数据
		var dataList: TopRankSimple[] = [];
		if (this.manager.zhuanpanRanks) {
			for (var i = 3; i < this.manager.zhuanpanRanks.length; i++) {
				var rankData: FestivalZhuanPanRank = this.manager.zhuanpanRanks[i];
				var simprankData: TopRankSimple = new TopRankSimple();
				simprankData.rank = rankData.rank;
				simprankData.name = rankData.playerName;
				simprankData.vip = rankData.viplevel;
				simprankData.value = rankData.lotteryNum;
				dataList.push(simprankData);
			}
		}
		var topManager: TopRankManager = DataManager.getInstance().topRankManager;
		topManager.lastRankType = TopRankManager.RANK_SIMPLE_TYPE_FESTIVAL_ZHUANPAN;
		topManager.lastDataList = dataList;
		//显示排行榜
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "TopRankActivityPanel");
	}
	//The end
}
//转盘排行榜ITEM
class LiuyiTreasureItem extends BaseListItem {
	private topGroup: eui.Group;
	private rank: eui.Image;
	private rank_num_lab: eui.BitmapLabel;
	private name_label: eui.Label;
	private vip_image: eui.Image;
	private value_label: eui.Label;
	private info_none: eui.Label;
	private info_group: eui.Group;
	private otherGroup: eui.Group;
	public ranklist: eui.Label;
	private awards: eui.Group;

	public constructor() {
		super();
	}
	protected onInit(): void {
		if (!this.ranklist.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
			this.ranklist.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoopRankView, this);
		}
	}
	protected onUpdate(): void {
		let rank: number = this.data;
		let model: Modelzhuanpanhuodong = DataManager.getInstance().festivalWuYiManager.zhuanpanModel;
		let awardkey: string = ActivityDefine.LIUYI_ZHUANPAN_AWARD[rank - 1];
		if (!awardkey)
			return;
		let rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model[awardkey]);
		this.awards.removeChildren();
		for (let i: number = 0; i < rewards.length; i++) {
			let award: AwardItem = rewards[i];
			let goodsInstace: GoodsInstance = GameCommon.getInstance().createGoodsIntance(award);
			this.awards.addChild(goodsInstace);
		}
		let rankData: FestivalZhuanPanRank = DataManager.getInstance().festivalWuYiManager.zhuanpanRanks[rank - 1];
		if (rank > 3) {
			this.topGroup.visible = false;
			this.otherGroup.visible = true;
				this.rank.source = "rankbg_4_png";
				this.rank_num_lab.text = "4-10";
		} else {
			if (rankData) {
				this.topGroup.visible = true;
				this.otherGroup.visible = false;
				this.rank.source = "rankbg_" + rankData.rank + "_png";
				this.rank_num_lab.text = rankData.rank.toString();
				this.info_group.visible = true;
				this.info_none.visible = false;
				this.name_label.text = rankData.playerName;
				if (rankData.viplevel > 0) {
					this.vip_image.source = "vip_v_png";
				} else {
					this.vip_image.source = "";
				}
				this.value_label.text = `今日累计转盘${rankData.lotteryNum}次`;
			} else {
				this.rank.source = "rankbg_" + rank + "_png";
				this.rank_num_lab.text = rank.toString();
				this.topGroup.visible = true;
				this.otherGroup.visible = false;
				this.info_group.visible = false;
				this.info_none.visible = true;
			}
		}
	}
	private onLoopRankView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event('LIUYI_ZHUANPAN_LOOP_RANK'));
	}
	//The end
}