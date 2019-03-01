class UnionBattleAwdPanel extends BaseWindowPanel {
	public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
	public currIndex: number;
	private awardList: eui.List;
	private awardList1: eui.List;
	private super_awd_grp: eui.Group;
	private closeBtn2: eui.Button;
	private scroll: eui.Scroller;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	// protected onInit(): void {
	// 	this.onStyle();
	// 	var currPanel: BaseTabView = new window['UnionBallteAwardTabView'](this);
	// 	this.basic["tabLayer"].addChild(currPanel);

	// 	this.setTitle("txt_jiangliyulan_png");
	// 	// this.registerPage(sysQueue, "");
	// 	// this.currIndex = this.index;
	// 	super.onInit();
	// 	this.onRefresh();
	// }
	// private onStyle(): void {
	//     this['basic'].width = 600;
	//     this['basic'].height = 830;
	// }
	// protected onSkinName(): void {
	// 	this.skinName = skins.PopSkin2;
	// }
	protected getTabButtonSkin(btnRes: string): eui.RadioButton {
		let tab_btn: BaseTabButton2 = new BaseTabButton2('');
		tab_btn.label = btnRes;
		return tab_btn;
	}
	// protected onRefresh(): void {
	// 	// this.currIndex = this.index;
	// 	super.onRefresh();
	// }
	protected onInit(): void {
		this.awardList.itemRenderer = UnionBattleAwdItem;
		this.awardList.itemRendererSkinName = skins.UnionBattleAwdItemSkin;
		this.awardList.useVirtualLayout = true;
		this.scroll.viewport = this.awardList;
		super.onInit();
		this.onRefresh();
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionBattleAwdSkin;
	}
	protected onRegist(): void {
		super.onRegist();
		this.closeBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
	}
	protected onRemove(): void {
		super.onRemove();
		this.closeBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
	}
	protected onRefresh(): void {
		this.onRefreshSuperAwd();
		this.awardList.dataProvider = new eui.ArrayCollection(this.models);
	}
	//更新最佳奖励
	private onRefreshSuperAwd(): void {
		if (this.super_awd_grp.numChildren == 0) {
			this.super_awd_grp.removeChildren();
			let model: Modelguildspecialreward = JsonModelManager.instance.getModelguildspecialreward()[1];
			var awardItems: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model.huizhangReward + '#' + model.huiyuanReward);
			for (var i: number = 0; i < awardItems.length; i++) {
				var goodsItem: GoodsInstance = new GoodsInstance();
				var awardItem: AwardItem = awardItems[i];
				goodsItem.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num);
				this.super_awd_grp.addChild(goodsItem);
			}
		}
	}
	//获取对应标签的数据结构
	private rewardArr: Array<Modelguildreward> = new Array<Modelguildreward>();
	private get models(): Modelguildreward[] {
		var models: Modelguildreward[];
		models = JsonModelManager.instance.getModelguildreward();
		var i = 0;
		for (let k in models) {
			this.rewardArr[i] = models[k]
			i = i + 1;
		}
		return this.rewardArr;
	}
	private onClose(): void {
		this.onHide();
	}
	//The end
}
// class UnionBallteAwardTabView extends BaseTabView {
// 	private awardList: eui.List;
// 	private awardList1: eui.List;
// 	private super_awd_grp: eui.Group;
// 	private closeBtn2: eui.Button;
// 	private scroll: eui.Scroller;

// 	constructor(owner: UnionBattleAwdPanel) {
// 		super(owner);
// 	}
// 	protected onInit(): void {
// 		this.awardList.itemRenderer = UnionBattleAwdItem;
// 		this.awardList.itemRendererSkinName = skins.UnionBattleAwdItemSkin;
// 		this.awardList.useVirtualLayout = true;
// 		this.scroll.viewport = this.awardList;
// 		super.onInit();
// 		this.onRefresh();
// 	}
// 	protected onSkinName(): void {
// 		this.skinName = skins.UnionBattleAwdSkin;
// 	}
// 	protected onRegist(): void {
// 		this.closeBtn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
// 	}
// 	protected onRemove(): void {
// 		this.closeBtn2.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClose, this);
// 	}
// 	protected onRefresh(): void {
// 		this.onRefreshSuperAwd();
// 		// if (this.tabIndex == 0) {

// 			this.awardList.dataProvider = new eui.ArrayCollection(this.models);

// 		// }else if (this.tabIndex == 1) {
// 		// 	this.awardList.itemRenderer = UnionBattleAwdItem1;
// 		// 	this.awardList.dataProvider = new eui.ArrayCollection(this.models);
// 		// }

// 	}
// 	//更新最佳奖励
// 	private onRefreshSuperAwd(): void {
// 		if (this.super_awd_grp.numChildren == 0) {
// 			this.super_awd_grp.removeChildren();
// 			var awardItems: AwardItem[] = ModelManager.getInstance().modelUBallteSuperAwd.reward;
// 			for (var i: number = 0; i < awardItems.length; i++) {
// 				var goodsItem: GoodsInstance = new GoodsInstance();
// 				var awardItem: AwardItem = awardItems[i];
// 				goodsItem.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num);
// 				this.super_awd_grp.addChild(goodsItem);
// 			}
// 		}	
// 	}
// 	// private  rewardGerenArr:Array<Modelguildgerenreward> = new Array<Modelguildgerenreward>();
// 	// //获取对应标签的数据结构
// 	// private get models1(): any {
// 	// 		var models: Modelguildgerenreward[];
// 	// 		models = JsonModelManager.instance.getModelguildgerenreward();
// 	// 		var i =0;
// 	// 		for(let k in models){  
// 	// 			this.rewardGerenArr[i] = models[k]
// 	// 			i =i+1;
// 	// 		}  	
// 	// 	return this.rewardGerenArr;
// 	// }
// 	//获取对应标签的数据结构
// 	private  rewardArr:Array<Modelguildreward> = new Array<Modelguildreward>();
// 	private get models():Modelguildreward[] {
// 		var models: Modelguildreward[];
// 			models =  JsonModelManager.instance.getModelguildreward();
// 			var i =0;
// 			for(let k in models){  
// 				this.rewardArr[i] = models[k]
// 				i =i+1;
// 			}  	
// 		return this.rewardArr;
// 	}
// 	//获取当前的标签页
// 	// private get tabIndex(): number {
// 	// 	return (this.owner as UnionBattleAwdPanel).currIndex;
// 	// }
// 	private onClose(): void {
// 		this.owner.onHide();
// 	}
// 	//The end
// }
class UnionBattleAwdItem1 extends eui.ItemRenderer {
	private rank_icon: eui.Image;
	private rank_num_group: eui.Group;
	private rank_num_label: eui.BitmapLabel;
	private award_grp: eui.Group;

	constructor() {
		super();
	}
	protected dataChanged(): void {
		// var awardModel: Modelguildgerenreward = this.data as Modelguildgerenreward;
		var awardModel: Modelguildreward = this.data as Modelguildreward;
		if (awardModel.id > 3) {
			this.rank_icon.visible = false;
			this.rank_num_group.visible = true;
			this.rank_num_label.text = "" + awardModel.id;
		} else {
			this.rank_icon.visible = true;
			this.rank_num_group.visible = false;
			this.rank_icon.source = `rank_itemtitle${awardModel.id}_png`;
		}
		this.award_grp.removeChildren();
		var rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(awardModel.cangkuReward);
		for (var i: number = 0; i < rewards.length; i++) {
			var goodsItem: GoodsInstance = new GoodsInstance();
			var awardItem: AwardItem = rewards[i];
			goodsItem.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num, awardItem.lv);
			this.award_grp.addChild(goodsItem);
		}
	}
}
class UnionBattleAwdItem extends eui.ItemRenderer {
	private rank_icon: eui.Image;
	private rank_num_lab: eui.BitmapLabel;
	private rank_num_group: eui.Group;
	private rank_num_label: eui.BitmapLabel;
	private award_grp: eui.Group;

	constructor() {
		super();
	}
	protected dataChanged(): void {
		var awardModel: Modelguildreward = this.data as Modelguildreward;
		// if (awardModel.id > 3) {
		// 	// this.rank_icon.visible = false;
		// 	// this.rank_num_group.visible = true;
		// 	this.rank_icon.source = `rank_4_20_png`;
		// } else {
		// 	// this.rank_icon.visible = true;
		// 	// this.rank_num_group.visible = false;
			this.rank_icon.source = `rankbg_${awardModel.id}_png`;
			this.rank_num_lab.text = awardModel.id;
		// }
		this.award_grp.removeChildren();
		var rewards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(awardModel.tongyongReward);
		var rewards1: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(awardModel.cangkuReward);

		for (var i: number = 0; i < rewards.length; i++) {
			var goodsItem: GoodsInstance = new GoodsInstance();
			var awardItem: AwardItem = rewards[i];
			goodsItem.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num, awardItem.lv);
			this.award_grp.addChild(goodsItem);
		}
		for (var k: number = 0; k < rewards1.length; k++) {
			var goodsItem: GoodsInstance = new GoodsInstance();
			var awardItem: AwardItem = rewards1[k];
			goodsItem.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num, awardItem.lv);
			this.award_grp.addChild(goodsItem);
		}
	}
}