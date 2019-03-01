class SevDayObjectivebase {
	public id;
	public currNum;
	public getNum;
	public constructor() {
	}
	public parseInfo(msg: Message) {
		this.id = msg.getShort();
		this.currNum = msg.getInt();
		this.getNum = msg.getInt();
	}
}