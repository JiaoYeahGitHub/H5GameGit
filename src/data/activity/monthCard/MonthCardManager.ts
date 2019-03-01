class MonthCardManager {
	public card = {};
	public constructor() {
		// var base: cardData = new cardData();
		// base.id = 1;
		// base.time = 1000;
		// base.isCanReceive = true;
		// this.card[base.id] = base;
	}
	public parseMessage(msg: Message) {
		var base: cardData;
		var len: number = msg.getByte();
		for (var i: number = 0; i < len; i++) {
			base = new cardData();
			base.parseMessage(msg);
			this.card[base.id] = base;
		}
	}
	public parseReceiveMessage(msg: Message) {
		var id: number = msg.getByte();
		var base: cardData = this.card[id];
	}
	public static getTeQuan(card:number,type:number):number{
		var yueKa:Modelyueka=JsonModelManager.instance.getModelyueka()[card];
		var tequanStr=yueKa.tequan;
		var tequanArray=tequanStr.split("#");
		for(var i=0;i<tequanArray.length;i++){
			if(type==parseInt(tequanArray[i].split(",")[0])){
				return parseInt(tequanArray[i].split(",")[1]);
			}
		}	
		return 0;
	}
}
class cardData {
	public id;
	public param;
	public currTime;
	public parseMessage(msg: Message) {
		this.id = msg.getByte();
		this.param = msg.getInt();
		this.reSetTime();
	}
	public reSetTime() {
		this.currTime = egret.getTimer();
	}
	public get day() {
		var sec = this.param - Tool.toInt((egret.getTimer() - this.currTime) / 1000);
		var day: number = Math.ceil(sec / 86400);
		return day;
	}

}
enum TEQUAN_TYPE {
	SIXIANG = 9,//
	ZHUFU = 10,//
}

enum CARD_TYPE {
	MONTH = 1,//超值月卡
	LIFELONG = 2,//至尊月卡
}