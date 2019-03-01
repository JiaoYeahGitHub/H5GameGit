class TLGiftManager {

	public type;
	public value;
	public record = {};
	// public objectives: ModelTLGift[];
	public constructor() {
	}
	public parseMessage(msg: Message): void {
		this.type = msg.getByte();
		this.value = msg.getInt();
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			var id: number = msg.getByte();
			this.record[id] = id;
		}
		this.onInitObjectives();
	}
	public onSortObjectives() {
		var data = DataManager.getInstance().tLGiftManager;
		// this.objectives = this.objectives.sort((n1: ModelTLGift, n2: ModelTLGift) => {
		//     if (n1.sortKey < n2.sortKey) {
		//         return -1;
		//     } else {
		//         return 1;
		//     }
		// });
	}
	public onInitObjectives() {
		// this.objectives = [];
		var keys;
		var id;
		var type;
		var item: TLGiftItem;
		var n: number = 0;
		// var model: ModelTLGift;
		// var models = ModelManager.getInstance().modelTLGift;
		// var data = DataManager.getInstance().tLGiftManager;
		// for (var key in models) {
		//     keys = key.split("_");
		//     id = parseInt(keys[0]);
		//     type = parseInt(keys[1]);
		//     if (this.type == type) {
		// 		model = models[key];
		// 		model.sortKey = n;
		// 		if (data.record[model.key]) {//领取
		// 			model.sortKey += 10000;
		// 		} else {//未领取
		// 			if (data.value < model.mubiao) {
		// 				model.sortKey += 100;
		// 			}
		// 		}
		// 		this.objectives.push(model);
		// 		n++;
		//     }
		// }
		this.onSortObjectives();
	}
	public parseObtainMessage(msg: Message) {
		var id: number = msg.getByte();
		this.record[id] = id;
		this.onInitObjectives();
	}
	public getCanObtainAward() {
		// var model: ModelTLGift;
		// var item: TLGiftItem;
		// var data = DataManager.getInstance().tLGiftManager;
		// for (var i: number = 0; i < data.objectives.length; i++) {
		// 	model = data.objectives[i];
		// 	if (!data.record[model.key] && data.value >= model.mubiao) {
		// 		return true;
		// 	}
		// }
		return false;
	}
}