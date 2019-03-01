class ActivityZPPanel extends BaseSystemPanel {
	protected modelGroup: ModelactivityGroup = JsonModelManager.instance.getModelactivityGroup()[ACTIVITY_TYPE.ACTIVITY_ZHUANPAN];
	protected activityIds: number[] = GameCommon.parseIntArray(this.modelGroup.activityId);
	private params: RegisterSystemParam[] = [];
	protected points: redPoint[] = RedPointManager.createPoint(this.activityIds.length);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		super.onInit();
	}
	protected onRegist(){
		this.register();
		this.onRefresh();
		super.onRegist();
	}
	protected register(): void {
		this.params = [];
		var id;
		var sysQueue = [];
		var activity: Modelactivity;
		for (var i: number = 0; i < this.activityIds.length; i++) {
			id = this.activityIds[i];
			var p: RegisterSystemParam = DataManager.getInstance().activityManager.getRegisterSystemParam(id);
			if (p) {
				if(id == ACTIVITY_BRANCH_TYPE.LEICHONGLABA){
					var obj = DataManager.getInstance().labaManager.currModel;
					p.sysName = obj['panel'];
					p.title = obj['title'];
					p.redP = this.points[i];
					p.redP.addTriggerFuc(DataManager.getInstance().labaManager, 'getActivityPoint');
				}
				sysQueue.push(p);
				this.params.push(p);
				if(id == ACTIVITY_BRANCH_TYPE.LEICHONGLABA){
					let r = this.createRank(id);
					sysQueue.push(r);
					this.params.push(r);
				}
			}
		}
		this.registerPage(sysQueue, "activityLabaGrp", GameDefine.RED_TAB_POS);
	}
	private createRank(id: number): RegisterSystemParam{
		var p: RegisterSystemParam = new RegisterSystemParam();	
		p.sysName = "ActivityZhuanpanRank";
		p.btnRes = "z_labarank_btn";
		p.title = "z_labarank_title_png";
		return p;
	}
	// protected onRegist(): void {
	// 	super.onRegist();
	// }
	// protected onRemove(): void {
	// 	super.onRemove();
	// }

	protected onRefresh(): void {
		if(this.params && this.params[this.index]){
			this.setTitle(this.params[this.index].title);
		}
		super.onRefresh();
	}
}