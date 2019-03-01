class TianShiMainPanel extends BaseSystemPanel {

	public constructor(owner) {
		super(owner);
	}
	protected onSkinName(): void {
		this.skinName = skins.PanelSkinActivity;
	}
	protected onInit(): void {
		this.points = [];
		let sysQueue = [];

		let param = new RegisterSystemParam();
		param.redP = this.createRedPoint();
		param.tabBtns = [];// 三级菜单结构体数组

		let pItem: RegisterTabBtnParam = new RegisterTabBtnParam();
		pItem.sysName = "TianShiLevelPanel";
		// pItem.funcID = FUN_TYPE.FUN_EQUIP_SMELT;
		pItem.tabBtnRes = "icon_zhuangbeihuishou_png";
		pItem.title = "天师";
		pItem.redP = this.createRedPoint();
		pItem.redP.addTriggerFuc(DataManager.getInstance().playerManager, "oncheckTianshiRPoint");
		param.tabBtns.push(pItem);

		sysQueue.push(param);
		this.registerPage(sysQueue, "tianshiGrp", new egret.Point(120, -10));

		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		super.onRegist();
	}
	protected onRemove(): void {
		super.onRemove();
	}
	//The end
}
enum TIANSHI_PULS_TYPE {
	// 飞剑0
	FEI_JIAN = 0,
	// 神兵1
	SHEN_BING = 1,
	// 神装2
	SHEN_ZHUANG = 2,
	// 宝器3
	BAO_QI = 3,
	// 仙玉4
	XIAN_YU = 4,
	// 锻造5
	FORGE = 5,
	// 丹药6
	PILL = 6,
	// 战纹7
	RUNE = 7,
	// 红装8
	RED_EQUIP = 8,
	// 天书9
	BOOK = 9,
	// 图鉴10
	TUJIAN = 10,
	// 心法
	XINFA = 11,
	// 神器12
	GOD_ARTIFACT = 12
}