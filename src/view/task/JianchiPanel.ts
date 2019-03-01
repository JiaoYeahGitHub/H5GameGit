class JianchiPanel extends BaseTabView {
	private taskdailyItems: JianchiTaskItem[];
	private showAttrMax: number = 3;
	private showRewardMax: number = 3;
	private showJianImgMax: number = 9;
	private goodsRewards: GoodsInstance[];
	private jianchi_tasklist: eui.Scroller;
	private jianchi_taskgroup: eui.Group;
	private jianchi_exp_pro: eui.ProgressBar;
	private powerbar: PowerBar;
	// private currLevel_label: eui.Label;
	// private awarditem_group: eui.Group;
	private btn_upgrade: eui.Button;
	private levelup_redpoint: eui.Image;
	// private currLayer: eui.Group;
	// private nextLayer: eui.Group;
	// private animLayer: eui.Group;
	private animPos: egret.Point = new egret.Point(344, 440);
	// private exp_progress_label: eui.Label;
	private imgBoxs: eui.Image[];
	private lbScores: eui.BitmapLabel[];
	protected points: redPoint[] = RedPointManager.createPoint(1);
	public constructor(owner) {
		super(owner);
		this.taskdailyItems = [];
	}
	protected onSkinName(): void {
		this.skinName = skins.JianchiPanelSkin;
	}
	protected onInit(): void {
		// this.jianchi_exp_pro.labelDisplay.visible = false;
		super.onInit();
		this.jianchi_tasklist.verticalScrollBar.autoVisibility = true;
		this.jianchi_tasklist.verticalScrollBar.visible = true;

		this.points[0].register(this.btn_upgrade, GameDefine.RED_BTN_POS_YELLOW_LITTLE, DataManager.getInstance().tianGongManager, "getTabJianChiRedShow");

		this.imgBoxs = [];
		this.lbScores = [];
		for (let i = 0; i < 4; ++i) {
			this.imgBoxs[i] = this["imgBox" + i];
			this.imgBoxs[i].name = (i + 1).toString();
			this.imgBoxs[i].touchEnabled = true;
			this.lbScores[i] = this["lbScore" + i];
			var jcmodel: Modeljianchi = JsonModelManager.instance.getModeljianchi()[i + 1];
			this.lbScores[i].text = jcmodel.exp.toString();
		}

		var taskdailyDict = JsonModelManager.instance.getModeltaskDaily();
		for (var id in taskdailyDict) {
			var taskdailymodel: ModeltaskDaily = taskdailyDict[id];
			var taskdailyitem: JianchiTaskItem = new JianchiTaskItem(taskdailymodel);
			this.taskdailyItems.push(taskdailyitem);
			this.jianchi_taskgroup.addChild(taskdailyitem);
		}
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		for (let i = 0; i < 4; ++i) {
			this.imgBoxs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBox, this);
		}
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TASK_DAILY_UPDATE_MESSAGE.toString(), this.onUpdateTaskDaily, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.JIANCHI_INFO_UPDATE_MESSAGE.toString(), this.onUpdateBack, this);
		this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendJianchiUpMsg, this);
	}
	public onRemove(): void {
		super.onRemove();
		for (let i = 0; i < 4; ++i) {
			this.imgBoxs[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBox, this);
		}
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TASK_DAILY_UPDATE_MESSAGE.toString(), this.onUpdateTaskDaily, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.JIANCHI_INFO_UPDATE_MESSAGE.toString(), this.onUpdateBack, this);
		this.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendJianchiUpMsg, this);
	}
	protected onRefresh(): void {
		super.onRefresh();
		this.onUpdateTaskDaily();
		this.onUpdateJianchi();
	}
	private onUpdateBack(): void {
		// GameCommon.getInstance().addAnimation("shengjichenggong", this.animPos, this.animLayer);
		this.onUpdateJianchi();
	}
	private onUpdateTaskDaily(): void {
		this.jianchi_taskgroup.removeChildren();
		for (var i: number = 0; i < this.taskdailyItems.length; i++) {
			var taskdailyitem: JianchiTaskItem = this.taskdailyItems[i];
			taskdailyitem.onUpdateData();
		}
		this.taskdailyItems.sort(function (a, b) {
			return a.model.sortIdx - b.model.sortIdx;
		});
		for (var i: number = 0; i < this.taskdailyItems.length; i++) {
			var taskdailyitem: JianchiTaskItem = this.taskdailyItems[i];
			this.jianchi_taskgroup.addChild(taskdailyitem);
		}
	}
	private setBoxState(model: Modeljianchi, idx: number, rewId: number, exp: number) {
		if (rewId > idx) {// 已领取
			this.imgBoxs[idx].source = "jianchi_box_2_png";
		} else {
			if (exp >= model.exp) {// 可领取
				this.imgBoxs[idx].source = "jianchi_box_1_png";
			} else {// 不可领取
				this.imgBoxs[idx].source = "jianchi_box_0_png";
			}
		}
	}
	private onUpdateJianchi(): void {
		var player: Player = DataManager.getInstance().playerManager.player;
		var exp = player.jianchiExp;
		var rewId = player.jianchiLevel;
		var maxExp: number = 0;
		for (let i = 0; i < 4; ++i) {
			var jianchiModel: Modeljianchi = JsonModelManager.instance.getModeljianchi()[i + 1];
			this.setBoxState(jianchiModel, i, rewId, exp);
			if (jianchiModel.exp > maxExp) {
				maxExp = jianchiModel.exp;
			}
		}
		this.jianchi_exp_pro.maximum = maxExp;
		this.jianchi_exp_pro.value = Math.min(exp, maxExp);
	}
	private onTouchBox(event: egret.TouchEvent) {
		let id = event.currentTarget.name;
		var jianchiModel: Modeljianchi = JsonModelManager.instance.getModeljianchi()[id];
		let reward: AwardItem = jianchiModel.rewards[0];
		var base = new ThingBase(reward.type);
		base.onupdate(reward.id, reward.quality, reward.num);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ItemIntroducebar", new IntroduceBarParam(INTRODUCE_TYPE.IMG, reward.type, base)));
	}
	private onSendJianchiUpMsg(): void {
		if (DataManager.getInstance().tianGongManager.getTabJianChiRedShow()) {
			var jianchiUpMsg: Message = new Message(MESSAGE_ID.JIANCHI_LEVELUP_MESSEAGE);
			GameCommon.getInstance().sendMsgToServer(jianchiUpMsg);
		} else {
			GameCommon.getInstance().addAlert("error_tips_86");
		}
	}
	//The end
}
class JianchiTaskItem extends eui.Component {
	private task_name_label: eui.Label;
	private task_count_label: eui.Label;
	private task_award_label: eui.Label;
	private task_goto: eui.Button;
	private owner: BaseWindowPanel;
	private bar: eui.ProgressBar;
	private item: GoodsInstance;
	public model: ModeltaskDaily;
	private isLoadCom: boolean;
	public constructor(modelTaskdaily: ModeltaskDaily) {
		super();
		this.model = modelTaskdaily;
		this.isLoadCom = false;
		this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
		this.skinName = skins.JianchiTaskItemSkin;
	}
	private onLoadComplete(): void {
		this.isLoadCom = true;
		this.task_name_label.text = this.model.name;
		this.task_award_label.text = "活跃 +" + this.model.score;
		this.onUpdateData();
	}
	public onUpdateData(): void {
		if (this.isLoadCom) {
			this.item.updateByAward(this.model.rewards[0]);
			this.item.currentState = "notName";
			this.model.dailytaskPro = Math.min(this.model.dailytaskPro, this.model.count);
			this.task_count_label.text = this.model.dailytaskPro + "/" + this.model.count;
			this.bar.maximum = this.model.count;
			this.bar.value = this.model.dailytaskPro;
			if (this.model.dailytaskPro >= this.model.count) {
				this.task_goto.labelDisplay.text = "今日已完成";
				this.task_goto.enabled = false;
				this.task_goto.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGotoHandler, this);
				this.model.sortIdx = this.model.id + 10000;
			} else {
				this.task_goto.labelDisplay.text = "前 往";
				this.task_goto.enabled = true;
				this.task_goto.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGotoHandler, this);
				this.model.sortIdx = this.model.id;
			}
		}
	}
	private onGotoHandler(event: egret.Event): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), this.model.goType);
	}
	//The end
}