class WuYiLoginActivityPanel extends BaseTabView {
	private disc_outside: eui.Group;
	private curSelectBox: eui.Image;
	private btn_getReward: eui.Button;
	private award_grp: eui.Group;
	private loginActCfg: Modeldengluhuodong;
	private timeLab: eui.Label;
	private tabIdx: number = 0;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.WuYiLoginActivitySkin;
	}
	protected onInit(): void {
		super.onInit();
		var manager = DataManager.getInstance().festivalLoginManager
		for (let k in manager.record) {
			this.tabIdx = this.tabIdx + 1;
		}
		this.onRefresh();

	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_getReward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAward, this);
		for (var i: number = 1; i < 4; i++) {
			this['boxIcon' + i].name = i;
			this['boxIcon' + i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
		}
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FESTIVAL_LOGIN_AWARD_RECEIVE.toString(), this.onRefresh, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		for (var i: number = 1; i < 4; i++) {
			this['boxIcon' + i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTab, this);
		}
		this.btn_getReward.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAward, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FESTIVAL_LOGIN_AWARD_RECEIVE.toString(), this.onRefresh, this);
		this.examineCD(false);
	}
	protected onRefresh(): void {
		this.onShowAward(this.tabIdx);

	}
	private onShowAward(idx: number): void {
		var manager = DataManager.getInstance().festivalLoginManager;
		for (var i: number = 1; i < 4; i++) {
			if (i == this.tabIdx) {
				this['boxIcon' + i].source = 'activityboxSelect_png';
				this.curSelectBox.x = i * 180 - 205;
			}
			else {
				this['boxIcon' + i].source = 'activitybox_png'
			}
			var festiData: FestivalLoginbase = manager.record[i];
			if (festiData && festiData.state == 2) {
				this['boxIcon' + i].source = 'activityboxOpen_png';
			}
		}
		this.loginActCfg = JsonModelManager.instance.getModeldengluhuodong()[idx - 1];
		var rewards: AwardItem[] = this.loginActCfg.rewards;
		while (this.award_grp.numChildren > 0) {
			let display = this.award_grp.getChildAt(0);
			this.award_grp.removeChild(display);
		}
		for (var i: number = 0; i < rewards.length; i++) {
			var goodsItem: GoodsInstance = new GoodsInstance();
			var awardItem: AwardItem = rewards[i];
			goodsItem.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num, awardItem.lv);
			this.award_grp.addChild(goodsItem);
		}
		var base: FestivalLoginbase = manager.record[idx];
		if (!base) {
			this.btn_getReward.enabled = false;
			this.btn_getReward.label = "未开启";
		} else {
			this.btn_getReward.enabled = base.state == 1;
			//0--未登录  1--已登录  2--已领取
			switch (base.state) {
				case 0:
					this.btn_getReward.label = "未登录";
					break;
				case 1:
					this.btn_getReward.label = "领取奖励";
					break;
				case 2:
					this.btn_getReward.label = "已领取";
					break;
			}
		}
	}
	private onTab(event: egret.Event): void {
		var name: number = Number(event.target.name);
		if (this.tabIdx == name)
			return;
		this.tabIdx = name;

		this.onShowAward(this.tabIdx);
	}
	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.WUYIACTIVITY);
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
	private onTouchBtnAward(): void {
		let message: Message = new Message(MESSAGE_ID.FESTIVAL_LOGIN_AWARD_RECEIVE);
		message.setByte(this.loginActCfg.days);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private onGetAward(): void {
		let message: Message = new Message(MESSAGE_ID.FESTIVAL_LOGIN_AWARD_RECEIVE);
		message.setByte(this.loginActCfg.days);
		GameCommon.getInstance().sendMsgToServer(message);
	}

}