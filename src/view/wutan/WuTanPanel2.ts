class WuTanPanel2 extends BaseWindowPanel {
	private static pageNum: number = 6;
	public priority = PANEL_HIERARCHY_TYPE.II;
	private wutanManager: WuTanManager;
	private itemTops: WuTanItemTop[];
	private itemDowns: WuTanItemDown[];
	private groupScroller: eui.Group;
	private lbPage: eui.Label;
	private btnLeft: eui.Button;
	private btnRight: eui.Button;
	// private btnClose: eui.Button;
	private lbTopMin1: eui.Label;
	private lbTopMin2: eui.Label;

	private type: number;
	private itemMax: number;
	private pageMax: number;
	private currPage: number;
	public constructor(owner: ModuleLayer) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.WuTanPanel2Skin;
	}
	public onShowWithParam(param): void {
		this.type = param + 1;
		this.onShow();
	}
	protected onInit(): void {
		super.onInit();
		this.setTitle("武坛");
		this.initUI();
	}
	private initUI() {
		this.wutanManager = DataManager.getInstance().wuTanManager;
		this.itemTops = [];
		for (let i: number = 0; i < 3; i++) {
			this.itemTops[i] = this['topitem' + i];
			this.itemTops[i].name = i.toString();
			this.itemTops[i].touchChildren = false;
			this.itemTops[i].touchEnabled = true;
			this.itemTops[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventTop, this);
		}
		this.itemDowns = [];
		for (let i: number = 0; i < WuTanPanel2.pageNum; i++) {
			this.itemDowns[i] = new WuTanItemDown(this);
			// this.itemDowns[i].x = (i % 3) * 150;
			// this.itemDowns[i].y = Math.floor(i / 3) * 170;
			this.groupScroller.addChild(this.itemDowns[i]);
			this.itemDowns[i].update(null);
		}
	}
	protected onRegist(): void {
		super.onRegist();
		// let list = [this.wutanManager.getModel(this.type, 1), this.wutanManager.getModel(this.type, 2), this.wutanManager.getModel(this.type, 3)];
		// for (let i = 0; i < list.length; ++i) {
		// 	this.itemTops[i].init(this.wutanManager, list[i]);
		// }
		for (let i: number = 0; i < WuTanPanel2.pageNum; i++) {
			this.itemDowns[i].update(null);
		}
		// this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventLeft, this);
		this.btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventRight, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.WUTAN_LIST_GET_MESSAGE.toString(), this.onCallList, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.WUTAN_HEART_MESSAGE.toString(), this.onCallRefresh, this);

		let modelMin: Modelwutan = this.wutanManager.getModel(this.type, 4);
		this.lbTopMin1.text = WuTanManager.fontExp + "：" + (WuTanManager.getValueExp(modelMin) * 60) + "/小时";
		this.lbTopMin2.text = WuTanManager.fontGas + "：" + (WuTanManager.getValueGas(modelMin) * 60) + "/小时";
		this.pageMax = Math.floor(modelMin.num / WuTanPanel2.pageNum) + (modelMin.num % WuTanPanel2.pageNum > 0 ? 1 : 0);
		this.itemMax = modelMin.num + 3;
		this.currPage = 0;
		this.sendPageReq();
	}
	protected onRemove(): void {
		super.onRemove();
		// this.btnClose.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchCloseBtn, this);
		this.btnLeft.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventLeft, this);
		this.btnRight.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventRight, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.WUTAN_LIST_GET_MESSAGE.toString(), this.onCallList, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.WUTAN_HEART_MESSAGE.toString(), this.onCallRefresh, this);
	}
	private sendPageReq(page: number = -1) {
		if (page < 0) {
			this.wutanManager.sendListMessage(this.type, 0, 3);
		} else {
			let startIdx = page * WuTanPanel2.pageNum + 3;
			let count = Math.min(this.itemMax - startIdx, WuTanPanel2.pageNum);
			this.wutanManager.sendListMessage(this.type, startIdx, count);
		}
	}
	private onCallRefresh() {
		this.sendPageReq();
	}
	private onCallList(event: GameMessageEvent) {
		let wuTanInfo: WuTanResponseInfo = event.message;
		this.type = wuTanInfo.type;
		if (wuTanInfo.isTop()) {
			for (let i = 0; i < wuTanInfo.bodySize; ++i) {
				this.itemTops[i].update(wuTanInfo.bodyList[i]);
			}
		} else {
			for (let i = 0; i < WuTanPanel2.pageNum; ++i) {
				if (wuTanInfo.bodyList[i]) {
					this.itemDowns[i].update(wuTanInfo.bodyList[i]);
					this.itemDowns[i].visible = true;
				} else {
					this.itemDowns[i].visible = false;
				}
			}
		}
		if (wuTanInfo.isTop()) {
			this.sendPageReq(this.currPage);
		} else {
			this.currPage = Math.floor((wuTanInfo.startIdx - 3) / WuTanPanel2.pageNum);
			this.lbPage.text = (this.currPage + 1) + "/" + this.pageMax;
		}
	}
	protected onRefresh(): void {
		super.onRefresh();
	}
	private onEventLeft() {
		if (this.currPage > 0) {
			--this.currPage;
			this.sendPageReq(this.currPage);
		}
	}
	private onEventRight() {
		if (this.currPage < this.pageMax - 1) {
			++this.currPage;
			this.sendPageReq(this.currPage);
		}
	}
	private onEventTop(e: egret.TouchEvent) {
		let data: WuTanListbody = this.itemTops[parseInt(e.target.name)].data;
		this.onEventBody(data);
	}
	public onEventBody(data: WuTanListbody) {
		if (data) {
			let windowParam: WindowParam = null;
			if (data.isEmpty()) {
				windowParam = new WindowParam("WuTanAlertBuy", new WuTanAlertParam(this.onDealBuy, this, data));
			} else if (data.isSelf()) {
				windowParam = new WindowParam("WuTanAlertSelf", new WuTanAlertParam(null, null, data));
			} else {
				windowParam = new WindowParam("WuTanAlertFight", new WuTanAlertParam(this.onDealFight, this, data));
			}
			if (windowParam) {
				GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), windowParam);
			}
		} else {
			egret.log("onEventBody - null");
		}
	}
	private onDealBuy(data: WuTanListbody) {
		this.wutanManager.sendBuyMessage(this.type, data.towerIdx);
	}
	private onDealFight(data: WuTanListbody) {
		this.wutanManager.setFightData(this.type, data.towerIdx);
		GameFight.getInstance().onEnterWuTanScene(this.type, data.towerIdx, data.playerData.id);
	}
}
class WuTanItemTop extends eui.Component {
	public roleGroup: eui.Group;
	public name_lab: eui.Label;
	public power_lab: eui.Label;
	public exp_lab: eui.Label;
	public zhangong_lab: eui.Label;

	public roleAppear: RoleAppearBody;
	public data: WuTanListbody;
	public constructor() {
		super();
		this.once(egret.Event.COMPLETE, this.onInit, this);
	}
	public onInit() {
	}
	public update(data: WuTanListbody) {
		this.data = data;
		if (data == null || data.isEmpty()) {
			this.currentState = "DEFAULT";
		} else {
			this.currentState = "INFO";
			this.name_lab.text = data.playerData.name;
			this.power_lab.text = '' + data.playerData.fightvalue;
			if (!this.roleAppear) {
				this.roleAppear = new RoleAppearBody();
				this.roleGroup.addChild(this.roleAppear);
			}
			let appears: number[] = [];// 外型列表
			for (let i: number = 0; i < BLESS_TYPE.SIZE; i++) {
				appears[i] = data.showAppear.appears[i];
			}
			this.roleAppear.updateAvatarAnim(appears, data.showAppear.sex);
			this.exp_lab.text = "经验：" + (WuTanManager.getValueExp(data.getModel()) * 60) + "/小时";
			this.zhangong_lab.text = "战功：" + (WuTanManager.getValueGas(data.getModel()) * 60) + "/小时";
		}
	}
}
class WuTanItemDown extends eui.Component {
	public wuTanPanel2: WuTanPanel2;
	public groupBtn: eui.Group;
	public imgHead: PlayerHeadUI;
	public lbInfo: eui.Label;
	public power_lb: eui.Label;
	// public imgInfoBG: eui.Image;
	public data: WuTanListbody;
	public constructor(wuTanPanel2: WuTanPanel2) {
		super();
		this.wuTanPanel2 = wuTanPanel2;
		this.skinName = skins.WuTanItemSkin;
		this.groupBtn.touchChildren = false;
		this.groupBtn.touchEnabled = true;
		this.groupBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventTouch, this);
	}
	public update(data: WuTanListbody) {
		this.data = data;
		if (data == null || data.isEmpty()) {
			this.currentState = "DEFAULT";
			this.imgHead.onClear();
		} else {
			this.currentState = "INFO";
			this.lbInfo.text = data.playerData.name;
			this.power_lb.text = "" + data.playerData.fightvalue;
			this.imgHead.setHead(data.playerData.headindex, data.playerData.headFrame);
		}
	}
	private onEventTouch() {
		this.wuTanPanel2.onEventBody(this.data);
	}
}