class TotalRechargeManager {
	public total: number;
	public round: number;
	
	public constructor() {
	}
	public parseMessage(msg: Message) {
		this.total = msg.getInt();
		this.round = msg.getByte();
	}
}