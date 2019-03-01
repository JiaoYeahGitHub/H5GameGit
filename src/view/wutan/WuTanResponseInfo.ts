class WuTanResponseInfo {
	public type: number;
	public startIdx: number;
	public bodySize: number;
	public bodyList: WuTanListbody[];
	public constructor() {
		this.bodyList = [];
	}
	public parseMsg(msg: Message): void {
		try {
			this.type = msg.getShort();
			this.startIdx = msg.getInt();
			this.bodySize = msg.getByte();

			for (let i = 0; i < this.bodySize; ++i) {
				if (!this.bodyList[i]) {
					this.bodyList[i] = new WuTanListbody();
				}
				this.bodyList[i].parseMsg(this.type, msg, this.startIdx + i, i, this.isTop());
			}
		} catch (e) {
			egret.error("WuTanResponseInfo - parseMsg - error");
		}
	}
	public isTop() {
		return this.startIdx == 0;
	}
}
class WuTanListbody {
	public type: number;
	public playerData: SimplePlayerData;
	public showAppear: AppearPlayerData;
	public towerIdx: number;// 总位置索引
	public posIdx: number;// UI中显示的位置
	public timeStart: number;
	private rank: number;
	private value2: number;
	private model: Modelwutan;
	// public isTop: boolean;
	public parseMsg(type, msg: Message, towerIdx: number, posIdx: number, isTop: boolean): void {
		this.type = type;
		this.towerIdx = towerIdx;
		this.posIdx = posIdx;
		//this.isTop = isTop;
		this.playerData = new SimplePlayerData();
		this.playerData.parseMsg(msg);

		let rank = msg.getInt();
		let value1 = msg.getLong();
		let value2 = msg.getInt();
		let time = msg.getInt();
		this.timeStart = Tool.getCurrTime() - time * 1000;
		if (isTop && !this.isEmpty()) {
			this.showAppear = new AppearPlayerData();
			this.showAppear.parseMsg(msg);
		}
		this.model = DataManager.getInstance().wuTanManager.getModel(this.type, Math.min(this.towerIdx + 1, 4));
		if (this.isSelf()) {
			DataManager.getInstance().wuTanManager.setMyType(type, towerIdx);
		}
	}
	public isEmpty() {
		return parseInt(this.playerData.id) == 0;
	}
	public isSelf() {
		return DataManager.getInstance().playerManager.player.id == parseInt(this.playerData.id);
	}
	public getModel(): Modelwutan {
		return this.model;
	}
	public getRewardBox(): AwardItem {
		return GameCommon.parseAwardItem(this.model.boxRewards);
	}
}