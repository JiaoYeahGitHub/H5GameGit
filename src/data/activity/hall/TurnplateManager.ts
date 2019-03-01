class TurnplateManager {
	public remain: number;
	public awards: AwardItem[];
	public constructor() {
	}
	public parseRunALotteryMessage(msg: Message): void {
		this.awards = [];
		var award: AwardItem;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			award = new AwardItem();
			award.parseMessage(msg);
			this.awards.push(award);
		}
		var param: TurnplateAwardParam = new TurnplateAwardParam();
        param.desc = "转盘获得以下奖励";
        param.titleSource = "";
        param.itemAwards = this.awards;
		param.autocloseTime = 11;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TurnplateAwardPanel", param));
	}
}