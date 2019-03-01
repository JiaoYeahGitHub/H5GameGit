class YuanJiePanel extends BaseTabView {
    private yjManager: YuanJieManager;
    private powerbar: PowerBar;
    private groupLogo: eui.Group;
    private imgLogo: eui.Image;
    private groupLogoY: number;
    private curPro: eui.Label;
    private nextPro: eui.Label;
    private lbLevel: eui.Label;
    private currency: ConsumeBar;
    private btnZhuYuan: eui.Button;
    private itemGroups: eui.Group[];
    private itemBGs: eui.Image[];
    private itemNames: eui.Label[];
    private progressExp: eui.ProgressBar;

    private btnAttribute: eui.Button;
    private groupAttribute: eui.Group;
    private attriLeft: eui.Label;
    private attriRight: eui.Label;

    private currIdx: number;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.YuanJiePanelSkin;
    }
    protected onInit(): void {
        // this.powerbar.power_bg.visible = false;
        this.yjManager = DataManager.getInstance().yuanjieManager;
        this['basic'].label_title.text = '元戒进阶';
        this['basic'].closeBtn2.visible = false;
        super.onInit();

        this.initUI();
        this.initRedPoint();
        this.groupLogoY = this.groupLogo.y;
    }
    private actionLogoShow() {
        this.groupLogo.y = this.groupLogoY;
        let time = 750;
        let tw = egret.Tween.get(this.groupLogo, { loop: true });
        tw.to({ y: this.groupLogoY - 20 }, time);
        tw.to({ y: this.groupLogoY + 20 }, time * 2);
        tw.to({ y: this.groupLogoY }, time);
    }
    private actionLogoClose() {
        egret.Tween.removeTweens(this.groupLogo);
    }
    private initRedPoint() {
        this.points = RedPointManager.createPoint(4);
        let list: Modelyuanjie[] = this.yjManager.getModelYuanJie();
        for (let i = 0; i < 3; ++i) {
            this.points[i].register(this.itemGroups[i], new egret.Point(65, 0), this.yjManager, 'checkRedPointItem', list[i]);
        }
        this.points[3].register(this.btnZhuYuan, GameDefine.RED_BTN_POS, this, 'checkRedPointBtn');
    }
    private initUI() {
        this.currIdx = 0;
        this.itemGroups = [];
        this.itemBGs = [];
        this.itemNames = [];
        let list: Modelyuanjie[] = this.yjManager.getModelYuanJie();
        for (let i = 0; i < 3; ++i) {
            this.itemGroups[i] = this['itemGroup' + i];
            this.itemBGs[i] = this['itemBg' + i];
            this.itemNames[i] = this['itemName' + i];
            this.itemBGs[i].touchEnabled = this.itemNames[i].touchEnabled = false;

            this.itemNames[i].text = GameCommon.getInstance().getThingModel(list[i].cost.type, list[i].cost.id).name;

            this.itemGroups[i].touchEnabled = true;
            this.itemGroups[i].name = i.toString();
            this.itemGroups[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSelectItem, this);
        }
    }
    private updateUI() {
        for (let i = 0; i < 3; ++i) {
            this.itemBGs[i].source = i == this.currIdx ? "yuandi2_png" : "yuandi1_png";
        }
        let attLeft = "";
        let attRight = "";
        var tempAttribute: number[] = GameCommon.getInstance().getAttributeAry();
        let attList = DataManager.getInstance().playerManager.player.getPlayerData(0).yuanjie;
        for (let i = 0; i < GameDefine.YUANJIE_ATTR.length; i++) {
            tempAttribute[GameDefine.YUANJIE_ATTR[i]] += attList[i];
            if (i < GameDefine.YUANJIE_ATTR.length / 2) {
                attLeft += GameDefine.Attr_FontName[GameDefine.YUANJIE_ATTR[i]] + "：+" + attList[i] + "\n";
            } else {
                attRight += GameDefine.Attr_FontName[GameDefine.YUANJIE_ATTR[i]] + "：+" + attList[i] + "\n";
            }
        }
        this.curPro.text = attLeft;
        this.nextPro.text = attRight;

        let modelCurr: Modelyuanjielv = this.yjManager.getYuanJieModelCurr();
        if (modelCurr) {
            this.lbLevel.text = "Lv" + modelCurr.id;
        } else {
            this.lbLevel.text = "Lv0";
        }
        var yuanjieProPlus: number[] = this.yjManager.getAttributePlus(modelCurr);
        let modelNext: Modelyuanjielv = this.yjManager.getYuanJieModelNext();
        var yuanjieProPlusNext: number[] = this.yjManager.getAttributePlus(modelNext);
        attLeft = "";
        attRight = "";
        for (let i = 0; i < 4; ++i) {
            let attType = GameDefine.YUANJIE_ATTR[i];
            attLeft += GameDefine.Attr_FontName[attType] + "加成:" + (yuanjieProPlus[i] / 100).toFixed(1) + "%\n";
            attRight += GameDefine.Attr_FontName[attType] + "加成:" + (yuanjieProPlusNext[i] / 100).toFixed(1) + "%\n";
        }
        this.attriLeft.text = attLeft;
        this.attriRight.text = attRight;

        let modelYJCur: Modelyuanjie = this.getModelCurr();
        this.currency.setCostByAwardItem(modelYJCur.cost);

        this.powerbar.power = GameCommon.calculationFighting(tempAttribute);

        let currExp = 0;
        let maxExp = 0;
        if (modelNext) {
            if (modelCurr) {
                this.imgLogo.source = modelCurr.waixing + "_png";
                if (modelCurr == modelNext) {
                    currExp = maxExp = modelNext.max;
                } else {
                    currExp = this.yjManager.yjExp - modelCurr.max;
                    maxExp = modelNext.max - modelCurr.max;
                }
            } else {
                this.imgLogo.source = modelNext.waixing + "_png";
                currExp = this.yjManager.yjExp;
                maxExp = modelNext.max;
            }
        }
        this.progressExp.maximum = maxExp;
        this.progressExp.value = currExp;
    }
    protected onRegist(): void {
        super.onRegist();
        this.onZhuYuanCall();
        this.groupAttribute.visible = false;
        this.btnZhuYuan.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventZhuYuan, this);
        this.btnAttribute.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventAttributeShow, this);
        this.groupAttribute.touchEnabled = true;
        this.groupAttribute.touchChildren = false;
        this.groupAttribute.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventAttributeClose, this);

        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.YUANJIE_MESSAGE.toString(), this.onZhuYuanCall, this);
        this.actionLogoShow();
    }
    protected onRemove(): void {
        super.onRemove();
        this.btnZhuYuan.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventZhuYuan, this);
        this.btnAttribute.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventAttributeShow, this);
        this.groupAttribute.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventAttributeClose, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FULING_MESSAGE.toString(), this.onZhuYuanCall, this);
        this.actionLogoClose();
    }

    protected onRefresh(): void {
        super.onRefresh();
    }
    private getModelCurr(): Modelyuanjie {
        return this.yjManager.getModelYuanJie()[this.currIdx];
    }
    private onEventAttributeShow() {
        this.groupAttribute.visible = true;
    }
    private onEventAttributeClose() {
        this.groupAttribute.visible = false;
    }
    private onEventZhuYuan() {
        //this.btnZhuYuan.enabled = false;
        let cost: AwardItem = this.getModelCurr().cost;
        if (GameCommon.getInstance().onCheckItemConsume(cost.id, cost.num, cost.type)) {
            var message: Message = new Message(MESSAGE_ID.YUANJIE_MESSAGE);
            message.setByte(0);
            message.setShort(this.getModelCurr().id);
            GameCommon.getInstance().sendMsgToServer(message);
        }
    }
    private onZhuYuanCall() {
        //this.btnZhuYuan.enabled = true;
        this.updateUI();
    }
    private onSelectItem(event: egret.Event): void {
        let idx = parseInt(event.target.name);
        if (idx != this.currIdx) {
            this.currIdx = idx;
            this.updateUI();
        }
    }
    private checkRedPointBtn() {
        return this.yjManager.checkRedPointItem(this.getModelCurr());
    }
}