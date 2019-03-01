class BagTypePanel extends BaseTabView {
	private itemGroup: eui.List;
	private itemDatas: ThingBase[];
	private bag_Scroller: eui.Scroller;
	private currNum: eui.Label;
	private maxNum: eui.Label;
	private get_label: eui.Label;
	private capacityGroup: eui.Group;
	private btn_ronglian: eui.Group;
	public static types: number[][] = [[GOODS_TYPE.MASTER_EQUIP, GOODS_TYPE.SERVANT_EQUIP], [GOODS_TYPE.ITEM, GOODS_TYPE.BOX], [GOODS_TYPE.RNUES]];
	protected points: redPoint[] = RedPointManager.createPoint(1);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BagPanelSkins;
	}
	protected onInit(): void {
		this.bag_Scroller.verticalScrollBar.autoVisibility = true;
		this.bag_Scroller.verticalScrollBar.visible = true;
		this.itemGroup.itemRenderer = BagItemRenderer;
		this.itemGroup.itemRendererSkinName = skins.BagItemRendererSkin;
		this.itemGroup.useVirtualLayout = true;
		this.bag_Scroller.viewport = this.itemGroup;

		GameCommon.getInstance().addUnderlineGet(this.get_label);
		this.points[0].register(this.btn_ronglian, new egret.Point(100, -10), DataManager.getInstance().bagManager, "getEquipSmeltPointShow");

		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		this.onchangeTabIndex(this.owner[`index`]);
	}
	protected onRegist(): void {
		super.onRegist();
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE, this.onMsgUpdate, this);
		this.btn_ronglian.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenSmeltView, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.UPDATE_BAG_UPPERLIMIT.toString(), this.onUpperlimit, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE, this.onMsgUpdate, this);
		this.btn_ronglian.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenSmeltView, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.UPDATE_BAG_UPPERLIMIT.toString(), this.onUpperlimit, this);
		this.itemGroup.dataProvider = null;
	}
	private onMsgUpdate(event: egret.Event): void {
		this.onchangeTabIndex(this.owner[`index`]);
	}
	private onUpperlimit(): void {
		this.maxNum.text = DataManager.getInstance().bagManager.equipMax + "";
		// this.onchangeTabIndex(this.owner[`index`]);
	}
	//打开熔炼面板
	private onOpenSmeltView(): void {
		// GameDispatcher.getInstance().dispatchEvent(
		// 	new egret.Event(GameEvent.MODULE_WINDOW_CLOSE),
		// 	"BagPanel"
		// );
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "SmeltPanel");
	}
	private onchangeTabIndex(index: number): void {
		var bag: BagManager = DataManager.getInstance().bagManager;
		if (index == 2) {
			this.itemDatas = bag.getAllRunes();
		}
		else {
			this.itemDatas = bag.getGoodsListByTypes(BagTypePanel.types[index]);
		}

		if (this.itemDatas)
			this.currNum.text = this.itemDatas.length + "";
		else
			this.currNum.text = "0";

		while (this.itemDatas.length < 30) {
			this.itemDatas.push(null);
		}
		switch (index) {
			case 0:
				this.capacityGroup.visible = true;
				this.maxNum.text = bag.equipMax + "";
				break;
			case 1:
				this.capacityGroup.visible = false;
				break;
			case 2:
				this.capacityGroup.visible = false;
				break;
		}
		this.onupdateItemData();
	}
	private onupdateItemData(): void {
		this.itemGroup.dataProvider = new eui.ArrayCollection(this.itemDatas);
		this.bag_Scroller.viewport.scrollV = 0;
	}
}
class BagItemRenderer extends BaseListItem {
	private goods: BagInstance;
	private point: redPoint;
	constructor() {
		super();
	}
	protected onComplete(): void {
	}
	protected onUpdate(): void {
		if (this.data) {
			this.goods.onThing(this.data);
			this.goods.num_label.bottom = 40;
			if (this.data.type == GOODS_TYPE.BOX) {//称号不显示红点
				let modelbox: Modelbox = JsonModelManager.instance.getModelbox()[this.data.modelId];
				if (modelbox && modelbox.type != 2) {
					if (!this.point) {
						this.point = new redPoint();
					}
					this.point.register(this, GameDefine.RED_GOODSINSTANCE_POS, DataManager.getInstance().bagManager, "getItemCanUsePointShowByUID", this.data.modelId);
				} else {
					if (this.point) {
						this.point.point.visible = false;
					}
				}
			} else {
				if (this.point) {
					this.point.point.visible = false;
				}
			}
		} else {
			this.goods.onReset();
		}
	}
}