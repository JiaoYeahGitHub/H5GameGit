/**
 * 商店管理类
 * @author	lzn
 * 
 * 
 */
class ShopManager {
	public classify;
	public timedate: number;
	public shenmiarr;
	public discountMap = {};//折扣信息
	public restrictionBuy = {};
	public constructor() {
		this.goodsclassify();
	}
	/*商品分类*/
	public goodsclassify() {
		this.classify = {};
		var model: Modelshop;
		var data = JsonModelManager.instance.getModelshop();
		for (var key in data) {
			model = data[key];
			if (!this.classify[model.shopType]) {
				this.classify[model.shopType] = [];
			}
			this.classify[model.shopType].push(model);
		}
	}
	
	/**返回折扣信息**/
	public onParseDiscountMsg(msg: Message): void {
		this.discountMap = {};
		var saleSize: number = msg.getByte();
		for (var i: number = 0; i < saleSize; i++) {
			var shoptype: number = msg.getByte();
			var saleRate: number = msg.getByte();
			this.discountMap[shoptype] = saleRate;
		}
		var len:number = msg.getShort();
		for (var i: number = 0; i < len; i++) {
			var itemId: number = msg.getInt();
			var itemNum: number = msg.getInt();
			this.restrictionBuy[itemId] = itemNum;
		}
	}
	/*通过商品类型获取商品*/
	public getGoodsByTye(type): Modelshop[] {
		return this.classify[type];
	}
}