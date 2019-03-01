class OtherjingmaiPanel extends BaseTabView {
    private powerbar: PowerBar;
    private role_list_bar: RoleSelectBar;
    private label_currTeir: eui.Label;
    private currLayer: eui.Group;
    private nextLayer: eui.Group;
    private currency: CurrencyBar;
    private btn_advance: eui.Button;
    private onebuyBtn: eui.Button;
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.PulsePanelSkin;
    }
    protected onInit(): void {
        this.onebuyBtn.visible = false;
        this.btn_advance.visible = false;
        this.currency.visible = false;
        this.role_list_bar.registFuncBack(this.onChangeRole, this);
        var progress: PulseProgress;
        for (var i: number = 0; i < 9; i++) {
            progress = this[`acupoint${i}`] as PulseProgress;
            progress.index = i;
        }

        super.onInit();
        this.onRefresh();
    }
    public onShow(): void {
        super.onShow();
    }
    protected onRefresh(): void {
        var others: Otherplayer[] = DataManager.getInstance().topRankManager.otherindexdate().Otherplayerarr;
        var role_occps: number[] = [];
        for (var i: number = 0; i < others.length; i++) {
            role_occps.push(others[i].occupation);
        }
        if (this.role_list_bar) {
            this.role_list_bar.registOtherBar(role_occps);
        }
        var lv: number = DataManager.getInstance().topRankManager.otherindexdate().Otherplayerarr[this.role_list_bar.index].jingmailv;
        var model: Modeljingmai = JsonModelManager.instance.getModeljingmai()[lv + 1];
        var modeled: Modeljingmai = JsonModelManager.instance.getModeljingmai()[lv + 2];
        var currModel: Modeljingmai = model || modeled;
        if (modeled) {
            currModel = modeled;
        }
        this.label_currTeir.text = `${model.jieduan}阶`;

        var item: suitAttributeItem;
        this.currLayer.removeChildren();
        this.nextLayer.removeChildren();
        var add: number = 0;
        for (var key in currModel.attrAry) {
            if (currModel.attrAry[key] > 0) {
                item = new suitAttributeItem();
                add = model ? model.attrAry[key] : 0;
                item.data = [GameDefine.Attr_Name[key] + ":", "+" + add, 0];
                this.currLayer.addChild(item);
                item = new suitAttributeItem();
                add = modeled ? modeled.attrAry[key] : 0;
                item.data = [GameDefine.Attr_Name[key] + ":", "+" + add, add];
                this.nextLayer.addChild(item);
            }
        }
        var progress: PulseProgress;
        for (var i: number = 0; i < 9; i++) {
            progress = this[`acupoint${i}`] as PulseProgress;
            progress.data = lv % 9;
            // progress.play();
        }
        if (modeled && modeled.cost.num == 0) {
            this.btn_advance.label = "免费升阶";
        } else {
            this.btn_advance.label = "提升";
        }
        this.onUpdatePlayerPower();
        this.updateConsItem();
    }
    // private adjustBar() {
    //     GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_REDPOINT_TRIGGER), new redPointTrigger(RADPOINT_TYPE.ITEM, "pulse"));
    // }
    //更新人物战斗力
    private onUpdatePlayerPower(): void {
        // this.powerbar.power = 
        var model: Modeljingmai = JsonModelManager.instance.getModeljingmai()[DataManager.getInstance().topRankManager.otherindexdate().Otherplayerarr[this.role_list_bar.index].jingmailv];
        this.powerbar.power = String(model ? GameCommon.calculationFighting(model.attrAry) : 0);//DataManager.getInstance().pulseManager.pulsePower + "";
    }
    private cost;
    private updateConsItem() {
        var lv: number = DataManager.getInstance().topRankManager.otherindexdate().Otherplayerarr[this.role_list_bar.index].jingmailv;;
        var modeled: Modeljingmai = JsonModelManager.instance.getModeljingmai()[lv + 2];
        if (modeled) {
            // this.currency.data = new CurrencyParam("", new ThingBase(modeled.cost.type, modeled.cost.id, modeled.cost.num), false);
        } else {
            //  this.currency.visible = false;
        }
    }
    protected onRegist(): void {
        super.onRegist();
        //  this.btn_advance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAdvance, this);
        // GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_PULSE_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
        // GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.updateGoodsADD, this);
        // GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_REDPOINT_TRIGGER), new redPointTrigger(RADPOINT_TYPE.ITEM, "pulse"));
    }
    protected onRemove(): void {
        super.onRemove();
        // this.btn_advance.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnAdvance, this);
        //  GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_PULSE_UPGRADE_MESSAGE.toString(), this.onRefresh, this);
        // GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.updateGoodsADD, this);
    }
    private updateGoodsADD() {
        this.updateConsItem();
        this.onUpdatePlayerPower();
    }
    private onTouchBtnAdvance() {
        // if (!GameCommon.getInstance().onCheckItemConsume(0, this.cost, GOODS_TYPE.PULSE)) {
        //     return;
        // }
        var message = new Message(MESSAGE_ID.PLAYER_PULSE_UPGRADE_MESSAGE);
        message.setByte(this.role_list_bar.index);
        GameCommon.getInstance().sendMsgToServer(message);
    }
    //切换角色
    public onChangeRole(): void {
        this.onRefresh();
    }
    private getPlayerData(): PlayerData {
        return DataManager.getInstance().playerManager.player.getPlayerData(this.role_list_bar.index);
    }
}
