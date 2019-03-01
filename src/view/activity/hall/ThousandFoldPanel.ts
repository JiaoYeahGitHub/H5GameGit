class ThousandFoldPanel extends BaseWindowPanel {
    private awardLayer: eui.Group;
    private img_banner: eui.Image;
    private btn_buy: eui.Button;
    private tab: number = 1;
    public static REBATE_MAX_GEARS: number = 5;
    private label_gold: eui.Label;
    private label_recharge: eui.Label;
    private label_title: eui.Label;
    private sell_null_img: eui.Image;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ThousandFoldPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        GameCommon.getInstance().addUnderlineStr(this.label_recharge, "充值");
        this.label_recharge.touchEnabled = true;
        this.label_recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        for (var i: number = 0; i < ThousandFoldPanel.REBATE_MAX_GEARS; i++) {
            // var model: ModelRebateQianbei = ModelManager.getInstance().modelRebateQianbei[i + 1];
            // if (model) {
            //     (this["tab_" + i] as eui.RadioButton).parent.visible = true;
            //     (this["label_tab" + i] as eui.Label).text = `${model.price}元宝`;
            // } else {
            //     (this["tab_" + i] as eui.RadioButton).parent.visible = false;
            // }
        }
        this.onRefreshTab(1);
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        for (var i: number = 0; i < ThousandFoldPanel.REBATE_MAX_GEARS; i++) {
            (this["tab_" + i] as eui.RadioButton).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
        }
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnBuy, this);
       // GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBATE_TO_BUY_MESSAGE.toString(), this.onBuySuccess, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateCurrency, this);
    }
    protected onRemove(): void {
        super.onRemove();
        for (var i: number = 0; i < ThousandFoldPanel.REBATE_MAX_GEARS; i++) {
            (this["tab_" + i] as eui.RadioButton).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
        }
        this.btn_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnBuy, this);
        //GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBATE_TO_BUY_MESSAGE.toString(), this.onBuySuccess, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateCurrency, this);
    }
    private onupdateCurrency(event: egret.Event = null): void {
        this.label_gold.text = DataManager.getInstance().playerManager.player.gold + "";
    }
    private onTouchBtnBuy(): void {
        this.onSendMessage();
    }
    private onGetBtn(event: TouchEvent): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
    }
    private onSendMessage(): void {
        if (this.tab > ThousandFoldPanel.REBATE_MAX_GEARS) return;
        // var message = new Message(MESSAGE_ID.REBATE_TO_BUY_MESSAGE);
        // message.setByte(this.tab);
        // message.setInt(ACTIVITY_BRANCH_TYPE.REBATE2);
        // GameCommon.getInstance().sendMsgToServer(message);
    }
    protected onRefresh(): void {
        this.onupdateCurrency();
    }
    private onBuySuccess(): void {
        if (this.tab < ThousandFoldPanel.REBATE_MAX_GEARS) {
            var data = DataManager.getInstance().rebateManager.qianbei_record;
            for (var i: number = this.tab + 1; i <= ThousandFoldPanel.REBATE_MAX_GEARS; i++) {
                if (!data[i]) {
                    this.tab = i;
                    break;
                }
            }
        }
        this.onRefreshTab(this.tab);
    }
    private onRefreshTab(tabNum: number): void {
        if (tabNum < 0 || tabNum > ThousandFoldPanel.REBATE_MAX_GEARS) return;
        this.tab = tabNum;
        (this["tab_" + (this.tab - 1)] as eui.RadioButton).selected = true;
        var award: AwardItem;
        var goods: GoodsInstance;

        // var model: ModelRebateQianbei = ModelManager.getInstance().modelRebateQianbei[this.tab];
        // if (model) {
        //     // this.img_banner.source = "rebate_banner_" + model.id + "_jpg";
        //     this.awardLayer.removeChildren();
        //     (this.awardLayer.layout as eui.TileLayout).requestedColumnCount = model.rewards.length > 6 ? 4 : 3;
        //     for (var i: number = 0; i < model.rewards.length; i++) {
        //         award = model.rewards[i];
        //         goods = new GoodsInstance();
        //         goods.scaleX = goods.scaleY = 0.8;
        //         goods.onUpdate(award.type, award.id, 0, award.quality, award.num);
        //         this.awardLayer.addChild(goods);
        //     }
        //     this.sell_null_img.visible = DataManager.getInstance().rebateManager.qianbei_record[this.tab] ? true : false;
        //     GameCommon.getInstance().onButtonEnable(this.btn_buy, !this.sell_null_img.visible);
        //     this.btn_buy.label = !this.sell_null_img.visible ? model.price + "元宝抢购" : "已售罄";
        //     this.label_title.text = model.des;
        // }
    }
    private onTouchTab(e: egret.Event): void {
        var tab: number = parseInt(e.target.value);
        if (this.tab != tab)
            this.onRefreshTab(tab);
    }
}