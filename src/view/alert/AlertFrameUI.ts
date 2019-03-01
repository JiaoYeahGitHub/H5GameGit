class AlertFrameUI extends BaseWindowPanel {
    public btnOk: eui.Button;
    public btnBack: eui.Button;
    // public closeBtn: eui.Button;
    public labelAlert: eui.Label;
    public param: AlertFrameParam;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.AlertFrameSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.onRefresh();
    }
    protected onRefresh(): void {
        if (this.param.texts instanceof Array) {
            this.labelAlert.textFlow = this.param.texts;
        } else {
            this.labelAlert.text = this.param.texts;
        }
        if (this.param.surelabel != this.btnOk.label) {
            this.btnOk.label = this.param.surelabel;
        }
    }
    public onEventOk() {
        this.onEventBack();
        egret.callLater(this.param.callback, this.param.target, this.param.param);
    }

    public onShowWithParam(param: AlertFrameParam): void {
        this.param = param;
        this.onShow();
    }
    public onShow() {
        super.onShow();
    }

    public onEventBack() {
        this.onHide();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btnOk.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventOk, this);
        this.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBack, this);
        // this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btnOk.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventOk, this);
        this.btnBack.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventBack, this);
        // this.closeBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
    }
}
class AlertFrameParam {
    public callback;
    public target;
    public param;
    public texts;
    public surelabel: string = '确认';
    public constructor(texts, callback, target, param = null) {
        this.callback = callback;
        this.target = target;
        this.param = param;
        this.texts = texts;
    }
}