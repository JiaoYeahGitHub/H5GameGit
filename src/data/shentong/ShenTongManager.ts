class ShenTongManager {
	public shentongSlotInfos: ShenTongSlotInfo[];//神通槽位信息
	public shentongBags: ShenTongItem[];//神通背包信息
	private _shentongBagNumByModelId;
	public shentongMinQulity: number = -1;//身上穿戴的最差的神通

	public constructor() {
		this.shentongSlotInfos = [];
		this.shentongBags = [];
		for (var i: number = 0; i < GameDefine.Shentong_MaxSlot; i++) {
			this.shentongSlotInfos.push(new ShenTongSlotInfo(i));
		}
	}
	//判断神通红点
	public onCheckShentongRed(): boolean {
		// if (!FunDefine.isFunOpen(FUN_TYPE.FUN_SHENTONG)) {
		// 	return false;
		// }
		// var data = DataManager.getInstance().shentongManager;
		// for (var i: number = 0; i < data.shentongBags.length; i++) {
		// 	var shentongItem: ShenTongItem = data.shentongBags[i];
		// 	if (shentongItem.model.quality > data.shentongMinQulity) {
		// 		return true;
		// 	}
		// }
		return false;
	}
	//初始化神通背包信息
	public onParseInitBagMsg(msg: Message): void {
		// this._shentongBagNumByModelId = {};
		// if (this.shentongBags.length > 0) {
		// 	for (var i: number = this.shentongBags.length - 1; i >= 0; i--) {
		// 		var shentongItem: ShenTongItem = this.shentongBags[i];
		// 		shentongItem = null;
		// 		this.shentongBags.splice(i, 1);
		// 	}
		// }
		// var shentongSize: number = msg.getShort();
		// for (var i: number = 0; i < shentongSize; i++) {
		// 	var shentongItem: ShenTongItem = new ShenTongItem();
		// 	shentongItem.parseInfo(msg);
		// 	this.shentongBags.push(shentongItem);
		// 	if (!this._shentongBagNumByModelId[shentongItem.model.id]) {
		// 		this._shentongBagNumByModelId[shentongItem.model.id] = 0;
		// 	}
		// 	this._shentongBagNumByModelId[shentongItem.model.id]++;
		// }
		// GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//神通背包增加
	public onParseAddBagMsg(msg: Message): void {
		// var shentongItem: ShenTongItem = new ShenTongItem();
		// shentongItem.parseInfo(msg);
		// this.shentongBags.push(shentongItem);
		// if (!this._shentongBagNumByModelId[shentongItem.model.id]) {
		// 	this._shentongBagNumByModelId[shentongItem.model.id] = 0;
		// }
		// this._shentongBagNumByModelId[shentongItem.model.id]++;
		// GameCommon.getInstance().onGetShenTongAlert(shentongItem.model);
		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAYER_SHENTONG_ADD), shentongItem);
	}
	//神通背包删除
	public onParseRemoveBagMsg(msg: Message): void {
		// var shentongID: number = msg.getShort();
		// for (var i: number = 0; i < this.shentongBags.length; i++) {
		// 	var shentongItem: ShenTongItem = this.shentongBags[i];
		// 	if (shentongItem.id == shentongID) {
		// 		this.shentongBags[i] = null;
		// 		this.shentongBags.splice(i, 1);
		// 		if (this._shentongBagNumByModelId[shentongItem.model.id]) {
		// 			this._shentongBagNumByModelId[shentongItem.model.id] = Math.max(0, this._shentongBagNumByModelId[shentongItem.model.id] - 1);
		// 		}
		// 		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAYER_SHENTONG_REMOVE), shentongID);
		// 		break;
		// 	}
		// }
	}
	//初始化神通槽位信息
	public onParseInitSlotMsg(msg: Message): void {
		var slotSize: number = msg.getByte();
		for (var i: number = 0; i < slotSize; i++) {
			this.onUpdateSlot(i, msg);
		}
		// DataManager.getInstance().playerManager.player.data.updataAttribute(false);
	}
	//更新神通槽位
	public onParseUpdateSlotMsg(msg: Message): void {
		// var isSuccess: boolean = msg.getBoolean();
		// var learnDesc = [];
		// if (isSuccess) {
		// 	var slotIndex: number = msg.getByte();
		// 	var oldShentongName: string = this.shentongSlotInfos[slotIndex].model ? this.shentongSlotInfos[slotIndex].model.name : null;
		// 	var olodShentongQulity: number = 0;
		// 	var restoreValue: number = 0;
		// 	if (oldShentongName) {
		// 		olodShentongQulity = this.shentongSlotInfos[slotIndex].model.quality;
		// 		for (var i: number = 1; i < this.shentongSlotInfos[slotIndex].level; i++) {
		// 			var shentonglvModel: ModelShentongLv = ModelManager.getInstance().modelShentongLv[i];
		// 			restoreValue += shentonglvModel.exps[olodShentongQulity];
		// 		}
		// 		restoreValue = (this.shentongSlotInfos[slotIndex].exp + restoreValue) * 10;
		// 	}
		// 	var olodShentongQulity: number = this.shentongSlotInfos[slotIndex].model ? this.shentongSlotInfos[slotIndex].model.quality : 0;
		// 	this.onUpdateSlot(slotIndex, msg);
		// 	if (oldShentongName) {
		// 		learnDesc.push({ text: `领悟成功，神通` });
		// 		learnDesc.push({ text: this.shentongSlotInfos[slotIndex].model.name, style: { textColor: GameCommon.getInstance().CreateNameColer(this.shentongSlotInfos[slotIndex].model.quality) } });
		// 		learnDesc.push({ text: `替换神通` });
		// 		learnDesc.push({ text: oldShentongName, style: { textColor: GameCommon.getInstance().CreateNameColer(olodShentongQulity) } });
		// 		learnDesc.push({ text: `，返还悟性` });
		// 		learnDesc.push({ text: (GameDefine.ShenTong_Restore_Qulity[olodShentongQulity] + restoreValue).toString(), style: { textColor: 0x28e828 } });
		// 		learnDesc.push({ text: `点` });
		// 	} else {
		// 		learnDesc.push({ text: `天降大吉，领悟神通` });
		// 		learnDesc.push({ text: this.shentongSlotInfos[slotIndex].model.name, style: { textColor: GameCommon.getInstance().CreateNameColer(this.shentongSlotInfos[slotIndex].model.quality) } });
		// 		learnDesc.push({ text: `成功` });
		// 	}
		// 	// DataManager.getInstance().playerManager.player.data.updataAttribute();
		// 	GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAYER_SHENTONG_SLOT_UPDATE), slotIndex);
		// } else {
		// 	var modelId: number = msg.getShort();
		// 	// var failSTModel: ModelShentong = ModelManager.getInstance().modelShentong[modelId];
		// 	// if (failSTModel) {
		// 	// 	learnDesc.push({ text: `生不逢时，神通` });
		// 	// 	learnDesc.push({ text: failSTModel.name, style: { textColor: GameCommon.getInstance().CreateNameColer(failSTModel.quality) } });
		// 	// 	learnDesc.push({ text: `领悟失败` });
		// 	// }
		// }
		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("AlertDescUI", new AlertFrameParam(learnDesc, null, null)));
		// GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_CLOSE), "ShenTongLearnPanel");
	}
	//更新某一个槽位
	private onUpdateSlot(index: number, msg: Message): void {
		// var slotInfo: ShenTongSlotInfo = this.shentongSlotInfos[index];
		// slotInfo.parseInfo(msg);
		// if (slotInfo.model && (this.shentongMinQulity == -1 || this.shentongMinQulity > slotInfo.model.quality)) {
		// 	this.shentongMinQulity = slotInfo.model.quality;
		// }
	}
	//升级成功某一槽位的神通
	public parseLevelUpMsg(msg: Message): void {
		var slotIndex: number = msg.getByte();
		var slotInfo: ShenTongSlotInfo = this.shentongSlotInfos[slotIndex];
		slotInfo.level = msg.getShort();
		slotInfo.exp = msg.getShort();
		// DataManager.getInstance().playerManager.player.data.updataAttribute();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAYER_SHENTONG_SLOT_UPDATE), slotIndex);
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//进阶成功某一槽位的神通
	public parseUpgradeMsg(msg: Message): void {
		var slotIndex: number = msg.getByte();
		var slotInfo: ShenTongSlotInfo = this.shentongSlotInfos[slotIndex];
		slotInfo.grade = msg.getShort();
		// DataManager.getInstance().playerManager.player.data.updataAttribute();
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.PLAYER_SHENTONG_SLOT_UPDATE), slotIndex);
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//通过模版ID获取背包内物品数量
	public getShentongNumByModelId(modelid: number): number {
		if (this._shentongBagNumByModelId[modelid]) {
			return this._shentongBagNumByModelId[modelid];
		}
		return 0;
	}

	public getCanShowRedPoint(): boolean {
		// var savvy: number = DataManager.getInstance().playerManager.player.savvy;
		// var modelGoldCosume: ModelWudao = JsonModelManager.instance.getInstance().modelWudaoConsume[WuDao_Type.Wuxing];
		// if (savvy >= modelGoldCosume.moneyOne.num)
		// 	return true;
		return false;
	}

	//The end
}