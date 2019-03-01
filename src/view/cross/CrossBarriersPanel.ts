class CrossBarriersPanel extends BaseSystemPanel {
	protected funcID: number = FUN_TYPE.FUN_GEREN_BOSS;
	protected points: redPoint[] = RedPointManager.createPoint(3);

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onInit(): void {
		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "PersonallyBossView";
		param.btnRes = "个人";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(FunDefine, "getGerenBossRedPoint");
		param.funcID = FUN_TYPE.FUN_GEREN_BOSS;
		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "AllPeopleBossView";
		param.btnRes = "全民";
		param.redP = this.points[1];
		param.redP.addTriggerFuc(FunDefine, "getAllPeopleBossRedPoint");
		param.funcID = FUN_TYPE.FUN_QUANMIN_BOSS;
		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "XuezhanBossView";
		param.btnRes = "血战";
		param.funcID = FUN_TYPE.FUN_XUEZHANBOSS;
		sysQueue.push(param);

		if (!SDKManager.isHidePay) {
			param = new RegisterSystemParam();
			param.sysName = "VIPTeamBossView";
			param.btnRes = "仙尊";
			param.title = '仙尊';
			param.funcID = FUN_TYPE.FUN_VIPTEAM;
			sysQueue.push(param);
		}

		param = new RegisterSystemParam();
		param.sysName = "SamsaraBossView";
		param.btnRes = "转生";
		param.title = '转生';
		param.redP = this.points[2];
		param.redP.addTriggerFuc(FunDefine, "getSamsaraBossBackAwdRPoint");
		param.funcID = FUN_TYPE.FUN_ZHUANSHENG_BOSS;
		sysQueue.push(param);

		this.registerPage(sysQueue, "crossGrp");
		super.onInit();
		this.onRefresh();
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onRefresh(): void {
		switch (this.index) {
			case 0:
				this.setTitle("个人BOSS");
				break;
			case 1:
				this.setTitle("全民BOSS");
				break;
			case 2:
				this.setTitle("血战BOSS");
				break;
			case 3:
				this.setTitle("仙尊BOSS");
				break;
			case 4:
				this.setTitle("转生BOSS");
				break;
		}
		super.onRefresh();
	}
	//The end
}