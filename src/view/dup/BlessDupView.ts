class BlessDupView extends BaseTabView {
    private part_num_bmplab: eui.BitmapLabel;
    private first_award_item: GoodsInstance;
    private explan_lab: eui.Label;
    private lefttimes_bar: TimesBar;
    private btn_enter: eui.Button;
    private award_btn: eui.Button;
    private goto_vip: eui.Label;
    private awd_stage_lab: eui.Label;
    private frist_award_grp: eui.Group;
    private _dupInfo: DupInfo;

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.BlessDupViewSkin;
    }
    protected onInit(): void {
        this.explan_lab.text = Language.instance.getText('zhufuzhiwanfa');
        GameCommon.getInstance().addUnderlineStr(this.goto_vip);
        this.onRefresh();
    }
    protected onRefresh(): void {
        (this.owner as DupPanel).onRequestDupInofMsg(DUP_TYPE.DUP_ZHUFU);
        this.showVipLabel();
    }
    private onResDupInfoMsg(): void {
        this._dupInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_ZHUFU)[0];
        let partCount: number = this._dupInfo.pass;
        this.part_num_bmplab.text = partCount + "";
        let model: Modelzhufuzhifuben = JsonModelManager.instance.getModelzhufuzhifuben()[partCount];
        if (!model) return;
        let countRewards: string[] = model.numReward.split("#");
        let killAward: AwardItem;
        for (let i: number = 0; i < 3; i++) {
            if (countRewards.length > i) {
                this['awardgrp' + i].visible = true;
                killAward = model.rewards[i];
                let awardboshu: number = parseInt(countRewards[i]);
                (this['kill_desc_lab' + i] as eui.Label).text = Language.instance.getText('jisha', awardboshu, 'zhiguai', 'award');
                (this['kill_awarditem' + i] as GoodsInstance).onUpdate(killAward.type, killAward.id, 0, killAward.quality, killAward.num);
            } else {
                this['awardgrp' + i].visible = false;
            }
        }
        this.onUpdateAwards();
        this.onRefreshTimes();
    }
    /**更新领奖状态**/
    private onUpdateAwards(): void {
        let modelsDict = JsonModelManager.instance.getModelzhufuzhifuben();
        this._dupInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_ZHUFU)[0];
        let model: Modelzhufuzhifuben;
        for (let modelid in modelsDict) {
            model = modelsDict[modelid];
            if (model.id > this._dupInfo.awardIndex) {
                break;
            }
        }
        if (model) {
            /**首次通关奖励**/
            this.frist_award_grp.visible = true;
            var firstitems: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model.tongguan);
            this.first_award_item.onUpdate(firstitems[0].type, firstitems[0].id, 0, firstitems[0].quality, firstitems[0].num);

            if (this._dupInfo.awardIndex < this._dupInfo.blessPassRecord) {
                this.award_btn.enabled = true;
                this.award_btn.label = Language.instance.getText("lingqu");
            } else {
                this.award_btn.enabled = false;
                this.award_btn.label = Language.instance.getText("weitongguan");
            }
            // this.awd_stage_lab.text = model.id + '';
        } else {
            this.frist_award_grp.visible = false;
        }
    }
    /**更新副本次数**/
    private onRefreshTimes(): void {
        this.lefttimes_bar.data = ['', this._dupInfo.lefttimes, this._dupInfo.totalTimes];
    }
    //发送进入副本协议
    private onChallengeDup(event: egret.Event): void {
        GameFight.getInstance().onSendEnterDupMsg(this._dupInfo.id);
    }
    //发送领奖协议
    private onReward(): void {
        var rewardMsg: Message = new Message(MESSAGE_ID.GAME_BLESSDUP_REWARD_MSG);
        GameCommon.getInstance().sendMsgToServer(rewardMsg);
    }
    protected onRegist(): void {
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResDupInfoMsg, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_BLESSDUP_REWARD_MSG.toString(), this.onUpdateAwards, this);
        this.btn_enter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallengeDup, this);
        this.award_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
        this.goto_vip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gotoVip, this);
    }
    protected onRemove(): void {
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_DUP_INFO_MESSAGE.toString(), this.onResDupInfoMsg, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_BLESSDUP_REWARD_MSG.toString(), this.onUpdateAwards, this);
        this.btn_enter.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallengeDup, this);
        this.award_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onReward, this);
        this.goto_vip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gotoVip, this);
    }

    private showVipLabel(): void {
        if (DataManager.getInstance().monthCardManager.card[CARD_TYPE.LIFELONG].param == 0 && !SDKManager.isHidePay) {
            this.goto_vip.visible = true;
        } else {
            this.goto_vip.visible = false;
        }
    }

    private gotoVip() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_MONTHCARD);
    }
    //The end
}