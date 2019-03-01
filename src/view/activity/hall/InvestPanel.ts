class InvestPanel extends BaseTabView {
    private timeLab: eui.Label;
    private awardLayer: eui.List;
    private btn_obtain: eui.Button;
    private timeGroup: eui.Group;
    private scroller: eui.Scroller;

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.InvestPanelSkin;
    }
    protected onInit(): void {
        this.awardLayer.itemRenderer = InvestItem;
        this.awardLayer.itemRendererSkinName = skins.InvestItemSkin;
        this.awardLayer.useVirtualLayout = true;
        this.scroller.viewport = this.awardLayer;

        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_obtain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnObtain, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
        this.examineCD(true);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_obtain.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnObtain, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
        this.examineCD(false);
    }
    protected onRefresh(): void {
        this.onShowAward();
        if (DataManager.getInstance().newactivitysManager.isBuyInvestment) {
            this.btn_obtain.label = "已投资";
            this.btn_obtain.enabled = false;
            this.timeGroup.visible = false;
        }
    }

    private onShowAward(): void {
        var models: Modelinvest[] = [];
        var model: Modelinvest;
        for (var key in JsonModelManager.instance.getModelinvest()) {
            model = JsonModelManager.instance.getModelinvest()[key];
            models.push(model);
        }
        this.awardLayer.dataProvider = new eui.ArrayCollection(models);
    }

    private onTouchBtnObtain(e: egret.Event): void {
        if (this.btn_obtain.label == "已投资")
            return;
        var amount = 99;
        var goodsName = "投资计划";
        SDKManager.pay(
            {
                goodsName: goodsName,
                amount: amount,
                playerInfo: DataManager.getInstance().playerManager.player
            },
            new BasePayContainer(this));
    }

    public examineCD(open: boolean) {
        if (open) {
            Tool.addTimer(this.onCountDown, this, 1000);
        } else {
            Tool.removeTimer(this.onCountDown, this, 1000);
        }
    }
    public onCountDown() {
        var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.INVEST);
        if (time > 0) {
        } else {
            time = 0;
            this.examineCD(false);
        }
        this.onShowCD(time);
    }
    public onShowCD(time: number) {
        this.timeLab.text = GameCommon.getInstance().getTimeStrForSec1(time, 2);
    }
}
class InvestItem extends BaseListItem {
    private items: eui.Group;
    private days: eui.Image;

    public constructor() {
        super();
    }
    protected onUpdate() {
        let model: Modelinvest = this.data as Modelinvest;
        this.items.removeChildren();
        for (var i: number = 0; i < model.rewards.length; i++) {
            var award: AwardItem = model.rewards[i];
            var goodsInstace: GoodsInstance = new GoodsInstance();
            goodsInstace.onUpdate(award.type, award.id, 0, award.quality, award.num);
            // goodsInstace.scaleX = 0.6;
            // goodsInstace.scaleY = 0.6;
            this.items.addChild(goodsInstace);
        }
        this.days.source = "invest_item" + model.id + "_png";
    }
}
