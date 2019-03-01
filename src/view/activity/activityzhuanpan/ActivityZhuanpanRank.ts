class ActivityZhuanpanRank extends BaseTabView {

	private time_label: eui.Label;
	private scroll: eui.Scroller;
	private itemlist: eui.List;
	private meinv: eui.Image;
	private zi: eui.Image;
	private myRank: eui.Label;
	private myPro: eui.Label;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ActivityZhuanpanRank;
	}
	private get manager(): ActivityLabaManager {
		return DataManager.getInstance().labaManager;
	}
	protected onInit(): void {
		this.scroll.verticalScrollBar.autoVisibility = false;
		this.scroll.verticalScrollBar.visible = false;
		this.itemlist.itemRenderer = ZhuanpanRankItem;
		this.itemlist.itemRendererSkinName = skins.ActivityZhuanpanRankItemSkin;
		this.itemlist.useVirtualLayout = true;
		this.scroll.viewport = this.itemlist;

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACT_LABA_RANK_MESSAGE.toString(), this.onupdateRanks, this);
		GameDispatcher.getInstance().addEventListener('LABA_LOOP_RANK', this.openRankView, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACT_LABA_RANK_MESSAGE.toString(), this.onupdateRanks, this);
		GameDispatcher.getInstance().removeEventListener('LABA_LOOP_RANK', this.openRankView, this);
		this.examineCD(false);
	}
	protected onRefresh(): void {
		this.requestRankInfo();
	}
	private requestRankInfo(): void {
		let rankMsg: Message = new Message(MESSAGE_ID.ACT_LABA_RANK_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(rankMsg);
	}
	public onupdateRanks(): void {
		this.myPro.text = '我的进度：' + this.manager.usedCount;// * this.manager.currModel.cost;
		var rank = this.manager.consume_meRank;
		if (rank == -1) {
			this.myRank.text = '我的排名：未上榜';
		} else {
			this.myRank.text = '我的排名：' + rank;
		}

		let rankJson = JsonModelManager.instance.getModellabapaihangbang();
		let rankModels: Modellabapaihangbang[] = [];
		for (let id in rankJson) {
			rankModels.push(rankJson[id]);
		}
		this.itemlist.dataProvider = new eui.ArrayCollection(rankModels);
	}
	public examineCD(open: boolean): void {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown(): void {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.LEICHONGLABA);
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
		if (this.manager.consumeitem_ranks) {
			for (var i = 3; i < this.manager.consumeitem_ranks.length; i++) {
				var rankData: CrossServerConsumeRank = this.manager.consumeitem_ranks[i];
				var simprankData: TopRankSimple = new TopRankSimple();
				simprankData.rank = rankData.rank;
				simprankData.name = rankData.playerName;
				simprankData.vip = rankData.viplevel;
				simprankData.value = rankData.lotteryNum;
				dataList.push(simprankData);
			}
		}
		var topManager: TopRankManager = DataManager.getInstance().topRankManager;
		topManager.lastRankType = TopRankManager.RANK_SIMPLE_TYPE_LABA;
		topManager.lastDataList = dataList;
		//显示排行榜
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "TopRankActivityPanel");
	}
	//The end
	private log(str) {
		egret.log(str);
	}
}

class ZhuanpanRankItem extends BaseListItem {
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
	protected initializeSize(): void {
		this.width = 600;
		this.height = 126;
	}
	protected onInit(): void {
		if (!this.ranklist.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
			GameCommon.getInstance().addUnderlineStr(this.ranklist);
			this.ranklist.touchEnabled = true;
			this.ranklist.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoopRankView, this);
		}
	}
	protected onUpdate(): void {
		let model: Modellabapaihangbang = this.data;
		let rewards: AwardItem[] = model.rewards;
		this.awards.removeChildren();
		for (let i: number = 0; i < rewards.length; i++) {
			let award: AwardItem = rewards[i];
			let goodsInstace: GoodsInstance = GameCommon.getInstance().createGoodsIntance(award);
			this.awards.addChild(goodsInstace);
		}
		let rankData: CrossServerConsumeRank = DataManager.getInstance().labaManager.consumeitem_ranks[model.rankMin - 1];
		if (model.rankMin > 3) {
			this.topGroup.visible = false;
			this.otherGroup.visible = true;
				this.rank.source = "rankbg_4_png";
				this.rank_num_lab.text = "4-20";
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
				this.value_label.text = `累计次数：${rankData.lotteryNum}`;
			} else {
				this.rank.source = "rankbg_" + model.rankMin + "_png";
				this.rank_num_lab.text = model.rankMin.toString();
				this.topGroup.visible = true;
				this.otherGroup.visible = false;
				this.info_group.visible = false;
				this.info_none.visible = true;
			}
		}
	}
	private onLoopRankView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event('LABA_LOOP_RANK'));
	}
}