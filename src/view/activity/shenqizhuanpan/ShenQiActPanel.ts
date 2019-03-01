class ShenQiActPanel extends BaseSystemPanel {
	protected points: redPoint[];
	private params: RegisterSystemParam[] = [];
	private activityIdNow: number[] = [];
	protected modelGroup: ModelactivityGroup = JsonModelManager.instance.getModelactivityGroup()[ACTIVITY_TYPE.ACTIVITY_SHENQICHOUQIAN];
	protected activityIds: number[] = GameCommon.parseIntArray(this.modelGroup.activityId);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PanelSkinActivity;
	}
	protected onInit(): void {
		super.onInit();
		// var message = new Message(MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE);
		// message.setByte(0);
		// GameCommon.getInstance().sendMsgToServer(message);
		this.params = [];
		this.activityIdNow = [];
		this.points = [];
		let sysQueue = [];
		let pointIdx: number = 0;
		// var bo: boolean = false;

		var param;
		for (let i: number = 0; i < this.activityIds.length; i++) {
			let activityID: number = this.activityIds[i];
			var p: RegisterSystemParam = DataManager.getInstance().activityManager.getRegisterSystemParam(activityID);
			if (p) {

				if (!param) {
					param = new RegisterSystemParam()
					param.sysName = p.sysName;
					this.points[pointIdx] = new redPoint()
					param.redP = this.points[pointIdx];
					param.redP.addTriggerFuc(DataManager.getInstance().shenqiZhuanPanManager, 'checkZhuanPanPoint');
					param.tabBtns = [];// 三级菜单结构体数组
				}
				if (param) {
					let pItem: RegisterTabBtnParam = new RegisterTabBtnParam();
					let activityModel: Modelactivity = JsonModelManager.instance.getModelactivity()[activityID];
					let redpointFunc: string = this.getRedPointFunc(activityModel.panel);
					if (redpointFunc) {
						this.points[pointIdx] = new redPoint()
						pItem.redP = this.points[pointIdx];
						pItem.redP.addTriggerFuc(DataManager.getInstance().shenqiZhuanPanManager, redpointFunc);
						pointIdx++;
					}
					pItem.sysName = p.sysName;
					pItem.tabBtnRes = activityModel.icon + '_png';//p.btnRes;//
					if (activityID == ACTIVITY_BRANCH_TYPE.ACT_SHENQICHOUQIAN) {
						this.points[pointIdx] = new redPoint()
						pItem.redP = this.points[pointIdx];
						pItem.redP.addTriggerFuc(DataManager.getInstance().shenqiZhuanPanManager, 'checkZhuanPanPoint');
						pItem.title = DataManager.getInstance().shenqiZhuanPanManager.zhuanpanModel.title;
						// bo = true;
						pItem.sysName = DataManager.getInstance().shenqiZhuanPanManager.zhuanpanModel.panel;
					}
					param.tabBtns.push(pItem);
					this.activityIdNow.push(activityID);
					this.params.push(p);
				}
			}
		}

		// if (bo) {
		// 	var p = new RegisterSystemParam();
		// 	p.sysName = 'ShenQiTreasureRankPanel';
		// 	p.title = "夏日榜";//'z_xiaribang_png';
		// 	p.btnRes = 'icon_xiaribang';

		// 	let pItem: RegisterTabBtnParam = new RegisterTabBtnParam();
		// 	pItem.sysName = 'ShenQiTreasureRankPanel';
		// 	pItem.title = "夏日榜";//'z_xiaribang_png';
		// 	pItem.tabBtnRes = 'icon_xianshihuishou_png';
		// 	param.tabBtns.push(pItem);
		// 	this.params.push(p);
		// }
		sysQueue.push(param);
		this['basic']['tabBtnsBar']['nextImg'].visible = false;
		this['basic']['tabBtnsBar']['preImg'].visible = false;
		(<eui.HorizontalLayout>this['basic']['tabBtnsBar']['btnGroup'].layout).gap = 30;
		this.registerPage(sysQueue, "ShenQiActGrp", GameDefine.RED_TAB_POS);
	}
	protected onRegist(): void {
		var message = new Message(MESSAGE_ID.ARTIFACT_ROLL_PLATE);
		message.setByte(0);
		GameCommon.getInstance().sendMsgToServer(message);

		// var p: RegisterSystemParam = DataManager.getInstance().activityManager.getRegisterSystemParam(15);
		// 	if (p) {
		// 		let pItem: RegisterTabBtnParam = new RegisterTabBtnParam();
		// 		let activityModel: Modelactivity = JsonModelManager.instance.getModelactivity()[15]; 
		//         let redpointFunc: string = this.getRedPointFunc(activityModel.panel);
		//         if (redpointFunc) {
		// 			p.redP = this.points[0];
		//             p.redP.addTriggerFuc(DataManager.getInstance().festivalWuYiManager, 'checkZhuanPanPoint');
		//         }
		// 		pItem.sysName = p.sysName;
		// 		pItem.redP = p.redP;
		// 		pItem.tabBtnRes = 'icon_xianshihuishou_png';
		// 		this.params[0].tabBtns[0] = pItem;
		// 	}
		this.onRefresh();
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
	}
	protected onRefresh(): void {

		this.setTitle(this.params[this.index].title);
		super.onRefresh();
	}
	private getRedPointFunc(panel: string): string {
		let func: string = '';
		switch (panel) {
			case 'HefuMissionPanel':
				func = 'checkLiyiMissionRedPoint';
				break;
			case 'HefuPayGiftPanel':
				break;
			case 'HefuTreasurePanel':
				func = 'checkZhuanPanPoint';
				break;
			case 'HefuTreasurePanel':
				func = 'checkZhuanPanPoint';
				break;
		}
		return func;
	}
	//The end
}