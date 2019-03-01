class HefuActivtyManager {
	public zhuanpanId: number = 0;
	public zhuanpanType: number = 0;
	public zhuanpanAwardNum: number = 0;
	public tp: number = 0;
	public temAward: AwardItem[];
	public treasureAwdIdx: number;
	public currInfo: ZhuanPanLog[] = [];
	public zhuanpanNum: number = 0;//转盘次数
	public zhuanpanRanks: HefuActRank[];//转盘排行
	public zhuanpanRound: number;//转盘轮数
	public zhuanpanModel: Modelzhuanpanhuodong;//当期的转盘model
	public missionDatas;//当前境界的所有任务
	public payDay: number = 1;//充值天数
	public payRecord: number[] = [];//充值档位

	public constructor() {
		this.missionDatas = {};
		this.zhuanpanRanks = [];
	}
	/**合服活跃任务**/
	//任务列表初始化
	public parseHefuMissionList(msg: Message): void {
		this.missionDatas = [];
		let missionsize: number = msg.getByte();
		for (let i: number = 0; i < missionsize; i++) {
			let missionData: TaskChainData = new TaskChainData();
			missionData.parseMsg(msg);
			this.missionDatas[missionData.taskId] = missionData;
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//任务列表更新
	public parseHefuiMissonUpdate(msg: Message, size: number = 0): void {
		size = size == 0 ? msg.getByte() : size;
		for (let i: number = 0; i < size; i++) {
			let missionID: number = msg.getShort();
			let missionData: TaskChainData = this.missionDatas[missionID];
			if(!missionData)
			{
				 missionData = new TaskChainData();
				 missionData.taskId = missionID;
				 this.missionDatas[missionData.taskId] = missionData;
			}
			missionData.progress = msg.getLong();
			missionData.count = msg.getByte();
			
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//任务红点
	public checkHefuMissionRedPoint(): boolean {
		for (let missionID in this.missionDatas) {
			let missionData: TaskChainData = this.missionDatas[missionID];
			if (missionData.count == 1) return true;
		}
		return false;
	}
	/**合服单笔充值**/
	public onParseMessage(msg: Message) {
		var len = msg.getByte();
		this.payRecord = [];
		for (var i: number = 0; i < len; i++) {
			this.payRecord.push(msg.getByte());
		}
		this.payDay = msg.getByte();
	}
	/**合服转盘**/
	//转盘排行榜活动序号
	public parseZhuanpanRoundMsg(msg: Message): void {
		this.zhuanpanRound = msg.getByte();
		this.zhuanpanModel = JsonModelManager.instance.getModelzhuanpanhuodong()[this.zhuanpanRound+1];
	}
	public chargeMoneyNum:number;
	public chongbangLiBaoId:number;
	public parseChongBang(msg: Message) {
		this.chongbangLiBaoId = msg.getByte();
		this.chargeMoneyNum = msg.getInt();
	}
	//转盘信息
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
		let ranksize: number = msg.getByte();
		for (let i: number = 0; i < ranksize; i++) {
			if (!this.zhuanpanRanks[i]) {
				this.zhuanpanRanks[i] = new HefuActRank();
			}
			let rankData: HefuActRank = this.zhuanpanRanks[i];
			rankData.parseMsg(msg);
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	/**红点相关内容**/
	public getRedPoint(): boolean {
		if (this.checkZhuanPanPoint()) return true;
		return false;
	}
	public checkZhuanPanPoint(): boolean {
		if(!this.zhuanpanModel) return false;
		if (DataManager.getInstance().bagManager.getGoodsThingNumById(this.zhuanpanModel.costList[0].id, this.zhuanpanModel.costList[0].type) >= this.zhuanpanModel.costList[0].num) {
			return true;
		}
		if (this.checkTreasurePoint()) return true;
		return false;
	}
	//寻宝检测
	public checkTreasurePoint(): boolean {
		/**周奖励红点**/
		let weekAwdParams: string[] = this.zhuanpanModel.box.split("#");
		for (let i: number = 0; i < weekAwdParams.length; i++) {
			if (this.treasureAwdIdx > i) continue;
			let params: string[] = weekAwdParams[i] ? weekAwdParams[i].split(",") : null;
			if (!params) break;
			let times: number = parseInt(params[0]);
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
	//The end
}
class HefuActRank {
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