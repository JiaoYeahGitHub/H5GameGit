class ActivityTuangouManager {
	/**团购活动**/
	public tuangou_ZoneMoney: number;//服务器总筹金
	public tuangou_MeMoney: number;//我的筹金
	public tuangou_buyIds: number[];//已购买的ID
	/**全服的消费活动**/
	public crossPayRanks: CrossServerPayRank[];
	public crossPayMyRank: number = 0;
	public crossPayRankMoney: number = 0;

	public constructor() {
		this.tuangou_buyIds = [];
		this.crossPayRanks = [];
	}

	public parseTuangouMsg(msg: Message): void {
		this.tuangou_buyIds = [];
		this.tuangou_ZoneMoney = msg.getInt();
		this.tuangou_MeMoney = msg.getInt();
		let size: number = msg.getByte();
		for (let i: number = 0; i < size; i++) {
			let id: number = msg.getByte();
			if (this.tuangou_buyIds.indexOf(id) < 0) {
				this.tuangou_buyIds.push(id);
			}
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}

	public parseCrossServerPayRankMsg(msg: Message): void {
		this.crossPayRanks = [];
		this.crossPayMyRank = 0;
		this.crossPayRankMoney = 0;
		let size: number = msg.getByte();
		for (let i: number = 0; i < size; i++) {
			let data: CrossServerPayRank = new CrossServerPayRank();
			data.parseMsg(msg);
			this.crossPayRanks.push(data);
			if (data.playerId == DataManager.getInstance().playerManager.player.id) {
				this.crossPayMyRank = data.rank;
			}
		}
		this.crossPayRankMoney = msg.getInt();
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	//众筹红点
	public oncheckTuangouRpoint(): boolean {
		// let tuangouhuodong = JsonModelManager.instance.getModeltuangouhuodong();
		// for (let id in tuangouhuodong) {
		// 	let model: Modeltuangouhuodong = tuangouhuodong[id];
		// 	if (this.tuangou_MeMoney >= model.privatePay && this.tuangou_ZoneMoney >= model.severPay && this.tuangou_buyIds.indexOf(model.id) < 0) {
		// 		return true;
		// 	}
		// }
		return false;
	}
	//The end
}
class CrossServerPayRank {
	public rank: number;
	public playerId: number;
	public playerName: string;
	public viplevel: number;
	public payNum: number;

	public parseMsg(msg: Message): void {
		this.rank = msg.getByte();
		this.playerId = msg.getInt();
		this.playerName = msg.getString();
		this.viplevel = msg.getByte();
		this.payNum = msg.getInt();
	}
}