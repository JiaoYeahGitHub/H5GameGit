class CollectWordManager {
	public roundNum;//轮数

	public constructor() {
	}
	public parseMsg(msg: Message): void {
	}
	public parseActMessage(msg: Message): void {
		this.roundNum = msg.getByte();
	}
	public onSendExchangeMessage(id: number): void {
		var message = new Message(MESSAGE_ID.COLLECTWORD_EXCHANGE_MESSAGE);
		message.setByte(id);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public getCanShowRedPoint(): boolean {
		for (let wordId in JsonModelManager.instance.getModelfeastjizi()) {
			let model: Modelfeastjizi = JsonModelManager.instance.getModelfeastjizi()[wordId];
			if (model.round == DataManager.getInstance().collectWordManager.roundNum) {
				let index: number = 0;
				for (let i: number = 0; i < model.costList.length; i++) {
					let costitem: AwardItem = model.costList[i];
					let bagHasNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(costitem.id);
					if (bagHasNum < costitem.num) break;
					index++;
				}
				if (index == model.costList.length) return true;
			}
		}
		return false;
	}
}
class CollectWordData {
	public id: number;
}