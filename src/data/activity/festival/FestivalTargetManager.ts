class FestivalTargetManager {
	public activityId: number;//活动id
	public round: number;
	public gear: number;
	public consume: number;
	public record = {};
	public constructor() {
	}
	public onParseMessage(msg: Message) {
		this.round = msg.getByte();
		this.gear = msg.getByte();
		this.consume = msg.getInt();
	}
	public onSendTargetAwardReceive(): void {
		var message: Message = new Message(MESSAGE_ID.FESTIVAL_TARGET_AWARD_RECEIVE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onSendPayTargetAwardReceive(): void {
		var message: Message = new Message(MESSAGE_ID.PAY_TARGET_AWARD_RECEIVE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onParseTargetAwardReceive(msg: Message): void {
		this.gear = msg.getByte();
	}

	public onSendTargetRankList(): void {
		var message: Message = new Message(MESSAGE_ID.FESTIVAL_TARGET_RANKLIST_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}

	public onSendPayTargetRankList(): void {
		var message: Message = new Message(MESSAGE_ID.PAY_TARGET_RANKLIST_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	// byte   长度
	// 循环：
	// byte   名次
	// string  名字
	// byte   vip
	// int    value1   花费了多少钻石
	// int    value2   备用
	public onParseTargetRankList(msg: Message): void {
		var len: number = msg.getByte();
		var base: FestivalTargetRankbase;
		this.record = {};
		for (var i: number = 0; i < len; i++) {
			base = new FestivalTargetRankbase();
			base.onParseMessage(msg);
			this.record[base.rank] = base;
		}
	}
	public get data(): TopRankSimple[] {
		var rank: TopRankSimple;
		var base: FestivalTargetRankbase;
		var ret: TopRankSimple[] = [];
		for (var key in this.record) {
			base = this.record[key];
			if (base.rank >= 4) {
				rank = new TopRankSimple();
				rank.rank = base.rank
				rank.name = base.name
				rank.vip = base.vip;
				rank.value = base.value1;
				rank.fighting = base.value2;
				ret.push(rank);
			}
		}
		return ret;
	}
}
class FestivalTargetRankbase {
	public rank: number;
	public name: string;
	public vip: number;
	public value1: number;
	public value2: number;
	public constructor() {
	}
	public onParseMessage(msg: Message) {
		this.rank = msg.getByte();
		this.name = msg.getString();
		this.vip = msg.getByte();
		this.value1 = msg.getInt();
		this.value2 = msg.getInt();
	}
}