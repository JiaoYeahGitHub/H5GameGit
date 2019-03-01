/**
 * 
 * 商店界面
 * @author	lzn	
 * 
 * 
 */
class ShopPanel extends BaseSystemPanel {

	private types: number[];
	private register: boolean = false;

	public constructor(owner: ModuleLayer) {
		super(owner);
	}

	protected onSkinName(): void {
		this.skinName = skins.BasicSkin;
	}
	protected onInit(): void {
		this.onRegist();
		this.setTitle("商城");
		super.onInit();
		this.onRefresh();
	}
	protected onRegist(): void {
		if (this.register) {
			return;
		}

		super.onRegist();
		let sysQueue = [];
		let param: RegisterSystemParam;
		for (let i = 0; i < this.types.length; i++) {
			param = new RegisterSystemParam();
			param.sysName = "ShopTypePanel";
			param.btnRes = ShopDefine.SHOP_NAMEs[this.types[i]];
			sysQueue.push(param);
		}

		param = new RegisterSystemParam();
		param.sysName = "ActivitysXiangouPanel";
		param.btnRes = "限购好礼";
		sysQueue.push(param);

		this.registerPage(sysQueue, "shopGrp", GameDefine.RED_TAB_POS);
		this.register = true;
	}
	protected onRemove(): void {
		super.onRemove();
		this.register = false;
	}
	public onShowWithParam(param): void {
		this.index = param.type;
		this.types = param.types;
		this.onShow();
	}

	public currentShopType(): number {
		return this.types[this.index];
	}

	public static getPayIcon(type: number): string {
		switch (type) {
			//道具
			case SHOP_TYPE.DAOJU:
				return "zuanshi_png";
			//积分
			case SHOP_TYPE.JIFEN:
				return "djifen_png";
			//荣誉
			case SHOP_TYPE.RONGYU:
			case SHOP_TYPE.ARENA:
				return "dgongxun_png";
			case SHOP_TYPE.SHENGWANG:
				return "shengwang_png";
			case SHOP_TYPE.TURNPLATE:
				return "zuanshi_png";
			case SHOP_TYPE.YAOQIANSHU1:
			case SHOP_TYPE.YAOQIANSHU2:
				return "turnplate_integral_icon_png";
		}
	}

	public static getCurrency(goodsType: number, modelID: number = 0): number {
		var _hasitemNum: number = 0;
		switch (goodsType) {
			case GOODS_TYPE.ITEM:
				var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(modelID);
				_hasitemNum = _itemThing ? _itemThing.num : 0;
				break;
			default:
				_hasitemNum = DataManager.getInstance().playerManager.player.getICurrency(goodsType);
				break;
		}
		return _hasitemNum;
	}
}
class ShopParam {
	public types: number[];
	public type: number;
	public constructor(types, type = 0) {
		this.types = types;
		this.type = type;
	}
}