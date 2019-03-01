class FuLingMainViewPanel extends  BaseSystemPanel {
	protected points: redPoint[] = RedPointManager.createPoint(2);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
		this.setTitle("title_fumo_png");
	}
	protected onInit(): void {
		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "FuLingViewPanel";
		param.btnRes = "icon_fumo";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().fuLingManager, "getFulingDanPoint");
		sysQueue.push(param);
		if(DataManager.getInstance().playerManager.player.level>=JsonModelManager.instance.getModelfunctionLv()[95].level)
		{
			param = new RegisterSystemParam();
			param.sysName = "FuLingDupPanel";
			param.btnRes = "fumozhuxiang_btn";
			param.redP = this.points[1];
			param.redP.addTriggerFuc(FunDefine, "DupFulingbossPoint");
			sysQueue.push(param);
		}
		

		this.registerPage(sysQueue, "fulingmainviewGrp", GameDefine.RED_TAB_POS);
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
	}
	protected onRefresh(): void {
		super.onRefresh();
		switch (this.index) {
			case 0:
				this.setTitle("title_fumo_png");
				break;
			case 1:
				this.setTitle("z_fulingzhuxian_png");
				break;
		}
	}
}