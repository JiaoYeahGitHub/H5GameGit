/**
 * 
 * 经脉主页面
 * @author	lzn
 * 
 * 
 */
class PulsePanel extends BaseTabView {
    private powerbar: PowerBar;
    // private label_currTeir: eui.Label;
    // private currLayer: eui.Group;
    private nextLayer: eui.Group;
    private currency: ConsumeBar;
    private btn_advance: eui.Button;
    private gailv_lab: eui.Label;
    private gailv_desc: eui.Label;
    private label_get: eui.Label;
    private canUp: boolean = false;
    private animPos: egret.Point = new egret.Point(344, 440);
    private animLayer: eui.Group;
    private animType: number = 0;
    private nextPro: eui.Group;
    private curPro: eui.Group;
    private mountName: eui.Label;
    private getGrp: eui.Group;
    private qianghuaPro: eui.ProgressBar;
    protected points: redPoint[] = RedPointManager.createPoint(2);

    // private strengthenMasterBtn: eui.Button

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.PulsePanelSkin;
    }
    protected onInit(): void {
        var progress: PulseProgress;
        for (var i: number = 0; i < GameDefine.MAX_TIER; i++) {
            progress = this[`acupoint${i}`] as PulseProgress;
            progress.index = i;
        }
        // for (var i: number = 1; i <= GameDefine.MAX_PULSE; i++) {
        //     var curr_gradebar: eui.Component = this[`grade_bar${(i - 1)}`];
        //     (curr_gradebar['tier_name_img'] as eui.Image).source = `pulse_name${i}_png`;
        // }
        // this.gailv_desc.text = Language.instance.getText("shibaibudiaoji");
        this.label_get.text = Language.instance.getText("huoqutujing");
        GameCommon.getInstance().addUnderlineGet(this.label_get);
        this.label_get.touchEnabled = true;
        this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);

        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.points[0].register(this.btn_advance, GameDefine.RED_BTN_POS, DataManager.getInstance().pulseManager, "getJobCanPulseUpgrade");
        // this.points[1].register(this.strengthenMasterBtn, new egret.Point(70, 10), DataManager.getInstance().strongerManager, "getPoint", STRONGER_MONSTER_TYPE.STRONGER_JING_MAI);
        this.btn_advance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAdvance, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_PULSE_UPGRADE_MESSAGE.toString(), this.onUpgradeBack, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.PULSE_UP_FAIL_EVENET.toString(), this.onFailBack, this);
        this.getGrp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        // this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.strengthenMasterBtnOnClick, this)
    }
    protected onRemove(): void {
        super.onRemove();
        this.getGrp.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetBtn, this);
        this.btn_advance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAdvance, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_PULSE_UPGRADE_MESSAGE.toString(), this.onUpgradeBack, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.PULSE_UP_FAIL_EVENET.toString(), this.onFailBack, this);

        // this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.strengthenMasterBtnOnClick, this)
    }
    protected onRefresh(): void {
        // this.qianghuaPro.maximum = DataManager.getInstance().strongerManager.getNextMuBiao(STRONGER_MONSTER_TYPE.STRONGER_JING_MAI);
        // this.qianghuaPro.value = DataManager.getInstance().strongerManager.getCurNumByType(STRONGER_MONSTER_TYPE.STRONGER_JING_MAI);
        var lv: number = this.getPlayerData().pulseLv;
        var model: Modeljingmai = JsonModelManager.instance.getModeljingmai()[lv];
        var modeled: Modeljingmai = JsonModelManager.instance.getModeljingmai()[lv + 1];
        var currModel: Modeljingmai = model || modeled;
        if (model) {
            this.mountName.text = model.jieduan + '阶' + model.level + '级';
        } else if (lv < 1) {
            this.mountName.text = "1阶";
        } else {
            this.mountName.text = "";
        }
        // for (var i: number = 0; i < GameDefine.MAX_PULSE; i++) {
        //     var curr_gradebar: eui.Component = this[`grade_bar${i}`];
        //     var curr_grade_num: number = Math.ceil(currModel.jieduan / GameDefine.MAX_PULSE);
        //     var curr_level_num: number = ((currModel.jieduan - 1) % GameDefine.MAX_PULSE);
        //     (curr_gradebar['bg'] as eui.Image).source = i > curr_level_num ? 'pulse_tier_unopen_png' : 'pulse_tier_open_png';
        //     curr_grade_num = curr_grade_num == 10 ? 0 : curr_grade_num;//做一步中午数字的处理 一十处理成十
        //     (curr_gradebar['grade_bmplab'] as eui.BitmapLabel).text = '' + curr_grade_num;
        // }
        if (modeled) {
            var rateValue: number = modeled.gailv / 100;
            this.gailv_lab.text = Language.instance.getText("chenggonglv", "：", rateValue, "%");
        } else {
            this.gailv_lab.text = "";
            // this.gailv_desc.text = Language.instance.getText("full_level");
        }
        //当前经脉的总属性
        var attributeItem: AttributesText;
        this.curPro.removeChildren();
        this.nextPro.removeChildren();
        var add: number = 0;
        for (var key in currModel.attrAry) {
            if (currModel.attrAry[key] > 0) {
                add = model ? model.attrAry[key] : 0;
                attributeItem = new AttributesText();
                attributeItem.updateAttr(key, add);
                this.curPro.addChild(attributeItem);
                if(modeled)
                {
                    add = modeled ? modeled.attrAry[key] : 0;
                attributeItem = new AttributesText();
                attributeItem.updateAttr(key, add);
                this.nextPro.addChild(attributeItem);
                }
                

            }
        }
        var progress: PulseProgress;
        this.canUp = false;
        var level: number = 0;
        if (modeled) {
            this.currentState = 'normal';
            if (modeled.cost.num == 0) {
                this.btn_advance.label = Language.instance.getText('jingmaichongxue');
                this.currency.visible = false;
                this.animType = 1;
            } else {
                this.btn_advance.label = Language.instance.getText('jingmaitisheng');
                this.currency.visible = true;
                this.animType = 0;
            }
            // GameCommon.getInstance().onButtonEnable(this.btn_advance, true);
        } else {
            this.currentState = 'max';
            // GameCommon.getInstance().onButtonEnable(this.btn_advance, false);
        }
        if (lv == 0) {
            this.animType = 0;
        }
        if (model) {
            level = model.level;
        }
        for (var i: number = 0; i < GameDefine.MAX_TIER; i++) {
            progress = this[`acupoint${i}`] as PulseProgress;
            progress.data = level;
        }
        this.updateConsItem();
        this.onUpdatePlayerPower();
    }
    public trigger(): void {
        this.points[0].checkPoint(true);
        this.points[1].checkPoint();
    }
    private onUpgradeBack(): void {
        this.onRefresh();
        var progress: PulseProgress;
        for (var i: number = 0; i < GameDefine.MAX_TIER; i++) {
            progress = this[`acupoint${i}`] as PulseProgress;
            progress.playSuccessAnim();
        }
    }
    private onFailBack(): void {
        let progress: PulseProgress;
        for (var i: number = 0; i < GameDefine.MAX_TIER; i++) {
            progress = this[`acupoint${i}`] as PulseProgress;
            progress.playFailAnim();
        }
    }
    //更新人物战斗力
    private onUpdatePlayerPower(): void {
        this.powerbar.power = DataManager.getInstance().pulseManager.pulsePower();
    }
    private cost: AwardItem;
    private updateConsItem() {
        var lv: number = this.getPlayerData().pulseLv;
        var modeled: Modeljingmai = JsonModelManager.instance.getModeljingmai()[lv + 1];
        if (modeled) {
            this.cost = modeled.cost;
            var num = DataManager.getInstance().bagManager.getGoodsThingNumById(modeled.cost.id, modeled.cost.type);
            if (modeled.cost.num <= num && lv != 0) {
                this.canUp = true;
            }
            this.currency.setCostByAwardItem(modeled.cost);
        } else {
            this.cost = null;
            this.currency.visible = false;
        }
    }
    private onGetBtn(event: TouchEvent): void {
        GameCommon.getInstance().onShowFastBuy(this.cost.id);
    }
    private updateGoodsADD() {
        this.updateConsItem();
    }
    private onTouchBtnAdvance() {
        if (!this.cost || !GameCommon.getInstance().onCheckItemConsume(this.cost.id, this.cost.num)) {
            return;
        }
        var message = new Message(MESSAGE_ID.PLAYER_PULSE_UPGRADE_MESSAGE);
        message.setByte(0);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    private getPlayerData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData();
    }

    private strengthenMasterBtnOnClick() {
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("StrongerMonsterPanel", STRONGER_MONSTER_TYPE.STRONGER_JING_MAI))
    }
}
class PulseProgress extends eui.ProgressBar {
    private img_Activated: eui.Image;
    public thumb: eui.Image;
    public thumbBg: eui.Image;
    public _index: number;
    private animLayer: eui.Group;
    private movie: Animation;
    private _level: number;
    public constructor() {
        super();
        this.skinName = skins.PulseProgressSkin;
    }
    public set data(param: number) {
        this._level = param;
        this.onUpdate();
    }
    private onUpdate(): void {
        this.thumb.visible = this.thumbBg.visible = this._index != 0;
        if (!this.movie) {
            this.movie = new Animation("jingmai", -1);
        }
        this.animLayer.removeChildren();
        this.img_Activated.visible = false;
        if (this._index == this._level) {
            this.setValue(this.maximum);
            this.img_Activated.visible = true;
            this.animLayer.addChild(this.movie);
        } else if (this._index > this._level) {
            this.setValue(0);
        } else {
            this.img_Activated.visible = true;
            this.setValue(this.maximum);
        }
        this.movie.onPlay();
    }
    public playSuccessAnim() {
        if (this._index == this._level) {
            var anim = new Animation("jingmai_chenggong", 1, true);
            anim.playFinishCallBack(this.playSuccessAnim2, this);
            this.animLayer.addChild(anim);
        } else {

        }
    }
    private playSuccessAnim2(): void {
        var anim = new Animation("jingmai_zhuzixunhuan", 4, true);
        anim.rotation = -this.rotation;
        this.animLayer.addChild(anim);
    }
    public playFailAnim(): void {
        if (this._index == this._level + 1) {
            var anim = new Animation("jingmai_shibai", 1, true);
            this.animLayer.addChild(anim);
        }
    }
    public set index(param) {
        this._index = param;
    }
    //The end
}

