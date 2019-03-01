class YuanJieMainPanel extends  BaseSystemPanel {
	protected points: redPoint[] = RedPointManager.createPoint(1);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		this.setTitle("yuanjie_title_png");
		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "YuanJiePanel";
		param.btnRes = "yuanjie_btn_2";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().yuanjieManager, "checkRedPoint");
		sysQueue.push(param);
		// if(DataManager.getInstance().playerManager.player.level>=JsonModelManager.instance.getModelfunctionLv()[110].level)
		// {
		// 	param = new RegisterSystemParam();
		// 	param.sysName = "FuLingDupPanel";
		// 	param.btnRes = "fumozhuxiang_btn";
		// 	param.redP = this.points[1];
		// 	param.redP.addTriggerFuc(FunDefine, "DupFulingbossPoint");
		// 	sysQueue.push(param);
		// }
		

		this.registerPage(sysQueue, "yuanjiemainGrp", GameDefine.RED_TAB_POS);
		super.onInit();
		this.onRefresh();
	}
	// protected onRegist(): void {
	// 	super.onRegist();
	// }
	// protected onRemove(): void {
	// 	super.onRemove();
	// }
	// protected onRefresh(): void {
	// 	super.onRefresh();
	// 	// switch (this.index) {
	// 	// 	case 0:
	// 	// 		this.setTitle("yuanjie_title_png");
	// 	// 		break;
	// 	// 	case 1:
	// 	// 		this.setTitle("");
	// 	// 		break;
	// 	// }
	// }
}