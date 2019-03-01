class SmeltPanel extends BaseSystemPanel {
    public static isClear: boolean = true;
    protected funcID: number = FUN_TYPE.FUN_EQUIP_SMELT;
    protected isActivity: boolean = true;

    public priority: PANEL_HIERARCHY_TYPE = PANEL_HIERARCHY_TYPE.II;

    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.PanelSkinActivity;
    }
    protected onInit(): void {
        this['basic']['tabBtnsBar']['nextImg'].visible = false;
        this['basic']['tabBtnsBar']['preImg'].visible = false;
        (<eui.HorizontalLayout>this['basic']['tabBtnsBar']['btnGroup'].layout).gap = 30;

        super.onInit();
        this.onRefresh();
    }
    protected onInitRegistPage(): void {
        super.onInitRegistPage();
        this.points = [];
        var sysQueue = [];
        // 锻造 二级菜单结构体
        var param = new RegisterSystemParam();
        param.redP = this.createRedPoint();
        param.tabBtns = [];// 三级菜单结构体数组

        let pItem: RegisterTabBtnParam = new RegisterTabBtnParam();
        pItem.sysName = "SmeltEquipPanel";
        pItem.funcID = FUN_TYPE.FUN_EQUIP_SMELT;
        pItem.tabBtnRes = "icon_zhuangbeihuishou_png";
        pItem.title = "元宝回收";
        pItem.redP = this.createRedPoint();
        pItem.redP.addTriggerFuc(DataManager.getInstance().bagManager, "getEquipSmeltPointShow");
        param.tabBtns.push(pItem);

        if (this.oncheckSmeltActOpen()) {
            pItem = new RegisterTabBtnParam();
            pItem.sysName = "SmeltActPanel";
            pItem.funcID = FUN_TYPE.FUN_BLESS_SMELT;
            pItem.tabBtnRes = "icon_xianshihuishou_png";
            pItem.title = "超值兑换";
            pItem.redP = this.createRedPoint();
            pItem.redP.addTriggerFuc(DataManager.getInstance().activitySmeltManager, "getSmeltPoint");
            param.tabBtns.push(pItem);
        }

        sysQueue.push(param);

        this.registerPage(sysQueue, "smeltGrp", new egret.Point(120, -10));
    }
    private _hasSmeltActItem: boolean = true;
    private oncheckSmeltActOpen(): boolean {
        if (DataManager.getInstance().activityManager.getActIsOpen(ACTIVITY_BRANCH_TYPE.ACT_RONGLIAN)) {
            return true;
        }
        if (!this._hasSmeltActItem) return false;
        let models = JsonModelManager.instance.getModelkaifuduihuan();
        for (let id in models) {
            let model: Modelkaifuduihuan = models[id];
            let cost: AwardItem = GameCommon.parseAwardItem(model.firstRewards);
            let hasNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(cost.id, cost.type);
            if (hasNum > 0) {
                return true;
            }
            cost = GameCommon.parseAwardItem(model.otherRewards);
            hasNum = DataManager.getInstance().bagManager.getGoodsThingNumById(cost.id, cost.type);
            if (hasNum > 0) {
                return true;
            }
        }
        this._hasSmeltActItem = false;
        return false;
    }
    protected onRegist(): void {
        super.onRegist();
    }
    protected onRemove(): void {
        super.onRemove();
    }
    protected onRefresh(): void {
        SmeltPanel.isClear = true;
        super.onRefresh();
    }
}