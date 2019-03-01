class FestivalFullMoonPanel extends BaseSystemPanel {
	protected modelGroup: ModelactivityGroup;
	protected activityIds: number[];

	private params: RegisterTabBtnParam[];
	protected points: redPoint[];//红点列表
	protected isActivity: boolean = true;

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PanelSkinActivity;
	}
	protected onInit(): void {
		this.points = [];
		this.modelGroup = JsonModelManager.instance.getModelactivityGroup()[ACTIVITY_TYPE.ACTIVITY_FESTIVALFULLMOON];
		this.activityIds = GameCommon.parseIntArray(this.modelGroup.activityId);
		super.onInit();
	}
	protected onRegist(): void {
		super.onRegist();
		let pointIdx: number = 0;
		let params: RegisterTabBtnParam[] = [];
		let param: RegisterSystemParam = new RegisterSystemParam();
		param.redP = new redPoint();
		for (let i: number = 0; i < this.activityIds.length; i++) {
			let activityID: number = this.activityIds[i];
			if (activityID == ACTIVITY_BRANCH_TYPE.ZHONGQIULEICHONG) {
				let zqManager = DataManager.getInstance().zqManager;
				let list: Modelfeastzhuanpan[] = zqManager.currModels;
				for (let n = 0; n < list.length; ++n) {
					if (list[n]) {
						let type = list[n].type;
						let panel = zqManager.getActionPanel(type);
						if (panel) {
							let p: RegisterTabBtnParam = new RegisterTabBtnParam();
							p.sysName = panel;
							p.tabBtnRes = zqManager.getActionIcon(type);
							p.title = zqManager.getActionTitle(type);
							params.push(p);

							let point = new redPoint();
							this.points.push(point);
							p.redP = point;
							p.redP.addTriggerFuc(zqManager, 'getActivityPointPanel', type);
						}
					}
				}
			} else {
				let p: RegisterTabBtnParam = DataManager.getInstance().activityManager.getRegisterTabBtnParam(activityID);
				if (p) {
					let panelName: string = '';
					let actModel = this.getActivityModel(activityID);
					if (!actModel) continue;
					p.tabBtnRes = actModel.icon;
					panelName = actModel.panel;

					if (!this.points[pointIdx]) {
						this.points[pointIdx] = new redPoint();
					}
					p.redP = this.points[pointIdx];
					p.redP.addTriggerFuc(DataManager.getInstance().activityManager, "checkActivityPointByID", activityID);
					pointIdx++;
					params.push(p);
				}
			}
		}
		param.tabBtns = params;
		this.registerPage([param], "festivalFullMoonGrp", GameDefine.RED_TAB_POS);
		this.params = params;
		// if (!this.currPanel) {
		// 	this.onRefresh();
		// }
	}
	private getActivityModel(activityID: number) {
		if (activityID < 10000) {
			return JsonModelManager.instance.getModelactivity()[activityID];
		} else {
			return JsonModelManager.instance.getModelactivityFunction()[activityID];
		}
	}
	//The end
}