class TLShopManager {
	public round: number = 0;
	public record = {};
	public constructor() {
	}
	public parseMessage(msg: Message): void {
		this.record = {};
		var data: TLShopData;
		this.round = msg.getByte();
		var len: number = msg.getShort();
		for (var i: number = 0; i < len; i++) {
			data = new TLShopData();
			data.parseMessage(msg);
			this.record[data.id] = data;
		}
	}
	public parseBuyMessage(msg: Message): void {
		var data: TLShopData = new TLShopData();
		data.parseMessage(msg);
		this.record[data.id] = data;
	}
	public getGoodsByRound() {
		// var ret: ModelTLShop[] = [];
		// var models = ModelManager.getInstance().modelTLShop;
		// for (var key in models) {
		// 	if (models[key].round == this.round) {
		// 		ret.push(models[key]);
		// 	}
		// }
		// return ret;
	}
}
class TLShopData {
	public id;
	public num;
	public parseMessage(msg: Message) {
		this.id = msg.getInt();
		this.num = msg.getInt();
	}
}