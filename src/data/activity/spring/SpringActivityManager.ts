class SpringActivityManager {
	public crashcowFreeTimes: number = 0;//摇钱树免费次数

	public constructor() {
	}
	public getCanShowRedPoint(): boolean {
		if (DataManager.getInstance().tLDogzManager.getCanShowRedPoint())
			return true;
		if (DataManager.getInstance().collectWordManager.getCanShowRedPoint())
			return true;
		if (DataManager.getInstance().springActivityManager.getCanShowCashcowRedPoint())
			return true;
		return false;
	}
	//摇钱树抽奖返回
	public onParseCrashcowLottery(msg: Message): void {
		var awards = [];
		var award: AwardItem;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			award = new AwardItem();
			award.parseMessage(msg);
			awards.push(award);
		}
		this.crashcowFreeTimes = msg.getByte();
		var param: TurnplateAwardParam = new TurnplateAwardParam();
        param.desc = "恭喜您获得以下奖励";
        param.titleSource = "";
        param.itemAwards = awards;
		param.autocloseTime = 11;
        GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TurnplateAwardPanel", param));
	}

	public getCanShowCashcowRedPoint(): boolean {
		return DataManager.getInstance().springActivityManager.crashcowFreeTimes > 0;
	}
	public getCanShowPreheatRedPoint(): boolean {
		if (DataManager.getInstance().springActivityManager.getCanShowCashcowRedPoint())
			return true;
		return false;
	}
}