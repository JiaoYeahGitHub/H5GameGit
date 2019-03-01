class LocalArenaFirstAwdPanel extends BaseWindowPanel {
	public basic: eui.Component;
	public scroller: eui.Scroller;
	public itemlist: eui.List;
	public reward_all_btn: eui.Button;
	public best_rank_lab: eui.Label;

	// private MIN_SHOW_NUM: number = 6;//最少显示6个奖励项

	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.LocalArenaFirstAwdSkin;
	}
	protected onInit(): void {
		this.setTitle("首次奖励");
		this.scroller.verticalScrollBar.autoVisibility = false;
		this.scroller.verticalScrollBar.visible = false;
		this.itemlist.itemRenderer = LocalArenaFirstAwdItem;
		this.itemlist.itemRendererSkinName = skins.LocalArenaFirstAwdItemSkin;
		this.itemlist.useVirtualLayout = true;
		this.scroller.viewport = this.itemlist;
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		let arenaData: LocalArenaData = DataManager.getInstance().localArenaManager.localArenaData;

		let models: ModelarenaReward[] = [];
		let canawdIdx: number = 0;
		let modelDict = JsonModelManager.instance.getModelarenaReward();
		let length: number = ModelManager.getInstance().getModelLength('arenaReward');
		for (let i: number = 0; i < length; i++) {
			let model: ModelarenaReward = modelDict[i];
			if (arenaData.bestRank > model.rank) {
				models.splice(canawdIdx, 0, model);
			} else if (arenaData.rankReward > 0 && arenaData.rankReward <= model.rank) {
				models.push(model);
			} else {
				canawdIdx++;
				models.unshift(model);
			}
		}
		//添加ITEM
		this.itemlist.dataProvider = new eui.ArrayCollection(models);
		if (canawdIdx > 0) {
			this.reward_all_btn.label = '一键领取';
			this.reward_all_btn.enabled = true;
		} else {
			if (arenaData.rankReward == 1) {
				this.reward_all_btn.label = '全部达成';
			} else {
				this.reward_all_btn.label = '未达成';
			}
			this.reward_all_btn.enabled = false;
		}

		this.best_rank_lab.text = "历史最高排名:" + arenaData.bestRank + "名";
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_FIRST_AWARD_MESSAGE.toString(), this.onRefresh, this);
		this.reward_all_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_FIRST_AWARD_MESSAGE.toString(), this.onRefresh, this);
		this.reward_all_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
	}
	private onReward(): void {
		let rewardMsg: Message = new Message(MESSAGE_ID.ARENE_FIRST_AWARD_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(rewardMsg);
	}
	//The end
}
class LocalArenaFirstAwdItem extends BaseListItem {
	public rankicon_img: eui.Image;
	public rank_num_lab: eui.BitmapLabel;
	public goodsitem: GoodsInstance;

	constructor() {
		super();
		// this.once(egret.Event.COMPLETE, this.dataChanged, this);
	}
	protected onUpdate(): void {
		let model: ModelarenaReward = this.data;
		let arenaData: LocalArenaData = DataManager.getInstance().localArenaManager.localArenaData;
		if (!arenaData.bestRank || arenaData.bestRank > model.rank) {
			this.currentState = 'unlock';
		} else {
			if (arenaData.rankReward > 0 && arenaData.rankReward <= model.rank) {
				this.currentState = 'complete';
			} else {
				this.currentState = 'reward';
			}
		}
		switch (model.rank) {
			case 1:
			case 2:
			case 3:
				this.rankicon_img.source = `rankbg_${model.rank}_png`;
				break;
			default:
				this.rankicon_img.source = `rankbg_4_png`;
				break
		}
		this.rank_num_lab.text = model.rank + '';
		let awartitem: AwardItem = model.rewards[0];
		this.goodsitem.updateByAward(awartitem);
	}
	//The end
}