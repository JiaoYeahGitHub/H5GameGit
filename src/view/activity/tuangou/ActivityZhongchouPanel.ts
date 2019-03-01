/**
 * 众筹活动
 * 
 * **/
class ActivityZhongchouPanel extends BaseTabView {
	private scroll: eui.Scroller;
	private itemlist: eui.List;
	private time_label: eui.Label;
	private zonemoney_probar: eui.ProgressBar;
	private memoney_lab: eui.Label;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ActivityZhongchouPanelSkin;
	}
	private get manager(): ActivityTuangouManager {
		return DataManager.getInstance().tuangouActManager;
	}
	protected onInit(): void {
		this.scroll.verticalScrollBar.autoVisibility = false;
		this.scroll.verticalScrollBar.visible = false;
		this.itemlist.itemRenderer = ActZhongchouItem;
		this.itemlist.itemRendererSkinName = skins.ZhongchouActItemSkin;
		this.itemlist.useVirtualLayout = true;
		this.scroll.viewport = this.itemlist;

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACT_TUANGOU_MESSAGE.toString(), this.onUpdate, this);
		this.examineCD(true);
		this.onRequetTuangouMsg();
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACT_TUANGOU_MESSAGE.toString(), this.onUpdate, this);
		this.examineCD(false);
	}
	private onRequetTuangouMsg(): void {
		let requestMsg: Message = new Message(MESSAGE_ID.ACT_TUANGOU_MESSAGE);
		requestMsg.setByte(0);
		GameCommon.getInstance().sendMsgToServer(requestMsg);
	}
	protected onRefresh(): void {
	}
	private onUpdate(): void {
		let models: Modeltuangouhuodong[] = [];
		let tuangouhuodong = JsonModelManager.instance.getModeltuangouhuodong();
		let maxpaynum: number = 0;
		for (let id in tuangouhuodong) {
			let model: Modeltuangouhuodong = tuangouhuodong[id];
			models.push(model);
			maxpaynum = Math.max(model.severPay, maxpaynum);
		}
		this.itemlist.dataProvider = new eui.ArrayCollection(models);

		this.zonemoney_probar.maximum = maxpaynum;
		this.zonemoney_probar.value = this.manager.tuangou_ZoneMoney;
		this.memoney_lab.text = this.manager.tuangou_MeMoney + '';
	}
	public examineCD(open: boolean): void {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown(): void {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.TIANZUNZHONGCHOU);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number): void {
		this.time_label.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
	//The end
}
/**众筹商品列表**/
class ActZhongchouItem extends BaseListItem {
	private condition1_lab: eui.Label;
	private condition2_lab: eui.Label;
	private buy_btn: eui.Button;
	private goodsitem: GoodsInstance;
	private price_lab: eui.Label;

	public constructor() {
		super();
	}
	protected onInit(): void {
		this.buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuy, this);
	}
	protected onUpdate(): void {
		let model: Modeltuangouhuodong = this.data;
		let manager: ActivityTuangouManager = DataManager.getInstance().tuangouActManager;
		this.condition1_lab.text = `本服总筹金达到${model.severPay}`;
		this.condition1_lab.textColor = manager.tuangou_ZoneMoney >= model.severPay ? 0x5aff91 : 0xD8D8D8;
		this.condition2_lab.text = `且个人筹金达到${model.privatePay}`;
		this.condition2_lab.textColor = manager.tuangou_MeMoney >= model.privatePay ? 0x5aff91 : 0xD8D8D8;

		this.goodsitem.onUpdate(model.rewards[0].type, model.rewards[0].id, 0, model.rewards[0].quality, model.rewards[0].num);
		if (manager.tuangou_buyIds.indexOf(model.id) >= 0) {
			this.buy_btn.enabled = false;
			this.buy_btn.label = '已购买';
		} else {
			if (manager.tuangou_ZoneMoney >= model.severPay && manager.tuangou_MeMoney >= model.privatePay) {
				this.buy_btn.enabled = true;
				this.buy_btn.label = '购买';
			} else {
				this.buy_btn.enabled = false;
				this.buy_btn.label = '未达成';
			}
		}
		this.price_lab.text = '' + GameCommon.parseAwardItem(model.price).num;
		this.currentState = model.id % 2 == 0 ? 'right' : 'left';
	}
	private onBuy(): void {
		let buyMsg: Message = new Message(MESSAGE_ID.ACT_TUANGOU_MESSAGE);
		buyMsg.setByte(this.data.id);
		GameCommon.getInstance().sendMsgToServer(buyMsg);
	}
}