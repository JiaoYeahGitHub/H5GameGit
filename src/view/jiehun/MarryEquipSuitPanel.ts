class MarryEquipSuitPanel extends BaseTabView {
	protected points: redPoint[] = RedPointManager.createPoint(5);
	private tabs: eui.RadioButton[];
	private currPro: eui.Label;
	private powerbar: PowerBar;
	private btnQHDS: eui.Button;
	private btnCopy: eui.Button;
	private itemList: MarryEquipSuitItem[];
	private currTabId: number;
	private currIdx: number;
	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.MarryEquipSuitSkin;
	}
	protected onInit(): void {
		super.onInit();
		this.tabs = [];
		let tabNames: string[] = this.ringManager.initTabNames();
		let count = this.ringManager.STRONGER_TYPES.length;
		for (let i = 0; i < 5; ++i) {
			this.tabs[i] = this["tab" + i] as eui.RadioButton;
			if (i < count) {
				this.tabs[i].labelDisplay.text = tabNames[i] ? tabNames[i] : "";
				this.tabs[i].iconDisplay.source = "marry_tz1_icon_0_png";
				let pinzhi = this.tabs[i].value;
				this.points[i].register(this.tabs[i], new egret.Point(70, 0), this.ringManager, 'checkTZRedPointTab', pinzhi);
				this.tabs[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTab, this);
				this.tabs[i].visible = true;
			} else {
				this.tabs[i].visible = false;
			}
		}
		this.itemList = [];
		for (let i = 0; i < 10; ++i) {
			let item = this["item" + i] as MarryEquipSuitItem;
			item.name = i.toString();
			item.init(i);
			item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchItem, this);
			this.itemList[i] = item;
		}
		this.currTabId = this.tabs[0].value;
	}
	protected onRegist(): void {
		super.onRegist();
		this.btnQHDS.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventQHDS, this);
		this.btnCopy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventCopy, this);
		GameCommon.getInstance().addMsgEventListener(MESSAGE_ID.MARRIAGE_EQUIP_LEVELUP_MESSAGE.toString(), this.updateCurrItem, this);
		this.updateUI();
	}
	protected onRemove(): void {
		super.onRemove();
		this.btnQHDS.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventQHDS, this);
		this.btnCopy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEventCopy, this);
		GameCommon.getInstance().removeMsgEventListener(MESSAGE_ID.MARRIAGE_EQUIP_LEVELUP_MESSAGE.toString(), this.updateCurrItem, this);
	}
	private onEventQHDS() {
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("MarryEquipSuitQHDS", this.currTabId));
	}
	private onEventCopy() {
		if (FunDefine.onIsLockandErrorHint(FUN_TYPE.FUN_MARRY_EQUIP_SUIT_BOSS)) return;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN), "MarryEquipSuitBoss");
	}
	private onTouchItem(event: egret.TouchEvent): void {
		let idx = parseInt(event.currentTarget.name);
		this.currIdx = idx;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("MarryEquipSuitLevelup", this.itemList[idx]));
	}
	private onTouchTab(event: egret.TouchEvent): void {
		let button: eui.RadioButton = event.currentTarget;
		if (this.currTabId != button.value) {
			this.currTabId = button.value;
			this.updateUI();
		}
	}
	private updateUI() {
		for (let i = 0; i < this.tabs.length; ++i) {
			this.tabs[i].selected = this.tabs[i].value == this.currTabId;
		}
		this.updateCurrItem();
	}
	private updateCurrItem() {
		let models = JsonModelManager.instance.getModeljiehuntaozhuang();
		for (let k in models) {
			let model: Modeljiehuntaozhuang = models[k];
			if (model.taozhuang == this.currTabId) {
				this.itemList[model.type - 1].setData(model, this.ringManager.getLevelEquipSuit(model.id));
			}
		}
		let tempAttribute: number[] = this.ringManager.getMarryRingAttributeType(this.currTabId);
		this.powerbar.power = GameCommon.calculationFighting(tempAttribute);
		let attLeft = "";
		for (let i = 0; i < 4; i++) {
			attLeft += GameDefine.Attr_FontName[i] + "：+" + tempAttribute[i] + "\n";
		}
		this.currPro.text = attLeft;
	}

	private get ringManager() {
		return DataManager.getInstance().ringManager;
	}
}

class MarryEquipSuitItem extends eui.Component {
	public bg: eui.Image;
	public redoint: eui.Image;
	private icon: eui.Image;
	private labelDisplay: eui.Label;
	public idx: number;
	public model: Modeljiehuntaozhuang;
	public level: number;
	public isCheckRedPoint: boolean;
	public constructor() {
		super();
	}
	public init(idx: number, isRedPoint: boolean = true) {
		this.idx = idx;
		this.isCheckRedPoint = isRedPoint;
	}
	public setSkinName() {
		this.skinName = this.getSkinName(this.idx);
	}
	private getIconType(idx) {
		switch (idx) {
			case 4:
			case 5:
				return 1;
			case 6:
			case 7:
				return 2;
			case 8:
			case 9:
				return 3;
			default:
				return 0;
		}
	}
	private getSkinName(idx: number) {
		switch (idx) {
			case 4:
			case 5:
				return skins.MarryEquipSuitItem1Skin;
			case 6:
			case 7:
				return skins.MarryEquipSuitItem2Skin;
			case 8:
			case 9:
				return skins.MarryEquipSuitItem3Skin;
			default:
				return skins.MarryEquipSuitItem0Skin;
		}
	}

	public setData(model: Modeljiehuntaozhuang, level: number) {
		this.level = level;
		this.model = model;
		this.update();
	}
	public update() {
		this.labelDisplay.text = "+" + this.level;
		this.icon.source = this.model.waixing1;
		// this.icon.source = "marry_tz_icon_" + this.getIconType(this.idx) + "_png";
		this.redoint.visible = this.isRedPoint();
	}
	public isRedPoint(): boolean {
		if (this.isCheckRedPoint && this.model && this.model.cost) {
			return DataManager.getInstance().bagManager.getGoodsThingNumById(this.model.cost.id, this.model.cost.type) >= this.model.cost.num;
		}
		return false;
	}
}