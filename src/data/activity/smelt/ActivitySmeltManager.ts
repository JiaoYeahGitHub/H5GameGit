class ActivitySmeltManager {
	public static wutanCount: number = 5;
	public smeltIds = {};
	public smeltNums = {};
	public constructor() {
	}
	public parseInit(msg: Message): void {
		let size = msg.getByte();
		this.smeltNums = {};
		for (let i: number = 0; i < size; i++) {
			let rewardedId = msg.getString();
			this.smeltNums[rewardedId] = msg.getByte();
			if (this.smeltNums[rewardedId] > 0) {
				let str = msg.getString();
				this.smeltIds[rewardedId] = str;
			}
		}
	}
	public parseUpdateMsg(msg: Message): void {
		let smeltType: number = msg.getByte();
		if (smeltType == 99) {
			this.parseInit(msg);
		} else {
			GameCommon.getInstance().addAlert('兑换成功');
		}
		GameCommon.getInstance().receiveMsgToClient(msg);
	}
	private getSmeltPoint(tp: number = 5, idx: number = 5): boolean {
		var models = JsonModelManager.instance.getModelkaifuduihuan();
		for (let k in models) {
			if (tp == models[k].type || tp == 5) {
				if (idx == 5) {
					var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(models[k].firstRewards);
					var _hasitemNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(awards[0].id);
					if (_hasitemNum > 0)
						return true;

					var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(models[k].otherRewards);
					var _hasitemNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(awards[0].id);
					if (_hasitemNum > 0)
						return true;
				}
				else if (idx == 1) {
					var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(models[k].otherRewards);
					var _hasitemNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(awards[0].id);
					if (_hasitemNum > 0)
						return true;
				}
				else {
					var awards: AwardItem[] = GameCommon.getInstance().onParseAwardItemstr(models[k].firstRewards);
					var _hasitemNum: number = DataManager.getInstance().bagManager.getGoodsThingNumById(awards[0].id);
					if (_hasitemNum > 0)
						return true;
				}
			}
		}
		return false;
	}
}
class ActSmeltData {
	public tp: number;
	public model: Modelkaifuduihuan;
	public parseMsg(msg: Message): void {
		this.tp = msg.getByte();
	}
}