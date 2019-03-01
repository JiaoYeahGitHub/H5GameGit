enum SHOP_TYPE {
	DAOJU = 0,//普通
	JIFEN = 1,//积分
	RONGYU = 2,//战功
	ARENA = 3,
	SHENGWANG = 4,//声望
	TURNPLATE = 5,//神秘
	YAOQIANSHU1 = 6,
	YAOQIANSHU2 = 7,
}

class ShopDefine {
	public static readonly SHOP_NAMEs: string[] = ['普通商店', '积分商店', '战功商店', '功勋商店', '跨服商店', '神秘商店', '摇钱树', '摇钱树'];
	/**默认商城类型**/
	public static SHOP_TYPES: number[] = [SHOP_TYPE.TURNPLATE, SHOP_TYPE.JIFEN];
	public static openDefaultShopView(index: number = 0): void {
		let param = new ShopParam(ShopDefine.SHOP_TYPES, index);
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("ShopPanel", param));
	}
}