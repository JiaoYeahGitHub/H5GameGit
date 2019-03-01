class MarryRingManager {
	public constructor() {
	}

	public checkRedPointAll(): boolean{
		for(let i = 3; i <= 6; ++i){
			if(this.checkRedPointTab(i)){
				return true;
			}
		}
		return false;
	}
	public checkRedPointTab(pinzhi: number): boolean{
		let models = JsonModelManager.instance.getModelhunjie();
        for(let key in models){
            let model: Modelhunjie = models[key];
            if(model.pinzhi == pinzhi){
                let cost: AwardItem = GameCommon.parseAwardItem(model.itemCost);
        		let itemCount = DataManager.getInstance().bagManager.getGoodsThingNumById(cost.id, cost.type);
				if(itemCount >= cost.num){
					return true;
				}
            }
        }
		return false;
	}
	public getLevel(id){
		return DataManager.getInstance().playerManager.player.ringLvs[id - 1];
	}

//////////////////////////////////////套装//////////////////////////////////////
	public STRONGER_TYPES: number[] = [STRONGER_MONSTER_TYPE.STRONGER_EQUIPSUIT_1];

	public initTabNames(): string[]{
		let names: string[] = [];
		let models = JsonModelManager.instance.getModeljiehuntaozhuang();
		for(let k in models){
			let model: Modeljiehuntaozhuang = models[k];
			names[model.taozhuang - 1] = model.taozhuangName;
		}
		return names;
	}
	public getLevelEquipSuit(id): number{
		return DataManager.getInstance().playerManager.player.marryEquipSuitLvs[id - 1];
	}
	public getMarryRingAttributeType(type: number): number[]{
		let player = DataManager.getInstance().playerManager.player;
		let tempAttribute: number[] = GameCommon.getInstance().getAttributeAry();
		let models = JsonModelManager.instance.getModeljiehuntaozhuang();
		for(let k in models){
			let model: Modeljiehuntaozhuang = models[k];
			if(model.taozhuang == type){
				let level = player.marryEquipSuitLvs[model.id - 1];
				if(level > 0){
					let arrt: number[] = model.attrAry;
					for (var i = 0; i < arrt.length; ++i) {
						tempAttribute[i] += arrt[i] * level;
					}
				}
			}
		}
		return tempAttribute;
	}
	public checkTZRedPointAll(): boolean{
		let models = JsonModelManager.instance.getModeljiehuntaozhuang();
		for(let k in models){
			let model: Modeljiehuntaozhuang = models[k];
			if(DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id, model.cost.type) >= model.cost.num){
				return true;
			}
		}
		return false;
	}
	public checkTZRedPointTab(type: number): boolean{
		let models = JsonModelManager.instance.getModeljiehuntaozhuang();
		for(let k in models){
			let model: Modeljiehuntaozhuang = models[k];
			if(model.taozhuang == type && DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id, model.cost.type) >= model.cost.num){
				return true;
			}
		}
		return false;
	}

	public getQHDSLevel(type: number): number{// 套装最低等级
		let levelMin: number = 100000;
		let models = JsonModelManager.instance.getModeljiehuntaozhuang();
		for(let k in models){
			let model: Modeljiehuntaozhuang = models[k];
			if(model.taozhuang == type && this.getLevelEquipSuit(model.id) < levelMin){
				levelMin = this.getLevelEquipSuit(model.id);
			}
		}
		return levelMin;
	}
	public getQHDSModels(type: number, level: number = -1):Modelqianghuadashi[]{
		if(level == -1){
			level = this.getQHDSLevel(type);
		}
		let models = JsonModelManager.instance.getModelqianghuadashi()[this.STRONGER_TYPES[type - 1]];
		let modelCurr = null;
		let modelNext = null;
		for(let k in models){
			let model: Modelqianghuadashi = models[k];
			if(level < model.mubiao){
				modelNext = model;
				break;
			} else {
				modelCurr = model;
			}
		}
		return [modelCurr, modelNext];
	}
	/**
	 * 套装概率数值获取
	 */
	public getArtifactGaiLv(type: ARTIFACT_TYPE): number{
		let attr = 0;
		for(let i = 0; i < this.STRONGER_TYPES.length; ++i){
			let id = i + 1;
			let model: Modelqianghuadashi = this.getQHDSModels(id)[0];
			if(model){
				let modelTS: Modelteshuxiaoguo = JsonModelManager.instance.getModelteshuxiaoguo()[model.teshuxiaoguoId];
				if(modelTS && modelTS.opType == 1){
					if(type == modelTS.type){
						attr += modelTS.gailv;
					}
				}
			}
		}
		return attr;
	}
	/**
	 * 套装特殊效果数值获取
	 */
	public getArtifactXiaoGuo(type: ARTIFACT_TYPE): number{
		let attr = 0;
		for(let i = 0; i < this.STRONGER_TYPES.length; ++i){
			let id = i + 1;
			let model: Modelqianghuadashi = this.getQHDSModels(id)[0];
			if(model){
				let modelTS: Modelteshuxiaoguo = JsonModelManager.instance.getModelteshuxiaoguo()[model.teshuxiaoguoId];
				if(modelTS && modelTS.opType == 2){
					if(type == modelTS.type){
						attr += modelTS.xiaoguo;
					}
				}
			}
		}
		return attr;
	}
}