class TreasureRankPanel extends BaseWindowPanel {
	private closeBtn1: eui.Button;
	private closeBtn2: eui.Button;
	private nulldateLab: eui.Label;
	private headIcon: eui.Image;
	private vip: eui.BitmapLabel;
	private label_integral: eui.Label;
	private my_integral: eui.Label;
	private label_name: eui.Label;
	private act_desc_label: eui.Label;
	private goods: GoodsInstance;
	private btn_list: eui.Button;
	private infoLayer: eui.Group;
	private label_timedown: eui.Label;
	private not_award_label: eui.Label;
	private exchange_label: eui.Label;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.TreasureRankPanelSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.onRefresh();
		GameCommon.getInstance().addUnderlineStr(this.exchange_label);
	}
	protected onRegist(): void {
		super.onRegist();
		this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.closeBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.btn_list.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnlist, this);
		this.exchange_label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExchangeHandler, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TREASURE_RANK_LIST_MESSAGE.toString(), this.onRefresh, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.closeBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.btn_list.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnlist, this);
		this.exchange_label.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onExchangeHandler, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TREASURE_RANK_LIST_MESSAGE.toString(), this.onRefresh, this);
		this.examineCD(false);
	}
	protected onRefresh(): void {
		var mgr: TreasureRankManager = DataManager.getInstance().treasureRankManager;
		var data = mgr.data;
		var base: TreasureRankBase = mgr.record[1];
		var model: Modelxunbaobang = data[0];
		this.act_desc_label.textFlow = new egret.HtmlTextParser().parse(GameCommon.getInstance().readStringToHtml(`活动须知：单次寻宝获得1积分，寻宝积分至少达到[#FFFF00${model.jifen}分]才可以领取排行奖励，奖励将于0点通过邮件发放`));
		if (base) {
			this.my_integral.text = mgr.my_integral + "";
			// this.headIcon.source = GameCommon.getInstance().getHeadIconByIndex(base.headID);
			this.vip.text = `V${base.vipLv}`;
			this.label_name.text = base.name;
			this.label_integral.text = `${base.integral}积分`;
			this.not_award_label.visible = base.integral < model.jifen;
			if (this.not_award_label.visible)
				this.not_award_label.text = `积分不足${model.jifen}不能获得奖励`;
			this.nulldateLab.visible = false;
			this.infoLayer.visible = true;
		} else {
			this.nulldateLab.visible = true;
			this.infoLayer.visible = false;
			this.not_award_label.visible = false;
		}
		this.goods.onUpdate(model.rewards[0].type, model.rewards[0].id, 0, model.rewards[0].quality, model.rewards[0].num);
		this.goods.addAnimation("biankuangdonghua2");
		// this.goods.name_label.textFlow = new Array<egret.ITextElement>({ text: GameCommon.getInstance().getLimitLevelObj(this.goods.model.level).zsLevel + "转 " + this.goods.model.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this.goods.model.quality) } });
		for (var i: number = 1; i < data.length; i++) {
			this[`item${i + 1}`].data = data[i];
		}
	}
	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(DataManager.getInstance().treasureRankManager.activityId);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number) {
		this.label_timedown.text = GameCommon.getInstance().getTimeStrForSec1(time, 2);
	}
	private onTouchBtnlist(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("EquipNBPanel", 0));
	}
	private onExchangeHandler(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ExchangeDebrisPanel");
	}
	//The end
}
class TreasureRankItem extends eui.Component {
	public _data: Modelxunbaobang;
	private label_integral: eui.Label;
	private label_name: eui.Label;
	private goods: GoodsInstance;
	private nulldateLab: eui.Label;
	private commonRankLayer: eui.Group;
	private rank_icon: eui.Image;
	private bmt_rank: eui.BitmapLabel;
	private infoLayer: eui.Group;
	private not_award_label: eui.Label;
	public constructor() {
		super();
		// this.skinName = skins.TreasureRankItemSkin;
	}
	public set data(param: Modelxunbaobang) {
		this._data = param;
		this.onUpdate();
	}
	private onUpdate(): void {
		var base: TreasureRankBase;
		var data = DataManager.getInstance().treasureRankManager.data;
		var record = DataManager.getInstance().treasureRankManager.record;
		base = record[this._data.currRank];
		if (base) {
			this.label_name.text = base.name;
			this.label_integral.text = `${base.integral}积分`;
			this.not_award_label.visible = base.integral < this._data.jifen;
			if (this.not_award_label.visible)
				this.not_award_label.text = `积分不足${this._data.jifen}不能获得奖励`;
			this.nulldateLab.visible = false;
			this.infoLayer.visible = true;
		} else {
			this.nulldateLab.visible = true;
			this.infoLayer.visible = false;
			this.not_award_label.visible = false;
		}
		this.goods.onUpdate(this._data.rewards[0].type, this._data.rewards[0].id, 0, this._data.rewards[0].quality, this._data.rewards[0].num);
		if (this._data.currRank > 3) {
			this.commonRankLayer.visible = true;
			this.rank_icon.visible = false;
			this.bmt_rank.text = this._data.currRank + "";
		} else {
			this.commonRankLayer.visible = false;
			this.rank_icon.visible = true;
			this.rank_icon.source = `rank_itemtitle${this._data.currRank}_png`;
		}
	}
}