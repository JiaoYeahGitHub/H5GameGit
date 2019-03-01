class ShopTipsBar extends BaseTipsBar {
	private buyBar: BatchDisposebar;
	private goods_num: eui.Label;

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
		this.buyBar.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBuy, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateHasMoney, this);
	}
	//移除
	public onRemove(): void {
		super.onRemove();
		this.buyBar.onRemove();
		this.buyBar.btn_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBuy, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateHasMoney, this);
	}
	public onUpdate(param: IntroduceBarParam): void {
		super.onUpdate(param);
		var str;
		//var arr=[];
		str = GameCommon.parseAwardItem(this.param.model.item);
		//arr=GameCommon.getInstance().onParseAwardItemstr(str);
		var model: ModelThing = GameCommon.getInstance().getThingModel(str.type, str.id);
		super.onRefreshCommonUI(model);

		var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(str.id);
		var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
		this.goods_num.text = "当前拥有：" + _hasitemNum;

		this.buyBar.currentState = "buy";
		this.buyBar.onUpdate(this.param.model);

		this.buyBar.label_money_owner.text = "" + this.buyBar.ownCurrency();
	}
	private onTouchBuy() {
		if (this.buyBar.sum > this.buyBar.ownCurrency()) {
			GameCommon.getInstance().addAlert(Language.instance.getText("money_have_not"));
			return;
		}
		var message = new Message(MESSAGE_ID.PLAYER_BUY_SHOP_GOODS_MESSAGE);
		message.setByte(this.buyBar.model.shopType);
		message.setInt(this.buyBar.model.id);
		message.setInt(this.buyBar.num);
		GameCommon.getInstance().sendMsgToServer(message);
		this.onHide();
	}

	//货币更新
	private onupdateHasMoney(): void {
		this.buyBar.label_money_owner.text = "" + this.buyBar.ownCurrency();
	}

}