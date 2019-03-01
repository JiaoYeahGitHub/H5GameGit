class CrossPVEBossData {
	public isOpen: boolean;//是否开启
	public fightID: number;//战斗ID
	public fightcount: number;//战斗次数
	public buycount: number;//购买次数
	public rankList: CrossPVEBossRank[];
	public myRankNum: number = 0;//我的排名 0未上榜
	public myDamageNum: number = 0;//我当前的输出值
	private _lefttime: number;//剩余秒数

	public constructor() {
		this.rankList = [];
	}

	public parseMsg(msg: Message): void {
		try {
			this.isOpen = msg.getByte() == 1;
			this._lefttime = msg.getInt();
			this._lefttime = this._lefttime > 0 ? this._lefttime * 1000 + egret.getTimer() : 0;
			let fightID: number = msg.getShort();
			if (fightID != this.fightID) {
				this.fightID = fightID;
			}
			this.fightcount = msg.getInt();
			this.buycount = msg.getInt();
			this.myDamageNum = msg.getLong();
		} catch (e) {
		}
	}

	public parseRankMsg(msg: Message): void {
		this.myRankNum = 0;
		this.rankList = [];
		let ranksize: number = msg.getByte();
		for (let i: number = 0; i < ranksize; i++) {
			this.rankList[i] = new CrossPVEBossRank();
			this.rankList[i].rank = i + 1;
			this.rankList[i].parseMsg(msg);
			if (this.rankList[i].playerData.id == DataManager.getInstance().playerManager.player.id) {
				this.myRankNum = this.rankList[i].rank;
			}
		}
	}

	public parseBuyMsg(msg: Message): void {
		this.fightcount = msg.getInt();
		this.buycount = msg.getInt();
	}

	public get model(): Modelkuafuboss {
		return JsonModelManager.instance.getModelkuafuboss()[this.fightID];
	}

	public get lefttime(): number {
		return Math.max(0, Math.ceil((this._lefttime - egret.getTimer()) / 1000));
	}
	//The end
}
class CrossPVEBossRank {
	public rank: number;
	public playerData: SimplePlayerData;
	public damageValue: number;

	public constructor() {
		this.playerData = new SimplePlayerData();
	}

	public parseMsg(msg: Message): void {
		this.damageValue = msg.getLong();
		this.playerData.parseMsg(msg);
	}
	//The end
}