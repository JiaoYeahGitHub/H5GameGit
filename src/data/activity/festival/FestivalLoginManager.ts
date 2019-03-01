class FestivalLoginManager {
	public activityID: number;
	public day: number = 1;
	public record = {};
	public constructor() {
	}
	public onParseMessage(msg: Message) {
		this.day = msg.getByte();
		// if (this.day > 5) {
		// 	this.day = 5;
		// }
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
		var cmdID: number;
		switch (this.activityID) {
			case ACTIVITY_BRANCH_TYPE.FESTIVAL_LOGIN:
				cmdID = MESSAGE_ID.FESTIVAL_LOGIN_AWARD_RECEIVE;
				break;
			case ACTIVITY_BRANCH_TYPE.FESTIVAL_LOGIN2:
				cmdID = MESSAGE_ID.WEEKEND_LOGIN_AWARD_RECEIVE;
				break;
		}
		var message: Message = new Message(cmdID);
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
class FestivalLoginbase {
	public day: number;
	//0--未登录  1--已登录  2--已领取
	public state: number;
	public constructor() {
	}
	public onParseMessage(msg: Message) {
		this.state = msg.getByte();
	}
}