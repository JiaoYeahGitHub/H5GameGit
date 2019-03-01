class SpatBloodManager {
	public round: number = 0;
	public recharge: number = 0;
	public record = {};
	public constructor() {
	}
	public get data() {
		// var ret: ModelSpatBlood[] = [];
		// var record = {};
		// var models = ModelManager.getInstance().modelSpatBlood;
		// var model: ModelSpatBlood;
		// for (var key in models) {
		// 	model = models[key];
		// 	if (model.round == this.round) {
		// 		model.sortKey = parseInt(model.id);
		// 		var money: number = model.chongzhi;
		// 		var currBuy: number = 0;
		// 		if (this.record[model.id]) {
		// 			currBuy = this.record[model.id];
		// 		}
		// 		var canBuy: number = Math.floor(this.recharge / money);
		// 		if (canBuy > model.max) {
		// 			canBuy = model.max;
		// 		}
		// 		if (canBuy <= 0) {//不可购买
		// 			model.sortKey += 100;
		// 		} else {
		// 			if (currBuy >= 3) {
		// 				model.sortKey += 10000;
		// 			}
		// 		}
		// 		ret.push(model);
		// 	}
		// }
		// ret = ret.sort((n1: ModelSpatBlood, n2: ModelSpatBlood) => {
		//     if (n1.sortKey < n2.sortKey) {
		//         return -1;
		//     } else {
		//         return 1;
		//     }
		// });
		// return ret;
		return null;
	}
	// byte   活动数据轮次
	// int    今日充值元宝数
	// byte   购买记录长度
	// 循环读取   int    id
	// int    数量
	// 没有购买的不发送
	public parseMessage(msg: Message): void {
		this.round = msg.getByte();
		this.recharge = msg.getInt();
		var id: number;
		var num: number;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			id = msg.getInt();
			num = msg.getInt();
			this.record[id] = num;
		}
	}
	// 157消息  购买一元抢购
	// int  id
	// 回复  Int  id
	// int  次数    需要自己修改本地的购买记录
	public parseBuyMessage(msg: Message): void {
		var id: number = msg.getInt();
		var num: number = msg.getInt();
		this.record[id] = num;
	}
	public onSendBuyMessage(id: number): void {
		var message = new Message(MESSAGE_ID.SPATBLOOD_BUY_MESSAGE);
		message.setInt(id);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public getCanShowRedpoint(): boolean {
		var manager = DataManager.getInstance().spatBloodsManager;
		if (manager.recharge == 0) return false;
		// var models = ModelManager.getInstance().modelSpatBlood;
		// var model: ModelSpatBlood;
		// for (var key in models) {
		// 	model = models[key];
		// 	if (model.round == manager.round) {
		// 		var money: number = model.chongzhi;
		// 		var currBuy: number = 0;
		// 		if (manager.record[model.id]) {
		// 			currBuy = manager.record[model.id];
		// 		}
		// 		var canBuy: number = Math.floor(manager.recharge / money);
		// 		if (canBuy > model.max) {
		// 			canBuy = model.max;
		// 		}
		// 		if (canBuy > 0) {
		// 			if (currBuy < canBuy) {
		// 				return true;
		// 			}
		// 		}
		// 	}
		// }
		return false;
	}
}