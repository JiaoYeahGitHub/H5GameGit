class TopRankSimple {
    public rank: number;
	public name: string;
	public vip: number;
    public value: number;
    public fighting: number;

	public constructor() {
		
	}

	public parseMessage(msg: Message) {
        this.rank = msg.getShort();
        this.name = msg.getString();
        this.vip = msg.getByte();
        this.value = msg.getInt();
        this.fighting = msg.getLong();
	}
}