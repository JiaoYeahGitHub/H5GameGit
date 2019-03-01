class TargetMainPanel extends BaseSystemPanel {
	// protected index: number = ActivityManager.openQueue[ACTIVITY_OPEN_TYPE.FULIDATING][0];
	protected modelGroup: ModelactivityGroup = JsonModelManager.instance.getModelactivityGroup()[ACTIVITY_TYPE.ACTIVITY_TARGET_MAIN];
	protected activityIds: number[] = GameCommon.parseIntArray(this.modelGroup.activityId);
	private activityIdNow: number[] = [];
	protected isActivity: boolean = true;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PanelSkinActivity;
	}
	protected onInit(): void {
		super.onInit();
		this.register();
		this.onRefresh();
	}
	protected register(): void {
		var id;
		var sysQueue = [];
		var activity: Modelactivity;
		this.activityIdNow = [];
		var sysQueue = [];
		// 锻造 二级菜单结构体
		var param = new RegisterSystemParam();
		param.redP = this.createRedPoint();
		param.tabBtns = [];

		for (var i: number = 0; i < this.activityIds.length; i++) {
			id = this.activityIds[i];
			var p: RegisterTabBtnParam = DataManager.getInstance().activityManager.getRegisterTabBtnParam(id);
			if (p) {
				if (p.sysName == 'ActivitysTargetRechargePanel')
					p.funcID = FUN_TYPE.FUN_CHONGBANG
				else if (p.sysName =='ShenQiTreasurePanel')
				p.funcID = FUN_TYPE.FUN_SHENQI_CHOUQIAN;
				param.tabBtns.push(p);
				p.redP = this.createRedPoint();
				p.redP.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPointByID", this.activityIds[i]);
				this.activityIdNow.push(id);
			}
		}
		sysQueue.push(param);
		this.registerPage(sysQueue, "targetMainGrp", GameDefine.RED_TAB_POS);
	}

	protected onRegist(): void {
		super.onRegist();
		var message = new Message(MESSAGE_ID.ARTIFACT_ROLL_PLATE);
		message.setByte(0);
		GameCommon.getInstance().sendMsgToServer(message);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.refreshWhenDelActivity, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.GAME_CHECKACTIVITY_BTN, this.refreshWhenDelActivity, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.refreshWhenDelActivity, this);
		GameDispatcher.getInstance().removeEventListener(GameEvent.GAME_CHECKACTIVITY_BTN, this.refreshWhenDelActivity, this);
	}

	private refreshWhenDelActivity() {
		for (var i: number = 0; i < this.activityIdNow.length; i++) {
			if (DataManager.getInstance().activityManager.getRegisterSystemParam(this.activityIdNow[i])) {
				continue;
			} else {
				this.register();
			}
		}
	}

	public onShow(): void {
		this.refreshWhenDelActivity();
		super.onShow();
	}

	protected onRefresh(): void {
		// this.setTitle(this.params[this.index].title);
		super.onRefresh();
	}
}