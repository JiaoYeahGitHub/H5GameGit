class SmeltSpecialPanel extends BaseTabView {
    private itemLayer: eui.Group;
    private desc_lab: eui.Label;
    private smeltQueue: Array<ServantEquipThing>;
    private items: SmeltInstance[];
    private btn_smelt: eui.Button;
    private smelt_value_lab: eui.Label;
    private btn_goto: eui.Button;
    private currLv: number;
    private animPos: egret.Point = new egret.Point(324, 440);
    private animLayer: eui.Group;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.SmeltSpecialPanelSkin;
    }
    protected onInit(): void {
        this.smeltQueue = [];
        this.items = [];
        var item: SmeltInstance;
        for (var i: number = 0; i < 10; i++) {
            item = new SmeltInstance(i);
            item.onUpdate(null, SMELTINSTANCE_TYPE.NONE, 1);
            this.itemLayer.addChild(item);
            this.items.push(item);
        }
        this.desc_lab.text = Language.instance.getText(`huanlingronglianshuoming`);
        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_smelt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSmelt, this);
        this.btn_goto.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnGoto, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_SMELT_SPECIAL_MESSAGE.toString(), this.onSmeltBack, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.onReciveBagAddMsg, this);
        // for (var i: number = 0; i < 10; i++) {
        //     this.items[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
        // }
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_smelt.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSmelt, this);
        this.btn_goto.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnGoto, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_SMELT_SPECIAL_MESSAGE.toString(), this.onSmeltBack, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.onReciveBagAddMsg, this);
        // for (var i: number = 0; i < 10; i++) {
        //     this.items[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
        // }
    }
    protected onRefresh(): void {
        this.onUpdateSmeltList();
        this.showSmeltValue();
    }
    protected onReciveBagAddMsg(event: egret.Event): void {
        var goodstype: GOODS_TYPE = event.data as GOODS_TYPE;
        if (goodstype == GOODS_TYPE.SERVANT_EQUIP) {
            this.onUpdateSmeltList();
        }
    }
    private onSmeltBack(): void {
        this.onRefresh();
        // if (this.currLv < this.getPlayerData().smeltLv) {
        //     this.currLv = this.getPlayerData().smeltLv;
        //     GameCommon.getInstance().addAnimation("shengjichenggong", this.animPos, this.animLayer);
        // }
    }
    private onTouchBtnSmelt(): void {
        var len: number = this.smeltQueue.length;
        if (len == 0) return;
        DataManager.getInstance().forgeManager.onSendSmeltSpecialMessage(this.smeltQueue, len);
        for (var i: number = 0; i < 10; i++) {
            this.items[i].playSmelt();
            this.items[i].onUpdate(null, SMELTINSTANCE_TYPE.NONE, 1);
        }
        for (var aryIdx in this.smeltQueue) {
            this.smeltQueue[aryIdx].issmelt = true;
        }
        this.smeltQueue = [];
    }
    private getBag() {
        return DataManager.getInstance().bagManager;
    }
    public onUpdateSmeltList(): void {
        var thing: ServantEquipThing;
        this.smeltQueue = [];
        // var _currSmeltThings: Array<ServantEquipThing> = this.getBag().getSmeltEquipSpecial();
        // for (var j: number = 0; j < _currSmeltThings.length; j++) {
        //     this.smeltQueue.push(_currSmeltThings[j]);
        // }
        // for (var i: number = 0; i < 10; i++) {
        //     thing = this.smeltQueue[i];
        //     if (thing) {
        //         this.items[i].onUpdate(thing, SMELTINSTANCE_TYPE.SHOWLV, 1);
        //     } else {
        //         this.items[i].onUpdate(null, SMELTINSTANCE_TYPE.NONE, 1);
        //     }
        // }
    }
    private showSmeltValue() {
        var smeltMax: number = 10000;
        this.smelt_value_lab.text = Language.instance.getText('currency22', '：', `${this.getPlayerData().smelt}/${smeltMax}`);
    }
    private getPlayerData() {
        return DataManager.getInstance().playerManager.player;
    }
    private onTouchBtnGoto(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_MOUNT);
    }
    //The end
}