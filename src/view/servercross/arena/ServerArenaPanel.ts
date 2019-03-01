class ServerArenaPanel extends BaseTabView {
    private jingji_num_label: eui.Label;
    private fight_num_label: eui.BitmapLabel;
    private self_rank_label: eui.Label;
    private self_name_label: eui.Label;
    private lefttimes_lab: eui.Label;
    private get_num_label: eui.Label;
    private status_label: eui.Label;
    private arena_shop_btn: eui.Button;
    private worship_btn: eui.Button;
    private award_btn: eui.Button;
    private arena_rank_btn: eui.Button;
    private refresh_list_btn: eui.Button;
    private arena_rank_png: eui.Button;
    private self_head_icon: PlayerHeadUI;
    private lefttime_label: eui.Label;
    private explainLayer: eui.Group;
    private worship_awd_grp: eui.Group;
    private not_rank_lab: eui.Label;
    private explain_label: eui.Label;

    private explainStr: string;

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.ServerArenaPanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        GameCommon.getInstance().addUnderlineStr(this.explain_label);
        GameCommon.getInstance().addUnderlineGet(this.get_num_label);
        this.explainStr = Language.instance.getText('kuafujingjichang');
        this.explainStr = GameCommon.getInstance().readStringToHtml(this.explainStr);

        for (var i: number = 0; i < GameDefine.Arena_Enemy_Max; i++) {
            var arenaFigthItem: AraneMatchItem = this["arena_fightItem" + i] as AraneMatchItem;
        }
        let player: Player = DataManager.getInstance().playerManager.player;
        this.self_name_label.text = player.name;
        this.self_head_icon.setHead(player.headIndex, player.headFrameIndex);
        //膜拜奖励
        let mobaiAwards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(Constant.get(Constant.KUAFU_MOBAI));
        for (let n: number = 0; n < mobaiAwards.length; n++) {
            let goodsitem: GoodsInstance = GameCommon.getInstance().createGoodsIntance(mobaiAwards[n]);
            this.worship_awd_grp.addChild(goodsitem);
        }

        this.onTouchExplain();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.get_num_label.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGetArenaNum, this);
        this.arena_shop_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAraneShop, this);
        this.refresh_list_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendRefreshEnemyListMsg, this);
        this.worship_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWorship, this);
        this.award_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAwdShowPanel, this);
        this.explainLayer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        this.arena_rank_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenArenaRankPanel, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_CROSS_INFO_UPDATE_MESSAGE.toString(), this.onResArenaInfoUpdateMsg, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_CROSS_BUY_FIGHTCOUNT_MESSAGE.toString(), this.onUpdateArenaCount, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_CROSS_REFRESH_ENEMYLIST_MESSAGE.toString(), this.onUpdateEmenyList, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ARENE_CROSS_WORSHIP_MESSAGE.toString(), this.onupdateWorship, this);
        for (var i: number = 0; i < GameDefine.Arena_Enemy_Max; i++) {
            var arenaFigthItem: AraneMatchItem = this["arena_fightItem" + i] as AraneMatchItem;
            arenaFigthItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchArenaItem, this);
        }
    }
    protected onRemove(): void {
        super.onRemove();
        this.get_num_label.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGetArenaNum, this);
        this.refresh_list_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSendRefreshEnemyListMsg, this);
        this.arena_shop_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAraneShop, this);
        this.worship_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onWorship, this);
        this.award_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenAwdShowPanel, this);
        this.explainLayer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchExplain, this);
        this.arena_rank_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onOpenArenaRankPanel, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_CROSS_INFO_UPDATE_MESSAGE.toString(), this.onResArenaInfoUpdateMsg, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_CROSS_BUY_FIGHTCOUNT_MESSAGE.toString(), this.onUpdateArenaCount, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_CROSS_REFRESH_ENEMYLIST_MESSAGE.toString(), this.onUpdateEmenyList, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ARENE_CROSS_WORSHIP_MESSAGE.toString(), this.onupdateWorship, this);
        for (var i: number = 0; i < GameDefine.Arena_Enemy_Max; i++) {
            var arenaFigthItem: AraneMatchItem = this["arena_fightItem" + i] as AraneMatchItem;
            arenaFigthItem.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchArenaItem, this);
        }
        this.examineCD(false);
    }
    private onTouchExplain() {
        GameDispatcher.getInstance().dispatchEvent(
            new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("ExplainPanel", this.explainStr)
        );
    }
    protected onRefresh(): void {
        this.onSendArenaInfo();
    }
    private onSendArenaInfo(): void {
        var arenaInfoUpdateMsg: Message = new Message(MESSAGE_ID.ARENE_CROSS_INFO_UPDATE_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(arenaInfoUpdateMsg);
    }
    private onResArenaInfoUpdateMsg(): void {
        var arenaRankData: ArenaData = DataManager.getInstance().arenaManager.arenaData;
        this.currentState = arenaRankData.isOpen ? 'fight' : 'worship';
        if (arenaRankData.isOpen) {
            this.onUpdateArenaCount();
            this.status_label.text = '距离结束：';
        } else {
            this.status_label.text = '距离下赛季：';
            this.onupdateWorship();
        }
        if (arenaRankData.lefttime > 0) {
            this.examineCD(true);
        }
        if (arenaRankData.rank > 0) {
            this.self_rank_label.text = '' + arenaRankData.rank;
            this.not_rank_lab.visible = false;
        } else {
            this.self_rank_label.text = '';
            this.not_rank_lab.visible = true;
        }
        this.jingji_num_label.text = DataManager.getInstance().playerManager.player.shengwang + "";
        this.fight_num_label.text = DataManager.getInstance().playerManager.player.playerTotalPower + "";
        this.onUpdateEmenyList();
    }
    private onUpdateEmenyList(): void {
        var arenaRankData: ArenaData = DataManager.getInstance().arenaManager.arenaData;
        for (var i: number = 0; i < GameDefine.Arena_Enemy_Max; i++) {
            var enemyAraneData: ArenaEnemy = DataManager.getInstance().arenaManager.arenaData.enemyList[i];
            var arenaFigthItem: AraneMatchItem = this["arena_fightItem" + i] as AraneMatchItem;
            arenaFigthItem.data = enemyAraneData;
        }
    }
    private onTouchArenaItem(event: egret.Event): void {
        if (!DataManager.getInstance().arenaManager.arenaData.isOpen) {
            return;
        }
        var seletedItem: AraneMatchItem = event.currentTarget as AraneMatchItem;
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
        GameFight.getInstance().onSendArenaFightMsg(enemydata.rank);
    }
    private onUpdateArenaCount(): void {
        var arenaRankData: ArenaData = DataManager.getInstance().arenaManager.arenaData;
        this.lefttimes_lab.text = arenaRankData.isOpen ? arenaRankData.fightCount + "/" + Constant.get(Constant.KUAFU_FIGHT_NUM) : "";
    }
    //购买次数
    private onTouchGetArenaNum(): void {
        var data: ArenaData = DataManager.getInstance().arenaManager.arenaData;
        if (!data.isOpen) {
            return;
        }
        var cosumeparam: string[] = Constant.get(Constant.KUAFU_FIGHT_BUY_PRICE).split(',');
        var cosumeGold: number = parseInt(data.buyCount < cosumeparam.length ? cosumeparam[data.buyCount] : cosumeparam[cosumeparam.length - 1]);
        var list = [{ text: `是否消耗${cosumeGold}钻石购买一次挑战次数？`, style: {} }];
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM),
            new WindowParam("AlertFrameUI", new AlertFrameParam(list, function (cosumeGold: number) {
                if (DataManager.getInstance().playerManager.player.gold < cosumeGold) {
                    GameCommon.getInstance().addAlert(GameErrorTip.getInstance().getGameErrorTip(2));
                    return;
                }
                var buyCountsMsg: Message = new Message(MESSAGE_ID.ARENE_CROSS_BUY_FIGHTCOUNT_MESSAGE);
                GameCommon.getInstance().sendMsgToServer(buyCountsMsg);
            }, this, cosumeGold))
        );
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
        var leftime: number = Math.ceil((DataManager.getInstance().arenaManager.arenaData.lefttime - egret.getTimer()) / 1000);
        if (leftime > 0) {
        } else {
            leftime = 0;
            this.examineCD(false);
            Tool.callbackTime(this.onSendArenaInfo, this, 5000);
        }
        this.lefttime_label.text = GameCommon.getInstance().getTimeStrForSec1(leftime);
    }
    //请求更换对手
    private onSendRefreshEnemyListMsg(): void {
        var refreshEnemyListMsg: Message = new Message(MESSAGE_ID.ARENE_CROSS_REFRESH_ENEMYLIST_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(refreshEnemyListMsg);
    }
    //竞技商城
    private onOpenAraneShop(evnet: egret.Event): void {
        // ShopDefine.openServerArenaShop();
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "PvPShopPanel");
    }
    //打开奖励面版
    private onOpenAwdShowPanel(): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "ServerArenaAwdPanel");
    }
    //打开排行榜
    private onOpenArenaRankPanel(event: egret.Event): void {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "AraneRankPanel");
    }
    //更新膜拜状态
    private onupdateWorship(): void {
        if (DataManager.getInstance().arenaManager.isWorship) {
            this.worship_btn.enabled = false;
            this.worship_btn.label = Language.instance.getText("yimobai");
        } else {
            this.worship_btn.enabled = true;
            this.worship_btn.label = Language.instance.getText("mobai");
        }
    }
    //进行膜拜
    private onWorship(): void {
        let worshipMsg: Message = new Message(MESSAGE_ID.ARENE_CROSS_WORSHIP_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(worshipMsg);
    }
    //The end
}
class AraneMatchItem extends BaseComp {
    private role_group: eui.Group;
    private rank_label: eui.Label;
    private name_label: eui.Label;
    private power_label: eui.Label;
    private roleAppear: RoleAppearBody;

    public constructor() {
        super();
    }
    protected setSkinName(): void {
        this.skinName = skins.AraneMatchItemSkin;
    }
    protected onInit(): void {
        if (!this._data) {
            this.dataChanged();
        }
    }
    protected dataChanged(): void {
        if (this._data) {
            var appearData: AppearPlayerData = this._data.showAppear;
            if (!this.roleAppear) {
                this.roleAppear = new RoleAppearBody();
            }
            if (!this.roleAppear.parent) {
                this.role_group.addChild(this.roleAppear);
            }
            let appears: number[] = [];
            for (let i: number = 0; i < BLESS_TYPE.SIZE; i++) {
                appears[i] = appearData.appears[i];
            }
            this.roleAppear.updateAvatarAnim(appears, appearData.sex);

            this.name_label.text = this._data.playerData.name;
            this.power_label.text = "" + this._data.playerData.fightvalue;
            this.rank_label.text = "第 " + this._data.rank + " 名";
        } else {
            this.rank_label.text = ``;
            this.name_label.text = "虚席以待";
            this.power_label.text = "";
            if (this.roleAppear && this.roleAppear.parent) {
                this.roleAppear.parent.removeChild(this.roleAppear);
            }
        }
    }
    //The end
}