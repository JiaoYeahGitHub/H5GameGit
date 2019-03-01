class InfusePanel extends BaseTabView {
    private power: PowerBar;
    private data: EquipSlotThing;
    private label_get: eui.Label;
    private btn_advance: eui.Button;
    private modeled: Modelronghun;
    private consumItem: ConsumeBar;
    private animLayer: eui.Group;
    // private curr_level_lab: eui.Label;
    // private next_level_lab: eui.Label;

    // private zhuhun_exp_lab: eui.Label;
    // private expanim_grp: eui.Group;
    // private zhulingchi_grp: eui.Group;
    // private exp_scroll: eui.Scroller;
    // private up_light_img: eui.Image;
    private progress: eui.ProgressBar;
    private infuselv_lab: eui.Label;
    private curPro: eui.Group;
    private nextPro: eui.Group;
    private expAnim: Animation;
    private START_POSX: number = 40;
    private END_POSX: number = 210;
    private oldPos: number;
    private btn_advanceAll: eui.Button;
    protected points: redPoint[] = RedPointManager.createPoint(2);
    private strengthenMasterBtn: eui.Button;
    private animPos: egret.Point;
    private qianghuaPro: eui.ProgressBar;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.InfusePanelSkin;
    }
    protected onInit(): void {
        this.animPos = new egret.Point(this.width / 2 + 3, 347);
        let infySlot: ForgeSlot;
        for (let i = 0; i < GameDefine.Equip_Slot_Num; i++) {
            infySlot = (this[`equip_bar_${i}`] as ForgeSlot);
            infySlot.slotType = i;
        }
        this.points[0].register(this.btn_advance, GameDefine.RED_BTN_POS, DataManager.getInstance().forgeManager, "getInfusePointShow");
        this.points[1].register(this.strengthenMasterBtn, new egret.Point(65, 5), DataManager.getInstance().strongerManager, "getPoint", STRONGER_MONSTER_TYPE.STRONGER_ZHU_LING);
        this.label_get.text = Language.instance.getText("huoqutujing");
        GameCommon.getInstance().addUnderlineGet(this.label_get);
        this.label_get.touchEnabled = true;
        this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);

        // this.expAnim = new Animation('zhuling_bowen', -1, false);
        // this.expAnim.x = 131;
        // this.expAnim.y = 275 - this.exp_scroll.height;
        // this.zhulingchi_grp.addChildAt(this.expAnim, 2);

        // let exp_back_anim = new Animation('zhuling_qiu', -1, false);
        // exp_back_anim.x = 145;
        // exp_back_anim.y = 180;
        // this.expanim_grp.addChildAt(exp_back_anim, 0);
        // this.up_light_img.alpha = 0;
        this.consumItem['consume_name_label'].textColor = 0xf3f3f3;
        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.strongerBtnClick, this);
        this.btn_advance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdvanceClick, this);
        this.btn_advanceAll.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAllAdvanceClick, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_INFUSE_SOUL_MESSAGE.toString(), this.onIntensifyUpgrade, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_advance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAdvanceClick, this);
        this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.strongerBtnClick, this);
        this.btn_advanceAll.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnAllAdvanceClick, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_INFUSE_SOUL_MESSAGE.toString(), this.onIntensifyUpgrade, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
    }
    protected onRefresh(): void {
        this.qianghuaPro.maximum = DataManager.getInstance().strongerManager.getNextMuBiao(STRONGER_MONSTER_TYPE.STRONGER_ZHU_LING);
        this.qianghuaPro.value = DataManager.getInstance().strongerManager.getCurNumByType(STRONGER_MONSTER_TYPE.STRONGER_ZHU_LING);
        this.data = this.getPlayerData().getEquipSlotThings(this.getPlayerData().currInfuseSoul.slot);
        this.updateSlotInfo();
        this.onUpdatePlayerPower();
        this.refreshSlot();
        this.showInfuse(this.getPlayerData().currInfuseSoul.slot);
        this.updateGoodsADD();
    }
    public trigger(): void {
        this.points[0].checkPoint();
        this.points[1].checkPoint();
    }
    private strongerBtnClick() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", STRONGER_MONSTER_TYPE.STRONGER_ZHU_LING))
    }
    private onIntensifyUpgrade(): void {
        this.onRefresh();
        // if (this.oldPos != this.data.slot) {
        //     if (Tool.isNumber(this.oldPos)) {
        //         egret.Tween.removeTweens(this.up_light_img);
        //         this.up_light_img.alpha = 0;
        //         egret.Tween.get(this.up_light_img).to({ alpha: 1 }, 400, egret.Ease.circOut).to({ alpha: 0 }, 400, egret.Ease.circInOut)
        //             .call(function () {
        //                 this.up_light_img.alpha = 0;
        //             }, this);
        //     }
        // this.oldPos = this.data.slot;
        // }
        GameCommon.getInstance().addAnimation("new_zhuling", this.animPos, this.animLayer);
    }
    private refreshSlot(): void {
        var equip: ForgeSlot;
        for (var j = 0; j < GameDefine.Equip_Slot_Num; j++) {
            equip = (this[`equip_bar_${j}`] as ForgeSlot);
            if (j == this.data.slot) {//找到现在培养位置装备
                equip.selected = true;
                this['slot_icon_img'].text = "+" + this.data.infuseLv;
                this['slot_icon_img'].source = "public_slot_" + GoodsDefine.EQUIP_SLOT_TYPE[j] + "_png";
            } else {
                equip.selected = false;
            }
        }
    }
    private getPlayerData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData();
    }
    private updateGoodsADD() {
        this.consumItem.visible = this.modeled == null ? false : true;
        if (this.modeled) {
            var cost = this.modeled == null ? 0 : this.modeled.cost.num;
            this.consumItem.setCostByAwardItem(this.modeled.cost);
        }
    }
    public onBtnAllAdvanceClick() {
        if (this.modeled) {
            if (!GameCommon.getInstance().onCheckItemConsume(this.modeled.cost.id, this.modeled.cost.num)) {
                return;
            }
            this.sendInfuse(99);
        } else {
            GameCommon.getInstance().addAlert("error_tips_10");
        }
    }
    public onBtnAdvanceClick() {
        if (this.modeled) {
            if (!GameCommon.getInstance().onCheckItemConsume(this.modeled.cost.id, this.modeled.cost.num)) {
                return;
            }
            this.sendInfuse(0);
        } else {
            GameCommon.getInstance().addAlert("error_tips_10");
        }
    }
    private sendInfuse(type: number) {
        if (this.data) {
            var message = new Message(MESSAGE_ID.PLAYER_INFUSE_SOUL_MESSAGE);
            message.setByte(0);
            message.setByte(type);
            GameCommon.getInstance().sendMsgToServer(message);
            this.data = null;
        }
    }
    //更新人物战斗力
    private onUpdatePlayerPower(): void {
        this.power.power = DataManager.getInstance().forgeManager.getRoleInfusePower() + "";
    }
    private updateSlotInfo(): void {
        var equip: ForgeSlot;
        for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
            equip = (this[`equip_bar_${i}`] as ForgeSlot);
            equip.setinfo(this.getPlayerData().getEquipSlotThings(i).infuseLv);
        }
    }
    private showInfuse(curr: number, isNeed: boolean = true) {
        var addEd = 0;
        var subtract = 0;
        var model: Modelronghun;
        var modeled: Modelronghun;
        var currModel: Modelronghun;
        this.infuselv_lab.text = '注灵总等级：' + this.data.infuseLv;
        model = this.getInfuseDict(GoodsDefine.EQUIP_SLOT_TYPE[this.data.slot])[this.data.infuseLv - 1];
        modeled = this.getInfuseDict(GoodsDefine.EQUIP_SLOT_TYPE[this.data.slot])[this.data.infuseLv];
        if (this.getPlayerData().currInfuseSoul.slot == curr) {
            this.modeled = modeled;
        }
        currModel = model || modeled;
        let scroll_height: number = this.END_POSX;
        if (modeled) {
            scroll_height = this.START_POSX + Math.round((this.END_POSX - this.START_POSX) * (this.data.infuseExp / modeled.levelUpExp));
            this.progress.maximum = modeled.levelUpExp;
            this.progress.value = this.data.infuseExp;
        }
        else
        {
            this.progress.labelDisplay.visible = false;
        }
        
        var add = 0;
        var item: AttributesText;
        this.curPro.removeChildren();
        this.nextPro.removeChildren();
        for (var key in currModel.attrAry) {
            if (currModel.attrAry[key] > 0) {
                add = model ? model.attrAry[key] : 0;
                item = new AttributesText();
                item.scaleX = 0.7;
                item.scaleY = 0.7;
                item.updateAttr(key, add);
                this.curPro.addChild(item);
                if(modeled)
                {
                    add = modeled ? modeled.attrAry[key] : 0;
                    item = new AttributesText();
                    item.scaleX = 0.7;
                    item.scaleY = 0.7;
                    item.updateAttr(key, add);
                    this.nextPro.addChild(item);
                }
                
            }
        }
        if(modeled)
         {
             this.currentState = 'normal';
         }
         else
         {
             this.currentState = 'max'
         }
         

        if (isNeed) {
            this.updateGoodsADD();
        }
    }
    private onGetBtn(event: TouchEvent): void {
        var model: Modelronghun;
        model = this.getInfuseDict(this.data.slot)[1];
        GameCommon.getInstance().onShowFastBuy(model.cost.id);
    }
    /**获取槽位的注魂信息**/
    private getInfuseDict(slottype) {
        return JsonModelManager.instance.getModelronghun()[slottype];
    }
    //The end
}