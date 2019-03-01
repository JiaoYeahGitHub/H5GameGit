class ActivityCoatardPanel extends BaseTabView {

	private btn_goto: eui.Button;
	private coatard_scroller: eui.Scroller;
	private coatard_items: eui.Group;
	private label_cur_coatard: eui.Label;

	private allItem: ActivityCoatardItem[];
	protected points: redPoint[];
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ActivityCoatardSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.coatard_scroller.scrollPolicyH = "false";
		this.allItem = [];
		var models: Modelzhuanshengrewards[] = JsonModelManager.instance.getModelzhuanshengrewards();
		for (var key in models) {
			if (models[key].rewards && models[key].rewards.length > 0) {
				var item = new ActivityCoatardItem(models[key]);
				this.allItem.push(item);
			}
		}
		this.points = RedPointManager.createPoint(this.allItem.length);
		for (var i = 0; i < this.allItem.length; i++) {
			this.points[i].register(this.allItem[i].btn_reward, GameDefine.RED_BTN_POS_YELLOW_LITTLE, this.allItem[i], "checkRedPoint");
		}
		this.showpanel();
	}
	protected onRefresh(): void {
		super.onRefresh();
		this.showpanel();
		this.trigger();
	}

	private showpanel() {
		for (var i: number = 0; i < this.allItem.length; i++) {
			this.allItem[i].updateItem();
		}
		this.allItem.sort(function (a, b): number {
			return a.sort - b.sort;
		});

		this.coatard_items.removeChildren();
		for (var i: number = 0; i < this.allItem.length; i++) {
			if (!this.allItem[i].getRewardStatus()) {
				this.coatard_items.addChild(this.allItem[i]);
			}
		}
		this.label_cur_coatard.text = this.playerData.coatardLv + "转";
	}

	protected onRegist(): void {
		super.onRegist();//添加事件
		// for (var i: number = 0; i < this.allItem.length; i++) {
		// 	var item: ActivityCoatardItem = this.allItem[i];
		// 	item.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, item.onTouchButton, item);
		// }
		this.btn_goto.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoto, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_COATARD_REWARD.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();//移除事件
		// for (var i: number = 0; i < this.allItem.length; i++) {
		// 	var item: ActivityCoatardItem = this.allItem[i];
		// 	item.btn_reward.removeEventListener(egret.TouchEvent.TOUCH_TAP, item.onTouchButton, item);
		// }
		this.btn_goto.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoto, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_COATARD_REWARD.toString(), this.onRefresh, this);
	}

	private onGoto() {
		//判定是否开启
		if (!FunDefine.onIsLockandErrorHint(FUN_TYPE.FUN_JINGJIE)) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_JINGJIE);
		}
	}

	private get playerData(): Player {
		return DataManager.getInstance().playerManager.player;
	}

}

class ActivityCoatardItem extends eui.ItemRenderer {
	private name_label: eui.Label;
	private awards: eui.Group;
	public btn_reward: eui.Button;

	private model: Modelzhuanshengrewards;
	private received = false;
	private isLoadingFinish: boolean;
	public constructor(model: Modelzhuanshengrewards) {
		super();
		this.model = model;
		this.isLoadingFinish = false;
		this.once(egret.Event.COMPLETE, this.onInit, this);
		this.skinName = skins.ActivityCoatardItemSkin;
	}
	private onInit(): void {
		this.isLoadingFinish = true;
		this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
		this.updateItem();
	}

	public updateItem(): void {
		if (!this.isLoadingFinish) {
			return;
		}
		let curCoatardLv: number = DataManager.getInstance().playerManager.player.coatardLv;
		this.awards.removeChildren();
		for (var i: number = 0; i < this.model.rewards.length; i++) {
			var award: AwardItem = this.model.rewards[i];
			var goodsInstace: GoodsInstance = GameCommon.getInstance().createGoodsIntance(award);
			this.awards.addChild(goodsInstace);
		}
		this.name_label.text = this.model.id + "转礼包";
		var reward = DataManager.getInstance().playerManager.getCoatardRewardStatus(this.model.id - 1);
		if (reward) {
			this.btn_reward.label = "已领取";
			this.btn_reward.enabled = false;
			this.received = true;
		} else if (this.model.id > curCoatardLv) {
			this.btn_reward.label = "未完成";
			this.btn_reward.enabled = false;
			this.received = false;
		} else {
			this.btn_reward.label = "领取";
			this.btn_reward.enabled = true;
			this.received = false;
		}
	}

	public onTouchButton(): void {
		if (!this.isLoadingFinish) {
			return;
		}
		let rewardMsg: Message = new Message(MESSAGE_ID.ACTIVITY_COATARD_REWARD);
		rewardMsg.setByte(this.model.id);
		GameCommon.getInstance().sendMsgToServer(rewardMsg);
	}

	public get sort(): number {
		if (!this.isLoadingFinish) {
			return;
		}
		var sortNum: number = Tool.toInt(this.model.id);
		if (this.received) {
			sortNum += 100;
		}
		return 0;
	}

	public checkRedPoint() {
		if (!this.isLoadingFinish) {
			return false;
		}
		return this.received == false && this.btn_reward.enabled == true;
	}

	public getRewardStatus(): boolean {
		return DataManager.getInstance().playerManager.getCoatardRewardStatus(this.model.id - 1);
	}
}