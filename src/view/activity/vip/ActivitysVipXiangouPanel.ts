class ActivitysVipXiangouPanel extends BaseWindowPanel {

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

	private vip_reward_grp: eui.Group;
	private vip_scroller: eui.Scroller;
	private vip_group: eui.Group;
	private vip_nv: eui.Image;
	private btn_buy: eui.Button;

	private itemQueue: VipLimitItem[];
	private index = 1;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.VipXiangouPanelSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.vip_scroller.verticalScrollBar.visible = false;
		this.itemQueue = [];
		var models = JsonModelManager.instance.getModelxiangoulibao2();
		var item: VipLimitItem;
		for (var key in models) {
			item = new VipLimitItem();
			item.data = models[key];
			var model: Modelxiangoulibao2 = models[key];
			item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
			this.itemQueue.push(item);
			this.vip_group.addChild(item);
		}
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.updateInfo();
		this.updateSelected();
	}
	protected onRegist(): void {
		super.onRegist();
		this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.VIP_XIANGOULIBAO_BUY_MESSAGE.toString(), this.onxiangouBuyover, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		this.btn_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.XIANGOULIBAO_BUY_MESSAGE.toString(), this.onxiangouBuyover, this);
		this.examineCD(false);
	}

	private updateInfo() {
		var item = this.itemQueue[this.index - 1];
		this.vip_nv.source = item.data.image;

		if (item.data.vip <= this.getPlayerData().viplevel) {
			var obj = DataManager.getInstance().newactivitysManager.vipxiangoudate;
			var buyNum: number = 0;
			this.btn_buy.visible = true;
			if (obj[item.data.id]) {
				buyNum = obj[item.data.id][1];
				if (buyNum >= item.data.max) {
					// this.btn_buy.enabled = false;
					this.btn_buy.label = "已购买"
				} else {
					this.btn_buy.enabled = true;
					this.btn_buy.label = GameCommon.parseAwardItem(item.data.price).num + "钻石";
				}
			} else {
				this.btn_buy.enabled = true;
				this.btn_buy.label = GameCommon.parseAwardItem(item.data.price).num + "钻石";
			}
		} else {
			this.btn_buy.visible = false;
			// this.btn_buy.label = "VIP";
		}

		this.vip_reward_grp.removeChildren();
		for (var i: number = 0; i < item.data.rewards.length; i++) {
			var award: AwardItem = item.data.rewards[i];
			var goodsInstace: GoodsInstance = new GoodsInstance();
			goodsInstace.scaleX = 0.9;
			goodsInstace.scaleY = 0.9;
			goodsInstace.onUpdate(award.type, award.id, 0, award.quality, award.num);
			this.vip_reward_grp.addChild(goodsInstace);
		}
	}

	private onTouchBtn() {
		var message: Message = new Message(MESSAGE_ID.VIP_XIANGOULIBAO_BUY_MESSAGE);
		message.setShort(this.itemQueue[this.index - 1].data.id);
		message.setShort(1);//short   购买个数
		GameCommon.getInstance().sendMsgToServer(message);
	}

	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.VIP_XIANGOU2);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number) {
		// this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}

	private onxiangouBuyover() {
		this.onRefresh();
	}

	/*更新选中框*/
	private updateSelected() {
		var len: number = this.itemQueue.length;
		for (var i: number = 0; i < len; i++) {
			this.itemQueue[i].selecet = i == (this.index - 1);
		}
	}

	private onTouchItem(e: egret.TouchEvent) {
		var target = <VipLimitItem>e.currentTarget;
		this.index = target.data.id;
		this.onRefresh();
	}

	private getPlayerData(): Player {
		return DataManager.getInstance().playerManager.player;
	}
}
class VipLimitItem extends BaseComp {
	private btn: eui.RadioButton;
	private v_img: eui.Image;

	private _selected: boolean;

	public constructor() {
		super();
	}

	protected setSkinName(): void {
		this.skinName = skins.VipLimitItemSkin;
	}

	protected onInit(): void {
		if (this._selected != null) {
			this.selecet = this._selected;
		}
	}

	protected dataChanged(): void {
		this.v_img.source = "icon_v" + this._data.vip + "_png";
	}

	public set selecet(bl: boolean) {
		this._selected = bl;
		if (!this.isLoaded) return;
		this.btn.selected = bl;
	}
}