class UnionBossFightPanel extends BaseSystemPanel {
	protected funcID: number = FUN_TYPE.FUN_GEREN_BOSS;
	protected points: redPoint[] = RedPointManager.createPoint(2);

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onInit(): void {
		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "UnionBossView";
		// param.btnRes = "mijing_title";
		param.btnRes = "秘境";
		param.funcID = FUN_TYPE.FUN_UNION_BOSS_FAM;
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().unionManager, "checkUnionBossDupPoint");
		sysQueue.push(param);

		var param = new RegisterSystemParam();
		param.sysName = "MysteriousBossSummonPannel";
		// param.btnRes = "shenmi_icon";
		param.btnRes = "召唤";
		param.funcID = FUN_TYPE.FUN_UNION_BOSS_SUMMON;
		param.redP = this.points[1];
		param.redP.addTriggerFuc(DataManager.getInstance().unionManager, "checkMyBossRedPoint");
		sysQueue.push(param);
		
		this.registerPage(sysQueue, "UnionBossFightGrp");
		super.onInit();
		this.onRefresh();
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	//关闭时打开帮会主城
	protected onTouchCloseBtn(): void {
		super.onTouchCloseBtn();
		this.onTouchBack();
	}
	//打开仙盟城市面板
	private onTouchBack(): void {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "UnionMainCityPanel");
	}
	protected onRefresh(): void {
		switch (this.index) {
			case 0:
				// this.setTitle("banghui_fight_png");
				this.setTitle("仙盟秘境");
				break;
			case 1:
				// this.setTitle("shenmi_boss_png");
				this.setTitle("仙盟召唤");
				break;
		}
		super.onRefresh();
	}

	public onShowWithParam(param): void {
		this.index = param;
		this.onShow();
	}
	//The end
}