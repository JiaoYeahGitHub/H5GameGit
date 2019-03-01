class OneRebateSTManager {
	public buyTime: number = 0;
	public record = [];
	public constructor() {
	}
	// int   购买次数
	// byte   长度
	// 循环int     第几个
	public parseMessage(msg: Message): void {
		this.buyTime = msg.getInt();
		var len: number = msg.getByte();
		this.record = [];
		for (var i: number = 0; i < len; i++) {
			this.record.push(msg.getInt());
		}
	}
	// 158一折神通购买
	// 上行：无
	// 下行：购买了多少个  int    修改本地数据
	public onSendBuyMessage(): void {
		var message = new Message(MESSAGE_ID.ONEREBATEST_BUY_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public parseBuyMessage(msg: Message): void {
		this.buyTime = msg.getInt();
	}
	// 159一折神通领取
	// 上行：领取第几个   int
	// 下行：领取第几个   int       修改本地数据
	public onSendReceiveMessage(index: number): void {
		var message = new Message(MESSAGE_ID.ONEREBATEST_RECEIVE_MESSAGE);
		message.setInt(index);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public parseReceiveMessage(msg: Message): void {
		var id: number = msg.getInt();
		var index: number = this.record.indexOf(id);
		if (index == -1) {
			this.record.push(id);
		}
	}
	public getCanBuyGift(): boolean {
		// var player = DataManager.getInstance().playerManager.player;
		// var model: ModelOneRebateST = ModelManager.getInstance().modelOneRebateST[1]; 
		// if (player.gold >= model.cost.num) return true;
		return false;
	}
	public getCanReceiveGift(): boolean {
		// var dataManager = DataManager.getInstance().oneRebateSTManager;
        // var i: number;
        // var model: ModelOneRebateST = ModelManager.getInstance().modelOneRebateST[1];
        // var need: number;
        // for (i = 0; i < 6; i++) {
        //     need = (i + 1) * 5;
        //     if (dataManager.buyTime >= need && dataManager.record.indexOf(i) == -1) return true;
        // }
		return false;
	}
	public getCanShowRedpoint(): boolean {
		if (DataManager.getInstance().oneRebateSTManager.getCanBuyGift()) return true;
		if (DataManager.getInstance().oneRebateSTManager.getCanReceiveGift()) return true;
		return false;
	}
}