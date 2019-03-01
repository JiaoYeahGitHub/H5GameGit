class BoxTipsBar extends BaseTipsBar {
	private buyBar: BatchDisposebar;
	private goods_num: eui.Label;

	private bless_funcs7: number[] = [FUN_TYPE.FUN_MOUNT, FUN_TYPE.FUN_SHENBING, FUN_TYPE.FUN_SHENZHUANG, FUN_TYPE.FUN_FABAO, FUN_TYPE.FUN_XIANYU];
	private bless_funcs9: number[] = [14, 18, 15, 17, 16];

	private bless_name7: number[] = [0, 1, 2, 3, 4];
	private bless_name9: number[] = [6, 5, 7, 8, 9];

	public constructor(owner: ItemIntroducebar) {
		super(owner);
	}
	protected initSkinName(): void {
		this.skinName = skins.BoxTipsBarSkin;
	}
	//注册
	public onRegist(): void {
		super.onRegist();
		this.buyBar.onRegist();
		this.buyBar.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUse, this);
		this.buyBar.btn_vip_open.addEventListener(egret.TouchEvent.TOUCH_TAP, this.jumpToVIP, this);
		this.buyBar.btn_real_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUse, this);
	}
	//移除
	public onRemove(): void {
		super.onRemove();
		this.buyBar.onRemove();
		this.buyBar.btn_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUse, this);
		this.buyBar.btn_vip_open.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.jumpToVIP, this);
		this.buyBar.btn_real_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUse, this);
	}
	public onUpdate(param: IntroduceBarParam): void {
		super.onUpdate(param);
		var model: ModelThing;
		if (egret.is(param.model, "ThingBase")) {
			model = param.model.model;
		} else if (egret.is(param.model, "ModelThing")) {
			model = param.model;
		}
		this.timeGoods = DataManager.getInstance().timeGoodsManager.getTimeGoods(model.type, model.id);
		super.onRefreshCommonUI(model);

		var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(model.id, GOODS_TYPE.BOX);
		var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
		this.goods_num.text = "当前拥有：" + _hasitemNum;
		this.buyBar.currentState = "use";
		this.buyBar.visible = true;

		this.buyBar.btn_buy.label = "使用";
		if (model.type == GOODS_TYPE.BOX) {
			var box: Modelbox = JsonModelManager.instance.getModelbox()[model.id];
			if (box.type == 7 || box.type == 9) {
				this.buyBar.currentState = "use2";
				let funcs = this.bless_funcs7;
				if (box.type == 9) {
					funcs = this.bless_funcs9;
				}
				for (let i: number = 0; i < funcs.length; i++) {
					let funcType: number = funcs[i];
					let radio_lab: eui.Label = this.buyBar['radio_lab' + i] as eui.Label;

					if (FunDefine.isFunOpen(funcType)) {
						(this.buyBar['radio' + i] as eui.RadioButtonGroup).enabled = true;
						if (box.type == 9) {
							radio_lab.text = Language.instance.getText(`bless${this.bless_name9[i]}_name`);
						} else {
							radio_lab.text = Language.instance.getText(`bless${this.bless_name7[i]}_name`);
						}
					} else {
						let modelFunction: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[funcType];
						(this.buyBar['radio' + i] as eui.RadioButtonGroup).enabled = false;
						if (modelFunction.jingjie > 0) {
							radio_lab.text = Language.instance.getText(`coatard_level${modelFunction.jingjie}`, 'open');
						} else if (modelFunction.guanqia > 0) {
							radio_lab.text = `${modelFunction.guanqia}关开启`;
						} else {
							radio_lab.text = Language.instance.getText(modelFunction.level, 'level', 'open');
						}
					}
				}
			} else if (box.type == 8) {
				if (DataManager.getInstance().rechargeManager.firstCharge == 0) {
					this.buyBar.btn_buy.label = "前往首充";
				}
			}
			else if (box.type == 2) {
				this.buyBar.visible = false;
			}
			if (box.vipLimit > DataManager.getInstance().playerManager.player.viplevel) {
				this.buyBar.currentState = "vip";
				this.buyBar.btn_vip_open.label = "V" + GameCommon.getInstance().getVipName(box.vipLimit) + "开启";
				this.buyBar.btn_real_buy.label = box.cost.num + "钻石";
				DataManager.getInstance().bagManager.recordVipBoxOpenId(box.id);
				// this.buyBar.label_money_owner.text = DataManager.getInstance().playerManager.player.getICurrency(GOODS_TYPE.DIAMOND) + "";
			}
		}
		this.buyBar.onUpdate(this.param.model);
	}
	private onTouchUse() {
		if (this.buyBar.currentState == "use2" && this.buyBar.radio_type == -1) {
			GameCommon.getInstance().addAlert("必须选择一个法宝类型");
			return;
		}
		if (this.buyBar.btn_buy.label == "前往首充") {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "FirstChargePanel");
			return;
		}
		var message = new Message(MESSAGE_ID.GOODS_LIST_USE_MESSAGE);
		message.setByte(this.buyBar.model.type);
		message.setShort(this.buyBar.model.modelId);
		message.setInt(this.buyBar.num);
		if (this.buyBar.radio_type >= 0) {
			message.setByte(this.buyBar.radio_type);
		}
		GameCommon.getInstance().sendMsgToServer(message);
		this.onHide();
	}

	private jumpToVIP() {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "VipPanel");
	}
	//The end
}