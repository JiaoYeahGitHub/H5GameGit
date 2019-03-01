class ExchangeDebrisPanel extends BaseWindowPanel {
	private closeBtn2: eui.Button;
	private goods_left: GoodsInstance;
	private goods_right: GoodsInstance;
	private consume_num_label: eui.Label;
	private btn_exchange: eui.Button;
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private Exchange_Num: number = 500;//兑换基数
	private Exchange_OpenVipLv: number = 5;//开启兑换的VIP等级

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ExchangeDebrisSkin;
	}
	protected onInit(): void {
		this.setTitle("exchange_hzdh_title_png");

		this.goods_left.onUpdate(GOODS_TYPE.ITEM, GoodsDefine.ITEM_ID_CZSP, 0, -1, 500);
		this.goods_right.onUpdate(GOODS_TYPE.ITEM, GoodsDefine.ITEM_ID_TSSP, 0, -1, 10);
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		var hasCZSPNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(GoodsDefine.ITEM_ID_CZSP);
		this.consume_num_label.text = "" + hasCZSPNum;
		if (this.Exchange_Num > hasCZSPNum) {
			this.btn_exchange.label = "碎片不足";
			GameCommon.getInstance().onButtonEnable(this.btn_exchange, false);
		} else {
			this.btn_exchange.label = "兑换";
			GameCommon.getInstance().onButtonEnable(this.btn_exchange, true);
		}
	}
	private reciveUpdateBagMsg(event: egret.Event): void {
		if (event.data == GOODS_TYPE.ITEM) {
			this.onRefresh();
		}
	}
	protected onRegist(): void {
		super.onRegist();
		this.closeBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.btn_exchange.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExchange, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE, this.reciveUpdateBagMsg, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.closeBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.btn_exchange.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onExchange, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE, this.reciveUpdateBagMsg, this);
	}
	//兑换
	private onExchange(): void {
		var exchangeMsg: Message = new Message(MESSAGE_ID.EXCHANGE_HZSP_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(exchangeMsg);
	}

	public onShow(): void {
		if (DataManager.getInstance().playerManager.player.viplevel < this.Exchange_OpenVipLv) {
			var payNotice = [{ text: `VIP${this.Exchange_OpenVipLv}`, style: { textColor: 0x28e828 } }, { text: `可开启兑换功能，是否前往充值？`, style: { textColor: 0xe9deb3 } }];
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
				new WindowParam("AlertFrameUI", new AlertFrameParam(payNotice, function () {
					GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
				}, this))
			);
			return;
		}
		super.onShow();
	}
	//The end
}