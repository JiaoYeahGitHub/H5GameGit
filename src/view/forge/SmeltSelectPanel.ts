class SmeltSelectPanel extends BaseWindowPanel {
    private param: SmeltSelectParam;
    private itemLayer: eui.Group;
    private btn_confirm: eui.Button;
    private label_sum: eui.Label;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    private closeBtn0: eui.Button;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.SmeltSelectPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.setTitle("smelt_bml_xzzb_png");
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_confirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnConfirm, this);
        this.closeBtn0.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_confirm.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnConfirm, this);
        this.closeBtn0.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
    }
    protected onRefresh(): void {
        var item: SmeltInstance;
        this.itemLayer.removeChildren();
        var len: number = this.param.equipQueue.length;
        for (var i: number = 0; i < len; i++) {
            item = new SmeltInstance(i);
            item.onUpdate(this.param.equipQueue[i], SMELTINSTANCE_TYPE.SELECT, this.param.from);
            item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
            this.itemLayer.addChild(item);
        }
        this.onShowLabel();
    }
    private getSmeltLength(): number {
        var i: number = 0;
        for (var key in this.param.smeltQueue) {
            i++;
        }
        return i;
    }
    private onTouchItem(e: egret.Event): void {
        var item: SmeltInstance = <SmeltInstance>e.currentTarget;
        item.thing.selected = !item.thing.selected;
        item.onRefresh();
        var i: number = 0;
        if (item.thing.selected) {
            this.param.smeltQueue[item.thing.smeltSot];
            for (i = 0; i < this.param.maxSelect; i++) {
                if (!this.param.smeltQueue[i]) {
                    this.param.smeltQueue[i] = item.thing;
                    item.thing.smeltSot = i;
                    break;
                }
            }
        } else {
            delete this.param.smeltQueue[item.thing.smeltSot];
        }
        this.onShowLabel();
        if (this.param.maxSelect == this.getSmeltLength()) {
            this.onHide();
        }
    }
    private onShowLabel(): void {
        var curr: number = 0;
        var len: number = this.param.equipQueue.length;
        for (var i: number = 0; i < len; i++) {
            if (this.param.equipQueue[i].selected) {
                curr++;
            }
        }
        this.label_sum.text = `${curr}/${this.param.maxSelect}`;
    }
    private onTouchBtnConfirm(): void {
        this.onHide();
    }
    public onHide(): void {
        super.onHide();
        GameDispatcher.getInstance().dispatchEvent(
            new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("SmeltPanel", this.param.from)
        );
    }
    public onShowWithParam(param): void {
        this.param = param;
        this.onShow();
    }
}
class SmeltSelectParam {
    public from: number;
    public smeltQueue;
    public maxSelect: number;
    public equipQueue: EquipThing[];
    public constructor(from: number, smeltQueue, maxSelect: number, equipQueue: EquipThing[]) {
        this.from = from;
        this.smeltQueue = smeltQueue;
        this.maxSelect = maxSelect;
        this.equipQueue = equipQueue;
    }
}