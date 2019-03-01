class UnionBattleWarehousePanel extends BaseWindowPanel {
    private awardList: eui.List;
	private awardList1: eui.List;
	private super_awd_grp: eui.Group;
	private closeBtn2: eui.Button;
	// private list_scroll: eui.Scroller;
	private depot_list: eui.Group;
	private memberPanel: eui.Group;
	private cangkuPanel: eui.Group;
//成员列表
	private shrink_btn: eui.Button;
	private member_list: eui.Group;
	private depotItem: UnionBattleWarehouseItem;
	private memberItems: eui.Component[];
	// private allotBar: UnionDepotAllotBar;
	private cacheitemAry: UnionBattleWarehouseItem[];//缓存的仓库格子
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
	protected onInit(): void {
		// this.setTitle("function_open_title_png");
		this.cacheitemAry = [];
		super.onInit();
        this.onRefresh()
		this.cangkuPanel.visible = true;
		this.memberPanel.visible = false;
		// this.allotBar = new UnionDepotAllotBar();
	}
	protected onSkinName(): void { 
        this.skinName = skins.UnionBattleWarehousePanelSkin;
    }
	protected onRefresh(): void {
		super.onRefresh();
		this.onUpdate();
	}
	private onUpdate(): void {

    }
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UNION_BATTLE_DEPOT_MESSAGE.toString(), this.onResUnionDepotInfoMsg, this);
		this.onReqUnionDepotInfoMsg();
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UNION_BATTLE_DEPOT_MESSAGE.toString(), this.onResUnionDepotInfoMsg, this);
		this.onClearDepotList();
		// this.onCleanMemberList();
		// this.allotBar.onHide();
	}
	//请求帮会仓库的信息
	private onReqUnionDepotInfoMsg(): void {
		this.onReqMemberListMsg();
		var depotinfoMsg: Message = new Message(MESSAGE_ID.UNION_BATTLE_DEPOT_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(depotinfoMsg);
	}
	private onResUnionDepotInfoMsg(): void {
		this.onClearDepotList();
		var unionbattleInfo: UnionBattleInfo = DataManager.getInstance().unionManager.unionbattleInfo;
		// var awardItems: AwardItem[] = ModelManager.getInstance().modelUBallteSuperAwd.reward;
		// 	for (var i: number = 0; i < awardItems.length; i++) {
		// 		var goodsItem: UnionBattleWarehouseItem = new UnionBattleWarehouseItem();
		// 		var awardItem: AwardItem = awardItems[i];
		// 		goodsItem.btn_fenpei.name = "" + i;
		// 		if (this.getAuthority()) {
		// 			goodsItem.btn_fenpei.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowAllotBar, this);
		// 			GameCommon.getInstance().onButtonEnable(goodsItem.btn_fenpei, true);
		// 		} else {
		// 			// GameCommon.getInstance().onButtonEnable(goodsItem.btn_fenpei, true);
		// 		}
		// 		goodsItem.onUpdate(awardItem);
		// 		this.depot_list.addChild(goodsItem);
		// 	}

		for (var i: number = 0; i < unionbattleInfo.depotThings.length; i++) {
			var goodsItem: UnionBattleWarehouseItem =  this.onCreateDepotItem();
			goodsItem.btn_fenpei.name = "" + i;
			goodsItem.onUpdate(unionbattleInfo.depotThings[i]);
			this.depot_list.addChild(goodsItem);
			if (this.getAuthority()) {
				goodsItem.btn_fenpei.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowAllotBar, this);
				GameCommon.getInstance().onButtonEnable(goodsItem.btn_fenpei, true);
			} else {
				GameCommon.getInstance().onButtonEnable(goodsItem.btn_fenpei, false);
			}
		}
	}
	//创建一个仓库格子
	private onCreateDepotItem(): UnionBattleWarehouseItem {
		if (this.cacheitemAry.length > 0) {
			return this.cacheitemAry.shift();
		}
		return new UnionBattleWarehouseItem();
	}
	//清除仓库格子
	private onClearDepotList(): void {
		if (this.depot_list.numChildren > 0) {
			for (var i: number = this.depot_list.numChildren - 1; i >= 0; i--) {
				var depotitem: UnionBattleWarehouseItem = this.depot_list.getChildAt(i) as UnionBattleWarehouseItem;
				if (depotitem) {
					depotitem.btn_fenpei.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowAllotBar, this);
					this.depot_list.removeChild(depotitem);
					if (this.cacheitemAry.indexOf(depotitem) < 0)
						this.cacheitemAry.push(depotitem);
				}
			}
		}
	}
	//展开分配界面
	private currSelectIndex: number;
	private onShowAllotBar(event: egret.Event): void {
		var index: number = parseInt(event.currentTarget.name);
		this.currSelectIndex = index;
		// this.onReqMemberListMsg();
		var currSelectItem: UnionBattleWarehouseItem = this.depot_list.getChildAt(this.currSelectIndex) as UnionBattleWarehouseItem;
		if (currSelectItem) {
			// if (this.currSelectIndex > 2) {
			// 	this.list_scroll.stopAnimation();
			// 	this.list_scroll.viewport.scrollV = this.currSelectIndex * 140;
			// }
			this.currSelectIndex = null;
		}
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("UnionBattleMemberCangKuPanel", new UnionAllotParam1(currSelectItem.awardItem)));

	}
	//请求公会成员列表
	private onReqMemberListMsg(): void {
		DataManager.getInstance().unionManager.onReqUnionMember();
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
class UnionBattleWarehouseItem extends eui.Component  {
	private goods: BagInstance;
	public btn_fenpei: eui.Button;
	public awardItem :AwardItem;
	private desc :eui.Label
	constructor() {
        super();
        this.skinName = skins.UnionBattleWarehouseItemSkin;
    }
	public onUpdate(item:AwardItem): void {
		this.awardItem = item;
		var model = GameCommon.getInstance().getThingModel(item.type, item.id, item.quality);
		if(model)
		this.desc.text = model.des;
		this.goods.onUpdate(item.type, item.id, 0, item.quality, item.num);
    }
}