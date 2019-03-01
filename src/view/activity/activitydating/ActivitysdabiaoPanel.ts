class ActivitysdabiaoPanel extends BaseTabView {
	private label_day: eui.Group;
	private dayNum: eui.BitmapLabel;
	private target_title: eui.Image;
	private timeLab: eui.Label;
	private label_desc: eui.Label;
	private myRank: eui.Label;
	private myValue: eui.Label;
	private goto: eui.Label;
	private itemlist: eui.List;
	private scroll: eui.Scroller;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.DabiaoPanelSkin;
	}
	protected onInit(): void {
		super.onInit();

		this.scroll.verticalScrollBar.autoVisibility = false;
		this.scroll.verticalScrollBar.visible = false;
		this.itemlist.itemRenderer = HefuActRankItem;
		this.itemlist.itemRendererSkinName = skins.LiuyiTreasureRankItemSkin;
		this.itemlist.percentWidth = 600;
		this.itemlist.percentHeight = 166;
		this.itemlist.useVirtualLayout = true;
		this.scroll.viewport = this.itemlist;

		this.goto.visible = false;
		this.onRefresh();
	}
	private get manager(): ShenQiZhuanPanManager {
		return DataManager.getInstance().shenqiZhuanPanManager;
	}
	protected onRefresh(): void {
		var message: Message = new Message(MESSAGE_ID.DABIAOPAIHANG_DATE_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
		this.showpanel();
	}

	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.DABIAOPAIHANG_DATE_MESSAGE.toString(), this.showpanel, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.DABIAOJIANGLI_BUY_MESSAGE.toString(), this.lingqvfanhui, this);
		GameDispatcher.getInstance().addEventListener('LIUYI_ZHUANPAN_LOOP_RANK', this.openRankView, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARTIFACT_ROLL_RANK_MESSAGE.toString(), this.onupdateRanks, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARTIFACT_ROLL_RANK_MESSAGE.toString(), this.onupdateRanks, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.DABIAOPAIHANG_DATE_MESSAGE.toString(), this.showpanel, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.DABIAOJIANGLI_BUY_MESSAGE.toString(), this.lingqvfanhui, this);
		GameDispatcher.getInstance().removeEventListener('LIUYI_ZHUANPAN_LOOP_RANK', this.openRankView, this);
		this.examineCD(false);
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
	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.PERSONAL_GOAL);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number) {
		this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 2);
	}

	private lingqvfanhui() {
		// DataManager.getInstance().newactivitysManager.refreshDabiaoData();
		this.showpanel();
	}
	public onupdateRanks(): void {
		let ranknums: number[] = [];
		for (let i: number = 0; i < ActivityDefine.LIUYI_ZHUANPAN_AWARD.length; i++) {
			ranknums[i] = i + 1;
		}
		this.itemlist.dataProvider = new eui.ArrayCollection(ranknums);
	}
	private showpanel() {
		var model: Modeldabiaohuodong = DataManager.getInstance().newactivitysManager.personal_dabiao_model;
		var i: number = 1;
		//这里不写通用逻辑了，写单独的吧
		this.setDayNum(model.id-1);
		this.target_title.source ='dianfengbangzi_'+ model.round+'_png';
		this.label_desc.text = model.desc;
		var rank = DataManager.getInstance().newactivitysManager.getMyRank(this.playerData.id);
		if (rank == -1) {
			this.myRank.text = "未上榜";
		} else {
			this.myRank.text = rank + "";
		}

		this.myValue.text = DataManager.getInstance().newactivitysManager.dabiao_value + "";
	}

	private setDayNum(n: number) {
		this.dayNum.text = n.toString();
	}
	private get playerData(): Player {
		return DataManager.getInstance().playerManager.player;
	}

}
