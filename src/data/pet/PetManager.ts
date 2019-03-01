class PetManager {
	public lottery_FreeTimes: number = 0;//每日免费抽奖次数
	public isFirstLottery: boolean = true;
	public curRandomValue = [];
	public constructor() {
	}
	public getOneLvPets(): Modelchongwushengji[] {
		var ret: Modelchongwushengji[] = [];
		var models = JsonModelManager.instance.getModelchongwushengji();
		var base: Modelchongwushengji;
		for (var key in models) {
			base = models[key];
			if (base.lv == 1) {
				ret.push(base);
			}
		}
		return ret;
	}
	public get power(): number {
		//宠物战力加成
		var powerNum: number = 0;
		var petData: PetData = DataManager.getInstance().playerManager.player.petData;
		powerNum += petData.powerNum;
		return powerNum * DataManager.getInstance().playerManager.player.playerDatas.length;
	}
	public get activatedNum(): number {
		var n: number = 0;
		var petData: PetData = DataManager.getInstance().playerManager.player.petData;
		if (petData.lv > 0) {
			n++;
		}
		return n;
	}

	public onSendUpdateMessage(): void {
		var message = new Message(MESSAGE_ID.PET_UPDATE_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public sendRandomMessage(ten: boolean, costType: number): void {
		var message = new Message(MESSAGE_ID.PET_TRAIN_RANDOM_MESSAGE);
		message.setByte(ten ? 1 : 0);
		message.setByte(costType);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onSendUpgradeMessage(): void {
		var message = new Message(MESSAGE_ID.PET_UPGRADE_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onSendLotteryLogMessage(): void {
		var lotteryLogMsg: Message = new Message(MESSAGE_ID.PET_LOTTERY_LOG_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(lotteryLogMsg);
	}
	// public onSendLotteryMessage(type: number): void {
	// 	var lotteryMsg: Message = new Message(MESSAGE_ID.PET_LOTTERY_MESSAGE);
	// 	lotteryMsg.setByte(type);
	// 	GameCommon.getInstance().sendMsgToServer(lotteryMsg);
	// }
	// public onSendMergeMessage(itemid: number, itemNum: number): void {
	// 	var mergeMsg: Message = new Message(MESSAGE_ID.PET_EXCHANGE_MESSAGE);
	// 	mergeMsg.setByte(2);
	// 	mergeMsg.setShort(itemid);
	// 	mergeMsg.setInt(itemNum);
	// 	GameCommon.getInstance().sendMsgToServer(mergeMsg);
	// }
	// public onSendResolveMessage(itemid: number, itemNum: number): void {
	// 	var resolveMsg: Message = new Message(MESSAGE_ID.PET_EXCHANGE_MESSAGE);
	// 	resolveMsg.setByte(1);
	// 	resolveMsg.setShort(itemid);
	// 	resolveMsg.setInt(itemNum);
	// 	GameCommon.getInstance().sendMsgToServer(resolveMsg);
	// }
	//宠物抽奖日志显示
	public lotteryLogs: string[];
	public onParsePetLogMsg(msg: Message): void {
		this.lottery_FreeTimes = msg.getByte();
		this.isFirstLottery = msg.getBoolean();
		this.lotteryLogs = [];
		var logSize: number = msg.getByte();
		for (var i: number = 0; i < logSize; i++) {
			var logdesc: string = "";
			var playerName: string = msg.getString();
			var itemType: number = msg.getByte();
			var itemId: number = msg.getShort();
			var itemQulity: number = msg.getByte()
			var itemNum: number = msg.getInt();
			var itemModel: ModelThing = GameCommon.getInstance().getThingModel(itemType, itemId, itemQulity);
			if (itemModel) {
				logdesc = `恭喜玩家[#16FCE8${playerName}] 召唤出了[#${GameCommon.Quality_Color_String[itemModel.quality]}${itemModel.name}]宠物！`;
			}
			this.lotteryLogs.push(logdesc);
		}
	}

	public onCheckPetRedPoint(): boolean {
		if (this.onCheckPetCanUpdate()) return true;
		else if (this.onCheckPetCanUpgrade()) return true;
		// else if (this.onCheckLotteryRedPoint()) return true;
		return false;
	}
	public onCheckPetCanUpdate(): boolean {
			if (!FunDefine.isFunOpen(FUN_TYPE.FUN_PET_GRADE)) return false;
		for (var i: number = 1; i <= PetDefine.MAX_PET_NUM; i++) {
			if (this.onCheckPetCanUpdateByID()) return true;
			if (this.onCheckPetCanActivate()) return true;
		}
		return false;
	}
	public onCheckPetCanActivateById(): boolean {
		// var modelpetopen: Modelchongwushengji = JsonModelManager.instance.getModelchongwujihuo()[id];
		// if (modelpetopen) {
		// 	if (modelpetopen.chapter != 0 && modelpetopen.chapter > GameFight.getInstance().yewai_waveIndex) {
		// 		return false;
		// 	}
		// 	if (modelpetopen.jingjie != 0 && modelpetopen.jingjie > DataManager.getInstance().playerManager.player.coatardLv) {
		// 		return false;
		// 	}
		// 	if (modelpetopen.Level != 0 && modelpetopen.Level > DataManager.getInstance().playerManager.player.level) {
		// 		return false;
		// 	}
		// 	if (modelpetopen.days != 0 && !FunDefine.checkLoginCondition(modelpetopen.days)) {
		// 		return false;
		// 	}
		// 	if (modelpetopen.vip != 0 && modelpetopen.vip > DataManager.getInstance().playerManager.player.viplevel) {
		// 		return false;
		// 	}
		// }
		return false;
	}
	// public getPetOpenDesc(id: number): string {
	// 	var desc: string = "";
	// 	var modelpetopen: Modelchongwujihuo = JsonModelManager.instance.getModelchongwujihuo()[id];
	// 	if (modelpetopen) {
	// 		if (modelpetopen.chapter != 0) {
	// 			desc += Language.instance.parseInsertText('zhangjiekaiqi', modelpetopen.chapter);
	// 		}
	// 		else if (modelpetopen.jingjie != 0) {
	// 			desc += Language.instance.parseInsertText('jingjiekaiqi', `coatard_level${modelpetopen.jingjie}`);
	// 		}
	// 		else if (modelpetopen.Level != 0) {
	// 			desc += Language.instance.parseInsertText('dengjikaiqi', modelpetopen.Level);
	// 		}
	// 		else if (modelpetopen.days != 0) {
	// 			desc += Language.instance.parseInsertText('tianshukaiqi', modelpetopen.days);
	// 		}
	// 		else if (modelpetopen.vip != 0) {
	// 			desc += Language.instance.parseInsertText('vipkaiqi', modelpetopen.vip);
	// 		}
	// 	}
	// 	return desc;
	// }
	public onCheckPetCanActivate(): boolean {
		let data: PetData = DataManager.getInstance().playerManager.player.petData;
		if (data.lv == 0 && this.onCheckPetCanActivateById()) {
			return true;
		}
		return false;
	}
	public onCheckPetCanUpdateByID(): boolean {
		var data: PetData = DataManager.getInstance().playerManager.player.petData;
		if (!data.nextModel) return false;
		var _hasitemNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(data.nextModel.cost.id, data.nextModel.cost.type);
		if (_hasitemNum >= data.nextModel.cost.num) {
			return true;
		}
		return false;
	}
	public onCheckPetCanUpgrade(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_PET_GRADE)) return false;
		// for (var i: number = 1; i <= PetDefine.MAX_PET_NUM; i++) {
		// 	if (this.onCheckPetCanUpgradeByID(i)) return true;
		// }
		if (this.onCheckPetCanUpgradeByID()) return true;
		return false;
	}
	public onCheckPetCanUpgradeByID(): boolean {
		var data: PetData;
		var data: PetData = DataManager.getInstance().playerManager.player.petData;
		if (!data.nextGradeModel) return false;
		var _hasitemNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(data.nextGradeModel.cost.id, data.nextGradeModel.cost.type);
		if (_hasitemNum >= data.nextGradeModel.cost.num) {
			return true;
		}
		return false;
	}
	public onCheckPetRedPointByType(index: number, id: number) {
		switch (index) {
			case 0:
				return this.onCheckPetCanUpdateByID();
			case 1:
				return this.onCheckPetCanUpgradeByID();
		}
		return false;
	}
	public onCheckPetHasFreeLottery(): boolean {
		return this.lottery_FreeTimes > 0;
	}
	// public onCheckPetCanMerge(): boolean {
	// 	var mergemodel: Modelchongwuhecheng = JsonModelManager.instance.getModelchongwuhecheng()[0];
	// 	var hecheng: AwardItem = GameCommon.parseAwardItem(mergemodel.hecheng);
	// 	var _hasitemNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(hecheng.id, hecheng.type);
	// 	return _hasitemNum >= hecheng.num;
	// }
	public onCheckLotteryRedPoint(): boolean {
		if (this.onCheckPetHasFreeLottery()) return true;
		// else if (this.onCheckPetCanMerge()) return true;
		return false;
	}
	public parseRandomValue(msg: Message) {
		// msg.getByte();
		for (var i = 0; i < GameDefine.PET_ATTR.length; i++) {
			this.curRandomValue[i] = msg.getInt();
		}
	}
	public parsePetDanValue(msg: Message) {
		
	}
	public clear() {
		this.curRandomValue = []
	}
	public checkRedPoint(): boolean {
		if (FunDefine.isFunOpen(FUN_TYPE.FUN_DRAGONSOUL)) {
			let has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(GameDefine.PET_GOODS_ID);
			if (has >= GameDefine.LONGHUN_GOODS_NUM) {
				return true;
			}
		}
		return false;
	}

	public getLonghunPower(): number {
		var attributes: number[] = GameCommon.getInstance().getAttributeAry();
		for (var i = 0; i < GameDefine.PET_ATTR.length; i++) {
			attributes[i] = this.getPlayerData().longhunAttribute[i];
		}
		return GameCommon.calculationFighting(attributes);
	}
	private getPlayerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData(0);
	}
	//The end
}
class PetData {
	public id: number;
	public lv: number = 0;
	public grade: number = 0;//阶
	public tier: number = 0;
	public exp: number = 0;
	public isOutBound: boolean = false;
	public proArr: number[] = [0, 0, 0, 0];
	private _nextModel: Modelchongwushengji;
	public gradeExp: number = 0;
	public gradeStar: number = 0;
	public danDic: number[] = [];
	public constructor() {
		this.danDic[0] = 0;
		this.danDic[1] = 0;
		this.danDic[2] = 0;
	}
	public onParseMessage(msg: Message): void {
		this.lv = msg.getShort();
		this.exp = msg.getInt();
		this.grade = msg.getByte();
		this.gradeStar = msg.getByte();
		this.gradeExp = msg.getInt();
	}
	public onParseLvMsg(msg: Message): void {
		this.lv = msg.getShort();
		this.exp = msg.getInt();
	}
	public onParseGradeMsg(msg: Message): void {
		this.grade = msg.getByte();
		this.gradeStar = msg.getByte();
		this.gradeExp = msg.getInt();
	}
	public get model(): Modelchongwushengji {
		if (this.lv == 0)
			return JsonModelManager.instance.getModelchongwushengji()[this.lv];
		return JsonModelManager.instance.getModelchongwushengji()[this.lv - 1];
	}
	public get nextModel(): Modelchongwushengji {
		if (!this._nextModel || this._nextModel.id != this.id + 1) {
			this._nextModel = JsonModelManager.instance.getModelchongwushengji()[this.lv];
		}
		return this._nextModel;
	}
	public get gradeModel(): Modelchongwujinjie {
		return JsonModelManager.instance.getModelchongwujinjie()[this.grade][this.gradeStar];
	}
	public get nextGradeModel(): Modelchongwujinjie {
		return JsonModelManager.instance.getModelchongwujinjie()[this.grade][this.gradeStar + 1];
	}
	public get petAtt(): number[] {
		var attributes: number[] = GameCommon.getInstance().getAttributeAry();
		var addAttrs: number[] = GameCommon.getInstance().getAttributeAry();
		if (this.lv > 0) {
        // var petStroAtt: number[] = DataManager.getInstance().strongerManager.getStrongerAtt(STRONGER_MONSTER_TYPE.STRONGER_PET_UPLV);
			for (var j = 0; j < ATTR_TYPE.SIZE; ++j) {
				attributes[j] += this.model.attrAry[j];//+petStroAtt[j];
				
			}
			//宠物升级百分比
			// var petStroAttPlus: number[] = DataManager.getInstance().strongerManager.getStrongerPlusAtt(STRONGER_MONSTER_TYPE.STRONGER_PET_UPLV);
			// for (let j = 0; j < ATTR_TYPE.SIZE; j++) {
			// 	attributes[j] += Tool.toInt(attributes[j] * petStroAttPlus[j] / GameDefine.GAME_ADD_RATIO);
			// }
		}
        

		if (this.grade > 0 || this.gradeStar > 0) {
			//宠物进阶强化大师绝对值
			// var petGradeStroAtt: number[] = DataManager.getInstance().strongerManager.getStrongerAtt(STRONGER_MONSTER_TYPE.STRONGER_PET_UPGRADE);
			for (let j = 0; j < ATTR_TYPE.SIZE; j++) {
				attributes[j] += this.gradeModel.attrAry[j]
			}
			//宠物进阶大师百分比
			// var petGradeStroAttPlus: number[] = DataManager.getInstance().strongerManager.getStrongerPlusAtt(STRONGER_MONSTER_TYPE.STRONGER_PET_UPGRADE);
			// for (let j = 0; j < ATTR_TYPE.SIZE; j++) {
			//     petGradeStroAtt[j] += Tool.toInt(petGradeStroAtt[j] * petGradeStroAttPlus[j] / GameDefine.GAME_ADD_RATIO);
			//     attributes[j] += petGradeStroAtt[j]
			// }
			
		}
		for (var j = 0; j < 4; ++j) {
			attributes[j] += this.proArr[j];
		}
		var chongwuDan: ModelchongwuDan = JsonModelManager.instance.getModelchongwuDan()[1];
		for (let i = 0; i < chongwuDan.attrAry.length; ++i) {
			// if (mountDanCfg.attrAry[i] > 0) {
			attributes[i] += chongwuDan.attrAry[i] * this.danDic[1];
			addAttrs[i] += chongwuDan.harm * this.danDic[1];
			// }
		}
		var chongwuDan1: ModelchongwuDan = JsonModelManager.instance.getModelchongwuDan()[2];
		for (let i = 0; i < chongwuDan1.attrAry.length; ++i) {
			// if (mountDanCfg.attrAry[i] > 0) {
			attributes[i] += chongwuDan1.attrAry[i] * this.danDic[2];
			addAttrs[i] += chongwuDan1.harm * this.danDic[2];
			// }
		}
		//加成值计算 万分级
		for (let i = 0; i < ATTR_TYPE.SIZE; ++i) {
			if (attributes[i] > 0 && addAttrs[i]) {
				attributes[i] += Tool.toInt(addAttrs[i] * attributes[i] / GameDefine.GAME_ADD_RATIO);
			}
		}
		return attributes;
	}
	public get powerNum(): number {
		return GameCommon.calculationFighting(this.petAtt);
	}
	//The end
}