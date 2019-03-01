/**
 * 
 * 龙魂
 *
 * 
 * 
 */
class DragonSoulPanel extends BaseTabView {
    public static index: number = 0;

    private attributeLayer: eui.Group;
    private btn_normal_random: eui.Button;
    private btn_normal_randomTen: eui.Button;
    private btn_save: eui.Button;
    private btn_cancel: eui.Button;
    private consume_normal: ConsumeBar;
    private label_get: eui.Label;
    private animLayer: eui.Group;
    private explainLayer: eui.Group;
    private explain_label: eui.Label;
    private consume_ten: ConsumeBar;
    private power: PowerBar;

    protected points: redPoint[];
    private animPos: egret.Point;
    private explainStr: string;
    private costItemModel;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.DragonSoulMainSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.animPos = new egret.Point(0, 310);
        this.explainStr = Language.instance.getText('longhundesc');
        GameCommon.getInstance().addUnderlineStr(this.explain_label);
        this.explainStr = GameCommon.getInstance().readStringToHtml(this.explainStr);
        this.costItemModel = GameCommon.getInstance().getThingModel(GOODS_TYPE.ITEM, GameDefine.LONGHUN_GOODS_ID);
        GameCommon.getInstance().addUnderlineGet(this.label_get);
        this.points = RedPointManager.createPoint(1);
        this.points[0].register(this.btn_normal_random, GameDefine.RED_BTN_POS, DataManager.getInstance().dragonSoulManager, "checkRedPoint");
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.explainLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        this.btn_normal_random.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRandomNormal, this);
        this.btn_normal_randomTen.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRandomNormalTen, this);
        // this.checkbox_diamond.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCheckboxDiamond, this)
        this.btn_save.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSave, this);
        this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnCancel, this);
        this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGet, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.LONGHUN_RANDOM.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.LONGHUN_CHANGE.toString(), this.update, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_normal_random.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRandomNormal, this);
        this.btn_normal_randomTen.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRandomNormalTen, this);
        // this.checkbox_diamond.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCheckboxDiamond, this)
        this.btn_save.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSave, this);
        this.btn_cancel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnCancel, this);
        this.label_get.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGet, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.LONGHUN_RANDOM.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.LONGHUN_CHANGE.toString(), this.update, this);
    }

    protected onRefresh(): void {
        this.updateInfo();
    }

    private getPlayerData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData(0);
    }
    private getPlayer(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    private onTouchExplain() {
        GameDispatcher.getInstance().dispatchEvent(
            new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ExplainPanel", this.explainStr)
        );
    }
    private onTouchBtnRandomNormalTen() {
        if (!GameCommon.getInstance().onCheckItemConsume(GameDefine.LONGHUN_GOODS_ID, GameDefine.LONGHUN_GOODS_NUM * 10)) {
            return;
        }
        DataManager.getInstance().dragonSoulManager.sendRandomMessage(DragonSoulPanel.index, false, 0);
        this.btn_normal_random.enabled = false;
        this.btn_normal_randomTen.enabled = false;
    }
    private onTouchBtnRandomNormal() {
        if (!GameCommon.getInstance().onCheckItemConsume(GameDefine.LONGHUN_GOODS_ID, GameDefine.LONGHUN_GOODS_NUM)) {
            return;
        }
        DataManager.getInstance().dragonSoulManager.sendRandomMessage(DragonSoulPanel.index, false, 0);
        this.btn_normal_random.enabled = false;
        this.btn_normal_randomTen.enabled = false;
    }

    private onTouchBtnSave() {
        var message = new Message(MESSAGE_ID.LONGHUN_CHANGE);
        message.setByte(DragonSoulPanel.index);
        GameCommon.getInstance().sendMsgToServer(message);
        this.btn_normal_random.enabled = true;
        this.btn_normal_randomTen.enabled = true;
    }
    private onTouchBtnCancel() {
        var quitNotice = [{ text: Language.instance.getText("longhunconfirm") }];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, function () {
                this.cancel();
            }, this))
        );
    }

    private cancel() {
        var message = new Message(MESSAGE_ID.LONGHUN_CANCEL);
        message.setByte(DragonSoulPanel.index);
        GameCommon.getInstance().sendMsgToServer(message);
        this.update();
        this.btn_normal_random.enabled = true;
        this.btn_normal_randomTen.enabled = true;
    }
    private onTouchGet() {
        GameCommon.getInstance().onShowFastBuy(GameDefine.LONGHUN_GOODS_ID, GOODS_TYPE.ITEM);
    }

    /*更新显示信息*/
    private updateInfo() {
        var item: DragonSoulItem;
        var coatardLv: number = DataManager.getInstance().playerManager.player.coatardLv;
        var model: Modellonghun = JsonModelManager.instance.getModellonghun()[coatardLv];
        if (this.attributeLayer.numChildren == 0) {
            for (var i = 0; i < GameDefine.LONGHUAN_ATTR.length; i++) {
                item = new DragonSoulItem();
                item.update(model, GameDefine.LONGHUAN_ATTR[i], this.getPlayerData().longhunAttribute[i], DataManager.getInstance().dragonSoulManager.curRandomValue[i])
                this.attributeLayer.addChild(item);
            }
        } else {
            for (var i = 0; i < GameDefine.LONGHUAN_ATTR.length; i++) {
                item = this.attributeLayer.getChildAt(i) as DragonSoulItem;
                item.update(model, GameDefine.LONGHUAN_ATTR[i], this.getPlayerData().longhunAttribute[i], DataManager.getInstance().dragonSoulManager.curRandomValue[i]);
            }
        }

        this.consume_normal.setConsume(GOODS_TYPE.ITEM, GameDefine.LONGHUN_GOODS_ID, GameDefine.LONGHUN_GOODS_NUM);
        this.consume_ten.setConsume(GOODS_TYPE.ITEM, GameDefine.LONGHUN_GOODS_ID, GameDefine.LONGHUN_GOODS_NUM * 10);
        if (model != null) {
            this.animLayer.removeChildren();
            GameCommon.getInstance().addAnimation(model.effect, this.animPos, this.animLayer, -1);
        }

        if (DataManager.getInstance().dragonSoulManager.curRandomValue.length > 0) {
            this.btn_cancel.visible = true;
            this.btn_save.visible = true;
            this.btn_normal_random.visible = false;
            this.btn_normal_randomTen.visible = false;
        } else {
            this.btn_cancel.visible = false;
            this.btn_save.visible = false;
            this.btn_normal_random.visible = true;
            this.btn_normal_randomTen.visible = true;
            this.btn_normal_random.enabled = true;
            this.btn_normal_randomTen.enabled = true;
        }

        this.onUpdatePlayerPower();
    }

    private update() {
        DataManager.getInstance().dragonSoulManager.clear();
        this.onRefresh();
        this.getPlayer().updataAttribute();
    }

    //更新人物战斗力
    private onUpdatePlayerPower(): void {
        this.power.power = DataManager.getInstance().dragonSoulManager.getLonghunPower() + "";
    }
}
class DragonSoulItem extends BaseComp {
    private attr_title_img: eui.Image;
    private progress_cur_value: eui.ProgressBar;
    private label_change_value: eui.Label;
    private proName: eui.Label;

    private model: Modellonghun;
    private attrtype: ATTR_TYPE;
    private value: number;
    private change: number;

    public constructor() {
        super();
    }
    protected setSkinName(): void {
        this.skinName = skins.DragonSoulItemSkin;
    }
    protected onInit(): void {
        if (this.model) {
            this.update(this.model, this.attrtype, this.value, this.change);
        }
    }
    public update(model, attrtype, value: number, change?: number) {
        if (!this.isLoaded) {
            this.model = model;
            this.attrtype = attrtype;
            this.value = value;
            this.change = change;
            return false;
        }
        this.proName.text = GameDefine.Attr_FontName[attrtype];

        var max: number = 0;
        if (model != null) {
            max = model.attrAry[attrtype];
        }
        this.progress_cur_value.maximum = max;
        this.progress_cur_value.value = value;
        if (change && change != 0) {
            this.attr_title_img.visible = true;
            if (change > 0) {
                this.attr_title_img.source = `pet_upIcon_png`;
                this.label_change_value.text = "+" + change;
                this.label_change_value.textColor = GameDefine.Attr_After_Color;
            } else {
                this.label_change_value.text = "" + change;
                this.label_change_value.textColor = 0xff0000;
                this.attr_title_img.source = `pet_downIcon_png`;
            }
        } else {
            this.attr_title_img.visible = false;
            this.label_change_value.text = "";
        }

        this.model = null;
        this.attrtype = null;
        this.value = null;
        this.change = null;
    }
    //The end
}
