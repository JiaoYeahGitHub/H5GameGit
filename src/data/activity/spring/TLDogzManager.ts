class TLDogzManager {
	public record = {};
	public constructor() {
	}
	public parseMessage(msg: Message): void {
		var len: number = msg.getByte();
		var id: number;
		for (var i: number = 0; i < len; i++) {
			id = msg.getByte();
			this.record[id] = id;
		}
	}
	public onSendExchangeMessage(id: number): void {
		var message = new Message(MESSAGE_ID.TLDOGZ_EXCHANGE_MESSAGE);
		message.setByte(id);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public parseExchangeMessage(msg: Message) {
		var id: number = msg.getByte();
		this.record[id] = id;
	}
	public getCanExchangeByID(id: number): boolean {
		var data = DataManager.getInstance().tLDogzManager;
		var bag = DataManager.getInstance().bagManager;
		// var model: ModelTLDogz = ModelManager.getInstance().modelTLDogz[id];
		// if (data.record[id]) return false;
		// if (bag.isOwnThis(model.consume))
		// 	return true;
		return false;
	}

	public getCanShowRedPoint(): boolean {
		// var model: ModelTLDogz;
		// var data = DataManager.getInstance().tLDogzManager;
		// var models = ModelManager.getInstance().modelTLDogz;
		// for (var key in models) {
		// 	model = models[key];
		// 	if (data.getCanExchangeByID(model.id))
		// 		return true;
		// }
		return false;
	}
}