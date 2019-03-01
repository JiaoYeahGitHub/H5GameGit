class LuckTurnplateWinPanel extends BaseWindowPanel{
	private btn_sure: eui.Button;
    private award_group: eui.Group;
    private title_img: eui.Image;
    private result_label: eui.Label;
    private param: LuckTurnplateWinParam;
    private _showleftTime: number;
    private label_savvy: eui.Label;
    private label_vigour: eui.Label;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LuckTurnplateWinPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.onRefresh();
    }
    protected onRefresh(): void {
        this._showleftTime = this.param.autocloseTime;
        // this.title_img.source = this.param.titleSource
        // this.result_label.text = this.param.desc;
        this.onUpdateAward();
        if (this._showleftTime > 0)
            Tool.addTimer(this.onCloseTimedown, this, 1000);
        else
            this.btn_sure.label = this.param.btnlabel;
    }
    private onCloseTimedown(): void {
        this._showleftTime--;
        if (this._showleftTime < 0) {
            Tool.removeTimer(this.onCloseTimedown, this, 1000);
            this.onHide();
            return;
        }
        this.btn_sure.label = this.param.btnlabel + `(${this._showleftTime})`;
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
    }
    protected onRemove(): void {
        super.onRemove();
        if (this.param.callFunc && this.param.callObj) {
            Tool.callback(this.param.callFunc, this.param.callObj, this.param.callParam);
        }
        this.param = null;
        this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
    }
    public onShowWithParam(param): void {
        this.param = param;
        this.onShow();
    }
    public onShow(): void {
        if (this.param)
            super.onShow();
    }
    public onHide(): void {
        Tool.removeTimer(this.onCloseTimedown, this, 1000);
        super.onHide();
    }
    private onUpdateAward(): void {
        this.label_savvy.text = "银币*" + this.param.currAward;
    }
}