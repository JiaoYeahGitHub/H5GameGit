// TypeScript file
class TOPRankingList extends BaseSystemPanel {
    protected funcID: number = FUN_TYPE.FUN_TOPRANK;
    private rankTab: string = "tabBtn_rank";

    private _curSelectTab: string;
    private box_point: eui.Image;
    public constructor(owner: ModuleLayer) {
        super(owner);
    }
    protected onSkinName(): void {
        this.skinName = skins.BasicSkin;
    }
    protected onInit(): void {
        var sysQueue = [];
        this.basic['bgDi'].visible = false;
        var param = new RegisterSystemParam();
        param.sysName = "TOPRankTypeListPanel";
        param.btnRes = "排行";
        sysQueue.push(param);
        this.setTitle("排行榜");
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
