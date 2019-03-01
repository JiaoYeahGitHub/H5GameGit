class RechargeManager {
	public record = {};
	public curDayRecord ={};
	public firstCharge: number = 0;
	public constructor() {
	}
	public parseMessage(msg: Message) {
		var len: number = msg.getByte();
		var key: number;
		var value: number;
		var curDayValue :number;
		for (var i: number = 0; i < len; i++) {
			key = msg.getInt();
			value = msg.getInt();
			curDayValue = msg.getInt();
			this.record[key] = value;
			this.curDayRecord[key] = curDayValue;
		}
		this.firstCharge = msg.getInt();
	}

	public checkFirstRecharge(money: number) {
		if (this.record[money]) {
			if (money == this.firstCharge && this.record[money] == 1) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	public checkVipDayRecharge(money: number) {
		if (this.curDayRecord[money]||this.curDayRecord[money]==0) {
			var vipCfg:Modelvip = JsonModelManager.instance.getModelvip()[DataManager.getInstance().playerManager.player.viplevel-1]
			var awardStrAry = vipCfg.doubleEveryday.split("#");
			for (var i: number = 0; i < awardStrAry.length; i++) {
				var awardstrItem: string[] = awardStrAry[i].split(",");
				if(Number(awardstrItem[0]) == money)
				{
					if(Number(awardstrItem[1])>this.curDayRecord[money])
					{
						return true;
					}
				}
			}
			return false;
		} else {
			return false;
		}
	}
	public oneRecharge(): boolean {
		return !this.record[1];
	}
}