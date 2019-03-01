class HefuPayGiftPanel extends BaseTabView {
	private box: eui.Group;
	private timeLab: eui.Label;
	private goods: GoodsInstance;
	private itemGroup: eui.List;
	private index: number;
	private toDayMoney: eui.Label;
	private leichongDesc: eui.Image;
	private scroller: eui.Scroller;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.LiuYiDanChongSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.itemGroup.percentWidth = 600;
		this.itemGroup.percentHeight = 636;
		this.itemGroup.itemRenderer = HefuActDanChongItem;
		this.itemGroup.itemRendererSkinName = skins.LiuYiDanChongItemSkin;
		this.itemGroup.useVirtualLayout = true;
		this.scroller.viewport = this.itemGroup;

		this.index = 1;
		this.timeLab.text = GameCommon.getInstance().getTimeStrForSecHS(0);
		this.onRefresh();
	}
	protected onRefresh() {
		this.onShowAward();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onShowAward, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onShowAward, this);
		this.examineCD(false);
	}
	private onShowAward(): void {
		this.itemGroup.dataProvider = new eui.ArrayCollection(this.models);
	}
	//获取对应标签的数据结构
	private rewardArr: Array<Modeldanbichongzhi> = new Array<Modeldanbichongzhi>();
	private get models(): Modeldanbichongzhi[] {
		this.rewardArr = [];
		var kaifuArrs = JsonModelManager.instance.getModeldanbichongzhi()
		for (let k in kaifuArrs) {
			if (kaifuArrs[k].round == DataManager.getInstance().festivalDanChongManager.day) {
				var awards: AwardItem[];
				this.rewardArr.push(kaifuArrs[k]);
			}
		}
		return this.rewardArr;
	}
	public examineCD(open: boolean) {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown() {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.LIUYIACTIVITDANCHONG);
		if (time > 0) {
		} else {
			time = 0;
			this.examineCD(false);
		}
		this.onShowCD(time);
	}
	public onShowCD(time: number) {
		this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 3);
	}
}
class HefuActDanChongItem extends BaseListItem {
	private name_label: eui.Label;
	private awards: eui.Group;
	private btn_reward: eui.Button;
	constructor() {
		super();
	}
	protected initializeSize(): void {
		this.width = 600;
		this.height = 166;
	}
	protected onInit(): void {
		this.touchEnabled = false;
		this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
	}
	protected onUpdate(): void {
		if (this.data) {
			if (this.data) {
				while (this.awards.numChildren > 0) {
					let display = this.awards.getChildAt(0);
					this.awards.removeChild(display);
				}
				if (DataManager.getInstance().festivalDanChongManager.record[this.data.num - 1] == 1) {
					this.btn_reward.label = '已达标';
					this.btn_reward.enabled = false;
				} else {
					this.btn_reward.label = '单笔' + this.data.rmb + '元';
					this.btn_reward.enabled = true;
				}
				var rewards: AwardItem[] = this.data.rewards;
				for (var i: number = 0; i < rewards.length; i++) {
					var goodsItem: GoodsInstance = GameCommon.getInstance().createGoodsIntance(rewards[i]);
					goodsItem.scaleX = 0.7;
					goodsItem.scaleY = 0.7;
					this.awards.addChild(goodsItem);
				}
			}
		}
	}
	private onTouch(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
	}
}