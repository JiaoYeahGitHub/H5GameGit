// TypeScript file
class BagPanel extends BaseSystemPanel {
    private EquipTab: string = "tabBtn_equip";
    private ServantEquipTab: string = "tabBtn_servant";
    private ItemTab: string = "tabBtn_item";
    private BoxTab: string = "tabBtn_box";
    private GemTab: string = "tabBtn_gem";
    private BagColNum: number = 5;

    private bag_Scroller: eui.Scroller;
    private bag_groud: eui.Group;
    private tabBtn_equip: eui.ToggleButton;
    private tabBtn_servant: eui.ToggleButton;
    private tabBtn_item: eui.ToggleButton;
    private tabBtn_box: eui.ToggleButton;
    private btn_ronglian: eui.Button;
    private capacityGroup: eui.Group;
    private currNum: eui.Label;
    private maxNum: eui.Label;

    private _curSelectTab: string;
    private box_point: eui.Image;
    protected points: redPoint[] = RedPointManager.createPoint(2);
    public constructor(owner: ModuleLayer) {
        super(owner);
        // this.cacheGoodsInstance = [];
    }
    protected onSkinName(): void {
        this.skinName = skins.BasicSkin;
    }
    protected onInit(): void {
        var sysQueue = [];
        var param = new RegisterSystemParam();
        param.sysName = "BagTypePanel";
        param.funcID = FUN_TYPE.FUN_EQUIPBAG;
        param.btnRes = "装备";
        param.redP = this.points[0];
        param.redP.addTriggerFuc(DataManager.getInstance().bagManager, "getEquipSmeltPointShow");
        sysQueue.push(param);

        param = new RegisterSystemParam();
        param.sysName = "BagTypePanel";
        param.funcID = FUN_TYPE.FUN_ITEMBAG;
        param.btnRes = "物品";
        param.redP = this.points[1];
        param.redP.addTriggerFuc(DataManager.getInstance().bagManager, "getItemCanUsePointShow");
        sysQueue.push(param);

        // param = new RegisterSystemParam();
        // param.sysName = "BagTypePanel";
        // param.btnRes = "战纹";
        // param.redP = this.points[2];
        // param.redP.addTriggerFuc(DataManager.getInstance().bagManager, "getRnuesPoint");
        // sysQueue.push(param);

        this.setTitle("背包");
        this.registerPage(sysQueue, "bagGrp", GameDefine.RED_TAB_POS);
        super.onInit();

        this.onRefresh();
    }
    protected onRegist(): void {
        super.onRegist();
    }
    protected onRemove(): void {
        super.onRemove();
    }
    //The end
}
