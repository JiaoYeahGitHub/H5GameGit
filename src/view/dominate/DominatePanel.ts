// class DominatePanel extends BaseSystemPanel {
// 	public static index: number = 0;
// 	protected points: redPoint[] = RedPointManager.createPoint(2);
// 	public constructor(owner: ModuleLayer) {
// 		super(owner);
// 	}
// 	protected onSkinName(): void {
// 		this.skinName = skins.DominatePanelSkin;
// 	}
// 	protected onInit(): void {
// 		var sysQueue = [];

// 		var param = new RegisterSystemParam();
// 		param.sysName = "DomUpgradePanel";
// 		param.btnRes = "dominate_upgrade_tab_png";
// 		param.redP = this.points[0];
// 		param.redP.addTriggerFuc(DataManager.getInstance().dominateManager, "checkDomUpgradePoint");
// 		sysQueue.push(param);

// 		param = new RegisterSystemParam();
// 		param.sysName = "DomAdvancePanel";
// 		param.btnRes = "dominate_advance_tab_png";
// 		param.redP = this.points[1];
// 		param.redP.addTriggerFuc(DataManager.getInstance().dominateManager, "checkDomAdvancePoint");
// 		sysQueue.push(param);

// 		param = new RegisterSystemParam();
// 		param.sysName = "DomDecomposePanel";
// 		param.btnRes = "dominate_decompose_tab_png";
// 		sysQueue.push(param);

// 		this.registerPage(sysQueue, "dominateGrp");

// 		super.onInit();
// 		this.setTitle("dominate_title_png");
// 		this.onRefresh();
// 	}
// 	protected onRegist(): void {
// 		super.onRegist();
// 		// this.btn_upgrade.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
// 		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE.toString(), this.onRefresh, this);
// 		// GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
// 	}
// 	protected onRemove(): void {
// 		super.onRemove();
// 		// this.btn_upgrade.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
// 		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE.toString(), this.onRefresh, this);
// 		// GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.PLAYER_CURRENCY_UPDATE.toString(), this.onUpdateCurrency, this);
// 	}
// 	protected onRefresh(): void {
// 		super.onRefresh();
// 	}
// 	public onShowWithParam(param: DominateParam): void {
// 		if (param.index != -1) {
// 			this.index = param.index;
// 		}
// 		this.onShow();
// 		if (this.currPanel && param.index != -1) {
// 			this.currPanel.onBtnAdvanceClick(param.slot);
// 		}
// 	}
// }
// class DominateParam {
// 	public index: number;
// 	public slot: number;
// 	public constructor(index, slot) {
// 		this.index = index;
// 		this.slot = slot;
// 	}
// }