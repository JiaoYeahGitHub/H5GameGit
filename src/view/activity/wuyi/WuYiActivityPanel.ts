class WuYiActivityPanel extends BaseSystemPanel {
	protected points: redPoint[] = RedPointManager.createPoint(3);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		this.setTitle("wuyiTitle1_png");
		var message = new Message(MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE);
		message.setByte(0);
		GameCommon.getInstance().sendMsgToServer(message);
		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "WuyiTreasurePanel";
		param.btnRes = "wuyiZhuanPanBtn";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().festivalWuYiManager, "checkZhuanPanPoint");
		sysQueue.push(param);

		param = new RegisterSystemParam();
		param.sysName = "WuYiLoginActivityPanel";
		param.btnRes = "wuyiDengluhaoliBtn";
		param.redP = this.points[1];
		param.redP.addTriggerFuc(DataManager.getInstance().festivalWuYiManager, "loginPoint");
		sysQueue.push(param);
		
		param = new RegisterSystemParam();
		param.sysName = "WuYiSaleActivityPanel";
		param.btnRes = "wuyiTeHuiBtn";
		param.redP = this.points[2];
		// param.redP.addTriggerFuc(DataManager.getInstance().festivalWuYiManager, "checkSalePoint");
		sysQueue.push(param);

		this.registerPage(sysQueue, "fightSpriteGrp", GameDefine.RED_TAB_POS);
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
		switch (this.index) {
			case 0:
				this.setTitle("wuyiTitle1_png");
				break;
			case 1:
				this.setTitle("wuyiTitle2_png");
				break;
			case 2:
				this.setTitle("wuyiTitle3_png");
				break;
		}
		super.onRefresh();
	}
}