class SonniePanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	private itemLayer: eui.Group;
	private awardLayer: eui.Group;
	private items: SonnieItem[];
	private btn_oneKey: eui.Button;
	private btn_refresh: eui.Button;
	private btn_advance: eui.Button;
	private label_time: eui.Label;
	private one_key_lab: eui.Label;
	private label_remain: eui.Label;
	private data: EscortData;
	private isPlay: boolean = false;
	private currQuality: number;
	private isOneKey: boolean = false;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.SonniePanelSkin;
	}
	protected onInit(): void {
		let onekey_costNum: string = Constant.get(Constant.ESCORT_SHUAXIN).split(',')[1];
		this.one_key_lab.text = `消耗：${onekey_costNum}钻石`;
		this.items = [];
		this.data = DataManager.getInstance().escortManager.escort;
		for (var i: number = 0; i < 4; i++) {
			this.items.push(this.itemLayer.getChildAt(i) as SonnieItem);
		}
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_oneKey.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchOneKey, this);
		this.btn_refresh.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendEscortRefreshQualityMsg, this);
		this.btn_advance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAdvance, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ESCORT_REFRESH_QUALITY_MESSAGE.toString(), this.onRefreshQualityBack, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_oneKey.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchOneKey, this);
		this.btn_refresh.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sendEscortRefreshQualityMsg, this);
		this.btn_advance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAdvance, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ESCORT_REFRESH_QUALITY_MESSAGE.toString(), this.onRefreshQualityBack, this);
	}
	protected onRefresh(): void {
		this.onShowInfo(this.data.quality);
		this.currQuality = this.data.quality;
		this.updateGoodsADD();
	}
	private onShowInfo(quality: number): void {
		let i: number;
		for (i = 0; i < 4; i++) {
			this.items[i].index = i;
			this.items[i].selected = false;
		}
		if (this.items[quality - 1]) {
			this.items[quality - 1].selected = true;
		}
		this.awardLayer.removeChildren();
		let goods: GoodsInstance;
		let model: Modeldujie = JsonModelManager.instance.getModeldujie()[quality];
		if (model) {
			let rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model.jiangli);
			for (i = 0; i < rewards.length; i++) {
				goods = GameCommon.getInstance().createGoodsIntance(rewards[i]);
				this.awardLayer.addChild(goods);
			}
		}
	}
	private max: number = 3;
	private time: number = 0;
	private onRefreshQualityBack() {
		if (this.isPlay) return;
		if (this.isOneKey) {
			this.onRefresh();
		} else {
			this.onPlay();
		}
	}
	private onPlay(): void {
		this.isPlay = true;
		this.time = 0;
		Tool.callbackTime(this.onChange, this, 100, this.time, this.currQuality);
	}
	public onChange(time, quality): void {
		quality++;
		if (quality > 4) {
			time++;
			quality = this.currQuality;
		}
		this.onShowInfo(quality);
		if (time == this.max && quality == this.data.quality) {
			this.isPlay = false;
			this.onRefresh();
			return;
		}
		Tool.callbackTime(this.onChange, this, 100, time, quality);
	}
	private onTouchBtnAdvance() {
		if (this.isPlay) return;
		if (DataManager.getInstance().escortManager.escort.count >= EscortData.MAX_ESCORT_COUNT) {
			GameCommon.getInstance().addAlert("已达今日护送上限");
			return;
		}
		var list = [{ text: "是否开始本次护送", style: {} }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(list, this.sendEscortDispatchMsg, this))
		);
	}

	//711--镖车押运
	private sendEscortDispatchMsg() {
		var message = new Message(MESSAGE_ID.ESCORT_DISPATCH_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
		this.onHide();
	}
	//713--镖车刷品质
	private sendEscortRefreshQualityMsg() {
		if (this.isPlay) return;
		if (this.data.quality == 5) {
			GameCommon.getInstance().addAlert("已达最大品质");
			return;
		}
		this.onSendRefreshQuality(0);
	}
	private updateGoodsADD() {
		if (this.data.refresh < EscortData.MAX_REFRESH_COUNT) {
			this.label_time.text = `免费：${EscortData.MAX_REFRESH_COUNT - this.data.refresh}`;
		} else {
			var _hasNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(30, GOODS_TYPE.ITEM);
			if (_hasNum > 0) {
				this.label_time.text = `刷新令：${_hasNum}/1`;
			} else {
				let costNum: string = Constant.get(Constant.ESCORT_SHUAXIN).split(',')[0];
				this.label_time.text = `消耗：${costNum}钻石`;
			}
		}
		this.label_remain.text = (EscortData.MAX_ESCORT_COUNT - this.data.count) + "/" + EscortData.MAX_ESCORT_COUNT;
	}
	private onTouchOneKey(): void {
		if (this.isPlay) return;
		if (this.data.quality == 5) {
			GameCommon.getInstance().addAlert("已达最大品质");
			return;
		}
		var list = [{ text: "确定一键刷新橙衣仙女吗？", style: {} }];
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
			new WindowParam("AlertFrameUI", new AlertFrameParam(list, this.onSendRefreshQuality, this, 1))
		);
	}
	private onSendRefreshQuality(type): void {
		this.isOneKey = type == 1;
		var message = new Message(MESSAGE_ID.ESCORT_REFRESH_QUALITY_MESSAGE);
		message.setByte(type);
		GameCommon.getInstance().sendMsgToServer(message);

	}
}
class SonnieItem extends eui.Component {
	private _index: number;
	private img_head: eui.Image;
	private img_select: eui.Image;
	public constructor() {
		super();
		this.skinName = skins.SonnieItemSkin;
	}
	public set index(param) {
		this._index = param;
		this.onUpdate();
	}
	public onUpdate(): void {
		this.img_head.source = `escort_fairy_${this._index + 1}_png`;
	}
	public set selected(bl: boolean) {
		this.img_select.visible = bl;
	}
}