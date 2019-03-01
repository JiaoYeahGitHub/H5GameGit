/**
 * 
 * 元神界面
 * @author  lzn
 * 
 * 
 */
class PsychPanel extends BaseTabView {
    private index: number = 0;
    private btn_preview: eui.Button;
    private currBase: PsychBase;
    private nextBase: Modelyuanshen;
    private btn_replace: eui.Button;
    private btn_upgrade: eui.Button;
    private btn_decompose: eui.Button;
    private currency: CurrencyBar;
    private currLayer: eui.Group;
    private nextLayer: eui.Group;
    private power: PowerBar;
    private label_get: eui.Label;

    private strengthenMasterBtn: eui.Button

    protected points: redPoint[] = RedPointManager.createPoint(9);
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.PsychPanelSkin;
    }
    protected onInit(): void {
        for (var i: number = 0; i < GameDefine.Psych_Slot_Num; i++) {
            this.points[i].register(this[`psych${i}`], new egret.Point(70, -6), DataManager.getInstance().psychManager, "getCanChangeOrUpdateBySlot");
        }

        this.points[GameDefine.Psych_Slot_Num].register(this.btn_replace, new egret.Point(75, 0), DataManager.getInstance().psychManager, "getCanChangePsychBySlot");
        this.points[GameDefine.Psych_Slot_Num + 1].register(this.btn_upgrade, GameDefine.RED_BTN_POS, DataManager.getInstance().psychManager, "getCanUpgradePsychBySlot");

        GameCommon.getInstance().addUnderlineGet(this.label_get);

        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_preview.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnPreview, this);
        this.btn_replace.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReplace, this);
        this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpgrade, this);
        this.btn_decompose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchDecompose, this);
        this.label_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.goto, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_PSYCH_EQUIP_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_PSYCH_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_PSYCH_DECOMPOSE_MESSAGE.toString(), this.onRefresh, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);

        var psych: PsychInstance;
        for (var i: number = 0; i < GameDefine.Psych_Slot_Num; i++) {
            psych = this[`psych${i}`];
            psych.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPsych, this);
        }

        this.strengthenMasterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.strengthenMasterOnClick, this)
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_preview.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnPreview, this);
        this.btn_replace.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReplace, this);
        this.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpgrade, this);
        this.btn_decompose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchDecompose, this);
        this.label_get.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.goto, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_PSYCH_EQUIP_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_PSYCH_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_PSYCH_DECOMPOSE_MESSAGE.toString(), this.onRefresh, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_BAG_UPDATE.toString(), this.updateGoodsADD, this);
        var psych: PsychInstance;
        for (var i: number = 0; i < GameDefine.Psych_Slot_Num; i++) {
            psych = this[`psych${i}`];
            psych.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPsych, this);
        }

        this.strengthenMasterBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.strengthenMasterOnClick, this)
    }
    protected onRefresh(): void {
        this.onShowInfo();
        this.onSelectPsych();
        this.getPlayer().updataAttribute();
    }
    public trigger(): void {
        for (var i: number = 0; i < GameDefine.Psych_Slot_Num; i++) {
            this.points[i].checkPoint(true, 0, i);
        }
        this.points[GameDefine.Psych_Slot_Num].checkPoint(true, 0, this.index);
        this.points[GameDefine.Psych_Slot_Num + 1].checkPoint(true, 0, this.index);
    }
    private onTouchReplace(): void {
        if (!this.getPlayer().getPsychIsUnlockBySlot(this.index)) {
            GameCommon.getInstance().addAlert(`${PsychDefine.PSYCH_SLOT_LOCK[this.index]}开启`);
        } else {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                new WindowParam("PsychSelectPanel",
                    new PsychSelectParam(0, this.currBase.slot))
            );
        }
    }
    private onTouchDecompose(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "PsychDecompose");
    }
    private onTouchUpgrade(): void {
        if (this.nextBase) {
            DataManager.getInstance().psychManager.onSendPsychUpgrade(0, this.currBase.slot);
        }
    }
    private onTouchPsych(e: egret.Event): void {
        var psych = <PsychInstance>e.currentTarget;
        if (psych.position != this.index) {
            this.index = psych.position;
            this.onRefresh();
        }
        if (this.getPlayer().getPsychIsUnlockBySlot(this.currBase.slot) && this.currBase.modelID == 0) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                new WindowParam("PsychSelectPanel",
                    new PsychSelectParam(0, this.currBase.slot))
            );
        }
    }

    private onSelectPsych(): void {
        var psych: PsychInstance;
        for (var i: number = 0; i < GameDefine.Psych_Slot_Num; i++) {
            psych = this[`psych${i}`];
            psych.pos = i;
            var curr = this.getPlayerData().getPsychBySlot(i);
            if (!this.getPlayer().getPsychIsUnlockBySlot(i)) {
                psych.onUpdate(curr, PSYCHSTATE_TYPE.LOCK, 0);
            } else {
                if (curr.modelID > 0) {
                    psych.onUpdate(curr, PSYCHSTATE_TYPE.SHOWNAME_AND_BG, 0);
                } else {
                    psych.onUpdate(curr, PSYCHSTATE_TYPE.NONE, 0);
                }
            }
            if (i == this.index) {
                psych.selected = true;
            } else {
                psych.selected = false;
            }
        }
    }
    private onShowInfo(): void {
        this.currBase = this.getPlayerData().getPsychBySlot(this.index);
        this.nextBase = DataManager.getInstance().psychManager.getNextModel(this.currBase.modelID);
        if (!this.getPlayer().getPsychIsUnlockBySlot(this.index)) {
            this.currentState = "advance";
            this.currLayer.removeChildren();
            this.nextLayer.removeChildren();
        } else {
            if (this.currBase.modelID > 0) {
                if (this.nextBase) {
                    this.currentState = "activate";
                } else {
                    this.currentState = "max";
                }
                var curr: Modelyuanshen = this.currBase.model;
                var next: Modelyuanshen = this.nextBase;
                var model: Modelyuanshen = curr || next;
                var item: AttributesText;
                var add: number = 0;
                this.currLayer.removeChildren();
                this.nextLayer.removeChildren();
                for (var key in model.attrAry) {
                    if (model.attrAry[key] > 0) {
                        item = new AttributesText();
                        add = curr ? curr.attrAry[key] : 0;
                        item.updateAttr(key, add);
                        this.currLayer.addChild(item);
                        item = new AttributesText();
                        add = next ? next.attrAry[key] : 0;
                        item.updateAttr(key, add);
                        this.nextLayer.addChild(item);
                    }
                }
                this.updateGoodsADD();
            } else {
                this.currentState = "advance";
                this.currLayer.removeChildren();
                this.nextLayer.removeChildren();
            }
        }
        this.onUpdatePlayerPower();
    }
    private updateGoodsADD(): void {
        if (this.nextBase) {
            this.currency.data = new CurrencyParam("", this.nextBase.cost.thingbase, false);
        }
    }

    //更新人物战斗力
    private onUpdatePlayerPower(): void {
        this.power.power = DataManager.getInstance().psychManager.getJobPsychPower(0) + "";
    }

    //切换角色
    public onChangeRole(): void {
        // SkillPanel.roleID = this.role_list_bar.index;
        this.onRefresh();
        this.trigger();
    }
    private onTouchBtnPreview(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "PsychPreviewPanel");
    }
    private getPlayer(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    private getPlayerData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData();
    }

    private goto() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_LADDER);
    }

    private strengthenMasterOnClick() {
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),new WindowParam("StrongerMonsterPanel",STRONGER_MONSTER_TYPE.STRONGER_PSYCH_LEVEL))
    }
}
//元神类型
enum Psych_TYPE {
    UNKNOW = -1,
    INTRODUCE = 0,
    GATHER = 1,
    DEVOUR = 2,
    CASTING = 3,
    MAIN = 4,
    ESCORT = 5,
}
enum PsychPanel_TYPE {
    ESCORT = 0,
    GATHER = 1,
    DEVOUR = 2,
    CASTING = 3,
}