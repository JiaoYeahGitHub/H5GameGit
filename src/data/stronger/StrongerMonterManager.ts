/**
 * 强化大师
 * BY 2018.0912  LYJ 
 * **/
class StrongerMonterManager {
	private _strongerInfoDict;//类型 对应 目标值

	public constructor() {
		this._strongerInfoDict = {};
		this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_FEI_JIAN] = "getCurType0Value";
		this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_SHEN_BING] = "getCurType1Value";
		this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_SHEN_ZHUANG] = "getCurType2Value";
		this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_BAO_QI] = "getCurType3Value";
		this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_XIAN_YU] = "getCurType4Value";
		this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_QIANG_HUA] = "getCurType5Value";
		this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_ZHU_LING] = "getCurType6Value";
		this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_BAO_SHI] = "getCurType7Value";
		this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_CUI_LIAN] = "getCurType8Value";
		this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_LIAN_HUA] = "getCurType9Value";
		// this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_JING_MAI] = "getCurType10Value";
		// this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_WU_XING] = "getCurType11Value";
		this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_SI_XIANG] = "getCurType12Value";
		this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_TIANSHU_LEVEL] = "getCurType13Value";
		// this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_PET_UPLV] = "getCurType14Value";
		// this._strongerInfoDict[STRONGER_MONSTER_TYPE.STRONGER_PET_UPGRADE] = "getCurType15Value";
	}
	//根据类型获取目标进度
	public getStrongerValue(type: STRONGER_MONSTER_TYPE): number {
		return this[this._strongerInfoDict[type]]();
	}
	public getStrongerPlusAtt(type: STRONGER_MONSTER_TYPE): number[] {
		//强化大师绝对值
		let addAttrs: number[] = GameCommon.getInstance().getAttributeAry();
		let dashiModel: Modelqianghuadashi = this.getJiHuoModelByType(Number(type));
		if (!dashiModel)
			return addAttrs;
		if (dashiModel.plusType == 0) {
			for (let j = 0; j < ATTR_TYPE.SIZE; j++) {
				var keystr: string = GameDefine.getAttrPlusKey(j + ATTR_TYPE.SIZE);
				if (dashiModel && dashiModel[keystr]) {
					addAttrs[j] = addAttrs[j] + dashiModel[keystr];//万分级
				}
			}
		}
		return addAttrs;
	}
	public getStrongerAtt(type: STRONGER_MONSTER_TYPE): number[] {
		//强化大师绝对值
		let attrs: number[] = GameCommon.getInstance().getAttributeAry();
		let addAttrs: number[] = GameCommon.getInstance().getAttributeAry();
		let dashiModel: Modelqianghuadashi = this.getJiHuoModelByType(Number(type));
		if (!dashiModel)
			return attrs;
		for (let j = 0; j < ATTR_TYPE.SIZE; ++j) {
			if (dashiModel.attrAry[j] > 0) {
				attrs[j] += dashiModel.attrAry[j];
			}
		}
		// if (dashiModel.plusType == 0) {
		// 	for (let j = 0; j < ATTR_TYPE.SIZE; j++) {
		// 		var keystr: string = GameDefine.getAttrPlusKey(j + ATTR_TYPE.SIZE);
		// 		if (dashiModel && dashiModel[keystr]) {
		// 			addAttrs[j] = addAttrs[j] + dashiModel[keystr];//万分级
		// 		}
		// 	}
		// }
		// //加成值计算 万分级
		// for (let i = 0; i < ATTR_TYPE.SIZE; ++i) {
		// 	if (attrs[i] > 0 && addAttrs[i]) {
		// 		attrs[i] += Tool.toInt(addAttrs[i] * attrs[i] / GameDefine.GAME_ADD_RATIO);
		// 	}
		// }
		return attrs;
	}



	//总加成属性值
	public get allPlusAtt(): number[] {
		let attributeAry: number[] = GameCommon.getInstance().getAttributeAry();
		for (let type in this._strongerInfoDict) {
			let curModel: Modelqianghuadashi = this.getCurModelByType(parseInt(type));
			if (curModel) {
				for (let i: number = 0; i < curModel.attrAry.length; i++) {
					var keystr: string = GameDefine.getAttrPlusKey(i + ATTR_TYPE.SIZE);
					if (curModel && curModel[keystr] && curModel.plusType == 1) {
						attributeAry[i] = attributeAry[i] + curModel[keystr];//万分级
					}
				}
			}
		}
		return attributeAry;
	}
	//总属性值
	public get attributeAry(): number[] {
		let attributeAry: number[] = GameCommon.getInstance().getAttributeAry();
		for (let type in this._strongerInfoDict) {
			let curModel: Modelqianghuadashi = this.getCurModelByType(parseInt(type));
			if (curModel) {
				for (let i: number = 0; i < curModel.attrAry.length; i++) {
					if (curModel.attrAry[i] > 0) {
						attributeAry[i] += curModel.attrAry[i];
					}
				}
			}
		}
		return attributeAry;
	}
	/**----------------获取对应类型的目标值-----------------**/
	/**类型STRONGER_TIANSHU_LEVEL 天书升级**/
	public getCurType13Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			for (let tianshuID in playerdata.tianshuDict) {
				let tianshudata: TianshuData = playerdata.tianshuDict[tianshuID];
				if (tianshudata) {
					targetNum += tianshudata.level;
				}
			}
		}
		return targetNum;
	}
	/**类型飞剑**/
	public getCurType0Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			let blessData: BlessData = playerdata.blessinfos[BLESS_TYPE.HORSE];
			if (blessData)
				targetNum += blessData.grade;
		}
		return targetNum;
	}
	/**类型神兵**/
	public getCurType1Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			let blessData: BlessData = playerdata.blessinfos[BLESS_TYPE.WEAPON];
			if (blessData)
				targetNum += blessData.grade;
		}
		return targetNum;
	}
	/**类型神装**/
	public getCurType2Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			let blessData: BlessData = playerdata.blessinfos[BLESS_TYPE.CLOTHES];
			if (blessData)
				targetNum += blessData.grade;
		}
		return targetNum;
	}
	/**类型法宝**/
	public getCurType3Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			let blessData: BlessData = playerdata.blessinfos[BLESS_TYPE.MAGIC];
			if (blessData)
				targetNum += blessData.grade;
		}
		return targetNum;
	}
	/**类型翅膀**/
	public getCurType4Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			let blessData: BlessData = playerdata.blessinfos[BLESS_TYPE.WING];
			if (blessData)
				targetNum += blessData.grade;
		}
		return targetNum;
	}
	/**类型强化总等级**/
	public getCurType5Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			for (let k: number = 0; k < GameDefine.Equip_Slot_Num; k++) {
				let slotInfo: EquipSlotThing = playerdata.getEquipSlotThings(k);
				if (slotInfo)
					targetNum += slotInfo.intensifyLv;
			}
		}
		return targetNum;
	}
	/**获取注灵总等级**/
	public getCurType6Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			for (let k: number = 0; k < GameDefine.Equip_Slot_Num; k++) {
				let slotInfo: EquipSlotThing = playerdata.getEquipSlotThings(k);
				if (slotInfo)
					targetNum += slotInfo.infuseLv;
			}
		}
		return targetNum;
	}
	/**获取宝石总等级**/
	public getCurType7Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			for (let k: number = 0; k < GameDefine.Equip_Slot_Num; k++) {
				let slotInfo: EquipSlotThing = playerdata.getEquipSlotThings(k);
				if (slotInfo)
					targetNum += slotInfo.gemLv;
			}
		}
		return targetNum;
	}
	/**获取淬炼总等级**/
	public getCurType8Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			for (let k: number = 0; k < GameDefine.Equip_Slot_Num; k++) {
				let slotInfo: EquipSlotThing = playerdata.getEquipSlotThings(k);
				if (slotInfo)
					targetNum += slotInfo.quenchingLv;
			}
		}
		return targetNum;
	}
	/**获取炼化总等级**/
	public getCurType9Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			for (let k: number = 0; k < GameDefine.Equip_Slot_Num; k++) {
				let slotInfo: EquipSlotThing = playerdata.getEquipSlotThings(k);
				if (slotInfo)
					targetNum += slotInfo.zhLv;
			}
		}
		return targetNum;
	}
	/**获取经脉总等级**/
	public getCurType10Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			targetNum += playerdata.pulseLv;
		}
		return targetNum;
	}
	/**获取五行总等级**/
	public getCurType11Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			targetNum += Math.floor(playerdata.wuxingLevel / 5);// playerdata.wuxingLevel%25+
		}
		return targetNum;
	}
	/**获取四象总等级**/
	public getCurType12Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			for (var k: number = 0; k < Fourinages_Type.SIZE; k++) {
				var currData: FourinageData = playerdata.fourinages[k];
				if (currData)
					targetNum += currData.level;
			}
		}
		return targetNum;
	}

	// /**获取元神总等级**/
	// public getCurType14Value(): number {
	// 	let targetNum: number = 0;
	// 	let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
	// 	for (let i: number = 0; i < playerdatas.length; i++) {
	// 		let playerdata: PlayerData = playerdatas[i];
	// 		for (let i = 0; i < playerdata.psychThings.length; ++i) {
	// 			let psych: PsychBase = playerdata.psychThings[i]
	// 			if (psych && psych.model) {
	// 				targetNum += psych.model.lv
	// 			}
	// 		}
	// 	}
	// 	return targetNum;
	// }
	/**获取宠物等级总等级**/
	public getCurType14Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			var petData: PetData = DataManager.getInstance().playerManager.player.petData;
			targetNum += petData.lv;
		}
		return targetNum;
	}
	/**获取宠物等级总等阶**/
	public getCurType15Value(): number {
		let targetNum: number = 0;
		let playerdatas: PlayerData[] = DataManager.getInstance().playerManager.player.playerDatas;
		for (let i: number = 0; i < playerdatas.length; i++) {
			let playerdata: PlayerData = playerdatas[i];
			var petData: PetData = DataManager.getInstance().playerManager.player.petData;
			targetNum += petData.grade * 10 + petData.gradeStar;
		}
		return targetNum;
	}
	/**根据类型获取当前的目标等级**/
	public getCurNumByType(type: STRONGER_MONSTER_TYPE): number {
		let targetNum: number = this[this._strongerInfoDict[type]]();
		return targetNum;
	}
	public getNextMuBiao(type:STRONGER_MONSTER_TYPE):number{
		
		if(DataManager.getInstance().playerManager.player.strongerDict[type])
		{ 
			if(this.getJiHuoModelByType(type))
			{
				if(DataManager.getInstance().playerManager.player.strongerDict[type].lv==this.getJiHuoModelByType(type).mubiao)
				{
					if(!this.getCurModelByType(type))
					return this.getCurNumByType(type);
					if(this.getCurModelByType(type).mubiao==this.getCurNumByType(type)&&this.getCurNumByType(type)>this.getJiHuoModelByType(type).mubiao)
					return this.getCurNumByType(type);
				}
			}
		}
		let nextModel: Modelqianghuadashi = this.getNextModelByType(type);
		if(nextModel)
		return nextModel.mubiao;
		else
		{
			return this.getCurModelByType(type).mubiao; 
		}
	}
	public getPoint(type:STRONGER_MONSTER_TYPE):boolean{

		let currModel: Modelqianghuadashi = this.getCurModelByType(type);
		let nextModel: Modelqianghuadashi = this.getNextModelByType(type);
		let curProNum: number = this.getStrongerValue(type);

		if(currModel&&curProNum>=currModel.mubiao)
		{
			if(!DataManager.getInstance().playerManager.player.strongerDict[type])
			{
				return true;
			}
			if (DataManager.getInstance().playerManager.player.strongerDict[type].lv<currModel.mubiao) 
			{
				return true
			}
		}
		return false;
	}
	/**根据类型获取已经激活的目标数据**/
	public getJiHuoModelByType(type: STRONGER_MONSTER_TYPE): Modelqianghuadashi {
		var targetNum = 0;
		if (DataManager.getInstance().playerManager.player.strongerDict[type]) {
			targetNum = DataManager.getInstance().playerManager.player.strongerDict[type].lv;
		}
		let models = JsonModelManager.instance.getModelqianghuadashi()[type];
		let targetModel: Modelqianghuadashi;
		for (let id in models) {
			let model: Modelqianghuadashi = models[id];
			if (model.mubiao > targetNum) {
				return targetModel;
			}
			targetModel = model;
		}
		return targetModel;
	}

	/**根据类型获取当前的目标数据**/
	public getCurModelByType(type: STRONGER_MONSTER_TYPE = STRONGER_MONSTER_TYPE.STRONGER_FEI_JIAN): Modelqianghuadashi {
		let targetNum: number = this[this._strongerInfoDict[type]]();
		let models = JsonModelManager.instance.getModelqianghuadashi()[type];
		let targetModel: Modelqianghuadashi;
		for (let id in models) {
			let model: Modelqianghuadashi = models[id];
			if (model.mubiao > targetNum) {
				return targetModel;
			}
			targetModel = model;
		}
		return targetModel;
	}
	/**根据类型获取当前的目标数据**/
	public getNoActPro(type: STRONGER_MONSTER_TYPE,lv:number): number[] {
		let targetNum: number = this[this._strongerInfoDict[type]]();
		let models = JsonModelManager.instance.getModelqianghuadashi()[type];
		let targetModel: Modelqianghuadashi;
		for (let id in models) {
			let model: Modelqianghuadashi = models[id];
			if (model.mubiao >= lv) {
				if(targetModel)
				return targetModel.attrAry;
				else
				{
					return model.attrAry;
				}
			}
			targetModel = model;
		}
		return targetModel.attrAry;
	}
	/**根据类型获取下一等级目标数据**/
	public getNextModelByType(type: STRONGER_MONSTER_TYPE): Modelqianghuadashi {
		let targetNum: number = this[this._strongerInfoDict[type]]();
		let models = JsonModelManager.instance.getModelqianghuadashi()[type];
		for (let id in models) {
			let model: Modelqianghuadashi = models[id];
			if (model.mubiao > targetNum) {
				return model;
			}
		}
		return null;
	}
}
class StrongerData {
	public type: number;
	public lv: number = 0;
	public constructor() {

	}
	public onParseLvMsg(msg: Message): void {
		this.lv = msg.getShort();
	}
}
/**强化大师类型**/
enum STRONGER_MONSTER_TYPE {
	//飞剑
	STRONGER_FEI_JIAN = 0,
	//神兵
	STRONGER_SHEN_BING = 1,
	//神装
	STRONGER_SHEN_ZHUANG = 2,
	//宝器
	STRONGER_BAO_QI = 3,
	//仙玉
	STRONGER_XIAN_YU = 4,
	//强化
	STRONGER_QIANG_HUA = 5,
	//注灵
	STRONGER_ZHU_LING = 6,
	//宝石
	STRONGER_BAO_SHI = 7,
	//淬炼
	STRONGER_CUI_LIAN = 8,
	//炼化
	STRONGER_LIAN_HUA = 9,
	// //经脉
	// STRONGER_JING_MAI = 10,
	//五行
	// STRONGER_WU_XING = 11,
	//四象
	STRONGER_SI_XIANG = 12,
	//天书等级
	STRONGER_TIANSHU_LEVEL = 13,
	//宠物升级
	// STRONGER_PET_UPLV = 14,
	//宠物进阶
	// STRONGER_PET_UPGRADE = 15,

	STRONGER_EQUIPSUIT_1 = 16,//结婚套装1
	STRONGER_EQUIPSUIT_2 = 17,//结婚套装2
	STRONGER_EQUIPSUIT_3 = 18,//结婚套装3
	STRONGER_EQUIPSUIT_4 = 19,//结婚套装4
	STRONGER_EQUIPSUIT_5 = 20,//结婚套装5
	//挑战副本通关属性
	STRONGER_CHALLENGE_PASS = 100,
	//图鉴套装属性
	STRONGER_TUJIAN_SUIT = 101,
}