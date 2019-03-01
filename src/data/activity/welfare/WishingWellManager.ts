class WishingWellManager {
	private round: number = 0;
	public time: number = 0;
	public record: number[] = [];
	public currAwardID: number;
	public constructor() {
	}
	public onParseMessage(msg: Message): void {
		this.record = [];
		this.round = msg.getByte();
		this.time = msg.getByte();
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			this.record.push(msg.getByte());
		}
	}
	public get data(): Modelxuyuanchi {
		var model: Modelxuyuanchi;
		var models = JsonModelManager.instance.getModelxuyuanchi();
		for (var key in models) {
			if (models[key].round == this.round) {
				model = models[key];
			}
		}
		return model;
	}
	// 173  许愿
	// 上行：无
	// 下行：byte  许了多少次
	// byte  第几个奖励  从0开始
	public onSendMessage(): void {
		var message = new Message(MESSAGE_ID.WISHINGWELL_ADVANCE_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onParseAdvanceMessage(msg: Message): void {
		this.time = msg.getByte();
		this.currAwardID = msg.getByte();
		this.record.push(this.currAwardID);
	}
}