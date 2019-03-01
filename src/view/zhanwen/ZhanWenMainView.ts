class ZhanWenMainView extends BaseSystemPanel {
	protected points: redPoint[] = RedPointManager.createPoint(3);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
		this.setTitle("zhanwen_Title_png");
	}
	protected onInit(): void {
		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "ZhanWenViewPanel";
		param.btnRes = "zhanwen_btn";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().bagManager, "checkAllEquipPointPoint");
		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "ZhanWenComposePanel";
		param.btnRes = "zhanwen_hecheng";
		param.redP = this.points[1];
		param.redP.addTriggerFuc(DataManager.getInstance().bagManager, "getRnuesLvPoint");
		sysQueue.push(param);

		
		this.registerPage(sysQueue, "zhanwenGrp", GameDefine.RED_TAB_POS);
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
		// switch (this.index) {
		// 	case 0:
		// 		this.setTitle("smelt_special_title_png");
		// 		break;
		// 	case 1:
		// 		this.setTitle("smelt_special_title_png");
		// 		break;
		// }
		super.onRefresh();
	}
}