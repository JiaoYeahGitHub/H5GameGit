class ActConsumeRewardPanel extends BaseTabView {
	private scroll: eui.Scroller;
	private itemlist: eui.List;
	private time_label: eui.Label;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.ConsumeRewardPanelSkin;
	}
	private get manager(): TotalConsumeManager {
		return DataManager.getInstance().totalConsumeManager;
	}
	protected onInit(): void {
		this.scroll.verticalScrollBar.autoVisibility = false;
		this.scroll.verticalScrollBar.visible = false;
		this.itemlist.itemRenderer = ActConsumeRewardItem;
		this.itemlist.itemRendererSkinName = skins.ConsumeRewardItemSkin;
		this.itemlist.useVirtualLayout = true;
		this.scroll.viewport = this.itemlist;

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_CONSUMEITEM_MESSAGE.toString(), this.onupdateList, this);
		this.examineCD(true);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_CONSUMEITEM_MESSAGE.toString(), this.onupdateList, this);
		this.examineCD(false);
	}
	protected onRefresh(): void {
		this.manager.requestConsumeItemMsg();
	}
	private onupdateList(): void {
		let modelAry: Modelleijixiaohao[] = [];
		let leijixiaohaoModels = JsonModelManager.instance.getModelleijixiaohao();
		for (let id in leijixiaohaoModels) {
			let model: Modelleijixiaohao = leijixiaohaoModels[id];
			if (this.manager.consumeitem_round == model.round) {
				modelAry.push(model);
			}
		}
		modelAry.sort(function (a, b): number {
			let a_sort: number = a.costNum - DataManager.getInstance().totalConsumeManager.consumeitem_pro;
			let b_sort: number = b.costNum - DataManager.getInstance().totalConsumeManager.consumeitem_pro;
			if (b_sort < 0) {
				return -1;
			} else if (a_sort < 0) {
				return 1;
			} else {
				return -1;
			}
		});
		this.itemlist.dataProvider = new eui.ArrayCollection(modelAry);
	}
	public examineCD(open: boolean): void {
		if (open) {
			Tool.addTimer(this.onCountDown, this, 1000);
		} else {
			Tool.removeTimer(this.onCountDown, this, 1000);
		}
	}
	public onCountDown(): void {
		var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.CONSUME_ITEM);
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

class ActConsumeRewardItem extends BaseListItem {
	private reward_desc_lab: eui.Label;
	private reward_items_grp: eui.Group;

	public constructor() {
		super();
	}
	protected onInit(): void {
	}
	protected onUpdate(): void {
		let model: Modelleijixiaohao = this.data;
		let manager: TotalConsumeManager = DataManager.getInstance().totalConsumeManager;
		let pro_desc: string = model.costNum > manager.consumeitem_pro ? `[#5aff91（${manager.consumeitem_pro}/${model.costNum}）]` : '[#FFF000(已完成)]';
		let desc: string = GameCommon.getInstance().readStringToHtml(`活动期间累计消耗[#55c4ff${model.name}]${model.costNum}个 可获得：${pro_desc}`);
		this.reward_desc_lab.textFlow = (new egret.HtmlTextParser).parse(desc);

		this.reward_items_grp.removeChildren();
		for (let i: number = 0; i < model.rewards.length; i++) {
			let goodsinstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(model.rewards[i]);
			this.reward_items_grp.addChild(goodsinstance);
		}
	}
}