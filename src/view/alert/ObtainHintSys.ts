class ObtainHintSys extends BaseWindowPanel {
    public btn_use: eui.Button;
    public goodsLayer: eui.Group;
    public label_name: eui.Label;
    private label_num: eui.TextInput;
    private btnAdd: eui.Button;
    private btnReduce: eui.Button;
    private label_guide: eui.Label;
    private num: number;
    private sum: number;
    private thing;
    private panelID: number = 0;
    private img_sys: eui.Image;
    private param: ObtainHintParam;
    private checkBtn_cd: eui.CheckBox;
    private equipLayer: eui.Group;
    private checkBox: eui.CheckBox;

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
        // this.layerIndex = 0;
    }
    protected onSkinName(): void {
        // this.skinName = skins.ObtainHintSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.onRefresh();
    }
    public onShowWithParam(param: ObtainHintParam): void {
        this.param = param;
        this.onShow();
    }
    protected onRefresh(): void {
        this.checkBtn_cd.selected = false;
        this.panelID = this.param.panelID;
        this.thing = this.param.thing;
        this.currentState = "item";
        this.showItem();
    }
    // ///处理复选框的change事件回调
    // private onCdBtnTouch(event: egret.TouchEvent) {
    // }
    private showItem() {
        switch (this.panelID) {
            case 13://坐骑面板
                this.img_sys.source = "zhanqi_png";
                this.label_guide.text = "坐骑可以进阶了，快去试试吧";
                break;
            case 14://神兵面板
                this.img_sys.source = "shenbing_png";
                this.label_guide.text = "神兵可以进阶了，快去试试吧";
                break;
            case 15://神装面板
                this.img_sys.source = "shenzhuang_png";
                this.label_guide.text = "神装可以进阶了，快去试试吧";
                break;
            case 16://仙羽面板
                this.img_sys.source = "xianyu_png";
                this.label_guide.text = "仙羽可以进阶了，快去试试吧";
                break;
            case 17://法宝面板
                this.img_sys.source = "fabao_png";
                this.label_guide.text = "法宝可以进阶了，快去试试吧";
                break;
        }
    }
    private getPlayerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    private onTouchBtnSend() {
        if (this.checkBtn_cd.selected) {
            DataManager.getInstance().hintManager.shieldObtainHint();
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), this.panelID);
        this.onHide();
    }
    public onHide(): void {
        super.onHide();
        if (this.checkBtn_cd.selected) {
            DataManager.getInstance().hintManager.shieldObtainHint();
        }
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_use.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
        // this.checkBtn_cd.addEventListener(egret.Event.CHANGE, this.onCdBtnTouch, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_use.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
        // this.checkBtn_cd.removeEventListener(egret.Event.CHANGE, this.onCdBtnTouch, this);
    }
}
class ObtainHintParam {
    public type: HINT_TIPS_TYPE;
    public panelID: number = 0;
    public thing;
    public constructor(type, thing, panelID = 0) {
        this.type = type;
        this.panelID = panelID;
        this.thing = thing;
    }
}
//提示框类型
enum HINT_TIPS_TYPE {
    EQUIP = 0,
}