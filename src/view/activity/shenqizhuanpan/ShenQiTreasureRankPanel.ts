class ShenQiTreasureRankPanel extends BaseTabView {
	private time_label: eui.Label;
	private scroll: eui.Scroller;
	private itemlist: eui.List;
	private meinv: eui.Image;
	private zi: eui.Image;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.HefuRankPanelSkin;
	}
	private get manager(): ShenQiZhuanPanManager {
		return DataManager.getInstance().shenqiZhuanPanManager;
	}
	protected onInit(): void {
		this.scroll.verticalScrollBar.autoVisibility = false;
		this.scroll.verticalScrollBar.visible = false;
		this.itemlist.itemRenderer = HefuActRankItem;
		this.itemlist.itemRendererSkinName = skins.LiuyiTreasureRankItemSkin;
		this.itemlist.percentWidth = 600;
		this.itemlist.percentHeight = 166;
		this.itemlist.useVirtualLayout = true;
		this.scroll.viewport = this.itemlist;
		// this.meinv.source = 'hefumeinv'+this.manager.zhuanpanModel.id+'_png';
		// this.zi.source = 'hefuZiti'+this.manager.zhuanpanModel.id+'_png';
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARTIFACT_ROLL_RANK_MESSAGE.toString(), this.onupdateRanks, this);
		GameDispatcher.getInstance().addEventListener('LIUYI_ZHUANPAN_LOOP_RANK', this.openRankView, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARTIFACT_ROLL_RANK_MESSAGE.toString(), this.onupdateRanks, this);
		GameDispatcher.getInstance().removeEventListener('LIUYI_ZHUANPAN_LOOP_RANK', this.openRankView, this);
		this.examineCD(false);
	}
	protected onRefresh(): void {
		this.requestRankInfo();
	}
	private requestRankInfo(): void {
		let rankMsg: Message = new Message(MESSAGE_ID.ARTIFACT_ROLL_RANK_MESSAGE);
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
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.ACT_SHENQICHOUQIAN);
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
				var rankData: HefuActRank = this.manager.zhuanpanRanks[i];
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