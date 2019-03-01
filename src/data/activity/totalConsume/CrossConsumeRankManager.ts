class CrossConsumeRankManager {
	public consumeRanks: CrossServerConsumeRank[];//消费排行
	public lotteryNum:number = 0;
	public curModel: Modelkuafuxiaohao[];//当期的转盘model
	public round: number;//转盘轮数
	public constructor() {
		this.consumeRanks = [];
	}
	//消费排行榜
	public parseRankMsg(msg: Message): void {
		this.consumeRanks = [];
		let ranksize: number = msg.getByte();
		for (let i: number = 0; i < ranksize; i++) {
			if (!this.consumeRanks[i]) {
				this.consumeRanks[i] = new CrossServerConsumeRank();
			}
			let rankData: CrossServerConsumeRank = this.consumeRanks[i];
			rankData.parseMsg(msg);
		}
		this.lotteryNum = msg.getInt();
		this.round = msg.getByte();
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
    public get models(): Modelkuafuxiaohao[] {
		this.curModel = [];
        for (let k in JsonModelManager.instance.getModelkuafuxiaohao()) {
            if (this.round == JsonModelManager.instance.getModelkuafuxiaohao()[k].round ) {
                this.curModel.push(JsonModelManager.instance.getModelkuafuxiaohao()[k])
            }
        }
        return this.curModel;
    }
	public getMyRank(id): number {
		for (var key in this.consumeRanks) {
			var itemarr = this.consumeRanks[key];
			if (itemarr.playerId == id) {
				return itemarr.rank;
			}
		}
		return -1;
	}
}
class CrossServerConsumeRank {
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