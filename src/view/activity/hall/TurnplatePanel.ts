class TurnplatePanel extends BaseWindowPanel {
    private btn_goto_pointsShop: eui.Button;
    private btn_one: eui.Button;
    private btn_ten: eui.Button;
    private label_points: eui.Label;
    private label_gold: eui.Label;
    private label_goldOne: eui.Label;
    private label_goldTen: eui.Label;
    private label_recharge: eui.Label;
    private model;
    private label_endTime: eui.Label;
    private goodsArr: GoodsInstance[];
    private first_name: eui.Label;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.TurnplatePanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        // var goods: GoodsInstance;
        // this.goodsArr = [];
        // GameCommon.getInstance().addUnderlineStr(this.label_recharge, "充值");
        // this.label_recharge.touchEnabled = true;
        // this.label_recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        // this.model = ModelManager.getInstance().modelTurnplate[TURNPLATE_TYPE.HALLACTIVITY];
        // this.label_goldOne.text = this.model.money.num.toString();
        // this.label_goldTen.text = this.model.moneyOneKey.num.toString();
        // var mdoelGain: ModelGain = ModelManager.getInstance().modelGain[this.model.gainId];
        // var data = mdoelGain.item.concat();
        // var award: AwardItem = data.shift();
        // goods = this["goods0"];
        // goods.onUpdate(award.type, award.id, 0, award.quality, award.num);
        // goods.num_label.visible = false;
        // goods.onHideName(true);
        // this.first_name.textFlow = goods.name_label.textFlow;
        // this.first_name.appendText("*" + goods.num_label.text);
        // var n: number = 0;
        // for (var i: number = 1; i < 17; i++) {
        //     goods = this["goods" + i];
        //     award = data[n];
        //     goods.onUpdate(award.type, award.id, 0, award.quality, award.num);
        //     goods.onHideName(true);
        //     this.goodsArr.push(goods);
        //     n++;
        //     if (n == data.length) {
        //         n = 0;
        //     }
        // }
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().onButtonEnable(this.btn_one, true);
        GameCommon.getInstance().onButtonEnable(this.btn_ten, true);
        this.btn_goto_pointsShop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnGoto, this);
        this.btn_one.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnOne, this);
        this.btn_ten.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTen, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TURNPLATE_FILT_MESSAGE.toString(), this.onRunALottery, this);
        Tool.addTimer(this.onCountDown, this, 1000);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_goto_pointsShop.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnGoto, this);
        this.btn_one.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnOne, this);
        this.btn_ten.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTen, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TURNPLATE_FILT_MESSAGE.toString(), this.onRunALottery, this);
        Tool.removeTimer(this.onCountDown, this, 1000);
    }

    protected onRefresh(): void {
        this.onUpdateCurrency();
        this.onRunALottery();
    }
    public onCountDown() {
        // var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.TURNPLATE);
        // if (time > 0) {
        // } else {
        //     time = 0;
        //     Tool.removeTimer(this.onCountDown, this, 1000);
        // }
        // this.onShowCD(time);
    }
    public onShowCD(time: number) {
        this.label_endTime.text = "活动结束剩余时间：" + GameCommon.getInstance().getTimeStrForSec1(time, 3);
    }

    private onGetBtn(event: TouchEvent): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
    }

    private onRunALottery(): void {
        GameCommon.getInstance().onButtonEnable(this.btn_one, true);
        GameCommon.getInstance().onButtonEnable(this.btn_ten, true);
    }

    private onUpdateCurrency(event: egret.Event = null): void {
        this.label_points.text = DataManager.getInstance().playerManager.player.points + "";
        this.label_gold.text = DataManager.getInstance().playerManager.player.gold + "";
    }
    private onTouchBtnOne() {
        this.onSendMessage(0);
    }
    private onTouchBtnTen() {
        this.onSendMessage(1);
    }
    private onTouchBtnGoto(): void {
        var types: number[] = [SHOP_TYPE.TURNPLATE];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ShopPanel", types));
    }
    private onSendMessage(type: number) {
        var pay: number;
        switch (type) {
            case 0:
                pay = this.model.money.num;
                break;
            case 1:
                pay = this.model.moneyOneKey.num;
                break;
        }
        if (DataManager.getInstance().playerManager.player.gold < pay) {
            GameCommon.getInstance().addAlert("钻石不足");
            return;
        }
        var message = new Message(MESSAGE_ID.TURNPLATE_FILT_MESSAGE);
        message.setByte(type);
        GameCommon.getInstance().sendMsgToServer(message);
        GameCommon.getInstance().onButtonEnable(this.btn_one, false);
        GameCommon.getInstance().onButtonEnable(this.btn_ten, false);
    }
}