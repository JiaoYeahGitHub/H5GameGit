
class TimeGoodsManager {

	public timeGoodsList: Array<TimeGoods>;

	public constructor() {
		this.timeGoodsList = new Array<TimeGoods>();
		Tool.addTimer(this.onCountDown, this);
	}

	public parseTimeGoodsList(message: Message) {
		this.timeGoodsList = new Array<TimeGoods>();
		var size: number = message.getShort();
		for (var i = 0; i < size; ++i) {
			var goods: TimeGoods = new TimeGoods();
			goods.parseMessage(message);
			this.timeGoodsList.push(goods);
		}
	}

	public parseTimeGoods(message: Message) {
		var goods: TimeGoods = new TimeGoods();
		goods.parseMessage(message);
		for (var i = 0; i < this.timeGoodsList.length; ++i) {
			if (this.timeGoodsList[i].id == goods.id && this.timeGoodsList[i].type == goods.type) {
				this.timeGoodsList[i].time = goods.time;
				this.timeGoodsList[i].timestamp = goods.timestamp;
				return;
			}
		}
		this.timeGoodsList.push(goods);
	}

	private onCountDown() {
		var currentTime: number = egret.getTimer();
		for (var i = 0; i < this.timeGoodsList.length; ++i) {
			var goods: TimeGoods = this.timeGoodsList[i];
			if (goods.countDown(currentTime)) {
				this.timeGoodsList.splice(i, 1);
				DataManager.getInstance().bagManager.removeBag(goods.type, goods.id, 0);
				goods = null;
			}
		}
	}

	public getTimeGoods(type: number, id: number): TimeGoods {
		for (var i = 0; i < this.timeGoodsList.length; ++i) {
			var goods: TimeGoods = this.timeGoodsList[i];
			if (goods.type == type && goods.id == id) {
				return goods;
			}
		}
		return null;
	}
}

class TimeGoods {
	public type: number;
	public id: number;
	public time: number;
	public timestamp: number;
	public timeStr: string;

	public parseMessage(message: Message) {
		this.type = message.getByte();
		this.id = message.getShort();
		this.time = message.getInt();
		this.timestamp = egret.getTimer();
	}

	public countDown(currentTime: number): boolean {
		if (currentTime - this.timestamp > this.time) {
			return true;
		} else {
			this.timeStr = Tool.getTimeStr(Tool.toInt(this.time - (currentTime - this.timestamp)) / 1000);
			return false;
		}
	}
}