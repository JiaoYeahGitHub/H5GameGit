class VipActMainView extends BaseSystemPanel {
	protected points: redPoint[] = RedPointManager.createPoint(1);
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
		this.setTitle("vip转盘");
	}
	protected onInit(): void {
		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "VipZhuanPanPanel";
		param.btnRes = "tab_icon_zhizunzhuanpan";
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().vipManager, "getZhuanPanPoint");
		sysQueue.push(param);
		
		this.registerPage(sysQueue, "vipzhuanpanGrp", GameDefine.RED_TAB_POS);
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_MAGIC_MESSAGE.toString(), this.onRefresh, this);
		DataManager.getInstance().magicManager.onSendMessage();
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_MAGIC_MESSAGE.toString(), this.onRefresh, this);
	}
}