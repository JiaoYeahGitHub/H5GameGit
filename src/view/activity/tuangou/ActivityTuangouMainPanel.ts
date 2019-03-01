class ActivityTuangouMainPanel extends BaseSystemPanel {
	protected points: redPoint[];
	private params: RegisterTabBtnParam[];
	private activityIdNow: number[];
	protected modelGroup: ModelactivityGroup;
	protected activityIds: number[];
	protected isActivity: boolean = true;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PanelSkinActivity;
	}
	protected onInit(): void {
		this.points = [];
		this.modelGroup = JsonModelManager.instance.getModelactivityGroup()[ACTIVITY_TYPE.ACTIVITY_TUANGOU];
		this.activityIds = GameCommon.parseIntArray(this.modelGroup.activityId);
		super.onInit();
	}
	protected onRegist(): void {
		super.onRegist();

		let pointIdx: number = 0;
		this.activityIdNow = [];
		this.params = [];
		let param = new RegisterSystemParam();
		for (let i: number = 0; i < this.activityIds.length; i++) {
			let activityID: number = this.activityIds[i];
			var p: RegisterTabBtnParam = DataManager.getInstance().activityManager.getRegisterTabBtnParam(activityID);
			if (p) {
				// let activityModel: Modelactivity = JsonModelManager.instance.getModelactivity()[activityID];
				// if (activityModel) {
				// 	p.tabBtnRes = activityModel.icon;
				// 	p.title = activityModel.title;
				// } else {
				// 	let actFuncModel: ModelactivityFunction = JsonModelManager.instance.getModelactivityFunction()[activityID];
				// 	if (!actFuncModel) continue;
				// 	p.tabBtnRes = actFuncModel.icon;
				// 	p.title = actFuncModel.title;
				// }
				if (!this.points[pointIdx]) {
					this.points[pointIdx] = new redPoint();
				}
				p.redP = this.points[pointIdx];
				p.redP.addTriggerFuc(DataManager.getInstance().activityManager, 'checkActivityPointByID', activityID);
				pointIdx++;
				this.params.push(p);
				this.activityIdNow.push(activityID);
			}
			param.tabBtns = this.params;
		}
		this.registerPage([param], "tuangouActivityGrp", GameDefine.RED_TAB_POS);
		this.onRefresh();
	}
	protected onRefresh(): void {
		// this.onRefreshTitle();
		super.onRefresh();
	}
	// private onRefreshTitle(): void {
	// 	let activityID: number = this.activityIdNow[this.index];
	// 	let activityModel: Modelactivity = JsonModelManager.instance.getModelactivity()[activityID];
	// 	if (activityModel) {
	// 		this.setTitle(activityModel.title);
	// 	} else {
	// 		let actFuncModel: ModelactivityFunction = JsonModelManager.instance.getModelactivityFunction()[activityID];
	// 		if (actFuncModel) {
	// 			this.setTitle(actFuncModel.title);
	// 		}
	// 	}
	// }
	//The end
}