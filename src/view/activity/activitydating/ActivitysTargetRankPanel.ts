class ActivitysTargetRankPanel extends BaseTabView {
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
		this.itemlist.itemRenderer = ShenQiTreasureRank;
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
		var message: Message = new Message(MESSAGE_ID.ARTIFACT_ROLL_RANK_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	protected onRegist(): void {
		super.onRegist();
		GameDispatcher.getInstance().addEventListener('LIUYI_ZHUANPAN_LOOP_RANK', this.openRankView, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARTIFACT_ROLL_RANK_MESSAGE.toString(), this.onupdateRanks, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARTIFACT_ROLL_RANK_MESSAGE.toString(), this.onupdateRanks, this);
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
	}
	public onupdateRanks(): void {
		let ranknums: number[] = [];
		for (let i: number = 0; i < ActivityDefine.LIUYI_ZHUANPAN_AWARD.length; i++) {
			ranknums[i] = i + 1;
		}
		this.itemlist.dataProvider = new eui.ArrayCollection(ranknums);
		var model: Modelshenqichouqian = DataManager.getInstance().shenqiZhuanPanManager.zhuanpanModel;
		var i: number = 1;
		//这里不写通用逻辑了，写单独的吧
		var round = DataManager.getInstance().shenqiZhuanPanManager.zhuanpanRound;
		this.setDayNum(round);
		this.target_title.source ='dianfengbangzi_'+round +'_png';
		var str = '1、活动期间抽取当日神签次数达到40次可上榜\n2、排行榜不同名次会有超额奖励!';
		this.label_desc.text = str;
		// this.myValue.text = DataManager.getInstance().newactivitysManager.dabiao_value + "";
	}
	

	private setDayNum(n: number) {
		this.dayNum.text = n.toString();
	}
	private get playerData(): Player {
		return DataManager.getInstance().playerManager.player;
	}

}

class ShenQiTreasureRank extends BaseListItem {
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
		this.height = 166;
	}
	protected onInit(): void {
		if (!this.otherGroup.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
			this.otherGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoopRankView, this);
		}
	}
	protected onUpdate(): void {
		let rank: number = this.data;
		let model: Modelshenqichouqian = DataManager.getInstance().shenqiZhuanPanManager.zhuanpanModel;
		let awardkey: string = ActivityDefine.LIUYI_ZHUANPAN_AWARD[rank - 1];
		if (!awardkey)
			return;
		let rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model[awardkey]);
		this.awards.removeChildren();
		for (let i: number = 0; i < rewards.length; i++) {
			let award: AwardItem = rewards[i];
			let goodsInstace: GoodsInstance = GameCommon.getInstance().createGoodsIntance(award);
			goodsInstace.scaleX = 0.7;
			goodsInstace.scaleY = 0.7;
			this.awards.addChild(goodsInstace);
		}
		let rankData: HefuActRank = DataManager.getInstance().shenqiZhuanPanManager.zhuanpanRanks[rank - 1];
		if (rank > 3) {
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
				this.value_label.text = `今日累计${rankData.lotteryNum}次`;
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