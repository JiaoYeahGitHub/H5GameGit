class TreasureRankManager {
	public activityId: number;//区分是哪个寻宝榜
	public round: number;
	public my_integral: number = 0;
	public record = {};
	public constructor() {
	}
	// byte    当前第几轮
	// byte     size    长度
	// 循环读取：int    玩家ID
	// string   玩家名字
	// int    积分
	// byte   VIP
	// byte   头像
	public parseMessage(msg: Message) {
		this.round = msg.getByte();
		this.my_integral = msg.getInt();
	}
	public onSendMessage(): void {
		var message: Message = new Message(MESSAGE_ID.TREASURE_RANK_LIST_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	/**
	 * 寻宝排行榜消息
	 */
	public parseTreasureRankMessage(msg: Message) {
		this.my_integral = msg.getInt();
		this.record = {};
		var base: TreasureRankBase;
		var len: number = msg.getByte();
		for (var i: number = 1; i <= len; i++) {
			base = new TreasureRankBase();
			base.parseMessage(msg);
			this.record[i] = base;
		}
	}
	public get data() {
		var ret: Modelxunbaobang[] = [];
		var model: Modelxunbaobang;
		var models;
		switch (this.activityId) {
			case ACTIVITY_BRANCH_TYPE.TREASURE_RANK:
				models = JsonModelManager.instance.getModelxunbaobang();
				break;
			case ACTIVITY_BRANCH_TYPE.TREASURE_RANK2:
				models = JsonModelManager.instance.getModelxunbaobang2();
				break;
			default:
				models = JsonModelManager.instance.getModelxunbaobang();
				break;
		}
		var rank: number = 1;
		for (var key in models) {
			model = models[key];
			if (model.round == this.round) {
				model.currRank = rank;
				ret.push(model);
				rank++;
			}
		}
		return ret;
	}

}
class TreasureRankBase {
	public playerID: number;
	public name: string;
	public integral: number;
	public vipLv: number;
	public headID: number;
	public headFrame: number;
	public parseMessage(msg: Message) {
		this.playerID = msg.getInt();
		this.name = msg.getString();
		this.integral = msg.getInt();
		this.vipLv = msg.getByte();
		this.headID = msg.getByte();
		this.headFrame = msg.getByte();
	}
}