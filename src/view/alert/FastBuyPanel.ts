// TypeScript file
class FastBuyPanel extends BaseWindowPanel {
    private thingmodel: ModelThing;
    // private goods_name_label: eui.Label;
    private goods_item: GoodsInstance;
    // private goods_num: eui.Label;
    // private money_icon: eui.Image;
    // private money_num_label: eui.Label;
    // private buy_countmax_label: eui.Label;
    private batch_bar: BatchDisposebar;
    private total_money_icon: eui.Image;
    private totalmoney_num_label: eui.Label;
    private has_money_icon: eui.Image;
    private hasmoney_num_label: eui.Label;
    private buy_btn: eui.Button;
    // private close_btn: eui.Button;
    private tujingbtn_group: eui.Group;
    // private Max_MoneyTypes: number = 2;//最多支持两种货币类型
    private buyShopModel: Modelshop;
    private buyPrice: AwardItem[];
    private tujingBtns: FastGetItem[];
    private label_attention: eui.Button;
    // private getGrp: eui.Group;
    // private label_get: eui.Label;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    // private isBuyPanel:boolean = true;
    public constructor(owner: ModuleLayer) {
        super(owner);
        this.tujingBtns = [];
    }
    protected onSkinName(): void {
        this.skinName = skins.FastBuyPanelSkin;
    }
    public onShowWithParam(param: ModelThing): void {
        this.thingmodel = param;
        if (this.thingmodel) {
            this.onShow();
        }
    }
    protected onRegist(): void {
        super.onRegist();
        // this.close_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        // this.getGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        this.buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyItem, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateHasMoney, this);
        this.batch_bar.onRegist();
    }
    protected onRemove(): void {
        super.onRemove();
        for (var i: number = 0; i < this.tujingBtns.length; i++) {
            var gotypeBtn: FastGetItem = this.tujingBtns[i];
            gotypeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGotoItem, this);
        }
        this.batch_bar.onRemove();
        // this.getGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        this.buy_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyItem, this);
        // this.close_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateHasMoney, this);
    }
    protected onInit(): void {
        super.onInit();
        // this.isBuyPanel = true;
        // this.setTitle("shop_bml_hqtj_png");
        this.batch_bar.onSetUpdateCall(this.onBatchUpdateHandler, this);
        // this.label_get.text = Language.instance.getText("huoqutujing");
        // GameCommon.getInstance().addUnderline(this.label_get);
        // this.label_get.touchEnabled = true;
        this.onRefresh();
    }
    protected onRefresh(): void {
        //从商场里找到对应的道具
        this.buyShopModel = null;
        if (Tool.isNumber(this.thingmodel.id)) {
            var item: AwardItem;
            for (var shopId in JsonModelManager.instance.getModelshop()) {
                var shopModel: Modelshop = JsonModelManager.instance.getModelshop()[shopId];
                item = GameCommon.parseAwardItem(shopModel.item);
                if (item.id == this.thingmodel.id && item.type == this.thingmodel.type && (shopModel.shopType == SHOP_TYPE.DAOJU)) {
                    this.buyShopModel = shopModel;
                    this.buyPrice = GameCommon.getInstance().onParseAwardItemstr(shopModel.price);
                    break;
                }
            }
        }

        this.goods_item.onUpdate(this.thingmodel.type, this.thingmodel.id, 0, this.thingmodel.quality);
        // this.goods_name_label.text = this.thingmodel.name;
        // this.goods_name_label.textColor = GameCommon.getInstance().CreateNameColer(this.thingmodel.quality);
        var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(this.thingmodel.id);
        var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
        // this.goods_num.text = "当前拥有：" + _hasitemNum;

        if (this.buyShopModel) {
            this.currentState = "buy";
            this.setTitle("快速购买");
            var moneyModel: ModelThing = GameCommon.getInstance().getThingModel(this.buyPrice[0].type, null);
            // this.money_icon.source = moneyModel.dropicon;
            this.total_money_icon.source = moneyModel.dropicon;
            this.has_money_icon.source = moneyModel.dropicon;
            // this.money_num_label.text = this.buyShopModel.price[0].num + "";
            var batchParam: BatchParam = new BatchParam();

            batchParam.maxNum = Math.max(1, Math.floor(DataManager.getInstance().playerManager.player.getICurrency(this.buyPrice[0].type) / this.buyPrice[0].num));
            this.batch_bar.onUpdate(batchParam);
            this.onBatchUpdateHandler();
            this.onupdateHasMoney();
        } else {
            this.setTitle("获取途径");
            this.currentState = "get";
        }
        this.onUpdateTujing();
    }
    private onGetBtn(event: TouchEvent): void {
        // this.isBuyPanel = false;
        this.onRefresh();
    }
    //更新获取途径
    private onUpdateTujing(): void {
        this.tujingbtn_group.removeChildren();
        for (var i: number = 0; i < this.thingmodel.tujing.length; i++) {
            var gotype: number = this.thingmodel.tujing[i];
            if (gotype <= 0)
                continue;
            // if (!FunDefine.isFunOpen(gotype)) continue;
            if (this.tujingBtns.length == i) {
                var createTujingBtn: FastGetItem = new FastGetItem();
                this.tujingBtns.push(createTujingBtn);
            }
            var gotypeBtn: FastGetItem = this.tujingBtns[i];
            gotypeBtn.data = gotype;
            gotypeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGotoItem, this);
            gotypeBtn.scaleX = 0.8;
            gotypeBtn.scaleY = 0.8;
            this.tujingbtn_group.addChild(gotypeBtn);
        }
        if (this.tujingbtn_group.numChildren > 0) {
            this.label_attention.visible = false;
        } else {
            this.label_attention.visible = true;
        }
    }
    //购买物品
    private onBuyItem(event: egret.Event): void {
        var buyNum: number = this.batch_bar.count;
        var consumeMoney: number = this.buyPrice[0].num * buyNum;
        var hasNum: number = DataManager.getInstance().playerManager.player.getICurrency(this.buyPrice[0].type)
        if (consumeMoney > hasNum) {
            // GameCommon.getInstance().addAlert(TextDefine.Game_Common_Word["money_have_not"]);
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
            return;
        }
        var message = new Message(MESSAGE_ID.PLAYER_BUY_SHOP_GOODS_MESSAGE);
        message.setByte(this.buyShopModel.shopType);
        message.setInt(this.buyShopModel.id);
        message.setInt(buyNum);
        GameCommon.getInstance().sendMsgToServer(message);
        this.onHide();
    }
    //数量回调
    private onBatchUpdateHandler(): void {
        if (this.buyShopModel)
            this.totalmoney_num_label.text = this.batch_bar.count * this.buyPrice[0].num + "";
    }
    //货币更新
    private onupdateHasMoney(): void {
        if (this.buyShopModel)
            this.hasmoney_num_label.text = DataManager.getInstance().playerManager.player.getICurrency(this.buyPrice[0].type) + "";
    }
    private onTouchGotoItem(e: egret.Event): void {
        var item: FastGetItem = e.currentTarget as FastGetItem;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), item.gotype);
        this.onHide();
    }
    //The end
}
class StrongerButton extends eui.Button {
    public gotype: number = 0;
    private buttonIcon: eui.Image;
    private unopen_group: eui.Group;
    private level_limit_label: eui.Label;

    public constructor() {
        super();
        this.skinName = skins.Bianqiang_ButtonSkin;
    }
    public registGotype(goType: number): void {
        this.gotype = goType;
        this.buttonIcon.source = this.model.icon;

        this.addGotypeEventListener();
    }
    public onCheackLvLimit(): void {
        this.unopen_group.visible = false;
        if (!FunDefine.isFunOpen(this.gotype)) {
            this.unopen_group.visible = true;
            if (this.model.days > 0) {
                this.level_limit_label.text = "第" + this.model.days + "天开启";
            } else if (this.model.jingjie > 0) {
                this.level_limit_label.text = this.model.jingjie + "阶开启";
            } else {
                this.level_limit_label.text = this.model.level + "级开启";
            }
        }
    }
    public get model(): ModelfunctionLv {
        return JsonModelManager.instance.getModelfunctionLv()[this.gotype];
    }
    public addGotypeEventListener(): void {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
        // this.onCheackLvLimit();
    }
    public removeGotypeEventListener(): void {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
    }
    private onTouchBtn(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), this.gotype);
    }
    //The end
}
class FastGetItem extends BaseComp {
    private desc: eui.Label;
    private goBtn: eui.Button;
    constructor() {
        super();
    }
    protected setSkinName(): void {
        this.skinName = skins.FastGetItemSkin;
    }
    public dataChanged(): void {
        var model: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[this.gotype];
        if (model) {
            this.goBtn.label = model.desc;
        }
    }
    public get gotype(): number {
        return this._data;
    }
}