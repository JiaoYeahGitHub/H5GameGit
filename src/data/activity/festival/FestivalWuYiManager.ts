class FestivalWuYiManager {
	private round: number = 0;
	public zhuanpanNum: number = 0;
	public zhuanpanRanks: FestivalZhuanPanRank[];//转盘排行
	public zhuanpanRound: number;
	public record = {};
	public currAwardID: number;
	public treasureAwdIdx: number;
	public treasureTimes: number;
	public liuyiMission;//当前境界的所有任务
	public zhuanpanId: number = 0;
	public zhuanpanType: number = 0;
	public zhuanpanAwardNum: number = 0;
	public tp: number = 0;
	public temAward: AwardItem[];
	public currInfo: ZhuanPanLog[] = [];
	public zhuanpanModel: Modelzhuanpanhuodong;//当期的转盘model
	public constructor() {
		this.liuyiMission = {};
		this.zhuanpanRanks = [];
	}
	public onParseZhuanPanMessage(msg: Message): void {
		this.treasureAwdIdx = msg.getShort();
		this.zhuanpanNum = msg.getShort();
		this.tp = msg.getByte();
		if (this.tp == 1) {
			this.zhuanpanType = msg.getByte();
			this.zhuanpanId = msg.getShort();
			this.zhuanpanAwardNum = msg.getInt();
		}
		else if (this.tp == 10 || this.tp == 9) {
			this.temAward = [];
			var len = msg.getByte();
			for (var i: number = 0; i < len; i++) {
				var awarditem: AwardItem = new AwardItem();
				awarditem.type = msg.getByte();
				awarditem.id = msg.getShort();
				awarditem.num = msg.getInt();
				this.temAward.push(awarditem)
			}
		}
	}
	//转盘排行榜
	public parseZhuanpanRankMsg(msg: Message): void {
		this.zhuanpanRanks = [];
		let ranksize: number = msg.getByte();
		for (let i: number = 0; i < ranksize; i++) {
			if (!this.zhuanpanRanks[i]) {
				this.zhuanpanRanks[i] = new FestivalZhuanPanRank();
			}
			let rankData: FestivalZhuanPanRank = this.zhuanpanRanks[i];
			rankData.parseMsg(msg);
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//转盘排行榜活动序号
	public parseZhuanpanRoundMsg(msg: Message): void {
		this.zhuanpanRound = msg.getByte();
		this.zhuanpanModel = JsonModelManager.instance.getModelzhuanpanhuodong()[this.zhuanpanRound + 1];
	}
	public get data(): Modelxuyuanchi2 {
		var model: Modelxuyuanchi2;
		var models = JsonModelManager.instance.getModelxuyuanchi2();
		for (var key in models) {
			if (models[key].round == this.round) {
				model = models[key];
			}
		}
		return model;
	}
	/**六一活跃任务**/
	//任务列表初始化
	public parseLiuyiMissionList(msg: Message): void {
		let missionsize: number = msg.getByte();
		for (let i: number = 0; i < missionsize; i++) {
			let missionData: TaskChainData = new TaskChainData();
			missionData.parseMsg(msg);
			this.liuyiMission[missionData.taskId] = missionData;
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//任务列表更新
	public parseLiuyiMissonUpdate(msg: Message, size: number = 0): void {
		size = size == 0 ? msg.getByte() : size;
		for (let i: number = 0; i < size; i++) {
			let missionID: number = msg.getShort();
			let missionData: TaskChainData = this.liuyiMission[missionID];
			missionData.progress = msg.getLong();
			missionData.count = msg.getByte();
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//任务红点
	public checkLiyiMissionRedPoint(): boolean {
		for (let missionID in this.liuyiMission) {
			let missionData: TaskChainData = this.liuyiMission[missionID];
			if (missionData.count == 1) return true;
		}
		return false;
	}
	// 173  许愿
	// 上行：无
	// 下行：byte  许了多少次
	// byte  第几个奖励  从0开始
	public onSendMessage(): void {
		var message = new Message(MESSAGE_ID.FESTIVAL_WISHING_WELL_MESSAGE);
		GameCommon.getInstance().sendMsgToServer(message);
	}
	public onParseLiBao(msg: Message): void {
		var id: number = msg.getByte();
		this.record[id] = id;
	}
	public onParseAdvanceMessage(msg: Message): void {
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			var id: number = msg.getByte();
			this.record[id] = id;
		}
	}
	public getActivityPoint(): boolean {
		if (this.checkZhuanPanPoint()) return true;
		if (this.loginPoint()) return true;
		// if(this.checkSalePoint()) return true;
		return false;
	}
	private zhuanpanCfg: Modelzhuanpanhuodong = JsonModelManager.instance.getModelzhuanpanhuodong()[1];
	public checkZhuanPanPoint(): boolean {

		if (DataManager.getInstance().bagManager.getGoodsThingNumById(this.zhuanpanCfg.costList[0].id, this.zhuanpanCfg.costList[0].type) >= this.zhuanpanCfg.costList[0].num) {
			return true;
		}
		// else
		// {
		// 	var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
		// 	if (_has >=this.zhuanpanCfg.costList[1].num) {
		// 		return true;
		// 	}
		// }
		if (this.checkTreasurePoint()) return true;
		return false;
	}
	private loginActCfg: Modeltehuilibaohuodong;
	public checkSalePoint(): boolean {
		for (var i: number = 1; i < 5; i++) {
			this.loginActCfg = JsonModelManager.instance.getModeltehuilibaohuodong()[i];

			var awardArrs = DataManager.getInstance().festivalWuYiManager.record;
			var _has: number = DataManager.getInstance().playerManager.player.getICurrency(5);
			if (_has >= this.loginActCfg.price && !awardArrs[i]) {
				for (let k in awardArrs) {
					if (awardArrs[k] == i) {
						continue;
					}
				}
				return true;
			}
		}
		return false;
	}
	public loginPoint(): boolean {
		var manager = DataManager.getInstance().festivalLoginManager;

		for (let k in manager.record) {
			if (manager.record[k].state == 1) {
				return true;
			}
		}
		return false;
	}
	/**寻宝检测**/
	public checkTreasurePoint(): boolean {
		/**周奖励红点**/
		let weekAwdParams: string[] = this.zhuanpanCfg.box.split("#");
		for (let i: number = 0; i < weekAwdParams.length; i++) {
			let params: string[] = weekAwdParams[i] ? weekAwdParams[i].split(",") : null;
			if (!params) break;
			let times: number = parseInt(params[0]);
			if (this.treasureAwdIdx >= times) continue;
			if (this.zhuanpanNum >= times) {
				return true;
			}
		}
		return false;
	}
	/*寻宝日志*/
	public onParseCelestiaTreasureLog(msg: Message): void {
		var data: ZhuanPanLog;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			data = new ZhuanPanLog();
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
		var data: ZhuanPanLog;
		var ret: egret.ITextElement[] = [];
		var showInfo: string = "";
		for (var i: number = 0; i < this.currInfo.length; i++) {
			data = this.currInfo[i];
			var model = GameCommon.getInstance().getThingModel(data.award.type, data.award.id, data.award.quality);
			if (model) {
				ret.push({ text: data.name, style: { textColor: 0x289aea } });
				ret.push({ text: ` 获得`, style: { textColor: 0xffffff } });
				ret.push({ text: model.name + '*' + data.award.num, style: { textColor: GameCommon.getInstance().CreateNameColer(model.quality) } });
				ret.push({ text: "\n", style: {} });
			}
		}
		ret.pop();
		return ret;
	}
}
class ZhuanPanLog {
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
class FestivalZhuanPanRank {
	public rank: number;
	public playerId: number;
	public playerName: string;
	public viplevel: number;
	public lotteryNum: number;

	public parseMsg(msg: Message): void {
		this.rank = msg.getByte();
		this.playerId = msg.getInt();
		this.playerName = msg.getString();
		this.viplevel = msg.getByte();
		this.lotteryNum = msg.getInt();
	}
}