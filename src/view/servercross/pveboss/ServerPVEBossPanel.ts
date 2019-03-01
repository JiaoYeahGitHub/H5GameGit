class ServerPVEBossPanel extends BaseTabView {
    private fight_btn: eui.Button;
    private award_btn: eui.Button;
    private buy_btn: eui.Button;
    private explainLayer: eui.Group;
    private rankLayer: eui.Group;
    private boss_avatar_grp: eui.Group;
    private lefttime_label: eui.Label;
    private fight_count_lab: eui.Label;
    private boss_name_lab: eui.Label;
    private status_labal: eui.Label;
    private total_damage_lab: eui.Label;
    private loop_rank_lab: eui.Label;
    private wanfashuoming_lab: eui.Label;
    private figthstatus_grp: eui.Group;

    private damageAwards: Modelkuafubossrewards[];
    private bossAnim: BodyAnimation;
    private currTab: number;//当前标签页

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ServerPVEBossPanelSkin;
    }
    private get bossData(): CrossPVEBossData {
        return DataManager.getInstance().dupManager.crossPVEBoss;
    }
    protected onInit(): void {
        super.onInit();

        //初始化BOSS列表
        for (let id in JsonModelManager.instance.getModelkuafuboss()) {
            let model: Modelkuafuboss = JsonModelManager.instance.getModelkuafuboss()[id];
            let tabbtn: eui.RadioButton = this['tab' + parseInt(id)];
            if (!tabbtn) break;
            tabbtn.icon = GameCommon.getInstance().getHeadIconByModelid(model.modelId);
            tabbtn.label = model.limitLevel + "转";
        }

        GameCommon.getInstance().addUnderlineStr(this.loop_rank_lab);
        GameCommon.getInstance().addUnderlineStr(this.wanfashuoming_lab);
        this.onTouchExplain();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.explainLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        this.fight_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnterFight, this);
        this.buy_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyCount, this);
        this.award_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowAward, this);
        this.rankLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowRankView, this);
        for (let id in JsonModelManager.instance.getModelkuafuboss()) {
            let model: Modelkuafuboss = JsonModelManager.instance.getModelkuafuboss()[id];
            let tabbtn: eui.RadioButton = this['tab' + parseInt(id)];
            if (!tabbtn) break;
            tabbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
        }
        for (let i: number = 0; i < 6; i++) {
            (this['boximg' + i] as eui.Image).name = i + "";
            (this['boximg' + i] as eui.Image).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBox, this);
        }
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.CROSS_PVEBOSS_INFO_MESSAGE.toString(), this.onReciveBossInfoMsg, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.CROSS_PVEBOSS_COUNTBUY_MESSAGE.toString(), this.onUpdateFightCount, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.explainLayer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        this.fight_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnterFight, this);
        this.buy_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBuyCount, this);
        this.award_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowAward, this);
        this.rankLayer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowRankView, this);
        for (let id in JsonModelManager.instance.getModelkuafuboss()) {
            let model: Modelkuafuboss = JsonModelManager.instance.getModelkuafuboss()[id];
            let tabbtn: eui.RadioButton = this['tab' + parseInt(id)];
            if (!tabbtn) break;
            tabbtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
        }
        for (let i: number = 0; i < 6; i++) {
            (this['boximg' + i] as eui.Image).removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBox, this);
        }
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.CROSS_PVEBOSS_INFO_MESSAGE.toString(), this.onReciveBossInfoMsg, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.CROSS_PVEBOSS_COUNTBUY_MESSAGE.toString(), this.onUpdateFightCount, this);

        this.examineCD(false);
    }
    protected onRefresh(): void {
        this.isRequestInfo = false;
        this.onSendPVEBossInfoRequest();
    }
    /**点击玩法说明**/
    private onTouchExplain() {
        let explainStr: string = Language.instance.getText('kuafuboss');
        explainStr = GameCommon.getInstance().readStringToHtml(explainStr);
        GameDispatcher.getInstance().dispatchEvent(
            new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ExplainPanel", explainStr)
        );
        explainStr = null;
    }
    /**切换BOSS页签**/
    private onTouchTab(event: egret.TouchEvent): void {
        let button: eui.RadioButton = event.currentTarget;
        if (this.currTab != button.value) {
            this.currTab = button.value;
            this.onTabHanlder();
        }
    }
    /**切换标签对应的逻辑处理**/
    private onTabHanlder(): void {
        let model: Modelkuafuboss = JsonModelManager.instance.getModelkuafuboss()[this.currTab];
        let figther: Modelfighter = ModelManager.getInstance().getModelFigher(model.modelId);
        this.boss_name_lab.text = figther.name;
        this.bossAnim = GameCommon.getInstance().getMonsterBody(this.bossAnim, model.modelId);
        if (!this.bossAnim.parent) {
            this.boss_avatar_grp.addChild(this.bossAnim);
        }
        this.onUpdateFightCount();
        this.onUpdateBoxStatus();
    }
    /**更新挑战次数**/
    private onUpdateFightCount(): void {
        if (this.currTab == this.bossData.fightID) {
            this.fight_btn.visible = true;
            this.figthstatus_grp.bottom = 300;
            this.status_labal.text = Language.instance.getText('shengyucishu') + ":";
            this.fight_count_lab.text = `${this.bossData.fightcount}/${Constant.get(Constant.KUAFU_BOSS_NUM)}`;
            this.fight_btn.enabled = this.bossData.fightcount > 0;
        } else {
            this.fight_btn.visible = false;
            this.fight_count_lab.text = '';
            this.figthstatus_grp.bottom = 250;
            let model: Modelkuafuboss = JsonModelManager.instance.getModelkuafuboss()[this.currTab];
            let playerlevel: number = DataManager.getInstance().playerManager.player.coatardLv;
            if (model.limitLevel <= playerlevel) {
                this.status_labal.text = this.bossData.fightID < this.currTab ? '下期即可挑战' : '已超过挑战等级';
            } else {
                this.status_labal.text = `达到${model.limitLevel}阶即可挑战`;
            }
        }
    }
    /**更新伤害宝箱状态**/
    private onUpdateBoxStatus(): void {
        this.damageAwards = [];
        for (let id in JsonModelManager.instance.getModelkuafubossrewards()) {
            let model: Modelkuafubossrewards = JsonModelManager.instance.getModelkuafubossrewards()[id];
            if (model.bossId == this.currTab && model.damage > 0) {
                this.damageAwards.push(model);
            }
        }
        this.damageAwards.sort(function onSort(a, b): number {
            return a.damage - b.damage;
        });
        for (let i: number = 0; i < this.damageAwards.length; i++) {
            let model: Modelkuafubossrewards = this.damageAwards[i];
            let damagevalue: number = model.damage;
            let awarditem: AwardItem = model.rewards[0];
            if (!this['boximg' + i]) break;
            if (this.bossData.myDamageNum < damagevalue) {
                (this['boximg' + i] as eui.Image).source = 'cross_pveboss_box_unopen_png';
            } else {
                (this['boximg' + i] as eui.Image).source = 'cross_pveboss_box_open_png';
            }
            this['boxname_lab' + i].text = GameCommon.getInstance().getFormatNumberShow(model.damage);
        }
    }
    /**当前BOSS信息返回**/
    private onReciveBossInfoMsg(): void {
        this.isRequestInfo = false;
        this.examineCD(true);
        //切换到当前对应的BOSS标签
        this.currTab = this.bossData.fightID > 0 ? this.bossData.fightID : 1;
        this.total_damage_lab.text = this.bossData.myDamageNum + '';
        (this['tab' + this.currTab] as eui.RadioButton).selected = true;
        this.onTabHanlder();
    }
    //倒计时
    private _timeOpen: boolean;
    public examineCD(open: boolean) {
        if (this._timeOpen != open) {
            this._timeOpen = open;
            if (open) {
                Tool.addTimer(this.onCountDown, this, 1000);
            } else {
                Tool.removeTimer(this.onCountDown, this, 1000);
            }
        }
    }
    private onCountDown(): void {
        var leftime: number = this.bossData.lefttime;
        if (leftime <= 0) {
            leftime = 0;
            this.examineCD(false);
            this.onSendPVEBossInfoRequest();
        }
        this.lefttime_label.text = Language.instance.getText(this.bossData.isOpen ? 'BOSS结束时间 ' : 'BOSS复活时间 ') + GameCommon.getInstance().getTimeStrForSec1(leftime);
    }
    //请求副本信息
    private isRequestInfo: boolean;
    private onSendPVEBossInfoRequest(): void {
        if (!this.isRequestInfo) {
            this.isRequestInfo = true;
            DataManager.getInstance().dupManager.sendPVEBossInfoRequst();
        }
    }
    //进入跨服PVE BOSS战斗
    private onEnterFight(): void {
        GameFight.getInstance().onEnterCrossPVEBossScene();
    }
    //打开奖励预览界面
    private onShowAward(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ServerPVEBossAwardPanel");
    }
    //打开排行榜面板
    private onShowRankView(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ServerPVEBossDmgView", new ServerPVEBossDmgParam(this.bossData.fightID, 0)));
    }
    //购买次数处理
    private onBuyCount(): void {
        if (!this.bossData.isOpen) {
            return;
        }
        let cosumeparam: string[] = Constant.get(Constant.KUAFU_BOSS_BUY).split(',');
        let cosumeGold: number = parseInt(this.bossData.buycount < cosumeparam.length ? cosumeparam[this.bossData.buycount] : cosumeparam[cosumeparam.length - 1]);
        if (DataManager.getInstance().playerManager.player.gold < cosumeGold) {
            GameCommon.getInstance().addAlert(GameErrorTip.getInstance().getGameErrorTip(2));
            return;
        }
        let list = [{ text: `是否消耗${cosumeGold}钻石购买一次挑战次数？`, style: {} }];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("AlertFrameUI", new AlertFrameParam(list, this.onsendBuyCountMsg, this)));
    }
    private onsendBuyCountMsg(): void {
        let buyCountsMsg: Message = new Message(MESSAGE_ID.CROSS_PVEBOSS_COUNTBUY_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(buyCountsMsg);
    }
    //点开宝箱的TIPS
    private onTouchBox(event: egret.TouchEvent): void {
        let img: eui.Image = event.currentTarget as eui.Image;
        let model: Modelkuafubossrewards = this.damageAwards[parseInt(img.name)];
        if (!model) return;
        let awarditem: AwardItem = model.rewards[0];
        if (!awarditem) return;
        let thing: ModelThing = GameCommon.getInstance().getThingModel(awarditem.type, awarditem.id);
        let base: ThingBase = new ThingBase(thing.type);
        base.onupdate(thing.id, thing.quality, 0);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ItemIntroducebar", new IntroduceBarParam(INTRODUCE_TYPE.IMG, GOODS_TYPE.BOX, base, 0))
        );
    }
    //The end
}