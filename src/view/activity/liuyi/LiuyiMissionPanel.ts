class LiuyiMissionPanel extends BaseTabView {
	private time_label: eui.Label;
	private scroll: eui.Scroller;
	private itemlist: eui.List;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.LiuyiMissionPanel;
	}
	private get manager(): FestivalWuYiManager {
		return DataManager.getInstance().festivalWuYiManager;
	}
	protected onInit(): void {
		this.scroll.verticalScrollBar.autoVisibility = false;
		this.scroll.verticalScrollBar.visible = false;
		this.itemlist.itemRenderer = LiuyiMissionItem;
		this.itemlist.itemRendererSkinName = skins.HefuMissionItemSkin;
		this.itemlist.useVirtualLayout = true;
		this.scroll.viewport = this.itemlist;

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FESTIVAL_MISSION_ACT_UPDATE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FESTIVAL_MISSION_ACT_REWARD.toString(), this.onRefresh, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FESTIVAL_MISSION_ACT_UPDATE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FESTIVAL_MISSION_ACT_REWARD.toString(), this.onRefresh, this);
		this.examineCD(false);
	}
	protected onRefresh(): void {
		let missionAry: TaskChainData[] = [];
		for (let missionID in this.manager.liuyiMission) {
			missionAry.push(this.manager.liuyiMission[missionID]);
		}
		missionAry.sort(function (a, b): number {
			if (a.count == 1) {
				return 1;
			}
			return a.count - b.count;
		});
		this.itemlist.dataProvider = new eui.ArrayCollection(missionAry);
	}
	public examineCD(open: boolean): void {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown(): void {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.LIUYI_MISSION);
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
	//The end
}
//任务Item
class LiuyiMissionItem extends BaseListItem {
	private reward_item: GoodsInstance;
	private mission_probar: eui.ProgressBar;
	private mission_desc_lab: eui.Label;
	private btn_reward: eui.Button;
	private task_icon: eui.Image;

	public constructor() {
		super();
	}
	protected initializeSize(): void {
		this.width = 600;
		this.height = 166;
	}
	protected onInit(): void {
		if (!this.btn_reward.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
			this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
		}
	}
	protected onUpdate(): void {
		let missionData: TaskChainData = this.data;
		let model: Modeltaskhuodong = JsonModelManager.instance.getModeltaskhuodong()[missionData.taskId];
		this.mission_desc_lab.text = model.name;
		this.task_icon.source = model.icon;
		this.mission_probar.maximum = model.count;
		this.mission_probar.value = missionData.progress;
		let _awardItem: AwardItem = model.rewards[0];
		this.reward_item.onUpdate(_awardItem.type, _awardItem.id, 0, null, _awardItem.num);
		switch (missionData.count) {
			case 0:
				this.btn_reward.enabled = true;
				this.btn_reward.label = Language.instance.getText('goto');
				break;
			case 1:
				this.btn_reward.enabled = true;
				this.btn_reward.label = Language.instance.getText('lingqu2');
				break;
			case 2:
				this.btn_reward.enabled = false;
				this.btn_reward.label = Language.instance.getText('mailReceived');
				break;
		}
	}
	private onReward(): void {
		let missionData: TaskChainData = this.data;
		switch (missionData.count) {
			case 0:
				let model: Modeltaskhuodong = JsonModelManager.instance.getModeltaskhuodong()[this.data.taskId];
				if (model.eventType == 36) {
					let param: ChatPanelParam = new ChatPanelParam(CHANNEL.CURRENT, null);
					let shortword: string = ChatDefine.ACT_DEFAULT_SHORTCHAT[Math.floor(Math.random() * ChatDefine.ACT_DEFAULT_SHORTCHAT.length)];
					param.content = Language.instance.getText(shortword);
					GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ChatMainPanel", param));
				} else {
					GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), model.goType);
				}
				break;
			case 1:
				let rewardMsg: Message = new Message(MESSAGE_ID.FESTIVAL_MISSION_ACT_REWARD);
				rewardMsg.setShort(this.data.taskId);
				GameCommon.getInstance().sendMsgToServer(rewardMsg);
				break;
		}
	}
	//The end
}
