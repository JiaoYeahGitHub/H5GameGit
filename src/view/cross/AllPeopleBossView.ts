class AllPeopleBossView extends BaseTabView {
    private lefttimes_label: eui.Label;
    private remind_label: eui.Label;
    private itemGroup: eui.Group;
    private boss_scroll: eui.Scroller;
    private recover_label: eui.Label;
    private allpeopleItems: AllPeopleBossItem[];

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.AllPeopleBossViewSkin;
    }
    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ALLPEOPLE_BOSS_LISTINFO_MSG.toString(), this.onResBossListInfoMsg, this);
        this.remind_label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openRemindPanel, this);
        this.recover_label.text = "";
    }
    protected onRemove(): void {
        super.onRemove();
        this.onRemomveTimer();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ALLPEOPLE_BOSS_LISTINFO_MSG.toString(), this.onResBossListInfoMsg, this);
        for (var i: number = 0; i < this.allpeopleItems.length; i++) {
            var item: AllPeopleBossItem = this.allpeopleItems[i];
            item.onDestory();
        }
        this.remind_label.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openRemindPanel, this);
    }
    protected onInit(): void {
        GameCommon.getInstance().addUnderlineStr(this.remind_label);
        this.boss_scroll.verticalScrollBar.autoVisibility = false;
        this.boss_scroll.verticalScrollBar.visible = false;
        this.allpeopleItems = [];
        var modelDict = JsonModelManager.instance.getModelquanminboss();
        for (var id in modelDict) {
            var modelAllPeopleBoss: Modelquanminboss = modelDict[id];
            var item: AllPeopleBossItem = new AllPeopleBossItem(modelAllPeopleBoss);
            this.allpeopleItems.push(item);
        }
        super.onInit();
        this.onRefresh();
    }
    public onRefresh(): void {
        this.onRequsetBossListInfoMsg();
        Tool.addTimer(this.runTimerDown, this, 1000);
    }
    private onRequsetBossListInfoMsg(): void {
        this.hasRecover = false;
        this.hasInfo = false;
        this.updateTime = 0;
        var infoRequestMsg: Message = new Message(MESSAGE_ID.ALLPEOPLE_BOSS_LISTINFO_MSG);
        GameCommon.getInstance().sendMsgToServer(infoRequestMsg);
    }

    private hasRecover: boolean;
    private hasInfo: boolean;
    private updateTime: number = 0;
    private onResBossListInfoMsg(): void {
        this.hasRecover = DataManager.getInstance().dupManager.allpeoplebossData.leftRecover > 0;
        this.lefttimes_label.text = DataManager.getInstance().dupManager.allpeoplebossData.lefttimes + "/" + DupDefine.AllPEOPLE_MAX_TIMES;
        this.onupdateItemData();
        this.hasInfo = true;
    }

    private runTimerDown(): void {
        if (this.hasRecover) {
            if (DataManager.getInstance().dupManager.allpeoplebossData.leftRecover > 0) {
                var recovertimedesc: string = Tool.getTimeStr(DataManager.getInstance().dupManager.allpeoplebossData.leftRecover);
                this.recover_label.text = `(${recovertimedesc}恢复1次)`;
                if (this.updateTime > 10) {
                    this.onRequsetBossListInfoMsg();
                } else {
                    this.updateTime++;
                }
            } else {
                this.onRequsetBossListInfoMsg();
            }
        }
        if (this.hasInfo) {
            for (var i: number = 0; i < this.allpeopleItems.length; i++) {
                var item: AllPeopleBossItem = this.allpeopleItems[i];
                if (item.updateRebronTime()) {
                    this.onRequsetBossListInfoMsg();
                }
            }
        }
    }

    private onRemomveTimer(): void {
        Tool.removeTimer(this.runTimerDown, this, 1000);
    }

    private onupdateItemData(): void {
        for (var i: number = 0; i < this.allpeopleItems.length; i++) {
            var item: AllPeopleBossItem = this.allpeopleItems[i];
            item.onUpdate();
        }
        this.allpeopleItems.sort(function (a, b): number {
            return b.sort - a.sort;
        });
        this.itemGroup.removeChildren();
        for (var i: number = 0; i < this.allpeopleItems.length; i++) {
            var item: AllPeopleBossItem = this.allpeopleItems[i];
            item.onShow(this.itemGroup);
            if (item.model.limitLevel > DataManager.getInstance().playerManager.player.coatardLv) {
                break;
            }
        }
    }
    //打开BOSS提醒设置面板
    private openRemindPanel(evnet: egret.TouchEvent): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "AllPeopleRemindPanel");
    }
}
class AllPeopleBossItem extends BaseComp {
    public model: Modelquanminboss;
    public info: AllPeopleBossInfo;

    private get_label: eui.Label;
    private monster_name_label: eui.Label;
    private monsterIcon_img: eui.Image;
    private bosshp_probar: eui.Label;
    private time_label: eui.Label;
    // private levelLimit_label: eui.Label;
    private joinNum_label: eui.Label;
    private btn_challenge: eui.Button;
    // private unopen_group: eui.Group;
    private award_group: eui.Group;

    public constructor(model: Modelquanminboss) {
        super();
        this.model = model;
        this.info = DataManager.getInstance().dupManager.allpeoplebossData.infos[this.model.id];
        this.width = 590;
        this.height = 147;
        this.skinName = skins.AllPeopleBossItemSkin;
    }
    //初始化
    protected onInit(): void {
        GameCommon.getInstance().addUnderlineGet(this.get_label);
        this.monster_name_label.text = this.bossFightter.name;
        this.monsterIcon_img.source = this.bossFightter.avata + "_icon_png";
        for (var i: number = 0; i < this.model.rewards.length; i++) {
            var waveAward: AwardItem = this.model.rewards[i];
            var goodsInstace: GoodsInstance = new GoodsInstance();
            goodsInstace.scaleX = 0.8;
            goodsInstace.scaleY = 0.8;
            goodsInstace.onUpdate(waveAward.type, waveAward.id, 0, waveAward.quality, waveAward.num);
            this.award_group.addChild(goodsInstace);
        }
        if (this.model) {
            this.onUpdate();
        }
    }
    protected onRegist(): void {
        this.get_label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetZhuansheng, this);
        this.btn_challenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallengeBtn, this);
    }
    protected onRemove(): void {
        this.get_label.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onGetZhuansheng, this);
        this.btn_challenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchChallengeBtn, this);
    }
    public onUpdate(): void {
        if (!this.isLoaded) return;

        this.info = DataManager.getInstance().dupManager.allpeoplebossData.infos[this.model.id - 1];
        if (!this.info)
            return;
        this.bosshp_probar.text = `${Math.min(100, Math.ceil(this.info.leftHp / this.bossFightter.hp * 100))}%`;
        var isOpen: boolean = this.model.limitLevel <= DataManager.getInstance().playerManager.player.coatardLv;
        this.joinNum_label.text = (isOpen ? this.info.joinNum : 0) + "人";
        this.btn_challenge.enabled = isOpen && this.info.rebirthTime <= 0;

        if (!isOpen) {
            this.time_label.text = Language.instance.getText(`coatard_level${this.model.limitLevel}`, 'open');
            this.get_label.visible = true;
        } else {
            this.get_label.visible = false;
            if (!this.info.isOpen) {
                this.updateRebronTime();
            } else {
                this.time_label.text = "";
            }
        }
    }
    private get bossFightter(): Modelfighter {
        return ModelManager.getInstance().getModelFigher(this.model.modelId);
    }
    //倒计时处理
    public updateRebronTime(): boolean {
        if (!this.isLoaded) return;

        if (this.model.limitLevel > DataManager.getInstance().playerManager.player.coatardLv) {
            return false;
        }
        if (this.info && !this.info.isOpen) {
            if (this.info.rebirthTime > 0) {
                this.time_label.text = Tool.getTimeStr(this.info.rebirthTime) + Language.instance.getText("houchongsheng");
            }
            else {
                this.time_label.text = Tool.getTimeStr(0) + Language.instance.getText("houchongsheng");
                return true;
            }
        }
        return false;
    }
    //前往挑战
    private onTouchChallengeBtn(event: egret.TouchEvent): void {
        GameFight.getInstance().onEnterAllPeopleBossScene(this.model.id);
    }
    //排序 首先能打的按照等级从大到小 然后是冷却的等级从大到小 然后是不能打的
    public get sort(): number {
        var sortNum: number = 0;
        if (this.info) {
            if (this.model.limitLevel > DataManager.getInstance().playerManager.player.coatardLv) {
                sortNum = Tool.toInt(1000 - this.model.limitLevel);
            } else {
                if (this.info.rebirthTime > 0) {
                    sortNum = this.model.limitLevel + 1000;
                } else {
                    sortNum = this.model.limitLevel + 10000;
                }
            }
        }
        return sortNum;
    }
    private onGetZhuansheng(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_JINGJIE);
    }
    //The end
}