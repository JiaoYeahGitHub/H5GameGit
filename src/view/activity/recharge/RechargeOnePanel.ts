class RechargeOnePanel extends BaseWindowPanel {
    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    private recharge_btn: eui.Button;
    private tips_mask: eui.Group;
    private goods_list: eui.Group;
    private viewmask:egret.Shape;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.RechargeOnePanelSkin;
    }
    protected onInit(): void {
        super.onInit();
        let oneRecharge_awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(Constant.get(Constant.YIYUANLIBAO));
        for (var i = 0; i < oneRecharge_awards.length; i++) {
            var goods = new GoodsInstance();
            goods.onUpdate(oneRecharge_awards[i].type, oneRecharge_awards[i].id, 0, 0, oneRecharge_awards[i].num);
            this.goods_list.addChild(goods);
        }
        this.viewmask = new egret.Shape();
        this.viewmask.graphics.clear();
        this.viewmask.graphics.beginFill(0, 0.6);

        this.viewmask.graphics.drawRect(-Globar_Pos.x, 0, this.stage.stageWidth, this.stage.stageHeight);
        this.viewmask.graphics.endFill();
		this.tips_mask.addChild(this.viewmask);
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.tips_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        this.recharge_btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRecharge, this);
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.onServerCallBack, this);
    }
    protected onRemove(): void {
        super.onRemove();
        this.tips_mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHide, this);
        this.recharge_btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtnRecharge, this);
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.RECHAREG_RECORD_MESSAGE.toString(), this.onServerCallBack, this);
    }
    private getPlayerData() {
        return DataManager.getInstance().playerManager.player;
    }

    private onServerCallBack() {
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CHECKACTIVITY_BTN));
        this.onHide();
    }
    protected onRefresh(): void {
        if (!DataManager.getInstance().rechargeManager.oneRecharge()) {
            this.onHide();
            GameCommon.getInstance().addAlert("您已购买过1元礼包，不可重复购买");
        }
    }

    private onTouchBtnRecharge() {
        var amount = 1;
        var goodsName = "一元礼包";
        SDKManager.pay(
            {
                goodsName: goodsName,
                amount: amount,
                playerInfo: DataManager.getInstance().playerManager.player
            },
            new BasePayContainer(this));
    }
}
