class ActivitysXianFengPanel extends BaseTabView {
	private scroller: eui.Scroller;
	private itemBox: eui.List;
	private timeLab: eui.Label;
	private stageLab: eui.Label;
	private datas: ActXianfengData[];

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.GuanQiaXianFengPanelSkin;
	}
	protected onInit(): void {
		this.itemBox.itemRenderer = ActivityXianFengitem;
		this.itemBox.itemRendererSkinName = skins.GuanQiaXianFengItemSkin;
		this.itemBox.useVirtualLayout = true;
		this.scroller.viewport = this.itemBox;

		this.datas = [];
		for (var key in JsonModelManager.instance.getModelguanqiaxianfeng()) {
			let data: ActXianfengData = new ActXianfengData(parseInt(key));
			this.datas.push(data);
		}

		super.onInit();
		this.onRefreshList();
		this.onRefresh();
	}

	protected onRefresh(): void {
		this.datas.sort(function (a, b): number {
			return a.sort - b.sort;
		});
		this.itemBox.dataProvider = new eui.ArrayCollection(this.datas);

		this.stageLab.text = GameFight.getInstance().yewai_waveIndex + "";
	}
	private onRefreshList() {
		for (let i: number = 0; i < this.itemBox.numChildren; i++) {
			let item: ActivityXianFengitem = this.itemBox.getChildAt(i) as ActivityXianFengitem;
			item.data = item.data;
		}
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_XIANFENG.toString(), this.onRefreshList, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_XIANFENG.toString(), this.onRefreshList, this);
		this.examineCD(false);
	}
	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.GUANQIAXIANFENG);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
			// this.owner.onTimeOut();
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number) {
		this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
}
class ActivityXianFengitem extends BaseListItem {
	private item: GoodsInstance;
	private buyBtn: eui.Button;
	private nameLab: eui.Label;

	// private _data: Modelguanqiaxianfeng;
	private point: redPoint = new redPoint();
	public constructor() {
		super();
		// this.skinName = skins.GuanQiaXianFengItemSkin;
	}
	protected onInit(): void {
		this.buyBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		this.point.register(this.buyBtn, GameDefine.RED_BTN_POS_YELLOW_LITTLE, this, "checkRedPoint");
	}
	protected onUpdate(): void {
		let data: ActXianfengData = this.data as ActXianfengData;

		let award: AwardItem = data.model.rewards[0];
		this.item.onUpdate(award.type, award.id, 0, award.quality, award.num, award.lv);
		if (data.received) {
			this.buyBtn.enabled = false;
			this.buyBtn.label = "已领取";
		} else if (data.model.mapId > GameFight.getInstance().yewai_waveIndex) {
			this.buyBtn.enabled = false;
			this.buyBtn.label = "未达成";
		} else {
			this.buyBtn.enabled = true;
			this.buyBtn.label = "领取";
		}

		this.nameLab.text = "达到" + data.model.mapId + "关";
		this.point.checkPoint();
	}

	private onTouchBtn() {
		var message: Message = new Message(MESSAGE_ID.ACTIVITY_XIANFENG);
		message.setShort(this.data.id);
		GameCommon.getInstance().sendMsgToServer(message);
	}

	public checkRedPoint(): boolean {
		return this.buyBtn.enabled;
	}
}
class ActXianfengData {
	public id: number;
	public constructor(id: number) {
		this.id = id;
	}
	public get model(): Modelguanqiaxianfeng {
		return JsonModelManager.instance.getModelguanqiaxianfeng()[this.id];
	}
	public get received(): boolean {
		return DataManager.getInstance().newactivitysManager.xianfengReward[this.id - 1] == 1;
	}
	public get sort(): number {
		var sortNum: number = Tool.toInt(this.id);
		if (this.received) {
			sortNum += 100;
		}
		return sortNum;
	}
}