class GemManager {
	public constructor() {
	}
	public onSendMessage(equipID: number, slot: number, modelID: number): void {
		var message = new Message(MESSAGE_ID.GEM_INLAY_MESSAGE);
		message.setByte(equipID);
		message.setByte(slot);
		message.setShort(modelID);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	//获得合成列表
	public getSyntheticByType(type: number): Modelbaoshi[] {
		var ret: Modelbaoshi[] = [];
		// var models = JsonModelManager.instance.getModelbaoshi();
		// var model: Modelbaoshi;
		// for (var key in models) {
		// 	model = models[key];
		// 	if (model.type == type) {
		// 		ret.push(model);
		// 	}
		// }
		// ret.shift();
		return ret;
	}
	public onSendSyntheticMessage(modelID: number, num: number) {
		var message = new Message(MESSAGE_ID.GEM_SYNTHETIC_MESSAGE);
		message.setShort(modelID);
		message.setInt(num);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public parseSynthetic(msg: Message): void {
		var modelID: number = msg.getShort();
	}
	public getCanUpgradeByModelID(modelID): boolean {
		return false;
	}
	public getCanUpgradeByType(type: number): boolean {
		var ret: GemThing[] = [];
		var n: number;
		var model: Modelbaoshi;
		// var models = ModelManager.getInstance().modelGem;
		// var bag = DataManager.getInstance().bagManager;
		// ret = bag.getOneSeriesGemByGemType(type);
		// for (var j: number = 0; j < ret.length; j++) {
		// 	n = Math.floor(ret[j].num / 2);
		// 	model = models[ret[j].modelId + 1];
		// 	if (n > 0 && ret[j].model.type == model.type) {
		// 		return true;
		// 	}
		// }
		return false;
	}
	//合成宝石红点检测
	public getCanUpgrade(): boolean {
		for (var i: number = 0; i < 5; i++) {
			if (DataManager.getInstance().gemManager.getCanUpgradeByType(i)) return true;
		}
		return false;
	}
	public getCanChangeAndUpgrade(): boolean {
		for (var i: number = 0; i < 8; i++) {
			if (DataManager.getInstance().gemManager.getCanGemInlayByEquipSlot(i)) return true;
		}
		return false;
	}
	public getCanGemInlayByEquipSlot(equipSlot: number): boolean {
		// var base: EquipSlotThing = DataManager.getInstance().playerManager.player.data.getEquipSlotThings(equipSlot);
		// for (var i: number = 0; i < base.gemIDs.length; i++) {
		// 	if (DataManager.getInstance().gemManager.getCanGemInlayByGemSlot(i, base.gemIDs[i])) {
		// 		return true;
		// 	}
		// }
		return false;
	}
	public getCanGemInlayByGemSlot(gemSlot: number, modelID: number): boolean {
		var n: number;
		// var model: ModelGem = ModelManager.getInstance().modelGem[modelID];
		// var thing: GemThing;
		// var bag = DataManager.getInstance().bagManager;
		// var ret = bag.getOneSeriesOBJGemByGemType(gemSlot);
		// thing = ret[modelID];
		// model = ModelManager.getInstance().modelGem[modelID + 1];
		// if (thing && model) {
		// 	n = Math.floor((thing.num + 1) / 2);
		// 	if (n > 0 && thing.model.type == model.type) return true;
		// }
		// for (var key in ret) {
		// 	thing = ret[key];
		// 	if (thing.modelId > modelID) return true;
		// }
		return false;
	}
	public getCanChangeBySlot(slot: number, modelID: number): boolean {
		var thing: GemThing;
		var bag = DataManager.getInstance().bagManager;
		var ret = bag.getOneSeriesOBJGemByGemType(slot);
		for (var key in ret) {
			thing = ret[key];
			if (thing.modelId > modelID) return true;
		}
		return false;
	}
	public getCanUpgradeBySlot(slot: number, modelID: number): boolean {
		var n: number;
		// var model: ModelGem = ModelManager.getInstance().modelGem[modelID];
		// var thing: GemThing;
		// var bag = DataManager.getInstance().bagManager;
		// var ret = bag.getOneSeriesOBJGemByGemType(slot);
		// thing = ret[modelID];
		// model = ModelManager.getInstance().modelGem[modelID + 1];
		// if (thing && model) {
		// 	n = Math.floor((thing.num + 1) / 2);
		// 	if (n > 0 && thing.model.type == model.type) return true;
		// }
		return false;
	}
}