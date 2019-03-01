class HallActivityPanel extends BaseSystemPanel {
    protected modelGroup: ModelactivityGroup = JsonModelManager.instance.getModelactivityGroup()[ACTIVITY_TYPE.ACTIVITY_HALL];

    protected activityIds: number[] = GameCommon.parseIntArray(this.modelGroup.activityId);
    private activityIdNow: number[] = [];
    private params: RegisterTabBtnParam[] = [];
    private curIdx: number = 0;
    protected isActivity: boolean = true;

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.PanelSkinActivity;
    }
    protected onInit(): void {
        super.onInit();
        this.setTabsJianTou(false);
        this.register();
        this.onRefresh();
    }
    protected register(): void {
        var sysQueue = [];
        var id;
        var activity: Modelactivity;
        this.activityIdNow = [];
        var paramT: RegisterSystemParam = new RegisterSystemParam();
        paramT.redP = this.createRedPoint();
        for (var i: number = 0; i < this.activityIds.length; i++) {
            id = this.activityIds[i];
            var param: RegisterTabBtnParam = DataManager.getInstance().activityManager.getRegisterTabBtnParam(id);
            if (param) {
                this.params.push(param);
                param.redP = this.createRedPoint();
                // param.redP.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPointByID", ActivityManager.openQueue[ACTIVITY_OPEN_TYPE.FULIDATING][i]);
                if (param.sysName == 'ActivitysXianFengPanel') {
                    param.funcID = FUN_TYPE.FUN_XIANFENG;
                }
                param.redP.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPointByID", this.activityIds[i]);
                this.activityIdNow.push(id);
            } else {
                egret.log("无效的ActivityId：" + id);
            }
        }
        paramT.tabBtns = this.params;
        sysQueue.push(paramT);
        this.registerPage(sysQueue, "hallGrp", GameDefine.RED_TAB_POS);
    }

    protected onRegist(): void {
        super.onRegist();
        GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.refreshWhenDelActivity, this);
        GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CHECKACTIVITY_BTN, this.refreshWhenDelActivity, this);
        GameDispatcher.getInstance().addEventListener("delActivity", this.refreshWhenDelActivity, this);
    }
    protected onRemove(): void {
        super.onRemove();
        GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.refreshWhenDelActivity, this);
        GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CHECKACTIVITY_BTN, this.refreshWhenDelActivity, this);
        GameDispatcher.getInstance().removeEventListener("delActivity", this.refreshWhenDelActivity, this);
    }
    protected onRefresh(): void {
        // this.setTitle(this.params[this.index].title);
        this.refreshWhenDelActivity();
        super.onRefresh();
    }

    private refreshWhenDelActivity() {
        for (var i: number = 0; i < this.activityIdNow.length; i++) {
            if (DataManager.getInstance().activityManager.getRegisterSystemParam(this.activityIdNow[i])) {
                continue;
            } else {
                this.register();
            }
        }
    }
    public onTimeOut(): void {
        this.register();
    }

}