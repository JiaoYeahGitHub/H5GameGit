class PetEnchantPanel extends BaseTabView {
    private power: PowerBar;
    private label_get: eui.Label;
    private grade_lab: eui.Label;
    private level_lab: eui.Label;
    private btn_state: eui.Button;
    private btn_update: eui.Button;
    private btn_update1: eui.Button;
    private bar_exp: eui.ProgressBar;
    private consumItem: ConsumeBar;
    private pet_avatar_grp: eui.Group;
    private _data: PetData;
    private currPetID: number = 1;//当前选中的宠物ID
    private animPos: egret.Point = new egret.Point(344, 440);
    private attributeLayer: eui.Group;
    private lab_name: eui.Label;
    private consume_diamond: CurrencyBar;
    private consume_diamond1: CurrencyBar;
    private normal_ten: boolean;
    private diamond_ten: boolean;
    private btn_save: eui.Button;
    private btn_cancel: eui.Button;
    private btn_diamond_random: eui.Button;
    private btn_diamond_randomTen: eui.Button;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.PetEnchantPanelSkin;
    }
    protected onInit(): void {
        // this.items = [];
        // GameCommon.getInstance().addUnderline(this.label_get);
        // this.label_get.touchEnabled = true;
        // this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        // var datas = DataManager.getInstance().playerManager.player.pets;
        super.onInit();
        this.onRefresh();
    }
    private onTouchItem(e: egret.Event): void {
        var index: number = parseInt(e.currentTarget.name);
        if (this.currPetID != index) {
            this.currPetID = index;
            this.onRefresh();
        }
    }
    // public model():modelchongwupei
    //获取对应标签的数据结构
    private models(lv): Modelchongwupeiyang[] {
        var cfgs = JsonModelManager.instance.getModelchongwupeiyang();
        for (let k in cfgs) {
            if (cfgs[k].jieduan > lv) {
                return cfgs[k]

            }
        }
    }

    protected onRefresh(): void {
        this._data = DataManager.getInstance().playerManager.player.petData;
        this._data.lv;
        // var model  = this.models(this._data.lv);
        let currModel: Modelchongwujinjie = this._data.gradeModel;
        this.lab_name.text = currModel.jieduan + '阶';
        this.pet_avatar_grp.removeChildren();
        GameCommon.getInstance().addAnimation('petbig' + currModel.waixing1, null, this.pet_avatar_grp, -1);
        // var item: PetSoulItem;
        // if(this.attributeLayer.numChildren == 0){            
        //     for (var i = 0; i < 4; i++) {
        //         item = new PetSoulItem();
        // 		item.update(model,i, DataManager.getInstance().playerManager.player.petData.proArr[i])
        //         this.attributeLayer.addChild(item);
        //     }
        // }else{
        //      for (var i = 0; i < 4; i++) {
        //          item = this.attributeLayer.getChildAt(i) as PetSoulItem;
        //          item.update(model,i, DataManager.getInstance().playerManager.player.petData.proArr[i]);
        //      }
        // }
        // this.consume_diamond.setConsumeByCurrency(GOODS_TYPE.DIAMOND, GameDefine.LONGHUN_DIAMOND_NUM * (this.diamond_ten?10:1));
        // this.consume_normal.setConsumeModel(JsonModelManager.instance.getModelitem()[GameDefine.LONGHUN_GOODS_ID], GameDefine.LONGHUN_GOODS_NUM)// * (this.normal_ten?10:1));                
        // this.consume_diamond2.setConsumeModel(JsonModelManager.instance.getModelitem()[GameDefine.LONGHUN_GOODS_ID], GameDefine.LONGHUN_GOODS_NUM)// * (this.diamond_ten?10:1))
        // // this.onUpdatePower();
        // // this.onUpdateCurrcy();
        this.updateInfo();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_diamond_random.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRandomDiamond, this);
        this.btn_diamond_randomTen.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRandomDiamondTen, this);
        this.btn_save.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSave, this);
        this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnCancel, this);
        // this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGet, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PET_TRAIN_RANDOM_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PET_TRAIN_CHANGE_MESSAGE.toString(), this.update, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_diamond_random.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRandomDiamond, this);
        this.btn_diamond_randomTen.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRandomDiamondTen, this);
        this.btn_save.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnSave, this);
        this.btn_cancel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnCancel, this);
        // this.label_get.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGet, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PET_TRAIN_RANDOM_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PET_TRAIN_CHANGE_MESSAGE.toString(), this.update, this);
    }
    private getPlayerData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData(0);
    }
    private getPlayer(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    private onTouchBtnRandomDiamondTen() {
        DataManager.getInstance().petManager.sendRandomMessage(true, 1);
        this.btn_diamond_random.enabled = false;
        this.btn_diamond_randomTen.enabled = false;
    }
    private onTouchBtnRandomDiamond() {
        // if (!GameCommon.getInstance().onCheckItemConsume(GOODS_TYPE.DIAMOND, GameDefine.LONGHUN_GOODS_NUM * (this.normal_ten?10:1))) {
        // 		return;
        // 	}
        DataManager.getInstance().petManager.sendRandomMessage(false, 1);
        this.btn_diamond_random.enabled = false;
        this.btn_diamond_randomTen.enabled = false;
    }
    private onTouchCheckboxDiamond() {
        // this.consume_diamond.setConsumeByCurrency(GOODS_TYPE.DIAMOND, GameDefine.PET_DIAMOND_NUM * (this.diamond_ten?10:1));
    }

    private onTouchBtnSave() {
        var message = new Message(MESSAGE_ID.PET_TRAIN_CHANGE_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(message);
        this.btn_diamond_random.enabled = true;
        this.btn_diamond_randomTen.enabled = true;
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
        var message = new Message(MESSAGE_ID.PET_TRAIN_CANCEL_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(message);
        this.update();
        this.btn_diamond_random.enabled = true;
        this.btn_diamond_randomTen.enabled = true;
    }
    private onTouchGet() {
        GameCommon.getInstance().onShowFastBuy(GameDefine.PET_GOODS_ID, GOODS_TYPE.ITEM);
    }

    /*更新显示信息*/
    private updateInfo() {
        var item: PetSoulItem;
        var model = this.models(this._data.grade);
        let currModel: Modelchongwujinjie = this._data.gradeModel;
        if (this.attributeLayer.numChildren == 0) {
            for (var i = 0; i < 4; i++) {
                item = new PetSoulItem();
                item.update(model, i, this._data.proArr[i], DataManager.getInstance().petManager.curRandomValue[i])
                this.attributeLayer.addChild(item);
            }
        } else {
            for (var i = 0; i < 4; i++) {
                item = this.attributeLayer.getChildAt(i) as PetSoulItem;
                item.update(model, i, this._data.proArr[i], DataManager.getInstance().petManager.curRandomValue[i]);
            }
        }
        this.consume_diamond1.data = new CurrencyParam(Language.instance.getText('xiaohao'), new ThingBase(GOODS_TYPE.GOLD, 0, GameDefine.PET_DIAMOND_NUM * 10));
        this.consume_diamond.data = new CurrencyParam(Language.instance.getText('xiaohao'), new ThingBase(GOODS_TYPE.GOLD, 0, GameDefine.PET_DIAMOND_NUM));
        // if(model != null){
        //     this.animLayer.removeChildren();
        //     GameCommon.getInstance().addAnimation(model.effect, this.animPos, this.animLayer, -1);
        // }

        if (DataManager.getInstance().petManager.curRandomValue.length > 0) {
            this.btn_cancel.visible = true;
            this.btn_save.visible = true;
            this.consume_diamond1.visible = false;
            this.consume_diamond.visible = false;
            this.btn_diamond_random.visible = false;
            this.btn_diamond_randomTen.visible = false;
        } else {
            this.btn_cancel.visible = false;
            this.btn_save.visible = false;
            this.btn_diamond_random.visible = true;
            this.btn_diamond_random.enabled = true;
            this.btn_diamond_randomTen.visible = true;
            this.consume_diamond1.visible = true;
            this.consume_diamond.visible = true;
        }

        this.onUpdatePlayerPower();
    }

    private update() {
        DataManager.getInstance().petManager.clear();
        this.onRefresh();
        this.getPlayer().updataAttribute();
    }

    //更新人物战斗力
    private onUpdatePlayerPower(): void {
        this.power.power = DataManager.getInstance().petManager.power + "";
    }
    //The end
}
class PetSoulItem extends eui.Component {
    private proName: eui.Label;
    private progress_cur_value: eui.ProgressBar;
    private label_change_value: eui.Label;
    private attr_title_img: eui.Image;
    public constructor() {
        super();
        this.skinName = skins.PetSoulItemSkin;
    }

    public update(model, attrtype, value: number, change?: number) {
        // var max:number = 0;
        // if(model != null){
        //     max = model.attrAry[attrtype];
        // }
        this.proName.text = GameDefine.Attr_FontName[attrtype];
        // this.progress_cur_value.value = value;
        // this.progress_cur_value.maximum = max;

        var max: number = 0;
        if (model != null) {
            max = model.attrAry[attrtype];
        }

        this.progress_cur_value.value = value;
        this.progress_cur_value.maximum = max;
        if (change && change != 0) {
            this.attr_title_img.visible = true;
            if (change > 0) {
                this.attr_title_img.source = `pet_upIcon_png`;
                this.label_change_value.text = "+" + change;
                this.label_change_value.textColor = GameDefine.Attr_After_Color
            } else {
                this.label_change_value.text = "" + change;
                this.label_change_value.textColor = 0xff0000;
                this.attr_title_img.source = `pet_downIcon_png`;
            }
        } else {
            this.attr_title_img.visible = false;
            this.label_change_value.text = "";
        }

    }
}