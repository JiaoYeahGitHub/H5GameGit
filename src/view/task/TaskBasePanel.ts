class TaskBasePanel extends BaseSystemPanel {
	protected funcID: number = FUN_TYPE.FUN_JINGJIE;
	protected points: redPoint[] = RedPointManager.createPoint(5);

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		var sysQueue = [];

		var param = new RegisterSystemParam();
		param.sysName = "ZhuanShengPanel";
		param.funcID = FUN_TYPE.FUN_JINGJIE;
		param.btnRes = "转生";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().playerManager, "checkZhuanShengPoint");
		sysQueue.push(param);

		var param = new RegisterSystemParam();
		param.sysName = "ChengJiuPanel";
		param.btnRes = "成就";
		param.funcID = FUN_TYPE.FUN_JINGJIE;
		param.redP = this.points[1];
		param.redP.addTriggerFuc(DataManager.getInstance().taskManager, "getChengJiuPoint");
		sysQueue.push(param);

		var param = new RegisterSystemParam();
		param.sysName = "JianchiPanel";
		// param.btnRes = "coatard_shengong";
		param.btnRes = "每日";
		param.funcID = FUN_TYPE.FUN_JIANCHI;
		param.redP = this.points[2];
		param.redP.addTriggerFuc(DataManager.getInstance().tianGongManager, "getTabJianChiRedShow");
		sysQueue.push(param);

		var param = new RegisterSystemParam();
		param.sysName = "VipGodArtifactPanel";
		// param.funcID = FUN_TYPE.FUN_VIPARITFACT;
		// param.btnRes = "vipactifact_tabbtn";
		param.btnRes = "玄器";
		param.redP = this.points[3];
		param.redP.addTriggerFuc(DataManager.getInstance().legendManager, "oncheckAllVipActifactRedP");
		sysQueue.push(param);

		var param = new RegisterSystemParam();
		param.sysName = "XinFaPanel";
		// param.funcID = FUN_TYPE.FUN_XINFA;
		// param.btnRes = "xinfa_tab_btn";
		param.btnRes = "法器";
		param.redP = this.points[4];
		param.redP.addTriggerFuc(DataManager.getInstance().playerManager, "onCheckXinfaRedPoint");
		sysQueue.push(param);

		this.registerPage(sysQueue, "tiangongGrp", GameDefine.RED_TAB_POS);

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		// this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE.toString(), this.onRefresh, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
	}
	protected onRemove(): void {
		super.onRemove();
		// this.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE.toString(), this.onRefresh, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
	}
	protected onRefresh(): void {
		super.onRefresh();
		this.basic["bgDi"].visible = this.index != 4;
		switch (this.index) {
			case 0:
				this.setTitle("转生");
				break;
			case 1:
				this.setTitle("成就");
				break;
			case 2:
				this.setTitle("每日");
				break;
			case 3:
				this.setTitle("玄器");
				break;
			case 4:
				this.setTitle("法器");
				break;
		}
	}
	//The end
}
enum TASKPANEL_TAB {
	COATARDTASK = 0,
}