class CelestialManager {
	public warehouse = [];
	public currInfo: CelestiaLog[] = [];
	private _treasuretimes: number = 0;//每一周抽奖次数
	private _treasureAwdIdx: number = 0;//每周领奖进度

	public constructor() {
	}
	public onSendCompoundMessage(roleID: number, part: number): void {
		var message = new Message(MESSAGE_ID.CELESTIAL_COMPOUND_MESSAGE);
		message.setByte(roleID);
		message.setByte(part);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onSendUpgradeMessage(roleID: number, part: number): void {
		var message = new Message(MESSAGE_ID.CELESTIAL_UPGRADE_MESSAGE);
		message.setByte(roleID);
		message.setByte(part);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onSendDecomposeMessage(ids: number[]): void {
		var message = new Message(MESSAGE_ID.CELESTIAL_DECOMPOSE_MESSAGE);
		message.setShort(ids.length);
		for (var i: number = 0; i < ids.length; i++) {
			message.setInt(ids[i]);
		}
		GameCommon.getInstance().sendMsgToServer(message);
	}
	// public onParseDecomposeMessage(msg: Message): void {

	// }
	//更新寻宝周奖励
	public onParseTreasureWeekAwardMsg(msg: Message): void {
		var _treasuretimes: number = msg.getShort();
		if (_treasuretimes > 0) {
			this._treasuretimes = _treasuretimes;
		}
		this._treasureAwdIdx = msg.getByte();
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//寻宝次数
	public get treasureTimes(): number {
		return this._treasuretimes;
	}
	//领取到第几个奖励
	public get treasureAwdIdx(): number {
		return this._treasureAwdIdx;
	}

	public onSendTakeOutMessage(): void {
		var message = new Message(MESSAGE_ID.WAREHOUSE_TAKEOUT_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onParseTakeOutMessage(msg: Message): void {
		var len: number = msg.getShort();
		for (var i: number = 0; i < len; i++) {
			this.warehouse.shift();
		}
	}
	/*天神寻宝*/
	public onSendCelestiaTreasure(type: number): void {
		if (!GameFight.getInstance().checkBagIsFull()) {
			var message = new Message(MESSAGE_ID.TREASURE_CELESTIAL_MEESAGE);
			message.setByte(type);
			GameCommon.getInstance().sendMsgToServer(message);
		}
	}
	public onParseCelestiaTreasure(msg: Message): void {
		var awards = [];
		var award: AwardItem;
		DataManager.getInstance().playerManager.player.treasureFirst = msg.getByte();
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			award = new AwardItem();
			award.parseMessage(msg);
			awards.push(award);
		}
		//this._treasuretimes += len;
		var param: TurnplateAwardParam = new TurnplateAwardParam();
		param.desc = "寻宝获得以下奖励";
		param.titleSource = "";
		param.itemAwards = awards;
		param.autocloseTime = 11;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TreasureAwardPanel", param));
	}
	/*天神寻宝日志*/
	public onParseCelestiaTreasureLog(msg: Message): void {
		var data: CelestiaLog;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			data = new CelestiaLog();
			data.parseMessage(msg);
			this.currInfo.push(data);
		}
		this.onfilter();
	}
	private onfilter() {
		while (this.currInfo.length > 10) {
			this.currInfo.shift();
		}
	}
	public getTextFlow(): egret.ITextElement[] {
		var data: CelestiaLog;
		var ret: egret.ITextElement[] = [];
		var showInfo: string = "";
		for (var i: number = 0; i < this.currInfo.length; i++) {
			data = this.currInfo[i];
			var model = GameCommon.getInstance().getThingModel(data.award.type, data.award.id, data.award.quality);
			if (model) {
				ret.push({ text: data.name, style: { textColor: 0x289aea } });
				ret.push({ text: ` 获得`, style: { textColor: 0xffffff } });
				var lvStr: string = `${model.coatardLv}阶`;
				if (data.award.quality == GoodsQuality.Orange) {
					showInfo = ` ${model.name}(${lvStr}${Language.instance.getText('grade')})`;
				} else if (data.award.quality >= GoodsQuality.Red) {
					if (model.coatardLv) {
						showInfo = ` ${model.name}(${lvStr})`;
					} else {
						showInfo = ` ${model.name}`;
					}
				}
				ret.push({ text: showInfo, style: { textColor: GameCommon.getInstance().CreateNameColer(data.award.quality) } });
				ret.push({ text: "\n", style: {} });
			}
		}
		ret.pop();
		return ret;
	}
	/*仓库*/
	public onParseWarehouseMessage(msg: Message): void {
		this.warehouse = [];
		var base: AwardItem;
		var len: number = msg.getShort();
		for (var i: number = 0; i < len; i++) {
			base = new AwardItem();
			base.parseMessage(msg);
			this.warehouse[i] = base;
		}
	}
	/**天神+橙装红点检测方法**/
	public checkEpicTierEquipPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_HONGZHUANG)) return false;
		if (this.checkCelestiaPoint()) return true;
		if (this.checkOrangeEquipPoint()) return true;
		// if (this.checkTreasurePoint()) return true;
		if (this.checkDepotPoint()) return true;
		if (DataManager.getInstance().dominateManager.checkDomPoint()) return true;
		return false;
	}
	/**寻宝检测**/
	public checkTreasurePoint(): boolean {
		let model: Modelxunbao = JsonModelManager.instance.getModelxunbao()[1];
		// let _has: number = DataManager.getInstance().playerManager.player.getICurrency(model.costOneKey.type);
		// if (_has >= model.costOneKey.num) return true;
		/**周奖励红点**/
		let weekAwdParams: string[] = model.box.split("#");
		for (let i: number = 0; i < weekAwdParams.length; i++) {
			if (this._treasureAwdIdx > i) continue;
			let params: string[] = weekAwdParams[i] ? weekAwdParams[i].split(",") : null;
			if (!params) break;
			let times: number = parseInt(params[0]);
			if (this._treasuretimes >= times) {
				return true;
			}
		}
		return false;
	}
	/**天神装备检测**/
	public checkCelestiaPoint(): boolean {
		//合成升级
		for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
			if (this.checkJobCelestiaPoint(i)) return true;
		}
		//分解
		if (this.checkCanClothGoldEquips()) return true;
		if (this.checkGoldDecomposePoint()) return true;
		return false;
	}
	public checkJobCelestiaPoint(index: number = 0): boolean {
		for (var i: number = 0; i < GameDefine.CELESTIAL_EQUIP_SLOTS.length; i++) {
			if (this.checkJobCelestiaPointBySlot(i + MASTER_EQUIP_TYPE.SIZE * 2, index)) return true;
		}
		return false;
	}
	public checkJobCelestiaPointBySlot(slot: number, index: number = 0): boolean {
		var level: number = DataManager.getInstance().playerManager.player.coatardLv;
		var playerData = this.getPlayerData(index);
		if (!playerData) return false;
		var equipThing: EquipThing = playerData.getEquipBySlot(slot);
		var modelcurr: Modeltianshenzhuangbei;
		var modelnext: Modeltianshenzhuangbei;
		var models = JsonModelManager.instance.getModeltianshenzhuangbei();
		if (equipThing.model && equipThing.quality == GoodsQuality.Gold) {
			modelcurr = models[equipThing.model.coatardLv][0];
			if (modelcurr == null || modelcurr.coatardLv == modelcurr.next) { //满级了
				return false;
			}
			modelnext = models[modelcurr.next][0];
		} else {
			modelnext = models[GameDefine.MIN_GOLD_COATARD_LV][0];
		}

		if (!modelnext) return false;
		if (modelnext.coatardLv > level) return false;
		var _has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(GameDefine.CELESTIAL_EQUIP_ADVANCE_CONS_ID);
		if (modelcurr) {
			if (_has >= modelnext.costNum - modelcurr.costNum) return true;
		} else {
			if (_has >= modelnext.costNum) return true;
		}
		return false;
	}

	/**检测橙装红点**/
	public checkOrangeEquipPoint(): boolean {
		if (this.checkRoleOrangeEquipPoint()) return true;
		if (this.checkRedDecomposePoint()) return true;
		if (this.checkCanClothZhuxianEquips()) return true;
		if (FunDefine.checkQihunRedPoint()) return true;
		return false;
	}
	/**检测橙装可合成或升级红点**/
	public checkRoleOrangeEquipPoint(): boolean {
		for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
			if (this.checkJobOrangeEquipPoint(i)) return true;
		}
		return false;
	}
	/**检测职业橙装可合成或升级红点**/
	public checkJobOrangeEquipPoint(index: number = 0): boolean {
		var playerData = this.getPlayerData(index);
		if (!playerData) return false;
		for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
			if (this.checkJobOrangeEquipPointBySlot(i + GameDefine.Equip_Slot_Num)) return true;
		}
		return false;
	}
	public checkJobOrangeEquipPointBySlot(slot, index: number = 0): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_HONGZHUANG)) {
			return false;
		}
		var playerData = this.getPlayerData(index);
		if (!playerData) return false;
		//背包物品数量
		var item: ItemThing = DataManager.getInstance().bagManager.getGoodsThingById(OrangePanel.ITEM_ID);
		var num: number = 0;
		if (item) {
			num = item.num;
		}
		if (num <= 0) return false;
		//装备
		var equipThing: EquipThing = playerData.getEquipBySlot(slot);
		//合成
		var cost: number = 0;
		if (!equipThing || !equipThing.model) {//equipPingfen < GameCommon.calculationFighting(attrs)
			var modelCurr: Modelhongzhuang = JsonModelManager.instance.getModelhongzhuang()[0];
			if (!modelCurr)
				return false;
			cost = modelCurr.hecheng;
			return num >= cost;
		}
		//升级
		else {
			//模型数据
			let currEquipLv: number = equipThing.model.coatardLv;
			if (currEquipLv == DataManager.getInstance().playerManager.player.coatardLv) return false;
			let modelCurr: Modelhongzhuang = JsonModelManager.instance.getModelhongzhuang()[currEquipLv - 1];
			let modelNext: Modelhongzhuang = JsonModelManager.instance.getModelhongzhuang()[currEquipLv];
			if (!modelNext)
				return false;
			let beforeNum: number = modelCurr ? modelCurr.hecheng : 0;
			cost = modelNext.hecheng - beforeNum;
			return num >= cost;
		}
	}

	public checkCanClothZhuxianEquips(): boolean {
		var len: number = DataManager.getInstance().bagManager.getJobClothEquips(1).length;
		return len > 0;
	}

	public checkCanClothGoldEquips(): boolean {
		var len: number = DataManager.getInstance().bagManager.getJobClothEquips(2).length;
		return len > 0;
	}

	public checkRedDecomposePoint(): boolean {
		var len: number = DataManager.getInstance().bagManager.getAllRedEquip().length;
		return len > 0;
	}

	public checkGoldDecomposePoint(): boolean {
		var len: number = DataManager.getInstance().bagManager.getAllGoldEquip().length;
		return len > 0;
	}

	/**仓库检测**/
	public checkDepotPoint(): boolean {
		var data = DataManager.getInstance().celestialManager.warehouse;
		if (data && data.length > 0) return true;
		return false;
	}
	public getPlayerData(index: number): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData(index);
	}
	//The end
}
class CelestiaLog {
	public name: string;
	public award: AwardItem;
	public constructor() {
	}
	public parseMessage(msg: Message) {
		this.name = msg.getString();
		this.award = new AwardItem();
		this.award.parseMessage(msg);
	}
}