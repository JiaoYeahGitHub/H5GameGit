class WuTanPanel extends BaseTabView {
    private wutanManager: WuTanManager;
    private actionTop: number[];
    private buildList: eui.Image[];
    private explainLayer: eui.Group;
    private btnLeft: eui.Button;// 经验
    private lbLeft: eui.Label;
    private btnRight: eui.Button;// 真气
    private lbRight: eui.Label;

    // private lbNames: eui.Label[];
    private lbInfos: eui.Label[];
    private groupNameBGs: eui.Image[];
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.WuTanPanelSkin;
    }
    protected onInit(): void {
        this.wutanManager = DataManager.getInstance().wuTanManager;
        super.onInit();
        this.initUI();
        this.onTouchExplain();
    }
    private initUI() {
        this.actionTop = [];
        this.buildList = [];
        // this.lbNames = [];
        this.lbInfos = [];
        this.groupNameBGs = [];
        for (let i = 0; i < WuTanManager.wutanCount; ++i) {
            // this.lbNames[i] = this['lbName' + i] as eui.Label;
            this.lbInfos[i] = this['lbInfo' + i] as eui.Label;
            this.groupNameBGs[i] = this['groupNameBG' + i] as eui.Image;
            let group: eui.Group = this['group' + i] as eui.Group;
            group.touchChildren = false;
            group.touchEnabled = true;
            group.name = i.toString();
            group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventTan, this);
            this.buildList[i] = this['imgBuild' + i];
            this.actionTop[i] = this.buildList[i].y - 20;

            let model: Modelwutan = this.wutanManager.getModel(i + 1, 1);
            // this.lbNames[i].text = model.name;
            this.lbInfos[i].text = "";
            this.initRed(this['groupRed' + i], new egret.Point(48, 0), i);
        }
    }
    protected initRed(image, pos: egret.Point, type: number) {
        var _redPoint = new redPoint();
        _redPoint.register(image, pos, this.wutanManager, 'checkRedPointItem', type);
        this.points.push(_redPoint);
    }
    protected onRegist(): void {
        super.onRegist();
        this.btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventLeft, this);
        this.btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventRight, this);
        this.explainLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.WUTAN_INFO_GET_MESSAGE.toString(), this.onCallInfo, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.WUTAN_HEART_MESSAGE.toString(), this.onCallRefresh, this);
        this.actionLogoShow();
        for (let i = 0; i < WuTanManager.wutanCount; ++i) {
            this.lbInfos[i].text = "";
        }
        this.wutanManager.sendInfoMessage();
        this.checkAutoUI();
    }
    private checkAutoUI() {
        if (this.wutanManager.fightType > 0) {
            this.openWuTan(this.wutanManager.fightType - 1);
        }
        this.wutanManager.clearFightData();
    }
    protected onRemove(): void {
        super.onRemove();
        this.btnLeft.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventLeft, this);
        this.btnRight.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventRight, this);
        this.explainLayer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.WUTAN_INFO_GET_MESSAGE.toString(), this.onCallInfo, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.WUTAN_HEART_MESSAGE.toString(), this.onCallRefresh, this);
        this.actionLogoClose();
    }
    private actionLogoShow() {
        let dis = 30;
        for (let i = 0; i < this.buildList.length; ++i) {
            let time = 5000 + Tool.randomInt(-300, 300);
            let sca = Tool.randomInt(0, 100) / 100;
            this.buildList[i].y = this.actionTop[i] + dis * sca;
            let tw = egret.Tween.get(this.buildList[i], { loop: true });
            tw.to({ y: this.actionTop[i] }, time * sca);
            tw.to({ y: this.actionTop[i] + dis }, time);
            tw.to({ y: this.actionTop[i] + dis * sca }, time * (1 - sca));
        }
    }
    private actionLogoClose() {
        for (let i = 0; i < this.buildList.length; ++i) {
            egret.Tween.removeTweens(this.buildList[i]);
        }
    }
    private onCallRefresh() {
        this.wutanManager.sendInfoMessage();
    }
    private onCallInfo() {
        let numList: number[] = this.wutanManager.numberList;
        for (let i = 0; i < WuTanManager.wutanCount; ++i) {
            let model: Modelwutan = this.wutanManager.getModel(i + 1, 4);
            let num = model.num + 3;
            this.lbInfos[i].text = "剩余" + (num - numList[i]) + "/" + num + "位置";
            this.groupNameBGs[i].source = (this.wutanManager.myType == (i + 1)) ? "samsara_item_title_bg_png" : "samsara_item_title_bg_gray_png";
        }
    }
    private onTouchExplain() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ExplainPanel", Language.instance.getText('wutan_jieshao')));
    }
    private onEventTan(e: egret.TouchEvent) {
        this.openWuTan(parseInt(e.target.name));
    }
    private openWuTan(page) {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("WuTanPanel2", page));
    }
    private onEventLeft() {
    }
    private onEventRight() {
    }
}