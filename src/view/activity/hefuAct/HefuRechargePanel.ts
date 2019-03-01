class HefuRechargePanel extends BaseTabView {
	private target_title: eui.Image;
	private timeLab: eui.Label;
	private chongji_zi: eui.Image;

	private btn_pay: eui.Button;
	private progress: eui.ProgressBar;
	private rewards: eui.Group;
	private frist_item: GoodsInstance;
	private avatar_grp: eui.Group;
	private desc:eui.Label;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.HefuRechargeSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.progress.minimum = 0;
		this.onRefresh();
	}

	protected onRefresh(): void {
		this.progress.maximum = 1000;
		this.progress.value = DataManager.getInstance().hefuActManager.chargeMoneyNum;
		this.desc.text = '当日累充达到1000元免费赠送';
		if (DataManager.getInstance().hefuActManager.chargeMoneyNum>=1000) {
				this.btn_pay.label = "已达成";
				this.btn_pay.enabled = false;
		}
		this.showpanel();
	}

	protected onRegist(): void {
		super.onRegist();
		this.btn_pay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPay, this)
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_pay.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPay, this)
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
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
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.HEFU_LEGEND);
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

	private onTouchPay() {
		if (this.btn_pay.label == "已达成")
			return;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
	}

	private showpanel() {
		var model:Modelhefuleichong = JsonModelManager.instance.getModelhefuleichong()[DataManager.getInstance().hefuActManager.chongbangLiBaoId];
		this.target_title.source = model.imgtitle;
		var awards: AwardItem[];
		awards = GameCommon.getInstance().onParseAwardItemstr(model.rewards1000);
		var award: AwardItem = awards[0];
		this.frist_item.onUpdate(award.type, award.id, 0, award.quality, award.num);
		this.rewards.removeChildren();
		for (var i: number = 1; i < awards.length; i++) {
			award = awards[i];
			var goodsInstace: GoodsInstance = new GoodsInstance();
			goodsInstace.onUpdate(award.type, award.id, 0, award.quality, award.num);
			this.rewards.addChild(goodsInstace);
		}
		this.avatar_grp.removeChildren();
		// if (model.type >= 10) {
		// 	this.chongji_zi.source = "chongji_recharge_z3_png";
		// } else {
		// 	this.chongji_zi.source = "chongji_recharge_z1_png";
		// }
		this.updateAvatarAnim(model.waixing);

	}

	private get playerData(): Player {
		return DataManager.getInstance().playerManager.player;
	}

	//更新外形展示
	private updateAvatarAnim(efftctName:string): void {
		this.avatar_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.avatar_grp.removeChild(display);
			}
		}
		let _mountBody: Animation = new Animation(efftctName);
		this.avatar_grp.addChild(_mountBody);
		_mountBody.x = this.avatar_grp.width / 2;
        _mountBody.y = this.avatar_grp.height / 2 + this.avatar_grp.height / 4;
		// switch(efftctName)
		// {
		// 	case 'shenqi_1':
		// 	_mountBody.y = 150;
		// 	break;
		// 	case 'shenqi_2':
		// 	_mountBody.y = 150;
		// 	break;
		// 	case 'shenqi_3':
		// 	_mountBody.y = 150;
		// 	break;
		// 	case 'shenqi_4':
		// 	_mountBody.y = 150;
		// 	break;
		// 	case 'shenqi_5':
		// 	_mountBody.y = 150;
		// 	break;
		// }
	}
	private moveUp: boolean;
	private start_posY: number;
	private onStartFloatAnim(): void {
		this.moveUp = true;
		this.start_posY = this.avatar_grp.y;
		this.avatar_grp.addEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
	}
	private onFrame(): void {
		if (this.moveUp) {
			this.avatar_grp.y--;
			if (this.avatar_grp.y < this.start_posY - 50) {
				this.moveUp = false;
			}
		} else {
			this.avatar_grp.y++;
			if (this.avatar_grp.y > this.start_posY) {
				this.moveUp = true;
			}
		}
	}
}