class ActivityConsumeMainPanel extends BaseSystemPanel {
	protected points: redPoint[];
	private params: RegisterSystemParam[] = [];
	private activityIdNow: number[] = [];
	protected modelGroup: ModelactivityGroup = JsonModelManager.instance.getModelactivityGroup()[ACTIVITY_TYPE.ACTIVITY_CONSUME];
	protected activityIds: number[] = GameCommon.parseIntArray(this.modelGroup.activityId);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		this.points = [];

		super.onInit();
	}
	protected onRegist(): void {
		super.onRegist();

		DataManager.getInstance().totalConsumeManager.requestConsumeItemMsg();

		let pointIdx: number = 0;
		this.activityIdNow = [];
		this.params = [];
		for (let i: number = 0; i < this.activityIds.length; i++) {
			let activityID: number = this.activityIds[i];
			var p: RegisterSystemParam = DataManager.getInstance().activityManager.getRegisterSystemParam(activityID);
			if (p) {
				let panelName: string = '';
				if (activityID < 10000) {
					let activityModel: Modelactivity = JsonModelManager.instance.getModelactivity()[activityID];
					p.btnRes = activityModel.icon;
					panelName = activityModel.panel;
				} else {
					let actFuncModel: ModelactivityFunction = JsonModelManager.instance.getModelactivityFunction()[activityID];
					p.btnRes = actFuncModel.icon;
					panelName = actFuncModel.panel;
				}

				let redpointFunc: string = this.getRedPointFunc(panelName);
				if (redpointFunc) {
					if (!this.points[pointIdx]) {
						this.points[pointIdx] = new redPoint();
					}
					p.redP = this.points[pointIdx];
					p.redP.addTriggerFuc(DataManager.getInstance().totalConsumeManager, redpointFunc);
					pointIdx++;
				}

				this.params.push(p);
				this.activityIdNow.push(activityID);
			}
		}
		this.registerPage(this.params, "consumeActivityGrp", GameDefine.RED_TAB_POS);
		if (!this.currPanel) {
			this.onRefresh();
		}
	}
	protected onRefresh(): void {
		this.onRefreshTitle();
		super.onRefresh();
	}
	private onRefreshTitle(): void {
		switch (this.index) {
			case 0:
				this.setTitle("act_consume_title_png");
				break;
			case 1:
				break;
			case 2:
				break;
		}
	}
	private getRedPointFunc(panel: string): string {
		let func: string = '';
		switch (panel) {
			case 'ActConsuemTurnplatePanel':
				func = 'oncheckTurnplateRedPoint';
				break;
		}
		return func;
	}
	//The end
}