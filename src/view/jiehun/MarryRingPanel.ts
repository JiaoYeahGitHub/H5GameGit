class MarryRingPanel extends BaseTabView {
    protected points: redPoint[] = RedPointManager.createPoint(5);
    private currPro: eui.Label;
    private nextPro: eui.Label;
    private powerbar: PowerBar;
    private btnLevelup: eui.Button;
    private imgIcon: eui.Image;
    private groupRing: eui.Group;
    private groupRingY: number;
    private currency: ConsumeBar;

    private tabs: eui.RadioButton[];
    private itemList: MarryRingItem[];
    private currTabId: number;
    private currIdx: number;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.MarryRingPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.tabs = [];
        let tabNames = ["紫品婚戒", "橙品仙玉", "红品婚玺", "金品宝扇"];
        for (let i = 0; i < 4; ++i) {
            this.tabs[i] = this["tab" + i] as eui.RadioButton;
            this.tabs[i].labelDisplay.text = tabNames[i];
            (this.tabs[i].labelDisplay as eui.Label).size = 20;
            let pinzhi = this.tabs[i].value;
            this.points[i].register(this.tabs[i], new egret.Point(86, 0), this.ringManager, 'checkRedPointTab', pinzhi);
            this.tabs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
        }
        this.itemList = [];
        for (let i = 0; i < 6; ++i) {
            this.itemList[i] = this["item" + i];
            this.itemList[i].name = i.toString();
            this.itemList[i].setSelect(false);
            this.itemList[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
        }
        this.groupRingY = this.groupRing.y;
        this.currTabId = this.tabs[0].value;
        this.currIdx = 0;
        this.itemList[this.currIdx].setSelect(true);
        this.points[4].register(this.btnLevelup, new egret.Point(140, -5), this, 'checkRedPointCurr');
        this.updateUI();
    }
    private actionLogoShow() {
        this.groupRing.y = this.groupRingY;
        let time = 750;
        let tw = egret.Tween.get(this.groupRing, { loop: true });
        tw.to({ y: this.groupRingY - 20 }, time);
        tw.to({ y: this.groupRingY + 20 }, time * 2);
        tw.to({ y: this.groupRingY }, time);
    }
    private actionLogoClose() {
        egret.Tween.removeTweens(this.groupRing);
    }
    protected onRegist(): void {
        super.onRegist();
        this.btnLevelup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventLevelup, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_RING_UP_MESSAGE.toString(), this.onBackLevelup, this);
        this.actionLogoShow();
    }
    protected onRemove(): void {
        super.onRemove();
        this.btnLevelup.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventLevelup, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_RING_UP_MESSAGE.toString(), this.onBackLevelup, this);
        this.actionLogoClose();
    }
    private checkRedPointCurr(): boolean {
        return this.getItemCurr().isRedPoint();
    }
    private onEventLevelup() {
        var message: Message = new Message(MESSAGE_ID.MARRIAGE_RING_UP_MESSAGE);
        message.setShort(this.getItemCurr().model.id);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    private onBackLevelup() {
        this.getItemCurr().updateUI();
        this.updateCurrItem();
    }
    private onTouchItem(event: egret.TouchEvent) {
        let idx = parseInt(event.currentTarget.name);
        if (this.currIdx != idx) {
            this.setItemIdx(idx);
        }
    }
    private setItemIdx(idx: number) {
        if (this.itemList[this.currIdx]) {
            this.itemList[this.currIdx].setSelect(false);
        }
        this.currIdx = idx;
        this.itemList[this.currIdx].setSelect(true);
        this.updateCurrItem();
    }
    /**切换页签**/
    private onTouchTab(event: egret.TouchEvent): void {
        let button: eui.RadioButton = event.currentTarget;
        if (this.currTabId != button.value) {
            this.currTabId = button.value;
            this.updateUI();
        }
    }
    private getItemCurr(): MarryRingItem {
        return this.itemList[this.currIdx];
    }
    private updateUI() {
        for (let i = 0; i < 4; ++i) {
            this.tabs[i].selected = this.tabs[i].value == this.currTabId;
        }
        let models = JsonModelManager.instance.getModelhunjie();
        let idx = 0;
        for (let key in models) {
            let model: Modelhunjie = models[key];
            if (model.pinzhi == this.currTabId) {
                this.itemList[idx].setData(model, this.ringManager.getLevel(model.id));
                ++idx;
            }
        }
        this.updateCurrItem();
    }
    private updateCurrItem() {
        this.imgIcon.source = this.getItemCurr().model.waixing1;
        let player = DataManager.getInstance().playerManager.player;
        this.powerbar.power = GameCommon.calculationFighting(player.getMarryRingAttributeAll());

        let model = this.getItemCurr().model;
        let level = player.ringLvs[model.id - 1];
        var tempAttribute: number[] = player.getMarryRingAttribute(model.id, level);
        let attLeft = "";
        for (let i = 0; i < 4; i++) {
            attLeft += GameDefine.Attr_FontName[i] + "：+" + tempAttribute[i] + "\n";
        }
        this.currPro.text = attLeft;

        tempAttribute = player.getMarryRingAttribute(model.id, level + 1);
        attLeft = "";
        for (let i = 0; i < 4; i++) {
            attLeft += GameDefine.Attr_FontName[i] + "：+" + tempAttribute[i] + "\n";
        }
        this.nextPro.text = attLeft;
        this.points[4].checkPoint();
        this.btnLevelup.enabled = this.checkRedPointCurr();

        let cost = this.getItemCurr().getCost();
        if (cost) {
            this.currency.setCostByAwardItem(cost);
            this.currency.visible = true;
        } else {
            this.currency.visible = false;
        }
    }
    private get ringManager() {
        return DataManager.getInstance().ringManager;
    }
}
class MarryRingItem extends eui.Component {
    private name_label: eui.Label;
    private icon_img: eui.Image;
    private frame_img: eui.Image;
    private nameframe_img: eui.Image;
    private redponit_img: eui.Image;
    private level_label: eui.Label;
    private lbCount: eui.Label;
    private consume_probar: eui.ProgressBar;
    private rectSelect: eui.Rect;
    public model: Modelhunjie;
    public level: number;
    public constructor() {
        super();
        this.skinName = skins.MarryRingItemSkin;
    }
    public setData(model: Modelhunjie, level: number = 0) {
        this.model = model;
        this.level = level;
        this.updateUI();
    }
    public updateUI() {
        this.name_label.text = this.model.name;
        this.icon_img.source = this.model.waixing1;
        this.frame_img.source = "xinfa_border_" + this.model.pinzhi + "_png";
        this.nameframe_img.source = "xinfa_namebg_" + this.model.pinzhi + "_png";
        this.level_label.text = this.level + "级";
        let cost: AwardItem = this.getCost();
        let itemCount = DataManager.getInstance().bagManager.getGoodsThingNumById(cost.id, cost.type);
        this.consume_probar.maximum = cost.num;
        this.consume_probar.value = itemCount;
        this.consume_probar.labelDisplay.visible = false;
        this.lbCount.text = itemCount + " / " + cost.num;
        this.redponit_img.visible = itemCount >= cost.num;
    }
    public isRedPoint() {
        return this.redponit_img.visible;
    }
    public setSelect(isSelect: boolean) {
        this.rectSelect.visible = isSelect;
    }
    public getCost(): AwardItem {
        return GameCommon.parseAwardItem(this.model.itemCost);
    }
}