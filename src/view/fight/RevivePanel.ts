// TypeScript file
class RevivePanel extends BaseWindowPanel {
    private btn_sure: eui.Button;
    private bianqiang_Scroller: eui.Scroller;
    private bianqiang_groud: eui.Group;
    private biangqiangAllGotype: number[] = [2, 4, 17, 18, 19, 20, 5, 57];
    private allbianqiangBtns: StrongerButton[];
    // private revivertime: number = 0;//如果不为0 说明需要等到点了才能复活
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
        this.allbianqiangBtns = [];
    }
    protected onSkinName(): void {
        this.skinName = skins.DupLosePanelSkin;
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        for (var i: number = 0; i < this.allbianqiangBtns.length; i++) {
            var bianqiangBtn: StrongerButton = this.allbianqiangBtns[i];
            bianqiangBtn.addGotypeEventListener();
        }
    }
    public onRemove(): void {
        super.onRemove();
        this.btn_sure.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        for (var i: number = 0; i < this.allbianqiangBtns.length; i++) {
            var bianqiangBtn: StrongerButton = this.allbianqiangBtns[i];
            bianqiangBtn.removeGotypeEventListener();
        }
    }
    public onHide(): void {
        super.onHide();
        Tool.removeTimer(this.onCloseTimedown, this, 1000);
        GameFight.getInstance().fightScene.onFightLose();
    }
    protected onInit(): void {
        super.onInit();
        this.bianqiang_Scroller.verticalScrollBar.autoVisibility = false;
        for (var i: number = 0; i < this.biangqiangAllGotype.length; i++) {
            var gotype: number = this.biangqiangAllGotype[i];
            var bianqiangBtn: StrongerButton = new StrongerButton();
            bianqiangBtn.registGotype(gotype);
            this.allbianqiangBtns.push(bianqiangBtn);
            this.bianqiang_groud.addChild(bianqiangBtn);
        }
        this.onRefresh();
    }
    protected onRefresh(): void {
        super.onRefresh();
        this._showleftTime = 6;//this.revivertime > 0 ? this.revivertime : 6;
        for (var i: number = 0; i < this.allbianqiangBtns.length; i++) {
            var bianqiangBtn: StrongerButton = this.allbianqiangBtns[i];
            bianqiangBtn.registGotype(bianqiangBtn.gotype);
        }
        // GameCommon.getInstance().onButtonEnable(this.btn_sure, this.revivertime == 0);
        Tool.addTimer(this.onCloseTimedown, this, 1000);
    }
    public onShowWithParam(param): void {
        // this.revivertime = param && param["revivetiem"] ? param["revivetiem"] : 0;
        super.onShowWithParam(param);
    }
    private _showleftTime: number;
    private onCloseTimedown(): void {
        this._showleftTime--;
        if (this._showleftTime < 0) {
            Tool.removeTimer(this.onCloseTimedown, this, 1000);
            // if (this.revivertime == 0) {
            this.onHide();
            // }
            return;
        }
        this.btn_sure.label = `复活(${this._showleftTime})`;
    }
    private onTouchBtn(event: egret.Event): void {
    }
}