class UnionDepotView extends BaseTabView {
	private depot_list: eui.Group;
	private list_scroll: eui.Scroller;
	private allotBar: UnionDepotAllotBar1;
	private cacheitemAry: UnionDepotItem[];//缓存的仓库格子

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.UnionBattleDepotSkin;
	}
	//供子类覆盖
	protected onInit(): void {
		this.cacheitemAry = [];
		this.allotBar = new UnionDepotAllotBar1();
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BATTLE_DEPOT_MESSAGE.toString(), this.onResUnionDepotInfoMsg, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		this.onReqUnionDepotInfoMsg();
	}
	protected onRemove(): void {
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BATTLE_DEPOT_MESSAGE.toString(), this.onResUnionDepotInfoMsg, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE.toString(), this.onResMemberListMsg, this);
		this.onClearDepotList();
		this.allotBar.onHide();
	}
	//请求帮会仓库的信息
	private onReqUnionDepotInfoMsg(): void {
		var depotinfoMsg: Message = new Message(MESSAGE_ID.UNION_BATTLE_DEPOT_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(depotinfoMsg);
	}
	private onResUnionDepotInfoMsg(): void {
		this.onClearDepotList();
		var unionbattleInfo: UnionBattleInfo = DataManager.getInstance().unionManager.unionbattleInfo;

		var awardItems: AwardItem[] = JsonModelManager.instance.getModelguildspecialreward().reward;
		for (var i: number = 0; i < awardItems.length; i++) {
			var goodsItem: UnionBattleWarehouseItem = new UnionBattleWarehouseItem();
			var awardItem: AwardItem = awardItems[i];
			if (this.getAuthority()) {
				goodsItem.btn_fenpei.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowAllotBar, this);
				GameCommon.getInstance().onButtonEnable(goodsItem.btn_fenpei, true);
			} else {
				// GameCommon.getInstance().onButtonEnable(goodsItem.btn_fenpei, true);
			}
			goodsItem.onUpdate(awardItem);
			this.depot_list.addChild(goodsItem);
		}

		for (var i: number = 0; i < unionbattleInfo.depotThings.length; i++) {
			var depotItem: UnionDepotItem = this.onCreateDepotItem();
			depotItem.allot_btn.name = "" + i;
			depotItem.update(unionbattleInfo.depotThings[i]);
			this.depot_list.addChild(depotItem);
			if (this.getAuthority()) {
				depotItem.allot_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowAllotBar, this);
				GameCommon.getInstance().onButtonEnable(depotItem.allot_btn, true);
			} else {
				GameCommon.getInstance().onButtonEnable(depotItem.allot_btn, false);
			}
		}
	}
	//创建一个仓库格子
	private onCreateDepotItem(): UnionDepotItem {
		if (this.cacheitemAry.length > 0) {
			return this.cacheitemAry.shift();
		}
		return new UnionDepotItem();
	}
	//清除仓库格子
	private onClearDepotList(): void {
		// if (this.depot_list.numChildren > 0) {
		// 	for (var i: number = this.depot_list.numChildren - 1; i >= 0; i--) {
		// 		var depotitem: UnionDepotItem = this.depot_list.getChildAt(i) as UnionDepotItem;
		// 		if (depotitem) {
		// 			depotitem.allot_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowAllotBar, this);
		// 			this.depot_list.removeChild(depotitem);
		// 			if (this.cacheitemAry.indexOf(depotitem) < 0)
		// 				this.cacheitemAry.push(depotitem);
		// 		}
		// 	}
		// }
	}
	//展开分配界面
	private currSelectIndex: number;
	private onShowAllotBar(event: egret.Event): void {
		var index: number = parseInt(event.currentTarget.name);
		this.currSelectIndex = index;
		this.onReqMemberListMsg();
	}
	//请求公会成员列表
	private onReqMemberListMsg(): void {
		DataManager.getInstance().unionManager.onReqUnionMember();
	}
	//返回成员列表信息
	private onResMemberListMsg(): void {
		var currSelectItem: UnionDepotItem = this.depot_list.getChildAt(this.currSelectIndex) as UnionDepotItem;
		if (currSelectItem) {
			this.allotBar.onShow(currSelectItem);
			if (this.currSelectIndex > 2) {
				this.list_scroll.stopAnimation();
				this.list_scroll.viewport.scrollV = this.currSelectIndex * 140;
			}
			this.currSelectIndex = null;
		}
	}
	//是否有分配权限
	private getAuthority(): boolean {
		var myUnionData: UnionMemberInfo = DataManager.getInstance().unionManager.unionInfo.selfData;
		return myUnionData ? myUnionData.postion == UNION_POSTION.WANG
			|| myUnionData.postion == UNION_POSTION.FUBANG : false;
	}
	public getStyle(): string {
		return "bg_style1";
	}
	//The end
}
class UnionDepotItem extends eui.Component {
	private goodsitem: GoodsInstance;
	private name_label: eui.Label;
	private num_label: eui.Label;
	public allot_btn: eui.Button;
	private allot_grp: eui.Group;

	public awardItem: AwardItem;

	public constructor() {
		super();
		this.skinName = skins.UnionBattleDepotItemSkin;
	}
	public update(goods: AwardItem): void {
		this.awardItem = goods;
		this.goodsitem.onUpdate(goods.type, goods.id, 0, goods.quality, goods.num, goods.lv);
		this.name_label.textFlow = new Array<egret.ITextElement>({ text: this.goodsitem.model.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this.goodsitem.model.quality) } });
		this.num_label.text = "" + goods.num;
	}
	public onShowAllotBar(bar: UnionDepotAllotBar1): void {
		this.allot_grp.addChild(bar);
	}
	//The end
}
class UnionDepotAllotBar1 extends eui.Component {
	private shrink_btn: eui.Button;
	private member_list: eui.Group;

	private depotItem: UnionDepotItem;
	private memberItems: eui.Component[];
	private isHide: boolean = true;

	public constructor() {
		super();
		this.skinName = skins.UnionBattleAllotBarSkin;
	}

	public onShow(depotItem: UnionDepotItem): void {
		this.depotItem = depotItem;
		if (!this.isHide) {
			this.onHide();
		}
		depotItem.onShowAllotBar(this);
		this.shrink_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		var myunionInfo: MyUnionData = DataManager.getInstance().unionManager.unionInfo;
		this.memberItems = [];
		for (var i: number = 0; i < myunionInfo.unionMemberList.length; i++) {
			var memberInfo: UnionMemberInfo = myunionInfo.unionMemberList[i];
			var memberItem: eui.Component = new eui.Component();
			memberItem.skinName = skins.HeadIconItemSkin;//GameSkin.getHeadIconBar();
			memberItem["member_data"] = memberInfo;
			(memberItem["head_icon"] as eui.Image).source = GameCommon.getInstance().getBigHeadByOccpation(memberInfo.playerdata.headindex);
			(memberItem["head_frame"] as eui.Image).source = GameCommon.getInstance().getHeadFrameByIndex(memberInfo.playerdata.headFrame);
			(memberItem["name_label"] as eui.Label).text = GameCommon.getInstance().getOutServerName(memberInfo.playerdata.name);
			// (memberItem["level_label"] as eui.Label).text = (memberInfo.playerdata.rebirthLv > 0 ? memberInfo.playerdata.rebirthLv + "转" : "") + memberInfo.playerdata.level + "级";
			memberItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAllotAlert, this);
			this.memberItems.push(memberItem);
			this.member_list.addChild(memberItem);
		}
		this.isHide = false;
	}

	public onHide(): void {
		if (this.parent)
			this.parent.removeChild(this);
		this.shrink_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
		if (this.memberItems) {
			for (var i: number = this.memberItems.length - 1; i >= 0; i--) {
				var memberItem: eui.Component = this.memberItems[i];
				memberItem.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAllotAlert, this);
				if (memberItem.parent)
					memberItem.parent.removeChild(memberItem);
				this.memberItems.splice(i, 1);
			}
			this.memberItems = null;
		}
		this.isHide = true;
	}
	//打开分配界面
	private onOpenAllotAlert(event: egret.Event): void {
		var memberInfo: UnionMemberInfo = event.currentTarget["member_data"];
		// if (memberInfo)
		// 	GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionAllotAlertPanel", new UnionAllotParam(this.depotItem.awardItem, memberInfo.playerdata)));
	}
	//The end
}