/**
 * BY LYJ SH SYJ
 * 技能附魔的管理类
 * 
*/
class SkillEnchantManager {

	public constructor() {
	}
	public get playerData(): PlayerData {
		return DataManager.getInstance().playerManager.player.getPlayerData();
	}
	/**-------------下行内容--------------**/
	//下行解析技能附魔升级消息
	public parseLevelMsg(msg: Message): void {
		let playerIdx: number = msg.getByte();
		let skinId: number = msg.getShort();
		let level: number = msg.getInt();
		if (!this.playerData.skillEnhantDict[skinId]) {
			this.playerData.skillEnhantDict[skinId] = new SkillEnchantData();
		}
		let data: SkillEnchantData = this.playerData.skillEnhantDict[skinId];
		data.level = level;
		DataManager.getInstance().playerManager.player.updataAttribute();
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//下行解析技能附魔升阶消息
	public parseGradeMsg(msg: Message): void {
		let playerIdx: number = msg.getByte();
		let skinId: number = msg.getShort();
		let gradeCount: number = msg.getInt();
		if (this.playerData.skillEnhantDict[skinId]) {
			let data: SkillEnchantData = this.playerData.skillEnhantDict[skinId];
			data.grade = gradeCount;
			DataManager.getInstance().playerManager.player.updataAttribute();
			GameCommon.getInstance().receiveMsgToClient(msg);
		}
	}
	//下行解析技能当前穿戴皮肤消息
	public parseSkinMsg(msg: Message): void {
		let playerIdx: number = msg.getByte();
		let skillId: number = msg.getByte();
		let clothSkinId: number = msg.getShort();
		let skillInfo: SkillInfo = this.playerData.getSkillInfoById(skillId);
		if (!skillInfo) return;
		if (this.playerData.skillEnhantDict[clothSkinId] || clothSkinId == 0) {
			skillInfo.styleNum = clothSkinId;
			GameCommon.getInstance().receiveMsgToClient(msg);
		}
	}
	/**-------------上行内容--------------**/
	//上行心法激活
	public onSendActiveMsg(id: number): void {
		let activeMsg: Message = new Message(MESSAGE_ID.SKILLENCHANT_ACTIVE_MESSAGE);
		activeMsg.setByte(0);//角色编号
		activeMsg.setShort(id);
		activeMsg.setByte(1);//99代表一键升级
		GameCommon.getInstance().sendMsgToServer(activeMsg);
	}
	//上行升级消息
	public onSendLevelUpMsg(id: number, count: number = 1): void {
		let levelupMsg: Message = new Message(MESSAGE_ID.SKILLENCHANT_LEVELUP_MESSAGE);
		levelupMsg.setByte(0);//角色编号
		levelupMsg.setShort(id);
		levelupMsg.setByte(count);//99代表一键升级
		GameCommon.getInstance().sendMsgToServer(levelupMsg);
	}
	//上行升阶消息
	public onSendGradeMsg(id: number): void {
		let gradeupMsg: Message = new Message(MESSAGE_ID.SKILLENCHANT_UPGRADE_MESSAGE);
		gradeupMsg.setByte(0);//角色编号
		gradeupMsg.setShort(id);
		GameCommon.getInstance().sendMsgToServer(gradeupMsg);
	}
	//上行穿戴技能皮肤消息
	public onSendClothSkinMsg(id: number, skillID: number): void {
		let clothSkinMsg: Message = new Message(MESSAGE_ID.SKILLENCHANT_CLOTH_MESSAGE);
		clothSkinMsg.setByte(0);//角色编号
		clothSkinMsg.setByte(skillID);
		clothSkinMsg.setShort(id);
		GameCommon.getInstance().sendMsgToServer(clothSkinMsg);
	}
	/**-------------红点--------------**/
	//总红点
	public checkSkillEnhantRedp(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_SKILL)) return false;
		if (this.checkSkillEnhantUplevelRed()) return true;
		if (this.checkSkillEnhantUpGradeRed()) return true;
		return false;
	}
	//升级红点
	public checkSkillEnhantUplevelRed(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_SKILL)) return false;
		for (let xfId in JsonModelManager.instance.getModelxinfaLv()) {
			let model: ModelxinfaLv = JsonModelManager.instance.getModelxinfaLv()[xfId];
			if (this.checkSkillEnhantUplevelByIDRed(model.id)) return true;
		}
		return false;
	}
	public checkSkillEnhantUplevelByIDRed(id: number): boolean {
		let model: ModelxinfaLv = JsonModelManager.instance.getModelxinfaLv()[id];
		let data: SkillEnchantData = this.playerData.skillEnhantDict[id];
		let level: number = data ? data.level : 0;

		if (level == 0) {
			if (model.jihuocost) {
				let costItem: AwardItem = GameCommon.parseAwardItem(model.jihuocost);
				let hasNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(costItem.id);
				if (hasNum >= costItem.num) return true;
			} else {
				return true;
			}
		} else {
			let costNum: number = 4000 + level * 100;
			let hasNum: number = DataManager.getInstance().playerManager.player.getICurrency(GOODS_TYPE.FAHUN);
			if (hasNum >= costNum) return true;
		}
		return false;
	}
	//进阶红点
	public checkSkillEnhantUpGradeRed(): boolean {
		if (!FunDefine.isFunOpen(FUN_TYPE.FUN_SKILL)) return false;
		for (let xfId in JsonModelManager.instance.getModelxinfaLv()) {
			let model: ModelxinfaLv = JsonModelManager.instance.getModelxinfaLv()[xfId];
			if (this.checkSkillEnhantUpGradeByRed(model.id)) return true;
		}
		return false;
	}
	public checkSkillEnhantUpGradeByRed(id: number): boolean {
		let data: SkillEnchantData = this.playerData.skillEnhantDict[id];
		if (!data) return false;
		let model: Modelxinfajinjie = JsonModelManager.instance.getModelxinfajinjie()[id];
		let hasNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(model.cost.id);
		if (hasNum >= model.cost.num) return true;
		return false;
	}
	//The end
}