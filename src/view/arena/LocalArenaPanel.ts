class LocalArenaPanel extends BaseTabView {
    private self_rank_num_label: eui.BitmapLabel;
    private total_fightnum_lab: eui.BitmapLabel;
    private left_fightnum_lab: eui.BitmapLabel;
    private get_num_label: eui.Label;
    private arena_shop_btn: eui.Button;
    private arena_rank_btn: eui.Button;
    private arena_history_btn: eui.Button;
    private refresh_list_btn: eui.Button;
    private rank_reward_label: eui.BitmapLabel;
    private not_rank_lab: eui.Label;
    private saoDang_btn: eui.Button;
    private first_awd_btn: eui.Group;

    protected points: redPoint[];

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.LocalArenaPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        GameCommon.getInstance().addUnderlineStr(this.get_num_label);

        for (var i: number = 0; i < GameDefine.Local_Arena_Enemy_Max; i++) {
            var arenaFigthItem: LocalArenaMatchItem = this["arena_fightItem" + i] as LocalArenaMatchItem;
        }
        this.saoDang_btn.visible = DataManager.getInstance().playerManager.player.level >= 100;

        this.points = RedPointManager.createPoint(1);
        this.points[0].register(this.first_awd_btn, GameDefine.RED_FASHION_ITEM_POS, DataManager.getInstance().localArenaManager, "getRedArenaFirstAwd");

        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.get_num_label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGetArenaNum, this);
        this.arena_rank_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenArenaRankPanel, this);
        this.arena_shop_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAraneShop, this);
        this.refresh_list_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendRefreshEnemyListMsg, this);
        this.arena_history_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openArenaHistroyPanel, this);
        this.saoDang_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnSaoDang, this);
        this.first_awd_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openFirstAwardPanel, this);
        // this.explainLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_INFO_UPDATE_MESSAGE.toString(), this.onResArenaInfoUpdateMsg, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_BUY_FIGHTCOUNT_MESSAGE.toString(), this.onUpdateSweepRefresh, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_REFRESH_ENEMYLIST_MESSAGE.toString(), this.onUpdateEmenyList, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENA_BATTLE_SWEEP.toString(), this.onUpdateSweepRefresh, this);

        for (var i: number = 0; i < GameDefine.Local_Arena_Enemy_Max; i++) {
            var arenaFigthItem: LocalArenaMatchItem = this["arena_fightItem" + i] as LocalArenaMatchItem;
            arenaFigthItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchArenaItem, this);
        }
    }
    protected onRemove(): void {
        super.onRemove();
        this.get_num_label.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGetArenaNum, this);
        this.arena_rank_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenArenaRankPanel, this);
        this.refresh_list_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendRefreshEnemyListMsg, this);
        this.arena_shop_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAraneShop, this);
        this.arena_history_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openArenaHistroyPanel, this);
        this.saoDang_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnSaoDang, this);
        this.first_awd_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openFirstAwardPanel, this);
        // this.explainLayer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_INFO_UPDATE_MESSAGE.toString(), this.onResArenaInfoUpdateMsg, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_BUY_FIGHTCOUNT_MESSAGE.toString(), this.onUpdateSweepRefresh, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_REFRESH_ENEMYLIST_MESSAGE.toString(), this.onUpdateEmenyList, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENA_BATTLE_SWEEP.toString(), this.onUpdateSweepRefresh, this);
        for (var i: number = 0; i < GameDefine.Local_Arena_Enemy_Max; i++) {
            var arenaFigthItem: LocalArenaMatchItem = this["arena_fightItem" + i] as LocalArenaMatchItem;
            arenaFigthItem.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchArenaItem, this);
        }
        // this.examineCD(false);
    }
    // private onTouchExplain() {
    //     GameDispatcher.getInstance().dispatchEvent(
    //         new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
    //         new WindowParam("ExplainPanel", this.explainStr)
    //     );
    // }
    protected onRefresh(): void {
        this.onSendArenaInfo();
    }
    private onSendArenaInfo(): void {
        DataManager.getInstance().arenaManager.onSendLocalArenaInfoMsg();
    }
    private onResArenaInfoUpdateMsg(): void {
        var arenaRankData: LocalArenaData = DataManager.getInstance().localArenaManager.localArenaData;
        if (arenaRankData.rank > 0) {
            this.self_rank_num_label.text = arenaRankData.rank + "";
            this.not_rank_lab.visible = false;
        } else {
            this.self_rank_num_label.text = '';
            this.not_rank_lab.visible = true;
        }
        let awarditems: AwardItem[] = DataManager.getInstance().localArenaManager.getRankAwards(arenaRankData.rank);
        for (let i: number = 0; i < 2; i++) {
            let awditem: AwardItem = awarditems[i];
            let thing: ModelThing = GameCommon.getInstance().getThingModel(awditem.type, awditem.id);
            (this['rank_reward_icon' + i] as eui.Image).source = thing.dropicon;
            (this['rank_reward_label' + i] as eui.Label).text = awditem.num + '';
        }
        this.onUpdateArenaCount();
        this.onUpdateEmenyList();
    }
    private onUpdateEmenyList(): void {
        for (var i: number = 0; i < GameDefine.Local_Arena_Enemy_Max; i++) {
            var enemyAraneData: ArenaEnemy = DataManager.getInstance().localArenaManager.localArenaData.enemyList[i];
            var arenaFigthItem: LocalArenaMatchItem = this["arena_fightItem" + i] as LocalArenaMatchItem;
            if (enemyAraneData) {
                arenaFigthItem.data = enemyAraneData;
            } else {
                arenaFigthItem.data = null;
            }
        }
    }
    private onTouchArenaItem(event: egret.Event): void {
        var seletedItem: LocalArenaMatchItem = event.currentTarget as LocalArenaMatchItem;
        if (seletedItem.data) {
            var list = [{ text: "是否对玩家", style: {} },
            { text: seletedItem.data.playerData.name, style: { textColor: 0x28e828 } },
            { text: "发起挑战？", style: {} }];
            GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
                new WindowParam("AlertEscort", new AlertEscortParam(list, this.onSendArenaFightMsg, this, seletedItem.data))
            );
        }
    }
    private onSendArenaFightMsg(enemydata: ArenaEnemy): void {
        GameFight.getInstance().onSendLocalArenaFightMsg(enemydata.rank);
    }
    private onUpdateSweepRefresh(): void {
        this.onUpdateArenaCount();
    }
    private onUpdateArenaCount(): void {
        var arenaRankData: LocalArenaData = DataManager.getInstance().localArenaManager.localArenaData;
        this.left_fightnum_lab.text = arenaRankData.fightCount + ""; //TODO  chengy 考虑读表
        this.total_fightnum_lab.text = Constant.get('ARENA_FREE_TIMES');
    }
    private onBtnSaoDang(): void {
        var arenaRankData: LocalArenaData = DataManager.getInstance().localArenaManager.localArenaData;
        if (arenaRankData.fightCount <= 0) {
            GameCommon.getInstance().addAlert("error_tips_6");
            return;
        }
        var quitNotice = [{ text: '使用扫荡功能可快速消耗当前拥有的次数，获得竞技点奖励' }];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("AlertFrameUI", new AlertFrameParam(quitNotice, this.onSaoDangConfirm, this))
        );
    }
    private onSaoDangConfirm(): void {
        var arenaSweepMsg: Message = new Message(MESSAGE_ID.ARENA_BATTLE_SWEEP);
        GameCommon.getInstance().sendMsgToServer(arenaSweepMsg);
    }
    //购买次数
    private onTouchGetArenaNum(): void {
        var data: LocalArenaData = DataManager.getInstance().localArenaManager.localArenaData
        var cosumeparam: string[] = Constant.get(Constant.ARENA_FIGHT_BUY_PRICE).split(',');
        var cosumeGold: number = parseInt(data.buyCount < cosumeparam.length ? cosumeparam[data.buyCount] : cosumeparam[cosumeparam.length]);
        var list = [{ text: `是否消耗${cosumeGold}钻石购买一次挑战次数？`, style: {} }];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("AlertFrameUI", new AlertFrameParam(list, function (cosumeGold: number) {
                if (DataManager.getInstance().playerManager.player.gold < cosumeGold) {
                    GameCommon.getInstance().addAlert(GameErrorTip.getInstance().getGameErrorTip(2));
                    return;
                }
                var buyCountsMsg: Message = new Message(MESSAGE_ID.ARENE_BUY_FIGHTCOUNT_MESSAGE);
                GameCommon.getInstance().sendMsgToServer(buyCountsMsg);
            }, this, cosumeGold))
        );
    }
    //请求更换对手
    private onSendRefreshEnemyListMsg(): void {
        var refreshEnemyListMsg: Message = new Message(MESSAGE_ID.ARENE_REFRESH_ENEMYLIST_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(refreshEnemyListMsg);
    }
    //打开排行榜
    private onOpenArenaRankPanel(event: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "LocalArenaRankPanel");
    }
    //竞技商城
    private onOpenAraneShop(evnet: egret.Event): void {
        // var param = new ShopParam([SHOP_TYPE.RONGYU, SHOP_TYPE.ARENA], SHOP_TYPE.ARENA);
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "PvPShopPanel");
    }
    //打开战报面板
    private openArenaHistroyPanel(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "LocalArenaHistoryPanel");
    }
    //打开首次奖励面板
    private openFirstAwardPanel(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "LocalArenaFirstAwdPanel");
    }
    //The end
}
class LocalArenaMatchItem extends BaseComp {
    private role_group: eui.Group;
    private rank_label: eui.Label;
    private name_label: eui.Label;
    private power_label: eui.Label;
    private rank_bg: eui.Image;
    private roleAppear: RoleAppearBody;

    public constructor() {
        super();
    }
    protected setSkinName(): void {
        this.skinName = skins.LocalArenaMatchItemSkin;
    }
    protected onInit(): void {
        this.onDefault();
    }
    protected dataChanged(): void {
        if (this.data) {
            this.onUpdate();
        } else {
            this.onDefault();
        }
    }
    private onUpdate(): void {
        var appearData: AppearPlayerData = this.data.showAppear;
        if (!this.roleAppear) {
            this.roleAppear = new RoleAppearBody();
            this.role_group.addChild(this.roleAppear);
        } else {
            this.roleAppear.visible = true;
        }
        let appears: number[] = [];
        for (let i: number = 0; i < BLESS_TYPE.SIZE; i++) {
            appears[i] = appearData.appears[i];
        }
        this.roleAppear.updateAvatarAnim(appears, appearData.sex);

        this.name_label.text = this.data.playerData.name;
        this.power_label.text = this.data.playerData.fightvalue + "";//GameCommon.getInstance().getFormatNumberShow(data.playerData.fightvalue);
        this.rank_label.text = "第 " + this.data.rank + " 名";
        if (this.data.rank > 3) {
            this.rank_bg.source = "arena_rank_3_png";
        } else {
            this.rank_bg.source = "arena_rank_" + this.data.rank + "_png";
        }
    }
    private onDefault(): void {
        this.rank_label.text = ``;
        this.name_label.text = "虚席以待";
        this.power_label.text = "";
        if (this.roleAppear) {
            this.roleAppear.visible = false;
        }
    }
    //The end
}