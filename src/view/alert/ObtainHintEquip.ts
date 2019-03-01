class ObtainHintEquip extends BaseComp {
    public btn_use: eui.Button;
    public goodsLayer: eui.Group;
    public label_name: eui.Label;
    private label_num: eui.TextInput;
    private btnAdd: eui.Button;
    private btnReduce: eui.Button;
    private label_guide: eui.Label;
    private num: number;
    private sum: number;
    private img_sys: eui.Image;
    private equipLayer: eui.Group;
    private hint_grp: eui.Group;
    private closeBtn1: eui.Button;

    private autoCloseTime: number = -1;

    public constructor() {
        super();
    }
    protected setSkinName(): void {
        this.skinName = skins.ObtainHintSkin;
    }
    protected onInit(): void {
        this.currentState = "equip";
    }
    protected dataChanged() {
        this.equipLayer.removeChildren();
        var equip: GoodsInstance = new GoodsInstance();
        equip.onUpdate(GOODS_TYPE.MASTER_EQUIP, this._data.thing.modelId, this._data.thing.equipId, this._data.thing.quality);
        this.equipLayer.addChild(equip);
    }
    private onTouchBtnSend() {
        for (var dIndex: number = 0; dIndex < DataManager.getInstance().playerManager.player.playerDatas.length; dIndex++) {
            this.sendClothEquipMsg(DataManager.getInstance().playerManager.player.playerDatas[dIndex])
        }
        this.onDestory();
    }
    private sendClothEquipMsg(_playerData: PlayerData): void {
        DataManager.getInstance().bagManager.onClothEquipAll();
    }
    protected onRegist(): void {
        this.btn_use.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
        this.closeBtn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onDestory, this);
        this.hint_grp.y = size.height + 500;
        egret.Tween.get(this.hint_grp).to({ y: size.height - 330 }, 500, egret.Ease.sineOut).call(function () {
            egret.Tween.removeTweens(this.hint_grp);
        }, this);
        if (this.currentState == "equip") {
            this.autoCloseTime = 6;
        } else {
            this.autoCloseTime = -1;
        }

        if (this.autoCloseTime > 0) {
            Tool.addTimer(this.autoTimerHanlder, this, 1000);
        }
    }
    private autoTimerHanlder(): void {
        if (this.autoCloseTime == 0) {
            this.onTouchBtnSend();
        } else {
            this.autoCloseTime--;
            this.btn_use.label = Language.instance.getText('equip') + `(${this.autoCloseTime}S)`;
        }
    }
    protected onRemove(): void {
        this.btn_use.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSend, this);
        this.closeBtn1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onDestory, this);
        Tool.removeTimer(this.autoTimerHanlder, this, 1000);
    }
    //The end
}