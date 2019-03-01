class TLShopPanel extends BaseWindowPanel {
    private goodsLayer: eui.Group;
    private label_gold: eui.Label;
    private label_recharge: eui.Label;
    private label_endTime: eui.Label;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.TLShopPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        GameCommon.getInstance().addUnderlineStr(this.label_recharge, "充值");
        this.label_recharge.touchEnabled = true;
        this.label_recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateCurrency, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TLSHOP_TO_BUY_MESSAGE.toString(), this.onRefresh, this);
        this.examineCD(true);
    }
    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateCurrency, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TLSHOP_TO_BUY_MESSAGE.toString(), this.onRefresh, this);
        this.examineCD(false);
    }
    public onCountDown() {
        // var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.TLSHOP);
        // if (time > 0) {
        // } else {
        //     time = 0;
        //     this.examineCD(false);
        // }
        // this.onShowCD(time);
    }
    public onShowCD(time: number) {
        this.label_endTime.text = "活动结束剩余时间：" + GameCommon.getInstance().getTimeStrForSec1(time, 3);
    }
    private onupdateCurrency(event: egret.Event = null): void {
        this.label_gold.text = DataManager.getInstance().playerManager.player.gold + "";
    }
    private onGetBtn(event: TouchEvent): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
    }
    protected onRefresh(): void {
        this.examineCD(true);
        this.onShowGoodsLayer();
        this.onupdateCurrency();
    }
    private onShowGoodsLayer() {
        var item: TLShopItem;
        this.goodsLayer.removeChildren();
        // var data = DataManager.getInstance().tLShopManager.getGoodsByRound();
        // for (var key in data) {
        //     item = new TLShopItem();
        //     item.onUpdate(data[key]);
        //     this.goodsLayer.addChild(item);
        // }
    }
    public examineCD(open: boolean) {
        if (open) {
            Tool.addTimer(this.onCountDown, this, 1000);
        } else {
            Tool.removeTimer(this.onCountDown, this, 1000);
        }
    }
}
class TLShopItem extends eui.Component {
    private btn_recharge: eui.Button;
    private bml_discount: eui.BitmapLabel;
    private img_icon: eui.Image;
    private label_name: eui.Label;
    private label_original: eui.Label;
    private label_current: eui.Label;
    private sellOutLayer: eui.Group;
    private modeloriginal: AwardItem;
    private modelPrice: AwardItem;
    private model;
    private pay_iconCurr: eui.Image;
    private pay_icon: eui.Image;
    private originalLayer: eui.Group;
    private shape: egret.Shape;
    private touchLayer: eui.Group;
    private thing;
    public constructor() {
        super();
        // this.skinName = skins.TLShopItemSkin;
        this.btn_recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRecharge, this);
        this.touchLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouch, this);
    }
    public onUpdate(model) {
        this.model = model;
        this.bml_discount.text = model.discount.toString();
        var award: AwardItem = model.goods;
        this.thing = GameCommon.getInstance().getThingModel(award.type, award.id);
        var quality = award.quality >= 0 ? award.quality : this.thing.quality;
        this.img_icon.source = this.thing.icon;
        this.label_name.textFlow = new Array<egret.ITextElement>(
            { text: this.thing.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(this.thing.quality) } },
            { text: "*" + award.num, style: {} }
        );
        this.modelPrice = model.price;
        var price = GameCommon.getInstance().getThingModel(this.modelPrice.type, this.modelPrice.id);
        this.modeloriginal = model.yuanJia;
        var original = GameCommon.getInstance().getThingModel(this.modeloriginal.type, this.modeloriginal.id);
        this.label_original.textFlow = (new egret.HtmlTextParser).parser("<s>" + this.modeloriginal.num + "</s>");
        this.label_current.text = "" + this.modelPrice.num;

        // this.pay_icon.source = original.payIcon;
        // this.pay_iconCurr.source = price.payIcon;

        var data: TLShopData = DataManager.getInstance().tLShopManager.record[model.id];
        if (data && data.num >= model.max) {
            this.btn_recharge.label = "已购买";
            GameCommon.getInstance().onButtonEnable(this.btn_recharge, false);
            this.sellOutLayer.visible = true;
        } else {
            this.btn_recharge.label = "购买";
            GameCommon.getInstance().onButtonEnable(this.btn_recharge, true);
            this.sellOutLayer.visible = false;
        }
        if (!this.shape) {
            this.shape = new egret.Shape();
            this.originalLayer.addChild(this.shape);
        }
        this.shape.graphics.clear();
        this.shape.graphics.lineStyle(1, 0xFF0000);
        this.shape.graphics.moveTo(0, this.originalLayer.height / 2);
        this.shape.graphics.lineTo(this.originalLayer.width, this.originalLayer.height / 2);
        // this.pay_icon.source = this.pay_iconCurr.source = price.dropicon;
    }
    private onTouchBtnRecharge(): void {
        var price = GameCommon.getInstance().getThingModel(this.modelPrice.type, this.modelPrice.id);
        var list = [{ text: "是否花费" + this.modelPrice.num + price.name + "购买此商品", style: {} }];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("AlertFrameUI", new AlertFrameParam(list, this.onSendMessage, this))
        );
    }
    private onTouch(): void {
        if (this.thing) {
            var base: ThingBase = new ThingBase(this.thing.type);
            base.onupdate(this.thing.id, this.thing.quality, 0);
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                new WindowParam("ItemIntroducebar",
                    new IntroduceBarParam(INTRODUCE_TYPE.IMG, this.thing.type, base, 0)
                )
            );
        }
    }
    private onSendMessage(): void {
        var message = new Message(MESSAGE_ID.TLSHOP_TO_BUY_MESSAGE);
        message.setInt(this.model.id);
        message.setInt(1);
        GameCommon.getInstance().sendMsgToServer(message);
    }
}