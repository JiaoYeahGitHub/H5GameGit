class ActivityCrossPayRankPanel extends BaseTabView {
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
		this.skinName = skins.ActCrossPayRankPanelSkin;
	}
	private get manager(): ActivityTuangouManager {
		return DataManager.getInstance().tuangouActManager;
	}
	protected onInit(): void {
		this.scroll.verticalScrollBar.autoVisibility = false;
		this.scroll.verticalScrollBar.visible = false;
		this.itemlist.itemRenderer = CrossPayRankItem;
		this.itemlist.itemRendererSkinName = skins.CrossPayRankItemSkin;
		this.itemlist.useVirtualLayout = true;
		this.scroll.viewport = this.itemlist;

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACT_CROSS_PAYRANK.toString(), this.onupdateRanks, this);
		GameDispatcher.getInstance().addEventListener('CROSS_PAY_LOOP_RANK', this.openRankView, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACT_CROSS_PAYRANK.toString(), this.onupdateRanks, this);
		GameDispatcher.getInstance().removeEventListener('CROSS_PAY_LOOP_RANK', this.openRankView, this);
		this.examineCD(false);
	}
	protected onRefresh(): void {
		this.requestRankInfo();
	}
	private requestRankInfo(): void {
		let rankMsg: Message = new Message(MESSAGE_ID.ACT_CROSS_PAYRANK);
		GameCommon.getInstance().sendMsgToServer(rankMsg);
	}
	public onupdateRanks(): void {
		this.myPro.text = '我的筹金：' + this.manager.crossPayRankMoney;
		if (this.manager.crossPayMyRank > 0) {
			this.myRank.text = '我的排名：' + this.manager.crossPayMyRank;
		} else {
			this.myRank.text = '我的排名：未上榜';
		}

		let models: Modelkuafuchongzhi[] = [];
		let jsonkuafuchongzhi = JsonModelManager.instance.getModelkuafuchongzhi();
		for (let id in jsonkuafuchongzhi) {
			let model: Modelkuafuchongzhi = jsonkuafuchongzhi[id];
			models.push(model);
		}
		this.itemlist.dataProvider = new eui.ArrayCollection(models);
	}
	public examineCD(open: boolean): void {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown(): void {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.ZHIZUN_XIANGOU);
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
		if (this.manager.crossPayRanks) {
			for (var i = 3; i < this.manager.crossPayRanks.length; i++) {
				var rankData: CrossServerPayRank = this.manager.crossPayRanks[i];
				var simprankData: TopRankSimple = new TopRankSimple();
				simprankData.rank = rankData.rank;
				simprankData.name = rankData.playerName;
				simprankData.vip = rankData.viplevel;
				simprankData.value = rankData.payNum;
				dataList.push(simprankData);
			}
		}
		var topManager: TopRankManager = DataManager.getInstance().topRankManager;
		topManager.lastRankType = TopRankManager.RANK_SIMPLE_TYPE_CROSSPAY;
		topManager.lastDataList = dataList;
		//显示排行榜
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "TopRankActivityPanel");
	}
	//The end
}
//跨服排行的列表
class CrossPayRankItem extends BaseListItem {
	private topGroup: eui.Group;
	private rank: eui.Image;
	private rank_num_lab: eui.BitmapLabel;
	private name_label: eui.Label;
	private vip_image: eui.Image;
	private value_label: eui.Label;
	private info_none: eui.Label;
	private info_group: eui.Group;
	private otherGroup: eui.Group;
	private ranklist: eui.Label;
	private awards: eui.Group;

	public constructor() {
		super();
	}
	protected initializeSize(): void {
		this.width = 600;
		this.height = 166;
	}
	protected onInit(): void {
		if (!this.ranklist.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
			GameCommon.getInstance().addUnderlineStr(this.ranklist);
			this.ranklist.touchEnabled = true;
			this.ranklist.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoopRankView, this);
		}
	}
	protected onUpdate(): void {
		let model: Modelkuafuxiaohao = this.data;
		let rewards: AwardItem[] = model.rewards;
		this.awards.removeChildren();
		for (let i: number = 0; i < rewards.length; i++) {
			let award: AwardItem = rewards[i];
			let goodsInstace: GoodsInstance = GameCommon.getInstance().createGoodsIntance(award);
			this.awards.addChild(goodsInstace);
		}
		let rankData: CrossServerPayRank = DataManager.getInstance().tuangouActManager.crossPayRanks[model.id - 1];
		if (model.rankMax > 3) {
			this.topGroup.visible = false;
			this.otherGroup.visible = true;
			this.rank.source = "rankbg_4_png";
			if (model.rankMax <= 20) {
				this.rank_num_lab.text = "4-20";
			} else {
				this.rank_num_lab.text = "21-50";
			}
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
				this.value_label.text = `筹金${rankData.payNum}`;
			} else {
				this.rank.source = "rankbg_" + model.rankMax + "_png";
				this.rank_num_lab.text = model.rankMax.toString();
				this.topGroup.visible = true;
				this.otherGroup.visible = false;
				this.info_group.visible = false;
				this.info_none.visible = true;
			}
		}
	}
	private onLoopRankView(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event('CROSS_PAY_LOOP_RANK'));
	}
	//The end
}