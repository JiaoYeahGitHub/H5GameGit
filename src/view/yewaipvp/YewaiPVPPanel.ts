class YewaiPVPPanel extends BaseSystemPanel {
	protected funcID: number = FUN_TYPE.FUN_YEWAIPVP;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onInit(): void {
		let sysQueue = [];
		let pItem: RegisterTabBtnParam;
		let param: RegisterSystemParam;
		// 战绩
		param = new RegisterSystemParam();
		param.sysName = "RecordPVPPanel";
		param.btnRes = "战绩";
		param.funcID = FUN_TYPE.FUN_ZHANGONG_RECORD;
		sysQueue.push(param);

		//战场
		param = new RegisterSystemParam();
		param.btnRes = "战场";
		param.funcID = FUN_TYPE.FUN_YEWAIPVP;
		param.redP = this.createRedPoint();
		sysQueue.push(param);
		param.tabBtns = [];
		// 战场 - 试炼
		pItem = new RegisterTabBtnParam();
		pItem.sysName = "EncounterPanel";
		pItem.tabBtnRes = "z_btn_icon_shilian_png";
		pItem.title = "试炼";
		pItem.funcID = FUN_TYPE.FUN_YEWAIPVP;
		pItem.redP = this.createRedPoint();
		pItem.redP.addTriggerFuc(DataManager.getInstance().yewaipvpManager, "checkEncounterPoint");
		param.tabBtns.push(pItem);
		// 战场 - 竞技场
		pItem = new RegisterTabBtnParam();
		pItem.sysName = "LocalArenaPanel";
		pItem.tabBtnRes = "z_btn_icon_jingjichang_png";
		pItem.title = "竞技场";
		pItem.funcID = FUN_TYPE.FUN_ARENA;
		pItem.redP = this.createRedPoint();
		pItem.redP.addTriggerFuc(DataManager.getInstance().localArenaManager, "getRedPointShow");
		param.tabBtns.push(pItem);
		// 战场 - 天梯
		pItem = new RegisterTabBtnParam();
		pItem.sysName = "LadderArenaPanel";
		pItem.tabBtnRes = "z_btn_icon_tianti_png";
		pItem.title = "天梯";
		pItem.funcID = FUN_TYPE.FUN_LADDER;
		pItem.redP = this.createRedPoint();
		pItem.redP.addTriggerFuc(DataManager.getInstance().arenaManager, "getLadderPointShow");
		param.tabBtns.push(pItem);
		// 战场 - 护送
		pItem = new RegisterTabBtnParam();
		pItem.sysName = "EscortPanel";
		pItem.tabBtnRes = "z_btn_icon_husong_png";
		pItem.title = "护送";
		pItem.funcID = FUN_TYPE.FUN_DUJIE;
		pItem.redP = this.createRedPoint();
		pItem.redP.addTriggerFuc(DataManager.getInstance().escortManager, "getShowSysRedpoint");
		param.tabBtns.push(pItem);

		//跨服竞技场
		param = new RegisterSystemParam();
		param.sysName = "ServerArenaPanel";
		param.btnRes = "竞技";
		param.funcID = FUN_TYPE.FUN_SERVERFIGHT_ARENA;
		param.redP = this.createRedPoint();
		param.redP.addTriggerFuc(FunDefine, "getCrossArenaPoint");
		sysQueue.push(param);

		//跨服BOSS
		param = new RegisterSystemParam();
		param.sysName = "ServerPVEBossPanel";
		param.btnRes = "诛仙";
		param.funcID = FUN_TYPE.FUN_SERVERPVEBOSS;
		param.redP = this.createRedPoint();
		param.redP.addTriggerFuc(FunDefine, "getCrossPVEBOSSPoint");
		sysQueue.push(param);

		//武坛
		param = new RegisterSystemParam();
		param.sysName = "WuTanPanel";
		param.btnRes = "武坛";
		param.funcID = FUN_TYPE.FUN_WUTAN;
		param.redP = this.createRedPoint();
		param.redP.addTriggerFuc(DataManager.getInstance().wuTanManager, "checkRedPoint");
		sysQueue.push(param);

		this.registerPage(sysQueue, "yewaipvpGrp");
		super.onInit();
		this.onRefresh();
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onRefresh(): void {
		switch (this.index) {
			case 0:
				this.setTitle("PVP");
				break;
			case 1:
				this.setTitle("PVP");
				break;
			case 2:
				this.setTitle('竞技');
				break;
			case 3:
				this.setTitle('诛仙');
				break;
			case 4:
				this.setTitle('武坛');
				break;
		}
		super.onRefresh();
	}
	//The end
}