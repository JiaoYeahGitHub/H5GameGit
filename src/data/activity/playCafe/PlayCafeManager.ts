class PlayCafeManager {
	public day: number = 1;
	public record = {};
	public constructor() {
	}
	public onParseMessage(msg: Message) {
		this.day = msg.getByte();
		if (this.day > 3) {
			this.day = 3;
		}
		this.record = {};
		var base: FestivalLoginbase;
		for (var i: number = 1; i <= this.day; i++) {
			base = new FestivalLoginbase();
			base.day = i;
			base.onParseMessage(msg);
			this.record[i] = base;
		}
	}
	public onSendLoginAwardReceive(day: number): void {
		var message: Message = new Message(MESSAGE_ID.PLAYCAFE_EXCLUSIVE_AWARD_RECEIVE);
		message.setByte(day);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onParseLoginAwardReceive(msg: Message): void {
		var base: FestivalLoginbase = this.record[msg.getByte()];
		if (base) {
			base.state = 2;
		}
	}
	public checkLoginAwardCanReceive(): boolean {
		for (var i: number = 1; i <= this.day; i++) {
			if (this.checkLoginAwardCanReceiveByDay(i)) return true;
		}
		return false;
	}
	public checkLoginAwardCanReceiveByDay(day: number) {
		var base: FestivalLoginbase = this.record[day];
		if (!base) return false;
		if (base.state == 1) return true;
		return false;
	}
}