class ObtainHintUseGoods extends BaseWindowPanel {
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

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    public constructor(owner: ModuleLayer) {
        super(owner);
        // this.layerIndex = 2;
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
        this.currentState = "box";
        this.setNum(this.max());
        this.showBox();
    }
    private showBox() {
        var model = GameCommon.getInstance().getThingModel(this.thing.type, this.thing.modelId);
        this.goodsLayer.removeChildren();
        var goods: GoodsInstance = new GoodsInstance();
        // goods.img_nameBg.visible = false;
        goods.onUpdate(this.thing.type, this.thing.modelId, 0);
        goods.name_label.visible = false;
        goods.scaleX = goods.scaleY = 0.9;
        this.goodsLayer.addChild(goods);
        this.label_name.textFlow = new Array<egret.ITextElement>(
            { text: model.name, style: { textColor: GameCommon.getInstance().CreateNameColer[model.quality] } }
        );
    }
    private onTouchAdd() {
        this.num += 1;
        if (this.num > this.max()) {
            this.num = this.max();
        }
        this.setNum(this.num);
    }
    private onTouchReduce() {
        this.num -= 1;
        if (this.num == 0) {
            this.num = 1;
        }
        this.setNum(this.num);
    }
    private setNum(num: number) {
        this.num = num;
        this.label_num.text = num.toString();
    }
    public max() {
        return Math.max(1, this.thing.num);
    }
    private getPlayerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    private onInputChage(e: egret.Event) {
        var txt: eui.TextInput = e.target;
        var curr: number = Tool.isNumber(parseInt(txt.text)) ? parseInt(txt.text) : 1;
        if (curr > this.max()) {
            this.num = this.max();
            this.setNum(this.num);
        } else {
            this.setNum(curr);
        }
    }
    private onTouchBtnSend() {
        var message = new Message(MESSAGE_ID.GOODS_LIST_USE_MESSAGE);
        message.setByte(this.thing.type);
        message.setShort(this.thing.modelId);
        message.setInt(this.num);
        GameCommon.getInstance().sendMsgToServer(message);
        this.onHide();
    }
    public onHide(): void {
        super.onHide();
    }
    protected onRegist(): void {
        super.onRegist();
        this.label_num.addEventListener(egret.Event.CHANGE, this.onInputChage, this);
        this.btnAdd.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAdd, this);
        this.btnReduce.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReduce, this);
        this.btn_use.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.label_num.removeEventListener(egret.Event.CHANGE, this.onInputChage, this);
        this.btnAdd.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAdd, this);
        this.btnReduce.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReduce, this);
        this.btn_use.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
    }
}