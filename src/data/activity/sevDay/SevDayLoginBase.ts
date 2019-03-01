class SevDayLoginBase {
	public day;
	public state;
	public constructor(day) {
		this.day = day;
	}
	public parseInfo(msg: Message) {
		this.state = msg.getByte();
	}
}