class OrangeFeastManager {
	public canBuyID: number = 0;
	public currIndex: number = 0;
	public constructor() {
	}
	public parseMessage(msg: Message): void {
		this.canBuyID = msg.getInt();
		this.currIndex = msg.getInt();
	}
}