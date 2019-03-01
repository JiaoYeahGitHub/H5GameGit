class WXDanChongManager {
	public day: number = 1;
	public record: number[] = [];
	public constructor() {
	}
	public onParseMessage(msg: Message) {
		var len = msg.getByte();
		this.record = [];
		for (var i: number = 0; i < len; i++) {
			this.record.push(msg.getByte());
		}
		this.day = msg.getByte();
	}
}