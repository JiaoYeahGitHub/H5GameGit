class YewaiFieldWinPanel extends BaseWindowPanel {
    private btn_sure: eui.Button;
    private result_desc_label: eui.Label;
    private common_title_img: eui.Image;
    private award_Scroller: eui.Scroller;
    private award_groud: eui.Group;
    private param: AwardItem[];
    private scenetype: FIGHT_SCENE;

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.YewaiFieldWinSkin;
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSure, this);
    }
    public onRemove(): void {
        super.onRemove();
        this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSure, this);
    }
    public onShowWithParam(param): void {
        this.scenetype = GameFight.getInstance().fightsceneTpye;
        if (param) {
            this.param = param;
            super.onShow();
        }
    }
    public onTouchSure(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CLOSE_RESULT_VIEW));
        this.onHide();
    }
    public onHide(): void {
        super.onHide();
        Tool.removeTimer(this.onCloseTimedown, this, 1000);
    }
    protected onInit(): void {
        super.onInit();
        this.award_groud.touchEnabled = false;
        this.award_groud.touchChildren = false;
        // this.award_Scroller.verticalScrollBar.autoVisibility = false;
        this.onRefresh();
    }
    protected onRefresh(): void {
        super.onRefresh();
        if (this.param && this.param.length > 0) {
            this.onPlayAwardAnim();
        }
        this._showleftTime = 6;
        this.onCloseTimedown();
        Tool.addTimer(this.onCloseTimedown, this, 1000);
    }
    private _showleftTime: number;
    private onCloseTimedown(): void {
        this._showleftTime--;
        if (this._showleftTime < 0) {
            Tool.removeTimer(this.onCloseTimedown, this, 1000);
            this.onTouchSure();
            return;
        }
        this.btn_sure.label = Language.instance.getText("sure") + `(${this._showleftTime})`;
    }
    private onPlayAwardAnim(): void {
        for (let i: number = this.award_groud.numChildren - 1; i >= 0; i--) {
            let instance = this.award_groud.getChildAt(i);
            egret.Tween.removeTweens(instance);
            this.award_groud.removeChild(instance);
            instance = null;
        }
        for (let i: number = 0; i < this.param.length; i++) {
            let awarditem: AwardItem = this.param[i];
            let goodsInstance: GoodsInstance = GameCommon.getInstance().createGoodsIntance(awarditem);
            let goodsGrp: eui.Group = new eui.Group();
            goodsGrp.width = 90;
            goodsGrp.height = 110;
            goodsGrp.scaleX = 0.8;
            goodsGrp.scaleY = 0.8;
            goodsGrp.addChild(goodsInstance);
            goodsInstance.y = 200;
            goodsInstance.alpha = 0;
            this.award_groud.addChild(goodsGrp);
            egret.Tween.get(goodsInstance).to({ y: 200 }, i * 100).to({ alpha: 1, y: 0 }, 300, egret.Ease.sineInOut);
        }
    }
    //The end
}
// class FieldWinParam {
//     public awarditems: AwardItem[];
//     public type:FIGHT_SCENE;
// }