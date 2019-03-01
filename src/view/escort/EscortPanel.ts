/**
 * 
 * @author 	lzn
 * 押镖界面
 * 
 */
class EscortPanel extends BaseTabView {
    private data: EscortData;
    private arane_Escortnum_label: eui.Label;
    private arane_ranknum_label: eui.Label;
    private btn_log: eui.Button;
    private carLayout: number[] = [2, 3, 2];
    private cars: EscortCar[];
    private carLayer: eui.Group;
    private myInfoLayer: eui.Group;
    private label_time: eui.Label;
    private btn_escort: eui.Button;
    private btn_flush: eui.Button;
    private map_max_w: number = 600;
    // private map_max_h: number = 904;
    // private mapMask: eui.Group;
    private sceneLayer: eui.Group;
    private link_oneKey: eui.Label;
    private btn_oneKeyDone: eui.Button;
    private time: number;
    private max: number;
    private awardLayer: eui.Group;
    private btn_awardClose: eui.Button;
    private sonnieLayer: eui.Group;
    private sonnieBasic: eui.Component;
    // private explainLayer: eui.Group;
    // private explainBasic: eui.Component;
    private animLayer: eui.Group;
    private animRefresh: Animation;
    protected points: redPoint[] = RedPointManager.createPoint(2);
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.EscortPanelSkin;
    }
    protected onInit(): void {
        GameCommon.getInstance().addUnderlineStr(this.link_oneKey);
        super.onInit();
        this.onInitCar();

        this.points[0].register(this.btn_log, GameDefine.RED_MAIN_II_POS, DataManager.getInstance().escortManager, "getHasUnOpenLog");
        this.points[1].register(this.btn_escort, GameDefine.RED_BTN_POS, DataManager.getInstance().escortManager, "getCanEscort");

        this.onRefresh();
        DataManager.getInstance().escortManager.setPanel(this);
    }
    protected onRefresh(): void {
        this.data = DataManager.getInstance().escortManager.escort;
        this.arane_Escortnum_label.text = (EscortData.MAX_ESCORT_COUNT - this.data.count) + "/" + EscortData.MAX_ESCORT_COUNT;
        this.arane_ranknum_label.text = (EscortData.MAX_ROB_COUNT - this.data.rob) + "/" + EscortData.MAX_ROB_COUNT;
        this.onTouchRefresh();
        this.onShowAwardLayer();
        this.onShowInfo();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_flush.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRefresh, this);
        this.btn_escort.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnEscort, this);
        this.btn_log.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnLog, this);
        this.btn_oneKeyDone.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnOneKeyDone, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ESCORT_ROBLIST_MESSAGE.toString(), this.onRefreshBack, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ESCORT_DISPATCH_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ESCORT_AWARD_RECEIVE_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ESCORT_ESCORT_DONE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ESCORT_ROB_RESULT_MESSAGE.toString(), this.onRefresh, this);
        DataManager.getInstance().escortManager.onSendEscortDone();
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        // Tool.addTimer(this.onEnterFrame, this, 30);
        // this.btn_refresh.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendEscortRefreshQualityMsg, this);
        // this.btn_advance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAdvance, this);
        // this.btn_awardClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAwardClose, this);
        // this.Txt_getConsum.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        // this.explainBasic["closeBtn1"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        // this.sonnieBasic["closeBtn1"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSonnieHide, this);
        // GameDispatcher.getInstance().addEventListener(GameEvent.GAME_ROB_ESCORT, this.onRob, this);
        // GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
        // GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ESCORT_ROB_RESULT_MESSAGE.toString(), this.onRefreshBack, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_flush.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRefresh, this);
        this.btn_escort.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnEscort, this);
        this.btn_log.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnLog, this);
        this.btn_oneKeyDone.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnOneKeyDone, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ESCORT_ROBLIST_MESSAGE.toString(), this.onRefreshBack, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ESCORT_DISPATCH_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ESCORT_AWARD_RECEIVE_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ESCORT_ESCORT_DONE.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ESCORT_ROB_RESULT_MESSAGE.toString(), this.onRefresh, this);
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        // Tool.removeTimer(this.onEnterFrame, this);
        // this.btn_refresh.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.sendEscortRefreshQualityMsg, this);
        // this.btn_advance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAdvance, this);
        // this.btn_awardClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAwardClose, this);
        // this.Txt_getConsum.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        // this.explainBasic["closeBtn1"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        // this.sonnieBasic["closeBtn1"].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSonnieHide, this);
        // GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_ROB_ESCORT, this.onRob, this);
        // GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
        // GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ESCORT_ROB_RESULT_MESSAGE.toString(), this.onRefreshBack, this);
    }
    private onShowInfo(): void {
        this.myInfoLayer.visible = this.data.cargo == 1;
        if (this.myInfoLayer.visible) {
            var model: Modeldujie = JsonModelManager.instance.getModeldujie()[DataManager.getInstance().escortManager.escort.quality];
            this.max = model.keeptime;
            this.btn_escort.label = "护送中";
        } else {
            this.btn_escort.label = "开始护送";
        }
    }
    private onTouchBtnAwardClose() {
        this.awardLayer.visible = false;
    }
    private getPlayerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    private onTouchBtnOneKeyDone() {
        var pay: number = 2;
        var rate: number = Math.ceil(this.time / 60);
        pay = pay * rate;
        var payType: string = "";
        if (this.getPlayerData().gold >= pay) {
            payType = "钻石";
        } else {
            GameCommon.getInstance().addAlert("error_tips_2");
            return;
        }
        var list = [{ text: "是否花费" + pay + payType + "完成当前护送", style: {} }];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("AlertFrameUI", new AlertFrameParam(list, this.onSendOneKeyDone, this))
        );
    }
    private onSendOneKeyDone() {
        var message = new Message(MESSAGE_ID.ESCORT_ESCORT_DONE);
        message.setByte(1);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    private onShowAwardLayer() {
        var data;
        var awarditem: AwardItem;
        var info = DataManager.getInstance().escortManager.award;
        if (info) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "EscortAwardPanel");
        }
    }
    private onGetBtn(event: TouchEvent): void {
        GameCommon.getInstance().onShowFastBuy(32, GOODS_TYPE.ITEM);
    }
    private addAnimation(key: string, pos: egret.Point, parent) {
        var anim = new Animation(key, -1);
        anim.x = pos.x;
        anim.y = pos.y;
        parent.addChild(anim);
        return anim;
    }
    private TickingRefresh() {
        this.sendEscortRobListMsg();
    }
    public onCountDown(time) {
        this.time = time;
        this.label_time.text = GameCommon.getInstance().getTimeStrForSec2(time, false);
    }
    //点击刷新显示镖车返回信息
    private onRefreshBack() {
        this.onTouchflush();//刷新显示
    }
    //点击刷新按钮调用
    private onTouchRefresh() {
        //刷新显示
        if (this.onTouchflush()) {
            this.sendEscortRobListMsg();//请求最新列表信息
        }
    }
    private onInitCar(): void {
        this.cars = [];
        var car: EscortCar;
        for (var i: number = 0; i < EscortData.MAX_SHOW_COUNT; i++) {
            car = new EscortCar();
            car.index = i;
            this.cars.push(car);
            this.carLayer.addChild(car);
        }
    }
    // private showRollMap() {
    //     var shape: egret.Shape = new egret.Shape();
    //     shape.graphics.beginFill(0xFFFFFF, 1);
    //     shape.graphics.drawRect(0, 0, 620, 973);
    //     shape.graphics.endFill();
    //     this.mapMask.addChild(shape);
    //     this.mapMask.touchEnabled = false;
    //     this.mapMask.touchChildren = false;
    //     this.sceneLayer.mask = this.mapMask;
    // }
    private onEnterFrame() {
        var car: EscortCar;
        for (var i: number = 0; i < this.cars.length; i++) {
            car = this.cars[i];
            car.x += 2;
            if (car.x >= this.map_max_w) {
                car.x = -car.width;
            }
            car.onShowTime();
        }
    }
    //去押运
    public onTouchBtnEscort() {
        if (this.data.cargo == 1) {
            GameCommon.getInstance().addAlert("正在护送中");
            return;
        }
        if (DataManager.getInstance().escortManager.escort.count >= EscortData.MAX_ESCORT_COUNT) {
            GameCommon.getInstance().addAlert("已达今日护送上限");
            return;
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "SonniePanel");
    }
    //打开日志界面
    private onTouchBtnLog() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "EscortRobPanel");
    }
    // private currData:escort
    //刷新镖车信息和位置
    private onTouchflush() {
        var data = DataManager.getInstance().escortManager.getRandomCar();
        if (data.length < EscortData.MAX_SHOW_COUNT) {
            return true;
        }
        var one: number;
        var offX: number;
        var param: number;
        var n: number = 0;
        var randomX: number;
        var offX: number;
        var firstOffY: number = 40;
        for (var i: number = 0; i < this.carLayout.length; i++) {
            param = this.carLayout[i];
            one = this.map_max_w / param;
            for (var j: number = 0; j < param; j++) {
                offX = -Math.random() * this.map_max_w / (param * 2.5) - 300;
                this.cars[n].x = this.map_max_w - (one * 1.2) * j + offX;
                this.cars[n].y = i * 200 + firstOffY;
                this.cars[n].data = data[n];
                n++;
            }
        }
    }

    //////////////////////////////////消息区//////////////////////////////////

    //714--劫镖车队列表
    private sendEscortRobListMsg() {
        var message = new Message(MESSAGE_ID.ESCORT_ROBLIST_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(message);
    }
}
class EscortProgressBar extends eui.ProgressBar {
    private Txt_lv: eui.Label;
    private label_title: eui.Label;
    public constructor() {
        super();
        this.skinName = skins.EscortProgressBarSkin;
    }
    public showInfo(currTime: number = 100, maxTime: number = 100) {
        this.minimum = 0;
        this.maximum = maxTime;
        this.setValue(currTime);
    }
    protected valueToLabel(value: number, maximum: number): string {
        if (maximum == value) {
            return "MAX";
        } else {
            return super.valueToLabel(value, maximum);
        }
    }
    protected setValue(value: number): void {
        super.setValue(value);
    }
}
class EscortCar extends BaseComp {
    private _index: number;
    private fire: Animation;
    private ghostFireLayer: eui.Group;
    private label_name: eui.Label;
    private label_time: eui.Label;
    private attributes: number[];
    public constructor() {
        super();
        this.touchEnabled = true;
    }
    protected setSkinName(): void {
        this.skinName = skins.EscortCarSkin;
    }
    public set index(param) {
        this._index = param;
    }
    public get index() {
        return this._index;
    }
    protected onRegist(): void {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRob, this);
    }
    protected onRemove(): void {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onRob, this);
    }
    private onRob() {
        if (!this.data) return;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("EscortBeRobPanel", this.data));
    }
    protected dataChanged() {
        this.visible = this._data != null;
        if (!this._data) return;
        this.label_name.textFlow = (new egret.HtmlTextParser).parser(`<font color=${GameCommon.getInstance().CreateNameColer(this.data.quality)} >${this._data.name}</font>`);//+ "的仙女"
        setTimeout(this.updateFireAnim.bind(this), Math.floor(Math.random() * 100) + 15);
    }
    private updateFireAnim() {
        if (!this.fire) {
            this.fire = new Animation("yunbiao_0" + this.data.quality, -1);
            this.ghostFireLayer.addChild(this.fire);
        } else {
            this.fire.onUpdateRes("yunbiao_0" + this.data.quality, -1);
        }
    }
    private _refreshTime: number = 0;
    public onShowTime(): void {
        if (this.label_time && this._data && egret.getTimer() - this._refreshTime > 1000) {
            this._refreshTime = egret.getTimer();
            let timecount: number = this._data.getCountDown();
            this.label_time.text = `剩余时间：${GameCommon.getInstance().getTimeStrForSec2(timecount, false)}`;
            if (timecount <= 0 && this.visible) {
                this._data = null;
                this.dataChanged();
            }
        }
    }
}