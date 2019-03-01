/**
 * 
 * 经脉管理器
 * @author	lzn	
 * 
 * 
 */
class PulseManager {
	public constructor() {
	}
	public getPulsePower(id) {
		var model: Modeljingmai;
		var addInfo = GameCommon.getInstance().getAttributeAry();
		var len;
		model = JsonModelManager.instance.getModeljingmai()[id];
		for (var i = 0; i < addInfo.length; i++) {
			addInfo[i] = model != null ? model.attrAry[i] : 0;
		}
		return addInfo;
	}
	/*获得经脉属性战斗力*/
	public pulsePower(roleID: number = 0) {
		var id = DataManager.getInstance().playerManager.player.getPlayerData(roleID).pulseLv;
		var model: Modeljingmai = JsonModelManager.instance.getModeljingmai()[id];
		return model ? GameCommon.calculationFighting(model.attrAry) : 0;
	}

	public getJobCanPulseUpgrade(job: number = 0): boolean {
		var playerData = DataManager.getInstance().playerManager.player.getPlayerData(job);
		if (!playerData) return false;
		var lv: number = playerData.pulseLv;
		var modeled: Modeljingmai = JsonModelManager.instance.getModeljingmai()[lv + 1];
		if (modeled) {
			var num = DataManager.getInstance().bagManager.getGoodsThingNumById(modeled.cost.id, modeled.cost.type);
			if (modeled.cost.num <= num) return true;
		}
		return false;
	}

	/*获得是否能够升级经脉*/
	public getCanPulseUpgrade() {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_PULSE)) return false;
		for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
			if (this.getJobCanPulseUpgrade(i)) return true;
		}
		return false;
	}
	//The end
}