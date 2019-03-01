class WelfareManager {
	public welfare = {};
	public isOpenWelfare: boolean = false;
	public isRecharge: boolean = false;
	public constructor() {
	}
	public parseMessage(msg: Message) {
		var data: WelfareData;
		var len: number = msg.getByte();
		this.isRecharge = false;
		this.welfare = {};
		for (var i: number = 0; i < len; i++) {
			data = new WelfareData();
			data.parseMessage(msg);
			this.welfare[data.id] = data;
			if (data.isAcquire) this.isRecharge = data.isAcquire;
		}
		if (this.isRecharge) {
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GAME_CHECKACTIVITY_BTN));
		}
	}
	public onSendMessage() {
		// var message = new Message(MESSAGE_ID.DAILY_WELFARE_MESSAGE);
		// GameCommon.getInstance().sendMsgToServer(message);
	}
	public isCanShowWelfare() {
		var data: WelfareData;
		for (var key in DataManager.getInstance().welfareManager.welfare) {
			data = DataManager.getInstance().welfareManager.welfare[key];
			if (!data.isAcquire && DataManager.getInstance().playerManager.player.level == 20) {
				DataManager.getInstance().welfareManager.isOpenWelfare = true;
				return true;
			}
		}
		return false;
	}
}
class WelfareData {
	public id;
	public isAcquire: boolean;
	public parseMessage(msg: Message) {
		this.id = msg.getByte();
		this.isAcquire = msg.getByte() == 1;
	}
}