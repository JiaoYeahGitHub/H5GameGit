class OrangePanel extends BaseTabView {
    public static ITEM_ID: number = 41;
    private powerbar: PowerBar;
    //合成
    private label_equip_mix: eui.Label;
    private equip_mix: EquipInstance;

    //合成升级
    private btn_clothAll: eui.Button;
    private btn_upgrade: eui.Button;
    private btn_state: number;
    //分解
    private label_res: eui.Label;
    private consItem: ConsumeBar;
    private reslabel_grp: eui.Group;
    private curPro: eui.Label;
    private nextPro: eui.Label;
    //当前选择的装备
    private selected: EquipInstance;
    private cost: number;
    //装备属性
    // private currLayer: eui.Group;

    private selectAnim: Animation;
    // private labelLayer: eui.Group;

    private qihunBtn: eui.Button;

    // private firstRedEquipsId: number[] = [201, 202, 203, 204, 205, 206, 207, 208, 209, 210];
    protected points: redPoint[] = RedPointManager.createPoint(14);
    public constructor(owner) {
        super(owner);
    }

    protected onSkinName(): void {
        this.skinName = skins.OrangePanelSkin;
    }

    protected onInit(): void {
        super.onInit();
        this.label_res.text = Language.instance.getText("fenjiehuoqu");
        GameCommon.getInstance().addUnderlineStr(this.label_res);
        this.label_res.touchEnabled = true;
        this.label_res.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onRes, this);

        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            this.points[i].register(this[`equip${i}`], GameDefine.RED_GOODSINSTANCE_POS, DataManager.getInstance().celestialManager, "checkJobOrangeEquipPointBySlot", i + GameDefine.Equip_Slot_Num);
        }
        this.points[GameDefine.Equip_Slot_Num].register(this.btn_upgrade, GameDefine.RED_BTN_POS, DataManager.getInstance().celestialManager, "checkJobOrangeEquipPoint");
        this.points[GameDefine.Equip_Slot_Num + 1].register(this.reslabel_grp, new egret.Point(85, -8), DataManager.getInstance().celestialManager, "checkRedDecomposePoint");
        this.points[GameDefine.Equip_Slot_Num + 2].register(this.btn_clothAll, GameDefine.RED_BTN_POS, DataManager.getInstance().celestialManager, "checkCanClothZhuxianEquips");

        this.points[GameDefine.Equip_Slot_Num + 3].register(this.qihunBtn, GameDefine.RED_ROLE_EQUIP_BOTTOM_POS, FunDefine, "checkQihunRedPoint");
        this.consItem.nameColor = 0xf3f3f3;
        this.showOrangeEquip();
        this.onupdatePiecesNum();
        if (!this.selected) {
            this.clickOrangeEquipIndex(0);
        } else {
            this.clickOrangeEquipIndex(this.selected.pos - GameDefine.Equip_Slot_Num);
        }
    }
    protected onRefresh(): void {
        this.onupdatePiecesNum();
    }

    protected onRegist(): void {
        super.onRegist();
        this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
        this.btn_clothAll.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClothHanlder, this);
        GameDispatcher.getInstance().addEventListener(MESSAGE_ID.GAME_CLOTHEQUIP_MESSAGE.toString(), this.clothMsgUpdate, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ORANGE_RES_MESSAGE.toString(), this.onupdatePiecesNum, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GOODS_LIST_ADD_MESSAGE.toString(), this.onupdatePiecesNum, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GOODS_LIST_USE_MESSAGE.toString(), this.onupdatePiecesNum, this);
        for (let i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            let equip: EquipInstance = (this["equip" + i] as EquipInstance);
            equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquipClick, this);
        }
        this.qihunBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchQihun, this);
    }

    protected onRemove(): void {
        super.onRemove();
        this.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onUpgrade, this);
        this.btn_clothAll.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClothHanlder, this);
        GameDispatcher.getInstance().removeEventListener(MESSAGE_ID.GAME_CLOTHEQUIP_MESSAGE.toString(), this.clothMsgUpdate, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ORANGE_RES_MESSAGE.toString(), this.onupdatePiecesNum, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GOODS_LIST_ADD_MESSAGE.toString(), this.onupdatePiecesNum, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GOODS_LIST_USE_MESSAGE.toString(), this.onupdatePiecesNum, this);
        for (let i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            let equip: EquipInstance = (this["equip" + i] as EquipInstance);
            equip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquipClick, this);
        }
        this.qihunBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchQihun, this);
    }

    protected clothMsgUpdate(event: egret.Event): void {
        let position: number = event.data;
        var slotNum: number = position - GameDefine.Equip_Slot_Num;
        var equipThing: EquipThing = this.playerData.getEquipBySlot(position);
        let equip: EquipInstance = (this["equip" + slotNum] as EquipInstance);
        if (equip) {
            equip.onUpdate(equipThing, 0);
            equip.onPlayClothAnim();
            this.selectedOrangeEquip(equip);
        }

        this.onupdatePiecesNum();
    }
    public trigger(): void {
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            this.points[i].checkPoint();
        }
        this.points[GameDefine.Equip_Slot_Num].checkPoint();
        this.points[GameDefine.Equip_Slot_Num + 1].checkPoint();
        this.points[GameDefine.Equip_Slot_Num + 2].checkPoint();
        this.points[GameDefine.Equip_Slot_Num + 3].checkPoint();
    }

    private get playerData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData();
    }
    /**
     * 刷新橙装显示
     */
    private showOrangeEquip(): void {
        let equip: EquipInstance;
        for (let i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            let position: number = i + GameDefine.Equip_Slot_Num;
            let equipThing: EquipThing = this.playerData.getEquipBySlot(position);
            equip = (this["equip" + i] as EquipInstance);
            equip.pos = position;
            equip.shieldTip = true;
            equip.onUpdate(equipThing, 0);
        }
    }
    /**
     * 点击装备
     */
    private onEquipClick(e: egret.TouchEvent) {
        var equip: EquipInstance = e.currentTarget;
        this.selectedOrangeEquip(equip);
    }
    /**
     * 选择橙装
     */
    public selectedOrangeEquip(selectedEquip: EquipInstance) {
        var equip: EquipInstance;
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            equip = (this["equip" + i] as EquipInstance);
        }
        if (!this.selectAnim) {
            this.selectAnim = new Animation('xuanzhongkuang_3', -1);
            this.selectAnim.scaleX = 0.9;
            this.selectAnim.scaleY = 0.9;
            this.selectAnim.x = 50;
            this.selectAnim.y = 50;
        }
        if (this.selectAnim.parent) {
            this.selectAnim.parent.removeChild(this.selectAnim);
        }
        selectedEquip.addChildAt(this.selectAnim, 0);
        this.selected = selectedEquip;
        var selectedThing: EquipThing = selectedEquip.getEquipThing();
        //无装备
        if (!selectedThing || selectedThing.quality != GoodsQuality.Red) {
            this.btn_upgrade.enabled = true;
            this.consItem.visible = true;
            this.btn_upgrade.label = Language.instance.getText('hecheng');
            this.btn_state = MESSAGE_ID.ORANGE_MIX_MESSAGE;
        }
        //有装备
        else {
            var modeled: Modelhongzhuang = JsonModelManager.instance.getModelhongzhuang()[selectedThing.model.coatardLv - 1];
            this.btn_upgrade.enabled = modeled ? true : false;
            this.consItem.visible = modeled ? true : false;
            this.btn_upgrade.label = Language.instance.getText('upgrade');
            this.btn_state = MESSAGE_ID.ORANGE_UPGRADE_MESSAGE;
        }
        this.showNextOrange();
        this.trigger();
    }
    //显示下一级橙装
    private showNextOrange() {
        //选择位置
        let equipThing: EquipThing = this.selected.getEquipThing();
        //当前橙装等级
        let modelCurr: Modelhongzhuang = null;
        let dataCurr: EquipThing = null;
        //合成
        if (!equipThing || !equipThing.model) {
            modelCurr = JsonModelManager.instance.getModelhongzhuang()[0];
            let firstEquipId: number = GameCommon.parseIntArray(modelCurr.Eqid)[this.selected.pos - GameDefine.Equip_Slot_Num];
            dataCurr = new EquipThing(GOODS_TYPE.MASTER_EQUIP);
            dataCurr.onupdate(firstEquipId, GoodsQuality.Red);
            this.cost = modelCurr.hecheng;
        }
        else {
            dataCurr = equipThing;
            modelCurr = JsonModelManager.instance.getModelhongzhuang()[dataCurr.model.coatardLv - 1];
            let modelNext: Modelhongzhuang = JsonModelManager.instance.getModelhongzhuang()[dataCurr.model.coatardLv];
            if (modelNext) {
                this.cost = modelNext.hecheng - modelCurr.hecheng;
            }
        }
        var str: string = '';
        var nextPro: string = '';
        var attr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var tianshi_redequip_puls: number = DataManager.getInstance().playerManager.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.RED_EQUIP);
        for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
            let attrValue: number = dataCurr.attributes[i];
            attr[i] = attrValue;
            if (attrValue > 0) {
                let addValue: number = dataCurr.addAttributes[i];
                str = str + GameDefine.Attr_FontName[i] + "+" + attrValue + "\n";
                nextPro = nextPro + GameDefine.Attr_FontName[i] + "+" + (attrValue + addValue) + "\n";
                attr[i] += addValue + Tool.toInt(addValue * tianshi_redequip_puls % GameDefine.GAME_ADD_RATIO);
            }
        }
        this.nextPro.text = nextPro;
        this.curPro.text = str;
        this.powerbar.power = GameCommon.calculationFighting(attr);
        // this.label_equip_mix.text = dataCurr.model.name;
        this.equip_mix.onUpdate(dataCurr, 0);
        this.onupdatePiecesNum();
    }

    /**
     * 点击索引装备
     */
    private clickOrangeEquipIndex(index: number): void {
        let equip: EquipInstance = (this["equip" + index] as EquipInstance);
        this.selectedOrangeEquip(equip);
    }

    public static checkOrangePos(): number[] {
        var result: number[] = [];
        //背包物品数量
        var item: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(OrangePanel.ITEM_ID);
        var num: number = 0;
        if (item)
            num = item.num;
        var player: Player = DataManager.getInstance().playerManager.player;
        var playerData: PlayerData = player.getPlayerData();
        var lvCurr: number = Math.floor(player.level / 10) * 10;
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            var equipThing: EquipThing = playerData.getEquipBySlot(i + GameDefine.Equip_Slot_Num);
            var cost: number = 0;
            //合成
            if (!equipThing) {
                var modelCurr: Modelhongzhuang = JsonModelManager.instance.getModelhongzhuang()[0];
                cost = modelCurr.hecheng;
            }
            //升级
            else {
                //模型数据
                var currEquipLv: number = equipThing.model.coatardLv;
                if (player.level < currEquipLv + 10)
                    continue;
                var modelCurr: Modelhongzhuang = JsonModelManager.instance.getModelhongzhuang()[currEquipLv - 1];
                var modelNext: Modelhongzhuang = JsonModelManager.instance.getModelhongzhuang()[currEquipLv];
                cost = modelNext.hecheng - modelCurr.hecheng;
            }
            if (num >= cost)
                result[result.length] = i;
        }
        return result;
    }

    private onupdatePiecesNum(): void {
        var item: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(OrangePanel.ITEM_ID);
        var num: number = 0;
        if (item)
            num = item.num;
        this.consItem.setConsume(GOODS_TYPE.ITEM, OrangePanel.ITEM_ID, this.cost);
    }

    /**
     * 获取途径
     */
    private onGetBtn(event: TouchEvent): void {
        GameCommon.getInstance().onShowFastBuy(OrangePanel.ITEM_ID, GOODS_TYPE.ITEM);
    }

    //橙装分解
    private onRes() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("OrangeResPanel", GoodsQuality.Red));
    }
    //橙装合成升级
    private onUpgrade() {
        if (!GameCommon.getInstance().onCheckItemConsume(OrangePanel.ITEM_ID, this.cost)) {
            return;
        }
        var message = new Message(this.btn_state);
        message.setByte(0);
        message.setByte(this.selected.pos);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    private onClothHanlder(): void {
        DataManager.getInstance().bagManager.onClothEquipAll(1);
    }

    private onTouchQihun(): void {
        if (!FunDefine.onIsLockandErrorHint(FUN_TYPE.FUN_QIHUN)) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "QihunPanel");
        }
    }
    //The end
}