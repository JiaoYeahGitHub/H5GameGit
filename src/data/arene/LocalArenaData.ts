class LocalArenaData {
	public rank: number;//竞技场排名
	public bestRank: number;//历史最高
	public rankReward: number; //排行奖励
	public fightCount: number;//剩余次数
	public buyCount: number;//购买次数
	// public resetTime: number;
	public enemyList: ArenaEnemy[];

	public constructor() {
		this.enemyList = [];
	}
	public parseMsg(msg: Message): void {
		try {
			this.rank = msg.getInt();
			this.bestRank = msg.getInt();
			this.rankReward = msg.getInt();
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
		this.enemyList.sort(function (a, b): number {
			return a.rank - b.rank;
		});
	}
	//The end
}
class LocalArenaRankData extends ArenaRankData {
	public constructor() {
		super();
	}
	public parseMsg(msg: Message): void {
		this.playerData.parseMsg(msg);
	}
}