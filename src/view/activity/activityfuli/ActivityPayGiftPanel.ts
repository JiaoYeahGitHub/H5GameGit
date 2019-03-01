class ActivityPayGiftPanel extends BaseTabView {
	private top_reward: eui.Group;
	private giftlist_grp: eui.List;
	private progress_label: eui.Label;
	private status_goto: eui.Label;
	private scroll: eui.Scroller;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ActivityPayGiftSkin;
	}
	protected onInit() {
		this.giftlist_grp.itemRenderer = PayGiftItem;
		this.giftlist_grp.itemRendererSkinName = skins.PayGiftItemSkin;
		this.giftlist_grp.useVirtualLayout = true;
		this.scroll.viewport = this.giftlist_grp;

		var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(ActivityDefine.GIFTTOP);
		var award: GoodsInstance;
		for (var i = 0; i < awards.length; i++) {
			award = new GoodsInstance();
			award.onUpdate(awards[i].type, awards[i].id, 0, awards[i].quality, awards[i].num);
			this.top_reward.addChild(award);
		}
		GameCommon.getInstance().addUnderlineStr(this.status_goto);
		this.onRefresh();
	}
	protected onRefresh(): void {
		let models: Modelleichonghaoli[] = [];
		var model: Modelleichonghaoli;
		for (var key in JsonModelManager.instance.getModelleichonghaoli()) {
			model = JsonModelManager.instance.getModelleichonghaoli()[key];
			models.push(model);
		}
		this.giftlist_grp.dataProvider = new eui.ArrayCollection(models);

		var paydayCount: number = DataManager.getInstance().newactivitysManager.payDays;
		this.progress_label.textFlow = (new egret.HtmlTextParser()).parse(GameCommon.getInstance().readStringToHtml(`已累计充值[#FCC41E${paydayCount}]天`));
	}
	protected onRegist(): void {
		super.onRegist();//添加事件
		this.status_goto.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGotoLabel, this);
	}
	protected onRemove(): void {
		super.onRemove();//移除事件
		this.status_goto.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGotoLabel, this);
		// for (var i: number = 0; i < this.items.length; i++) {
		// 	var giftItem: PayGiftItem = this.items[i];
		// 	giftItem.onRemove();
		// }
	}
	private onTouchGotoLabel(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
	}
	//The end
}
class PayGiftItem extends BaseListItem {
	private desc_label: eui.Label;
	private awards_grp: eui.Group;
	private status_label: eui.Label;

	public constructor() {
		super();
	}
	protected onUpdate(): void {
		let model: Modelleichonghaoli = this.data as Modelleichonghaoli;
		this.awards_grp.removeChildren();
		for (var i: number = 0; i < model.rewards.length; i++) {
			var awardItem: AwardItem = model.rewards[i];
			var awardGoods: GoodsInstance = new GoodsInstance();
			awardGoods.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num);
			this.awards_grp.addChild(awardGoods);
		}

		var paydayCount: number = DataManager.getInstance().newactivitysManager.payDays;
		if (paydayCount < model.day) {
			this.desc_label.textFlow = (new egret.HtmlTextParser()).parse(GameCommon.getInstance().readStringToHtml(`累计充值[#FCC41E${model.day}]天`));
		} else {
			this.desc_label.textFlow = (new egret.HtmlTextParser()).parse(GameCommon.getInstance().readStringToHtml(`[#FFFF00已达成]`));
		}
	}
	private onTouchGotoLabel(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
	}
	//The end
}