class MagicJueXingDanPanel extends BaseWindowPanel {
	private currency: ConsumeBar;
	private powerBar: PowerBar;
	private upBtn: eui.Button;
	private blessType: number = 0;
	private curPro: eui.Label;
	private nextPro: eui.Label;
	private closeBtn1: eui.Button;
	private label_points: eui.Label;
	private consumItem: ConsumeBar;
	private avatar_grp: eui.Group;
	private groupInfo: eui.Group;
	private titleName: eui.Label;
	private lbName: eui.Label;
	private lbLevel: eui.Label;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public modelThing: ModelThing;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.MagicJueXingDanSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
	}
	public onShowWithParam(param): void {
		this.blessType = param;
		let _id = DataManager.getInstance().blessManager.getBlessJueXingItemId(parseInt(param));
		let _model: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.ITEM, _id);
		this.modelThing = _model;
		this.onShow();
	}
	protected onRegist(): void {
		super.onRegist();
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.upBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpSkill, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.BLESS_WAKE_UP_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		this.upBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnUpSkill, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.BLESS_WAKE_UP_MESSAGE.toString(), this.onRefresh, this);
	}
	//更新外形展示
	private updateAvatarAnim(): void {
		let resurl: string = "";
		let manager: BlessManager = DataManager.getInstance().blessManager;
		let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
		let model: Modelmount = manager.getBlessModelByData(blessData);
		model = model ? model : manager.getBlessModel(this.blessType, 1, 1);
		this.avatar_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.avatar_grp.removeChild(display);
			}
		}
		var waixing: number = 0;
		let wearfashionId: number = DataManager.getInstance().playerManager.player.getPlayerData().fashionWearIds[this.blessType];
		let fashionmodel: Modelfashion = JsonModelManager.instance.getModelfashion()[wearfashionId];
		if (fashionmodel)
			waixing = fashionmodel.waixing1;
		switch (this.blessType) {
			case BLESS_TYPE.HORSE:
				resurl = `zuoqi_${waixing}`;
				let _mountBody: Animation = new Animation(resurl);
				this.avatar_grp.addChild(_mountBody);
				this.avatar_grp.y = 200;
				break;
			case BLESS_TYPE.CLOTHES:
				let sex: string = this.getPlayer().getPlayerData(0).sex == SEX_TYPE.MALE ? "nan" : "nv";
				resurl = `shenzhuang_${sex}_${waixing}`;
				var anim = new Animation(resurl, -1);
				this.avatar_grp.addChild(anim);
				this.avatar_grp.y = 320;
				break;
			case BLESS_TYPE.WEAPON:
				// resurl = `jian${waixing}_png`;
				// let weaponimg: eui.Image = new eui.Image();
				// weaponimg.source = resurl;
				// this.avatar_grp.addChild(weaponimg);
				resurl = 'jian' + waixing;
				var anim = new Animation(resurl, -1);
				// anim.y = 360;
				// anim.x = 162;
				this.avatar_grp.y = 200;
				this.avatar_grp.addChild(anim);
				// this.onStartFloatAnim();
				break;
			case BLESS_TYPE.WING:
				resurl = LoadManager.getInstance().getWingResUrl("wing" + waixing, "ride_stand", Direction.DOWN + "");
				let _wingBody: BodyAnimation = new BodyAnimation(resurl, -1, Direction.DOWN);
				this.avatar_grp.addChild(_wingBody);
				this.avatar_grp.scaleX = 0.9;
				this.avatar_grp.scaleY = 0.9;
				this.avatar_grp.y = 300;
				break;
			case BLESS_TYPE.RING:
				resurl = `guanghuan_jiemian_${waixing}`;
				var anim = new Animation(resurl, -1);
				this.avatar_grp.addChild(anim);
				this.avatar_grp.y = 200;
				this.avatar_grp.scaleX = 0.9;
				this.avatar_grp.scaleY = 0.9;
				return;
			case BLESS_TYPE.RETINUE_HORSE:
				resurl = "sc_mount" + waixing;
				let _minmountBody: Animation = new Animation(resurl);
				this.avatar_grp.addChild(_minmountBody);
				this.avatar_grp.y = 240;
				break;
			case BLESS_TYPE.RETINUE_CLOTHES:
				resurl = "sc_role" + waixing;
				var _body: Animation = new Animation(resurl);
				this.avatar_grp.addChild(_body);
				this.avatar_grp.y = 310;
				break;
			case BLESS_TYPE.RETINUE_WEAPON:
				resurl = `weapon${waixing}_png`;
				let _weaponbody: eui.Image = new eui.Image();
				_weaponbody.source = resurl;
				this.avatar_grp.addChild(_weaponbody);
				this.avatar_grp.y = -100;
				this.onStartFloatAnim();
				break;
			case BLESS_TYPE.RETINUE_WING:
				resurl = 'sc_wing' + waixing;
				let _minwingBody: Animation = new Animation(resurl);
				_minwingBody.x = 30;
				this.avatar_grp.addChild(_minwingBody);
				this.avatar_grp.y = 340;
				break;
			case BLESS_TYPE.MAGIC:
				resurl = `sc_magic${waixing}`;
				var anim = new Animation(resurl, -1);
				this.avatar_grp.addChild(anim);
				this.avatar_grp.y = 200;
				break;
		}
		this.avatar_grp.scaleX = 0.8;
		this.avatar_grp.scaleY = 0.8;
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
	protected onRefresh(): void {
		this.onShowInfo();
		this.updateAvatarAnim();
	}
	private onShowInfo(): void {
		this.titleName.text = this.lbName.text = this.modelThing.name;

		let level = this.getPlayer().getPlayerData().blessWakeLevel[this.blessType];
		this.lbLevel.text = "等级:" + level;
		let levelList: number[] = DataManager.getInstance().blessManager.getBlessJueXingValue();
		if (level > 0) {
			let currBei = levelList[level - 1] / 10000 + 1;
			this.curPro.text = "全属性加成" + currBei + "倍";
		} else {
			this.curPro.text = "无属性加成";
		}
		if (level < levelList.length) {
			let nextBei = levelList[level] / 10000 + 1;
			this.nextPro.text = "全属性加成" + nextBei + "倍";
			this.consumItem.setConsume(this.modelThing.type, this.modelThing.id);
			this.groupInfo.visible = this.consumItem.visible = this.upBtn.visible = true;
		} else {
			this.nextPro.text = "已升至满级";
			//this.groupInfo.visible = 
			this.consumItem.visible = this.upBtn.visible = false;
		}
	}
	private onTouchBtnUpSkill(): void {
		if (!GameCommon.getInstance().onCheckItemConsume(this.modelThing.id, 1, GOODS_TYPE.ITEM)) return;
		var message = new Message(MESSAGE_ID.BLESS_WAKE_UP_MESSAGE);
		message.setByte(0);
		message.setByte(this.blessType);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	private getPlayer() {
		return DataManager.getInstance().playerManager.player;
	}
}