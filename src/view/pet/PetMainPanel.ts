class PetMainPanel extends BaseSystemPanel {
	protected funcID: number = FUN_TYPE.FUN_PET_GRADE;
	protected points: redPoint[] = RedPointManager.createPoint(3);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		var sysQueue = [];

		var param = new RegisterSystemParam();
		param.sysName = "PetUpgradePanel";
		param.btnRes = "进阶";
		param.funcID = FUN_TYPE.FUN_PET_GRADE;
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().petManager, "onCheckPetCanUpgrade");
		sysQueue.push(param);

		var param = new RegisterSystemParam();
		param.sysName = "PetUpdatePanel";
		param.btnRes = "升级";
		param.redP = this.points[1];
		param.funcID = FUN_TYPE.FUN_PET_LEVEL;
		param.redP.addTriggerFuc(DataManager.getInstance().petManager, "onCheckPetCanUpdate");
		sysQueue.push(param);

		var param = new RegisterSystemParam();
		param.sysName = "PetEnchantPanel";
		param.btnRes = "洗髓";
		// param.funcID = FUN_TYPE.FUN_DUP_CAILIAO;
		// param.redP = this.points[2];
		// param.redP.addTriggerFuc(DataManager.getInstance().petManager, "onCheckPetCanUpgrade");
		sysQueue.push(param);
		// var param = new RegisterSystemParam();
		// param.sysName = "PetLotteryPanel";
		// param.btnRes = "pet_tab_call_png";
		// param.redP = this.points[2];
		// param.redP.addTriggerFuc(DataManager.getInstance().petManager, "onCheckLotteryRedPoint");
		// sysQueue.push(param);

		this.registerPage(sysQueue, "petGrp", GameDefine.RED_TAB_POS);
		this.setTitle('宠物');
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PET_UPDATE_MESSAGE.toString(), this.onUpdateBack, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PET_UPGRADE_MESSAGE.toString(), this.onUpdateBack, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PET_OUTBOUND_MESSAGE.toString(), this.onUpdateBack, this);
	}
	protected onRemove(): void {
		super.onRemove();
		var item: PetInstance;
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PET_UPDATE_MESSAGE.toString(), this.onUpdateBack, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PET_UPGRADE_MESSAGE.toString(), this.onUpdateBack, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PET_OUTBOUND_MESSAGE.toString(), this.onUpdateBack, this);
	}
	protected onRefresh(): void {
		switch (this.index) {
			case 0:
				break;
			case 1:
				break;
		}
		super.onRefresh();
	}
	public trigger(): void {
		this.points[0].checkPoint();
		this.points[1].checkPoint();
		if (this.currTabPanel)
			this.currTabPanel.trigger();
	}
}