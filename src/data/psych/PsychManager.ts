/**
 * 
 * 元魂管理器
 * @author	lzn	
 * 
 * 
 */
class PsychManager {
	public psychQueue = {};
	public currGain: PsychBase[] = [];
	public constructor() {
	}
	public parsePsych(msg: Message) {
		var base: PsychBase;
		var len = msg.getShort();
		for (var i = 0; i < len; i++) {
			this.parseOnePsych(msg);
		}
	}

	// 683  背包中元神变化
	// byte   0--消耗  1--增加
	// byte  长度
	// 循环读取    int   uid
	// short  modelId
	public parsePsychGain(msg: Message) {
		// var from: number = 0;
		var from: number = msg.getInt();
		var type: number = msg.getByte();
		var len = msg.getByte();
		var base: PsychBase;
		for (var i = 0; i < len; i++) {
			if (type == 1) {
				base = this.parseOnePsych(msg);
				GameCommon.getInstance().onGetPsychAlert(base.model, from);
			} else if (type == 0) {
				this.delOnePsych(msg);
			}
		}
	}
	private parseOnePsych(msg: Message): PsychBase {
		var base: PsychBase = new PsychBase();
		base.parsePsych(msg);
		if (this.psychQueue[base.UID]) {
			this.psychQueue[base.UID].onUpdate(base);
		} else {
			this.psychQueue[base.UID] = base;
		}
		return this.psychQueue[base.UID];
	}
	private delOnePsych(msg: Message): void {
		var base: PsychBase = new PsychBase();
		base.parsePsych(msg);
		this.delOnePsychByUID(base.UID);
	}
	public delOnePsychByUID(uid: number) {
		delete this.psychQueue[uid];
	}

	public onSendPsychUpgrade(roleID: number, slot: number): void {
		var message = new Message(MESSAGE_ID.PLAYER_PSYCH_UPGRADE_MESSAGE);
		message.setByte(roleID);
		message.setByte(slot);
		GameCommon.getInstance().sendMsgToServer(message);
	}

	public onSendPsychEquip(roleID: number, slot: number, uid: number): void {
		var message = new Message(MESSAGE_ID.PLAYER_PSYCH_EQUIP_MESSAGE);
		message.setByte(roleID);
		message.setByte(slot);
		message.setInt(uid);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onSendDecomposeMessage(info: PsychBase[]): void {
		var len: number = info.length;
		var message = new Message(MESSAGE_ID.PLAYER_PSYCH_DECOMPOSE_MESSAGE);
		message.setShort(len);
		for (var i: number = 0; i < len; i++) {
			message.setInt(info[i].UID);
		}
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public getJobPsychPower(job: number): number {
		var add: number = 0;
		for (var i: number = 0; i < GameDefine.Psych_Slot_Num; i++) {
			var slotThing: PsychBase = this.getPsychBySlot(job, i);
			if (slotThing.modelID > 0) {
				add += this.getOnePsychByID(slotThing.modelID);
			}
		}
		return add;
	}
	public getOnePsychByID(modelID: number): number {
		var add: number = 0;
		var model: Modelyuanshen = JsonModelManager.instance.getModelyuanshen()[modelID];
		if (model) {
			add = GameCommon.calculationFighting(model.attrAry);
		}
		return add;
	}

	/*获得装备槽信息*/
	public getPsychBySlot(playerIndex: number, index: number): PsychBase {
		return this.getPlayer().getPlayerData(playerIndex).getPsychBySlot(index);
	}
	public getPlayer() {
		return DataManager.getInstance().playerManager.player;
	}

	public getOneLvAllPsych(): Modelyuanshen[] {
		var ret: Modelyuanshen[] = [];
		var models = JsonModelManager.instance.getModelyuanshen();
		var base: Modelyuanshen;
		for (var key in models) {
			base = models[key];
			if (base.lv == 1) {
				ret.push(base);
			}
		}
		return ret;
	}
	public getNextModel(id: number): Modelyuanshen {
		var model: Modelyuanshen = JsonModelManager.instance.getModelyuanshen()[id];
		if (!model) return null;
		var lv = model.lv + 1;
		var models = JsonModelManager.instance.getModelyuanshen();
		for (var key in models) {
			if (models[key].lv == lv && models[key].type == model.type && models[key].pinzhi == model.pinzhi) {
				return models[key];
			}
		}
		return null;
	}

	public getIndexPsychPoint(index: number): boolean {
		if (this.getCanChangePsych(index)) return true;
		if (this.getCanUpgradePsych(index)) return true;
		return false;
	}
	public getCanChangePsych(index: number): boolean {
		for (var i: number = 0; i < GameDefine.Psych_Slot_Num; i++) {
			if (this.getCanChangePsychBySlot(index, i)) return true;
		}
		return false;
	}

	public getCanChangeOrUpdateBySlot(index: number, slot: number): boolean {
		if (this.getCanChangePsychBySlot(index, slot)) return true;
		if (this.getCanUpgradePsychBySlot(index, slot)) return true;
		return false;
	}

	public getCanChangePsychBySlot(index: number, slot: number) {
		var playerData = this.getPlayer().getPlayerData(index);
		if (!playerData) return false;
		if (!this.getPlayer().getPsychIsUnlockBySlot(slot)) return false;
		var types: number[] = [];
		var base: PsychBase;
		var curr: PsychBase;
		for (var i: number = 0; i < GameDefine.Psych_Slot_Num; i++) {
			base = playerData.getPsychBySlot(i);
			if (base.modelID > 0) {
				if (i == slot) {
					curr = base;
				}
				if (types.indexOf(base.model.type) == -1) {
					types.push(base.model.type);
				}
			}
		}
		var data = DataManager.getInstance().psychManager.psychQueue;
		for (var key in data) {
			base = data[key];
			if (!base.model) continue;
			if (types.indexOf(base.model.type) == -1 && !curr) return true;
			if (types.indexOf(base.model.type) == -1 && curr && curr.fightValue < base.fightValue) return true;
			if (curr && curr.model.type == base.model.type && curr.fightValue < base.fightValue) return true;
		}
		return false;
	}

	public getCanUpgradePsych(index: number): boolean {
		for (var i: number = 0; i < GameDefine.Psych_Slot_Num; i++) {
			if (this.getCanUpgradePsychBySlot(index, i)) return true;
		}
		return false;
	}
	public getCanUpgradePsychBySlot(index: number, slot: number): boolean {
		var playerData = this.getPlayer().getPlayerData(index);
		if (!playerData) return false;
		if (!this.getPlayer().getPsychIsUnlockBySlot(slot)) return false;
		var base: PsychBase = playerData.getPsychBySlot(slot);
		if (base.modelID <= 0) return false;
		var next: Modelyuanshen = this.getNextModel(base.modelID);
		if (!next) return false;
		var _has: number = DataManager.getInstance().bagManager.getGoodsThingNumById(next.cost.id, next.cost.type);
		if (_has >= next.cost.num) return true;
		return false;
	}
}