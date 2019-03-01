class QuenchingPanel extends BaseTabView {
    // private equip_best: ForgeSlot;
    private selectIndex: number;
    private wave_probar: eui.ProgressBar;
    // private currLayer: eui.Group;
    // private nextLayer: eui.Group;
    private curPro: eui.Label;
    private nextPro: eui.Label;
    private consumItem: ConsumeBar;
    private label_get: eui.Label;
    private btn_advance: eui.Button;
    private strengthenMasterBtn: eui.Button;
    private currLv: number;
    private animPos: egret.Point = new egret.Point(298, 323);
    private animLayer: eui.Group;
    private starAnimLayer: eui.Group;
    private isMax: boolean = false;
    private info1_lab: eui.Label;
    private getGrp: eui.Group;
    protected points: redPoint[] = RedPointManager.createPoint(12);
    private qianghuaPro: eui.ProgressBar;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.QuenchingPanelSkin;
    }
    protected onInit(): void {
        this.label_get.text = Language.instance.getText("huoqutujing");
        GameCommon.getInstance().addUnderlineGet(this.label_get);
        var equip: ForgeSlot;
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            equip = (this[`equip_bar_${i}`] as ForgeSlot);
            equip.slotType = i;
            equip.name = i.toString();
            equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquipClick, this);
            this.points[i].register(equip, new egret.Point(58, -5), DataManager.getInstance().forgeManager, "getJobQuenchingBySlot", i);
        }
        this.points[i].register(this.btn_advance, GameDefine.RED_BTN_POS, DataManager.getInstance().playerManager, "checkQuenchingPoint");
        this.points[i + 1].register(this.strengthenMasterBtn, new egret.Point(65, 5), DataManager.getInstance().strongerManager, "getPoint", STRONGER_MONSTER_TYPE.STRONGER_CUI_LIAN);
        this.selectIndex = this.getPlayerData().getSortQuenching()[0].slot;
        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.getGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.strongerBtnClick, this);
        this.btn_advance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdvanceClick, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.EQUIPSLOT_QUENCHING_MESSAGE.toString(), this.onQuenchingBack, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE, this.updateGoodsADD, this);
        this.selectIndex = this.getPlayerData().getSortQuenching()[0].slot;
    }
    protected onRemove(): void {
        super.onRemove();
        this.getGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.strongerBtnClick, this);
        this.btn_advance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdvanceClick, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.EQUIPSLOT_QUENCHING_MESSAGE.toString(), this.onQuenchingBack, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE, this.updateGoodsADD, this);
    }
    protected onRefresh(): void {
        this.onSelectedQuenching();
        this.onShowInfo();
        super.onRefresh();
        this.qianghuaPro.maximum = DataManager.getInstance().strongerManager.getNextMuBiao(STRONGER_MONSTER_TYPE.STRONGER_CUI_LIAN);
        this.qianghuaPro.value = DataManager.getInstance().strongerManager.getCurNumByType(STRONGER_MONSTER_TYPE.STRONGER_CUI_LIAN);
    }
    private strongerBtnClick() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", STRONGER_MONSTER_TYPE.STRONGER_CUI_LIAN))
    }
    public onBtnAdvanceClick(param?): void {
        if (this.isMax) {
            GameCommon.getInstance().addAlert("full_level");
            return;
        }

        var slotThing: EquipSlotThing = this.getPlayerData().getEquipSlotThings(this.selectIndex);
        var next: Modelcuilian = this.cuilianDict[(slotThing.quenchingLv + 1)];
        if (!GameCommon.getInstance().onCheckItemConsume(GoodsDefine.ITEM_ID_CUILIAN, next.costNum)) {
            return;
        }
        this.sendQuenching();
    }
    private sendQuenching() {
        var message = new Message(MESSAGE_ID.EQUIPSLOT_QUENCHING_MESSAGE);
        message.setByte(0);
        message.setByte(this.selectIndex);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    private onQuenchingBack(): void {
        var slotThing = this.getPlayerData().getEquipSlotThings(this.selectIndex);
        if (slotThing.quenchingLv > this.currLv) {
            // GameCommon.getInstance().addAnimation("new_cuilian_juji", new egret.Point(24, 300), this.animLayer);
            this.onShowStarAnim();
        }
        this.onRefresh();
    }

    private onEquipClick(e: egret.TouchEvent) {
        this.selectIndex = parseInt(e.currentTarget.name);
        this.onRefresh();
    }
    private onSelectedQuenching(): void {
        var equip: ForgeSlot;
        var slotThing: EquipSlotThing;
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            equip = (this[`equip_bar_${i}`] as ForgeSlot);
            slotThing = this.getPlayerData().getEquipSlotThings(i);
            equip.setinfo(slotThing.quenchingLv);
            if (i == this.selectIndex) {
                equip.selected = true;
                // this.equip_best.slotType = this.selectIndex;
                // this.equip_best.setinfo(slotThing.quenchingLv);
                // this['slot_icon_img'].text = "+" + slotThing.quenchingLv;
                this.info1_lab.text = "+" + slotThing.quenchingLv;
                this['slot_icon_img'].source = "public_slot_" + GoodsDefine.EQUIP_SLOT_TYPE[this.selectIndex] + "_png";
            } else {
                equip.selected = false;
            }
        }
    }
    private onShowInfo(): void {
        var slotThing: EquipSlotThing = this.getPlayerData().getEquipSlotThings(this.selectIndex);
        this.isMax = GameDefine.Equip_Cuilian_Max == slotThing.quenchingLv;
        if(this.isMax)
        {
            this.currentState = 'max';
        }
        else
        {
            this.currentState='advance';
        }
        this.wave_probar.visible = !this.isMax;
        var curr: Modelcuilian = this.cuilianDict[(slotThing.quenchingLv)];
        var next: Modelcuilian = this.cuilianDict[(slotThing.quenchingLv + 1)];
        var label: eui.Label;
        // this.currLayer.removeChildren();
        // this.nextLayer.removeChildren();
        var str: string = '';
        var add: number = 0;
        label = GameCommon.getInstance().createNormalLabel(24, 0xF5C546, 1);
        add = curr ? curr.effect / 100 : 0;
        str = `提高基础属性：${add}%` + '\n';
        // this.currLayer.addChild(label);
        this.curPro.text = str;
        this.onShowStar(slotThing.quenchingLv);
        if (next) {
            label = GameCommon.getInstance().createNormalLabel(24, 0xF5C546, 1);
            add = next.effect / 100;
            label.text = `${add}%`;
            this.nextPro.text = '提高基础属性：' + `${add}%` + '\n';
            // this.nextLayer.addChild(label);
            this.wave_probar.maximum = next.exp;
            this.wave_probar.value = slotThing.quenchingExp;
        }
        this.updateGoodsADD();
        this.currLv = slotThing.quenchingLv;
    }
    private onShowStarAnim(): void {
        var slotThing = this.getPlayerData().getEquipSlotThings(this.selectIndex);
        var x: number = this.starAnimLayer.width / 10 * (slotThing.quenchingLv - 1) + (slotThing.quenchingLv - 1) * 2 + 17;
        var curr: Modelcuilian = this.cuilianDict[(slotThing.quenchingLv)];
        if ((slotThing.quenchingLv) == 10) {
            GameCommon.getInstance().addAnimation("new_cuilian_kuang", this.animPos, this.animLayer);
        }
        var pos = new egret.Point(x, 0);
        var animRes: string;
        switch (curr.pinzhi) {
            case 2:
                animRes = "new_cuilian_juji";
                break;
            case 3:
                animRes = "new_cuilian_juji";
                break;
            case 4:
                animRes = "new_cuilian_juji";
                break;
        }
        GameCommon.getInstance().addAnimation(animRes, pos, this.starAnimLayer);
    }
    private onShowStar(lv: number): void {
        var img: eui.Image;
        for (var i: number = 0; i < 10; i++) {
            img = this[`img_star${i}`];
            if ((i + 1) <= lv) {
                img.visible = true;
            } else {
                img.visible = false;
            }
        }
    }
    private updateGoodsADD() {
        this.consumItem.visible = !this.isMax;
        if (!this.isMax) {
            var slotThing: EquipSlotThing = this.getPlayerData().getEquipSlotThings(this.selectIndex);
            var next: Modelcuilian = this.cuilianDict[(slotThing.quenchingLv + 1)];
            this.consumItem.setConsume(GOODS_TYPE.ITEM, GoodsDefine.ITEM_ID_CUILIAN, next.costNum);
        }
    }
    private getPlayerData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData();
    }
    private onGetBtn(event: TouchEvent): void {
        GameCommon.getInstance().onShowFastBuy(GoodsDefine.ITEM_ID_CUILIAN);
    }
    public trigger(): void {
        for (var i = 0; i < GameDefine.Equip_Slot_Num; i++) {
            this.points[i].checkPoint();
        }
        this.points[i].checkPoint();
    }
    private get cuilianDict() {
        return JsonModelManager.instance.getModelcuilian();
    }
}