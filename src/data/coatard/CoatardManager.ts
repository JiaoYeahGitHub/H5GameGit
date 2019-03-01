class CoatardManager {
	public constructor() {
	}
	public getCanShowRedPoint(): boolean {
		var player = DataManager.getInstance().playerManager.player;
		var lv: number = player.coatardLv;
		var hasCurrency: number = player.vigour;
		// var modeled: ModelCoatar = ModelManager.getInstance().modelCoatard[lv + 1];
		// if (!modeled) return false;
		// if (hasCurrency >= modeled.honor)
		// 	return true;
		return false;
	}
	public getCoatardPower(lv: number): number {
		var adds = DataManager.getInstance().coatardManager.getOneArrCoatardByLv(lv);
		var power: number = GameCommon.calculationFighting(adds);
		return power;
	}
	public getOneArrCoatardByLv(lv: number): number[] {
		// var model: ModelCoatar;
		// var adds = [];
		// var models = ModelManager.getInstance().modelCoatard;
		// model = models[lv];
		// if (model) {
		// 	adds.push(model.attr);
		// }
		// var addObj = GameCommon.getInstance().onParseAttributeStr(adds);
		// adds = Tool.Object2Ary(addObj);
		// return model.attr;
		return null;
	}
}