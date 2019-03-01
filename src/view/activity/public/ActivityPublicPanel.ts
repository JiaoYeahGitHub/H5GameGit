class ActivityPublicPanel extends BaseSystemPanel {
	protected modelGroup: ModelactivityGroup;
	protected activityIds: number[];
	private params: RegisterTabBtnParam[];
	protected isActivity: boolean = true;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PanelSkinActivity;
	}
	public onShowWithParam(param): void {
		this.modelGroup = param;
		this.onShow();
	}
	protected onInit(): void {
		super.onInit();
	}
	protected onRegist(): void {
		super.onRegist();
		let param: RegisterSystemParam = new RegisterSystemParam();
		// this.points = [];
		this.activityIds = GameCommon.parseIntArray(this.modelGroup.activityId);
		let pointIdx: number = 0;
		let params: RegisterTabBtnParam[] = [];
		for (let i: number = 0; i < this.activityIds.length; i++) {
			let activityID: number = this.activityIds[i];
			let p: RegisterTabBtnParam = DataManager.getInstance().activityManager.getRegisterTabBtnParam(activityID);
			if (p) {
				let actModel = this.getActivityModel(activityID);
				if (!actModel) continue;
				p.tabBtnRes = actModel.icon;
				p.title = actModel.title;

				p.redP = this.createRedPoint();
				p.redP.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPointByID", activityID);
				pointIdx++;
				params.push(p);
			}
		}
		param.tabBtns = params;
		this.registerPage([param], "activityPublicGrp", GameDefine.RED_TAB_POS);
		this.params = params;
		if (params && this.index >= params.length) {
			this.index = 0;
		}
		if (!this.currPanel) {
			this.onRefresh();
		}
	}
	// protected onRefresh(): void {
	// 	this.setTitle(this.params[this.index].title);
	// 	super.onRefresh();
	// }
	private getActivityModel(activityID: number) {
		if (activityID < 10000) {
			return JsonModelManager.instance.getModelactivity()[activityID];
		} else {
			return JsonModelManager.instance.getModelactivityFunction()[activityID];
		}
	}
	//The end
}