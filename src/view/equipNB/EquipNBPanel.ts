class EquipNBPanel extends BaseSystemPanel {
    protected funcID: number = FUN_TYPE.FUN_HONGZHUANG;
    private param;
    private time: egret.Timer;
    private _isReset: boolean = false;

    protected points: redPoint[] = RedPointManager.createPoint(4);
    public constructor(owner) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.BasicSkin;
    }
    protected onInit(): void {
        var sysQueue = [];
        var param = new RegisterSystemParam();
        param.sysName = "TreasurePanel";
        param.btnRes = "套装宝库";
        param.funcID = FUN_TYPE.FUN_LOTTERY;
        param.redP = this.points[0];
        param.redP.addTriggerFuc(DataManager.getInstance().celestialManager, "checkTreasurePoint");
        sysQueue.push(param);

        param = new RegisterSystemParam();
        param.sysName = "OrangePanel";
        param.btnRes = "诛仙套装";
        param.funcID = FUN_TYPE.FUN_HONGZHUANG;
        param.redP = this.points[1];
        param.redP.addTriggerFuc(DataManager.getInstance().celestialManager, "checkOrangeEquipPoint");
        sysQueue.push(param);

        param = new RegisterSystemParam();
        param.sysName = "DomUpgradePanel";
        param.btnRes = "上古套装";
        param.funcID = FUN_TYPE.FUN_SHANGGU;
        param.redP = this.points[2];
        param.redP.addTriggerFuc(DataManager.getInstance().dominateManager, "checkDomPoint");
        sysQueue.push(param);

        param = new RegisterSystemParam();
        param.sysName = "CelestialPanel";
        param.btnRes = "伏魔套装";
        param.funcID = FUN_TYPE.FUN_ANJIN;
        param.redP = this.points[3];
        param.redP.addTriggerFuc(DataManager.getInstance().celestialManager, "checkCelestiaPoint");
        sysQueue.push(param);

        // param = new RegisterSystemParam();
        // param.sysName = "EquipDepotPanel";
        // param.btnRes = "仓库";
        // param.redP = this.points[4];
        // param.redP.addTriggerFuc(DataManager.getInstance().celestialManager, "checkDepotPoint");
        // sysQueue.push(param);

        this.registerPage(sysQueue, "equipNBGrp", GameDefine.RED_TAB_POS);

        // var img: eui.Image = new eui.Image();
        // img.source = "activity_chongbang_png";
        // this.basic["tipsLayer"].visible = false;
        // this.basic["tipsLayer"].addChild(img);

        super.onInit();
        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
        this.checkActivity();
    }
    protected onRemove(): void {
        super.onRemove();
    }
    protected onRefresh(): void {
        switch (this.index) {
            case 0:
                this.setTitle("套装宝库");
                break;
            case 1:
                this.setTitle("诛仙套装");
                break;
            case 2:
                this.setTitle("上古套装");
                break;
            case 3:
                this.setTitle("附魔套装");
                break;
            case 4:
                this.setTitle("仓库");
                break;
        }
        super.onRefresh();
        this.checkActivity();
    }
    private checkActivity() {
        var model: Modeldabiaorewards = DataManager.getInstance().newactivitysManager.dabiao_model;
        if (model) {
            if (model.type == 10 && this.tabs[1].enabled == true) {
                this.basic["tipsLayer"].visible = true;
                this.basic["tipsLayer"].x = 101;
            } else {
                this.basic["tipsLayer"].visible = false;
            }
        }
    }
    public onHide(): void {
        super.onHide();
    }
    //The end
}