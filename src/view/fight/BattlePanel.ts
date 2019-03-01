class BattlePanel extends BaseSystemPanel {
	protected points: redPoint[] = RedPointManager.createPoint(1);
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onInit(): void {
		this.setTitle("arena_title_png");

		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "LadderArenaPanel";
		param.btnRes = "arena_tab_png";
		DataManager.getInstance().arenaManager
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().arenaManager, "getLadderPointShow");
		sysQueue.push(param);

		this.registerPage(sysQueue, "battleGrp", GameDefine.RED_TAB_POS);
		super.onInit();
		this.onRefresh();
	}
	protected onSkinName(): void {
		// this.skinName = skins.BattlePanelSkin;
	}
	protected onRefresh(): void {
		super.onRefresh();
	}
	//The end
}