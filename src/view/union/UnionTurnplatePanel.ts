class UnionTurnplatePanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private label_goldOne: eui.Label;
	// private label_recharge: eui.Label;
	private img_payIcon1: eui.Image;
	private img_payIcon2: eui.Image;
	private img_payIcon3: eui.Image;
	private label_points: eui.Label;
	private btn_one: eui.Group;
	private pay: number = 100;
	private label_time: eui.Label;
	// private label_record: eui.Label;
	private label_info: eui.Label;
	private gainId: number;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionTurnplateSkin;
	}
	//供子类覆盖
	protected onInit(): void {
		this.onInitData(7, GameDefine.UNION_TURNPLATE_GAINID);
		// GameCommon.getInstance().addUnderline(this.label_recharge);
		// this.label_recharge.touchEnabled = true;
		this.label_goldOne.text = this.pay.toString();

		// GameCommon.getInstance().addUnderlineStr(this.label_record, 更多记录);
		// this.label_record.touchEnabled = true;
		// this.setTitle("union_turnplate_title_png");
		this.setTitle("仙盟密阁");
		// this.basic["basic_tip_bg"].visible = false;
		this.btn_one.touchEnabled = true;
		super.onInit();
		this.onRefresh();
	}

	private onInitData(num: number, turnplate_id: number) {
		this.gainId = turnplate_id;
		var goods: GoodsInstance;
		var goodsArr = [];
		var mdoelGain: Modelgain = JsonModelManager.instance.getModelgain()[this.gainId];
		// var items: AwardItem[] = GameCommon.getInstance().onParseGainItemstr(mdoelGain.item,GOODS_TYPE.ITEM);
		// var boxs: AwardItem[] = GameCommon.getInstance().onParseGainItemstr(mdoelGain.box,GOODS_TYPE.BOX);
		// var data = GameCommon.getInstance().concatAwardAry([items, boxs]).concat();
		var data = GameCommon.getInstance().onParseAwardItemstr(GameDefine.UNION_TURNPLATE_SHOW);
		var award: AwardItem;
		var n: number = 0;
		for (var i: number = 0; i < num; i++) {
			goods = this["goods" + i];
			award = data[n];
			goods.onUpdate(award.type, award.id, 0, award.quality, award.num);
			goodsArr.push(goods);
			n++;
			if (n == data.length) {
				n = 0;
			}
		}
	}

	protected onRefresh() {
		this.onUpdateCurrency();
		this.onRunALottery();
	}
	private onUpdateCurrency(event: egret.Event = null): void {
		this.label_points.text = DataManager.getInstance().playerManager.player.donate + "";
	}
	protected onRegist(): void {
		super.onRegist();
		// this.label_recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		// this.label_record.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRecord, this);
		this.btn_one.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnOne, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_TURNPLATE_FILT_MESSAGE.toString(), this.onRunALottery, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_PRIZE_RECORD_MESSAGE.toString(), this.onRecordUpdate, this);
	}
	protected onRemove(): void {
		super.onRemove();
		// this.label_recharge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
		// this.label_record.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRecord, this);
		this.btn_one.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnOne, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_TURNPLATE_FILT_MESSAGE.toString(), this.onRunALottery, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_PRIZE_RECORD_MESSAGE.toString(), this.onRecordUpdate, this);
	}
	private onRunALottery(): void {
		// GameCommon.getInstance().onButtonEnable(this.btn_one, true);
		this.btn_one.touchEnabled = true;
		DataManager.getInstance().unionManager.onReqUnionPrizeRecord();
		this.onRecordUpdate();
	}
	private onTouchRecord(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionPrizeRecordPanel");
	}
	private onRecordUpdate(): void {
		var unionLv = DataManager.getInstance().unionManager.unionInfo.info.level;
		var model: ModelguildLv = JsonModelManager.instance.getModelguildLv()[unionLv - 1];
		this.label_time.textFlow = (new egret.HtmlTextParser).parser(`今日剩余次数：<font color="#28E828">${model.zhuanpanMax - DataManager.getInstance().unionManager.unionInfo.turnplateNum}</font>`);
		this.label_info.textFlow = DataManager.getInstance().unionManager.getTextFlow(3);
	}
	private onTouchBtnOne() {
		var unionLv = DataManager.getInstance().unionManager.unionInfo.info.level;
		var model: ModelguildLv = JsonModelManager.instance.getModelguildLv()[unionLv - 1];
		if (model.zhuanpanMax <= DataManager.getInstance().unionManager.unionInfo.turnplateNum) {
			GameCommon.getInstance().addAlert("今日转盘次数已达上限");
			return;
		}
		this.onSendMessage(0);
	}
	// private onTouchBtnTen() {
	// 	this.onSendMessage(1);
	// }
	// public getStyle(): string {
	// 	return "bg_style1";
	// }
	protected onGetBtn(event: TouchEvent): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionTributePanel");
	}
	private onSendMessage(type: number) {
		if (DataManager.getInstance().playerManager.player.donate < this.pay) {
			GameCommon.getInstance().addAlert("仙盟贡献不足");
			return;
		}
		var message = new Message(MESSAGE_ID.UNION_TURNPLATE_FILT_MESSAGE);
		message.setByte(type);
		GameCommon.getInstance().sendMsgToServer(message);
		// GameCommon.getInstance().onButtonEnable(this.btn_one, false);
		this.btn_one.touchEnabled = false;
	}
}