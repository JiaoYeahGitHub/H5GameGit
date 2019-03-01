class DominateManager {
	public succeed: number;
	public constructor() {
	}
	// 351  升级   激活
	// 上行：  byte   哪个角色
	// byte   位置
	// 下行：  byte   哪个角色
	// byte   位置
	// short  等级
	// byte   1--成功  0--失败
	public onSendUpgradeMessage(characterID: number, slot: number): void {
		var message = new Message(MESSAGE_ID.DOMINATE_UPGRADE_MESSAGE);
		message.setByte(characterID);
		message.setByte(slot);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onParseDominateUpgrade(msg: Message): void {
		DataManager.getInstance().playerManager.player.onParseDominateUpgrade(msg);
		this.succeed = msg.getByte();
	}
	// 352  升阶
	// 上行：  byte   哪个角色
	// byte   位置
	// 下行：  byte   哪个角色
	// byte   位置
	// short  阶
	// byte   1--成功  0--失败
	public onSendAdvanceMessage(characterID: number, slot: number): void {
		var message = new Message(MESSAGE_ID.DOMINATE_ADVANCE_MESSAGE);
		message.setByte(characterID);
		message.setByte(slot);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onParseDominateAdvance(msg: Message): void {
		DataManager.getInstance().playerManager.player.onParseDominateAdvance(msg);
	}
	// 353分解
	// 上行：short  长度
	// 循环   short   物品id
	// int   数量
	// 下行：
	public onSendDecomposeMessage(info): void {
		var len: number = 0;
		for (var key in info) {
			len++;
		}
		if (len == 0) return;
		var message = new Message(MESSAGE_ID.DOMINATE_DECOMPOSE_MESSAGE);
		message.setShort(len);
		for (var key in info) {
			message.setShort(parseInt(key));
			message.setInt(info[key]);
		}
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onParseDecompose(msg: Message): void {

	}
	public getOneJobDomPower(index: number, slot: number): number {
		var attr = GameCommon.getInstance().getAttributeAry();
		var thing = this.getPlayerData(index).getDominateThingBySlot(slot);
		var models = JsonModelManager.instance.getModelshanggutaozhuang();
		var currModel: Modelshanggutaozhuang = models[thing.slot][thing.lv - 1];
		if (currModel) {
			attr = currModel.base_effect;
		}
		return GameCommon.calculationFighting(attr);
	}
	private getPlayerData(index: number = 0): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData(index);
	}
	public checkDomPoint(): boolean {
		if (this.checkDomUpgradePoint()) return true;
		if (this.checkDomAdvancePoint()) return true;
		if (this.checkDecomposPoint()) return true;
		return false;
	}
	public checkJobDomPoint(job: number): boolean {
		if (this.checkJobDomUpgradePoint(job)) return true;
		if (this.checkJobDomAdvancePoint(job)) return true;
		return false;
	}
	public checkDomUpgradePoint(): boolean {
		for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
			if (this.checkJobDomUpgradePoint(i)) return true;
		}
		return false;
	}
	public checkJobDomUpgradePoint(job: number = 0): boolean {
		for (var i: number = 0; i < GameDefine.Dominate_Slot_Num; i++) {
			if (this.checkJobDomUpgradePointBySlot(i)) return true;
		}
		return false;
	}
	public checkJobDomUpgradePointBySlot(slot: number): boolean {
		// if (!FunDefine.isFunOpen(FUN_TYPE.FUN_DOMIANATE1 + slot)) return false;
		var playerData = this.getPlayerData();
		if (!playerData) return false;
		var thing: DominateThing = playerData.getDominateThingBySlot(slot);
		var model = JsonModelManager.instance.getModelfunctionLv()[GameDefine.Dominate_Slot_func[slot]];
		var lv = model.level;
		if (DataManager.getInstance().playerManager.player.level < lv) return false;
		var models = JsonModelManager.instance.getModelshanggutaozhuang();
		var nextModel: Modelshanggutaozhuang = models[thing.slot][thing.lv];
		if (!nextModel) return false;
		var _has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(nextModel.cost.id, nextModel.cost.type);
		if (_has >= nextModel.cost.num) return true;
		return false;
	}

	public checkDomAdvancePoint(): boolean {
		for (var i: number = 0; i < GameDefine.Max_Role_Num; i++) {
			if (this.checkJobDomAdvancePoint(i)) return true;
		}
		return false;
	}
	public checkJobDomAdvancePoint(job: number = 0): boolean {
		for (var i: number = 0; i < GameDefine.Dominate_Slot_Num; i++) {
			if (this.checkJobDomAdvancePointBySlot(i)) return true;
		}
		return false;
	}
	public checkJobDomAdvancePointBySlot(slot: number): boolean {
		var playerData = this.getPlayerData();
		if (!playerData) return false;
		var thing: DominateThing = playerData.getDominateThingBySlot(slot);
		if (thing.tier == 1) return false;
		var model = JsonModelManager.instance.getModelfunctionLv()[GameDefine.Dominate_Slot_func[slot]];
		var lv = model.level;
		if (DataManager.getInstance().playerManager.player.level < lv) return false;
		var models = JsonModelManager.instance.getModelshanggutaozhuang();
		var nextModel: Modelshanggutaozhuang = models[thing.slot][thing.lv];
		if (!nextModel) return false;
		var _has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(GameDefine.Domiante_Advance_needID, GOODS_TYPE.ITEM);
		if (_has >= GameDefine.Domiante_Advance_needNum) return true;
		return false;
	}
	//分解红点
	public checkDecomposPoint(): boolean {
		for (var i: number = 0; i < GameDefine.Dominate_Slot_Num; i++) {
			var thing = this.getPlayerData().getDominateThingBySlot(i);
			var model: Modelshanggutaozhuang = JsonModelManager.instance.getModelshanggutaozhuang()[i][0];
			if (thing.lv > 0) {
				var _has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id, GOODS_TYPE.ITEM);
				if (_has && _has > 0) {
					return true;
				}
			}
		}
	}
	//The End
}