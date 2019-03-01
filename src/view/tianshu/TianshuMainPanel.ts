class TianshuMainPanel extends BaseSystemPanel {
	protected funcID: number = FUN_TYPE.FUN_TIANSHU;

	protected points: redPoint[] = RedPointManager.createPoint(2);
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "TianshuLevelUpPanel";
		param.btnRes = "tianshu_tabicon";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().playerManager, "oncheckRPTianshuLevel");
		sysQueue.push(param);

		var param = new RegisterSystemParam();
		param.sysName = "TianshuUpgradePanel";
		param.btnRes = "tianshu_tab2_icon";
		param.funcID = FUN_TYPE.FUN_TIANSHU_TUPO;
		param.redP = this.points[1];
		param.redP.addTriggerFuc(DataManager.getInstance().playerManager, "oncheckRPTianshuGrade");
		sysQueue.push(param);

		this.registerPage(sysQueue, "tianshuGroup", GameDefine.RED_TAB_POS);

		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		switch (this.index) {
			case 0:
				this.setTitle("tianshu_title_png");
				break;
		}
		super.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
	}
	public onShowWithParam(param): void {
		super.onShowWithParam(param);
	}
	//The end
}