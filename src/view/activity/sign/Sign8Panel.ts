/**
 * 8日登录
 */
class Sign8Panel extends BaseTabView {
	private scroller: eui.Scroller;
	private sign_group: eui.List;
	private idx = 0;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.Sign8PanelSkin;
	}
	protected onInit(): void {
		this.scroller.horizontalScrollBar.visible = false;
		this.scroller.verticalScrollBar.visible = false;
		this.sign_group.itemRenderer = Sign8Item;
		this.sign_group.itemRendererSkinName = skins.Sign8ItemSkin;
		this.sign_group.useVirtualLayout = true;
		this.scroller.viewport = this.sign_group;

		var models: Modeldenglu[] = [];
		var i = 0;
		var manager = DataManager.getInstance().newactivitysManager;
		for (var key in JsonModelManager.instance.getModeldenglu()) {
			let model: Modeldenglu = JsonModelManager.instance.getModeldenglu()[key];
			if (model.days <= manager.limitLoginDay) {
				this.idx = i;
			}
			models.push(model);
			i++;
		}
		this.sign_group.dataProvider = new eui.ArrayCollection(models);

		super.onInit();
		this.onRefresh();
	}

	protected onRegist(): void {
		// this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.LIMIT_SIGN_REWARD_MESSAGE.toString(), this.onUpBack, this);
		super.onRegist();
	}
	protected onRemove(): void {
		// this.btn_reward.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.LIMIT_SIGN_REWARD_MESSAGE.toString(), this.onUpBack, this);
		super.onRemove();
	}

	protected onRefresh(): void {
		for (var i = 0; i < this.sign_group.numChildren; i++) {
			let item: Sign8Item = this.sign_group.getChildAt(i) as Sign8Item;
			item.data = item.data;
		}
	}

	private onUpBack(): void {
		this.onRefresh();
	}
}

class Sign8Item extends BaseListItem {
	public btn_group: eui.Button;
	private days_blab: eui.BitmapLabel;
	private reward_group: eui.Group;

	public constructor() {
		super();
	}
	protected onInit(): void {
		this.btn_group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventClick, this);
	}
	private onEventClick() {
		let message = new Message(MESSAGE_ID.LIMIT_SIGN_REWARD_MESSAGE);
		message.setByte(this.data.days);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	protected onUpdate() {
		this.reward_group.removeChildren();
		var model: Modeldenglu = this.data;
		this.days_blab.text = Tool.getChineseByImgNum(model.days - 1);
		for (var i: number = 0; i < model.rewards.length; i++) {
			var award: AwardItem = model.rewards[i];
			var goodsInstace: GoodsInstance = new GoodsInstance();
			goodsInstace.scaleX = 0.9;
			goodsInstace.scaleY = 0.9;
			goodsInstace.onUpdate(award.type, award.id, 0, award.quality, award.num);
			this.reward_group.addChild(goodsInstace);
		}
		if (model.days > DataManager.getInstance().newactivitysManager.limitLoginDay) {
			this.btn_group.enabled = false;
			this.btn_group.label = "领取";
		} else {
			if (DataManager.getInstance().newactivitysManager.limitLoginRewardDay[this.itemIndex] == 1) {
				this.btn_group.enabled = false;
				this.btn_group.label = "已领取";
			} else {
				this.btn_group.enabled = true;
				this.btn_group.label = "领取";
			}
		}
	}
}