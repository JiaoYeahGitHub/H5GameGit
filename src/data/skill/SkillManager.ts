class SkillManager {
	public constructor() {
	}
	public getCanUpgrade(skillID) {
		var arr = DataManager.getInstance().skillManager.getUpgradeConsumeInfo(skillID);
		if (arr[0] == 0) return false;
		if (arr[0] <= arr[1])
			return true;
		else
			return false;
	}
	public getDesc(skillInfo: SkillInfo): string {
		var des: string = skillInfo.model.disc;
		// var buffmodel: Modelbuff = JsonModelManager.instance.getModelbuff()[skillInfo.model.buffId];
		// if (buffmodel) {
		// 	var attrDesc: string = "";
		// 	var attributes: number[] = this.getBuffAttr(skillInfo.model.buffId);//, skillInfo.level
		// 	var index: number = 0;
		// 	for (var i: number = 0; i < attributes.length; i++) {
		// 		var attrValue: number = attributes[i];
		// 		if (attrValue > 0) {
		// 			if (index != 0)
		// 				attrDesc += ",";
		// 			attrDesc += GameDefine.Attr_Name[i];
		// 			attrDesc += `<font color=0x00FF00>+${attrValue}</font>`;
		// 			index++;
		// 		}
		// 	}
		// 	des = des.replace(`$`, `${attrDesc}`);//伤害
		// } else {
		// 	// des = des.replace(`%`, `<font color=0x00FF00>${skillInfo.model.valueBase / 100 + models[skillInfo.level - 1][`skill5_ewai`] / 100}%</font>`);//伤害
		// 	des = des.replace(`$`, `<font color=0x00FF00>${skillInfo.getExtraDamage()}</font>`);//伤害
		// }
		des = des.replace(`$`, `<font color=0x00FF00>${skillInfo.getExtraDamage()}</font>`);//伤害
		return des;
	}

	/**
	 * 返回升级消耗和拥有材料信息
	 * 
	 * return [param1,param2]	param1为消耗需求材料个数值为0不可升级，param2为拥有材料个数
	 * 
	 * */
	public getUpgradeConsumeInfo(id) {
		var stuffNum: number = 0;
		// var model;
		// var info;
		// var arr;
		// var skillInfo: SkillInfo;
		var consumeID: number;
		consumeID = 6;
		// var len = DataManager.getInstance().playerManager.player.data.skills.length;
		// for (var i = 0; i < len; i++) {
		// 	info = DataManager.getInstance().playerManager.player.data.skills[i];
		// 	if (info.id == id) {
		// 		break;
		// 	}
		// }
		// model = ModelManager.getInstance().modelSkilldmg;
		// var dmg: ModelSkilldmg = model[info.level - 1];
		// var dmged: ModelSkilldmg = model[info.level];
		// if (dmg && dmged) {
		// 	stuffNum = dmg.cost;
		// }
		var own: number = DataManager.getInstance().skillManager.getOwnGoodsNum(consumeID);
		return [stuffNum, own];
	}
	public getCanUpgradeAll() {
		var bl: boolean = false;
		var ret: boolean = false;
		for (var i = 0; i < GameDefine.InitiativeSkill.length; i++) {
			bl = DataManager.getInstance().skillManager.getCanUpgrade(GameDefine.InitiativeSkill[i]);
			if (bl) {
				return true;
			}
		}
		for (var i = 0; i < GameDefine.PassivitySkill.length; i++) {
			bl = DataManager.getInstance().skillManager.getCanUpgrade(GameDefine.PassivitySkill[i]);
			if (bl) {
				return true;
			}
		}
		return false;
	}
	public getCanUpgradeInitiative() {
		var bl: boolean = false;
		var ret: boolean = false;
		for (var i = 0; i < GameDefine.InitiativeSkill.length; i++) {
			bl = DataManager.getInstance().skillManager.getCanUpgrade(GameDefine.InitiativeSkill[i]);
			if (bl) {
				return true;
			}
		}
		return false;
	}
	public getCanUpgradePassivity() {
		var bl: boolean = false;
		var ret: boolean = false;
		for (var i = 0; i < GameDefine.PassivitySkill.length; i++) {
			bl = DataManager.getInstance().skillManager.getCanUpgrade(GameDefine.PassivitySkill[i]);
			if (bl) {
				return true;
			}
		}
		return false;
	}
	public getOwnGoodsNum(id) {
		var _itemThing: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(id);
		var _hasitemNum: number = _itemThing ? _itemThing.num : 0;
		return _hasitemNum;
	}
	public getSkillModelCost(id, level): number {
		var model;
		var arr;
		if (id < 10001) {
			var dmg: Modelskilldmg = JsonModelManager.instance.getModelskilldmg()[level];
			if (dmg) {
				return dmg.cost.num;
			} else {
				return -1;
			}
		}
		return 0;
	}
	public calculateOneKeyUpgrade(type) {
		var data;
		var id: number;
		var pay: number;
		var info;
		var arr;
		var ret = [];
		var skillObj = {};
		var consumeID: number;
		var consumSum: number = 0;
		if (type == 0) {
			consumeID = 6;
			data = GameDefine.InitiativeSkill;
		} else if (type == 1) {
			consumeID = 2;
			data = GameDefine.PassivitySkill;
		}
		var own: number = DataManager.getInstance().skillManager.getOwnGoodsNum(consumeID);
		if (own == 0) return [own, skillObj];
		var i = 0;
		var canUp: boolean = false;
		do {
			if (i == data.length) {
				i = 0;
				if (canUp) {
					canUp = false;
				} else {
					break;
				}
			}
			var skill: SkillInfo = DataManager.getInstance().playerManager.player.getPlayerData().getSkillInfoById(data[i]);
			var lv: number = skill.level;
			if (skillObj[data[i]]) {
				lv += skillObj[data[i]];
			}
			pay = this.getSkillModelCost(data[i], lv);
			if (pay > 0) {//可升级
				if (consumSum + pay <= own) {//消耗品够
					consumSum += pay;
					if (!skillObj[data[i]]) {
						skillObj[data[i]] = 1;
					} else {
						skillObj[data[i]] += 1;
					}
					canUp = true;
				}
			}
			i++;
		} while (own >= consumSum);
		return [consumSum, skillObj];
	}

	public checkSkillUpGrade(skillId: number): boolean {
		let tupomodel: Modelskilltupo;
		let player: Player = DataManager.getInstance().playerManager.player;
		let playerdata: PlayerData = player.getPlayerData();
		let skillInfo: SkillInfo = playerdata.getSkillInfoById(skillId);
		let skillTupos = JsonModelManager.instance.getModelskilltupo()[skillId];
		for (var idx in skillTupos) {
			if (skillTupos[idx].tupoLv == skillInfo.grade + 1) {
				tupomodel = skillTupos[idx];
				break;
			}
		}

		if (!tupomodel || tupomodel.jingjie > player.coatardLv) {
			return false;
		}

		if (tupomodel.cost.num > this.getOwnGoodsNum(tupomodel.cost.id)) {
			return false;
		}
		return true;
	}

	public checkSkillUp(skillId: number): boolean {
		let player: Player = DataManager.getInstance().playerManager.player;
		let playerdata: PlayerData = player.getPlayerData();
		let skillInfo: SkillInfo = playerdata.getSkillInfoById(skillId);
		if (skillInfo.model.lv >= player.level) {
			return false;
		}
		if (skillInfo.level >= player.level) {
			return false;
		}
		let costNum: number = this.getSkillModelCost(skillId, skillInfo.level);
		let hasNum: number = player.getICurrency(GOODS_TYPE.YUELI);
		if (costNum > 0 && costNum <= hasNum) {
			return true;
		}
		return false;
	}

	public checkMainSkillUp(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_SKILL)) return false;
		let playerDatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (var idx = 0; idx < playerDatas.length; ++idx) {
			let data: PlayerData = playerDatas[idx];
			for (var i = 0; i < data.skills.length; ++i) {
				let skillinfo: SkillInfo = data.skills[i];
				if (this.checkSkillUp(skillinfo.id)) {
					return true;
				}
				if (this.checkSkillUpGrade(skillinfo.id)) {
					return true;
				}
			}
		}
		return false;
	}
	/** 获取技能可升最大级数 **/
	public getSkillUpLevelMax(skill: SkillInfo): number {
		var levelMax: number = ModelManager.getInstance().getModelLength('skilldmg');
		var player: Player = DataManager.getInstance().playerManager.player;
		if (player.level < skill.model.lv) {
			return 0;
		}
		return Math.min(player.level, levelMax);
	}
	/**获取BUFF属性**/
	public getBuffAttr(buffid: number): number[] {//, level: number
		let model: Modelbuff = JsonModelManager.instance.getModelbuff()[buffid];
		if (!model) return [];//|| level <= 0
		let attribute: number[] = GameCommon.getInstance().getAttributeAry();
		let basic_attrs: string[] = model.buffAdd.split("#");//基础属性
		for (let i: number = 0; i < basic_attrs.length; i++) {
			let attrParam: string[] = basic_attrs[i].split(",");
			let attrType: number = parseInt(attrParam[0]);
			let attrValue: number = parseInt(attrParam[1]);
			attribute[attrType] = attrValue;
		}
		let rate_attrs: string[] = model.buffMul.split("#");//每一级的加成
		for (let i: number = 0; i < rate_attrs.length; i++) {
			let addParam: string[] = rate_attrs[i].split(",");
			let attrType: number = ATTR_TYPE.SIZE + parseInt(addParam[0]);
			let addValue: number = parseInt(addParam[1]);
			attribute[attrType] = addValue;
		}
		return attribute;
	}
	//The end
}