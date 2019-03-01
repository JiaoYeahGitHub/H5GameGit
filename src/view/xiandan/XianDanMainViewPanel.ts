class XianDanMainViewPanel extends BaseSystemPanel {
	protected points: redPoint[] = RedPointManager.createPoint(5);
    protected tabs = {};
	protected tabFs = {};
	private tabNum:number = 0;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
		// this.setTitle("titleLegend_png");
		// this.setBg("legendBg_jpg");
		// this.setTitle("shengwu_xianyu_title_png");
	}
	protected onInit(): void {
		this.setTitle("xianshanTitle_png");
		var sysQueue = [];
		var param  = new RegisterSystemParam();

			param.sysName = "XianDanDupPanel";
			param.btnRes = "仙山";
			param.redP = this.points[0];
			param.redP.addTriggerFuc(DataManager.getInstance().xiandanManager, "getXianShanPoint");
			sysQueue.push(param);

			param = new RegisterSystemParam();
			param.sysName = "XianDanTabView";
			param.btnRes = "少阴丹";
			param.redP = this.points[1];
			param.redP.addTriggerFuc(DataManager.getInstance().xiandanManager, "getXianDanPoint", 1);
			sysQueue.push(param);

			param = new RegisterSystemParam();
			param.sysName = "XianDanTabView";
			param.btnRes = "少阳丹";
			param.redP = this.points[2];
			param.redP.addTriggerFuc(DataManager.getInstance().xiandanManager, "getXianDanPoint", 2);
			sysQueue.push(param);

			param = new RegisterSystemParam();
			param.sysName = "XianDanTabView";
			param.btnRes = "老阴丹";
			param.redP = this.points[3];
			param.redP.addTriggerFuc(DataManager.getInstance().xiandanManager, "getXianDanPoint", 3);
			sysQueue.push(param);

			param = new RegisterSystemParam();
			param.sysName = "XianDanTabView";
			param.btnRes = "老阳丹";
			param.redP = this.points[4];
			param.redP.addTriggerFuc(DataManager.getInstance().xiandanManager, "getXianDanPoint", 4);
			sysQueue.push(param);
		this.registerPage(sysQueue, "XianDanGrp", GameDefine.RED_TAB_POS);
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
		if(this.index  >0)
		{
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.XIANDAN_TAB_REFRESH),this.index)
		}
	}
}