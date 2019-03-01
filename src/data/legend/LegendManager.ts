/**
 * 
 * 神器管理类
 * @author	lzn	
 * 
 * 
 */
class LegendManager {
	public constructor() {
	}

	private getPlayerData(): Player {
		return DataManager.getInstance().playerManager.player;
	}
	public getLegendItemPower(index, lv = -1) {
		var attr = GameCommon.getInstance().getAttributeAry();
		var info: LegendData = this.getPlayerData().getLegendBase(index);
		var model: Modelshenqi = JsonModelManager.instance.getModelshenqi()[index][(lv == -1 ? info.lv : lv) - 1];
		if (model) {
			var tianshi_legend_puls: number = DataManager.getInstance().playerManager.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.GOD_ARTIFACT);
			for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
				attr[i] = model.attrAry[i] + Tool.toInt(model.attrAry[i] * tianshi_legend_puls / GameDefine.GAME_ADD_RATIO);
			}
		}
		return attr;
	}
	public getLegendPower() {
		var addInfo;
		var attr = GameCommon.getInstance().getAttributeAry();
		for (var i = 1; i <= LegendDefine.Legend_Num; i++) {
			addInfo = this.getLegendItemPower(i);
			for (var j = 0; j < ATTR_TYPE.SIZE; j++) {
				attr[j] += addInfo[j]
			}
		}
		return attr;
	}
	public legendOnePower(base: LegendData) {
		var obj;
		var model: Modelshenqi;
		if (base.lv == 0) {
			obj = this.getLegendItemPower(base.index, 1);
			model = JsonModelManager.instance.getModelshenqi()[base.index][0];
		} else {
			obj = this.getLegendItemPower(base.index, base.lv);
			model = JsonModelManager.instance.getModelshenqi()[base.index][base.lv - 1];
		}
		var power: number = GameCommon.calculationFighting(obj);
		return power + model.ewaizhanli;
	}
	public getAllCanLegendAdvance(): boolean {
		for (var i: number = 1; i < 6; i++) {
			if (this.getCanLegendAdvance(i)) return true;
		}
		return false;
	}
	public getCanLegendAdvance(index) {
		var base: LegendData = DataManager.getInstance().playerManager.player.getLegendBase(index);
		if (!base) return false;
		var lv = 0;
		// if (base.activate == 0) {
		// 	return DataManager.getInstance().legendManager.getCanActivate(index);
		// }
		if (base.activate == 1) {
			lv = base.lv;
		}
		// if (base.activate == 1) {
		var key: string = index + "_" + base.lv;
		// var model: ModelLegend = ModelManager.getInstance().modelLegend[key];
		// var model: Modelshenqi = JsonModelManager.instance.getModelshenqi()[index][base.lv-1];
		// key = index + "_" + (base.lv + 1);
		// var next: ModelLegend = ModelManager.getInstance().modelLegend[key];
		var next: Modelshenqi = JsonModelManager.instance.getModelshenqi()[index][lv];
		if (next) {
			var need: number = next.cost.num;
			var thing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(next.cost.id);
			var has: number = thing != null ? thing.num : 0;
			if (next && need <= has) {
				return true;
			}
		}
		// }
		return false;
	}
	// public getCanActivate(index) {
	// 	var obj = LegendDefine.UNLOCK_CONDITION[index];
	// 	var player = DataManager.getInstance().playerManager.player;
	// 	for (var name in obj) {
	// 		switch (name) {
	// 			case "lv":
	// 				var lv = player.level;
	// 				if (obj[name] <= lv) return true;
	// 				break;
	// 			case "login":
	// 				if (FunDefine.checkLoginCondition(obj[name])) return true;
	// 			case "vip":
	// 				var vip = player.viplevel;
	// 				if (obj[name] <= vip) return true;
	// 				break;
	// 			case "pay":
	// 				var firstPay: boolean = false;
	// 				var data = DataManager.getInstance().rechargeManager.record;
	// 				for (var key in data) {
	// 					if (data[key]) {
	// 						firstPay = true;
	// 						return firstPay;
	// 					}
	// 				}
	// 				break;
	// 			default:
	// 				return false;
	// 		}
	// 	}
	// 	return false;
	// }
	/**VIP神器相关内容**/
	//更新VIP神器的信息
	public updateVipGodArtifact(id, lv): void {
		if (this.getPlayerData().vipgodArtifactDict[id]) {
			this.getPlayerData().vipgodArtifactDict[id].lv = lv;
		} else {
			this.getPlayerData().vipgodArtifactDict[id] = new LegendData();
			this.getPlayerData().vipgodArtifactDict[id].index = id;
			this.getPlayerData().vipgodArtifactDict[id].lv = lv;
		}
		this.getPlayerData().updataAttribute();
	}
	//获取单个神器的当前属性值
	public getVipActifactAttrByID(id: number): number[] {
		let attrAry: number[] = GameCommon.getInstance().getAttributeAry();
		let actifactData: LegendData = this.getPlayerData().vipgodArtifactDict[id];
		if (actifactData.lv > 0) {
			let model: Modelvipshenqi = JsonModelManager.instance.getModelvipshenqi()[id];
			for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
				let attrValue: number = model.attrAry[i];
				if (attrValue > 0) {
					attrAry[i] = attrValue * actifactData.lv;
				}
			}
		}
		return attrAry;
	}
	//获取总神器属性
	public getVipActifactAttrAry(): number[] {
		let attrAry: number[] = GameCommon.getInstance().getAttributeAry();
		for (let actifactID in this.getPlayerData().vipgodArtifactDict) {
			let oneAttrAry: number[] = this.getVipActifactAttrByID(parseInt(actifactID));
			for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
				let attrValue: number = oneAttrAry[i];
				if (attrValue > 0) {
					attrAry[i] += attrValue;
				}
			}
		}
		return attrAry;
	}
	//获取当前ID神器的消耗
	public getCostNumByID(id: number): number {
		let actifactData: LegendData = this.getPlayerData().vipgodArtifactDict[id];
		let model: Modelvipshenqi = JsonModelManager.instance.getModelvipshenqi()[id];
		return model.cost.num + Tool.toInt(actifactData.lv / 4);
	}
	//vip神器的总红点
	public oncheckAllVipActifactRedP(): boolean {
		for (let actifactID in JsonModelManager.instance.getModelvipshenqi()) {
			if (this.oncheckVipActifactRedP(parseInt(actifactID))) return true;
		}
		return false;
	}
	//单独神器的红点
	public oncheckVipActifactRedP(id: number): boolean {
		let actifactData: LegendData = this.getPlayerData().vipgodArtifactDict[id];
		let model: Modelvipshenqi = JsonModelManager.instance.getModelvipshenqi()[id];
		if (!actifactData) {//激活条件是否满足
			if (this.getPlayerData().viplevel >= model.id) {
				return true;
			}
		} else {//升级条件是否满足
			let hasNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id);
			let costNum: number = this.getCostNumByID(model.id);
			if (hasNum >= costNum) return true;
		}

		return false;
	}
}
class LegendData {
	public activate: number = 0;
	public index: number = 0;
	public lv: number = 0;
	public constructor() {
	}
}