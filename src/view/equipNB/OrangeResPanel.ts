/**
 * 橙装分解
 */
class OrangeResPanel extends BaseWindowPanel {
    private item_group: eui.Group;
    private item_scroll: eui.Scroller;
    private tujing_scroll: eui.Scroller;
    private tujing_group: eui.Group;
    private equip_title_lab: eui.Label;

    private item: EquipThing;
    private quality: GoodsQuality;
    private tujingItems: FastGetItem[] = [];
    private gotoTypes: number[][] = [[], [], [], [], [], [FUN_TYPE.FUN_LOTTERY, FUN_TYPE.FUN_GEREN_BOSS, FUN_TYPE.FUN_QUANMIN_BOSS], [FUN_TYPE.FUN_LOTTERY, FUN_TYPE.FUN_SHOP_SHENMI, FUN_TYPE.FUN_VIP_GIFTSHOP]];

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }

    protected onSkinName(): void {
        this.skinName = skins.OrangeResPanelSkin;
    }

    public onShowWithParam(param): void {
        this.quality = param as GoodsQuality;
        this.onShow();
    }

    protected onInit(): void {
        this.item_scroll.verticalScrollBar.autoVisibility = false;
        this.item_scroll.verticalScrollBar.visible = false;
        this.tujingItems = [];
        super.onInit();
        this.setTitle("分解");
        this.onRefresh();
    }

    protected onRefresh(): void {
        this.showOrangeEquip(null);
        let equipTitle: string = "装备列表";
        switch (this.quality) {
            case GoodsQuality.Red:
                equipTitle = "红装列表";
                break;
            case GoodsQuality.Gold:
                equipTitle = "金装列表";
                break;
        }
        this.equip_title_lab.text = equipTitle;
        /**设置获取途径**/
        this.tujing_group.removeChildren();
        let getTypes: number[] = this.gotoTypes[this.quality];
        let _length: number = Math.max(getTypes.length, this.tujingItems.length);
        for (let i: number = 0; i < _length; i++) {
            let gotype: number = getTypes[i];
            let gotypeBtn: FastGetItem;
            if (Tool.isNumber(gotype)) {
                if (this.tujingItems.length > i) {
                    gotypeBtn = this.tujingItems[i];
                } else {
                    gotypeBtn = new FastGetItem();
                    gotypeBtn.width = 350;
                    this.tujingItems.push(gotypeBtn);
                }
                gotypeBtn.scaleX = 0.8;
                gotypeBtn.scaleY = 0.8;
                gotypeBtn.data = gotype;
                this.tujing_group.addChild(gotypeBtn);
            }
        }
    }

    /**
     * 刷新橙装显示
     */
    private showOrangeEquip(event: egret.Event): void {
        this.item_group.removeChildren();
        this.item_scroll.viewport.scrollV = 0;
        //背包中的所有装备
        var bagEquips: EquipThing[] = <EquipThing[]>DataManager.getInstance().bagManager.getGoodsListByType(GOODS_TYPE.MASTER_EQUIP);
        if (!bagEquips)
            return;
        for (var i: number = 0; i < bagEquips.length; i++) {
            var equip: EquipThing = bagEquips[i];
            if (equip.quality != this.quality)
                continue;
            //显示橙装
            var item: OrangeItem = new OrangeItem();
            item.y = i * 118;
            item.data = equip;
            item.btn_res.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRes, this);
            this.item_group.addChild(item);
        }
    }

    //橙装分解
    private onRes(e: egret.Event) {
        var btn: eui.Button = e.currentTarget;
        this.item = (<OrangeItem>btn.parent).data;
        var message;
        if (this.item.quality == GoodsQuality.Gold) {
            message = new Message(MESSAGE_ID.CELESTIAL_DECOMPOSE_MESSAGE);
        } else {
            message = new Message(MESSAGE_ID.ORANGE_RES_MESSAGE);
        }
        message.setShort(1);
        message.setInt(this.item.equipId);
        GameCommon.getInstance().sendMsgToServer(message);
    }

    protected onRegist(): void {
        super.onRegist();
        for (var i: number = 0; i < this.tujingItems.length; i++) {
            var gotypeBtn: FastGetItem = this.tujingItems[i];
            gotypeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGotoItem, this);
        }
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ORANGE_RES_MESSAGE.toString(), this.showOrangeEquip, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.CELESTIAL_DECOMPOSE_MESSAGE.toString(), this.showOrangeEquip, this);
    }

    protected onRemove(): void {
        super.onRemove();
        for (var i: number = 0; i < this.tujingItems.length; i++) {
            var gotypeBtn: FastGetItem = this.tujingItems[i];
            gotypeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGotoItem, this);
        }
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ORANGE_RES_MESSAGE.toString(), this.showOrangeEquip, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.CELESTIAL_DECOMPOSE_MESSAGE.toString(), this.showOrangeEquip, this);
    }

    private getPlayerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }

    private getModelOrangeById(id: number): Modelhongzhuang {
        return JsonModelManager.instance.getModelhongzhuang()[id];
    }

    private onTouchGotoItem(e: egret.Event): void {
        var item: FastGetItem = e.currentTarget as FastGetItem;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), item.gotype);
        this.onHide();
    }
}

class OrangeItem extends eui.Component {
    private _data: EquipThing;
    private equip_icon: eui.Image;
    private equip_frame: eui.Image;
    // private equip_back: eui.Image;
    private label_lv: eui.Label;
    private label_name: eui.Label;
    private label_num: eui.Label;
    private label_suipian: eui.Label;
    private label_fenjie: eui.Label;
    public btn_res: eui.Button;
    public constructor() {
        super();
        this.skinName = skins.OrangeItemSkin;
    }
    public set data(data: EquipThing) {
        this._data = data;
        this.onUpdate();
    }
    public get data() {
        return this._data;
    }
    public onUpdate() {
        var model: ModelThing = this._data.model;
        if (!model)
            return;
        var costmodel: ModelThing;
        if (this._data.quality == GoodsQuality.Red) {
            costmodel = GameCommon.getInstance().getThingModel(GOODS_TYPE.ITEM, GoodsDefine.ITEM_ID_CZSP);
            var orangeModel: Modelhongzhuang = JsonModelManager.instance.getModelhongzhuang()[model.coatardLv - 1];
            this.label_num.text = orangeModel.hecheng + "";
        } else if (this._data.quality == GoodsQuality.Gold) {
            costmodel = GameCommon.getInstance().getThingModel(GOODS_TYPE.ITEM, GoodsDefine.ITEM_ID_TSSP);
            var goldModel: Modeltianshenzhuangbei = JsonModelManager.instance.getModeltianshenzhuangbei()[model.coatardLv][0];
            this.label_num.text = goldModel.costNum + "";
        }
        this.label_suipian.text = costmodel.name;
        this.equip_icon.source = model.icon;
        this.equip_frame.source = GameCommon.getInstance().getIconFrame(this._data.quality);
        this.label_lv.text = model.coatardLv + Language.instance.getText("grade");
        this.label_name.text = model.name;
    }
}