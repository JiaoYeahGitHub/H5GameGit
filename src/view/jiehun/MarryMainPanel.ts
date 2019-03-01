class MarryMainPanel extends BaseSystemPanel {
	protected points: redPoint[] = RedPointManager.createPoint(5);
	protected tabs = {};
	protected tabFs = {};
	private tabNum: number = 0;
	private sysQueue;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		this.onSetTab();
		super.onInit();

	}
	protected onRegist(): void {
		super.onRegist();
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_APPLY_MESSAGE.toString(), this.onSetTab, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_DIVORCE_MESSAGE.toString(), this.onSetTab, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_DIVORCE_APPLY_MESSAGE.toString(), this.onSetTab, this);
	}
	protected onRemove(): void {
		super.onRemove();
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_APPLY_MESSAGE.toString(), this.onSetTab, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_DIVORCE_MESSAGE.toString(), this.onSetTab, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_DIVORCE_APPLY_MESSAGE.toString(), this.onSetTab, this);

	}
	private onSetTab(): void {
		if (DataManager.getInstance().playerManager.player.marriId == 0) {
			this.sysQueue = [];
			var param = new RegisterSystemParam();//单身状态只显示姻缘墙界面
			param.sysName = "MarryListPanel";
			param.btnRes = "姻缘墙";
			// param.btnRes = "btn_marry";
			param.redP = this.points[0];
			// param.title = 'title_marry_png';
			param.title = '姻缘墙';
			this.sysQueue.push(param);
			this.setTitle('title_marry_png');
		} else {
			this.sysQueue = [];
			//相思树
			var param = new RegisterSystemParam();
			param.sysName = "MarryTreePanel";
			param.btnRes = "相思树";
			param.title = '相思树';
			// param.title = 'marry_tree_title_png';
			// param.btnRes = "marry_tree_icon";
			param.redP = this.points[0];
			param.redP.addTriggerFuc(DataManager.getInstance().marryManager, "checkMarryTreePoint");
			this.sysQueue.push(param);

			param = this.getMarryRingParam(this.points[1]);
			this.sysQueue.push(param);

			var param:RegisterSystemParam = new RegisterSystemParam();//结婚副本
			param.sysName = "MarryDupPanel";
			// param.btnRes = "btn_marryBoss";
			// param.title = 'marry_boss_title_png';
			param.btnRes = '仙缘boss';
			param.title = '仙缘boss';
			param.funcID = FUN_TYPE.FUN_MARRY_DUP;
			param.redP = this.points[2];
			param.redP.addTriggerFuc(FunDefine, "getDupHasTimes", DUP_TYPE.DUP_MARRY);
			this.sysQueue.push(param);

			var param = new RegisterSystemParam();//结婚套装
			param.sysName = "MarryEquipSuitPanel";
			// param.btnRes = "marry_tz_icon";
			param.btnRes = "仙缘套装";
			// param.title = 'marry_tz_title_png';
			param.title = '仙缘套装';
			param.funcID = FUN_TYPE.FUN_MARRY_EQUIP_SUIT_DUP;
			param.redP = this.points[3];
			param.redP.addTriggerFuc(DataManager.getInstance().ringManager, "checkTZRedPointAll");
			this.sysQueue.push(param);

			var param = new RegisterSystemParam();//姻缘墙
			param.sysName = "MarryListPanel";
			// param.btnRes = "btn_marry";
			param.btnRes = '姻缘墙';
			// param.title = 'title_marry_png';
			param.title = '姻缘墙';
			param.redP = this.points[4];
			param.redP.addTriggerFuc(DataManager.getInstance().marryManager, "divorcePoint");
			this.sysQueue.push(param);
		}

		this.registerPage(this.sysQueue, "MarryGroup", GameDefine.RED_TAB_POS);
		this.onRefresh();
	}
	// 获取婚戒panel数据体
	private getMarryRingParam(point: redPoint): RegisterSystemParam {
		let param = new RegisterSystemParam();
		param.sysName = "MarryRingPanel";
		// param.btnRes = "ring_icon";
		// param.title = 'ring_title_png';
		param.btnRes = "婚戒";
		param.title = '婚戒';
		param.redP = point;
		param.redP.addTriggerFuc(DataManager.getInstance().ringManager, "checkRedPointAll");
		return param;
	}
	protected onRefresh(): void {
		super.onRefresh();
		if (this.sysQueue.length > this.index)
			this.setTitle(this.sysQueue[this.index].title);
	}
}