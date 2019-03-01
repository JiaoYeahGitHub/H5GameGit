class ZhuXianBossMain extends  BaseSystemPanel {
	protected points: redPoint[] = RedPointManager.createPoint(1);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
		this.setTitle("z_peishizhuxian_png");
	}
	protected onInit(): void {
		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "ZhuXianBossPanel";
		param.btnRes = "peishizhuxian_btn";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(FunDefine, "DupZhuXianBossTimes");
		sysQueue.push(param);
		this.registerPage(sysQueue, "zhuxianbossGrp", GameDefine.RED_TAB_POS);
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
	}
}