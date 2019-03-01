class LuckTurnplatePanel extends BaseWindowPanel {
    private closeBtn: eui.Button;
    private btn_invest: eui.Button;
    private turnplateLayer: eui.Group;
    private label_endTime: eui.Label;
    private label_needMoney: eui.Label;
    private font_vip: eui.BitmapLabel;
    private bmt_total: eui.BitmapLabel;
    private label_points: eui.Label;
    private label_recharge: eui.Label;
    private label_gold: eui.Label;
    private img_disable: eui.Image;
    private label_log: eui.Label;
    private bar: eui.Scroller;
    private isRun: boolean = false;
    private data;
    private models;
    private model;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onInit(): void {
        super.onInit();
        this.setTitle("luckTurnplate_title_png");
        GameCommon.getInstance().addUnderlineStr(this.label_recharge, "充值");
        this.label_recharge.touchEnabled = true;
        this.label_recharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        this.onRefresh();
    }
    protected onSkinName(): void {
        this.skinName = skins.LuckTurnplatePanelSkin;
    }
    protected onRefresh(): void {
        this.onShowAward();
        this.data = DataManager.getInstance().luckTurnplateManager;
        var player = DataManager.getInstance().playerManager.player;
        // this.models = ModelManager.getInstance().modelLuckTurnplate;
        // this.model = this.models[this.data.currWheel];
        // this.font_vip.text = this.data.currWheel.toString();
        // this.label_needMoney.visible = (this.data.needMoney > this.data.totalMoney);
        // this.label_needMoney.textFlow = new Array<egret.ITextElement>(
        //     { text: "充值", style: { "textColor": 0xE9DEB3 } },
        //     { text: this.data.needMoney.toString(), style: { "textColor": 0x28e828 } },
        //     { text: "元宝可以投资", style: { "textColor": 0xE9DEB3 } }
        // );
        // this.label_points.text = "0";
        // if (!this.model) {
        //     this.model = this.models[5];
        // }
        this.label_points.text = this.model.cost.toString();
        this.bmt_total.text = this.data.totalMoney.toString();
        var bl: boolean = (this.data.needMoney > this.data.totalMoney) || (this.model.cost > player.gold);
        this.img_disable.visible = bl;
        GameCommon.getInstance().onButtonEnable(this.btn_invest, !bl);
        this.onupdateCurrency();
        this.onUpdateLog();
    }
    protected onRegist(): void {
        super.onRegist();
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        this.btn_invest.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRotate, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE.toString(), this.onRotateback, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_INVESTTURNPLATE_MESSAGE.toString(), this.onUpdateLog, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onChange, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateCurrency, this);
        this.examineCD(true);
        this.isRun = false;
    }
    protected onRemove(): void {
        super.onRemove();
        this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        this.btn_invest.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRotate, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE.toString(), this.onRotateback, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_INVESTTURNPLATE_MESSAGE.toString(), this.onUpdateLog, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onChange, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onupdateCurrency, this);
        this.examineCD(false);
        egret.Tween.removeTweens(this.turnplateLayer);
        this.turnplateLayer.rotation = 60 * (6 - DataManager.getInstance().luckTurnplateManager.bidding);
        GameDefine.SHIELD_TXT_HINT = false;
        GameCommon.getInstance().onDispatchEvent(MESSAGE_ID.PLAYER_CURRENCY_UPDATE);
    }
    private onChange() {
        if (GameDefine.SHIELD_TXT_HINT) return;
        this.onRefresh();
    }
    private onupdateCurrency(event: egret.Event = null): void {
        this.label_gold.text = DataManager.getInstance().playerManager.player.gold.toString();
    }
    // public onHide(): void {
    //     if (this.isRun) return;
    //     super.onHide();
    // }
    private onGetBtn(event: TouchEvent): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "RechargePanel");
    }
    public examineCD(open: boolean) {
        if (open) {
            Tool.addTimer(this.onCountDown, this, 1000);
        } else {
            Tool.removeTimer(this.onCountDown, this, 1000);
        }
    }
    public onCountDown() {
        // var time: number = DataManager.getInstance().activityManager.getActivityCD(ACTIVITY_BRANCH_TYPE.LUCKTURNPLATE);
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
    private onUpdateLog() {
        if (GameDefine.SHIELD_TXT_HINT) return;
        this.label_log.textFlow = DataManager.getInstance().luckTurnplateManager.getTextFlow();
        setTimeout(this.adjustChatBar.bind(this), 100);
    }
    private adjustChatBar() {
        this.bar.viewport.scrollV = Math.max(this.bar.viewport.contentHeight - this.bar.viewport.height, 0);
    }
    private onRotateback() {
        if (!this.isRun) {
            this.isRun = true;
            var RotationLong;
            RotationLong = this.getRotationLong(6, 4, 6, (6 - DataManager.getInstance().luckTurnplateManager.bidding));//获取总长度
            egret.Tween.get(this.turnplateLayer).to({ rotation: RotationLong }, 4000, egret.Ease.sineInOut).wait(1000).call(this.onPlayDone, this);
        }
    }
    private onRotate() {
        var player = DataManager.getInstance().playerManager.player;
        if (this.model.cost > player.gold) {
            GameCommon.getInstance().addAlert("钻石不足");
            return;
        }
        // this.onRotateback();
        GameDefine.SHIELD_TXT_HINT = true;
        GameCommon.getInstance().onButtonEnable(this.btn_invest, false);
        this.img_disable.visible = true;
        DataManager.getInstance().luckTurnplateManager.onSendMessage();
    }
    //获取总长度函数
    private getRotationLong(Scores, Qmin, Qmax, Location) {
        var _location = (360 / Scores) * Location;//目标奖区的起始点
        var _q = 360 * (Math.floor(Math.random() * (Qmax - Qmin)) + Qmin);//整圈长度
        // var _Skew = (360 / Scores) * Skew;//第一个奖区起始点与0点位置的偏移量
        // var _offset = Math.floor(Math.random() * (360 / Scores) * (1 - 2 * offset)) + (360 / Scores) * offset;
        // return _q + _Skew + _location + _offset;
        return _q + _location;
    }
    private onShowAward() {
        var award: number = DataManager.getInstance().luckTurnplateManager.currAward;
        if (award > 0) {
            var param: LuckTurnplateWinParam = new LuckTurnplateWinParam();
            param.currAward = award;
            param.autocloseTime = 6;
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("LuckTurnplateWinPanel", param));
            DataManager.getInstance().luckTurnplateManager.currAward = 0;
        }
    }
    private onPlayDone() {
        this.isRun = false;
        GameDefine.SHIELD_TXT_HINT = false;
        this.onShowAward();
        this.onRefresh();
        GameCommon.getInstance().onDispatchEvent(MESSAGE_ID.PLAYER_CURRENCY_UPDATE);
    }
}