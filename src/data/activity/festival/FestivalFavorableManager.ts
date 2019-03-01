class FestivalFavorableManager {
	public records;
	public record: number[] = [];
	public type: number;
	public constructor() {
	}
	public onParseMessage(msg: Message) {
		var len: number = msg.getByte();
		this.record = [];
		for (var i: number = 0; i < len; i++) {
			this.record.push(msg.getByte());
		}
	}
	public onSendMessage(id: number, type: number) {
		var message: Message = new Message(MESSAGE_ID.REBATE_TO_BUY_MESSAGE);
		message.setByte(id);
		message.setInt(type);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onPraseBuyMessage(msg: Message, type: number) {
		var id: number = msg.getByte();
		if (this.record.indexOf(id)) {
			this.record.push(id);
		}
	}
}