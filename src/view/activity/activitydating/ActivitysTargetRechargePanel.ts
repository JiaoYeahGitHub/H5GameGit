class ActivitysTargetRechargePanel extends BaseTabView {
	private target_title: eui.Image;
	private timeLab: eui.Label;
	private chongji_zi: eui.Image;

	private btn_pay: eui.Button;
	private progress: eui.ProgressBar;
	private rewards: eui.Group;
	private frist_item: GoodsInstance;
	private avatar_grp: eui.Group;
	private desc: eui.Label;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ChongjiRechargePanelSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.progress.minimum = 0;
		this.onRefresh();
	}

	protected onRefresh(): void {
		this.progress.value = DataManager.getInstance().newactivitysManager.chargeMoneyNum;
		this.progress.maximum = 188;
		this.desc.text = '当日累充达到188元免费赠送';
		if (DataManager.getInstance().newactivitysManager.chargeMoneyNum >= 188) {
			this.progress.maximum = 388;
			this.desc.text = '当日累充达到388元免费赠送';
			this.progress.value = DataManager.getInstance().newactivitysManager.chargeMoneyNum;
			this.btn_pay.label = "前往充值";
			if (DataManager.getInstance().newactivitysManager.chargeMoneyNum >= 388) {
				this.btn_pay.label = "已达成";
				this.btn_pay.enabled = false;
			}
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
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.CHONGBANG_LIBAO);
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
		// var amount = 100;
		// var goodsName = "元宝";
		// SDKManager.pay(
		// 	{
		// 		goodsName: goodsName,
		// 		amount: amount,
		// 		playerInfo: DataManager.getInstance().playerManager.player
		// 	},
		// 	new BasePayContainer(this));
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
	}

	private showpanel() {
		var model: Modelchongbanglibao = JsonModelManager.instance.
			getModelchongbanglibao()[DataManager.getInstance().newactivitysManager.chongbangLiBaoId];

		this.target_title.source = model.imgtitle;
		var awards: AwardItem[];
		if (DataManager.getInstance().newactivitysManager.chargeMoneyNum >= 188) {
			awards = GameCommon.getInstance().onParseAwardItemstr(model.rewards300)
		}
		else {
			awards = model.rewards;
		}
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
		if (model.type >= 10) {
			this.chongji_zi.source = "chongji_recharge_z3_png";
		} else {
			this.chongji_zi.source = "chongji_recharge_z1_png";
		}


		this.updateAvatarAnim(model.donghua,model.id);

	}

	private get playerData(): Player {
		return DataManager.getInstance().playerManager.player;
	}

	//更新外形展示
	private updateAvatarAnim(blessType,id): void {
		var resurl: string = "";
		if(blessType)
		{
				while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.avatar_grp.removeChild(display);
			}
			}

				resurl = blessType;
				let _mountBody: Animation = new Animation(resurl);
				this.avatar_grp.addChild(_mountBody);
				this.avatar_grp.x = -250;
				this.avatar_grp.y = 430;
				switch(id)
				{
					case 1:
					this.avatar_grp.x = -150;
					this.avatar_grp.y = 430;
						break;
					case 2:
					this.avatar_grp.x = -200;
					this.avatar_grp.y = 430;
					break;
					case 3:
					this.avatar_grp.x = -250;
					this.avatar_grp.y = 430;
					break;
					case 4:
					this.avatar_grp.x = -100;
					this.avatar_grp.y = 450;
					break;
					case 5:
					this.avatar_grp.x = -150;
					this.avatar_grp.y = 550;
					break;
					case 6:
					this.avatar_grp.x = -150;
					this.avatar_grp.y = 450;
					break;
					case 7:
					_mountBody.scaleX = 1.2;
					_mountBody.scaleY = 1.2;
					this.avatar_grp.x = -150;
					this.avatar_grp.y = 450;
					break;
					case 8:
					this.avatar_grp.x = -150;
					this.avatar_grp.y = 450;
					break;
					case 9:
					this.avatar_grp.x = -150;
					this.avatar_grp.y = 550;
					break;
					case 10:
					this.avatar_grp.x = -200;
					this.avatar_grp.y = 450;
					break;
				}
				return;
		}

		let manager: BlessManager = DataManager.getInstance().blessManager;
		var chongwuModel: Modelchongwujinjie = JsonModelManager.instance.getModelchongwujinjie()[1];
		var model
		if (blessType < 10) {
			if (DataManager.getInstance().newactivitysManager.chargeMoneyNum < 100) {
				for (var i: number = 1; i < 11; i++) {
					if (JsonModelManager.instance.getModelfashion()[i].type == blessType) {
						model = JsonModelManager.instance.getModelfashion()[i];
						break;
					}
				}
			}
			else {
				model = manager.getBlessModel(blessType, 19, 1);
			}

		}
		this.avatar_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.avatar_grp.removeChild(display);
			}
		}
		switch (blessType) {
			case BLESS_TYPE.HORSE:
				resurl = `zuoqi_${model.waixing1}`;
				let _mountBody: Animation = new Animation(resurl);
				this.avatar_grp.addChild(_mountBody);
				this.avatar_grp.y = 550;
				break;
			case BLESS_TYPE.CLOTHES:
				let sex: string = this.playerData.sex == SEX_TYPE.MALE ? "nan" : "nv";
				resurl = `shenzhuang_${sex}_${model.waixing1}`;
				var anim = new Animation(resurl);
				this.avatar_grp.addChild(anim);
				this.avatar_grp.y = 565;
				break;
			case BLESS_TYPE.WEAPON:
				resurl = `jian${model.waixing1}`;
				var anim = new Animation(resurl);
				this.avatar_grp.addChild(anim);
				// this.avatar_grp.y = 565;
				// resurl = `jian${model.waixing1}_png`;
				// let weaponimg: eui.Image = new eui.Image();
				// weaponimg.source = resurl;
				// this.avatar_grp.addChild(weaponimg);
				// resurl = `shenbing_1`;
				// var anim = new Animation(resurl, -1);
				// anim.y = 360;
				// anim.x = 165;
				// this.avatar_grp.addChild(anim);
				// this.avatar_grp.y = 200;
				// this.avatar_grp.x = -80;
				// this.onStartFloatAnim();
				break;
			case BLESS_TYPE.WING:
				resurl = LoadManager.getInstance().getWingResUrl("wing" + model.waixing1, "ride_stand", Direction.DOWN + "");
				let _wingBody: BodyAnimation = new BodyAnimation(resurl, -1, Direction.DOWN);
				this.avatar_grp.addChild(_wingBody);
				this.avatar_grp.y = 500;
				break;
			case BLESS_TYPE.RING:
				resurl = `guanghuan_jiemian_${model.waixing1}`;
				var anim = new Animation(resurl, -1);
				this.avatar_grp.addChild(anim);
				this.avatar_grp.y = 400;
				break;
			case BLESS_TYPE.RETINUE_HORSE:
				resurl = "sc_mount" + model.waixing1;
				let _mountBody2: Animation = new Animation(resurl);
				this.avatar_grp.addChild(_mountBody2);
				this.avatar_grp.y = 430;
				break;
			case BLESS_TYPE.RETINUE_CLOTHES:
				resurl = "sc_role" + model.waixing1;
				var _body: Animation = new Animation(resurl);
				this.avatar_grp.addChild(_body);
				this.avatar_grp.y = 565;
				break;
			case BLESS_TYPE.RETINUE_WEAPON:
				resurl = `weapon${model.waixing1}_png`;
				let _weaponbody: eui.Image = new eui.Image();
				_weaponbody.source = resurl;
				this.avatar_grp.addChild(_weaponbody);
				this.avatar_grp.y = 70;
				this.avatar_grp.x = -300;
				this.onStartFloatAnim();
				break;
			case BLESS_TYPE.RETINUE_WING:
				resurl = 'sc_wing' + model.waixing1;
				let _wingBody2: Animation = new Animation(resurl);
				_wingBody2.x = 30;
				this.avatar_grp.addChild(_wingBody2);
				this.avatar_grp.y = 570;
				break;
			case BLESS_TYPE.MAGIC:
				resurl = `sc_magic${model.waixing1}`;
				var anim = new Animation(resurl, -1);
				this.avatar_grp.addChild(anim);
				this.avatar_grp.y = 430;
				break;
			case NewactivitysManager.DABIAO_TYPE_REDEQUIP:
				var img: eui.Image = new eui.Image();
				img.source = "hongzhuangchongbang_png";
				this.avatar_grp.addChild(img);
				img.x = -165;
				this.avatar_grp.addChild(img);
				this.avatar_grp.y = 280;
				break;
			case NewactivitysManager.DABIAO_TYPE_SIXIANG:
				var img: eui.Image = new eui.Image();
				img.source = "sixiangchongbang_png";
				this.avatar_grp.addChild(img);
				img.x = -168;
				this.avatar_grp.addChild(img);
				this.avatar_grp.y = 240;
				break;
			case NewactivitysManager.DABIAO_TYPE_MERIDIAN:
				var img: eui.Image = new eui.Image();
				img.source = "jingmaichongbang_png";
				this.avatar_grp.addChild(img);
				img.x = -165;
				this.avatar_grp.addChild(img);
				this.avatar_grp.y = 280;
				break;
			case NewactivitysManager.DABIAO_TYPE_PET:
				var anim = new Animation("petbig" + chongwuModel.waixing1, -1);
				this.avatar_grp.addChild(anim);
				this.avatar_grp.y = 500;
				break;
			case NewactivitysManager.DABIAO_TYPE_JEWEL:
				var img: eui.Image = new eui.Image();
				img.source = "baoshichongbang_png";
				img.x = -135;
				this.avatar_grp.addChild(img);
				this.avatar_grp.y = 280;
				break;
		}
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