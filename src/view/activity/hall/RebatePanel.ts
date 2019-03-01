class RebatePanel extends BaseWindowPanel {
    private awardLayer: eui.Group;
    private img_banner: eui.Image;
    private btn_buy: eui.Button;
    private tab: number = 1;
    public static REBATE_MAX_GEARS: number = 3;
    private label_gold: eui.Label;
    private label_recharge: eui.Label;
    private label_title: eui.Label;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.RebatePanelSkin;
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
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnBuy, this);
        //GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBATE_TO_BUY_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateCurrency, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnBuy, this);
        //GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBATE_TO_BUY_MESSAGE.toString(), this.onRefresh, this);
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
        if (this.tab > RebatePanel.REBATE_MAX_GEARS) return;
        // var message = new Message(MESSAGE_ID.REBATE_TO_BUY_MESSAGE);
        // message.setByte(this.tab);
        // message.setInt(ACTIVITY_BRANCH_TYPE.REBATE);
        // GameCommon.getInstance().sendMsgToServer(message);
    }
    protected onRefresh(): void {
        var i: number;
        var award: AwardItem;
        var goods: GoodsInstance;
        var data = DataManager.getInstance().rebateManager.record;
        for (i = RebatePanel.REBATE_MAX_GEARS; i >= 1; i--) {
            if (data[i]) {
                this.tab = i + 1;
                break;
            }
        }
        // var model: ModelRebate = ModelManager.getInstance().modelRebate[this.tab];
        // if (model) {
        //     this.img_banner.source = "rebate_banner_" + model.id + "_jpg";
        //     this.awardLayer.removeChildren();
        //     (this.awardLayer.layout as eui.TileLayout).requestedColumnCount = model.rewards.length > 6 ? 4 : 3;
        //     for (i = 0; i < model.rewards.length; i++) {
        //         award = model.rewards[i];
        //         goods = new GoodsInstance();
        //         goods.scaleX = goods.scaleY = 0.8;
        //         goods.onUpdate(award.type, award.id, 0, award.quality, award.num);
        //         this.awardLayer.addChild(goods);
        //     }
        //     this.btn_buy.label = model.price + "元宝抢购";
        //     this.label_title.text = model.des;
        // }
        this.onupdateCurrency();
    }
    private onTouchTab(e: egret.Event): void {
        var tab: number = parseInt(e.target.value);
    }
}