class HallWelfarePanel extends BaseSystemPanel {
	protected modelGroup: ModelactivityGroup;
	protected activityIds: number[];
	private params: RegisterTabBtnParam[] = [];
	protected points: redPoint[];
	protected isActivity: boolean = true;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PanelSkinActivity;
	}
	protected onInit(): void {
		super.onInit();
		this.modelGroup = JsonModelManager.instance.getModelactivityGroup()[ACTIVITY_TYPE.ACTIVITY_FULIDATING];
		this.activityIds = GameCommon.parseIntArray(this.modelGroup.activityId);
		this.points = RedPointManager.createPoint(this.activityIds.length);

		let id;
		let activity: Modelactivity;
		for (var i: number = 0; i < this.activityIds.length; i++) {
			id = this.activityIds[i];
			var p: RegisterTabBtnParam = DataManager.getInstance().activityManager.getRegisterTabBtnParam(id);
			if (p) {
				this.params.push(p);
			}
		}
		this.register();
		this.onRefresh();
	}
	protected register(): void {
		var sysQueue = [];
		var paramT: RegisterSystemParam = new RegisterSystemParam();
		for (var i: number = 0; i < this.params.length; i++) {
			let param: RegisterTabBtnParam = this.params[i];
			if (param.sysName == 'ActivityYaoqianshuPanel')
				param.funcID = FUN_TYPE.FUN_JUBAOPEN;
			if (param.sysName == 'ActivityYuekaPanel')
				param.funcID = FUN_TYPE.FUN_MONTHCARD;
			param.redP = this.points[i];
			param.redP.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPointByID", this.activityIds[i]);
		}
		paramT.tabBtns = this.params;
		sysQueue.push(paramT);
		this.registerPage(sysQueue, "hallWelfareGrp", GameDefine.RED_TAB_POS);
	}

	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.ACTIVITY_MESSAGE.toString(), this.onRefresh, this);
	}
	protected onRefresh(): void {
		this.setTitle(this.params[this.index].title);
		super.onRefresh();
	}
}