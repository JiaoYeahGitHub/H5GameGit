class YeWaiChallengePanel extends BaseWindowPanel {
    private btnChallenge: eui.Button;
    private chakan: eui.Button;
    private result_desc_label: eui.Label;
    private common_title_img: eui.Image;
    private award_Scroller: eui.Scroller;
    private reward_grp: eui.Group;
    private param: AwardItem[];
    private scenetype: FIGHT_SCENE;
    private yewai_gold_award: eui.Label;
    private yewai_exp_award: eui.Label;
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;
    private passNum: eui.Label;
    private awardItem: GoodsInstance;
    private curPass: eui.Label;
    private getAward: eui.Button;
    private openFunImg: eui.Image;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.YeWaiChallengeSkin;
    }
    protected onRegist(): void {
        super.onRegist();
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_YEWAI_FIGHT_UPDATE, this.onRefreshWave, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.SCENE_ENTER_SUCCESS, this.onHide, this);
        this.btnChallenge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallenge, this);
        this.chakan.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChaKan, this);
        this.getAward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowXianfeng, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.GAME_TOPRANK_SIMPLE_MESSAGE.toString(), this.onShowInfo, this);
    }
    public onRemove(): void {
        super.onRemove();
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_YEWAI_FIGHT_UPDATE, this.onRefreshWave, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.SCENE_ENTER_SUCCESS, this.onHide, this);
        this.btnChallenge.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChallenge, this);
        this.chakan.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onChaKan, this);
        this.getAward.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onShowXianfeng, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.GAME_TOPRANK_SIMPLE_MESSAGE.toString(), this.onShowInfo, this);
    }
    private onChaKan(): void {
        var msg: Message = new Message(MESSAGE_ID.GAME_TOPRANK_SIMPLE_MESSAGE);
        msg.setByte(TopRankManager.RANK_SIMPLE_TYPE_MAPSTAGE);
        msg.setBoolean(true);
        GameCommon.getInstance().sendMsgToServer(msg);
    }
    public onChallenge(): void {
        let totalProgress: number = GameFight.getInstance().fightScene.rushData.progress;
        let currProgress: number = Math.min(totalProgress, GameFight.getInstance().yewai_batch);
        if (totalProgress > currProgress) {
            GameCommon.getInstance().addAlert("error_tips_10004");
            return;
        }
        if (GameFight.getInstance().checkBagIsFull()) {
            return;
        }
        if (GameFight.getInstance().fightsceneTpye == FIGHT_SCENE.YEWAI_XG) {
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_GOTO_BOSS_WAVE));
        }
        this.onHide();
    }
    public onHide(): void {
        super.onHide();
    }
    protected onInit(): void {
        super.onInit();
        this['basic']['label_title'].text = '野外关卡';
        this.onRefresh();
    }
    protected onRefresh(): void {
        var msg: Message = new Message(MESSAGE_ID.GAME_TOPRANK_SIMPLE_MESSAGE);
        msg.setByte(TopRankManager.RANK_SIMPLE_TYPE_MAPSTAGE);
        msg.setBoolean(false);
        GameCommon.getInstance().sendMsgToServer(msg);

        this.reward_grp.removeChildren();
        for (var i: number = 0; i < 3; i++) {
            var shengwangItem: AwardItem = new AwardItem();
            shengwangItem.type = GOODS_TYPE.ITEM;
            shengwangItem.id = 557 + i;
            // shengwangItem.quality = GameCommon.getInstance().getThingModel(GOODS_TYPE.ITEM, GoodsDefine.SHOWITEM_ID_PRESTIGE).quality;
            var gData: GoodsInstance = new GoodsInstance();
            gData.onUpdate(GOODS_TYPE.ITEM, 557 + i)
            this.reward_grp.addChild(gData);
        }
        var gData: GoodsInstance = new GoodsInstance();
        gData.onUpdate(2, 1)
        this.reward_grp.addChild(gData);
        // shengwangItem.quality = GameCommon.getInstance().getThingModel(GOODS_TYPE.ITEM, GoodsDefine.SHOWITEM_ID_PRESTIGE).quality;
        var gData: GoodsInstance = new GoodsInstance();
        gData.onUpdate(GOODS_TYPE.YUELI, 0)
        this.reward_grp.addChild(gData);
        var cfgs: Modelguanqiakaiqi[] = JsonModelManager.instance.getModelguanqiakaiqi();
        var cfg: Modelguanqiakaiqi;
        for (let k in cfgs) {
            if (cfgs[k].guanqia > GameFight.getInstance().yewai_waveIndex) {
                cfg = cfgs[k]
                break;
            }
        }
        if (cfg)
            this.openFunImg.source = cfg.png;
        else
            this.openFunImg.source = '';

        this.onRefreshWave();
    }
    private onShowXianfeng() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_GOTYPE_OPEN_WINDOW), FUN_TYPE.FUN_XIANFENG);
    }
    private onShowInfo(): void {
        this.passNum.text = '第' + GameFight.getInstance().yewai_waveIndex + '关';
        this.yewai_exp_award.text = GameFight.getInstance().getYewaiExp() * 720 + "/时";
        this.yewai_gold_award.text = GameFight.getInstance().getYewaiGold() * 720 + "/时";

        let models = JsonModelManager.instance.getModelguanqiaxianfeng()
        let targetModel: Modelguanqiaxianfeng;
        for (let id in models) {
            let model: Modelguanqiaxianfeng = models[id];
            if (model.mapId > GameFight.getInstance().yewai_waveIndex) {
                targetModel = model;
                break;
            }
        }
        if (targetModel) {
            this.curPass.text = targetModel.mapId + '关豪礼';
            let awarditem: AwardItem = targetModel.rewards[0];
            this.awardItem.onUpdate(awarditem.type, awarditem.id);
        } else {
            this.awardItem.visible = false;
            this.curPass.text = '奖励已全部领取';
            this.curPass.size = 16;
        }

        let list = DataManager.getInstance().topRankManager.mapStageList;
        for (var i: number = 0; i < 3; i++) {
            if (list[i]) {
                this['name' + (i + 1)].text = list[i].name;
                this['dupNum' + (i + 1)].text = list[i].value;
            } else {
                this['name' + (i + 1)].text = "";
                this['dupNum' + (i + 1)].text = "";
            }
        }
    }
    private onRefreshWave(): void {
        let totalProgress: number = GameFight.getInstance().fightScene.rushData.progress;
        let currProgress: number = Math.min(totalProgress, GameFight.getInstance().yewai_batch);
        if (totalProgress > currProgress) {
            this.btnChallenge.enabled = false;
            this.btnChallenge.label = `还差${(totalProgress - currProgress)}波`;
        } else {
            this.btnChallenge.enabled = true;
            this.btnChallenge.label = "挑 战";
        }
    }
}