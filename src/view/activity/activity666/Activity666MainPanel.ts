class Activity666MainPanel extends BaseSystemPanel {
	protected points: redPoint[] = RedPointManager.createPoint(2);

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "Activity666Panel";
		param.btnRes = "z_shenqi2_icon";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().a666Manager, "checkRedPoint");
		sysQueue.push(param);
		
		let paramDH = new RegisterSystemParam();
		paramDH.sysName = "ActivityXLDHPanel";
		paramDH.btnRes = "z_dh_icon";
		paramDH.redP = this.points[1];
		paramDH.redP.addTriggerFuc(DataManager.getInstance().a666Manager, "checkRedDHPointAll");
		sysQueue.push(paramDH);
		
		let paramRank = new RegisterSystemParam();
		paramRank.sysName = "Activity666RankPanel";
		paramRank.btnRes = "z_666_rank_icon";
		//paramRank.redP = this.points[1];
		//paramRank.redP.addTriggerFuc(DataManager.getInstance().a666Manager, "checkRedDHPointAll");
		sysQueue.push(paramRank);

		this.registerPage(sysQueue, "activity666mainGrp", GameDefine.RED_TAB_POS);
		super.onInit();
		this.onRefresh();
	}
	protected onRefresh(): void {
		switch(this.index){
			case 0:
				this.setTitle("z_shenqi2_title_png");
				break;
			case 1:
				this.setTitle("z_dh_title_png");
				break;
			case 2:
				this.setTitle("z_666_rank_title_png");
				break;
			
		}
		super.onRefresh();
	}
}