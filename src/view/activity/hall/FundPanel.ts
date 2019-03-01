class FundPanel extends BaseTabView {
    private awardLayer: eui.Group;
    private btn_obtain: eui.Button;
    private items: FundItem[];

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.FundPanelSkin;
    }
    protected onInit(): void {
        this.items = [];
        var models: Modelfund = JsonModelManager.instance.getModelfund();
        var item: FundItem;
        var model: Modelfund;
        for (var key in models) {
            model = models[key];
            item = new FundItem(model);
            this.items.push(item);
        }
        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_obtain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnObtain, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.INVEST_TO_OBTAIN_MESSAGE.toString(), this.onRefresh, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_obtain.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnObtain, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.INVEST_TO_OBTAIN_MESSAGE.toString(), this.onRefresh, this);
    }
    protected onRefresh(): void {
        this.onShowAward();
        if (DataManager.getInstance().investManager.fundBuy) {
            this.btn_obtain.label = "已购买"
            this.btn_obtain.enabled = false;
        }
    }
    private onShowAward(): void {
        var fundArray: number[] = DataManager.getInstance().investManager.fundReward;
        this.awardLayer.removeChildren();
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].onUpdate();
            if (fundArray[this.items[i].model.id - 2] == 0) {
                this.awardLayer.addChild(this.items[i]);
            }
        }
    }

    private onTouchBtnObtain(e: egret.Event): void {
        if (this.btn_obtain.label == "已购买")
            return;
        var amount = 198;
        var goodsName = "基金";
        SDKManager.pay(
            {
                goodsName: goodsName,
                amount: amount,
                playerInfo: DataManager.getInstance().playerManager.player
            },
            new BasePayContainer(this));
    }

    private getPlayerData() {
        return DataManager.getInstance().playerManager.player.getPlayerData(0);
    }

}
class FundItem extends BaseComp {
    private desc: eui.Label;
    private btn_receive: eui.Button;

    public model: Modelfund;
    private points: redPoint[];

    public constructor(model: Modelfund) {
        super();
        this.model = model;
        this.skinName = skins.FundItemSkin;
    }
    protected onInit(): void {
        this.points = RedPointManager.createPoint(1);
        this.btn_receive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.getReward, this);
        this.points[0].register(this.btn_receive, GameDefine.RED_BTN_POS_YELLOW_LITTLE, this, "checkRedPoint");
        this.desc.text = this.model.desc;
        this.onUpdate();
    }

    public onUpdate() {
        if (!this.isLoaded) return;
        if (DataManager.getInstance().playerManager.player.getPlayerData().coatardLv < this.model.id) {
            //境界不足是否需要显示
            this.btn_receive.label = "未完成";
            this.btn_receive.enabled = false;
        } else if (!DataManager.getInstance().investManager.fundBuy) {
            this.btn_receive.label = "未购买";
            this.btn_receive.enabled = false;
        } else {
            this.btn_receive.label = "领取";
            this.btn_receive.enabled = true;
        }

        this.trigger();
    }

    private getReward() {
        var message = new Message(MESSAGE_ID.INVEST_TO_OBTAIN_MESSAGE);
        message.setShort(this.model.id);
        GameCommon.getInstance().sendMsgToServer(message);
    }

    private checkRedPoint() {
        return this.btn_receive.enabled;
    }

    private trigger() {
        if (this.points) {
            this.points[0].checkPoint();
        }
    }
}
