class UnionManager {
	private _selfUnionInfo: MyUnionData;//我的公会信息

	public applyUnionList: UnionInfo[];//申请帮会列表
	public applyPageNum: number = 1;
	public applyPageTotal: number = 1;
	public joinCDTime: number = 0;//加入公会的CD
	public unionSkills;
	public unionLogs: string[];
	public tasks: Object;
	public record: UnionPrizeLog[] = [];
	public hasDupPassAward: boolean;

	public constructor() {
		this.applyUnionList = [];
		this.unionSkills = {};
		this.unionLogs = [];
		this.tasks = {};
		var base: UnionTask;
		var models = JsonModelManager.instance.getModelguildTask();
		for (var key in models) {
			base = new UnionTask();
			this.tasks[key] = base;
			base.id = parseInt(key);
		}
	}
	//获取自己的帮会信息 为空即为没有帮会
	public get unionInfo(): MyUnionData {
		return this._selfUnionInfo;
	}
	//解析自己的帮会信息
	public parseUnionInfoMsg(msg: Message): void {
		var hasUnion: boolean = msg.getBoolean();
		if (hasUnion) {
			if (!this._selfUnionInfo) {
				this._selfUnionInfo = new MyUnionData();
			}
			this._selfUnionInfo.parseMsg(msg);
		} else {
			this.onDestroyUnionInfo();
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//解析帮会列表
	public parseUnionListMsg(msg: Message): void {
		if (this.applyUnionList.length > 0) {
			for (var i: number = this.applyUnionList.length - 1; i >= 0; i--) {
				this.applyUnionList[i] = null;
				this.applyUnionList.splice(i, 1);
			}
		}
		this.applyPageNum = msg.getShort();
		this.applyPageTotal = msg.getShort();
		var unionSize: number = msg.getByte();
		for (var i: number = 0; i < unionSize; i++) {
			this.applyUnionList[i] = new UnionInfo();
			this.applyUnionList[i].parseMsg(msg);
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//解析帮会成员列表
	public parseUnionMemberMsg(msg: Message): void {
		if (this._selfUnionInfo) {
			this._selfUnionInfo.parseMemberList(msg);
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//解析帮会成员仓库
	// public unionMemberWarehouse(msg: Message): void {
	// 	if (this._selfUnionInfo) {
	// 		var memberPlayerId: number = msg.getInt();
	// 		var postion: number = msg.getByte();
	// 		var itemNum: number = msg.getShort();
	// 		this._selfUnionInfo.parseMemberWarehouseNum(memberPlayerId, postion,itemNum);
	// 	}
	// 	GameCommon.getInstance().receiveMsgToClient(msg);
	// }

	//修改宣言
	public parseUnionXuanyanMsg(msg: Message): void {
		if (this._selfUnionInfo) {
			this._selfUnionInfo.info.xuanyan = msg.getString();
			GameCommon.getInstance().addAlert("仙盟宣言修改成功");
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//修改公告
	public parseUnionNoticeMsg(msg: Message): void {
		if (this._selfUnionInfo) {
			this._selfUnionInfo.noticeStr = msg.getString();
			GameCommon.getInstance().addAlert("仙盟公告修改成功");
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//修改自动审核
	public parseUnionAutoAdoptMsg(msg: Message): void {
		if (this._selfUnionInfo) {
			this._selfUnionInfo.autoAdopt = msg.getBoolean();
			var optDesc: string = this._selfUnionInfo.autoAdopt ? "开启" : "关闭";
			GameCommon.getInstance().addAlert(`已${optDesc}仙盟自动审核`);
		}
	}
	//修改等级限制
	public parseUnionLevelLimitMsg(msg: Message): void {
		if (this._selfUnionInfo) {
			this._selfUnionInfo.info.applyLevel = msg.getShort();
			GameCommon.getInstance().addAlert(`仙盟限制等级修改为${this._selfUnionInfo.info.applyLevel}级`);
		}
	}
	//更改职位
	public parsePostionUpdateMsg(msg: Message): void {
		if (this._selfUnionInfo) {
			var memberPlayerId: number = msg.getInt();
			var postion: number = msg.getByte();
			this._selfUnionInfo.parseMemberPostion(memberPlayerId, postion);
			GameCommon.getInstance().addAlert(`职位修改成功`);
		}
	}
	//踢人处理
	public parseDeleteMember(msg: Message): void {
		if (this._selfUnionInfo) {
			var memberPlayerId: number = msg.getInt();
			var name: string = this._selfUnionInfo.onDeleteMember(memberPlayerId);
			GameCommon.getInstance().addAlert(`您已将${name}踢出仙盟`);
		}
	}
	//帮会上香
	public parseUnionTribute(msg: Message): void {
		if (this._selfUnionInfo) {
			var tributeID: number = msg.getByte();
			var tributeNum: number = msg.getByte();
			var tributeVipNum: number = msg.getByte();
			this._selfUnionInfo.tributeNum = tributeNum;
			this._selfUnionInfo.tributeVipNum = tributeVipNum;
			var tributeModel: ModelguildShangxiang = JsonModelManager.instance.getModelguildShangxiang()[tributeID];
			this._selfUnionInfo.addUnionExp(tributeModel.guildExp);
			// GameCommon.getInstance().addAlert(`上香成功获得${tributeModel.banggong}盟贡`);
		}
	}
	//清空帮会数据
	public onDestroyUnionInfo(): void {
		if (this._selfUnionInfo) {
			this._selfUnionInfo.onDestroy();
			this._selfUnionInfo = null;
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_CLOSE), "UnionMainCityPanel");
			GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_CLOSE), "UnionHallPanel");
			GameCommon.getInstance().addAlert(`您已退出仙盟`);
		}
	}
	//帮会转盘
	public parseRunALotteryMessage(msg: Message): void {
		var awards = [];
		var award: AwardItem;
		this._selfUnionInfo.turnplateNum = msg.getByte();
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			award = new AwardItem();
			award.parseMessage(msg);
			awards.push(award);
		}
		var param: TurnplateAwardParam = new TurnplateAwardParam();
		param.desc = "转盘获得以下奖励";
		param.titleSource = "";
		param.itemAwards = awards;
		param.autocloseTime = 11;
		GameDispatcher.getInstance().dispatchEvent(new egret.Event(GameEvent.MODULE_WINDOW_OPEN_WITH_PARAM), new WindowParam("TurnplateAwardPanel", param));
	}
	//初始化帮会技能信息
	// public parseInitUnionSkill(msg: Message): void {
	// 	var skillSize: number = msg.getByte();
	// 	for (var i: number = 0; i < skillSize; i++) {
	// 		var skillID: number = msg.getByte();
	// 		var skillModel: ModelUnionSkill = ModelManager.getInstance().modelUnionSkill[skillID];
	// 		var skillLevel: number = msg.getShort();
	// 		skillModel.level = skillLevel;
	// 	}
	// 	DataManager.getInstance().playerManager.player.updateUnionSkill();
	// }
	//更新帮会技能协议
	// public parseUpdateUnionSkill(msg: Message): void {
	// 	var idx: number = msg.getByte();
	// 	var skillID: number = msg.getByte();
	// 	var skillLevel: number = msg.getShort();

	// 	var unionSkill: UnionSkill = DataManager.getInstance().playerManager.player.playerDatas[idx].getUnionSkill(skillID);
	// 	if (unionSkill) {
	// 		unionSkill.level = skillLevel;
	// 	} else {
	// 		unionSkill = new UnionSkill();
	// 		unionSkill.id = skillID;
	// 		unionSkill.level = skillLevel;
	// 		DataManager.getInstance().playerManager.player.playerDatas[idx].unionSkillArray.push(unionSkill);
	// 	}

	// 	DataManager.getInstance().playerManager.player.updateUnionSkill();
	// 	GameCommon.getInstance().receiveMsgToClient(msg);
	// 	GameCommon.getInstance().addAlert(`仙盟技能升级成功`);
	// }
	public parseUpdateUnionSkill2(msg: Message): void {
		var idx: number = msg.getByte();
		var skillID: number = msg.getByte();
		var skillLevel: number = msg.getShort();
		var skillExp: number = msg.getInt();

		var unionSkill: UnionSkill2 = DataManager.getInstance().playerManager.player.playerDatas[idx].getUnionSkill2(skillID);
		if (unionSkill) {
			unionSkill.level = skillLevel;
			unionSkill.exp = skillExp;
		} else {
			unionSkill = new UnionSkill2();
			unionSkill.id = skillID;
			unionSkill.level = skillLevel;
			unionSkill.exp = skillExp;
			DataManager.getInstance().playerManager.player.playerDatas[idx].unionSkill2Array.push(unionSkill);
		}

		DataManager.getInstance().playerManager.player.updateUnionSkill();
		GameCommon.getInstance().receiveMsgToClient(msg);
		//GameCommon.getInstance().addAlert(`帮会技能升级成功`);
	}
	//帮会日志协议
	public parseUnionLog(msg: Message): void {
		if (this.unionLogs.length > 0) {
			for (var i: number = this.unionLogs.length - 1; i >= 0; i--) {
				this.unionLogs[i] = null;
				this.unionLogs.splice(i, 1);
			}
		}
		// var color = "28!e828";
		var color = "72bdf7";
		var logsize: number = msg.getByte();
		for (var i: number = 0; i < logsize; i++) {
			var logStr: string = "";
			var logType: number = msg.getByte();
			switch (logType) {
				case UnionLog_Type.JOIN:
					var firstName: string = Tool.getHtmlColorStr(msg.getString(), color);
					logStr = firstName + "加入仙盟";
					break;
				case UnionLog_Type.QUIT:
					var firstName: string = Tool.getHtmlColorStr(msg.getString(), color);
					logStr = firstName + "退出仙盟";
					break;
				case UnionLog_Type.DELETE:
					var firstName: string = Tool.getHtmlColorStr(msg.getString(), color);
					var secondName: string = Tool.getHtmlColorStr(msg.getString(), color);
					logStr = `${firstName}被${secondName}踢出仙盟`;
					break;
				case UnionLog_Type.TRIBUTE:
					var firstName: string = Tool.getHtmlColorStr(msg.getString(), color);
					var tributeID: number = msg.getByte();
					var tributeModel: ModelguildShangxiang = JsonModelManager.instance.getModelguildShangxiang()[tributeID];
					var consumeMoney: ModelThing = GameCommon.getInstance().getThingModel(tributeModel.cost.type, tributeModel.cost.id);
					var consumedesc: string = `<font color='#${GameCommon.Quality_Color_String[consumeMoney.quality]}'>` + tributeModel.cost.num + consumeMoney.name + "</font>";
					logStr = `${firstName}消耗${consumedesc}进行了一次仙盟上香`;
					break;
				case UnionLog_Type.APPOINT:
					var firstName: string = Tool.getHtmlColorStr(msg.getString(), color);
					var secondName: string = Tool.getHtmlColorStr(msg.getString(), color);
					var appointName: string = UnionDefine.Union_Postions[msg.getByte()];
					logStr = `${firstName}被${secondName}任命为${appointName}`;
					break;
				case UnionLog_Type.LEVELUP:
					logStr = `您的仙盟已升到${msg.getByte()}级`;
					break;
				case UnionLog_Type.ASSIGN:
					var firstName: string = Tool.getHtmlColorStr(msg.getString(), color);
					var secondName: string = Tool.getHtmlColorStr(msg.getString(), color);
					var boxId: number = msg.getShort();
					var boxNum: number = msg.getShort();
					var boxModel: ModelThing = GameCommon.getInstance().getThingModel(GOODS_TYPE.BOX, boxId);
					var box: string = Tool.getHtmlColorStr(boxModel.name + "*" + boxNum, GameCommon.Quality_Color_String[boxModel.quality]);
					logStr = `${firstName}将${box}分配给${secondName}`;
					break;
				case UnionLog_Type.IMPEACHMENT:
					var firstName: string = Tool.getHtmlColorStr(msg.getString(), color);
					var secondName: string = Tool.getHtmlColorStr(msg.getString(), color);
					logStr = `${firstName}被${secondName}弹劾盟主职位`;
					break;
			}
			if (logStr) {
				this.unionLogs.unshift(logStr);
			}
		}
	}
	//初始化请求帮会信息
	private initUnionInfo: boolean;
	public onReqUnionInfoMsg(): void {
		var unioninfoMsg: Message = new Message(MESSAGE_ID.UNION_INFO_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(unioninfoMsg);
		if (!this.initUnionInfo)
			this.initUnionInfo = true;
	}

	public onReqUnionMember(){
		var unioninfoMsg: Message = new Message(MESSAGE_ID.UNION_MEMBER_LIST_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(unioninfoMsg);
	}
	public onReqUnionPrizeRecord(): void {
		var unioninfoMsg: Message = new Message(MESSAGE_ID.UNION_PRIZE_RECORD_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(unioninfoMsg);
	}
	public onParseUnionPrizeRecord(msg: Message): void {
		this.record = [];
		var base: UnionPrizeLog;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			base = new UnionPrizeLog();
			base.parseMessage(msg);
			this.record.push(base);
		}
	}
	public onSendTaskMessage(): void {
		var unioninfoMsg: Message = new Message(MESSAGE_ID.UNION_TASK_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(unioninfoMsg);
	}
	public onParseUnionTaskMessage(msg: Message) {
		var base: UnionTask;
		var len: number = msg.getByte();
		for (var i: number = 1; i <= len; i++) {
			var id: number = msg.getByte();
			this.tasks[id].param = msg.getByte();
		}
	}
	public getUnionTaskData(): UnionTask[] {
		var ret: UnionTask[] = [];
		var base: UnionTask;
		var len: number = 10;
		var models = JsonModelManager.instance.getModelguildTask();
		var model: ModelguildTask;
		for (var key in this.tasks) {
			base = this.tasks[key];
			base.sortKey = base.id;
			model = models[base.id];
			if (base.param >= model.count) {
				base.sortKey += 100;
			}
			ret.push(base);
		}
		base = new UnionTask();
		base.id = 0;
		base.param = this._selfUnionInfo.tributeNum;
		base.sortKey = 0;
		if (base.param >= 10) {
			base.sortKey += 100;
		}
		ret.push(base);
		ret = ret.sort((n1, n2) => {
			if (n1.sortKey < n2.sortKey) {
				return -1;
			} else {
				return 1;
			}
		});
		return ret;
	}
	public onParseTaskUpdateMessage(msg: Message): void {
		var id: number = msg.getByte();
		this.tasks[id].param = msg.getByte();
	}

	public getTextFlow(len: number = -1): egret.ITextElement[] {
		var arr = this.record.concat();
		if (len > 0) {
			while (arr.length > len) {
				arr.shift();
			}
		}
		var data: UnionPrizeLog;
		var ret: egret.ITextElement[] = [];
		var showInfo: string = "";
		for (var i: number = 0; i < arr.length; i++) {
			data = arr[i];
			var model = GameCommon.getInstance().getThingModel(data.type, data.id);
			if (model) {
				ret.push({ text: data.playerName, style: { textColor: 0x289aea } });
				ret.push({ text: ` 获得`, style: { textColor: 0xffffff } });
				ret.push({ text: model.name, style: { textColor: GameCommon.getInstance().CreateNameColer(model.quality) } });
				ret.push({ text: "\n", style: {} });
			}
		}
		ret.pop();
		return ret;
	}
	/**--------帮会BOSS相关---------**/
	public unionbossCount: number;
	public unionbossTime: number;
	public onParseUnionBossInfo(msg: Message): void {
		this.unionbossTime = msg.getInt();
		this.unionbossTime = this.unionbossTime > 0 ? this.unionbossTime * 1000 + egret.getTimer() : 0;
		this.unionbossCount = msg.getByte();
	}

	public onParseUnionBossList(msg: Message): void {
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			var bossid: number = msg.getByte();
			var unionboss: ModelguildBoss = JsonModelManager.instance.getModelguildBoss()[bossid];
			if (unionboss) {
				unionboss.unionBossStatus = msg.getByte();
			}
		}
	}

	//返回助威增加的功血加成百分比 
	public getCheerAttrAddRate(cheerNum: number): number {
		return cheerNum > UnionDefine.Union_Max_CheerNum ? UnionDefine.Union_Max_CheerNum : cheerNum;
	}
	/**--------帮会BOSS结束---------**/

	/**--------帮会战相关内容---------**/
	private _unionbattleInfo: UnionBattleInfo;//帮会战信息
	public get unionbattleInfo(): UnionBattleInfo {
		if (!this._unionbattleInfo) {
			this._unionbattleInfo = new UnionBattleInfo();
		}
		return this._unionbattleInfo;
	}
	//解析帮会战分组信息
	public onParseUnionGroupInfoMsg(msg: Message): void {
		if (this._selfUnionInfo) {
			this.unionbattleInfo.onParseGroupMsg(msg);
			GameCommon.getInstance().receiveMsgToClient(msg);
		}
	}
	//解析帮会仓库协议
	public onParseUnionDepotMsg(msg: Message): void {
		this.unionbattleInfo.onParseDepotMsg(msg);
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//解析帮会战排行协议
	public onParseUnionBattleRankMsg(msg: Message): void {
		this.unionbattleInfo.onParseRankMsg(msg);
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	/**--------帮会战结束--------**/
	/**红点相关**/
	//帮会BOSS红点
	private beforeBossPointTime: number = 0;
	public checkUnionBossRedPoint(): boolean {
		if (!this.unionInfo)
			return false;

		if (this.unionbossCount == 0)
			return false;

		var _hasBoss: boolean = false;
		for (var bossid in JsonModelManager.instance.getModelguildBoss()) {
			var unionboss: ModelguildBoss = JsonModelManager.instance.getModelguildBoss()[bossid];
			if (unionboss.unionBossStatus == UNION_BOSS_STATUS.REBORN) {
				_hasBoss = true;
				break;
			}
		}
		if (!_hasBoss && this.beforeBossPointTime - egret.getTimer() < 1000) {
			var bossinfoMsg: Message = new Message(MESSAGE_ID.UNION_BOSS_INFO_MESSAGE);
			GameCommon.getInstance().sendMsgToServer(bossinfoMsg);
			this.beforeBossPointTime = this.unionbossTime;
			return false;
		}
		return true;
	}
	public countDown: number;
	public isMSBReward;
	public isOldBig;
	public durTime: number;
	public parseSummonMessage(msg: Message) {
		this.countDown = msg.getLong();
		this.durTime = msg.getLong();
		this.isMSBReward = msg.getBoolean();
		DataManager.getInstance().dupManager.mysteriousData.rebornLefttime = msg.getInt();
		this.isOldBig = msg.getBoolean();
	}

	public checkUnionBossPoint(): boolean {
		if (this.checkUnionBossDupPoint()) return true;
		if (this.checkMyBossRedPoint()) return true;
		return false;
	}
	//帮会boss红点
	private isInitDupBossPoint: boolean;
	public checkUnionBossDupPoint(): boolean {
		if (!this.unionInfo)
			return false;
		if (this.isInitDupBossPoint) {
			if (this.getUnionLv() >= 2 && DataManager.getInstance().unionManager.unionbossCount > 0 && JsonModelManager.instance.getModelguildBoss()[1].unionBossStatus != UNION_BOSS_STATUS.CLOSE)
				return true;
		} else {
			var bossinfoMsg: Message = new Message(MESSAGE_ID.UNION_BOSS_INFO_MESSAGE);
			GameCommon.getInstance().sendMsgToServer(bossinfoMsg);
			this.isInitDupBossPoint = true;
		}
		return false;
	}
	//帮会副本红点
	private isInitDupPoint: boolean;
	public checkUnionDupPoint(): boolean {
		if (!this.unionInfo)
			return false;
		if (this.isInitDupPoint) {
			if (this.hasDupPassAward)
				return true;
			var dupinfo: DupInfo = DataManager.getInstance().dupManager.getDupInfolistByType(DUP_TYPE.DUP_UNION)[0];
			if (dupinfo && dupinfo.leftSweepNum > 0) {
				return true;
			}
		} else {
			var dupinfoReqMsg: Message = new Message(MESSAGE_ID.GAME_DUP_INFO_MESSAGE);
			dupinfoReqMsg.setByte(DUP_TYPE.DUP_UNION);
			GameCommon.getInstance().sendMsgToServer(dupinfoReqMsg);
			this.isInitDupPoint = true;
		}
		return false;
	}

	//帮派神秘boss红点
	public checkMyBossRedPoint() {
		var result: boolean = false;
		var countDown: number = DataManager.getInstance().unionManager.countDown;
		var isEnd: boolean = DataManager.getInstance().unionManager.isMSBReward
		var isOldBig: boolean = DataManager.getInstance().unionManager.isOldBig;
		if (countDown <= 0) {
			result = isOldBig;
		} else {
			result = isEnd;
		}
		return result;
	}
	//帮派技能红点
	public checkUnionSkillRedPoint(): boolean {
		if (!this.unionInfo)
			return false;
		for (var i: number = 0; i < DataManager.getInstance().playerManager.player.playerDatas.length; i++) {
			for (var sIndex: number = 1; sIndex <= UnionDefine.Union_Skill_Max; sIndex++) {
				if (this.checkUnionSkillOnePoint(i, sIndex))
					return true;
			}
		}
		return false;
	}
	//某个角色的帮会技能红点
	public checkUnionSkillOneAllPoint(pIndex: number): boolean {
		if (!this.unionInfo)
			return false;
		if (!DataManager.getInstance().playerManager.player.getPlayerData(pIndex))
			return false;
		for (var sIndex: number = 1; sIndex <= UnionDefine.Union_Skill_Max; sIndex++) {
			if (this.checkUnionSkillOnePoint(pIndex, sIndex))
				return true;
		}
		return false;
	}
	//某个角色 某个技能的红点
	public checkUnionSkillOnePoint(pIndex: number, sIndex: number): boolean {
		if (!this.unionInfo)
			return false;
		var unionSkill: UnionSkill2 = DataManager.getInstance().playerManager.player.getPlayerData(pIndex).getUnionSkill2(sIndex);
		var nextLevel: number = unionSkill ? unionSkill.level + 1 : 1;
		var nextSkill: ModelguildSkill = JsonModelManager.instance.getModelguildSkill()[sIndex][nextLevel - 1];
		if (nextSkill && nextSkill.costList[0].num <= DataManager.getInstance().playerManager.player.donate && nextSkill.costList[1].num <= DataManager.getInstance().playerManager.player.money) {
			return true;
		}
		return false;
	}
	//帮会上香的红点
	public checkTributeRedPoint(): boolean {
		if (this.unionInfo) {
			var trbuteModel: ModelguildShangxiang = JsonModelManager.instance.getModelguildShangxiang()[1];
			if (10 - this.unionInfo.tributeNum > 0 && DataManager.getInstance().playerManager.player.money >= trbuteModel.cost.num) {
				return true;
			}
		}
		return false;
	}
	//主界面帮会按钮红点
	public checkUnionRedPoint(): boolean {
		if (this.initUnionInfo) {
			// if (this.checkUnionBossRedPoint())
			// 	return true;
			// if (this.checkUnionDupPoint())
			// 	return true;
			if (this.checkUnionSkillRedPoint())
				return true;
			if (this.checkTributeRedPoint())
				return true;
		} else {
			this.onReqUnionInfoMsg();
		}
		return false;
	}

	public getUnionLv(): number {
		if (this._selfUnionInfo) {
			return this._selfUnionInfo.info.level;
		}
		return 0;
	}
	//The end
}
class UnionPrizeLog {
	public type: number;
	public id: number;
	public playerName: string;
	public constructor() {
	}
	public parseMessage(msg: Message) {
		this.playerName = msg.getString();
		this.type = msg.getByte();
		this.id = msg.getShort();
	}
}
class UnionTask {
	public id: number = 0;
	public param: number = 0;
	public sortKey: number;
	public onParseMessage(msg: Message): void {
		this.id = msg.getByte();
		this.param = msg.getByte();
	}
}
enum UnionLog_Type {
	JOIN = 1,//加入帮会
	QUIT = 2,//退出帮会
	DELETE = 3,//帮会踢人
	TRIBUTE = 4,//帮会上香
	APPOINT = 5,//帮会任命
	LEVELUP = 6,//帮会升级
	BOSS = 7,//帮会BOSS
	ASSIGN = 8, //分配奖励
	IMPEACHMENT = 9,//弹劾帮主
}
enum UNION_BOSS_STATUS {
	REBORN = 1,//复活
	FIGTHING = 2,//正在被挑战
	DEATH = 3,//死亡
	CLOSE = 4,//活动结束
}