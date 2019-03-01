class ExplainPanel extends BaseWindowPanel {
    private labelAlert: eui.Label;
    private btnOk: eui.Button;
    private param: string;

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ExplainPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.setTitle("玩法说明");
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
        this.btnOk.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btnOk.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
    }
    //The end
}