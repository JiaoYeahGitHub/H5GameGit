class AlertDescUI extends BaseWindowPanel {
    public btnOk: eui.Button;
    public labelAlert: eui.Label;
    public param: string;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.AlertFrameSkin;
    }
    protected onInit(): void {
        this.setTitle('提 示');
        super.onInit();
        this.onRefresh();
    }
    protected onRefresh(): void {
        this.labelAlert.textFlow = (new egret.HtmlTextParser).parser(this.param);
    }
    public onEventOk() {
        this.onEventBack();
    }
    public onShowWithParam(param: string): void {
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
    }
    protected onRemove(): void {
        super.onRemove();
        this.btnOk.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventOk, this);
    }
}