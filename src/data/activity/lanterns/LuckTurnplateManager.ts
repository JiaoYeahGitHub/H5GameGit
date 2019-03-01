class LuckTurnplateManager {
	public currWheel: number = 1;
	public totalMoney: number;
	public needMoney: number;
	public bidding: number;
	public currAward: number;
	public currInfo: WinPrizeData[] = [];
	public multiple: number[] = [2, 3, 4, 5, 10, 20];
	public constructor() {
	}
	public parseMessage(msg: Message) {
		this.currWheel = msg.getInt();
		this.totalMoney = msg.getInt();
		this.needMoney = msg.getInt();
	}
	public parseWinPrizeMessage(msg: Message) {
		var data: WinPrizeData;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			data = new WinPrizeData();
			data.parseMessage(msg);
			this.currInfo.push(data);
		}
		this.onfilter();
	}
	public getTextFlow(): egret.ITextElement[] {
		var data: WinPrizeData;
		var ret: egret.ITextElement[] = [];
		for (var i: number = 0; i < this.currInfo.length; i++) {
			data = this.currInfo[i];
			ret.push({ text: data.name, style: { textColor: 0x289aea } });
			ret.push({ text: ` 投资${data.invest}钻石获得`, style: { textColor: 0xFFFFFF } });
			ret.push({ text: `${this.multiple[data.gears]}倍返还`, style: { textColor: 0xFAA43E } });
			ret.push({ text: `, 共计`, style: { textColor: 0xFFFFFF } });
			ret.push({ text: `${data.winPrize}银币`, style: { textColor: 0xFAA43E } });
			ret.push({ text: "\n", style: {} });
		}
		ret.pop();
		return ret;
	}
	public parsePlayMessage(msg: Message) {
		var succeed = msg.getByte();
		switch (succeed) {
			case 0:
				GameCommon.getInstance().addAlert("数据异常");
				break;
			case 1:
				break;
			case 2:
				GameCommon.getInstance().addAlert("钻石不足");
				break;
			case 3:
				GameCommon.getInstance().addAlert("未达到充值金额");
				break;
		}
		if (succeed != 1) return;
		this.bidding = msg.getByte();
		this.currAward = msg.getInt();
	}
	private onfilter() {
		while (this.currInfo.length > 10) {
			this.currInfo.shift();
		}
	}
	public onSendMessage() {
		var message = new Message(MESSAGE_ID.INVESTTURNPLATE_LOTTERY_MESSAGE);
        GameCommon.getInstance().sendMsgToServer(message);
	}
	public getCanShowRedPoint() {
		var data = DataManager.getInstance().luckTurnplateManager;
		if (data.needMoney > data.totalMoney) return false;
		// var models = ModelManager.getInstance().modelLuckTurnplate; 
        // var model: ModelLuckTurnplate = models[data.currWheel];
        // if (!model) {
        //     model = models[5];
        // }
		// var player = DataManager.getInstance().playerManager.player;
		// if (model.cost > player.gold) return false;
		return true;
	}
}
class WinPrizeData {
	public name: string;
	public invest: string;
	public gears: string;
	public winPrize: string;
	public parseMessage(msg: Message) {
		this.name = msg.getString();
		this.invest = msg.getString();
		this.gears = msg.getString();
		this.winPrize = msg.getString();
	}
}
class LuckTurnplateWinParam {
	public currAward: number = 0;
	public btnlabel: string = "确定";
	public callFunc = null;
	public callObj = null;
	public callParam = null;
	public autocloseTime: number = 6;
}