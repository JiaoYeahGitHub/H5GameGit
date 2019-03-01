class TOPRankGiftManager {
	public day: number;
	// public models: ModelTopRankGift[];
	public tabs: number[];
	public zero: number;
	public constructor() {
		this.onGetZero();
	}
	public parseMessage(msg: Message): void {
		this.day = msg.getInt();
		this.getModelData();
		this.onGetZero();
		if (this.day > 6) {
			//DataManager.getInstance().activityManager._activityInfoList[ACTIVITY_TYPE.ACTIVITY_TOPRANKGIFT].isOpen = false;
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CHECKACTIVITY_BTN));
		}
	}
	public onGetZero() {
		var date = new Date();
		var now: number = date.getTime();
		date.setHours(23);
		date.setMinutes(59);
		date.setSeconds(59);
		this.zero = date.getTime();
	}
	public getCountDown(): number {
        return Math.round((this.zero - new Date().getTime()) / 1000);
    }

	public getModelData(): void {
		// this.models = [];
		this.tabs = [];
		// var m: ModelTopRankGift;
		// var models = ModelManager.getInstance().modelTopRankGift;
		// for (var key in models) {
		// 	m = models[key];
		// 	if (m.round == this.day) {
		// 		this.models.push(m);
		// 		if (this.tabs.indexOf(m.type) == -1) {
		// 			this.tabs.push(m.type);
		// 		}
		// 	}
		// }
	}
	// public getModelDataByType(type: number): ModelTopRankGift[] {
	// 	var m: ModelTopRankGift;
	// 	var ret: ModelTopRankGift[] = [];
	// 	for (var i: number = 0; i < this.models.length; i++) {
	// 		m = this.models[i];
	// 		if (m.type == type) {
	// 			ret.push(m);
	// 		}
	// 	}
	// 	return ret;
	// }
	public onSendMessage(): void {
        var message: Message = new Message(MESSAGE_ID.TOPRANK_GIFT_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(message);
    }
}