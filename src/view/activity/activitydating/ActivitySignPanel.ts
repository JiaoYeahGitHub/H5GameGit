class ActivitySignPanel extends BaseTabView {
	private label_sign_days: eui.Label;
	private sign_reward_title: eui.Label;
	private reward_item: GoodsInstance;
	private btn_reward: eui.Button;
	private sign_item_group: eui.Group;

	private allItem: SignRewardInstance[];

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ActivitySignSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.allItem = [];
		for (var i = 0; i < 3; i++) {
			var item = new SignRewardInstance();
			this.allItem.push(item);
		}
		this.showpanel();

	}
	protected onRefresh(): void {
		super.onRefresh();
		this.showpanel();
		this.trigger();
	}

	private showpanel() {
		var mgr: NewactivitysManager = DataManager.getInstance().newactivitysManager;
		this.sign_item_group.removeChildren();
		for (var i: number = 0; i < this.allItem.length; i++) {
			var item: SignRewardInstance = this.allItem[i];
			item.onUpdate(i);
			item.onShow(this.sign_item_group);
		}

		this.label_sign_days.text = mgr.loginDay + "天";
		if (mgr.currLoginMode) {
			this.sign_reward_title.text = "累计登陆" + mgr.currLoginMode.days + "天礼包";
			var award: AwardItem = mgr.currLoginMode.rewards[0];
			this.reward_item.onUpdate(award.type, award.id, 0, award.quality, award.num);
			if (mgr.currLoginMode.days <= mgr.loginDay) {
				this.btn_reward.enabled = true;
			} else {
				this.btn_reward.enabled = false;
			}
		} else {
			this.sign_reward_title.text = "已全部领取完毕";
			this.reward_item.visible = false;
			this.btn_reward.visible = false;
		}
	}

	protected onRegist(): void {
		super.onRegist();//添加事件
		this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.LOGON_REWARD_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SIGN_REWARD_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();//移除事件
		for (var i: number = 0; i < this.allItem.length; i++) {
			var item: SignRewardInstance = this.allItem[i];
			item.onDestory();
		}
		this.btn_reward.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.LOGON_REWARD_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.SIGN_REWARD_MESSAGE.toString(), this.onRefresh, this);
	}

	private onReward() {
		let rewardMsg: Message = new Message(MESSAGE_ID.LOGON_REWARD_MESSAGE);
		rewardMsg.setByte(0); //表示类型0
		rewardMsg.setByte(DataManager.getInstance().newactivitysManager.currLoginMode.days);
		GameCommon.getInstance().sendMsgToServer(rewardMsg);
	}

	private get playerData(): Player {
		return DataManager.getInstance().playerManager.player;
	}

}

class SignRewardInstance extends BaseComp {
	private label_reward: eui.Label;
	private awards: eui.Group;
	public btn_reward: eui.Button;

	private idx: number;
	private points: redPoint[] = RedPointManager.createPoint(1);

	public constructor() {
		super();
	}
	protected setSkinName(): void {
		this.skinName = skins.ActivitySignItemSkin;
	}
	protected onInit(): void {
		if (Tool.isNumber(this.idx)) {
			this.refresh();
		}
	}
	protected onRegist(): void {
		this.points[0].register(this.btn_reward, GameDefine.RED_BTN_POS_YELLOW_LITTLE, this, "checkRedPoint");
		this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
	}
	protected onRemove(): void {
		this.btn_reward.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
	}
	public onUpdate(idx: number): void {
		this.idx = idx;
		this.refresh();
	}
	protected refresh() {
		if (!this.isLoaded) return;
		var mgr: NewactivitysManager = DataManager.getInstance().newactivitysManager;
		var qiandaoModel: Modelqiandao = JsonModelManager.instance.getModelqiandao()[mgr.signId];
		qiandaoModel = JsonModelManager.instance.getModelqiandao()[1];
		var rewards: AwardItem[];
		if (this.idx == 0) {
			rewards = GameCommon.getInstance().onParseAwardItemstr(qiandaoModel.free);
		} else if (this.idx == 1) {
			rewards = GameCommon.getInstance().onParseAwardItemstr(qiandaoModel.vip);
		} else {
			rewards = GameCommon.getInstance().onParseAwardItemstr(qiandaoModel.chongzhi);
		}

		this.awards.removeChildren();
		for (var i: number = 0; i < rewards.length; i++) {
			var award: AwardItem = rewards[i];
			var goodsInstace: GoodsInstance = new GoodsInstance();
			// goodsInstace.scaleX = 0.8;
			// goodsInstace.scaleY = 0.8;
			goodsInstace.onUpdate(award.type, award.id, 0, award.quality, award.num);
			this.awards.addChild(goodsInstace);
		}

		this.label_reward.text = Language.instance.getText("sign_desc_" + this.idx);
		if (mgr.signRewards[this.idx] == 1) {
			this.btn_reward.enabled = false;
			this.btn_reward.label = "已领取"
		} else {
			if (this.idx == 1) {
				if (DataManager.getInstance().playerManager.player.viplevel == 0) {
					this.btn_reward.enabled = false;
				} else {
					this.btn_reward.enabled = true;
				}
			} else if (this.idx == 2) {
				if (mgr.payToday) {
					this.btn_reward.enabled = true;
				} else {
					this.btn_reward.enabled = false;
				}
			} else {
				this.btn_reward.enabled = true;
			}
			this.btn_reward.label = "领取奖励";
		}

	}

	private onTouchButton(): void {
		let rewardMsg: Message = new Message(MESSAGE_ID.SIGN_REWARD_MESSAGE);
		rewardMsg.setByte(this.idx);
		GameCommon.getInstance().sendMsgToServer(rewardMsg);
	}

	private checkRedPoint(): boolean {
		return this.btn_reward.enabled == true;
	}
}