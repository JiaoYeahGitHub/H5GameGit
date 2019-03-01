class LieMingMainPanel extends BaseSystemPanel {
	protected points: redPoint[] = RedPointManager.createPoint(4);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
		this.setTitle("difutitle_png");
	}
	private isRequst: boolean;
	protected onInit(): void {

		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "DiFuDupPanel";
		param.btnRes = "difuTab";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().dupManager, "difuDupredPoint");

		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "LieMingObtainPanel";
		param.btnRes = "lieMingTab";
		param.redP = this.points[1];
		param.redP.addTriggerFuc(DataManager.getInstance().fateManager, "getObtainPoint");

		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "LieMingSanHunPanel";
		param.btnRes = "sanhunTab";
		param.redP = this.points[3];
		param.redP.addTriggerFuc(DataManager.getInstance().fateManager, "getFateEquipPoint");
		// param.redP.addTriggerFuc(DataManager.getInstance().magicManager, "checkMagicTurnplatePoint");
		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "LieMingUpLevel";
		param.btnRes = "shengjiTab";
		param.redP = this.points[2];
		param.redP.addTriggerFuc(DataManager.getInstance().fateManager, "getFatePackage");
		sysQueue.push(param);




		this.registerPage(sysQueue, "LieMingMainGrp", GameDefine.RED_TAB_POS);
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
	}
	protected onRefresh(): void {
		// switch (this.index) {
		// 	case 0:
		// 		this.setTitle("smelt_special_title_png");
		// 		break;
		// 	case 1:
		// 		this.setTitle("smelt_special_title_png");
		// 		break;
		// }
		super.onRefresh();
	}
	//请求副本的信息
	public onRequestDupInofMsg(duptype: DUP_TYPE): void {
		var bossinfoMsg: Message = new Message(MESSAGE_ID.XUEZHAN_INIT_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(bossinfoMsg);
	}
}