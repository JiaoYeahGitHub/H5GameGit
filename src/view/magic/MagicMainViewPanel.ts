class MagicMainViewPanel extends BaseSystemPanel {
	protected funcID: number = FUN_TYPE.FUN_MOUNT;
	protected points: redPoint[] = RedPointManager.createPoint(5);
	private params: RegisterSystemParam[];
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		this.basic['bgDi'].visible = false;
		var sysQueue = [];
		var param = new RegisterSystemParam();
		param.sysName = "MagicViewPanel";
		param.btnRes = "飞 剑";
		param.funcID = FUN_TYPE.FUN_MOUNT;
		param.redP = this.points[0];
		param.redP.addTriggerFuc(DataManager.getInstance().playerManager, "checkBlessUPMain", BLESS_TYPE.HORSE);
		sysQueue.push(param);

		var param = new RegisterSystemParam();
		param.sysName = "MagicGodWeaponPanel";
		param.btnRes = "神 兵";
		param.funcID = FUN_TYPE.FUN_SHENBING;
		param.redP = this.points[1];
		param.redP.addTriggerFuc(DataManager.getInstance().playerManager, "checkBlessUPMain", BLESS_TYPE.WEAPON);
		sysQueue.push(param);

		var param = new RegisterSystemParam();
		param.sysName = "MagicGodZhuangPanel";
		param.btnRes = "神 装";
		param.funcID = FUN_TYPE.FUN_SHENZHUANG;
		param.redP = this.points[2];
		param.redP.addTriggerFuc(DataManager.getInstance().playerManager, "checkBlessUPMain", BLESS_TYPE.CLOTHES);
		sysQueue.push(param);

		var param = new RegisterSystemParam();
		param.sysName = "MagicBaoQiPanel";
		param.btnRes = "宝 器";
		param.funcID = FUN_TYPE.FUN_FABAO;
		param.redP = this.points[3];
		param.redP.addTriggerFuc(DataManager.getInstance().playerManager, "checkBlessUPMain", BLESS_TYPE.MAGIC);
		sysQueue.push(param);

		var param = new RegisterSystemParam();
		param.sysName = "MagicWingPanel";
		param.btnRes = "仙 羽";
		param.funcID = FUN_TYPE.FUN_XIANYU;
		param.redP = this.points[4];
		param.redP.addTriggerFuc(DataManager.getInstance().playerManager, "checkBlessUPMain", BLESS_TYPE.WING);
		sysQueue.push(param);

		this.params = sysQueue;
		this.registerPage(sysQueue, "forgeGrp", GameDefine.RED_TAB_POS);
		var img: eui.Image = new eui.Image();
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
		// this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE.toString(), this.onRefresh, this);
		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
		GameDispatcher.getInstance().addEventListener(GameEvent.MAGIC_HUANHUA, this.onRefresh, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FASHIONSETL_ACT_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.FASHIONSETL_UPLV_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.STRONGER_ACT.toString(), this.upHandler, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameDispatcher.getInstance().addEventListener(GameEvent.MAGIC_HUANHUA, this.onRefresh, this);
		// this.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE.toString(), this.onRefresh, this);
		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FASHIONSETL_ACT_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.FASHIONSETL_UPLV_MESSAGE.toString(), this.upHandler, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.STRONGER_ACT.toString(), this.upHandler, this);
	}
	protected onRefresh(): void {
		this.setTitle(this.params[this.index].btnRes);
		super.onRefresh();
	}
	private upHandler(): void {
		if (this.allwindows[this.sysInfos[this.index].sysName]) {
			this.allwindows[this.sysInfos[this.index].sysName].upHandler();
		}
	}
	public onHide(): void {
		super.onHide();
	}
}

enum FASHION_STATUS {
	ACTIVE = 0,//激活
	CLOTH = 1,//穿戴
	OUT = 2//脱下
}