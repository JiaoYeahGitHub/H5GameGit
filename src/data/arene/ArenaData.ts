class ArenaData {
	public isOpen: boolean;//是否开启
	public lefttime: number;//剩余秒数
	public rank: number;//竞技场排名
	public fightCount: number;//剩余次数
	public buyCount: number;//购买次数
	public serverRankDatas: string[];//服务器排名
	public enemyList: ArenaEnemy[];

	public constructor() {
		this.enemyList = [];
		this.serverRankDatas = [];
	}

	public parseMsg(msg: Message): void {
		try {
			this.isOpen = msg.getByte() == 1;
			this.lefttime = msg.getInt();
			this.lefttime = this.lefttime > 0 ? this.lefttime * 1000 + egret.getTimer() : 0;
			this.rank = msg.getByte();
			var serversize = msg.getByte();
			this.serverRankDatas = [];
			for (var i: number = 0; i < serversize; i++) {
				this.serverRankDatas.push(msg.getString());
			}
			this.fightCount = msg.getInt();
			this.buyCount = msg.getInt();
			this.parseEnmeyMsg(msg);
		} catch (e) {
		}
	}

	public parseEnmeyMsg(msg: Message): void {
		var matchSize: number = msg.getByte();
		for (var i: number = 0; i < matchSize; i++) {
			if (this.enemyList.length <= i) {
				this.enemyList.push(new ArenaEnemy());
			}
			var enemyArenaData: ArenaEnemy = this.enemyList[i];
			enemyArenaData.parseMsg(msg);
		}
	}
	//The end
}
class ArenaEnemy {
	public rank: number;
	public playerData: SimplePlayerData;
	public showAppear: AppearPlayerData;
	public value1;
	public value2;

	public constructor() {
		this.playerData = new SimplePlayerData();
		this.showAppear = new AppearPlayerData();
	}

	public parseMsg(msg: Message): void {
		this.playerData.parseMsg(msg);
		this.rank = msg.getInt();
		this.value1 = GameCommon.getInstance().getFormatNumberShow(msg.getLong());
		this.value2 = GameCommon.getInstance().getFormatNumberShow(msg.getInt());
		this.showAppear.parseMsg(msg);
	}
}
class ArenaRankData {
	public rank: number;
	public playerData: SimplePlayerData;
	public serverId: number;
	public constructor() {
		this.playerData = new SimplePlayerData();
	}
	public parseMsg(msg: Message): void {
		this.serverId = msg.getShort();
		this.playerData.parseMsg(msg);
	}
	//The end
}
class ArenaHistoryData {
	public index: number;
	public type: number;//0被攻击，1攻击别人
	public timestr: string;
	public targetName: string;
	public result: number;
	public changeRank: number;

	public parseMsg(msg: Message): void {
		this.type = msg.getByte();
		this.timestr = msg.getString();
		this.targetName = msg.getString();
		this.result = msg.getByte();
		this.changeRank = msg.getInt();
	}
}