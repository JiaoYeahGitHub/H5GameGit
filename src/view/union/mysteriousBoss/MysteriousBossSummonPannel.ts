class MysteriousBossSummonPannel extends BaseTabView {
	private open_time_lab: eui.Label;
	private boss_avatar_grp: eui.Group;
	private summon_btn: eui.Button;
	private loop_award_label: eui.Label;
	private bossAnim: BodyAnimation;
	private boss_cover: eui.Image;
	private reward_grp: eui.Group;
	private time_label: eui.Label;
	private intervalId;

	private tab_now: number = 0;

	public constructor(owner) {
		super(owner);
	}

	protected onSkinName(): void {
		this.skinName = skins.MysteriousBossPannelSkin;
	}

	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}

	protected onRefresh(): void {
		var model: Modelzhaohuanboss = JsonModelManager.instance.getModelzhaohuanboss()[0];

		//动画
		this.bossAnim = GameCommon.getInstance().getMonsterBody(this.bossAnim, model.modelId);
		if (!this.bossAnim.parent) {
			this.boss_avatar_grp.addChild(this.bossAnim);
		}
		//图片
		this.boss_cover.source = model.uncall;
		//预览
		var yulan: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model.yulan);
		this.reward_grp.removeChildren();
		for (let i: number = 0; i < yulan.length; i++) {
			let awarditem: AwardItem = yulan[i];
			let goodsinstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
			this.reward_grp.addChild(goodsinstance);
		}
		if (this.intervalId)
			egret.clearTimeout(this.intervalId);
		//文字下划线
		GameCommon.getInstance().addUnderlineStr(this.loop_award_label);
		let msg: Message = new Message(MESSAGE_ID.MYSTERIOUS_BOSS_INFO);
		msg.setBoolean(false);
		GameCommon.getInstance().sendMsgToServer(msg);
		super.onRefresh();
	}

	private countDown: number;
	private durationTime: number;
	public onUpdateServerInfo() {
		this.countDown = DataManager.getInstance().unionManager.countDown + 1000;
		this.durationTime = DataManager.getInstance().unionManager.durTime + 1000;
		this.updateTimeLabel();
	}

	private updateTimeLabel() {
		var model: Modelzhaohuanboss = JsonModelManager.instance.getModelzhaohuanboss()[0];
		var isEnd = DataManager.getInstance().unionManager.isMSBReward;
		var isBigOld = DataManager.getInstance().unionManager.isOldBig;
		this.countDown = this.countDown - 1000;
		this.durationTime = this.durationTime - 1000;

		this.time_label.textColor = 0x1CFC05;
		this.time_label.text = "";
		if (this.countDown <= 0) {
			this.open_time_lab.text = "神秘boss已经可以召唤";
			this.summon_btn.label = "召 唤"
			this.summon_btn.enabled = isBigOld;
			this.boss_cover.visible = true;
			this.boss_avatar_grp.visible = false;
		} else {
			this.open_time_lab.text = GameCommon.getInstance().getTimeStrForSec1(this.countDown / 1000, 2) + "后可以召唤";
			//召唤后判断是否结束
			if (this.durationTime <= 0) {
				this.bossBEKilled(true);
			} else {
				this.bossBEKilled(isEnd);
			}
			this.intervalId = Tool.callbackTime(this.updateTimeLabel, this, 1000);
		}
	}

	private bossBEKilled(kill: boolean) {
		if (kill) {
			//按钮和遮罩
			this.summon_btn.label = "等待召唤"
			this.summon_btn.enabled = false;
			this.boss_cover.visible = true;
			this.boss_avatar_grp.visible = false;
		} else {
			this.summon_btn.label = "挑 战"
			this.summon_btn.enabled = true;
			this.boss_cover.visible = false;
			this.open_time_lab.text = "正在挑战中：";
			if (this.durationTime < 60000)
				this.time_label.textColor = 0xFF0000;
			this.time_label.text = GameCommon.getInstance().getTimeStrForSec1(this.durationTime / 1000, 2);

			if (!this.boss_avatar_grp.visible) {
				var animPos: egret.Point = new egret.Point(0, 0);
				this.boss_avatar_grp.visible = true;
				GameCommon.getInstance().addAnimation("qihunshengji", animPos, this.boss_avatar_grp);
			}
			if (DataManager.getInstance().dupManager.mysteriousData.rebornLefttime > 0) {
				this.rebornlefttime = DataManager.getInstance().dupManager.mysteriousData.rebornLefttime;
				this.rebornTimeDown();
			}
		}
	}
	protected onRegist(): void {
		this.loop_award_label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jumpToRewards, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MYSTERIOUS_BOSS_INFO.toString(), this.onUpdateServerInfo, this)
		this.summon_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		super.onRegist();;
	}
	protected onRemove(): void {
		this.loop_award_label.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.jumpToRewards, this);
		this.summon_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MYSTERIOUS_BOSS_INFO.toString(), this.onUpdateServerInfo, this)
		super.onRemove();
	}

	private jumpToRewards() {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "MysteriousRewardsPanel");
	}

	//复活倒计时
	private rebornlefttime: number;
	private rebornTimeDown(): void {
		if (this.rebornlefttime == 0) {
			this.summon_btn.label = Language.instance.getText("challenge");
			Tool.removeTimer(this.rebornTimeDown, this, 1000);
		} else {
			this.summon_btn.label = `${Language.instance.getText("reborn")}(${this.rebornlefttime}s)`;
			this.rebornlefttime--;
		}
	}

	//召唤或进入boss
	private touchTime: number;
	private onClick(e: egret.Event): void {
		var btn: eui.Button = e.currentTarget as eui.Button;
		if (btn.label == "召 唤") {
			let msg: Message = new Message(MESSAGE_ID.MYSTERIOUS_BOSS_INFO);
			msg.setBoolean(true);
			GameCommon.getInstance().sendMsgToServer(msg);
		} else if (btn.label == "挑 战") {
			if (this.touchTime > egret.getTimer()) {
				GameCommon.getInstance().addAlert('error_tips_78');
				return;
			}
			this.touchTime = egret.getTimer() + 2000;
			GameFight.getInstance().onEnterMysteriousBossScene();
		} else if (btn.label == "等待召唤") {

		} else {
			if (this.rebornlefttime > 0) {
				GameFight.getInstance().onMyBossFightReborn();
				return;
			}
		}

	}
}