// TypeScript file
class LadderArenaPanel extends BaseTabView {
    private duanwei_item: LadderAreneItem;
    private nextduanwei_item: LadderAreneItem;
    private lefttimes_lab: eui.Label;
    private time_cd_lab: eui.Label;
    private inspire_status_lab: eui.Label;
    private open_title_lab: eui.Label;
    private open_time_lab: eui.Label;
    private btn_seach_enemy: eui.Button;
    private score_probar: eui.ProgressBar;
    private arane_ranknum_null: eui.Label;
    private arane_ranknum_label: eui.BitmapLabel;
    private btn_award_loop: eui.Button;
    private btn_arane_rank: eui.Label;
    private btn_arane_shop: eui.Button;
    private btn_inspire: eui.Button;
    private arane_award_group: eui.Group;
    private ladder_desc_label: eui.Label;
    private btn_Sonnie: eui.Button;
    private explainLayer: eui.Group;
    private hp_scroller: eui.Scroller;
    // private herohp_anim_grp: eui.Group;
    private currhp_rate_lab: eui.Label;
    private win_count_lab: eui.Label;

    private Insprite_Max: number;
    private showawardMax: number = 1;
    private refreshTime: number = 0;
    private SCROLLER_HEIGHT: number = 118;
    // private START_HPANIM_Y: number = 30;
    // private END_HPANIM_Y: number = 170;
    private isDie: boolean = false;

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LadderArenaPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        this.Insprite_Max = Constant.get(Constant.LADDER_BUFF_PRICE).split(',').length;
        // this.xueqiuAnim = GameCommon.getInstance().addAnimation('tiantixueqiu', new egret.Point(60, this.END_HPANIM_Y), this.herohp_anim_grp, -1);
        GameCommon.getInstance().addUnderlineStr(this.ladder_desc_label);
        GameCommon.getInstance().addUnderlineStr(this.btn_arane_rank);
        this.onRefresh();
    }
    protected onRefresh(): void {
        this.sendLadderInfoMsg();
        this.sendLadderRankMsg();
    }
    private sendLadderInfoMsg(): void {
        let arenaInitMsg: Message = new Message(MESSAGE_ID.ARENE_LADDERARENE_UPDATE_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(arenaInitMsg);
    }
    private sendLadderRankMsg(): void {
        let arenaRankMsg: Message = new Message(MESSAGE_ID.ARENE_LADDERARENE_RANK_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(arenaRankMsg);
    }
    private updateMsgReceive(): void {
        let ladderData: LadderAreneData = DataManager.getInstance().arenaManager.ladderArenaData;
        let model: Modelttre = ladderData.model;
        this.duanwei_item.onUpdate(model.type);//更新排位等级
        let nextModel: Modelttre = JsonModelManager.instance.getModelttre()[model.type];
        this.nextduanwei_item.onUpdate(nextModel ? nextModel.type : model.type);//更新下一等级排位等级
        this.win_count_lab.text = Language.instance.parseInsertText('lianshengchangci', Math.max(ladderData.wincount, 0));
        //更新积分进度
        this.score_probar.maximum = model.maxjifen;
        this.score_probar.value = ladderData.score;
        this.score_probar.labelFunction = function (value: number, maximum: number): string {
            return "积分：" + value + "/" + maximum;
        };
        //更新当前血量
        let hprate: number = 100;
        let currHp: number = ladderData.heroHpNum;
        if (DataManager.getInstance().arenaManager.ladderArenaData.ladderStatus == 0) {
            let maxHp: number = DataManager.getInstance().playerManager.player.getPlayerData().attributes[ATTR_TYPE.HP];
            hprate = Math.min(100, Math.ceil(currHp / maxHp * 100));
        }

        this.currhp_rate_lab.text = `${hprate}%`;
        this.currhp_rate_lab.textColor = hprate < 10 ? 0xff4633 : 0xFFEC66;
        this.hp_scroller.height = Math.floor(this.SCROLLER_HEIGHT * hprate / 100);
        this.isDie = currHp <= 0;
        //鼓舞次数
        this.onUpdateInspire();
        //更新剩余次数
        if (DataManager.getInstance().arenaManager.ladderArenaData.ladderStatus == 0) {
            this.lefttimes_lab.text = Language.instance.getText("shengyucishu") + "：" + ladderData.fightCount + "/" + GameDefine.LADDER_FIGHTCOUNT_MAX;
        } else {
            this.lefttimes_lab.text = Language.instance.getText('activity', 'unopen');
        }
    }
    //更新鼓舞次数
    private onUpdateInspire(): void {
        let ladderData: LadderAreneData = DataManager.getInstance().arenaManager.ladderArenaData;
        this.inspire_status_lab.text = Language.instance.getText('yiguwu') + ":" + ladderData.inspireCount + "/" + this.Insprite_Max;
    }
    //更新排行榜数据
    private onUpdateRankInfo(): void {
        let ladderData: LadderAreneData = DataManager.getInstance().arenaManager.ladderArenaData;
        var rankData: LadderRankData = DataManager.getInstance().arenaManager.selfladderRankData;
        var selfRankNum: number = rankData ? rankData.rank : 0;
        if (selfRankNum > 0) {
            this.arane_ranknum_label.text = selfRankNum + "";
            this.arane_ranknum_null.visible = false;
        } else {
            this.arane_ranknum_label.text = "";
            this.arane_ranknum_null.visible = true;
        }
        //排行榜前三人
        for (var i: number = 0; i < 3; i++) {
            var ladderrankData: LadderRankData = DataManager.getInstance().arenaManager.ladderRanks[i];
            var aranerank_name_label: eui.Label = this["rank_name_label" + (i + 1)];
            var aranerank_score_label: eui.Label = this["rank_score_label" + (i + 1)];
            if (ladderrankData) {
                aranerank_name_label.text = ladderrankData.name;
                aranerank_score_label.text = (ladderrankData.rebirthLv > 0 ? `${ladderrankData.rebirthLv}阶` : "") + ladderrankData.level + "级";
            } else {
                aranerank_name_label.text = "暂无";
                aranerank_score_label.text = "";
            }
        }
        //段位奖励
        let currAwards: AwardItem[] = [];
        let maxLevel: number = ModelManager.getInstance().getModelLength('ttre');
        for (let idx in JsonModelManager.instance.getModelttjjc()) {
            let ttjjcmodel: Modelttjjc = JsonModelManager.instance.getModelttjjc()[idx];
            // 181022 ranking去除
            // if (ttjjcmodel.ranking == rankData.rank && ladderData.model.type == maxLevel) {
            //     currAwards = ttjjcmodel.rewards;
            //     break;
            // }
            if (ttjjcmodel.lv == ladderData.model.type) {
                currAwards = ttjjcmodel.rewards;
            }
        }
        for (var i: number = 0; i < this.showawardMax; i++) {
            var award_instance: GoodsInstance = this["award_item" + i];
            if (currAwards.length > i) {
                var awardItem: AwardItem = currAwards[i];
                award_instance.onUpdate(awardItem.type, awardItem.id, 0, awardItem.quality, awardItem.num);
                if (!award_instance.parent) {
                    this.arane_award_group.addChildAt(award_instance, i);
                }
            } else {
                if (award_instance.parent) {
                    this.arane_award_group.removeChild(award_instance);
                }
                award_instance.onReset();
            }
        }
    }
    protected onRegist(): void {
        super.onRegist();
        this.btn_seach_enemy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSeachEnemy, this);
        this.btn_award_loop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAwardPanel, this);
        this.btn_arane_rank.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenRankPanel, this);
        this.btn_arane_shop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShopHandler, this);
        this.btn_inspire.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onInspire, this);
        this.explainLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_LADDERARENE_UPDATE_MESSAGE.toString(), this.updateMsgReceive, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_LADDERARENE_RANK_MESSAGE.toString(), this.onUpdateRankInfo, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_LADDERARENE_INSPIRE_MESSAGE.toString(), this.onUpdateInspire, this);
        Tool.addTimer(this.ontimedownHandler, this, 1000);
    }
    protected onRemove(): void {
        super.onRemove();
        this.btn_seach_enemy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSeachEnemy, this);
        this.btn_award_loop.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAwardPanel, this);
        this.btn_arane_rank.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenRankPanel, this);
        this.btn_arane_shop.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShopHandler, this);
        this.btn_inspire.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onInspire, this);
        this.explainLayer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_LADDERARENE_UPDATE_MESSAGE.toString(), this.updateMsgReceive, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_LADDERARENE_RANK_MESSAGE.toString(), this.onUpdateRankInfo, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_LADDERARENE_INSPIRE_MESSAGE.toString(), this.onUpdateInspire, this);
        Tool.removeTimer(this.ontimedownHandler, this, 1000);
    }
    private onTouchExplain() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ExplainPanel", Language.instance.getText('ladder_shuoming')));
    }
    private onSeachEnemy(): void {
        GameFight.getInstance().onSendLadderArenaFightMsg();
    }
    private ontimedownHandler(): void {
        let recoverCD: number = -1;
        let ladderData: LadderAreneData = DataManager.getInstance().arenaManager.ladderArenaData;
        if (DataManager.getInstance().arenaManager.ladderArenaData.ladderStatus == 0) {
            FunDefine.isLadderOpen = true;
            this.open_title_lab.text = Language.instance.getText('activity', 'shengyushijian') + "：";
            if (ladderData.fightCount < GameDefine.LADDER_FIGHTCOUNT_MAX) {
                recoverCD = Math.max(0, Math.ceil((ladderData.leftRecover - egret.getTimer()) / 1000));
                if (recoverCD > 0) {
                    this.time_cd_lab.text = GameCommon.getInstance().getTimeStrForSec2(recoverCD, false) + Language.instance.getText("houhuifucishu");
                } else {
                    this.time_cd_lab.text = '';
                }
            } else {
                this.time_cd_lab.text = '';
            }
        } else {
            FunDefine.isLadderOpen = false;
            this.open_title_lab.text = Language.instance.getText('distance', 'activity', 'open') + "：";
            this.time_cd_lab.text = "";
        }
        //赛季状态倒计时
        let open_lefttime: number = Math.max(0, Math.ceil((ladderData.statusTime - egret.getTimer()) / 1000));
        this.open_time_lab.text = GameCommon.getInstance().getTimeStrForSec2(open_lefttime, false);
        if (open_lefttime <= 0 || recoverCD == 0) {
            this.sendLadderInfoMsg();
            this.refreshTime = egret.getTimer() + 10 * 1000;
        }

        if (this.refreshTime == 0) {
            this.refreshTime = egret.getTimer() + 20 * 1000;
        } else if (this.refreshTime < egret.getTimer()) {
            this.sendLadderRankMsg();
            this.refreshTime = egret.getTimer() + 20 * 1000;
        }
    }
    //打开赛季奖励
    private onOpenAwardPanel(event: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "LadderAwardPanel");
    }
    //打开排行榜
    private onOpenRankPanel(event: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "LadderAraneRankPanel");
    }
    //荣誉商城
    private onShopHandler(evnet: egret.Event): void {
        // var types: number[] = ShopDefine.SHOP_TYPES;
        // var param = new ShopParam(types, 2);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "PvPShopPanel");
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ShopPanel", param));
    }
    //进行鼓舞
    private onInspire(): void {
        if (DataManager.getInstance().arenaManager.ladderArenaData.ladderStatus > 0) {
            GameCommon.getInstance().addAlert('error_tips_21');
            return;
        }
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "LadderInspirePanel");
    }
    private getPlayerData(): Player {
        return DataManager.getInstance().playerManager.player;
    }
    //The end
}
class LadderAreneItem extends eui.Component {
    private duanwei_icon: eui.Image;
    private duanwei_img: eui.Image;

    public constructor() {
        super();
        this.once(egret.Event.COMPLETE, this.onLoadComplete, this);
        this.skinName = skins.LadderItemSkin;
    }
    private onLoadComplete(): void {
    }
    public onUpdate(grade: number): void {
        this.duanwei_icon.source = "arena_laddericon_lv" + grade + "_png";
        this.duanwei_img.source = "arena_ladder_grade" + grade + "_png";
    }
    //The end
}
class LadderReadyPanel extends BaseWindowPanel {
    private headicon_grp: eui.Group;
    private name_grp: eui.Group;
    private power_grp: eui.Group;
    private name_lab: eui.Label;
    private power_lab: eui.BitmapLabel;
    private sure_btn: eui.Button;

    private enemydata: PlayerData;
    private playNum: number;
    private _showleftTime: number;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LadderReadySkin;
    }
    public onShowWithParam(param): void {
        this.enemydata = param;
        super.onShowWithParam(param);
    }
    protected onInit(): void {
        super.onInit();
        this.onRefresh();
    }
    protected onRefresh(): void {
        this.playNum = 5;
        this.power_grp.visible = false;
        this.name_grp.visible = false;
        this.sure_btn.visible = false;
        this.headicon_grp.removeChildren();
        this.onPlay();
    }
    private onPlay(): void {
        if (!this._isShow) return;
        if (this.playNum == 0) {
            this.onPlayFinish();
            return;
        }
        this.playNum--;
        let headIdx: number = this.playNum > 0 ? Math.floor(Math.random() * GameDefine.Max_Role_Head) : this.enemydata.headiconIdx;
        let headicon: eui.Image = new eui.Image();
        headicon.source = GameCommon.getInstance().getBigHeadByOccpation(headIdx);
        headicon.width = 160;
        headicon.height = 160;
        this.headicon_grp.addChild(headicon);
        headicon.x = 10;
        headicon.y = 100;
        let targetPosY: number = this.playNum > 0 ? -180 : 0;
        egret.Tween.get(headicon).to({ y: targetPosY }, 1000, this.playNum > 0 ? null : egret.Ease.sineOut);

        Tool.callbackTime(this.onPlay, this, 600);
    }
    private onPlayFinish(): void {
        if (!this._isShow) return;

        this._showleftTime = 4;
        this.power_grp.visible = true;
        this.name_grp.visible = true;
        this.sure_btn.visible = true;
        this.name_lab.text = this.enemydata.name;
        this.power_lab.text = "" + this.enemydata.figthPower;
        Tool.addTimer(this.onCloseTimedown, this, 1000);
    }
    private onCloseTimedown(): void {
        this._showleftTime--;
        if (this._showleftTime < 0) {
            this.onTouchCloseBtn();
            return;
        }
        this.sure_btn.label = Language.instance.getText('fight') + `(${this._showleftTime}S)`;
    }
    protected onRegist(): void {
        super.onRegist();
        this.sure_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.sure_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
        Tool.removeTimer(this.onCloseTimedown, this, 1000);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.LADDER_FIGHT_START_EVENT));
    }
    //The end
}