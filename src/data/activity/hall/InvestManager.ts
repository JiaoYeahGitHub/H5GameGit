class InvestManager {

	public isBuy: boolean = false;
	public day: number;
	public record = [];
	public fundReward:number[]=[];
	public fundBuy:boolean=false;
	public constructor() {
	}
	public parseMessage(msg: Message) {
		this.isBuy = msg.getByte() == 1;
		if (this.isBuy) {
			this.day = msg.getByte();
			var len: number = msg.getByte();
			this.record = [];
			for (var i: number = 0; i < len; i++) {
				this.record.push(msg.getByte());
			}
		}
	}
	public parseBuyMessage(msg: Message) {
		this.isBuy = msg.getByte() == 1;
		if (this.isBuy) {
			this.day = 1;
		}
	}
	public parseObtainMessage(msg: Message) {
		this.fundBuy=msg.getBoolean();
		this.fundReward=[];
		var size: number = msg.getByte();
		this.fundReward=[];
		for (var i = 0; i<size; i++) {
			this.fundReward.push(msg.getByte());
		}
	}

	public isFundOver():boolean{
		for (var i = 0; i<this.fundReward.length; i++) {
			if(this.fundReward[i]==0)
				return false;
		}
		return true;
	}

	public getCanObtainAward() {
		var data = DataManager.getInstance().investManager;
		if (!data.isBuy) return false;
		var min = Math.min(7, data.day);
		for (var i: number = min; i >= 1; i--) {
			var index: number = data.record.indexOf(i);
			if (index == -1) {
				return true;
			}
		}
		return false;
	}
	public getCanObtainAwardByDay(day: number) {
		var data = DataManager.getInstance().investManager;
		if (!data.isBuy) return false;
		var min = Math.min(7, data.day);
		if (day > min) return false;
		if (data.record.indexOf(day) == -1) return true;
		return false;
	}
}