class IntensifyPanel extends BaseTabView {
    private power: PowerBar;
    private animRecords: ForgePosInfo[];
    // private centerPos: egret.Point;
    private data: EquipSlotThing;
    private label_get: eui.Label;
    private btn_advance: eui.Button;
    private totallv_lab: eui.Label;
    private btn_advanceAll: eui.Button;
    private strengthenMasterBtn: eui.Button;
    private model: Modelqianghua;
    private consumItem: ConsumeBar;
    private curPro: eui.Group;
    private nextPro: eui.Group;
    private okAnim: Animation;
    private animLayer: eui.Group;
    private qianghuaPro: eui.ProgressBar;
    protected points: redPoint[] = RedPointManager.createPoint(2);

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.IntensifyPanelSkin;
    }
    protected onInit(): void {
        this.animRecords = [];
        var _record: ForgePosInfo;
        var infySlot: ForgeSlot;
        for (var i = 0; i < GameDefine.Equip_Slot_Num; i++) {
            infySlot = (this[`equip_bar_${i}`] as ForgeSlot);
            infySlot.slotType = i;
            _record = new ForgePosInfo(infySlot.x, infySlot.y, infySlot.scaleX, infySlot.parent.getChildIndex(infySlot));
            this.animRecords.push(_record);
        }
        this.label_get.text = Language.instance.getText("huoqutujing");
        GameCommon.getInstance().addUnderlineGet(this.label_get);
        this.label_get.touchEnabled = true;
        this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);

        this.points[0].register(this.btn_advance, GameDefine.RED_BTN_POS, DataManager.getInstance().forgeManager, "getIntensifyPointShow");
        this.points[1].register(this.strengthenMasterBtn, new egret.Point(65, 5), DataManager.getInstance().strongerManager, "getPoint", STRONGER_MONSTER_TYPE.STRONGER_QIANG_HUA);
        this.consumItem.nameColor = 0xf3f3f3;
        super.onInit();
        this.resetPos();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_advance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdvanceClick, this);
        this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.strongerBtnClick, this);
        this.btn_advanceAll.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdvanceAllClick, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_INTENSIFY_MESSAGE.toString(), this.onIntensifyUpgrade, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_advance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdvanceClick, this);
        this.btn_advanceAll.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdvanceAllClick, this);
        this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.strongerBtnClick, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_INTENSIFY_MESSAGE.toString(), this.onIntensifyUpgrade, this);
    }
    protected onRefresh(): void {
        this.clothMsgUpdate();
        this.onUpdatePlayerPower();
        this.showIntensify(this.getPlayerData().currIntensify.slot);
        this.updateGoodsADD();
    }
    public trigger(): void {
        this.points[0].checkPoint();
        this.points[1].checkPoint();
    }
    private strongerBtnClick() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", STRONGER_MONSTER_TYPE.STRONGER_QIANG_HUA))
    }
    private onIntensifyUpgrade(): void {
        var before: number = this.getPlayerData().currIntensify.slot - 1;
        if (before == -1) {
            before = GameDefine.Equip_Slot_Num - 1;
        }
        this.clothMsgUpdate();
        this.onUpdatePlayerPower();
        this.showIntensify(before, false);
        var currIndex: number = this.getNowIntensifyEquip();
        if (currIndex == this.getPlayerData().currIntensify.slot) return;
        if (!this.okAnim) {
            this.okAnim = new Animation("new_qianghua", 1, false);
            this.okAnim.x = this.width / 2 + 7;
            this.okAnim.y = 350;
            this.animLayer.addChild(this.okAnim);
        } else {
            this.okAnim.visible = true;
            this.okAnim.playNum = 1;
        }
        this.okAnim.playFinishCallBack(this.onAnimPlayEnd, this);

        if (!this.isPlay) {
            this.play();
        }
    }
    private onAnimPlayEnd(): void {
        if (this.okAnim) {
            this.okAnim.visible = false;
        }
    }
    private resetPos() {
        // var recordInfo: ForgePosInfo;
        var infySlot: ForgeSlot;
        var curr = this.getPlayerData().currIntensify.slot;
        // this.data = this.getPlayerData().getEquipSlotThings(curr);
        // var param = curr;
        // for (var i = curr; i < param; i++) {
        // infySlot = (this[`equip_bar_${i >= GameDefine.Equip_Slot_Num ? i - GameDefine.Equip_Slot_Num : i}`] as ForgeSlot);
        // infySlot.currCircleIndex = i - curr;
        // recordInfo = this.animRecords[infySlot.currCircleIndex];
        // infySlot.x = recordInfo.posX;
        // infySlot.y = recordInfo.posY;
        // infySlot.scaleX = recordInfo.scale;
        // infySlot.scaleY = recordInfo.scale;
        // infySlot.parent.setChildIndex(infySlot, recordInfo.childNum);
        // if (i == curr) {
        let slotInfo: EquipSlotThing = this.getPlayerData().getEquipSlotThings(curr);
        // (this[`equip_bar_10`] as ForgeSlot).setinfo(slotInfo.intensifyLv);
        // (this[`equip_bar_10`] as ForgeSlot)['bgDi'].source = 'equip_slot_1_png';
        // (this[`equip_bar_10`] as ForgeSlot).slotType = curr;
        // this['slot_icon_img'].text = "+" + slotInfo.intensifyLv;
        this['slot_icon_img'].source = "public_slot_" + GoodsDefine.EQUIP_SLOT_TYPE[curr] + "_png";
        this['info1_lab'].text = "+" + slotInfo.intensifyLv;
        // this.slot_icon_img.source = "public_slot_" + GoodsDefine.EQUIP_SLOT_TYPE[this._slottype] + "_png";
        (this['equip_bar_' + curr] as ForgeSlot).selected = true;;
        // return;
        // }
        // }
    }
    private isPlay: boolean = false;
    private playedNum: number = 0;
    private play(): void {
        // this.isPlay = true;
        // let curr = this.getPlayerData().currIntensify.slot;
        let currIndex: number = this.getNowIntensifyEquip();
        // let offset: number = 1;
        // let recordInfo: ForgePosInfo;
        let param = GameDefine.Equip_Slot_Num + currIndex;
        let infySlot: ForgeSlot;
        // this.playedNum = 0;

        for (let j = currIndex; j < param; j++) {
            infySlot = (this[`equip_bar_${j >= GameDefine.Equip_Slot_Num ? j - GameDefine.Equip_Slot_Num : j}`] as ForgeSlot);
            // infySlot.currCircleIndex = j - currIndex - offset >= 0 ? j - currIndex - offset : GameDefine.Equip_Slot_Num - offset - (j - currIndex);
            //     recordInfo = this.animRecords[infySlot.currCircleIndex];
            infySlot.selected = false;
            //     egret.Tween.get(infySlot).to({}, 100).to({ x: recordInfo.posX, y: recordInfo.posY, scaleX: recordInfo.scale, scaleY: recordInfo.scale }, 150, egret.Ease.sineIn).call(this.playDone, this);
            //     infySlot.parent.setChildIndex(infySlot, recordInfo.childNum);
        }
        this.playDone();
    }
    private playDone() {
        // this.playedNum += 1;
        // if (this.playedNum == GameDefine.Equip_Slot_Num) {//一轮搞定
        //     var currIndex: number = this.getNowIntensifyEquip();
        //     if (currIndex == this.getPlayerData().currIntensify.slot) {//移动完成
        //         this.isPlay = false;
        //         this.data = this.getPlayerData().getEquipSlotThings(this.getPlayerData().currIntensify.slot);
        //         for (var i = 0; i < GameDefine.Equip_Slot_Num; i++) {
        //             var equip: ForgeSlot = (this[`equip_bar_${i}`] as ForgeSlot);
        //             if (equip.currCircleIndex == 0) {//找到现在培养位置装备
        //                 equip.selected = true;
        //                 break;
        //             }
        //         }
        //         this.showIntensify(this.getPlayerData().currIntensify.slot);
        //     } else {
        //         this.play();
        //     }
        // }
        let slotInfo: EquipSlotThing = this.getPlayerData().getEquipSlotThings(this.getPlayerData().currIntensify.slot);
        // (this[`equip_bar_10`] as ForgeSlot).setinfo(slotInfo.intensifyLv);
        // (this[`equip_bar_10`] as ForgeSlot).slotType = this.getPlayerData().currIntensify.slot;
        // this['slot_icon_img'].text = "+" + slotInfo.intensifyLv;
        this['info1_lab'].text = "+" + slotInfo.intensifyLv;
        this['slot_icon_img'].source = "public_slot_" + GoodsDefine.EQUIP_SLOT_TYPE[this.getPlayerData().currIntensify.slot] + "_png";
        (this['equip_bar_' + this.getPlayerData().currIntensify.slot] as ForgeSlot).selected = true;
        this.showIntensify(this.getPlayerData().currIntensify.slot);
    }
    private getNowIntensifyEquip(): number {
        var equip: ForgeSlot;
        var currIndex: number = 0;
        for (var i = 0; i < GameDefine.Equip_Slot_Num; i++) {
            equip = (this[`equip_bar_${i}`] as ForgeSlot);
            if (equip.currCircleIndex == 0) {//找到现在培养位置装备
                currIndex = i;
                break;
            }
        }
        return currIndex;
    }
    private getPlayerData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData();
    }
    private updateGoodsADD() {
        var cost = DataManager.getInstance().forgeManager.getIntensifyCost(this.data.slot);
        this.consumItem.visible = cost > 0;
        if (cost > 0) {
            this.consumItem.setConsume(this.model.cost.type, this.model.cost.id, cost);
        }
    }
    public onBtnAdvanceClick() {
        var cost = DataManager.getInstance().forgeManager.getIntensifyCost(this.data.slot);
        if (cost > 0) {
            if (!this.isPlay) {
                if (!GameCommon.getInstance().onCheckItemConsume(this.model.cost.id, cost)) {
                    return;
                }
                if (this.data) {
                    this.sendIntensify(this.data.slot);
                }
            }
        } else {
            GameCommon.getInstance().addAlert("装备强化等级达到上限");
        }
    }
    public onBtnAdvanceAllClick() {
        var cost = DataManager.getInstance().forgeManager.getIntensifyCost(this.data.slot);
        if (cost > 0) {
            if (!this.isPlay) {
                if (!GameCommon.getInstance().onCheckItemConsume(this.model.cost.id, cost)) {
                    return;
                }
                // var base: cardData = DataManager.getInstance().monthCardManager.card[CARD_TYPE.LIFELONG];
                // if (base && base.param > 0) {
                this.sendIntensify(99);
                // } else {
                //     GameCommon.getInstance().addAlert("购买至尊月卡才可开启此权限");
                // }
            }
        } else {
            GameCommon.getInstance().addAlert("装备强化等级达到上限");
        }
    }
    private sendIntensify(type: number) {
        if (!this.isPlay && this.data) {
            var message = new Message(MESSAGE_ID.PLAYER_INTENSIFY_MESSAGE);
            message.setByte(0);
            message.setByte(type);
            GameCommon.getInstance().sendMsgToServer(message);
            // if (type != 99)
            //     this.data = null;
        }
    }
    //更新人物战斗力
    private onUpdatePlayerPower(): void {
        this.qianghuaPro.maximum = DataManager.getInstance().strongerManager.getNextMuBiao(STRONGER_MONSTER_TYPE.STRONGER_QIANG_HUA);
        this.qianghuaPro.value = DataManager.getInstance().strongerManager.getCurNumByType(STRONGER_MONSTER_TYPE.STRONGER_QIANG_HUA);
        this.power.power = DataManager.getInstance().forgeManager.getRoleIntensifyPower() + "";
    }
    private clothMsgUpdate(): void {
        let equip: ForgeSlot;
        let totallevel: number = 0;
        for (let i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            let slotInfo: EquipSlotThing = this.getPlayerData().getEquipSlotThings(i);
            equip = (this[`equip_bar_${i}`] as ForgeSlot);
            equip.setinfo(slotInfo.intensifyLv);
            totallevel += slotInfo.intensifyLv;
        }
        this.totallv_lab.text = Language.instance.parseInsertText('qianghuazongdengji', totallevel);
    }
    private showIntensify(curr: number, isNeed: boolean = true) {
        var add = 0;
        var addEd = 0;
        this.data = this.getPlayerData().getEquipSlotThings(curr);
        this.model = JsonModelManager.instance.getModelqianghua()[GoodsDefine.EQUIP_SLOT_TYPE[this.data.slot]];
        var curAttrAry: number[] = DataManager.getInstance().forgeManager.getIntensifyAttr(this.data.slot);
        var nextAttrAry: number[] = DataManager.getInstance().forgeManager.getIntensifyAttr(this.data.slot, this.data.intensifyLv + 1);

        var item: AttributesText;
        var add = 0;
        this.curPro.removeChildren();
        this.nextPro.removeChildren();
        for (var key in this.model.attrAry) {
            if (this.model.attrAry[key] > 0) {
                add = curAttrAry[key];
                item = new AttributesText();
                item.scaleX = 0.7;
                item.scaleY = 0.7;
                item.updateAttr(key, add);
                this.curPro.addChild(item);
                if (nextAttrAry[key] > 0) {
                    add = nextAttrAry[key];
                    item = new AttributesText();
                    item.scaleX = 0.7;
                    item.scaleY = 0.7;
                    item.updateAttr(key, add);
                    this.nextPro.addChild(item);
                }
            }
        }
        if(this.data.intensifyLv< GameDefine.QIANGHUA_MAX)
        {
            this.currentState = 'normal';
        }
        else
        {
            this.currentState = 'max';
        }
        if (isNeed) {
            this.updateGoodsADD();
        }
    }
    private onGetBtn(event: TouchEvent): void {
        var model: Modelqianghua;
        model = JsonModelManager.instance.getModelqianghua()[GoodsDefine.EQUIP_SLOT_TYPE[this.data.slot]][0];
        GameCommon.getInstance().onShowFastBuy(model.cost.id);
    }
}