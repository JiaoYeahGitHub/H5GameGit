class SmeltEquipPanel extends BaseTabView {
    private items: SmeltInstance[];
    private itemLayer: eui.Group;
    private btn_smelt: eui.Button;
    private btn_smelt_all: eui.Button;
    private smeltQueue;
    private currEquip: EquipThing[];
    private _aniSmelt: Animation;
    private lbGold: eui.Label;
    private lbGold_all: eui.Label;
    private smelt_all_desc: eui.Label;
    private smelt_info_grp: eui.Group;
    private smeltall_info_grp: eui.Group;

    private blessSmeltQueue: Array<ServantEquipThing>;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.SmeltEquipPanelSkin;
    }
    protected onInit(): void {
        this.items = [];
        var item: SmeltInstance;
        for (var i: number = 0; i < 10; i++) {
            item = this['item' + i];
            item.onUpdate(null, SMELTINSTANCE_TYPE.NONE, 0);
            this.items.push(item);
        }
        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_smelt.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSmelt, this);
        this.btn_smelt_all.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSmeltAll, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_SMELT_COMMON_MESSAGE.toString(), this.onRefresh, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_smelt.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSmelt, this);
        this.btn_smelt_all.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSmeltAll, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_SMELT_COMMON_MESSAGE.toString(), this.onRefresh, this);
    }
    protected onRefresh(): void {
        this.currEquip = [];
        if (this.isHidePay) {
            this.smelt_info_grp.horizontalCenter = 0;
            this.smeltall_info_grp.visible = false;
        } else {
            this.smelt_info_grp.horizontalCenter = -140;
            this.smeltall_info_grp.visible = true;
        }
        this.onSmeltBack();
    }
    private onSmeltBack(): void {
        this.smeltQueue = {};
        this.blessSmeltQueue = [];
        if (this.currEquip.length == 0) {
            this.currEquip = this.getBag().getSmeltEquipNormal();
        }
        let gold: number = 0;
        var idx: number = 0;
        for (var i: number = 0; i < 10; i++) {
            this.smeltQueue[i] = this.currEquip[i];
            var thing: EquipThing = this.smeltQueue[i];
            if (thing) {
                this.items[i].onUpdate(thing, SMELTINSTANCE_TYPE.SHOWLV, 0);
                this['item_icon' + i].source = thing.model.icon;
                gold += GameDefine.EQUIP_SMELTS[thing.quality];
            } else {
                idx = idx + 1;
                this['item_icon' + i].source = '';
                this.items[i].onUpdate(null, SMELTINSTANCE_TYPE.NONE, 0);
            }
        }

        var _currSmeltThings: Array<ServantEquipThing> = this.getBag().getSmeltEquipSpecial();
        for (var j: number = 0; j < _currSmeltThings.length; j++) {
            this.blessSmeltQueue.push(_currSmeltThings[j]);
        }
        if (idx > 0) {
            let thing1: ServantEquipThing;
            let num: number = 0;
            for (var i: number = 10 - idx; i < 10; i++) {
                thing1 = this.blessSmeltQueue[num];
                num = num + 1;
                if (thing1) {
                    this.items[i].onUpdate(thing1, SMELTINSTANCE_TYPE.SHOWLV, 1);
                    gold += GameDefine.EQUIP_SMELTS[thing1.quality];
                } else {
                    this.items[i].onUpdate(null, SMELTINSTANCE_TYPE.NONE, 1);
                }
            }
        }
        this.lbGold.text = "可获得" + gold + "元宝";

        if (!this.isHidePay) {
            if (DataManager.getInstance().playerManager.player.viplevel < GameDefine.ALL_SMELTS_VIPLEVEL) {
                this.smelt_all_desc.text = `VIP${GameCommon.getInstance().getVipName(GameDefine.ALL_SMELTS_VIPLEVEL)}开启一键回收`;
            } else {
                this.smelt_all_desc.text = `一键回收所有装备`;
                let all_gold: number = 0;
                for (let i: number = 0; i < this.currEquip.length; i++) {
                    let thing: EquipThing = this.currEquip[i];
                    all_gold += GameDefine.EQUIP_SMELTS[thing.quality];
                }
                for (let i: number = 0; i < this.blessSmeltQueue.length; i++) {
                    let thing: ServantEquipThing = this.blessSmeltQueue[i];
                    all_gold += GameDefine.EQUIP_SMELTS[thing.quality];
                }
                this.lbGold_all.text = `可获得${all_gold}元宝`;
            }
        }
    }
    public getSmeltLength(): number {
        var i: number = 0;
        for (var key in this.smeltQueue) {
            if (this.smeltQueue[key]) {
                i++;
            }
        }
        return i;
    }
    public delSmeltQueue(slot: number): void {
        if (this.smeltQueue[slot]) {
            this.smeltQueue[slot].selected = false;
            delete this.smeltQueue[slot];
        }
    }
    private onTouchBtnSmelt(): void {
        var len: number = this.getSmeltLength();
        if (len < 10) {
            var len1: number = this.blessSmeltQueue.length;
            if (len1 > 0) {
                var num = 0;
                if (10 - len > len1) {
                    num = len1;
                }
                else {
                    num = 10 - len;
                }
                DataManager.getInstance().forgeManager.onSendSmeltSpecialMessage(this.blessSmeltQueue, num);
                var idx: number = 0;
                for (var i: number = len; i < 10; i++) {
                    this.items[i].playSmelt();
                    this.items[i].onUpdate(null, SMELTINSTANCE_TYPE.NONE, 0);

                    if (this.blessSmeltQueue[idx]) {
                        this['item_icon' + i].visible = true;
                        egret.Tween.get(this['item_icon' + i]).to({ x: 295, y: 358, scaleX: 0.5, scaleY: 0.5 }, 400).call(this.onPlayDone, this);
                    }
                    idx = idx + 1;
                }
                this.blessSmeltQueue = [];

            }
            if (len == 0) {
                if (len1 > 0) {
                    this.onPlayHuishouAnim();
                }
                return;
            }
        }
        this.onDelaySmletHanlde(this.smeltQueue);
        let smeltCount: number = 0;
        for (var i: number = 0; i < 10; i++) {
            this.items[i].playSmelt();
            this.items[i].onUpdate(null, SMELTINSTANCE_TYPE.NONE, 0);
            if (this.smeltQueue[i]) {
                for (var j: number = this.currEquip.length - 1; j >= 0; j--) {
                    if (this.currEquip[j].equipId == this.smeltQueue[i].equipId) {
                        this.currEquip.splice(j, 1);
                        break;
                    }
                }
                this['item_icon' + i].visible = true;
                egret.Tween.get(this['item_icon' + i]).to({ x: 295, y: 358, scaleX: 0.5, scaleY: 0.5 }, 400).call(this.onPlayDone, this);
                smeltCount++;
            } else {
                break;
            }
        }
        this.onPlayHuishouAnim();
        Tool.callbackTime(this.onYuanbaoAnim, this, 500, smeltCount);
        this.onSendDelaySmletMsg();
    }
    private onPlayHuishouAnim(): void {
        if (!this._aniSmelt) {
            this._aniSmelt = new Animation("UI_huishou", 1);
            this._aniSmelt.x = this.width / 2;
            this._aniSmelt.y = 610;
            this.itemLayer.addChild(this._aniSmelt);
        } else {
            this._aniSmelt.visible = true;
            this._aniSmelt.playNum = 1;
        }
    }
    //元宝喷发动画
    private onYuanbaoAnim(length: number): void {
        if (!this.parent) return;
        let yuanbaoLen: number = length * 2;
        let yuanbaoThing: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.GOLD, 0);
        let moneybar = this.owner['basic']['btnTopMoney'];
        let targetPos: egret.Point = new egret.Point(moneybar.x, moneybar.y);
        for (let i: number = 0; i < yuanbaoLen; i++) {
            let yuanbaoImg: eui.Image = new eui.Image(yuanbaoThing.dropicon);
            yuanbaoImg.width = 64;
            yuanbaoImg.anchorOffsetX = 32;
            yuanbaoImg.height = 52;
            yuanbaoImg.anchorOffsetY = 26;
            yuanbaoImg.x = this.width / 2;
            yuanbaoImg.y = 650;
            this.itemLayer.addChild(yuanbaoImg);
            egret.Tween.get(yuanbaoImg).to({ x: Tool.randomInt(yuanbaoImg.x - 100, yuanbaoImg.x + 100), y: Tool.randomInt(720, 740) }, 300).wait(100 + i * 50).call(this.yuanbaoPlayDone, this, [yuanbaoImg, targetPos]);
        }
    }
    private yuanbaoPlayDone(yuanbaoImg: eui.Image, targetPos: egret.Point): void {
        if (!targetPos) {
            egret.Tween.removeTweens(yuanbaoImg);
            if (yuanbaoImg.parent) {
                yuanbaoImg.parent.removeChild(yuanbaoImg);
            }
            yuanbaoImg = null;
        } else {
            (this.owner['basic']).addChild(yuanbaoImg);
            egret.Tween.get(yuanbaoImg).to({ x: targetPos.x, y: targetPos.y, scaleX: 0.5, scaleY: 0.5 }, 500).call(this.yuanbaoPlayDone, this, [yuanbaoImg, null]);
        }
    }
    private itemIconPosX: number[] = [173, 366, 67, 471, 32, 521, 72, 467, 191, 350];
    private itemIconPosY: number[] = [32, 32, 154, 154, 304, 304, 433, 433, 515, 515];
    private onPlayDone(): void {
        for (var i: number = 0; i < 10; i++) {
            this['item_icon' + i].source = '';
            this['item_icon' + i].x = this.itemIconPosX[i];
            this['item_icon' + i].y = this.itemIconPosY[i];
            this['item_icon' + i].visible = false;
        }
    }
    private onTouchBtnSmeltAll(): void {
        if (DataManager.getInstance().playerManager.player.viplevel < GameDefine.ALL_SMELTS_VIPLEVEL) {
            GameCommon.getInstance().addAlert(`VIP${GameCommon.getInstance().getVipName(GameDefine.ALL_SMELTS_VIPLEVEL)}开启一键回收`);
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "VipPanel");
            return;
        }
        let allsmeltEquips = [];
        for (let i: number = 0; i < this.currEquip.length; i++) {
            let thing: EquipThing = this.currEquip[i];
            allsmeltEquips.push(thing);
        }
        for (let i: number = 0; i < this.blessSmeltQueue.length; i++) {
            let thing: ServantEquipThing = this.blessSmeltQueue[i];
            allsmeltEquips.push(thing);
        }
        var len: number = allsmeltEquips.length;
        if (len == 0) return;

        DataManager.getInstance().forgeManager.onSendSmeltCommonMessage(allsmeltEquips, len);
        for (var i: number = 0; i < this.currEquip.length; i++) {
            if (i < 9) {
                this.items[i].playSmelt();
                this.items[i].onUpdate(null, SMELTINSTANCE_TYPE.NONE, 0);
            }
            if (this.currEquip[i]) {
                this.currEquip.splice(i, 1);
            }
        }
        this.onPlayHuishouAnim();
        Tool.callbackTime(this.onYuanbaoAnim, this, 500, 9);
        this.onSmeltBack();
    }
    /**熔炼消息延迟处理**/
    private _delaysmletAry: EquipThing[];
    private onDelaySmletHanlde(smeltequips): void {
        if (!this._delaysmletAry) {
            this._delaysmletAry = [];
        }
        for (var key in smeltequips) {
            if (!smeltequips[key]) continue;
            if (this._delaysmletAry.indexOf(smeltequips[key]) < 0) {
                this._delaysmletAry.push(smeltequips[key]);
            }
        }
    }
    private onSendDelaySmletMsg(): void {
        if (this._delaysmletAry && this._delaysmletAry.length > 0) {
            DataManager.getInstance().forgeManager.onSendSmeltCommonMessage(this._delaysmletAry, this._delaysmletAry.length);
        }
        this._delaysmletAry = null;
    }
    private onTouchItem(e: egret.Event): void {
        var item: SmeltInstance = <SmeltInstance>e.currentTarget;
        if (item.thing) {
            this.delSmeltQueue(item.thing.smeltSot);
            item.onUpdate(null, SMELTINSTANCE_TYPE.NONE, 0);
        } else {
            SmeltPanel.isClear = false;
            GameDispatcher.getInstance().dispatchEvent(
                new egret.Event(GameEvent.MODULE_WINDOW_CLOSE),
                "SmeltPanel"
            );
            GameDispatcher.getInstance().dispatchEvent(
                new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                new WindowParam("SmeltSelectPanel", new SmeltSelectParam(0, this.smeltQueue, 9, this.currEquip))
            );
        }
    }
    public onHide(): void {
        if (SmeltPanel.isClear) {
            this.smeltQueue = {};
        }
        this.onSendDelaySmletMsg();
        if (this._aniSmelt) {
            this.itemLayer.removeChild(this._aniSmelt);
        }
        this._aniSmelt = null;
        for (let i: number = this.itemLayer.numChildren - 1; i >= 0; i--) {
            let itemchild = this.itemLayer.getChildAt(i);
            egret.Tween.removeTweens(itemchild);
            if (itemchild.parent) {
                itemchild.parent.removeChild(itemchild);
            }
            itemchild = null;
        }

        super.onHide();
    }
    private get isHidePay(): boolean {
        return !FunDefine.getXYXFuncIsOpen(Constant.FANGKUAIWAN_HIDE_SHARE);
    }
    private getBag() {
        return DataManager.getInstance().bagManager;
    }
}