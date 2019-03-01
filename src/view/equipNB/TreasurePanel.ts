class TreasurePanel extends BaseTabView {
    private currency0: CurrencyBar;
    private currency1: CurrencyBar;
    // private my_currency: CurrencyBar;
    private btn_one: eui.Button;
    private btn_ten: eui.Button;
    private bar: eui.Scroller;
    private label_log: eui.Label;
    private best12: eui.Group;
    private best13: eui.Group;
    // protected points: redPoint[] = RedPointManager.createPoint(1);
    // private equi1Anim: Animation;
    // private equi2Anim: Animation;
    //首次十连抽
    private first: eui.Group;
    private first_equip: GoodsInstance;
    private first_job: eui.Image;
    private PR_desc_btn: eui.Image;
    // private week_lefttime_lab: eui.Label;
    // private week_times_lab: eui.Label;
    // private reward_week_btn: eui.Button;
    private WEAPON_ID: number = 5;
    private CLOTH_ID: number = 10;
    private WEEK_AWD_MAX: number = 4;
    private weekLefttime: number;//下周剩余的时间

    protected points: redPoint[] = RedPointManager.createPoint(1);
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.TreasurePanelSkin;
    }
    protected onInit(): void {
        let goods: GoodsInstance;
        let model: Modelxunbao = JsonModelManager.instance.getModelxunbao()[1];
        let awarditems: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(model.show);
        for (let i: number = 0; i < awarditems.length; i++) {
            let awarditem: AwardItem = awarditems[i];
            goods = this[`item${i}`];
            if (goods) {
                goods.onUpdate(awarditem.type, awarditem.id, 0, awarditem.quality, awarditem.num, awarditem.lv);
            } else {
                let modelitem: ModelThing = GameCommon.getInstance().getThingModel(awarditem.type, awarditem.id, awarditem.quality);
                if (this[`best${i}_icon`]) {
                    this[`best${i}_icon`].source = modelitem.icon;
                }
                if (this[`best${i}_name_lab`]) {
                    this[`best${i}_name_lab`].text = modelitem.name;
                }
                if (this[`best${i}`]) {
                    this[`best${i}`].name = modelitem.id;
                }
            }
        }

        let weekAwdParams: string[] = model.box.split("#");
        // for (let i: number = 0; i < this.WEEK_AWD_MAX; i++) {
        //     let params: string[] = weekAwdParams[i] ? weekAwdParams[i].split(",") : null;
        //     if (!params) break;
        //     let count: number = parseInt(params[0]);
        //     (this[`award_times_lab${i}`] as eui.Label).text = Language.instance.getText(count, 'times');
        //     (this[`award_box_img${i}`] as eui.Image).name = params[1];
        //     (this[`award_box_img${i}`] as eui.Image).addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBox, this);
        // }
        this.currency0.nameColor = 0xf3f3f3;
        this.currency1.nameColor = 0xf3f3f3;
        this.currency0.data = new CurrencyParam("", new ThingBase(model.cost.type, model.cost.id, model.cost.num));
        this.currency1.data = new CurrencyParam("", new ThingBase(model.costOneKey.type, model.costOneKey.id, model.costOneKey.num));
        this.first.visible = false;

        let anim: Animation;
        anim = GameCommon.getInstance().addAnimation('jinzhuang', new egret.Point(86, 75), this.best12, -1);
        anim.scaleX = anim.scaleY = 1.3;
        anim.touchEnabled = false;
        anim = GameCommon.getInstance().addAnimation('jinzhuang', new egret.Point(86, 75), this.best13, -1);
        anim.scaleX = anim.scaleY = 1.3;
        anim.touchEnabled = false;
        // this.points[0].register(this.reward_week_btn, GameDefine.RED_BTN_POS_YELLOW_LITTLE, DataManager.getInstance().celestialManager, "checkTreasurePoint");

        if (SDKManager.loginInfo.channel == EChannel.CHANNEL_AWY || SDKManager.loginInfo.channel == EChannel.CHANNEL_LOCAL) {
            this.PR_desc_btn.visible = true;
            this.PR_desc_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowPRDescPanel, this);
        } else {
            this.PR_desc_btn.visible = false;
        }
        super.onInit();
        this.onRefresh();
    }

    protected onRegist(): void {
        super.onRegist();
        this.btn_one.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnOne, this);
        this.btn_ten.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTen, this);
        // this.reward_week_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAward, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TREASURE_CELESTIAL_MEESAGE.toString(), this.onTreasureBackMsg, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TREASURE_CELESTIAL_LOG_MEESAGE.toString(), this.onUpdateLog, this);
        // GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.TREASURE_WEEK_AWARD_MESSAGE.toString(), this.onUpdateWeekAward, this);
        this.best12.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAnim, this);
        this.best13.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAnim, this);
        Tool.addTimer(this.onTimeDown, this, 1000);
    }

    protected onRemove(): void {
        super.onRemove();
        this.btn_one.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnOne, this);
        this.btn_ten.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnTen, this);
        // this.reward_week_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAward, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TREASURE_CELESTIAL_MEESAGE.toString(), this.onTreasureBackMsg, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TREASURE_CELESTIAL_LOG_MEESAGE.toString(), this.onUpdateLog, this);
        // GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.TREASURE_WEEK_AWARD_MESSAGE.toString(), this.onUpdateWeekAward, this);
        // this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.best12.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAnim, this);
        this.best13.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchAnim, this);
        Tool.removeTimer(this.onTimeDown, this, 1000);
    }

    protected onRefresh(): void {
        //打开面板后初始化一下距离下周剩余时间的时间戳
        var currDate: Date = new Date(DataManager.getInstance().playerManager.player.currentTime);
        this.weekLefttime = (GameDefine.WEEK_DAY - currDate.getDay()) * 86400 - currDate.getHours() * 3600 - currDate.getMinutes() * 60 - currDate.getSeconds();
        this.weekLefttime = this.weekLefttime + egret.getTimer();
        this.onUpdateLog();
        // this.onUpdateWeekAward();
        this.onTreasureBackMsg();
        // this.updateCurrency();
    }
    //更新我的货币
    // private updateCurrency(): void {
    //     this.my_currency.data = new CurrencyParam(Language.instance.getText('current', 'currency' + GOODS_TYPE.DIAMOND), new ThingBase(GOODS_TYPE.DIAMOND, 0, -1));
    // }
    //抽奖返回
    private onTreasureBackMsg(): void {
        this.onShowFirst();
        // this.week_times_lab.text = "" + DataManager.getInstance().celestialManager.treasureTimes;
        // this.updateCurrency();
    }
    //倒计时
    private onTimeDown(): void {
        var _lefttime: number = Math.ceil((this.weekLefttime - egret.getTimer()) / 1000);
        if (_lefttime <= 0) {
            Tool.removeTimer(this.onTimeDown, this, 1000);
        }
        // this.week_lefttime_lab.text = GameCommon.getInstance().getTimeStrForSecHS(_lefttime);
    }

    //点击动画
    private onTouchAnim(event: egret.Event): void {
        let equipId: number = parseInt(event.currentTarget.name);
        let thing = new EquipThing(GOODS_TYPE.MASTER_EQUIP);
        thing.onupdate(equipId, GoodsQuality.Gold, 0);
        if (thing) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                new WindowParam("ItemIntroducebar", new IntroduceBarParam(INTRODUCE_TYPE.EQUIP, GOODS_TYPE.MASTER_EQUIP, thing))
            );
        }
    }
    // private onTouchBox(event: egret.Event): void {
    //     var img: eui.Image = event.currentTarget as eui.Image;
    //     var box: Modelbox = JsonModelManager.instance.getModelbox()[img.name];
    //     var base = new ThingBase(GOODS_TYPE.BOX);
    //     base.onupdate(img.name, box.quality, 0);
    //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
    //         new WindowParam("ItemIntroducebar", new IntroduceBarParam(INTRODUCE_TYPE.IMG, GOODS_TYPE.BOX, base, 0))
    //     );
    // }
    //显示首次十连抽奖励
    private onShowFirst(): void {
        var player: Player = DataManager.getInstance().playerManager.player;
        //隐藏
        if (player.treasureFirst != 0) {
            this.first.visible = false;
        }
        //显示
        else {
            //刷新
            if (this.first.visible == false) {
                this.first_equip.onUpdate(GOODS_TYPE.MASTER_EQUIP, 219, 0, GoodsQuality.Red, 1);
                this.first.visible = true;
            }
        }
    }
    //更新周奖励
    // private onUpdateWeekAward(): void {
    //     this.reward_week_btn.enabled = false;
    //     let manager: CelestialManager = DataManager.getInstance().celestialManager;
    //     let model: Modelxunbao = JsonModelManager.instance.getModelxunbao()[1];
    //     let weekAwdParams: string[] = model.box.split("#");
    //     for (let i: number = 0; i < this.WEEK_AWD_MAX; i++) {
    //         let params: string[] = weekAwdParams[i] ? weekAwdParams[i].split(",") : null;
    //         if (!params) break;
    //         let times: number = parseInt(params[0]);
    //         let boxImg: eui.Image = (this[`award_box_img${i}`] as eui.Image);
    //         let animgrp: eui.Group = (this[`reward_anim_grp${i}`] as eui.Group);
    //         animgrp.removeChildren();
    //         if (manager.treasureAwdIdx > i) {
    //             boxImg.source = 'treasure_box_open_png';
    //         } else {
    //             boxImg.source = 'treasure_box_unopen_png';
    //             if (manager.treasureTimes >= times) {
    //                 if (!this.reward_week_btn.enabled) {
    //                     this.reward_week_btn.enabled = true;
    //                 }
    //                 GameCommon.getInstance().addAnimation('baoxiangtixing', null, animgrp, -1);
    //             }
    //         }
    //     }
    // }
    //更新抽奖的LOG
    private onUpdateLog(): void {
        this.label_log.textFlow = DataManager.getInstance().celestialManager.getTextFlow();
        setTimeout(this.adjustChatBar.bind(this), 100);
    }
    private adjustChatBar() {
        this.bar.viewport.scrollV = Math.max(this.bar.viewport.contentHeight - this.bar.viewport.height, 0);
    }
    private onTouchBtnOne(): void {
        DataManager.getInstance().celestialManager.onSendCelestiaTreasure(0);
    }
    private onTouchBtnTen(): void {
        DataManager.getInstance().celestialManager.onSendCelestiaTreasure(1);
    }
    private onTouchBtnAward(): void {
        let weekawardMsg: Message = new Message(MESSAGE_ID.TREASURE_WEEK_AWARD_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(weekawardMsg);
    }
    private onShowPRDescPanel(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ExplainPanel", Language.instance.getText('treasure_PR_explain')));
    }
    //The end
}