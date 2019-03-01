/**
 * 
 */
class FunDefine {
	public static FUN_GUIDE_TESTIDS: number[] = [];

	public static LOGIC_OR = 0;
	public static LOGIC_AND = 1;

	public constructor() {
	}

	public static getXYXFuncIsOpen(xyx_func_name: string): boolean {
		switch (Constant.get(xyx_func_name)) {
			case "RELEASE"://仅发布版本可见
				return DataManager.isRelease;
			case "TRIAL":
				return !DataManager.isRelease;
			case "OPEN"://全部开放
				return true;
			case "ALLCLOSE"://全部屏蔽
				return false;
			default://默认不屏蔽
				return false;
		}
	}

	public static getGuideModels(guideId: number): Modelxinshou[] {
		let modelDict = JsonModelManager.instance.getModelxinshou();
		let models: Modelxinshou[] = [];
		for (let idx in modelDict) {
			let model: Modelxinshou = modelDict[idx];
			if (model.jackaroo == guideId) {
				models.push(model);
			}
		}
		return models;
	}

	public static funOpenLevel(type: FUN_TYPE): number {
		let model: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[type];
		if (!model) return 0;
		if (model.days > 0) return LevelDefine.getLevelByOpenDay(model.days);
		if (model.level > 0) return model.level;
		if (model.pvpLv > 0) return model.pvpLv;
		return LevelDefine.getLevelByCoatardlv(model.jingjie);
	}

	public static isFunOpen(type: FUN_TYPE): boolean {
		var modelFunction: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[type];
		if (modelFunction) {
			if (modelFunction.isAct > 0) {
				var groups: ModelactivityGroup[] = JsonModelManager.instance.getModelactivityGroup();
				for (var key in groups) {
					let modelgourp: ModelactivityGroup = groups[key];
					if (modelgourp.panel == modelFunction.param && modelgourp.level > DataManager.getInstance().playerManager.player.level) {
						return false;
					}
				}
				return DataManager.getInstance().activityManager.getActIsOpen(modelFunction.isAct);
			} else {
				if (modelFunction.logic == FunDefine.LOGIC_OR) {
					if (modelFunction.jingjie > 0 && modelFunction.jingjie <= DataManager.getInstance().playerManager.player.coatardLv) return true;
					if (modelFunction.level > 0 && modelFunction.level <= DataManager.getInstance().playerManager.player.level) return true;
					if (modelFunction.guanqia > 0 && modelFunction.guanqia <= GameFight.getInstance().yewai_waveIndex) return true;
					if (modelFunction.pvpLv > 0 && modelFunction.pvpLv <= DataManager.getInstance().pvpManager.getCurrLevel()) return true;
					if (modelFunction.days > 0 && this.checkLoginCondition(modelFunction.days)) return true;
					if (modelFunction.vip > 0 && modelFunction.vip <= DataManager.getInstance().playerManager.player.viplevel) return true;
					// if (modelFunction.xianmengLv > 0 && modelFunction.xianmengLv <= DataManager.getInstance().unionManager.getUnionLv()) return true;
					return false;
				} else {
					if (modelFunction.jingjie > DataManager.getInstance().playerManager.player.coatardLv) return false;
					if (modelFunction.level > DataManager.getInstance().playerManager.player.level) return false;
					if (modelFunction.guanqia > GameFight.getInstance().yewai_waveIndex) return false;
					if (modelFunction.pvpLv > DataManager.getInstance().pvpManager.getCurrLevel()) return false;
					if (!this.checkLoginCondition(modelFunction.days)) return false;
					if (modelFunction.vip > DataManager.getInstance().playerManager.player.viplevel) return false;
					// if (modelFunction.xianmengLv > DataManager.getInstance().unionManager.getUnionLv()) return false;
					return true;
				}
			}
		} else {
			return true;
		}
	}

	public static onIsLockandErrorHint(type: FUN_TYPE): boolean {
		let _player: Player = DataManager.getInstance().playerManager.player;
		let modelFunction: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[type];
		if (modelFunction && !this.isFunOpen(type)) {
			if (modelFunction.isAct > 0) {
				PromptPanel.getInstance().addPromptError(Language.instance.getText('activity', 'unopen'));
			} else {
				let insertTxt: string = modelFunction.logic == FunDefine.LOGIC_OR ? 'OR' : 'AND';
				let showLen: number = modelFunction.logic == FunDefine.LOGIC_OR ? 2 : 1;
				let conditionTxts: string[] = [];
				if (modelFunction.jingjie > _player.coatardLv && conditionTxts.length < showLen) {
					conditionTxts.push(Language.instance.getText(`coatard_level${modelFunction.jingjie}`));
				}
				if (modelFunction.vip != 0 && _player.viplevel < modelFunction.vip && conditionTxts.length < showLen) {
					conditionTxts.push(Language.instance.parseInsertText("vipkaiqi", modelFunction.vip));
				}
				if (modelFunction.level > _player.level && conditionTxts.length < showLen) {
					conditionTxts.push(Language.instance.parseInsertText('dengjikaiqi', modelFunction.level));
				}
				if (modelFunction.guanqia != 0 && GameFight.getInstance().yewai_waveIndex < modelFunction.guanqia && conditionTxts.length < showLen) {
					conditionTxts.push(Language.instance.parseInsertText("zhangjiedadao", modelFunction.guanqia));
				}
				if (modelFunction.days != 0 && !this.checkLoginCondition(modelFunction.days) && conditionTxts.length < showLen) {
					conditionTxts.push(Language.instance.parseInsertText('dijitian', modelFunction.days));
				}
				if (modelFunction.pvpLv != 0 && modelFunction.pvpLv > DataManager.getInstance().pvpManager.getCurrLevel()) {
					conditionTxts.push("战功" + modelFunction.pvpLv + "级");
				}
				// if (modelFunction.xianmengLv != 0 && modelFunction.xianmengLv > DataManager.getInstance().unionManager.getUnionLv()) {
				// 	conditionTxts.push(Language.instance.parseInsertText('unionlvkaiqi', modelFunction.xianmengLv));
				// }

				let _conditionTxt: string = "";
				for (let i: number = 0; i < conditionTxts.length; i++) {
					if (i > 0) {
						_conditionTxt += Language.instance.getText(insertTxt);
					}
					_conditionTxt += Language.instance.getText(conditionTxts[i]);
				}
				_conditionTxt += Language.instance.getText('open');
				PromptPanel.getInstance().addPromptError(_conditionTxt);
			}

			return true;
		}
		return false;
	}
	public static getFunOpenDesc(type: FUN_TYPE): string {
		var desc: string = "";
		var modelFunction: ModelfunctionLv = JsonModelManager.instance.getModelfunctionLv()[type];
		if (modelFunction) {
			if (modelFunction.jingjie > 0) {
				desc = Language.instance.getText(`coatard_level${modelFunction.jingjie}`, 'jingjie', 'open');
			} else if (modelFunction.guanqia != 0) {
				desc = Language.instance.parseInsertText("dijiguan", modelFunction.guanqia) + Language.instance.getText("open");
			} else if (modelFunction.level > 0) {
				desc = modelFunction.level + Language.instance.getText('level', 'open');
			} else if (modelFunction.days != 0) {
				desc = Language.instance.parseInsertText('dijitian', modelFunction.days) + Language.instance.getText("open");
			}
			// else if (modelFunction.xianmengLv != 0) {
			// 	desc = Language.instance.parseInsertText('unionlvkaiqi', modelFunction.xianmengLv) + Language.instance.getText("open");
			// }
		}
		return desc;
	}
	public static checkLoginCondition(limit): boolean {
		if (limit != 0) {
			var player = DataManager.getInstance().playerManager.player;
			var old = Tool.formatZeroDate(new Date(DataManager.getInstance().playerManager.player.createTime)).getTime();
			var now = Tool.formatZeroDate(new Date(player.currentTime + (egret.getTimer() - player.signTime))).getTime();
			var day = (now - old) / 86400000 + 1;
			if (limit > day) {
				return false;
			}
		}
		return true;
	}
	//功能开启红点
	public static checkFunOpenRedPoint(): boolean {
		var funcDict = JsonModelManager.instance.getModelfunctionLv();
		var funcmodels: ModelfunctionLv[] = [];
		for (var id in funcDict) {
			var model: ModelfunctionLv = funcDict[id];
			if (model.functionType > 0 && this.isFunOpen(model.id) && !DataManager.getInstance().playerManager.getFunIsAwarded(model.id)) {
				return true;
			}
		}
		return false;
	}
	//获取附灵副本是否有挑战次数
	public static DupFulingbossPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_FULINGBOSS)) {
			return false;
		}
		var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_LINGXING, 1);
		var num = dupinfo ? dupinfo.lefttimes : 0;
		if (num > 0) return true;
		return false;
	}
	//获取诛仙副本是否有挑战次数
	public static DupZhuXianBossTimes(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_BLESSDUP)) {
			return false;
		}
		var tpId = DataManager.getInstance().newactivitysManager.blessTp;
		var peishiCfg = JsonModelManager.instance.getModelpeishiboss()[tpId];
		if (peishiCfg) {
			var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_BLESS, peishiCfg.id);
			var num = dupinfo ? dupinfo.lefttimes : 0;
			if (num > 0) return true;
		}
		return false;
	}
	//获取材料副本是否有次数
	public static DupCailiaoHasTimes(): boolean {
		let player: Player = DataManager.getInstance().playerManager.player;
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_DUP_CAILIAO)) {
			return false;
		}
		var dupinfos: DupInfo[] = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_CAILIAO);
		for (var i: number = 0; i < dupinfos.length; i++) {
			var info: DupInfo = dupinfos[i];
			switch (info.subtype) {
				case 1:
					if (info.diffcult > 0 && info.lefttimes > 0) return true;
					break;
				case 2:
					if (info.diffcult > 0 && info.lefttimes > 0) return true;
					break;
				case 5:
					if (info.diffcult > 0 && info.lefttimes > 0) return true;
					break;
				default:
					if (info.lefttimes > 0) return true;
					break;
			}
		}
		return false;
	}
	//获取挑战本是否有可以挑战的
	public static DupChallengeHasTimes(): boolean {
		if (!this.getDupHasTimes(DUP_TYPE.DUP_CHALLENGE)) return false;
		let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_CHALLENGE)[0];
		let model: Modelzhuxiantai = JsonModelManager.instance.getModelzhuxiantai()[dupinfo.pass];
		if (!model) return false;
		let fightter: Modelfighter = ModelManager.getInstance().getModelFigher(model.fightId);
		if (model && DataManager.getInstance().playerManager.player.getPlayerData().figthPower >= fightter.power) {
			return true;
		}
		return false;
	}
	//祝福值副本判断
	public static BlessDupRedPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_DUP_ZHUFU)) {
			return false;
		}
		let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_ZHUFU)[0];
		if (dupinfo.awardIndex < dupinfo.pass - 1) return true;
		if (this.getDupHasTimes(DUP_TYPE.DUP_ZHUFU)) return true;
		return false;
	}
	//四象副本红点判断
	public static SixiangDupRedPoint(): boolean {
		if (this.getDupHasTimes(DUP_TYPE.DUP_SIXIANG)) return true;

		let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_SIXIANG)[0];
		let currmodel: Modelsixiangfuben;
		let _length: number = ModelManager.getInstance().getModelLength('sixiangfuben');
		for (let i: number = dupinfo.awardIndex + 1; i <= _length; i++) {
			let model: Modelsixiangfuben = JsonModelManager.instance.getModelsixiangfuben()[i];
			if (model.firstRewards) {
				currmodel = model;
				break;
			}
		}
		if (currmodel && currmodel.id <= dupinfo.pass) {
			return true;
		}
		return false;
	}
	public static getDupHasTimes(duptype: DUP_TYPE): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_DUP_ZUDUI)) {
			return false;
		}
		let funcId: number = 0;
		switch (duptype) {
			case DUP_TYPE.DUP_CAILIAO:
				funcId = FUN_TYPE.FUN_DUP_CAILIAO;
				break;
			case DUP_TYPE.DUP_CHALLENGE:
				funcId = FUN_TYPE.FUN_DUP_TIAOZHAN;
				break;
			case DUP_TYPE.DUP_SIXIANG:
				funcId = FUN_TYPE.FUN_DUP_SIXIANG;
				break;
			case DUP_TYPE.DUP_TEAM:
				funcId = FUN_TYPE.FUN_DUP_ZUDUI;
				break;
			case DUP_TYPE.DUP_ZHUFU:
				funcId = FUN_TYPE.FUN_DUP_ZHUFU;
				break;
		}
		if (!this.isFunOpen(funcId)) return;

		let funType: FUN_TYPE = 0;
		switch (duptype) {
			case DUP_TYPE.DUP_CHALLENGE:
				funType = FUN_TYPE.FUN_DUP_TIAOZHAN;
				break;
			case DUP_TYPE.DUP_ZHUFU:
				funType = FUN_TYPE.FUN_DUP_ZHUFU;
				break;
			case DUP_TYPE.DUP_TEAM:
				funType = FUN_TYPE.FUN_DUP_ZUDUI;
				break;
			case DUP_TYPE.DUP_SIXIANG:
				funType = FUN_TYPE.FUN_DUP_SIXIANG;
				break;
		}
		if (funType == 0) return false;
		if (!FunDefine.isFunOpen(funType)) {
			return false;
		}
		let dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfolistByType(duptype)[0];
		if (dupinfo.lefttimes > 0) return true;
		return false;
	}
	//获取个人BOSS是否有可以挑战的
	public static getGerenBossRedPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_GEREN_BOSS)) return false;

		let gerendupDict = JsonModelManager.instance.getModelgerenboss();
		for (var gerenId in gerendupDict) {
			var model: Modelgerenboss = gerendupDict[gerenId];
			if (this.getPersonallyBossHasTimes(model.id)) {
				return true;
			}
		}

		return false;
	}
	public static getPersonallyBossHasTimes(modelid: number): boolean {
		var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfo(DUP_TYPE.DUP_PERSONALLY, modelid);
		if (!dupinfo) return;
		if (dupinfo.gerenModel.jingjie > DataManager.getInstance().playerManager.player.coatardLv) return false;
		if (dupinfo && dupinfo.lefttimes > 0) return true;
		return false;
	}

	public static checkMagicRed(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_FABAO)) {
			return false;
		}

		if (FunDefine.checkMagicUpRed()) {
			return true;
		}

		return false;
	}
	public static checkMagicUpRed(): boolean {
		// var currentLevel: number = DataManager.getInstance().playerManager.player.magicLevel;
		// if (currentLevel > 0 && currentLevel < LevelDefine.MAX_LEVEL_MAGIC) {
		// 	var currentModelBless: ModelBless = ModelManager.getInstance().modelMagic[currentLevel];
		// 	var item: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(currentModelBless.costId);
		// 	if (item && item.num >= currentModelBless.costNum) {
		// 		return true;
		// 	}
		// }
		return false;
	}

	// public static checkArtifact(idx: number, type: ARTIFACT_TYPE, pos: number, level: number): boolean {
	// 	var list: ThingBase[] = DataManager.getInstance().bagManager.getGoodsListByType(GOODS_TYPE.SERVANT_EQUIP);
	// 	if (list == null || list.length == 0) {
	// 		return false;
	// 	}
	// 	var fighting: number = 0;
	// 	var artifactEquip: ServantEquipThing = DataManager.getInstance().playerManager.player.data.blessArtifactArray[idx];
	// 	if (artifactEquip != null) {
	// 		var attr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	// 		for (var index: number = 0; index < ATTR_TYPE.SIZE; ++index) {
	// 			var artifactModel: ModelArtifact = artifactEquip.model as ModelArtifact;
	// 			attr[index] += parseInt(String(artifactModel.attrList[index] * artifactModel.starRatio[artifactEquip.star] * artifactModel.qualityRatio[artifactEquip.quality]));
	// 		}
	// 		fighting = GameCommon.calculationFighting(attr);
	// 	}
	// 	for (var i: number = 0; i < list.length; ++i) {
	// 		artifactEquip = list[i] as ServantEquipThing;
	// 		var model: ModelArtifact = artifactEquip.model as ModelArtifact;
	// 		if (model.blessType == type && model.type == pos && model.level <= level) {
	// 			var attr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	// 			for (var index: number = 0; index < ATTR_TYPE.SIZE; ++index) {
	// 				var artifactModel: ModelArtifact = artifactEquip.model as ModelArtifact;
	// 				attr[index] += parseInt(String(artifactModel.attrList[index] * artifactModel.starRatio[artifactEquip.star] * artifactModel.qualityRatio[artifactEquip.quality]));
	// 			}
	// 			if (GameCommon.calculationFighting(attr) > fighting) {
	// 				return true;
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }
	public static getTabRolePoint(): boolean {
		if (this.getRoleEquipPoint()) return true;
		// if (DataManager.getInstance().playerManager.checkFashionRedPoint()) return true;
		if (this.getWuxingRedPoint()) return true;
		return false;
	}

	//装备红点
	public static getRoleEquipPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_EQUIP)) return false;
		if (DataManager.getInstance().legendManager.getAllCanLegendAdvance()) return true;
		for (var i: number = 0; i < DataManager.getInstance().playerManager.player.playerDatas.length; i++) {
			if (this.getJobEquipPoint(DataManager.getInstance().playerManager.player.getPlayerData(i).occupation)) return true;
		}
		return false;
	}
	//装备红点
	public static getJobEquipPoint(job: number): boolean {
		var equips: EquipThing[] = DataManager.getInstance().bagManager.getJobClothEquips(0);
		if (equips.length > 0)
			return true;
		return false;
	}

	//转生红点
	public static getRebirthPoint(): boolean {
		// if (!FunDefine.isFunOpen(FUN_TYPE.FUN_REBIRTH)) return false;
		if (this.getCanRebirth()) return true;
		var rebirth = DataManager.getInstance().rebirthManager;
		for (var key in rebirth.record) {
			if (this.getOneTypeRebirthPoint(parseInt(key))) return true;
		}
		return false;

	}
	public static getOneTypeRebirthPoint(id: number): boolean {
		var rebirth = DataManager.getInstance().rebirthManager;
		var player = DataManager.getInstance().playerManager.player;
		var base: VigourExchange = rebirth.record[id];
		var remain: number = 0;
		switch (base.type) {
			case GOODS_TYPE.SHOW:
				remain = DataManager.getInstance().playerManager.player.remainExchageVigourTime;
				if (player.level > LevelDefine.ZS_ORIGIN_LEVEL && remain > 0) return true;
				break;
			case GOODS_TYPE.BOX:
				var has = DataManager.getInstance().bagManager.getGoodsThingNumById(base.modelID, base.type);
				var useTime = DataManager.getInstance().bagManager.getUseLimitNumByID(base.modelID);
				var box: Modelbox = JsonModelManager.instance.getModelbox()[base.modelID];
				remain = box.useMax - useTime;//对应关系如果ID变动需要调整传入index
				if (0 < has && remain > 0) return true;
				break;
		}
		return false;
	}
	public static getCanRebirth(): boolean {
		// var player = DataManager.getInstance().playerManager.player;
		// var models = ModelManager.getInstance().modelRebirth;
		// var nextModel: ModelRebirth = models[player.rebirthLv + 1];
		// if (nextModel && player.level >= LevelDefine.ZS_ORIGIN_LEVEL && player.vigour >= nextModel.cost.num) return true;
		return false;
	}

	public static setBlessPillLock(isOpen: boolean, level: number, container: egret.DisplayObjectContainer, name: string = "lock", offsetX: number = 0, offsetY: number = 0, scaleX: number = 1, scaleY: number = 1): void {
		if (isOpen) {
			var lock: egret.DisplayObject = container.getChildByName(name);
			if (lock) {
				container.removeChild(lock);
			}
		} else {
			if (container.getChildByName(name) == null) {
				var component: eui.Component = new eui.Component();
				component.x = offsetX;
				component.y = offsetY;
				component.name = name;
				component.scaleX = scaleX;
				component.scaleY = scaleY;
				component.touchEnabled = false;
				container.addChild(component);

				var lockImg: eui.Image = new eui.Image();
				lockImg.source = "public_fun_lock_png";
				component.addChild(lockImg);
				var label: eui.Label = new eui.Label();
				label.text = Language.instance.parseInsertText("jiekaiqi", level);
				label.fontFamily = "SimHei";
				label.textColor = 0xFFFFFF;
				label.size = 20;
				label.bold = false;
				label.strokeColor = 0;
				label.stroke = 0;
				label.alpha = 1;
				label.anchorOffsetX = label.width / 2;
				label.anchorOffsetY = label.height / 2;
				label.x = 57;
				label.y = 70;
				component.addChild(label);

				lockImg.name = level.toString();
				lockImg.touchEnabled = true;
				lockImg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBlessPillLockClick, this);
			}
		}
	}

	public static getGemLotteryRed(): boolean {
		if (DataManager.getInstance().forgeManager.gemlotteryFreeTimes > 0) {
			return true;
		}
		return false;
	}

	public static onBlessPillLockClick(event: egret.TouchEvent): void {
		var lock: eui.Image = event.currentTarget;
		PromptPanel.getInstance().addPromptError(Language.instance.parseInsertText("jiekaiqi", lock.name));
	}

	//元神红点
	public static getPsychPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_YUANSHEN)) return false;
		var psych = DataManager.getInstance().psychManager;
		for (var i = 0; i < GameDefine.Max_Role_Num; i++) {
			if (psych.getIndexPsychPoint(i)) return true;
		}
		return false;
	}
	//特殊装备红点
	public static checkSixiangPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_SIXIANG)) return false;
		for (var i: number = 0; i < Fourinages_Type.SIZE; i++) {
			if (this.checkSixiangUplevelBySlot(i)) return true;
			// if (this.checkSixiangUpgradeBySlot(i)) return true;
		}
		return false;
	}
	//某个特殊装备位红点
	/**四象升级判断**/
	public static checkSixiangUplevelBySlot(slot: number, job: number = 0): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_SIXIANG)) return false;
		var playerData = DataManager.getInstance().playerManager.player.getPlayerData(job);
		if (!playerData) return false;
		var currLv: number = playerData.fourinages[slot].level;
		var fourinages: Modelsixiang[] = JsonModelManager.instance.getModelsixiang()[slot];
		var nextFourinage: Modelsixiang = fourinages[currLv];
		if (!nextFourinage) return false;
		var _has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(nextFourinage.cost.id, nextFourinage.cost.type);
		if (_has >= nextFourinage.cost.num) return true;
		return false;
	}
	/**四象进阶判断**/
	// public static checkSixiangUpgradeBySlot(slot: number): boolean {
	// 	if (!FunDefine.isFunOpen(FUN_TYPE.FUN_SIXIANG)) return false;
	// 	var playerData = DataManager.getInstance().playerManager.player.getPlayerData();
	// 	var currGrade: number = playerData.fourinages[slot].grade;
	// 	var fourinages: Modelsixiangjinjie[] = JsonModelManager.instance.getModelsixiangjinjie()[slot];
	// 	var nextFourinage: Modelsixiangjinjie = fourinages[currGrade];
	// 	if (!nextFourinage) return false;
	// 	var _has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(nextFourinage.cost.id, nextFourinage.cost.type);
	// 	if (_has >= nextFourinage.cost.num) return true;
	// 	return false;
	// }

	//有更好的装备
	public static getJobBetterEquip(job: number): EquipThing {
		var equips: EquipThing[] = DataManager.getInstance().bagManager.getJobClothEquips(0);
		if (equips.length > 0)
			return equips[0];
		return null;
	}
	//五行的红点
	public static getWuxingRedPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_WUXING)) return false;
		let player: Player = DataManager.getInstance().playerManager.player;
		let id: number = player.getPlayerData().wuxingLevel;

		let models = JsonModelManager.instance.getModelwuxing();
		let currModel: Modelwuxing = models[id];
		let nextModel: Modelwuxing = models[id + 1];
		let model: Modelwuxing = currModel || nextModel;
		let item: AttributesText;

		if (nextModel && player.getICurrency(nextModel.cost.type) >= nextModel.cost.num) {
			return true;
		}

		return false;
	}
	/** 图鉴的红点*/
	public static checkTujianRedPointByClass(id: number): boolean {
		let model: Modeltujian = JsonModelManager.instance.getModeltujian()[id];
		if (!model) return false;
		let data: TuJianData = DataManager.getInstance().playerManager.player.getPlayerData().tujianDataDict[id];
		let level: number = data ? data.level : 0;
		if (GameDefine.Tujian_MAX_Lv <= level) return false;
		let costNum: number = model.cost.num + Tool.toInt(level / 5);
		var _has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id, model.cost.type);
		if (_has >= costNum) return true;

		return false;
	}
	public static checkTujianRedPointByType(type: number): boolean {

		let models = JsonModelManager.instance.getModeltujian();
		for (let tujianId in models) {
			let model: Modeltujian = models[tujianId];
			if (model.type == type && this.checkTujianRedPointByClass(model.id)) return true;
		}

		return false;
	}
	public static checkTujianRedPointAll(): boolean {
		let models = JsonModelManager.instance.getModeltujian();
		for (let tujianId in models) {
			let model: Modeltujian = models[tujianId];
			if (this.checkTujianRedPointByClass(model.id)) return true;
		}

		return false;
	}

	public static checkYewaiBossPoint(): boolean {
		if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) return false;
		if (GameSetting.getLocalSetting(GameSetting.YEWAI_AUTO_FIGHT)) return false;
		var yewaiScene: YewaiPVEFight = GameFight.getInstance().fightScene as YewaiPVEFight;
		//如果在打野外BOSS 不成立
		// if (yewaiScene.isFightBoss) return false;
		//进度如果达到满 成立
		let totalProgress: number = GameFight.getInstance().fightScene.rushData.progress;
		let currProgress: number = Math.min(totalProgress, GameFight.getInstance().yewai_batch);
		return currProgress >= totalProgress;
	}
	//是否可以强化
	public static getQianghuaCanGuide(): boolean {
		//如果不是野外场景 不成立
		if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) return false;
		var yewaiScene: YewaiPVEFight = GameFight.getInstance().fightScene as YewaiPVEFight;
		//如果在打野外BOSS 不成立
		// if (yewaiScene.isFightBoss) return false;
		return DataManager.getInstance().forgeManager.getIntensifyPointShow();
	}
	//是否可以熔炼
	public static getRonglianCanGuide(): boolean {
		//如果不是野外场景 不成立
		if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) return false;
		var yewaiScene: YewaiPVEFight = GameFight.getInstance().fightScene as YewaiPVEFight;
		//如果在打野外BOSS 不成立
		// if (yewaiScene.isFightBoss) return false;
		let arr = DataManager.getInstance().bagManager.getEquipListCanSmelt();
		if (arr.length >= 5) return true;
		return false;
	}
	//是否可以升技能
	public static getSkillCanGuide(): boolean {
		//如果不是野外场景 不成立
		if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) return false;
		var yewaiScene: YewaiPVEFight = GameFight.getInstance().fightScene as YewaiPVEFight;
		//如果在打野外BOSS 不成立
		// if (yewaiScene.isFightBoss) return false;
		let playerdata: PlayerData = DataManager.getInstance().playerManager.player.getPlayerData();
		for (var i = 0; i < playerdata.skills.length; ++i) {
			let skillinfo: SkillInfo = playerdata.skills[i];
			if (DataManager.getInstance().skillManager.checkSkillUp(skillinfo.id)) {
				return true;
			}
		}
		return false;
	}
	//是否可以穿装备
	public static getClothCanGuide(): boolean {
		//如果不是野外场景 不成立
		if (GameFight.getInstance().fightsceneTpye != FIGHT_SCENE.YEWAI_XG) return false;
		var yewaiScene: YewaiPVEFight = GameFight.getInstance().fightScene as YewaiPVEFight;
		//如果在打野外BOSS 不成立
		// if (yewaiScene.isFightBoss) return false;
		return this.getRoleEquipPoint();
	}
	//是否需要坐骑引导
	public static checkNeedMountGuide(): boolean {
		let mountdata: BlessData = DataManager.getInstance().blessManager.getPlayerBlessData(BLESS_TYPE.HORSE);
		return mountdata.grade == 0;
	}

	//器魂的红点
	public static checkQihunRedPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_QIHUN)) return false;
		let player: Player = DataManager.getInstance().playerManager.player;
		let id: number = player.getPlayerData().qihun;

		let models = JsonModelManager.instance.getModelqihun();
		let currModel: Modelqihun = models[id];
		let nextModel: Modelqihun = models[id + 1];
		let model: Modelqihun = currModel || nextModel;
		let item: AttributesText;

		if (nextModel && nextModel.coatardLimit <= player.coatardLv) {
			var _has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(nextModel.cost.id, nextModel.cost.type);
			if (_has >= nextModel.cost.num) return true;
		}

		return false;
	}

	//全民boss红点
	public static getAllPeopleBossRedPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_QUANMIN_BOSS)) return false;
		if (DataManager.getInstance().dupManager.allpeoplebossData.lefttimes <= 0) return false;
		var info;
		var model: Modelquanminboss;
		var modelDict = JsonModelManager.instance.getModelquanminboss();
		for (var id in modelDict) {
			model = modelDict[id];
			if (model.limitLevel > DataManager.getInstance().playerManager.player.coatardLv) {
				continue;
			}
			info = DataManager.getInstance().dupManager.allpeoplebossData.infos[model.id];
			if (info && info.isOpen) {
				return true;
			}
		}
		return false;
	}

	//转生BOSS找回红点
	public static getSamsaraBossBackAwdRPoint(): boolean {
		return DataManager.getInstance().dupManager.samsarebossData.hasbackaward && FunDefine.isFunOpen(FUN_TYPE.FUN_ZHUANSHENG_BOSS);
	}

	//跨服战红点
	public static getCrossServerPoint(): boolean {
		if (this.getCrossArenaPoint()) return true;
		if (this.getCrossPVEBOSSPoint()) return true;
		return false;
	}
	//跨服竞技场红点
	public static getCrossArenaPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_SERVERFIGHT_ARENA)) return false;
		if (!DataManager.getInstance().arenaManager.arenaData.isOpen) return false;
		return DataManager.getInstance().arenaManager.arenaData.fightCount > 0;
	}
	//跨服BOSS红点
	public static getCrossPVEBOSSPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_SERVERPVEBOSS)) return false;
		if (!DataManager.getInstance().dupManager.crossPVEBoss.isOpen) return false;
		return DataManager.getInstance().dupManager.crossPVEBoss.fightcount > 0;
	}

	//天梯红点，暂时不用
	public static isLadderOpen = false;
	//境界诛仙红点，也暂时没别的地方用
	public static isSamsaraOpen = false;
}

/**
 * 功能类型
 */
enum FUN_TYPE {
	//---------旧的--------
	FUN_HUANZHUANG = 14000,//随从神装
	FUN_LINGZHANG = 15000,//随从神兵
	FUN_BAOQI = 16000,//随从法宝
	FUN_YUYI = 17000,//随从翅膀
	FUN_FAZUO = 18000,//随从座驾
	//---------新的--------
	FUN_PVE = 1,//野外关卡
	FUN_ROLE = 2,//角色
	FUN_SKILL = 3,//技能
	FUN_PULSE = 4,	//经脉
	FUN_SIXIANG = 5,//四象
	FUN_FASHION = 6,//时装
	FUN_TITLE = 7,//称号
	FUN_EQUIP = 8,//角色装备
	FUN_SHENZHUANG = 9,//神装
	FUN_SHENBING = 10,//神兵
	FUN_FABAO = 11,//法宝
	FUN_XIANYU = 12,//翅膀
	FUN_MOUNT = 13,//飞剑
	FUN_QIANGHUA = 14,//强化
	FUN_BAOSHI = 15,//宝石
	FUN_ZHULING = 16,//注灵
	FUN_LIANHUA = 17,//炼化
	FUN_CUILIAN = 18,//淬炼
	FUN_EQUIPBAG = 19,//装备背包
	FUN_ITEMBAG = 20,//道具背包
	FUN_EQUIP_SMELT = 21,//装备熔炼
	FUN_BLESS_SMELT = 22,//祝福值熔炼
	FUN_JINGJIE = 23,//境界
	FUN_JIANCHI = 24,//每日任务
	FUN_SHENQI = 25,//神器
	FUN_GEREN_BOSS = 26,//个人BOSS
	FUN_QUANMIN_BOSS = 27,//全民BOSS
	FUN_ZHUANSHENG_BOSS = 28,//转生BOSS
	FUN_YEWAIPVP = 29,//遭遇战
	FUN_DUJIE = 30,//运镖
	FUN_LADDER = 31,//天梯
	FUN_ARENA = 32,//竞技场
	FUN_DUP_CAILIAO = 33,//材料副本
	FUN_DUP_ZHUFU = 34,//祝福值副本
	FUN_DUP_ZUDUI = 35,//组队副本
	FUN_DUP_TIAOZHAN = 36,//挑战副本
	FUN_DUP_SIXIANG = 37,//四象副本
	FUN_DUP_XUEZHAN = 38,//血战副本
	FUN_HONGZHUANG = 39,//红装
	FUN_SHANGGU = 40,//上古套装
	FUN_ANJIN = 41,//暗金套装
	FUN_PET_LEVEL = 42,//宠物升级
	FUN_PET_GRADE = 43,//宠物升阶
	FUN_UNION_HALL = 44,//帮会大厅
	FUN_SHOP_SHENMI = 51,//神秘商店
	FUN_SHOP_JIFEN = 52,//积分商店
	FUN_SHOP_PUTONG = 53,//普通商店
	FUN_SHOP_RONGYU = 54,//荣誉商店
	FUN_BAOSHIFUBEN = 55,//宝石本
	FUN_JINGMAIFUBEN = 56,//经脉本
	FUN_CUILIANFUBEN = 57,//淬炼本
	FUN_CHONGFUBEN = 58,//宠物本
	FUN_BLESS_EQUIP = 59, //祝福值装备
	FUN_BLESS_EQUIP_QIANGHUA = 60, //祝福值装备强化
	FUN_YUANSHEN = 61, //元神
	FUN_DRAGONSOUL = 62, //龙魂
	FUN_FIGHTSPRITE = 63, //仙玉
	FUN_LOTTERY = 64, //寻宝
	FUN_XUEZHANBOSS = 69,//血战BOSS
	FUN_WUXING = 70,//五行
	FUN_TOPRANK = 71,//排行榜
	FUN_MONTHCARD = 72, //月卡
	FUN_QIHUN = 73, //器魂
	FUN_ZHUANPAN = 74, //法宝转盘
	FUN_UNION_BOSS_FAM = 75, //仙盟boss秘境
	FUN_UNION_BOSS_SUMMON = 76, //仙盟BOSS召唤
	FUN_VIP_GIFTSHOP = 78,//vip特惠商店
	FUN_XIANSHAN = 81, //仙山
	FUN_VIPTEAM = 83,//仙尊组队
	FUN_SERVERFIGHT_ARENA = 84,//跨服竞技场
	FUN_SERVERPVEBOSS = 85,//跨服BOSS
	FUN_FULINGBOSS = 86, //附灵BOSS
	FUN_BLESSDUP = 88, //祝福值BOSS
	FUN_RNUES = 89, //战纹
	FUN_RNUES_DUP = 90,//战纹副本
	// FUN_VIPARITFACT = 97,//VIP神器
	// FUN_XINFA = 98,//心法
	FUN_SHENGWANGSHOP = 96,//竞技场商店
	FUN_TIANSHU_LEVEL_DUP = 99,//天书残页副本
	FUN_TIANSHU = 100,//天书
	FUN_TIANSHU_TUPO = 101,//天书突破
	FUN_YUANJIE = 102,//元戒
	FUN_WUTAN = 103,//武坛
	FUN_SKILLENCHANT = 104,//技能附魔
	FUN_XIANFENG = 105,//关卡先锋
	FUN_ZHANGONG_RECORD = 106,//战功统计
	FUN_JUBAOPEN = 107,//摇钱树 聚宝盆
	FUN_CHONGBANG = 108,//冲榜礼包
	FUN_SHENQI_CHOUQIAN = 109,//神绮抽签
	FUN_XIANLV_EQUIP_DUP = 117,//仙侣红装本
	FUN_MARRY = 118,//结婚列表
	FUN_MARRY_DUP = 119,//结婚本
	FUN_MARRY_EQUIP_SUIT_DUP = 120,//结婚套装
	FUN_MARRY_EQUIP_SUIT_BOSS = 121,//结婚套装boss
	//客户端自用
	FUN_OPENFUNC = 1001,//功能开启
}

/**
 * 灵器类型
 */
enum ARTIFACT_TYPE {
	HORSE = 0,		//战骑
	WEAPON = 1,		//神兵
	CLOTHES = 2,	//神装
	WING = 3,		//仙羽
	MAGIC = 4,		//法宝
}