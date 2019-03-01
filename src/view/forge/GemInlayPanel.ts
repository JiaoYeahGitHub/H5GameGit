class GemInlayPanel extends BaseTabView {
    private power: PowerBar;
    private data: EquipSlotThing;
    private label_get: eui.Label;
    private btn_advance: eui.Button;
    private btn_advance_all: eui.Button;
    private consumItem: ConsumeBar;
    private strengthenMasterBtn: eui.Button;
    private currLayer: eui.Group;
    private nextLayer: eui.Group;
    private curr_level_label: eui.Label;
    private curr_attr_label: eui.Label;
    private next_level_label: eui.Label;
    private next_attr_label: eui.Label;
    private curPro: eui.Group;
    private nextPro: eui.Group;
    private animLayer: eui.Group;
    private selectedAnim: Animation;
    private equipRecordPos: ForgePosInfo[];//装备槽位位置信息记录
    private gemRecordPos: ForgePosInfo[];//宝石槽位位置信息记录
    private currGemIndex: number = 0;
    private getGrp: eui.Group;
    private animPos: egret.Point = new egret.Point(312, 270);
    private qianghuaPro: eui.ProgressBar;
    protected points: redPoint[] = RedPointManager.createPoint(3);

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.GemInlayPanelSkin;
    }
    protected onInit(): void {
        this.equipRecordPos = [];
        this.gemRecordPos = [];
        var equipSlot: ForgeSlot;
        for (var i = 0; i < GameDefine.Equip_Slot_Num; i++) {
            equipSlot = (this[`equip_bar_${i}`] as ForgeSlot);
            equipSlot.slotType = i;
            equipSlot.setinfo(this.getPlayerData().getEquipSlotThings(i).gemLv);
            // this.equipRecordPos.push(new ForgePosInfo(equipSlot.x, equipSlot.y, equipSlot.scaleX));
        }
        // var gemSlot: eui.Group;
        // for (var i: number = 0; i < GameDefine.GEM_SLOT_NUM; i++) {
        //     gemSlot = (this[`gem_slot${i}`] as eui.Group);
        //     this.gemRecordPos.push(new ForgePosInfo(gemSlot.x, gemSlot.y, gemSlot.scaleX));
        // }
        this.points[0].register(this.btn_advance, GameDefine.RED_BTN_POS, DataManager.getInstance().forgeManager, "getGemPointShow");
        this.points[1].register(this.btn_advance_all, GameDefine.RED_BTN_POS, this, "onCheckAdvanceAll");
        this.points[2].register(this.strengthenMasterBtn, new egret.Point(65, 5), DataManager.getInstance().strongerManager, "getPoint", STRONGER_MONSTER_TYPE.STRONGER_BAO_SHI);
        this['equip_bar_0']['slotDI'].rotation = 100;
        this['equip_bar_1']['slotDI'].rotation = 130;
        this['equip_bar_2']['slotDI'].rotation = 165;
        this['equip_bar_3']['slotDI'].rotation = 185;
        this['equip_bar_4']['slotDI'].rotation = 230;

        this['equip_bar_5']['slotDI'].rotation = -65;
        this['equip_bar_6']['slotDI'].rotation = -5;
        this['equip_bar_7']['slotDI'].rotation = 0;
        this['equip_bar_8']['slotDI'].rotation = 35;
        this['equip_bar_9']['slotDI'].rotation = 65;

        this.label_get.text = Language.instance.getText("huoqutujing");
        GameCommon.getInstance().addUnderlineGet(this.label_get);
        this.label_get.touchEnabled = true;
        this.resetPos();
        this.updateEquipSlot();
        this.updateGemInlay();
        this.onUpdatePlayerPower();
    }
    protected onRegist(): void {
        super.onRegist();
        this.getGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.strongerBtnClick, this);
        this.btn_advance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdvanceClick, this);
        this.btn_advance_all.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdvanceAllClick, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GEM_UPGRADE_MESSAGE.toString(), this.onGemUpgrade, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.strongerBtnClick, this);
        this.btn_advance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdvanceClick, this);
        this.btn_advance_all.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdvanceAllClick, this);
        this.getGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);

        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GEM_UPGRADE_MESSAGE.toString(), this.onGemUpgrade, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
    }
    protected onRefresh(): void {
        this.data = this.getPlayerData().currGemInlay;
        this.updateGoodsADD();
    }
    private strongerBtnClick() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", STRONGER_MONSTER_TYPE.STRONGER_BAO_SHI))
    }
    private onCheckAdvanceAll(): boolean {
        let openLv: number = 55;// parseInt(Constant.get(Constant.YIJIANBAOSHI_LV));
        if (DataManager.getInstance().playerManager.player.level < openLv) {
            return false;
        }
        return DataManager.getInstance().forgeManager.getGemPointShow();
    }
    /** 更新槽位 **/
    private updateSlotInfo(): void {
        var equip: ForgeSlot;
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            equip = (this[`equip_bar_${i}`] as ForgeSlot);
            equip.setinfo(this.getPlayerData().getEquipSlotThings(i).gemLv);
        }
    }
    private onGemUpgrade(): void {
        this.updateSlotInfo();
        this.onUpdatePlayerPower();
        // if(this.data)
        // {
        //     var equip = (this[`equip_bar_${this.data.slot}`] as ForgeSlot);
        //     equip['slotDI'].source = 'zhancao-weixuanzhong_png';
        // }
        this.data = this.getPlayerData().currGemInlay;
        if (!this.isPlay) {
            this.play();
        }

        GameCommon.getInstance().addAnimation("new_baoshi_" + this.currGemIndex, new egret.Point(this['gem_icon' + this.currGemIndex].x + 57, this['gem_icon' + this.currGemIndex].y + 53), this.animLayer);
    }
    /**获取当前宝石的位置**/
    private resetPos() {
        this.data = this.getPlayerData().currGemInlay;
        this.currGemIndex = this.data.gemLv % GameDefine.GEM_SLOT_NUM;
        let posinfo: ForgePosInfo;
        let equipSlot: ForgeSlot;
        /**装备位 位置**/
        for (let i = 0; i < GameDefine.Equip_Slot_Num; i++) {
            equipSlot = (this[`equip_bar_${i}`] as ForgeSlot);

            if (i == this.data.slot) {
                equipSlot['slotDI'].source = 'zhancao_xuanzhong_png';
                // equipSlot.selected = true;
            } else {
                equipSlot['slotDI'].source = 'zhancao-weixuanzhong_png';
                // equipSlot.selected = false;
            }
        }
        /**宝石位 位置**/
        // let gemSlot: eui.Group;
        // let curr: number;
        // for (let i: number = 0; i < GameDefine.GEM_SLOT_NUM; i++) {
        //     gemSlot = (this[`gem_slot${i}`] as eui.Group);
        //     curr = (GameDefine.GEM_SLOT_NUM + i - this.currGemIndex) % GameDefine.GEM_SLOT_NUM;
        //     posinfo = this.gemRecordPos[curr];
        //     gemSlot.x = posinfo.posX;
        //     gemSlot.y = posinfo.posY;
        //     gemSlot.scaleX = posinfo.scale;
        //     gemSlot.scaleY = posinfo.scale;
        // }
        if (!this.selectedAnim) {
            this.selectedAnim = new Animation("gonghuijineng_1", -1);
            this.selectedAnim.scaleX = 0.8;
            this.selectedAnim.scaleY = 0.8;
            this.animLayer.addChild(this.selectedAnim);
        }
        this.selectedAnim.y = this['gem_icon' + this.currGemIndex].y + 50;
        this.selectedAnim.x = this['gem_icon' + this.currGemIndex].x + 60;
    }
    private selectPosX: number[] = [1, 1, 1, 1, 1];
    private selectPosY: number[] = [1, 1, 1, 1, 1];
    private isPlay: boolean = false;
    private play(): void {
        this.isPlay = true;
        let gemimg: eui.Image = (this[`gem_icon${this.currGemIndex}`] as eui.Image);
        gemimg.alpha = 0;
        egret.Tween.get(gemimg).to({ alpha: 1 }, 300, egret.Ease.cubicOut).call(this.play1, this);
    }
    private play1(): void {
        this.currGemIndex = this.currGemIndex + 1;
        this.currGemIndex = this.currGemIndex == GameDefine.GEM_SLOT_NUM ? 0 : this.currGemIndex;
        // var posinfo: ForgePosInfo;
        // var gemSlot: eui.Group;
        // for (var j = 0; j < GameDefine.GEM_SLOT_NUM; j++) {
        //     var currIdx: number = (GameDefine.GEM_SLOT_NUM + j - this.currGemIndex) % GameDefine.GEM_SLOT_NUM;
        //     gemSlot = (this[`gem_slot${j}`] as eui.Group);
        //     posinfo = this.gemRecordPos[currIdx];
        //     var callFunc: Function = null;
        //     egret.Tween.get(gemSlot).to({ x: posinfo.posX, y: posinfo.posY, scaleX: posinfo.scale, scaleY: posinfo.scale }, 250, egret.Ease.sineIn).call(this.playDone, this, [j == GameDefine.GEM_SLOT_NUM - 1]);
        // }
        this.selectedAnim.y = this['gem_icon' + this.currGemIndex].y + 50;
        this.selectedAnim.x = this['gem_icon' + this.currGemIndex].x + 60;
        this.playDone(true);
    }
    private playDone(isFinish: boolean): void {
        if (!isFinish) {
            return;
        }
        if (this.currGemIndex != this.data.gemLv % GameDefine.GEM_SLOT_NUM) {
            this.play1();
        } else {
            this.updateGemInlay();
            if (this.currGemIndex == 0) {
                this.play2();
                this.updateEquipSlot();
            } else {
                this.isPlay = false;
            }
        }
    }
    private playedNum: number = 0;
    private play2(): void {
        // var currIndex: number = this.getNowGemInlayEquip() + 1;
        // currIndex = currIndex == GameDefine.Equip_Slot_Num ? 0 : currIndex;
        // var posinfo: ForgePosInfo;
        // var equip: ForgeSlot;
        // this.playedNum = 0;
        this.isPlay = false;
        var equip = (this[`equip_bar_${this.oldIdx}`] as ForgeSlot);
        equip['slotDI'].source = 'zhancao-weixuanzhong_png';
        let equipSlot: ForgeSlot = (this[`equip_bar_${this.data.slot}`] as ForgeSlot);
        equipSlot['slotDI'].source = 'zhancao_xuanzhong_png';
        // for (var j = 0; j < GameDefine.Equip_Slot_Num; j++) {
        //     equip = (this[`equip_bar_${j}`] as ForgeSlot);
        //     equip.currCircleIndex = (GameDefine.Equip_Slot_Num + j - currIndex) % GameDefine.Equip_Slot_Num;
        //     posinfo = this.equipRecordPos[equip.currCircleIndex];
        //     equip['slotDI'].source = 'zhancao-weixuanzhong_png';
        // }
        // let equipSlot: ForgeSlot= (this[`equip_bar_${this.data.slot}`] as ForgeSlot);
        // equipSlot['slotDI'].source = 'zhancao_xuanzhong_png';
    }
    private getNowGemInlayEquip(): number {
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
        if (this.data) {
            var currGemLv: number = this.data.getGemLvByGemSlot(this.data.slot);
            var modeled: Modelbaoshi = JsonModelManager.instance.getModelbaoshi()[currGemLv];
            this.consumItem.visible = modeled ? true : false;
            if (modeled) {
                this.consumItem.setCostByAwardItem(modeled.cost);
            }
        }
    }
    public onBtnAdvanceClick() {
        if (this.data) {
            var currGemLv: number = this.data.getGemLvByGemSlot(this.data.slot);
            var modeled: Modelbaoshi = JsonModelManager.instance.getModelbaoshi()[currGemLv];
            if (modeled) {
                if (!GameCommon.getInstance().onCheckItemConsume(modeled.cost.id, modeled.cost.num)) {
                    return;
                }
                this.sendGemInlay();
            } else {
                GameCommon.getInstance().addAlert("error_tips_105");
            }
        }
    }
    private onBtnAdvanceAllClick(): void {
        // let openLv: number = parseInt(Constant.get(Constant.YIJIANBAOSHI_LV));
        // if (DataManager.getInstance().playerManager.player.level < openLv) {
        //     GameCommon.getInstance().addAlert(Language.instance.parseInsertText('dengjikaiqi', openLv) + Language.instance.getText('open'));
        //     return;
        // }

        if (this.data) {
            var currGemLv: number = this.data.getGemLvByGemSlot(this.data.slot);
            var modeled: Modelbaoshi = JsonModelManager.instance.getModelbaoshi()[currGemLv];
            if (modeled) {
                if (!GameCommon.getInstance().onCheckItemConsume(modeled.cost.id, modeled.cost.num)) {
                    return;
                }
                this.sendGemInlay(99);
            } else {
                GameCommon.getInstance().addAlert("error_tips_105");
            }
        }
    }
    private oldIdx: number = 0;
    private sendGemInlay(type: number = 0) {
        if (!this.isPlay && this.data) {
            var message = new Message(MESSAGE_ID.GEM_UPGRADE_MESSAGE);
            message.setByte(0);
            // message.setByte(1);
            message.setByte(type);
            GameCommon.getInstance().sendMsgToServer(message);

            this.oldIdx = this.data.slot;
            this.data = null;
        }
    }
    //更新人物战斗力
    private onUpdatePlayerPower(): void {
        this.qianghuaPro.maximum = DataManager.getInstance().strongerManager.getNextMuBiao(STRONGER_MONSTER_TYPE.STRONGER_BAO_SHI);
        this.qianghuaPro.value = DataManager.getInstance().strongerManager.getCurNumByType(STRONGER_MONSTER_TYPE.STRONGER_BAO_SHI);
        this.power.power = DataManager.getInstance().forgeManager.getRoleGemPower() + "";
    }
    //切换槽位更新槽位上宝石类型
    private updateEquipSlot(): void {
        // let gemimg: eui.Image;
        // let equip_gemtypes: number[] = GoodsDefine.SLOT_GEMTYPE[this.data.slot];
        // for (let i: number = 0; i < GameDefine.GEM_SLOT_NUM; i++) {
        //     let attrtype: number = equip_gemtypes[i];
        //     gemimg = this['gem_icon' + i] as eui.Image;
        //     if (this.currGemIndex > i) {
        //         gemimg.alpha = 1;
        //     } else {
        //         gemimg.alpha = 0.7;
        //     }
        // }
    }
    //更新当前槽位的属性
    private updateGemInlay() {
        this.updateGoodsADD();
        var attrValue: number;
        var curr_gem_idx: number = this.data.gemLv % GameDefine.GEM_SLOT_NUM;
        var currGemLv: number = this.data.getGemLvByGemSlot(curr_gem_idx);
        var gemtype: ATTR_TYPE = GoodsDefine.SLOT_GEMTYPE[this.data.slot][curr_gem_idx];
        var gemModelDoct = JsonModelManager.instance.getModelbaoshi();
        // if(currGemLv==0)
        // return;
        var model: Modelbaoshi = gemModelDoct[currGemLv - 1];
        var modeled: Modelbaoshi = gemModelDoct[currGemLv];

        var currModel: Modelbaoshi;
        currModel = model || modeled;
        var item: AttributesText;
        var add = 0;
        this.curPro.removeChildren();
        this.nextPro.removeChildren();
        var str: string = '';
        var nextStr: string = '';
        if (currModel.attrAry[gemtype] > 0) {
            add = model ? model.attrAry[gemtype] : 0;
            item = new AttributesText();
            item.updateAttr(gemtype, add);
            this.curPro.addChild(item);
            if(modeled)
            {
                add = modeled ? modeled.attrAry[gemtype] : 0;
                item = new AttributesText();
                item.updateAttr(gemtype, add);
                this.nextPro.addChild(item);
            }
            
        }
        if(!modeled)
        {
             this.currentState = 'max';
             this.btn_advance.label = '已满级';
        }
        else
        {
            this.btn_advance.label = '升 级';
            this.currentState = 'normal';
        }
    }
    private onGetBtn(event: TouchEvent): void {
        var model: Modelbaoshi;
        model = JsonModelManager.instance.getModelbaoshi()[0];
        GameCommon.getInstance().onShowFastBuy(model.cost.id);
    }
    //The end
}
class GemInlayItem extends eui.Component {
    public img_icon: eui.Image;
    public label_lv: eui.Label;
    public label_add: eui.Label;
    public index: number;
    private gemlv: number;
    public slot: number;
    public constructor(index: number, slot: number) {
        super();
        this.index = index;
        this.slot = slot;
        this.skinName = skins.GemInlayItemSkin;
    }
    public set data(param: number) {
        this.gemlv = param;
        this.onUpdate();
    }
    public onUpdate() {
        var gemtype: number = GoodsDefine.SLOT_GEMTYPE[this.slot][this.index];
        if (!this.gemlv || this.gemlv <= 0) {
            this.label_lv.textColor = 0x9E9E9E;
            this.label_lv.text = `${Language.instance.getAttrName(gemtype)}宝石`;
            this.label_add.text = `(${Language.instance.getText("weijihuo")})`;
            this.img_icon.source = 'gem_nonactivated_png';
        } else {
            var model: Modelbaoshi = JsonModelManager.instance.getModelbaoshi()[this.gemlv - 1];
            this.label_lv.textColor = 0x7FFF00;
            this.label_lv.text = `Lv.${this.gemlv}`;
            this.label_add.text = `${Language.instance.getAttrName(gemtype)} +${model.attrAry[gemtype]}`;
            this.img_icon.source = `gem_type_${gemtype}_png`;
        }
    }
}