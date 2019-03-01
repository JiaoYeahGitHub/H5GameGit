class EquipDepotPanel extends BaseTabView {
    private bag_Scroller: eui.Scroller;
    private btn_takeOut: eui.Button;
    private bagLayer: eui.List;
    protected points: redPoint[] = RedPointManager.createPoint(1);
    public constructor(owner) {
        super(owner);
    }

    protected onSkinName(): void {
        this.skinName = skins.EquipDepotPanelSkin;
    }

    protected onInit(): void {
        this.bag_Scroller.verticalScrollBar.autoVisibility = true;
        this.bag_Scroller.verticalScrollBar.visible = true;
        this.bagLayer.itemRenderer = DepotItemRenderer;
        this.bagLayer.itemRendererSkinName = skins.BagItemRendererSkin;
        this.bagLayer.useVirtualLayout = true;
        this.bag_Scroller.viewport = this.bagLayer;

        this.points[0].register(this.btn_takeOut, GameDefine.RED_BTN_POS, DataManager.getInstance().celestialManager, "checkDepotPoint");
        super.onInit();
        this.onRefresh();
    }

    protected onRegist(): void {
        super.onRegist();
        this.btn_takeOut.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.WAREHOUSE_TAKEOUT_MESSAGE.toString(), this.onRefresh, this);
    }

    protected onRemove(): void {
        super.onRemove();
        this.btn_takeOut.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.WAREHOUSE_TAKEOUT_MESSAGE.toString(), this.onRefresh, this);
    }

    protected onRefresh(): void {
        var data = DataManager.getInstance().celestialManager.warehouse;
        var items: ThingBase[] = [];
        for (var key in data) {
            var item: ThingBase = new ThingBase(data[key].type, data[key].id, data[key].num);
            item.quality = data[key].quality;
            items.push(item);
        }
        this.bagLayer.dataProvider = new eui.ArrayCollection(items);
        this.bag_Scroller.viewport.scrollV = 0;
    }
    private onTouchBtn(): void {
        if (!DataManager.getInstance().celestialManager.checkDepotPoint()) return;
        if (DataManager.getInstance().bagManager.getIsFullBag()) {
            GameCommon.getInstance().addAlert("背包已满");
            return;
        }
        DataManager.getInstance().celestialManager.onSendTakeOutMessage();
    }
}
class DepotItemRenderer extends BaseListItem {
    private goods: BagInstance;
    constructor() {
        super();
    }
    protected onComplete(): void {
        this.goods.touchEnabled = false;
        this.goods.touchChildren = false;
    }
    protected onUpdate(): void {
        if (this.data) {
            this.goods.onThing(this.data);
            this.goods.num_label.bottom = 40;
            if (this.data.type == GOODS_TYPE.MASTER_EQUIP || this.data.type == GOODS_TYPE.SERVANT_EQUIP) {
                this.goods.name_label.text = this.data.model.coatardLv + Language.instance.getText("grade");
            }
        } else {
            this.goods.onReset();
        }
    }
    //The end
}