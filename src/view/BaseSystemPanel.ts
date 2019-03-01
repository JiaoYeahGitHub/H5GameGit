class BaseSystemPanel extends BaseWindowPanel {
	protected index: number = 0;
	protected basic: eui.Component;
	protected tabBtnsBar: ScrollerTabBtnsBar;
	protected tabs = {};
	protected tabFs = {};
	protected allwindows = {};
	protected alerts = {};
	protected isShowAlert: boolean = false;
	protected lockIDs = {};
	protected currPanel: BaseTabView;
	protected sysInfos: RegisterSystemParam[];
	protected showParam;
	protected isActivity: boolean = false;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onInit(): void {
		this.onInitRegistPage();
		super.onInit();
	}
	private _initRegistPage: boolean;
	protected onInitRegistPage(): void {
		this._initRegistPage = true;
	}
	protected onRegist(): void {
		if (!this._initRegistPage) {
			this.onInitRegistPage();
		}
		super.onRegist();
		var btn: eui.RadioButton;
		for (var key in this.tabFs) {
			this.tabFs[key].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}
		GameDispatcher.getInstance().addEventListener(GameEvent.PLAYER_LEVEL_UPDATE, this.onLevelChange, this);
		this.refreshFunOpen();
	}
	protected onRemove(): void {
		super.onRemove();
		for (var key in this.tabFs) {
			this.tabFs[key].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}
		GameDispatcher.getInstance().removeEventListener(GameEvent.PLAYER_LEVEL_UPDATE, this.onLevelChange, this);
		this.index = 0;
		this._initRegistPage = false;
	}
	protected registerPage(sysInfo: RegisterSystemParam[], btnGrp: string, pos: egret.Point = GameDefine.RED_TAB_POS, isResetIndex: boolean = false): void {
		if (!sysInfo) return;
		this.tabBtnsBar = this.basic["tabBtnsBar"];
		this.sysInfos = sysInfo;
		var btn: eui.RadioButton;
		var len: number = this.sysInfos.length;
		var imgPoint: eui.Image;
		if (egret.is(this.basic["btnTabLayer"], "eui.Group")) {
			if ((this.basic["btnTabLayer"] as eui.Group).numChildren > 0) {
				(this.basic["btnTabLayer"] as eui.Group).removeChildren();
			}
		} else if (egret.is(this.basic["btnTabLayer"], "ScrollerTabBtnsBar")) {
			(this.basic["btnTabLayer"] as ScrollerTabBtnsBar).removeChildrenAll();
		}

		for (var key in this.tabFs) {
			this.tabFs[key].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}
		this.lockIDs = {};
		this.tabFs = {};
		this.allwindows = {};
		if (isResetIndex) {
			this.index = 0;
		}
		for (var i: number = 0; i < len; i++) {
			var grp: eui.Group = new eui.Group();
			grp.touchEnabled = true;
			grp.name = i.toString();
			btn = this.getTabButtonSkin(this.sysInfos[i].btnRes);
			btn.value = i;
			btn.groupName = btnGrp;
			btn.touchEnabled = false;
			this.tabs[i] = btn;
			this.tabFs[i] = grp;
			if (this.sysInfos[i].redP) {
				this.sysInfos[i].redP.addRedPointImg(btn, pos);
			}
			this.lockIDs[i] = this.sysInfos[i].funcID;
			grp.addChild(btn);
			this.basic["btnTabLayer"].addChild(grp);
		}

		for (var key in this.tabFs) {
			this.tabFs[key].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
		}
		if (this.tabBtnsBar) {
			for (var i: number = 0; i < this.sysInfos.length; i++) {
				this.sysInfos[i].initRedChild();
			}
			this.tabBtnsBar.setListenerBack(this.onCallTabBtns, this);
		}
	}
	protected getTabButtonSkin(btnRes: string): eui.RadioButton {
		var btn: eui.RadioButton;
		let btnLabel: string = btnRes;
		if (this.sysInfos[this.sysInfos.length - 1].btnRes == btnRes && this.sysInfos.length == 5) {
			btn = new BaseTabButton2(btnRes, btnLabel);
			btn.width = 103;
		} else {
			btn = new BaseTabButton(btnRes, btnLabel);
			// if (this.sysInfos.length == 5) {
			btn.width = 103;
			// }
		}
		return btn;
	}
	protected onTouchTab(e: egret.Event): void {
		var index: number = parseInt(e.target.name);
		if (this.lockIDs[index] > 0) {
			if (FunDefine.onIsLockandErrorHint(this.lockIDs[index])) return;
		}
		if (this.index != index) {
			this.index = index;
			this.onRefresh();
		}
	}
	public setPageTab(index: number, tabIdx: number = -1) {
		if (index < this.sysInfos.length) {
			if (FunDefine.onIsLockandErrorHint(this.lockIDs[index])) return;
			if (tabIdx >= 0) {
				let page: RegisterSystemParam = this.sysInfos[index];
				if (page.tabBtns && tabIdx < page.tabBtns.length) {
					if (FunDefine.onIsLockandErrorHint(page.tabBtns[tabIdx].funcID)) return;
					page.index = tabIdx;
				}
			}
			this.index = index;
			this.onRefresh();
		}
	}
	protected onTouchCloseBtn(): void {
		if (this.isShowAlert) {
			this.onShowPanel();
		} else {
			if (this.currPanel) {
				this.currPanel.onHide();
			}
			this.onHide();
		}
	}
	protected onRefresh(): void {
		this.onShowPanel();
		this.trigger();
	}
	public onShowWithParam(param): void {
		if (param) {
			this.showParam = param;
		}
		this.onShow();
	}
	protected onRefreshTabIndex(): void {
		if (!this.showParam) return;
		let isFind: boolean;
		for (let sys_idx: number = 0; sys_idx < this.sysInfos.length; sys_idx++) {
			let page: RegisterSystemParam = this.sysInfos[sys_idx];

			if (page.tabBtns) {
				for (let i: number = 0; i < page.tabBtns.length; i++) {
					let subbtnParam: RegisterTabBtnParam = page.tabBtns[i];
					if (subbtnParam.funcID == this.showParam || (subbtnParam.subFuncIDs && subbtnParam.subFuncIDs.indexOf(this.showParam) >= 0)) {
						this.index = sys_idx;
						page.index = subbtnParam.getIdx();
						isFind = true;
						break;
					}
				}
			}
			if (!isFind) {
				if (page.funcID == this.showParam || (page.subFuncIDs && page.subFuncIDs.indexOf(this.showParam) >= 0)) {
					this.index = sys_idx;
					isFind = true;
					break;
				}
			} else {
				break;
			}
		}
		this.showParam = null;
	}
	public getRegisterSystemParam(): RegisterSystemParam {
		return this.sysInfos[this.index];
	}
	private getWindowName() {
		let page: RegisterSystemParam = this.getRegisterSystemParam();
		this.refreshTabBtns(page);
		if (page.tabBtns) {
			if (!this.tabBtnsBar) {
				Tool.throwException("BaseSystemPanel - getWindowName - error: " + page.tabBtns[page.index].sysName);
			}
			return page.tabBtns[page.index].sysName;
		}
		return page.sysName;
	}
	private onShowPanel() {
		this.onRefreshTabIndex();
		if (this.currPanel) {
			if (!this.currPanel.isOnloadComp()) return;
			this.currPanel.onHide();
			this.isShowAlert = false;
		}
		var windowName: string = this.getWindowName();
		if (!windowName) return;
		Tool.logClassName(windowName);
		this.currPanel = this.allwindows[windowName];
		if (!this.currPanel) {
			this.currPanel = new window[windowName](this);
			this.allwindows[windowName] = this.currPanel;
			this.basic["tabLayer"].addChild(this.currPanel);
		} else {
			this.basic["tabLayer"].addChild(this.currPanel);
			this.currPanel.onShow();
		}
		if (this.tabs[this.index]) {
			this.tabs[this.index].selected = true;
		}
	}
	public setTabsJianTou(visib: boolean) {
		if (this.tabBtnsBar) {
			this.tabBtnsBar.setPreImgVisible(visib);
			this.tabBtnsBar.setNextImgVisible(visib);
		}
	}
	private setTabsPage(idx: number) {
		if (this.tabBtnsBar) {
			this.tabBtnsBar.setTagIndex(idx);
		}
	}
	public onCallTabBtns(tabBtn: RegisterTabBtnParam) {
		if (tabBtn.funcID > 0) {
			if (FunDefine.onIsLockandErrorHint(tabBtn.funcID)) {
				return;
			}
		}
		this.getRegisterSystemParam().index = tabBtn.getIdx();
		this.onRefresh();
	}
	private refreshTabBtns(page: RegisterSystemParam) {
		if (this.tabBtnsBar) {
			this.tabBtnsBar.removeChildrenAll();
			if (page.tabBtns) {
				let tabBtn: RegisterTabBtnParam = page.tabBtns[page.index];
				for (var i: number = 0; i < page.tabBtns.length; i++) {
					let btn = this.tabBtnsBar.addTabButton(page.tabBtns[i], this.isActivity);
					if (page.tabBtns[i].redP) {
						page.tabBtns[i].redP.addRedPointImg(btn, GameDefine.RED_TAB_BTN_POS);
					}
				}
				this.tabBtnsBar.setTagIndex(page.index);
				this.setTitle(tabBtn.title);
				this.tabBtnsBar.visible = true;
			} else {
				this.tabBtnsBar.visible = false;
			}
			if (this.basic['tabbar_bg_grp']) {
				this.basic['tabbar_bg_grp'].visible = this.tabBtnsBar.visible;
			}
		}
	}
	public onShowAlertByName(panelName: string): void {
		if (this.currPanel) {
			this.currPanel.onHide();
		}
		this.currPanel = this.alerts[panelName];
		if (!this.currPanel) {
			this.currPanel = new window[panelName](this);
			this.alerts[panelName] = this.currPanel;
			this.basic["tabLayer"].addChild(this.currPanel);
		} else {
			this.basic["tabLayer"].addChild(this.currPanel);
			this.currPanel.onShow();
		}
		this.isShowAlert = true;
	}
	/**检测按钮的开启状态**/
	protected refreshFunOpen(): void {
		// var isShow: boolean = true;
		// for (var ikey in this.lockIDs) {
		// 	var funcID: number = this.lockIDs[ikey];
		// 	var tabbtn: eui.RadioButton = this.tabs[ikey];
		// 	if (funcID < 0) {
		// 		tabbtn.parent.visible = isShow;
		// 		continue;
		// 	}
		// 	if (isShow) {
		// 		tabbtn.parent.visible = true;
		// 		if (!FunDefine.isFunOpen(funcID)) {
		// 			tabbtn.enabled = false;
		// 			isShow = false;
		// 		} else {
		// 			tabbtn.enabled = true;
		// 		}
		// 	} else {
		// 		tabbtn.enabled = false;
		// 		tabbtn.parent.visible = false;
		// 	}
		// }
	}
	private onLevelChange(e: egret.Event): void {
		if (e.data) {
			this.refreshFunOpen();
		}
	}
	public addTabChild(panelName: string): void {
		if (this.currPanel) {
			this.currPanel.onHide();
		}
		this.currPanel = this.allwindows[panelName];
		if (!this.currPanel) {
			this.currPanel = new window[panelName](this.owner);
			this.allwindows[panelName] = this.currPanel;
		}
		this.basic["tabLayer"].addChild(this.currPanel);
		this.currPanel.onShow();
		this.index = -1;
	}
	public trigger(): void {
		super.trigger();
		//this.triggerTabBtns();
		if (this.currPanel) {
			this.currPanel.trigger();
		}
	}
	public get tab(): number {
		return this.index;
	}
	public get subTab(): number {
		let page: RegisterSystemParam = this.getRegisterSystemParam();
		return page ? page.index : -1;
	}
	public getTabBtnGrp(index: number): eui.Group {
		return this.tabFs[index];
	}
	public get currTabPanel() {
		return this.currPanel
	}
}
class RegisterSystemParam {
	public funcID: number = -1;
	public subFuncIDs: number[];
	public sysName: string;
	public btnRes: string;
	public redP: redPoint;
	public title: string;
	public tabBtns: RegisterTabBtnParam[];
	public index: number = 0;

	public constructor(sysName?: string, btnRes?: string, redP?: redPoint) {
		this.sysName = sysName;
		this.btnRes = btnRes;
		this.redP = redP;
	}
	public initRedChild() {
		if (this.tabBtns) {
			let redList = [];
			for (let i = 0; i < this.tabBtns.length; ++i) {
				this.tabBtns[i].setIdx(i);
				if (this.tabBtns[i].redP) {
					redList.push(this.tabBtns[i].redP);
				}
			}
			if (this.redP && redList.length > 0) {
				this.redP.redPointChild = redList;
			}
		}
	}
}
class RegisterTabBtnParam {
	public funcID: number = -1;
	public subFuncIDs: number[];
	public sysName: string;
	public tabBtnRes: string;
	public tabFrame: string;
	public title: string;
	public redP: redPoint;
	private index: number;
	public constructor(sysName?: string, btnRes?: string) {
		this.sysName = sysName;
		this.tabBtnRes = btnRes;
		this.checkBtnRes();
	}
	public setIdx(idx: number) {
		this.index = idx;
	}
	public getIdx() {
		return this.index;
	}
	private checkBtnRes() {
		if (this.tabBtnRes && this.tabBtnRes.indexOf("_png") == -1) {
			this.tabBtnRes = this.tabBtnRes + "_png";
		}
	}
	// public trigger(){
	// 	if (this.funcID > 0) {
	// 		if (FunDefine.onIsLockandErrorHint(this.funcID)){
	// 			return;
	// 		}
	// 	}
	// 	if (this.redP && this.redP.func) {
	// 		this.redP.checkPoint();
	// 	}
	// }
}