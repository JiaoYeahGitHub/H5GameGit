/**
 * 锻造管理类
 * @author	lzn
 * 
 * 
 */
class ForgeManager {

	public constructor() {
	}

	/**获取角色强化战力**/
	public getRoleIntensifyPower(job: number = 0): number {
		var add: number = 0;
		for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
			var slotThing: EquipSlotThing = this.getEquipSlotThing(i);
			if (slotThing.intensifyLv > 0) {
				add += this.getSlotIntensifyPower(i);
			}
		}
		return add;
	}

	/**获取对应槽位置强化战力**/
	public getSlotIntensifyPower(slot: number) {
		var attrAry = this.getIntensifyAttr(slot);
		return GameCommon.calculationFighting(attrAry);
	}

	/**获取角色融魂战力**/
	public getRoleInfusePower(job: number = 0): number {
		var add: number = 0;
		for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
			var slotThing: EquipSlotThing = this.getEquipSlotThing(i);
			if (slotThing.infuseLv > 0) {
				add += this.getSlotInfulsePower(i);
			}
		}
		return add;
	}
	/**获取对应槽位置融魂战力**/
	public getSlotInfulsePower(slot: number) {
		var model = this.getInfuseModel(slot);
		return model ? GameCommon.calculationFighting(model.attrAry) : 0;
	}

	/**获取角色宝石战力**/
	public getRoleGemPower(job: number = 0): number {
		var add: number = 0;
		for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
			add += this.getSlotGemPower(i);
		}
		return add;
	}
	/**获取对应槽位置宝石战力**/
	public getSlotGemPower(slot: number) {
		var slotThing: EquipSlotThing = this.getEquipSlotThing(slot);
		if (slotThing.gemLv == 0) {
			return 0;
		}
		var equip_gemtypes: number[] = GoodsDefine.SLOT_GEMTYPE[slotThing.slot];
		var attrAry: number[] = GameCommon.getInstance().getAttributeAry();
		for (var i: number = 0; i < GameDefine.GEM_SLOT_NUM; i++) {
			var gem_type: number = equip_gemtypes[i];
			var gem_level: number = slotThing.getGemLvByGemSlot(i);
			var model: Modelbaoshi = JsonModelManager.instance.getModelbaoshi()[gem_level - 1];
			if (model) {
				var tianshi_puls_val: number = DataManager.getInstance().playerManager.getTianshiAttrPlusByType(TIANSHI_PULS_TYPE.FORGE);
				var attr_val: number = model.attrAry[gem_type];
				attrAry[gem_type] += attr_val + Tool.toInt(attr_val * tianshi_puls_val / GameDefine.GAME_ADD_RATIO);
			}
		}
		return GameCommon.calculationFighting(attrAry);
	}
	/**获取对应的强化属性**/
	public getIntensifyAttr(slot: number, lv: number = -1): number[] {
		let attrAry: number[] = GameCommon.getInstance().getAttributeAry();
		if (GameDefine.QIANGHUA_MAX >= lv) {
			if (lv < 0) {
				var slotThing: EquipSlotThing = this.getEquipSlotThing(slot);
				lv = slotThing.intensifyLv;
			}

			let model: Modelqianghua = JsonModelManager.instance.getModelqianghua()[GoodsDefine.EQUIP_SLOT_TYPE[slot]];
			for (let i: number = 0; i < ATTR_TYPE.SIZE; i++) {
				let attrValue: number = model.attrAry[i];
				attrAry[i] = Tool.toInt(attrValue * lv + lv * (lv - 1) * attrValue / 40);
			}
		}
		return attrAry;
	}
	/**获取对应的强化消耗**/
	public getIntensifyCost(slot: number, lv: number = -1): number {
		let costNum: number = 0;
		if (GameDefine.QIANGHUA_MAX >= lv) {
			if (lv < 0) {
				var slotThing: EquipSlotThing = this.getEquipSlotThing(slot);
				lv = slotThing.intensifyLv;
			}

			let model: Modelqianghua = JsonModelManager.instance.getModelqianghua()[GoodsDefine.EQUIP_SLOT_TYPE[slot]];
			costNum = model.cost.num + (lv - 1) * 2;
		}
		return costNum;
	}
	/**获取融魂model**/
	public getInfuseModel(slot: number, lv: number = -1): Modelronghun {
		var slotThing: EquipSlotThing = this.getEquipSlotThing(slot);
		var currLv: number = lv == -1 ? slotThing.infuseLv : lv;
		var model = JsonModelManager.instance.getModelronghun()[GoodsDefine.EQUIP_SLOT_TYPE[slot]][currLv - 1];
		return model;
	}

	/*获得装备槽信息*/
	public getEquipSlotThing(index: number): EquipSlotThing {
		return this.getPlayer().getPlayerData().getEquipSlotThings(index);
	}
	private getPlayer(): Player {
		return DataManager.getInstance().playerManager.player;
	}
	/*宝石抽奖返回*/
	public gemlotteryFreeTimes: number = 0;//宝石抽奖免费次数
	public gemLotteryLog: string[] = [];
	public onParseGemLotteryFreeTimes(msg: Message): void {
		var nextFreeSec: number = msg.getInt();//剩余领奖时间秒
		this.gemlotteryFreeTimes = nextFreeSec > 0 ? 0 : 1;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.GEM_LOTTERY_FREE));
	}
	public onParseLotteryLog(msg: Message): void {
		var logSize: number = msg.getByte();
		for (var i: number = 0; i < logSize; i++) {
			var playerName: string = msg.getString();
			var gemNum: string = msg.getString();
			var gemId: string = msg.getString();
			// var gemModel: Modelbaoshi = JsonModelManager.instance.getModelbaoshi()[gemId];
			var logstr: string = '';//`恭喜玩家<font color='#289aea'>${playerName}</font>获得<font color='#${GameCommon.Quality_Color_String[gemModel.quality]}'>${gemModel.name}*${gemNum}</font>`
			this.gemLotteryLog.push(logstr);
			if (this.gemLotteryLog.length > 20) {
				this.gemLotteryLog.splice(0, 1);
			}
		}
	}
	public onParseGemLottery(msg: Message): void {
		var awards = [];
		var award: AwardItem;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			award = new AwardItem();
			award.type = msg.getByte();
			award.id = msg.getShort();
			award.num = msg.getInt();
			awards.push(award);
		}
		var param: TurnplateAwardParam = new TurnplateAwardParam();
		param.desc = "恭喜您获得以下奖励";
		param.titleSource = "";
		param.itemAwards = awards;
		param.autocloseTime = 11;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TurnplateAwardPanel", param));
	}

	public getCanForge() {
		return false;
	}
	public getCanInfuse() {
		var bl: boolean = false;
		return bl;
	}
	public getCanSmelt() {
		var bl: boolean = false;
		return bl;
	}
	// 554人物装备熔炼
	// 上行：        size    short
	// 循环读取     ID       short 
	// 下行：        size    short
	// 循环读取     ID       short    熔炼的人物装备的ID
	public onSendSmeltCommonMessage(smelt, num): void {
		var message = new Message(MESSAGE_ID.PLAYER_SMELT_COMMON_MESSAGE);
		message.setShort(num);
		for (var key in smelt) {
			message.setShort(smelt[key].equipId);
		}
		GameCommon.getInstance().sendMsgToServer(message);
	}

	public onSendSmeltSpecialMessage(smelt, num): void {
		var message = new Message(MESSAGE_ID.PLAYER_SMELT_SPECIAL_MESSAGE);
		message.setShort(num);
		for (var key in smelt) {
			message.setShort(smelt[key].equipId);
		}
		GameCommon.getInstance().sendMsgToServer(message);
	}

	public getForgePointShow(): boolean {
		if (this.getIntensifyPointShow()) return true;
		if (this.getInfusePointShow()) return true;
		if (this.getGemPointShow()) return true;
		if (this.checkQuenchingPoint()) return true;
		if (this.checkLianhuaPoint()) return true;
		return false;
	}
	/**强化红点**/
	public getIntensifyPointShow(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_QIANGHUA)) return false;
		for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
			if (this.getJobIntensifyPointShow()) return true;
		}
		return false;
	}
	public getJobIntensifyPointShow(): boolean {
		let playerData = DataManager.getInstance().playerManager.player.getPlayerData();
		let slotThing: EquipSlotThing = playerData.getEquipSlotThings(playerData.currIntensify.slot);
		let model: Modelqianghua = JsonModelManager.instance.getModelqianghua()[GoodsDefine.EQUIP_SLOT_TYPE[playerData.currIntensify.slot]];
		let costNum: number = this.getIntensifyCost(playerData.currIntensify.slot);
		if (playerData.currIntensify.intensifyLv >= GameDefine.QIANGHUA_MAX)
			return false;
		if (costNum > 0) {
			let has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id, model.cost.type);
			if (has >= costNum) {
				return true;
			}
		}
		return false;
	}
	/**注灵红点**/
	public getInfusePointShow(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_ZHULING)) return false;
		for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
			if (this.getJobInfusePointShow()) return true;
		}
		return false;
	}
	public getJobInfusePointShow(): boolean {
		let ronghunDict = JsonModelManager.instance.getModelronghun();
		let playerData = DataManager.getInstance().playerManager.player.getPlayerData();
		let slotThing: EquipSlotThing = playerData.getEquipSlotThings(playerData.currInfuseSoul.slot);
		let model: Modelronghun = ronghunDict[GoodsDefine.EQUIP_SLOT_TYPE[playerData.currInfuseSoul.slot]][slotThing.infuseLv];
		if (model) {
			let has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id, model.cost.type);
			if (has >= model.cost.num) {
				return true;
			}
		}
		return false;
	}
	/**宝石红点**/
	public getGemPointShow(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_BAOSHI)) return false;
		for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
			if (this.getJobGemPointShow(i)) return true;
		}
	}
	public getJobGemPointShow(index: number = 0): boolean {
		var playerData = DataManager.getInstance().playerManager.player.getPlayerData(index);
		var slotThing: EquipSlotThing = playerData.getEquipSlotThings(playerData.currGemInlay.slot);
		var currGemLv: number = slotThing.getGemLvByGemSlot(playerData.currGemInlay.slot);
		let model: Modelbaoshi = JsonModelManager.instance.getModelbaoshi()[currGemLv];
		if (model) {
			let has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id, model.cost.type);
			if (has >= model.cost.num) {
				return true;
			}
		}
		return false;
	}
	public checkQuenchingPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_CUILIAN)) return false;
		for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
			if (this.getJobQuenching()) return true;
		}
		return false;
	}
	public getJobQuenching(): boolean {
		for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
			if (this.getJobQuenchingBySlot(i)) return true;
		}
		return false;
	}
	public checkLianhuaPoint(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_LIANHUA)) return false;
		for (var i: number = 0; i < GameDefine.Equip_Slot_Num; i++) {
			if (this.checkLianhuaPointBySlot(i)) return true;
		}
	}
	public checkLianhuaPointBySlot(slot: number): boolean {
		var playerData = DataManager.getInstance().playerManager.player.getPlayerData();
		if (!playerData) return false;
		let equipType: number = GoodsDefine.EQUIP_SLOT_TYPE[slot];
		let slotThing: EquipSlotThing = playerData.getEquipSlotThings(slot);
		let lianhuaModelDict = JsonModelManager.instance.getModellianhua();
		let model: Modellianhua = lianhuaModelDict[equipType][slotThing.zhLv - 1];
		if (model) {
			let has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id, model.cost.type);
			if (has >= model.cost.num) {
				return true;
			}
		}
		return false;
	}
	public getJobQuenchingBySlot(slot: number): boolean {
		var playerData = DataManager.getInstance().playerManager.player.getPlayerData();
		if (!playerData) return false;
		var slotThing: EquipSlotThing = playerData.getEquipSlotThings(slot);
		var model: Modelcuilian = JsonModelManager.instance.getModelcuilian()[slotThing.quenchingLv + 1];
		if (!model) return false;
		var has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(GoodsDefine.ITEM_ID_CUILIAN, GOODS_TYPE.ITEM);
		if (has >= model.costNum) return true;
		return false;
	}

}