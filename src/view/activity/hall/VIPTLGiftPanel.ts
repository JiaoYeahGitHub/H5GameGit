class VIPTLGiftPanel extends BaseWindowPanel {
    private goodsLayer: eui.Group;
    private label_goldbind: eui.Label;
    private label_recharge: eui.Label;
    private label_endTime: eui.Label;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.VIPTLGiftPanelSkin;
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
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.VIPTLGIFT_TO_BUY_MESSAGE.toString(), this.onRefresh, this);
        // this.examineCD(true);
    }
    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateCurrency, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.VIPTLGIFT_TO_BUY_MESSAGE.toString(), this.onRefresh, this);
        // this.examineCD(false);
    }
    public onCountDown() {
        // var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.VIPTLGIFT);
        // if (time > 0) {
        // } else {
        //     time = 0;
        //     this.examineCD(false);
        // }
        // this.onShowCD(time);
    }
    public onShowCD(time: number) {
        // this.label_endTime.text = "活动结束剩余时间：" + GameCommon.getInstance().getTimeStrForSec1(time, 3);
    }
    private onupdateCurrency(event: egret.Event = null): void {
        this.label_goldbind.text = GameCommon.getInstance().getFormatNumberShow(DataManager.getInstance().playerManager.player.money);
        var vipLv: number = DataManager.getInstance().playerManager.player.viplevel;
        this.label_endTime.text = "当前VIP等级：" + GameCommon.getInstance().getVipName(vipLv);
    }
    private onGetBtn(event: TouchEvent): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
    }
    protected onRefresh(): void {
        // this.examineCD(true);
        this.onShowGoodsLayer();
        this.onupdateCurrency();
    }
    private onShowGoodsLayer() {
        var item: VipTLGiftItem;
        this.goodsLayer.removeChildren();
        // var data = DataManager.getInstance().vipTLGiftManager.getGoodsByRound();
        // for (var key in data) {
        //     item = new VipTLGiftItem();
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
class VipTLGiftItem extends eui.Component {
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
    private vipBuy: VipBuyItem;
    private label_hint: eui.Label;
    public constructor() {
        super();
        // this.skinName = skins.VipTLGiftItemSkin;
        this.btn_recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRecharge, this);
    }
    public onUpdate(model) {
        this.model = model;
        this.bml_discount.text = model.discount.toString();
        var award: AwardItem = model.goods;
        var thing = GameCommon.getInstance().getThingModel(award.type, award.id);
        var quality = award.quality >= 0 ? award.quality : thing.quality;
        this.img_icon.source = thing.icon;
        this.label_name.textFlow = new Array<egret.ITextElement>(
            { text: thing.name, style: { "textColor": GameCommon.getInstance().CreateNameColer(thing.quality) } },
            { text: "*" + award.num, style: {} }
        );
        this.modelPrice = model.price;
        var price = GameCommon.getInstance().getThingModel(this.modelPrice.type, this.modelPrice.id);
        this.modeloriginal = model.yuanJia;
        var original = GameCommon.getInstance().getThingModel(this.modeloriginal.type, this.modeloriginal.id);
        this.label_original.textFlow = (new egret.HtmlTextParser).parser("<s>" + this.modeloriginal.num + "</s>");
        this.label_current.text = "" + this.modelPrice.num;

        this.pay_icon.source = original.icon;
        this.pay_iconCurr.source = price.icon;

        var data: TLShopData = DataManager.getInstance().vipTLGiftManager.record[model.id];
        var vipLv: number = DataManager.getInstance().playerManager.player.viplevel;
        this.vipBuy = this.model.vip[vipLv];
        var buyTime: number = 0;
        var maxTime: number = 0;
        if (data) {
            buyTime = data.num;
        }
        if (this.vipBuy) {
            maxTime = this.vipBuy.max;
        }
        if (this.vipBuy && data && buyTime >= maxTime && maxTime != 0) {
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

        var needVip: number = 0;
        for (var i: number = 0; i < VipDefine.MAX_VIPLEVEL; i++) {
            if (this.model.vip[i]) {
                needVip = i;
                break;
            }
        }
        needVip = GameCommon.getInstance().getVipName(needVip);
        if (!this.vipBuy || this.vipBuy.lv > vipLv) {
            this.label_hint.textFlow = new Array<egret.ITextElement>(
                { text: `提升到VIP${needVip}可购买`, style: { "textColor": 0xe63232 } }
            );
        } else {
            if (buyTime >= maxTime) {
                this.label_hint.textFlow = new Array<egret.ITextElement>(
                    { text: `提升VIP增加次数`, style: { "textColor": 0xe63232 } }
                );
            } else {
                this.label_hint.textFlow = new Array<egret.ITextElement>(
                    { text: ` 可购买次数: ${maxTime - buyTime}/${maxTime}`, style: { "textColor": 0xFFFFFF } }
                );
            }
        }

    }
    private onTouchBtnRecharge(): void {
        var vipLv: number = DataManager.getInstance().playerManager.player.viplevel;
        if (!this.vipBuy || this.vipBuy.lv > vipLv) {
            GameCommon.getInstance().addAlert("未达到购买VIP等级");
            return;
        }
        var price = GameCommon.getInstance().getThingModel(this.modelPrice.type, this.modelPrice.id);
        var list = [{ text: "是否花费" + this.modelPrice.num + price.name + "购买此商品", style: {} }];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("AlertFrameUI", new AlertFrameParam(list, this.onSendMessage, this))
        );
    }
    private onSendMessage(): void {
        var message = new Message(MESSAGE_ID.VIPTLGIFT_TO_BUY_MESSAGE);
        message.setInt(this.model.id);
        message.setInt(1);
        GameCommon.getInstance().sendMsgToServer(message);
    }
}