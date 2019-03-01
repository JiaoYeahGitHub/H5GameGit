class UnionBattleInfo {
	public state: UNIONBATTLE_STATE;//战斗状态
	public canJoin: boolean = false;//是否可以参与
	public timecount: number;//当前状态的剩余倒计时
	public joinUnions: FightUnionInfo[];
	public myUnionStars: number;//我的公会星数
	public myUnionScore: number;//我的公会积分
	public myStarCount: number = 0;//个人星数
	public myScore: number = 0;//个人所得积分
	public myUnionFightInfo: FightUnionInfo;
	public depotThings: AwardItem[];//战报
	public rankDatas: UnionBattleRank[];//排行榜数据
	public singleRanks: UnionBattleRank[];//个人排行榜数据

	public constructor() {
	}
	//解析帮会战分组的消息
	public onParseGroupMsg(msg: Message): void {
		this.joinUnions = [];
		this.canJoin = false;

		this.state = msg.getByte();
		this.timecount = msg.getLong() + egret.getTimer();
		var detail = msg.getBoolean();
		this.myUnionFightInfo = null;
		if (detail == true && this.state != UNIONBATTLE_STATE.NOT) {
			let unionsize: number = msg.getByte();
			for (let i: number = 0; i < unionsize; i++) {
				let fightUnionInfo = new FightUnionInfo();
				fightUnionInfo.roundCount = msg.getByte();
				fightUnionInfo.unionId = msg.getInt();
				fightUnionInfo.name = msg.getString();
				fightUnionInfo.state = msg.getByte();
				fightUnionInfo.buffCount = msg.getByte();
				fightUnionInfo.badgesIndex = msg.getByte();
				fightUnionInfo.level = msg.getShort();
				this.joinUnions.push(fightUnionInfo);
				if (fightUnionInfo.name == DataManager.getInstance().unionManager.unionInfo.info.name) {
					this.myUnionFightInfo = fightUnionInfo;
				}
			}
			this.canJoin = msg.getByte() == 1;
		}
	}
	//解析参加工会战
	public onParseJoinUnionBattle(msg: Message): void {
		var isJoin = msg.getByte();
		if (isJoin > this.myScore) {
			this.myStarCount = 1;
			this.myScore = 100;
		}
	}
	//帮会仓库信息
	public onParseDepotMsg(msg: Message): void {
		this.depotThings = [];
		var depotSize: number = msg.getByte();
		for (var i: number = 0; i < depotSize; i++) {
			var thingId: number = msg.getShort();
			var thingNum: number = msg.getInt();
			if (thingNum > 0)
				this.depotThings.push(new AwardItem(GOODS_TYPE.BOX, thingId, thingNum));
		}
	}
	//帮会战排行
	public onParseRankMsg(msg: Message): void {
		this.rankDatas = [];
		var rankSize: number = msg.getByte();
		for (var i: number = 0; i < rankSize; i++) {
			var rankdata: UnionBattleRank = new UnionBattleRank();
			rankdata.rank = i + 1;
			rankdata.onParse(msg);
			if (rankdata.scoreCount > 0 && rankdata.starCount > 0)
				this.rankDatas.push(rankdata);
		}
	}
	// //个人积分排行
	// public onParseSingleRankMsg(msg: Message): void {
	// 	this.singleRanks = [];
	// 	let rankSize: number = msg.getByte();
	// 	for (let i: number = 1; i <= rankSize; i++) {
	// 		let rankdata: UnionBattleRank = new UnionBattleRank();
	// 		rankdata.rank = i;
	// 		rankdata.onParseGeren(msg);
	// 		if (rankdata.scoreCount > 0 && rankdata.starCount > 0)
	// 			this.singleRanks.push(rankdata);
	// 	}
	// 	let myRankData: UnionBattleRank = new UnionBattleRank();
	// 	myRankData.rank = msg.getShort();
	// 	myRankData.starCount = msg.getShort();
	// 	myRankData.scoreCount = msg.getInt();
	// 	myRankData.name = DataManager.getInstance().playerManager.player.name;
	// 	if (myRankData.scoreCount == 0 && myRankData.starCount == 0) {
	// 		myRankData.rank = 0;
	// 	}
	// 	this.singleRanks.unshift(myRankData);
	// }
	//通过帮会ID获取对应帮会的战斗信息
	public getUnionFightInfoById(unionId: number): FightUnionInfo {
		let fightinfo: FightUnionInfo;
		for (let i: number = 0; i < this.joinUnions.length; i++) {
			if (unionId == this.joinUnions[i].unionId) {
				fightinfo = this.joinUnions[i];
				break;
			}
		}
		return fightinfo;
	}
	//The end
}
//参与帮会战的帮会信息
class FightUnionInfo {
	public unionId: number;
	public name: string;
	public state: UNIONBATTLE_RESULT;
	public roundCount: number;//当前轮数
	public buffCount: number = 0;//购买BUFF次数
	public score: number;//当前帮会的积分
	public badgesIndex: number;//帮会的标识
	public level: number;//帮会等级
}
//日志结构体
class UnionBattleLog {
	public logdesc: string;

	public constructor() {
	}
	public parseLogMsg(msg: Message): void {
		this.logdesc = "";
		var playerName: string = msg.getString();
		var enmeyName: string = msg.getString();
		var result: number = msg.getByte();
		var starNum: number = msg.getByte();
		var score: number = msg.getInt();
		if (result > 0) {
			// this.logdesc = `[#289aea${playerName}]在战场中击败[#289aea${enmeyName}][#FFFF00${UnionDefine.Union_Battle_Diff_DescAry[result - 1]}难度]，获得[#FFFF00${starNum}星]和[#FFFF00${score}积分]`;
		} else {
			// this.logdesc = `[#289aea${playerName}]在战场中对[#289aea${enmeyName}]发起挑战失败，未获得任何战果`;
		}
	}
	//The end
}
//排行榜结构
class UnionBattleRank {
	public rank: number;
	public name: string;
	public starCount: number;
	public scoreCount: number;

	public onParse(msg: Message): void {
		this.name = msg.getString();
		this.starCount = msg.getShort();
		this.scoreCount = msg.getInt();
	}
	public onParseGeren(msg: Message): void {
		this.name = msg.getString();
		this.starCount = msg.getShort();
		this.scoreCount = msg.getInt();
	}
}
enum UNIONBATTLE_STATE {
	NOT = 0,//未开始
	READY = 1,//准备中
	FIGHT = 2,//战斗中
	RESULT = 3,//结算中
}
enum UNIONBATTLE_RESULT {
	UNRESULT = 0,
	WIN = 1,
	LOSE = 2,
}