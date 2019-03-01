class NewHefuActivityPanel extends BaseSystemPanel {
	protected points: redPoint[];
	private params: RegisterSystemParam[] = [];
	private activityIdNow: number[] = [];
	protected modelGroup: ModelactivityGroup = JsonModelManager.instance.getModelactivityGroup()[ACTIVITY_TYPE.ACTIVITY_HEFU];
	protected activityIds: number[] = GameCommon.parseIntArray(this.modelGroup.activityId);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		super.onInit();
        this.params=[];
		this.activityIdNow = [];
		this.points = [];
		let sysQueue = [];
		let pointIdx: number = 0;
		var bo:boolean = false;
        let param;
		for (let i: number = 0; i < this.activityIds.length; i++) {
			let activityID: number = this.activityIds[i];
			var p: RegisterSystemParam = DataManager.getInstance().activityManager.getRegisterSystemParam(activityID);
			if (p) {
                let activityModel: Modelactivity = JsonModelManager.instance.getModelactivity()[activityID];
                let redpointFunc: string = this.getRedPointFunc(activityModel.panel);
                if (redpointFunc) {
                    this.points[pointIdx] = new redPoint();
                    p.redP = this.points[pointIdx];
                    p.redP.addTriggerFuc(DataManager.getInstance().hefuActManager, redpointFunc);
                    pointIdx++;
                }
				sysQueue.push(p);
                this.params.push(p);
			    this.activityIdNow.push(activityID);
			}
		}
		this.registerPage(sysQueue, "NewHefuActivityGrp", GameDefine.RED_TAB_POS);
		this.onRefresh();
	}
    private getRedPointFunc(panel: string): string {
		let func: string = '';
		switch (panel) {
			case 'HefuMissionPanel':
				func = 'checkHefuMissionRedPoint';
				break;
		}
		return func;
	}
	protected onRegist(): void {
		
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
	}
	protected onRefresh(): void {
		
		this.setTitle(this.params[this.index].title);
		super.onRefresh();
	}
	//The end
}