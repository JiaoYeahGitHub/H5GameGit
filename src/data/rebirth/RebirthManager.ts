class RebirthManager {
	public record = {};
	public constructor() {
		this.onInitExchangeInfo();
	}
	// public get rebirthPower(): number {
		// var player = DataManager.getInstance().playerManager.player;
		// if (player.rebirthLv == 0) return 0;
		// var models = ModelManager.getInstance().modelRebirth;
		// var currModel: ModelRebirth = models[player.rebirthLv];
		// return GameCommon.calculationFighting(currModel.effect);
	// }
	public onSendMessage(): void {
		var message = new Message(MESSAGE_ID.REBIRTH_UPGRAGE_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onSendExchangeVigourMessage(): void {
		var message = new Message(MESSAGE_ID.VIGOUR_EXCHANGE_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	// 671   修为兑换
	// 上行：byte  type
	// 下行：byte  type
	// short  人物等级
	// int   人物经验
	// int   今日兑换次数
	// int   本次兑换修为
	public onParseVigourExchange(msg: Message) {
		this.record[0].surplusNum = msg.getByte();
		DataManager.getInstance().playerManager.player.remainExchageVigourTime = this.record[0].surplusNum;
		var vigourGet: number = msg.getInt();
	}

	public onInitExchangeInfo(): void {
		var types: number[] = [GOODS_TYPE.SHOW, GOODS_TYPE.BOX, GOODS_TYPE.BOX];
		var ids: number[] = [1, 1, 2];
		var len: number = types.length;
		var base: VigourExchange;
		for (var i: number = 0; i < len; i++) {
			base = new VigourExchange(types[i], ids[i]);
			this.record[i] = base;
		}
	}






}
class VigourExchange {
	public type: number;
	public modelID: number;
	public constructor(type: number = 0, modelID: number = 0) {
		this.type = type;
		this.modelID = modelID;
	}
	public parseMessage(msg: Message) {

	}
}
