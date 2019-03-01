class ItemBody {

	public itemType: number = -1;
	public itemId: number;
	public itemCount: number;

	public constructor() {
	}

	public parseMsg(msg: Message): void {
		this.itemType = msg.getByte();
		this.itemId = msg.getShort();
		this.itemCount = msg.getInt();
	}
}