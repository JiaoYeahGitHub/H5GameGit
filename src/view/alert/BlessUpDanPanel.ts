class BlessUpDanPanel extends BaseWindowPanel {
	private btnOk: eui.Button;
	private btnOk2: eui.Button;
	private btnBack: eui.Button;
	private labelAlert: eui.Label;
	private avatar_grp: eui.Group;
	private consumItem: ConsumeBar;
	private consumItem2: ConsumeBar;

	private blessType: BLESS_TYPE;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BlessUpDanFrameSkin;
	}
	protected onInit(): void {
		this.labelAlert.textFlow = (new egret.HtmlTextParser).parser(GameCommon.getInstance().readStringToHtml(Language.instance.getText('zhishengyijie')));
		super.onInit();
		this.onRefresh();
	}
	private getPlayerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData();
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
		let resurl: string = "";
		let manager: BlessManager = DataManager.getInstance().blessManager;
		let blessData: BlessData = manager.getPlayerBlessData(this.blessType);
		let model: Modelmount = manager.getNextBlessModel(this.blessType, blessData.grade + 1, blessData.level);
		this.avatar_grp.removeEventListener(egret.Event.ENTER_FRAME, this.onFrame, this);
		while (this.avatar_grp.numChildren > 0) {
			let display = this.avatar_grp.getChildAt(0);
			if (egret.is(display, "BodyAnimation") || egret.is(display, "Animation")) {
				(display as Animation).onDestroy();
			} else {
				this.avatar_grp.removeChild(display);
			}
		}
		// if (model) {
		// 	switch (this.blessType) {
		// 		case BLESS_TYPE.HORSE:
		// 			resurl = `zuoqi_${model.waixing1}`;
		// 			let _mountBody: Animation = new Animation(resurl);
		// 			this.avatar_grp.addChild(_mountBody);
		// 			this.avatar_grp.y = 530;
		// 			break;
		// 		case BLESS_TYPE.CLOTHES:
		// 			let sex: string = this.getPlayerData().sex == SEX_TYPE.MALE ? "nan" : "nv";
		// 			resurl = `shenzhuang_${sex}_${model.waixing1}`;
		// 			let clothes_anim = new Animation(resurl, -1);
		// 			this.avatar_grp.addChild(clothes_anim);
		// 			this.avatar_grp.y = 530;
		// 			break;
		// 		case BLESS_TYPE.WEAPON:
		// 			resurl = `jian${model.waixing1}_png`;
		// 			let weaponimg: eui.Image = new eui.Image();
		// 			weaponimg.source = resurl;
		// 			this.avatar_grp.addChild(weaponimg);
		// 			resurl = `shenbing_1`;
		// 			let weapon_anim = new Animation(resurl, -1);
		// 			weapon_anim.y = 360;
		// 			weapon_anim.x = 162;
		// 			this.avatar_grp.addChild(weapon_anim);
		// 			this.avatar_grp.y = 200;
		// 			this.onStartFloatAnim();
		// 			break;
		// 		case BLESS_TYPE.WING:
		// 			resurl = LoadManager.getInstance().getWingResUrl("wing" + model.waixing1, "ride_stand", Direction.DOWN + "");
		// 			let retinue_wingBody: BodyAnimation = new BodyAnimation(resurl, -1, Direction.DOWN);
		// 			this.avatar_grp.addChild(retinue_wingBody);
		// 			this.avatar_grp.y = 500;
		// 			break;
		// 		case BLESS_TYPE.RING:
		// 			resurl = `guanghuan_jiemian_${model.waixing1}`;
		// 			let anim = new Animation(resurl, -1);
		// 			this.avatar_grp.addChild(anim);
		// 			this.avatar_grp.y = 380;
		// 			break;
		// 		case BLESS_TYPE.RETINUE_HORSE:
		// 			resurl = "sc_mount" + model.waixing1;
		// 			let retinue_mountBody: Animation = new Animation(resurl);
		// 			this.avatar_grp.addChild(retinue_mountBody);
		// 			this.avatar_grp.y = 430;
		// 			break;
		// 		case BLESS_TYPE.RETINUE_CLOTHES:
		// 			resurl = "sc_role" + model.waixing1;
		// 			var _body: Animation = new Animation(resurl);
		// 			this.avatar_grp.addChild(_body);
		// 			this.avatar_grp.y = 550;
		// 			break;
		// 		case BLESS_TYPE.RETINUE_WEAPON:
		// 			resurl = `weapon${model.waixing1}_png`;
		// 			let _weaponbody: eui.Image = new eui.Image();
		// 			_weaponbody.source = resurl;
		// 			this.avatar_grp.addChild(_weaponbody);
		// 			this.avatar_grp.y = 70;
		// 			this.onStartFloatAnim();
		// 			break;
		// 		case BLESS_TYPE.RETINUE_WING:
		// 			resurl = 'sc_wing' + model.waixing1;
		// 			let _wingBody: Animation = new Animation(resurl);
		// 			this.avatar_grp.addChild(_wingBody);
		// 			this.avatar_grp.y = 530;
		// 			break;
		// 		case BLESS_TYPE.RETINUE_MAGIC:
		// 			resurl = `sc_magic${model.waixing1}`;
		// 			let magic_anim = new Animation(resurl, -1);
		// 			this.avatar_grp.addChild(magic_anim);
		// 			this.avatar_grp.y = 400;
		// 			break;
		// 	}
		let itemId: number = GoodsDefine.ITEM_BLESS_UPDAN[this.blessType];
		// this.labelAlert.text = item.des;
		this.btnOk.enabled = true;
		this.consumItem.visible = true;
		this.consumItem.setConsume(GOODS_TYPE.ITEM, itemId);

		itemId = GoodsDefine.ITEM_BLESS_SUPERUPDAN[this.blessType];
		// this.labelAlert.text = item.des;
		this.btnOk2.enabled = true;
		this.consumItem2.visible = true;
		this.consumItem.setConsume(GOODS_TYPE.ITEM, itemId);
		// } else {
		// 	this.labelAlert.text = Language.instance.getText("error_tips_132");
		// 	this.btnOk.enabled = false;
		// 	this.consumItem.visible = false;

		// 	this.btnOk2.enabled = false;
		// 	this.consumItem2.visible = false;
		// }
	}
	/**发送直升一阶消息**/
	private sendUpPillBtn(): void {
		let itemId: number = GoodsDefine.ITEM_BLESS_UPDAN[this.blessType];
		let itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(itemId) as ItemThing;
		if (!itemThing || itemThing.num < 0) {
			GameCommon.getInstance().addAlert('error_tips_3');
			this.onTouchCloseBtn();
			return
		}
		var message: Message = new Message(MESSAGE_ID.MOUNT_UP_PILL_MESSAGE);
		message.setByte(0);
		message.setByte(this.blessType);
		message.setByte(0);
		GameCommon.getInstance().sendMsgToServer(message);

		this.onTouchCloseBtn();
	}
	private sendSuperUpPillBtn(): void {
		let itemId: number = GoodsDefine.ITEM_BLESS_SUPERUPDAN[this.blessType];
		let itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(itemId) as ItemThing;
		if (!itemThing || itemThing.num < 0) {
			GameCommon.getInstance().addAlert('error_tips_3');
			this.onTouchCloseBtn();
			return
		}
		var message: Message = new Message(MESSAGE_ID.MOUNT_UP_PILL_MESSAGE);
		message.setByte(0);
		message.setByte(this.blessType);
		message.setByte(1);
		GameCommon.getInstance().sendMsgToServer(message);

		this.onTouchCloseBtn();
	}
	public onShowWithParam(param: BLESS_TYPE): void {
		this.blessType = param;
		this.onShow();
	}
	public onShow() {
		super.onShow();
	}
	public onEventBack() {
		this.onHide();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btnOk.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendUpPillBtn, this);
		this.btnOk2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendSuperUpPillBtn, this);
		this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBack, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btnOk.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sendUpPillBtn, this);
		this.btnOk2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sendSuperUpPillBtn, this);
		this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBack, this);
	}
	//The end
}